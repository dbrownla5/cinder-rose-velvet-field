import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  analyzeImage,
  buildListingTemplate,
  evaluatePrice,
  runSecondPass,
  runWorkArea,
} from "./ai";
import { listCatalog, mintIntakeCodes, mintLotCode, upsertCatalog } from "./catalog";
import type { PlateWrite } from "./catalog";
import { prettyCatalogName } from "./catalog-code";
import { cameraLabel, extractImageMeta } from "./exif";
import { contentHashFromImage, exifAccuracy, markDupes } from "./dupes";
import {
  collectionFor,
  editPlanFor,
  formatClientName,
  groupKeyFor,
  groupLabelFor,
  laneForLedger,
  parseClientName,
  prettyLotName,
  uniqueById,
} from "./grouping";
import { deleteBlob, getBlob, putBlob } from "./idb";
import {
  compressForApi,
  enhancePlate,
  loadImage,
  makeThumb,
  prepImageFile,
} from "./image-utils";
import { analyzeLowLevel } from "./low-level";
import { SAMPLES, sampleToItem } from "./samples";
import { conditionLabel, money } from "./taxonomy";
import type {
  CatalogItem,
  CollectionId,
  DupeRecord,
  EditRecipe,
  HandshakeDecision,
  HandshakeRound,
  IntakeBatch,
  LaneId,
  LedgerId,
  LogEvent,
  LotGroup,
  PriceEval,
  RailMode,
  StudioView,
  WorkAreaId,
} from "./types";

export type IntakeOpts = {
  clientFirst?: string | null;
  clientLast?: string | null;
  ledger?: LedgerId;
  lane?: LaneId;
  labeled?: boolean;
};

type StudioState = {
  hydrated: boolean;
  seeded: boolean;
  items: CatalogItem[];
  batches: IntakeBatch[];
  groups: LotGroup[];
  log: LogEvent[];
  selectedId: string | null;
  view: StudioView;
  collection: CollectionId | "all";
  ledgerFilter: LedgerId | "all";
  laneFilter: LaneId | "all";
  query: string;
  lastClientId: string;
  lastClientFirst: string;
  lastClientLast: string;
  lastLedger: LedgerId;
  lastLane: LaneId;
  railMode: RailMode;
  hydrate: () => Promise<void>;
  select: (id: string) => void;
  setView: (view: StudioView) => void;
  setRailMode: (mode: RailMode) => void;
  setCollection: (c: CollectionId | "all") => void;
  setLedgerFilter: (l: LedgerId | "all") => void;
  setLaneFilter: (l: LaneId | "all") => void;
  setQuery: (q: string) => void;
  setLastIntake: (first: string, last: string, ledger: LedgerId, lane?: LaneId) => void;
  addFiles: (files: File[], opts?: IntakeOpts) => Promise<void>;
  remove: (id: string) => Promise<void>;
  promoteKeeper: (id: string) => void;
  recategorize: (id: string, collectionId: CollectionId) => void;
  setItemLedger: (id: string, ledger: LedgerId) => void;
  setItemLane: (id: string, lane: LaneId) => void;
  setItemClient: (id: string, first: string | null, last: string | null) => void;
  analyze: (id: string) => Promise<void>;
  runWorkflow: (id: string, workArea: WorkAreaId) => Promise<void>;
  queueForEdit: (ids: string[], recipe: EditRecipe) => void;
  dequeueEdit: (ids: string[]) => void;
  runQueuedEdits: (recipe: EditRecipe) => Promise<void>;
  recatalogEdited: (ids: string[]) => void;
  rejectEdited: (ids: string[]) => void;
  passToValuation: (groupIds: string[]) => Promise<void>;
  priceGroup: (groupId: string) => Promise<void>;
  adjustPrice: (groupId: string, userList: number) => void;
  sendToClient: (groupId: string) => void;
  recordClientBack: (
    groupId: string,
    decision: HandshakeDecision,
    opts?: { listPrice?: number; note?: string },
  ) => Promise<void>;
  approveGroup: (groupId: string) => Promise<void>;
  holdGroup: (groupId: string) => void;
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function persistable(items: CatalogItem[]): CatalogItem[] {
  return items.map((item) => ({
    ...item,
    objectUrl: undefined,
    analyzing: false,
    runningWorkflow: false,
    editing: false,
    analysisError: undefined,
  }));
}

function persistGroups(groups: LotGroup[]): LotGroup[] {
  return groups.map((g) => ({ ...g, pricing: false, templating: false }));
}

function plateWrite(item: CatalogItem): PlateWrite {
  const m = item.meta;
  return {
    id: item.id,
    lot_id: item.groupId ?? item.id,
    intake_code: item.intakeCode ?? item.id,
    role: item.garment?.photoRole ?? null,
    lane: item.lane,
    bytes: item.bytes,
    width: item.width,
    height: item.height,
    edit_status: item.edit?.status ?? "none",
    taken_at: m?.takenAt ?? null,
    camera: cameraLabel(m),
    iso: m?.iso ?? null,
    focal_mm: m?.focalMm != null ? Math.round(m.focalMm) : null,
    has_gps: m?.hasGps ?? false,
    hash_sha256: m?.hashSha256 ?? null,
    content_hash: m?.contentHash || null,
    dupe_of: item.dupe?.status === "extra" ? item.dupe.ofId : null,
    dupe_kind: item.dupe?.kind ?? null,
    exif_score: item.meta ? exifAccuracy(item.meta, item) : null,
    aperture: m?.aperture ?? null,
    shutter: m?.shutter ?? null,
  };
}

const seedItems = SAMPLES.map((sample) =>
  sampleToItem(sample, { thumbDataUrl: sample.src }),
);

export function buildClientPacket(group: LotGroup, price: PriceEval): string {
  const r = price.report;
  const ask = price.userList ?? price.listSuggested;
  const round = (group.handshake?.round ?? 0) + 1;
  const who = group.clientId ?? "Client";
  const top = r.market.topOfMarket ?? price.listHigh;
  const faster = r.market.fasterSell ?? price.listLow;
  const features = r.noticeableFeatures.length
    ? `Features as seen: ${r.noticeableFeatures.join(", ")}.`
    : null;
  const auth =
    r.authenticity.status === "not-required"
      ? null
      : `Authenticity: ${r.authenticity.status}. ${r.authenticity.note}`.trim();
  return [
    `${who} — round ${round}`,
    group.prettyName,
    "",
    `Condition as observed: ${conditionLabel(r.condition)}.`,
    `Ask: ${money(ask)} on ${price.channel}.`,
    `Top of market ~${money(top)} · faster sell ~${money(faster)}.`,
    `Brand: ${r.brand ?? "none visible"}. Not verified.`,
    features,
    auth,
    r.market.notes || null,
    "",
    "This is an estimated listing range, not an appraisal.",
    "Send back: approve, a different ask, or hold.",
    "Listing is not live until the handshake closes.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function seedLog(): LogEvent[] {
  const coat = seedItems.find((i) => i.id === "sample-coat");
  const watch = seedItems.find((i) => i.id === "sample-watch");
  const living = seedItems.find((i) => i.id === "sample-living-room");
  const t = coat?.createdAt ?? Date.now();
  return [
    {
      id: "log-intake-maya",
      at: t - 3600_000,
      actor: "user",
      type: "intake",
      ledger: "business",
      message: "Maya Chen drop — 2 plates filed, sorted by item then client",
      clientId: "Maya Chen",
      batchId: "batch-maya",
      itemIds: [coat?.id, watch?.id].filter(Boolean) as string[],
    },
    {
      id: "log-prep-maya",
      at: t - 3400_000,
      actor: "system",
      type: "prep",
      ledger: "business",
      message: "Plates sized and rotated upright — ready for selection",
      clientId: "Maya Chen",
      batchId: "batch-maya",
    },
    {
      id: "log-classify-coat",
      at: t - 3300_000,
      actor: "system",
      type: "classify",
      ledger: "business",
      message: "Unbranded wool coat charcoal · Maya Chen · excellent · waiting on pass-through",
      clientId: "Maya Chen",
      groupId: "group-coat",
      itemIds: coat ? [coat.id] : [],
    },
    {
      id: "log-pass-watch",
      at: t - 3100_000,
      actor: "user",
      type: "select-pass",
      ledger: "business",
      message: "Passed matte black watch to valuation",
      clientId: "Maya Chen",
      groupId: "group-watch",
    },
    {
      id: "log-val-watch",
      at: t - 2800_000,
      actor: "system",
      type: "valuation",
      ledger: "business",
      message: "Watch valuation paused · top of market $280 · faster $160 — not an appraisal",
      clientId: "Maya Chen",
      groupId: "group-watch",
    },
    {
      id: "log-auth-watch",
      at: t - 2700_000,
      actor: "system",
      type: "auth-pass",
      ledger: "business",
      message: "High-end second pass: no house mark readable — authenticity unverified",
      clientId: "Maya Chen",
      groupId: "group-watch",
    },
    {
      id: "log-pause-watch",
      at: t - 2650_000,
      actor: "system",
      type: "price-pause",
      ledger: "business",
      message: "Watch round ready to send to Maya Chen — listing not ready yet",
      clientId: "Maya Chen",
      groupId: "group-watch",
    },
    {
      id: "log-personal",
      at: living?.createdAt ?? t,
      actor: "system",
      type: "intake",
      ledger: "personal",
      message: "Personal roll catch-up — rooms, objects, field notes filed off the resale queue",
      itemIds: seedItems.filter((i) => i.lane === "log").map((i) => i.id),
    },
    {
      id: "log-social-coffee",
      at: t - 2400_000,
      actor: "user",
      type: "intake",
      ledger: "personal",
      message: "Social pile — pour-over still life waiting on a minimal edit task",
      itemIds: seedItems.filter((i) => i.lane === "social").map((i) => i.id),
    },
    {
      id: "log-edit-coat-need",
      at: t - 2200_000,
      actor: "system",
      type: "edit-queue",
      ledger: "business",
      message: "Coat is on-body street — sell backlog, not ready to post until the resell edit batch",
      clientId: "Maya Chen",
      groupId: "group-coat",
      itemIds: coat ? [coat.id] : [],
    },
  ];
}

function seedBatches(): IntakeBatch[] {
  const coat = seedItems.find((i) => i.id === "sample-coat");
  const watch = seedItems.find((i) => i.id === "sample-watch");
  return [
    {
      id: "batch-maya",
      label: "Maya Chen intake",
      clientId: "Maya Chen",
      clientFirst: "Maya",
      clientLast: "Chen",
      ledger: "business",
      lane: "resell",
      createdAt: coat?.createdAt ?? Date.now(),
      itemIds: [coat?.id, watch?.id].filter(Boolean) as string[],
      status: "ready",
    },
  ];
}

function seedGroups(): LotGroup[] {
  const coat = seedItems.find((i) => i.id === "sample-coat");
  const watch = seedItems.find((i) => i.id === "sample-watch");
  const draftedAt = (watch?.createdAt ?? Date.now()) - 2800_000;
  return [
    {
      id: "group-coat",
      batchId: "batch-maya",
      key: "unbranded::wool-coat::charcoal::maya-chen",
      label: "Unbranded wool coat charcoal · Maya Chen",
      prettyName: "Unbranded wool coat charcoal · Maya Chen",
      clientId: "Maya Chen",
      clientFirst: "Maya",
      clientLast: "Chen",
      ledger: "business",
      itemIds: coat ? [coat.id] : [],
      catalogCode: "UNB-COAT-CHAR-0001",
      status: "ready",
    },
    {
      id: "group-watch",
      batchId: "batch-maya",
      key: "unbranded::watch::matte-black::maya-chen",
      label: "Unbranded watch matte black · Maya Chen",
      prettyName: "Unbranded watch matte black · Maya Chen",
      clientId: "Maya Chen",
      clientFirst: "Maya",
      clientLast: "Chen",
      ledger: "business",
      itemIds: watch ? [watch.id] : [],
      catalogCode: "UNB-WATCH-MABL-0001",
      status: "paused",
      price: {
        listLow: 160,
        listHigh: 280,
        listSuggested: 220,
        userList: null,
        currency: "USD",
        channel: "ebay",
        compsNote:
          "Unbranded matte-black analog watch on slate, studio packshot. Estimated sold band for similar unbranded fashion watches in like-new condition. Not an appraisal.",
        confidence: 0.58,
        flags: ["no-brand-visible", "needs-measurements", "high-end-second-pass"],
        status: "paused",
        draftedAt,
        report: {
          brand: null,
          size: null,
          yearMade: null,
          yearBasis: "unknown",
          condition: "like-new",
          noticeableFeatures: [
            "Matte black case",
            "Dark leather strap",
            "Analog dial, no house mark in frame",
          ],
          vintage30: false,
          vintageNote: null,
          designerVerifiable: "unverified",
          uniqueOrRare: false,
          uniqueNote: null,
          highEnd: true,
          market: {
            soldHigh: 280,
            soldLow: 150,
            daysToSell: 21,
            topOfMarket: 280,
            fasterSell: 165,
            channels: ["ebay", "grailed"],
            notes:
              "Estimate only. Clean packshot helps; missing case-back and lug width will slow a sale.",
          },
          authenticity: {
            status: "unverified",
            tells: [
              "No readable house mark on the dial",
              "Case-back not photographed",
              "Movement not visible",
            ],
            note: "Second pass: cannot verify a designer house from this plate. Do not list as a named brand.",
            ranAt: draftedAt,
          },
          deeper: { ran: false, findings: "" },
        },
      },
    },
  ];
}

function appendLog(
  log: LogEvent[],
  partial: Omit<LogEvent, "id" | "at"> & { at?: number },
): LogEvent[] {
  return [
    {
      id: uid("log"),
      at: partial.at ?? Date.now(),
      ...partial,
    },
    ...log,
  ].slice(0, 400);
}

function handshakeStatus(h?: HandshakeRound): LotGroup["status"] | null {
  if (!h) return null;
  if (h.waiting) return "sent";
  if (h.reply?.decision === "decline") return "hold";
  if (h.reply?.decision === "approve") return "client-back";
  return null;
}

function rebuildGroups(items: CatalogItem[], existing: LotGroup[]): LotGroup[] {
  const buckets = new Map<string, CatalogItem[]>();
  for (const item of items) {
    if (!item.garment?.isGarment) continue;
    const key = groupKeyFor(item);
    const list = buckets.get(key) ?? [];
    list.push(item);
    buckets.set(key, list);
  }
  const next: LotGroup[] = [];
  const used = new Set<string>();
  for (const [key, members] of buckets) {
    const prior = existing.find(
      (g) => g.key === key || members.some((m) => g.itemIds.includes(m.id)),
    );
    const id = prior?.id ?? uid("grp");
    used.add(id);
    const ledger: LedgerId = members.every((m) => m.ledger === "personal")
      ? "personal"
      : "business";
    let status = prior?.status ?? "sorting";
    const allClassed = members.every((m) => m.highLevel && m.prepped);
    const fromHandshake = handshakeStatus(prior?.handshake);
    if (ledger === "personal") status = prior?.status === "approved" ? prior.status : "ready";
    else if (fromHandshake) status = fromHandshake;
    else if (prior?.price?.status === "paused") status = "paused";
    else if (prior?.price?.status === "sent") status = "sent";
    else if (prior?.price?.status === "approved") status = prior.status === "client-back" ? "client-back" : "approved";
    else if (prior?.price?.status === "hold") status = "hold";
    else if (prior?.status === "pricing") status = "pricing";
    else if (allClassed && !prior?.price) status = "ready";
    const pretty = prettyLotName(members[0]?.garment, members[0]?.clientId);
    next.push({
      ...(prior ?? { batchId: members[0]?.batchId ?? null }),
      id,
      batchId: members[0]?.batchId ?? prior?.batchId ?? null,
      key,
      label: groupLabelFor(members),
      prettyName: pretty,
      clientId: members[0]?.clientId ?? prior?.clientId ?? null,
      clientFirst: members[0]?.clientFirst ?? prior?.clientFirst ?? null,
      clientLast: members[0]?.clientLast ?? prior?.clientLast ?? null,
      ledger,
      itemIds: members.map((m) => m.id),
      catalogCode: prior?.catalogCode ?? members.find((m) => m.catalogCode)?.catalogCode,
      status,
      price: prior?.price,
      template: prior?.template,
      handshake: prior?.handshake,
    });
  }
  for (const g of existing) {
    if (!used.has(g.id) && (g.price || g.template || g.handshake)) next.push(g);
  }
  return next;
}

function patchItemsGroupIds(items: CatalogItem[], groups: LotGroup[]): CatalogItem[] {
  const map = new Map<string, string>();
  for (const g of groups) for (const id of g.itemIds) map.set(id, g.id);
  return items.map((i) => ({ ...i, groupId: map.get(i.id) ?? i.groupId ?? null }));
}

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      hydrated: true,
      seeded: true,
      items: uniqueById(seedItems),
      batches: seedBatches(),
      groups: seedGroups(),
      log: seedLog(),
      selectedId: seedItems.find((i) => i.id === "sample-coat")?.id ?? seedItems[0]?.id ?? null,
      view: "rail",
      collection: "all",
      ledgerFilter: "all",
      laneFilter: "all",
      query: "",
      lastClientId: "Maya Chen",
      lastClientFirst: "Maya",
      lastClientLast: "Chen",
      lastLedger: "business",
      lastLane: "resell",
      railMode: "sheet",

      hydrate: async () => {
        const existing = get().items;
        if (existing.length === 0 && !get().seeded) {
          set({
            items: uniqueById(seedItems),
            batches: seedBatches(),
            groups: seedGroups(),
            log: seedLog(),
            selectedId: seedItems[0]?.id ?? null,
            hydrated: true,
            seeded: true,
          });
        } else {
          const next: CatalogItem[] = [];
          for (const item of existing) {
            if (item.isSample && item.sampleSrc) {
              next.push({ ...item, analyzing: false, runningWorkflow: false });
              continue;
            }
            try {
              const blob = await getBlob(item.id);
              if (blob) {
                next.push({
                  ...item,
                  objectUrl: URL.createObjectURL(blob),
                  analyzing: false,
                  runningWorkflow: false,
                });
              } else {
                next.push({ ...item, analyzing: false, runningWorkflow: false });
              }
            } catch {
              next.push({ ...item, analyzing: false, runningWorkflow: false });
            }
          }
          set({
            items: uniqueById(next),
            selectedId: get().selectedId ?? next[0]?.id ?? null,
            hydrated: true,
          });
        }

        for (const item of get().items) {
          if (!item.isSample || !item.sampleSrc) continue;
          try {
            const img = await loadImage(item.sampleSrc);
            const low = item.lowLevel ?? analyzeLowLevel(img);
            let meta = item.meta;
            if (!meta || !meta.contentHash) {
              const res = await fetch(item.sampleSrc);
              const blob = await res.blob();
              const file = new File([blob], `${item.id}.jpg`, { type: blob.type || "image/jpeg" });
              const extracted = meta ?? (await extractImageMeta(file));
              meta = { ...extracted, contentHash: contentHashFromImage(img) };
            }
            set((s) => ({
              items: s.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                      thumbDataUrl: i.thumbDataUrl?.startsWith("data:") ? i.thumbDataUrl : makeThumb(img),
                      lowLevel: low,
                      meta,
                      prepped: true,
                    }
                  : i,
              ),
            }));
          } catch {
            /* sample still usable via src */
          }
        }
        void listCatalog()
          .then(async () => {
            const ready = get().items.filter((i) => i.intakeCode);
            if (!ready.length) return;
            await upsertCatalog({
              data: { lots: [], plates: ready.map((a) => plateWrite(a)) },
            });
          })
          .catch(() => undefined);
      },

      select: (id) => set({ selectedId: id, view: "inspect" }),
      setView: (view) => set({ view }),
      setRailMode: (railMode) => set({ railMode, view: "rail" }),
      setCollection: (collection) => set({ collection }),
      setLedgerFilter: (ledgerFilter) => set({ ledgerFilter }),
      setLaneFilter: (laneFilter) => set({ laneFilter }),
      setQuery: (query) => set({ query }),
      setLastIntake: (first, last, ledger, lane) =>
        set({
          lastClientFirst: first,
          lastClientLast: last,
          lastClientId: formatClientName(first, last) ?? "",
          lastLedger: ledger,
          lastLane: lane ?? laneForLedger(ledger),
        }),

      addFiles: async (files, opts) => {
        const accepted = files.filter((f) => f.type.startsWith("image/"));
        if (!accepted.length) return;
        const lane = opts?.lane ?? get().lastLane;
        const ledger = opts?.ledger ?? (lane === "resell" ? "business" : "personal");
        const labeled = opts?.labeled === true;
        const first = labeled && lane === "resell" ? (opts?.clientFirst ?? "").trim() : "";
        const last = labeled && lane === "resell" ? (opts?.clientLast ?? "").trim() : "";
        const batchId = uid("batch");
        let minted: { intakeCode: string; inboxCode: string }[] = [];
        try {
          const pack = await mintIntakeCodes({ data: { count: accepted.length } });
          minted = pack.codes;
        } catch {
          minted = accepted.map((_, i) => ({
            intakeCode: `LB-LOCAL-${Date.now().toString(36)}-${i + 1}`,
            inboxCode: `INB-LOCAL-${Date.now().toString(36)}-${i + 1}`,
          }));
        }
        const added: CatalogItem[] = [];
        for (let idx = 0; idx < accepted.length; idx++) {
          const file = accepted[idx]!;
          const id = uid("img");
          const codes = minted[idx] ?? minted[0]!;
          try {
            const prepped = await prepImageFile(file);
            const meta = await extractImageMeta(file);
            await putBlob(id, prepped.blob);
            const img = await loadImage(prepped.dataUrl);
            const objectUrl = URL.createObjectURL(prepped.blob);
            const fromName = parseClientName(file.name);
            const clientFirst = fromName?.first ?? (first || null);
            const clientLast = fromName?.last ?? (last || null);
            const clientId = formatClientName(clientFirst, clientLast);
            added.push({
              id,
              name: codes.intakeCode,
              createdAt: Date.now(),
              collectionId: lane === "social" ? "social" : lane === "log" ? "personal" : "inbox",
              ledger,
              lane,
              clientId,
              clientFirst,
              clientLast,
              batchId,
              groupId: null,
              catalogCode: codes.inboxCode,
              intakeCode: codes.intakeCode,
              prepped: true,
              orientationApplied: prepped.orientation,
              tags: [],
              mime: file.type || "image/jpeg",
              bytes: prepped.blob.size,
              width: prepped.width,
              height: prepped.height,
              thumbDataUrl: makeThumb(img),
              objectUrl,
              lowLevel: analyzeLowLevel(img),
              meta: { ...meta, contentHash: contentHashFromImage(img) },
              workflows: [],
            });
          } catch (err) {
            console.error(err);
          }
        }
        if (!added.length) return;
        const marked = uniqueById(markDupes([...added, ...get().items]));
        const addedIds = new Set(added.map((a) => a.id));
        const markedAdded = marked.filter((i) => addedIds.has(i.id));
        const extras = markedAdded.filter((i) => i.dupe?.status === "extra");
        const keepers = markedAdded.filter((i) => i.dupe?.status === "keeper");
        const clientId =
          lane === "social" || lane === "log"
            ? null
            : (added[0]?.clientId ?? formatClientName(first, last));
        const batch: IntakeBatch = {
          id: batchId,
          label:
            lane === "social"
              ? "Social dump"
              : clientId
                ? `${clientId} intake`
                : `Dump ${added.length}`,
          clientId,
          clientFirst: clientId ? (added[0]?.clientFirst ?? null) : null,
          clientLast: clientId ? (added[0]?.clientLast ?? null) : null,
          ledger,
          lane,
          createdAt: Date.now(),
          itemIds: added.map((a) => a.id),
          status: "sorting",
        };
        set((s) => ({
          items: marked,
          batches: [batch, ...s.batches],
          selectedId: (keepers[0] ?? markedAdded[0])!.id,
          view: "rail",
          railMode: "sheet",
          collection: "all",
          seeded: true,
          lastLedger: ledger,
          lastLane: lane,
          log: appendLog(
            appendLog(
              appendLog(s.log, {
                actor: "user",
                type: "intake",
                ledger,
                message: `Dump ${added.length} photo${added.length === 1 ? "" : "s"} · ${lane} · no label required`,
                clientId,
                batchId,
                itemIds: added.map((a) => a.id),
              }),
              {
                actor: "system",
                type: "prep",
                ledger,
                message: `${added.length} plate${added.length === 1 ? "" : "s"} sized, rotated, and given intake codes`,
                clientId,
                batchId,
              },
            ),
            {
              actor: "system",
              type: extras.length ? "dupe" : "meta-extract",
              ledger,
              message: extras.length
                ? `${keepers.length} keeper${keepers.length === 1 ? "" : "s"} on richest EXIF · ${extras.length} extra${extras.length === 1 ? "" : "s"} filed (hash + content, not deleted)`
                : `${added.length} plate${added.length === 1 ? "" : "s"} hashed and EXIF-read · no dupes · GPS coords never stored`,
              clientId,
              batchId,
              itemIds: extras.length ? extras.map((e) => e.id) : added.map((a) => a.id),
            },
          ),
        }));
        try {
          await upsertCatalog({
            data: {
              lots: markedAdded.map((a) => ({
                id: a.id,
                catalog_code: a.catalogCode ?? a.intakeCode ?? a.id,
                pretty_name: a.intakeCode ?? a.name,
                brand: null,
                kind: null,
                style_name: null,
                colorway: null,
                condition: null,
                lane: a.lane,
                collection: a.collectionId,
                status: "intake",
                plate_count: 1,
              })),
              plates: markedAdded.map((a) => plateWrite(a)),
            },
          });
        } catch {
          /* local dump still stands */
        }
        for (const item of markedAdded) {
          if (item.dupe?.status === "extra") continue;
          void get().analyze(item.id);
        }
      },

      remove: async (id) => {
        const item = get().items.find((i) => i.id === id);
        if (item?.objectUrl) URL.revokeObjectURL(item.objectUrl);
        if (item && !item.isSample) await deleteBlob(id).catch(() => undefined);
        set((s) => {
          const items = s.items.filter((i) => i.id !== id);
          const groups = rebuildGroups(items, s.groups).map((g) => ({
            ...g,
            itemIds: g.itemIds.filter((x) => x !== id),
          }));
          return {
            items,
            groups,
            batches: s.batches.map((b) => ({
              ...b,
              itemIds: b.itemIds.filter((x) => x !== id),
            })),
            selectedId: s.selectedId === id ? (items[0]?.id ?? null) : s.selectedId,
            log: appendLog(s.log, {
              actor: "user",
              type: "delete",
              ledger: item?.ledger ?? "business",
              message: `Removed ${item?.name ?? "plate"} from the working catalog`,
              clientId: item?.clientId,
              itemIds: [id],
            }),
          };
        });
      },

      promoteKeeper: (id) => {
        set((s) => {
          const target = s.items.find((i) => i.id === id);
          if (!target) return s;
          const ofId = target.dupe?.ofId ?? target.id;
          const cluster = s.items.filter((i) => i.id === ofId || i.dupe?.ofId === ofId);
          if (cluster.length < 2) return s;
          const keeperScore = exifAccuracy(target.meta, target);
          const items = s.items.map((i) => {
            if (!cluster.some((c) => c.id === i.id)) return i;
            const extra = i.id !== target.id;
            const score = exifAccuracy(i.meta, i);
            const rec = {
              kind: (i.meta?.hashSha256 && i.meta.hashSha256 === target.meta?.hashSha256
                ? "hash"
                : "content") as DupeRecord["kind"],
              ofId: target.id,
              ofIntake: target.intakeCode,
              score,
              keeperScore,
              status: extra ? ("extra" as const) : ("keeper" as const),
              reason: extra
                ? `Operator picked ${target.intakeCode ?? target.id} as canonical`
                : `Canonical · operator override`,
            };
            return {
              ...i,
              dupe: rec,
              tags: extra
                ? [...i.tags.filter((t) => t !== "duplicate-keeper" && t !== "duplicate-extra"), "duplicate-extra"]
                : [...i.tags.filter((t) => t !== "duplicate-keeper" && t !== "duplicate-extra"), "duplicate-keeper"],
            };
          });
          return {
            items,
            selectedId: id,
            log: appendLog(s.log, {
              actor: "user",
              type: "dupe",
              ledger: target.ledger,
              message: `Promoted ${target.intakeCode ?? target.name} as canonical EXIF plate`,
              itemIds: cluster.map((c) => c.id),
            }),
          };
        });
      },

      recategorize: (id, collectionId) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, collectionId } : i)),
        })),

      setItemLedger: (id, ledger) => {
        set((s) => {
          const items = s.items.map((i) => {
            if (i.id !== id) return i;
            const lane = ledger === "personal" && i.lane === "resell" ? "log" : i.lane;
            return { ...i, ledger, lane, collectionId: collectionFor({ ...i, ledger, lane }) };
          });
          const groups = rebuildGroups(items, s.groups);
          const item = items.find((i) => i.id === id);
          return {
            items: patchItemsGroupIds(items, groups),
            groups,
            log: appendLog(s.log, {
              actor: "user",
              type: "move-ledger",
              ledger,
              message: `Moved ${item?.name ?? "plate"} to ${ledger} ledger`,
              clientId: item?.clientId,
              itemIds: [id],
            }),
          };
        });
      },

      setItemLane: (id, lane) => {
        set((s) => {
          const items = s.items.map((i) => {
            if (i.id !== id) return i;
            const ledger: LedgerId = lane === "resell" ? "business" : "personal";
            return {
              ...i,
              lane,
              ledger,
              collectionId: collectionFor({ ...i, lane, ledger }),
            };
          });
          const groups = rebuildGroups(items, s.groups);
          const item = items.find((i) => i.id === id);
          return {
            items: patchItemsGroupIds(items, groups),
            groups,
            lastLane: lane,
            log: appendLog(s.log, {
              actor: "user",
              type: "lane-move",
              ledger: item?.ledger ?? "business",
              message: `Moved ${item?.name ?? "plate"} to the ${lane} lane`,
              clientId: item?.clientId,
              itemIds: [id],
            }),
          };
        });
      },

      setItemClient: (id, first, last) => {
        const clientId = formatClientName(first, last);
        set((s) => {
          const items = s.items.map((i) =>
            i.id === id ? { ...i, clientId, clientFirst: first, clientLast: last } : i,
          );
          const groups = rebuildGroups(items, s.groups);
          const item = items.find((i) => i.id === id);
          return {
            items: patchItemsGroupIds(items, groups),
            groups,
            lastClientId: clientId ?? s.lastClientId,
            lastClientFirst: first ?? s.lastClientFirst,
            lastClientLast: last ?? s.lastClientLast,
            log: appendLog(s.log, {
              actor: "user",
              type: "assign-client",
              ledger: item?.ledger ?? "business",
              message: clientId
                ? `Assigned ${prettyLotName(item?.garment, clientId)}`
                : `Cleared client on ${item?.name ?? "plate"}`,
              clientId,
              itemIds: [id],
            }),
          };
        });
      },

      analyze: async (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, analyzing: true, analysisError: undefined } : i,
          ),
        }));
        try {
          const src = item.objectUrl ?? item.sampleSrc;
          if (!src) throw new Error("Image bytes missing");
          const img = await loadImage(src);
          const payload = compressForApi(img);
          const result = await analyzeImage({ data: { imageDataUrl: payload } });
          if (!result.ok) throw new Error(result.error);
          const hl = result.analysis;
          const garment = result.garment;
          set((s) => {
            const items = s.items.map((i) => {
              if (i.id !== id) return i;
              const lane = i.lane;
              const ledger =
                i.collectionId === "inbox"
                  ? lane === "resell"
                    ? "business"
                    : "personal"
                  : i.ledger;
              const catalogPretty = garment?.isGarment
                ? prettyCatalogName(
                    garment.brandVisible,
                    garment.styleName || garment.kind,
                    garment.colorway,
                  )
                : "";
              const pretty = garment?.isGarment
                ? i.clientId
                  ? `${catalogPretty} · ${i.clientId}`
                  : catalogPretty
                : prettyLotName(garment, i.clientId);
              return {
                ...i,
                analyzing: false,
                highLevel: hl,
                garment,
                name: pretty || hl.title || i.name,
                tags: hl.suggestedTags.length ? hl.suggestedTags : i.tags,
                category: hl.suggestedCategory,
                ledger,
                lane,
                collectionId:
                  i.collectionId === "inbox"
                    ? collectionFor({ ledger, lane, garment, highLevel: hl })
                    : i.collectionId,
              };
            });
            const groups = rebuildGroups(items, s.groups);
            const patched = patchItemsGroupIds(items, groups);
            const row = patched.find((i) => i.id === id);
            return {
              items: patched,
              groups,
              log: appendLog(s.log, {
                actor: "system",
                type: "classify",
                ledger: row?.ledger ?? "business",
                message: garment?.isGarment
                  ? `${prettyLotName(garment, row?.clientId)} · ${garment.condition} · ready for selection`
                  : `${hl.title} filed (not a garment)`,
                clientId: row?.clientId,
                itemIds: [id],
                groupId: row?.groupId ?? undefined,
              }),
            };
          });
          if (garment?.isGarment) {
            const row = get().items.find((i) => i.id === id);
            const needsSku = !row?.catalogCode || /^(INB-|LB-LOCAL)/.test(row.catalogCode);
            let catalogCode = row?.catalogCode;
            let prettyName = prettyCatalogName(
              garment.brandVisible,
              garment.styleName || garment.kind,
              garment.colorway,
            );
            if (needsSku) {
              try {
                const minted = await mintLotCode({
                  data: {
                    brand: garment.brandVisible,
                    kind: garment.kind,
                    colorway: garment.colorway,
                    style: garment.styleName,
                  },
                });
                catalogCode = minted.catalogCode;
                prettyName = minted.prettyName;
              } catch {
                /* keep inbox code */
              }
            }
            if (catalogCode) {
              set((s) => {
                const items = s.items.map((i) =>
                  i.id === id
                    ? {
                        ...i,
                        catalogCode,
                        name: i.clientId ? `${prettyName} · ${i.clientId}` : prettyName,
                      }
                    : i,
                );
                const groups = rebuildGroups(items, s.groups).map((g) =>
                  g.itemIds.includes(id) ? { ...g, catalogCode: catalogCode ?? g.catalogCode } : g,
                );
                return { items: patchItemsGroupIds(items, groups), groups };
              });
              const updated = get().items.find((i) => i.id === id);
              if (updated) {
                try {
                  const lotId = updated.groupId ?? updated.id;
                  await upsertCatalog({
                    data: {
                      lots: [
                        {
                          id: lotId,
                          catalog_code: catalogCode,
                          pretty_name: prettyName,
                          brand: garment.brandVisible || "Unbranded",
                          kind: garment.kind,
                          style_name: garment.styleName,
                          colorway: garment.colorway,
                          condition: garment.condition,
                          lane: updated.lane,
                          collection: updated.collectionId,
                          status: "ready",
                          plate_count: 1,
                        },
                      ],
                      plates: [plateWrite({ ...updated, catalogCode })],
                    },
                  });
                } catch {
                  /* sheet will retry on next list */
                }
              }
            }
          }
        } catch (err) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === id
                ? {
                    ...i,
                    analyzing: false,
                    analysisError: err instanceof Error ? err.message : "Analysis failed",
                  }
                : i,
            ),
          }));
        }
      },

      runWorkflow: async (id, workArea) => {
        const item = get().items.find((i) => i.id === id);
        if (!item?.highLevel) return;
        if (workArea === "resale") {
          const gid = item.groupId;
          set({ view: gid ? "rail" : "inspect" });
          return;
        }
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, runningWorkflow: true } : i)),
          view: "inspect",
        }));
        try {
          const src = item.objectUrl ?? item.sampleSrc;
          if (!src) throw new Error("Image bytes missing");
          const img = await loadImage(src);
          const ll = item.lowLevel;
          const lowLevelSummary = ll
            ? `aspect ${ll.aspectLabel}, ${ll.orientation}, brightness ${ll.brightness.toFixed(2)}, contrast ${ll.contrast.toFixed(2)}, saturation ${ll.saturation.toFixed(2)}, sharpness ${ll.sharpness.toFixed(2)}, temperature ${ll.temperature}, palette ${ll.palette.map((p) => p.hex).join(", ")}`
            : "none";
          const result = await runWorkArea({
            data: {
              imageDataUrl: compressForApi(img),
              workArea,
              highLevel: item.highLevel,
              lowLevelSummary,
            },
          });
          if (!result.ok) throw new Error(result.error);
          set((s) => ({
            items: s.items.map((i) =>
              i.id === id
                ? {
                    ...i,
                    runningWorkflow: false,
                    workflows: [
                      result.workflow,
                      ...i.workflows.filter((w) => w.workArea !== workArea),
                    ],
                  }
                : i,
            ),
          }));
        } catch (err) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === id
                ? {
                    ...i,
                    runningWorkflow: false,
                    analysisError: err instanceof Error ? err.message : "Workflow failed",
                  }
                : i,
            ),
          }));
        }
      },

      queueForEdit: (ids, recipe) => {
        const unique = [...new Set(ids)];
        if (!unique.length) return;
        set((s) => {
          const items = s.items.map((i) => {
            if (!unique.includes(i.id)) return i;
            const plan = editPlanFor({ ...i, lane: recipe === "social-minimal" ? "social" : "resell" });
            return {
              ...i,
              edit: {
                recipe,
                status: "queued" as const,
                program: "tbd" as const,
                queuedAt: Date.now(),
                bgRemoval: plan.bgRemoval,
                enhance: plan.enhance,
                notes: plan.notes,
                crops: plan.crops,
                previewUrl: i.edit?.previewUrl,
              },
            };
          });
          const first = items.find((i) => unique.includes(i.id));
          return {
            items,
            view: "edit",
            log: appendLog(s.log, {
              actor: "user",
              type: "edit-queue",
              ledger: first?.ledger ?? "business",
              message:
                recipe === "social-minimal"
                  ? `Threw ${unique.length} plate${unique.length === 1 ? "" : "s"} into the social minimal-edit task`
                  : `Queued ${unique.length} plate${unique.length === 1 ? "" : "s"} for the resell ready-to-post batch · program TBD`,
              clientId: first?.clientId,
              itemIds: unique,
            }),
          };
        });
      },

      dequeueEdit: (ids) => {
        const unique = [...new Set(ids)];
        if (!unique.length) return;
        set((s) => ({
          items: s.items.map((i) => {
            if (!unique.includes(i.id) || !i.edit) return i;
            if (i.edit.status !== "queued" && i.edit.status !== "processing") return i;
            return { ...i, editing: false, edit: { ...i.edit, status: "none" as const } };
          }),
        }));
      },

      runQueuedEdits: async (recipe) => {
        const queued = uniqueById(
          get().items.filter(
            (i) => i.edit?.recipe === recipe && (i.edit.status === "queued" || i.edit.status === "processing"),
          ),
        );
        if (!queued.length) return;
        for (const item of queued) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === item.id
                ? { ...i, editing: true, edit: i.edit ? { ...i.edit, status: "processing" } : i.edit }
                : i,
            ),
          }));
          try {
            const src = item.objectUrl ?? item.sampleSrc ?? item.thumbDataUrl;
            const img = await loadImage(src);
            const previewUrl = enhancePlate(img, recipe);
            const plan = editPlanFor(item);
            set((s) => ({
              items: s.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      editing: false,
                      edit: {
                        recipe,
                        status: "ready-to-post",
                        program: "preview-local",
                        queuedAt: i.edit?.queuedAt,
                        ranAt: Date.now(),
                        bgRemoval: plan.bgRemoval,
                        enhance: "preview-local",
                        previewUrl,
                        notes: plan.notes,
                        crops: plan.crops,
                      },
                    }
                  : i,
              ),
              log: appendLog(s.log, {
                actor: "system",
                type: "ready-to-post",
                ledger: item.ledger,
                message:
                  recipe === "social-minimal"
                    ? `${item.name} social-ready · minimal preview grade`
                    : `${item.name} ready-to-post preview · bg ${plan.bgRemoval} · program still TBD`,
                clientId: item.clientId,
                itemIds: [item.id],
                groupId: item.groupId ?? undefined,
              }),
            }));
          } catch (err) {
            set((s) => ({
              items: s.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      editing: false,
                      analysisError: err instanceof Error ? err.message : "Edit failed",
                      edit: i.edit ? { ...i.edit, status: "queued" } : i.edit,
                    }
                  : i,
              ),
            }));
          }
        }
      },

      recatalogEdited: (ids) => {
        const unique = [...new Set(ids)];
        set((s) => {
          const items = s.items.map((i) => {
            if (!unique.includes(i.id) || i.edit?.status !== "ready-to-post") return i;
            const tags = i.tags.includes("ready-to-post") ? i.tags : [...i.tags, "ready-to-post"];
            return {
              ...i,
              tags,
              edit: { ...i.edit, status: "recataloged" as const, recatalogedAt: Date.now() },
            };
          });
          const groups = rebuildGroups(items, s.groups);
          const first = items.find((i) => unique.includes(i.id));
          return {
            items: patchItemsGroupIds(items, groups),
            groups,
            view: first?.lane === "resell" ? "rail" : "edit",
            log: appendLog(s.log, {
              actor: "user",
              type: "recatalog",
              ledger: first?.ledger ?? "business",
              message:
                first?.lane === "resell"
                  ? `Recataloged ${unique.length} listing plate${unique.length === 1 ? "" : "s"} — valuation may run or refine`
                  : `Recataloged ${unique.length} social plate${unique.length === 1 ? "" : "s"} — not inventory`,
              clientId: first?.clientId,
              itemIds: unique,
            }),
          };
        });
      },

      rejectEdited: (ids) => {
        const unique = [...new Set(ids)];
        if (!unique.length) return;
        set((s) => {
          const items = s.items.map((i) => {
            if (!unique.includes(i.id) || i.edit?.status !== "ready-to-post") return i;
            const notes = i.edit.notes.includes("Rejected from ready-to-post")
              ? i.edit.notes
              : [...i.edit.notes, "Rejected from ready-to-post"];
            return {
              ...i,
              editing: false,
              edit: { ...i.edit, status: "queued" as const, notes, previewUrl: i.edit.previewUrl },
            };
          });
          const first = items.find((i) => unique.includes(i.id));
          return {
            items,
            log: appendLog(s.log, {
              actor: "user",
              type: "edit-queue",
              ledger: first?.ledger ?? "business",
              message: `Sent ${unique.length} plate${unique.length === 1 ? "" : "s"} back to the batch`,
              clientId: first?.clientId,
              itemIds: unique,
            }),
          };
        });
      },

      passToValuation: async (groupIds) => {
        const unique = [...new Set(groupIds)];
        if (!unique.length) return;
        set((s) => ({
          log: appendLog(s.log, {
            actor: "user",
            type: "select-pass",
            ledger: "business",
            message: `Passed ${unique.length} lot${unique.length === 1 ? "" : "s"} to valuation`,
            itemIds: unique.flatMap(
              (id) => s.groups.find((g) => g.id === id)?.itemIds ?? [],
            ),
          }),
          view: "approve",
        }));
        for (const id of unique) {
          await get().priceGroup(id);
        }
      },

      priceGroup: async (groupId) => {
        const group = get().groups.find((g) => g.id === groupId);
        if (!group || group.ledger !== "business") return;
        const members = get().items.filter((i) => group.itemIds.includes(i.id));
        const hero =
          members.find((m) => m.garment?.photoRole === "hero-front") ??
          members.find((m) => m.garment?.isGarment) ??
          members[0];
        if (!hero?.garment?.isGarment || !hero.highLevel) return;
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId ? { ...g, pricing: true, status: "pricing" } : g,
          ),
          view: "approve",
        }));
        try {
          const src = hero.objectUrl ?? hero.sampleSrc;
          if (!src) throw new Error("Image bytes missing");
          const img = await loadImage(src);
          const ll = hero.lowLevel;
          const lowLevelSummary = ll
            ? `aspect ${ll.aspectLabel}, sharpness ${ll.sharpness.toFixed(2)}, brightness ${ll.brightness.toFixed(2)}, temperature ${ll.temperature}`
            : "none";
          const result = await evaluatePrice({
            data: {
              imageDataUrl: compressForApi(img),
              garment: hero.garment,
              highLevel: hero.highLevel,
              lowLevelSummary,
              photoCount: members.length,
              roles: members.map((m) => m.garment?.photoRole ?? "other"),
            },
          });
          if (!result.ok) throw new Error(result.error);
          let price = result.price;
          const payload = compressForApi(img);
          if (price.report.uniqueOrRare || price.report.vintage30) {
            const deep = await runSecondPass({
              data: {
                imageDataUrl: payload,
                kind: "deeper",
                garment: hero.garment,
                report: price.report,
                highLevel: hero.highLevel,
              },
            });
            if (deep.ok && deep.deeper) {
              price = { ...price, report: { ...price.report, deeper: deep.deeper } };
            }
          }
          if (
            price.report.highEnd ||
            price.report.designerVerifiable === "needs-second-pass" ||
            price.report.designerVerifiable === "label-present"
          ) {
            const auth = await runSecondPass({
              data: {
                imageDataUrl: payload,
                kind: "authenticity",
                garment: hero.garment,
                report: price.report,
                highLevel: hero.highLevel,
              },
            });
            if (auth.ok && auth.authenticity) {
              price = {
                ...price,
                report: { ...price.report, authenticity: auth.authenticity },
              };
            }
          }
          set((s) => ({
            groups: s.groups.map((g) =>
              g.id === groupId
                ? { ...g, pricing: false, status: "paused", price, template: undefined }
                : g,
            ),
            log: appendLog(
              appendLog(
                appendLog(s.log, {
                  actor: "system",
                  type: "valuation",
                  ledger: "business",
                  message: `${group.prettyName} valuation · top ${price.report.market.topOfMarket ?? price.listHigh} · faster ${price.report.market.fasterSell ?? price.listLow}`,
                  clientId: group.clientId,
                  groupId,
                }),
                {
                  actor: "system",
                  type: "price-pause",
                  ledger: "business",
                  message: `${group.prettyName} paused — send this round to ${group.clientId ?? "the client"}`,
                  clientId: group.clientId,
                  groupId,
                },
              ),
              price.report.authenticity.status !== "not-required"
                ? {
                    actor: "system",
                    type: "auth-pass",
                    ledger: "business",
                    message: `${group.prettyName} authenticity ${price.report.authenticity.status}`,
                    clientId: group.clientId,
                    groupId,
                  }
                : price.report.deeper.ran
                  ? {
                      actor: "system",
                      type: "deeper-pass",
                      ledger: "business",
                      message: `${group.prettyName} deeper vintage/unique pass filed`,
                      clientId: group.clientId,
                      groupId,
                    }
                  : {
                      actor: "system",
                      type: "price-draft",
                      ledger: "business",
                      message: `${group.prettyName} draft range ${price.listLow}–${price.listHigh}`,
                      clientId: group.clientId,
                      groupId,
                    },
            ),
          }));
        } catch (err) {
          set((s) => ({
            groups: s.groups.map((g) =>
              g.id === groupId ? { ...g, pricing: false, status: "ready" } : g,
            ),
            items: s.items.map((i) =>
              group.itemIds.includes(i.id)
                ? {
                    ...i,
                    analysisError: err instanceof Error ? err.message : "Valuation failed",
                  }
                : i,
            ),
          }));
        }
      },

      adjustPrice: (groupId, userList) => {
        const n = Math.max(1, Math.round(userList));
        set((s) => {
          const group = s.groups.find((g) => g.id === groupId);
          return {
            groups: s.groups.map((g) =>
              g.id === groupId && g.price
                ? { ...g, price: { ...g.price, userList: n, status: "paused" }, template: undefined }
                : g,
            ),
            log: appendLog(s.log, {
              actor: "user",
              type: "price-adjust",
              ledger: "business",
              message: `${group?.prettyName ?? "Lot"} list price adjusted to $${n} — still paused`,
              clientId: group?.clientId,
              groupId,
            }),
          };
        });
      },

      sendToClient: (groupId) => {
        const group = get().groups.find((g) => g.id === groupId);
        if (!group?.price) return;
        const ask = group.price.userList ?? group.price.listSuggested;
        const packet = buildClientPacket(group, { ...group.price, userList: ask });
        const handshake: HandshakeRound = {
          id: uid("hs"),
          round: (group.handshake?.round ?? 0) + 1,
          sentAt: Date.now(),
          packet,
          listAsk: ask,
          channel: group.price.channel,
          waiting: true,
        };
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  status: "sent",
                  price: { ...g.price!, userList: ask, status: "sent" },
                  handshake,
                }
              : g,
          ),
          view: "clients",
          log: appendLog(
            appendLog(s.log, {
              actor: "user",
              type: "send-client",
              ledger: "business",
              message: `Round ${handshake.round} sent to ${group.clientId ?? "unassigned"} · ask ${money(ask)} · waiting on send-back`,
              clientId: group.clientId,
              groupId,
            }),
            {
              actor: "system",
              type: "list-hold",
              ledger: "business",
              message: `${group.prettyName} listing not ready yet — handshake open in the CRM`,
              clientId: group.clientId,
              groupId,
            },
          ),
        }));
      },

      recordClientBack: async (groupId, decision, opts) => {
        const group = get().groups.find((g) => g.id === groupId);
        const handshake = group?.handshake;
        if (!group || !handshake || !group.price) return;
        const note = opts?.note?.trim() ?? "";
        const listPrice =
          decision === "adjust"
            ? Math.max(1, Math.round(opts?.listPrice ?? handshake.listAsk))
            : decision === "approve"
              ? (opts?.listPrice ?? handshake.listAsk)
              : null;
        const reply = {
          at: Date.now(),
          decision,
          listPrice,
          note,
        } as const;
        const who = group.clientId ?? "Client";

        if (decision === "decline") {
          set((s) => ({
            groups: s.groups.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    status: "hold",
                    price: g.price ? { ...g.price, status: "hold" } : g.price,
                    handshake: { ...g.handshake!, waiting: false, reply },
                  }
                : g,
            ),
            log: appendLog(s.log, {
              actor: "client",
              type: "client-back",
              ledger: "business",
              message: `${who} sent back decline on ${group.prettyName}${note ? ` — ${note}` : ""} · held, not listed`,
              clientId: group.clientId,
              groupId,
            }),
          }));
          return;
        }

        if (decision === "adjust") {
          const n = listPrice ?? handshake.listAsk;
          set((s) => ({
            groups: s.groups.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    status: "paused",
                    price: g.price
                      ? { ...g.price, userList: n, status: "paused" }
                      : g.price,
                    handshake: { ...g.handshake!, waiting: false, reply },
                    template: undefined,
                  }
                : g,
            ),
            view: "approve",
            log: appendLog(
              appendLog(s.log, {
                actor: "client",
                type: "client-back",
                ledger: "business",
                message: `${who} sent back a different ask · ${money(n)} on ${group.prettyName}`,
                clientId: group.clientId,
                groupId,
              }),
              {
                actor: "system",
                type: "price-pause",
                ledger: "business",
                message: `Round ${handshake.round + 1} waiting — send the revised ask back to ${who}`,
                clientId: group.clientId,
                groupId,
              },
            ),
          }));
          return;
        }

        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  status: "client-back",
                  price: g.price
                    ? {
                        ...g.price,
                        userList: listPrice ?? handshake.listAsk,
                        status: "approved",
                      }
                    : g.price,
                  handshake: { ...g.handshake!, waiting: false, reply },
                }
              : g,
          ),
          log: appendLog(s.log, {
            actor: "client",
            type: "client-back",
            ledger: "business",
            message: `${who} sent back approval on ${group.prettyName} at ${money(listPrice ?? handshake.listAsk)}${note ? ` — ${note}` : ""}`,
            clientId: group.clientId,
            groupId,
          }),
        }));
        await get().approveGroup(groupId);
      },

      approveGroup: async (groupId) => {
        const group = get().groups.find((g) => g.id === groupId);
        if (!group?.price) return;
        const approved = group.price.userList ?? group.price.listSuggested;
        const members = get().items.filter((i) => group.itemIds.includes(i.id));
        const hero =
          members.find((m) => m.garment?.photoRole === "hero-front") ?? members[0];
        if (!hero?.garment || !hero.highLevel) return;
        const fromClient = group.handshake?.reply?.decision === "approve";
        set((s) => ({
          groups: s.groups.map((g) => (g.id === groupId ? { ...g, templating: true } : g)),
        }));
        try {
          const src = hero.objectUrl ?? hero.sampleSrc;
          if (!src) throw new Error("Image bytes missing");
          const img = await loadImage(src);
          const result = await buildListingTemplate({
            data: {
              imageDataUrl: compressForApi(img),
              garment: hero.garment,
              highLevel: hero.highLevel,
              approvedList: approved,
              channel: group.price.channel,
              compsNote: group.price.compsNote,
            },
          });
          if (!result.ok) throw new Error(result.error);
          set((s) => ({
            groups: s.groups.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    templating: false,
                    status: fromClient ? "client-back" : "approved",
                    price: {
                      ...g.price!,
                      userList: approved,
                      status: "approved",
                      approvedAt: Date.now(),
                    },
                    template: result.template,
                  }
                : g,
            ),
            log: appendLog(
              appendLog(
                appendLog(s.log, {
                  actor: fromClient ? "client" : "user",
                  type: "approve",
                  ledger: "business",
                  message: `${group.prettyName} stamped at $${approved} · ${group.price?.channel ?? "channel"}`,
                  clientId: group.clientId,
                  groupId,
                }),
                {
                  actor: "system",
                  type: "template",
                  ledger: "business",
                  message: `Listing copy drafted for ${group.prettyName} after handshake`,
                  clientId: group.clientId,
                  groupId,
                },
              ),
              {
                actor: "system",
                type: "list-hold",
                ledger: "business",
                message: `${group.prettyName} is not ready to list — packet lives in the CRM`,
                clientId: group.clientId,
                groupId,
              },
            ),
          }));
        } catch (err) {
          set((s) => ({
            groups: s.groups.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    templating: false,
                    status: fromClient ? "client-back" : "approved",
                    price: {
                      ...g.price!,
                      userList: approved,
                      status: "approved",
                      approvedAt: Date.now(),
                    },
                  }
                : g,
            ),
            items: s.items.map((i) =>
              i.id === hero.id
                ? {
                    ...i,
                    analysisError:
                      err instanceof Error ? err.message : "Template failed after approval",
                  }
                : i,
            ),
            log: appendLog(s.log, {
              actor: fromClient ? "client" : "user",
              type: "approve",
              ledger: "business",
              message: `${group.prettyName} stamped at $${approved} (template pending retry)`,
              clientId: group.clientId,
              groupId,
            }),
          }));
        }
      },

      holdGroup: (groupId) => {
        set((s) => {
          const group = s.groups.find((g) => g.id === groupId);
          return {
            groups: s.groups.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    status: "hold",
                    price: g.price ? { ...g.price, status: "hold" } : g.price,
                  }
                : g,
            ),
            log: appendLog(s.log, {
              actor: "user",
              type: "hold",
              ledger: "business",
              message: `${group?.prettyName ?? "Lot"} held — no send, no list`,
              clientId: group?.clientId,
              groupId,
            }),
          };
        });
      },
    }),
    {
      name: "lotbook-intake-v7",
      skipHydration: true,
      partialize: (s) => ({
        items: persistable(s.items),
        batches: s.batches,
        groups: persistGroups(s.groups),
        log: s.log.slice(0, 200),
        selectedId: s.selectedId,
        collection: s.collection,
        ledgerFilter: s.ledgerFilter,
        laneFilter: s.laneFilter,
        seeded: s.seeded,
        lastClientId: s.lastClientId,
        lastClientFirst: s.lastClientFirst,
        lastClientLast: s.lastClientLast,
        lastLedger: s.lastLedger,
        lastLane: s.lastLane,
        railMode: s.railMode,
      }),
    },
  ),
);

export function itemSrc(item: CatalogItem, preferEdit = true) {
  if (
    preferEdit &&
    item.edit?.previewUrl &&
    (item.edit.status === "ready-to-post" || item.edit.status === "recataloged")
  ) {
    return item.edit.previewUrl;
  }
  return item.objectUrl ?? item.sampleSrc ?? item.thumbDataUrl;
}

export function matchesQuery(
  item: CatalogItem,
  query: string,
  collection: CollectionId | "all",
  ledger: LedgerId | "all" = "all",
  lane: LaneId | "all" = "all",
) {
  if (collection !== "all" && item.collectionId !== collection) return false;
  if (ledger !== "all" && item.ledger !== ledger) return false;
  if (lane !== "all" && item.lane !== lane) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const blob = [
    item.name,
    item.category,
    item.collectionId,
    item.ledger,
    item.lane,
    item.clientId,
    item.clientFirst,
    item.clientLast,
    ...item.tags,
    item.highLevel?.title,
    item.highLevel?.summary,
    item.garment?.kind,
    item.garment?.styleName,
    item.garment?.colorway,
    item.garment?.brandVisible,
    item.garment?.condition,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return blob.includes(q);
}
