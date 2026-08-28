import type { CatalogItem, GarmentRecord, LaneId, LedgerId, PhotoEdit } from "./types";

export function formatClientName(first?: string | null, last?: string | null) {
  return [first?.trim(), last?.trim()].filter(Boolean).join(" ") || null;
}

export function splitClientName(name?: string | null): { first: string; last: string } {
  const t = (name ?? "").trim();
  if (!t) return { first: "", last: "" };
  const i = t.indexOf(" ");
  if (i < 0) return { first: t, last: "" };
  return { first: t.slice(0, i), last: t.slice(i + 1).trim() };
}

export function parseClientName(filename: string): { first: string; last: string } | null {
  const stem = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  const cleaned = stem.replace(/\b(client|cid|lot|img|dsc|img)\b/gi, "").replace(/\d+/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter((p) => /^[A-Za-z][A-Za-z']+$/.test(p));
  if (parts.length >= 2) {
    const first = cap(parts[0]!);
    const last = cap(parts[parts.length - 1]!);
    if (first.toLowerCase() !== last.toLowerCase()) return { first, last };
  }
  return null;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function prettyItemName(g?: GarmentRecord | null) {
  if (!g?.isGarment) return "";
  const brand = g.brandVisible?.trim() || "Unbranded";
  const style = (g.styleName || g.kind).trim();
  const color = (g.colorway || "").trim();
  return [brand, style, color].filter(Boolean).join(" ");
}

export function prettyLotName(g?: GarmentRecord | null, client?: string | null) {
  const head = prettyItemName(g);
  if (!head) return client ?? "Unsorted";
  return client ? `${head} · ${client}` : head;
}

export function groupKeyFor(item: CatalogItem): string {
  const g = item.garment;
  const client = slug(item.clientId || item.batchId || "unassigned");
  if (g?.isGarment) {
    return [
      slug(g.brandVisible || "unbranded"),
      slug(g.styleName || g.kind || "garment"),
      slug(g.colorway || "unknown"),
      client,
    ].join("::");
  }
  const hint = g?.groupHint?.trim();
  if (hint) return [slug(hint), client].join("::");
  return item.id;
}

export function groupLabelFor(items: CatalogItem[]): string {
  const first = items[0];
  return prettyLotName(first?.garment, first?.clientId);
}

export function catalogSortKey(item: CatalogItem) {
  const g = item.garment;
  const lane = g?.isGarment ? "0" : "1";
  const itemKey = g?.isGarment
    ? [g.brandVisible || "unbranded", g.styleName || g.kind, g.colorway]
        .join(" ")
        .toLowerCase()
    : (item.highLevel?.title || item.name).toLowerCase();
  const last = (item.clientLast || item.clientId || "zzz").toLowerCase();
  const first = (item.clientFirst || "").toLowerCase();
  return `${lane}\u0000${itemKey}\u0000${last}\u0000${first}`;
}

export function accessoryKind(kind: string) {
  return /^(shoes|boots|sneakers|bag|belt|scarf|hat|jewelry|watch)$/i.test(kind);
}

export function collectionFor(item: {
  ledger: LedgerId;
  lane?: LaneId;
  garment?: CatalogItem["garment"];
  highLevel?: CatalogItem["highLevel"];
}): CatalogItem["collectionId"] {
  if (item.lane === "social") return "social";
  if (item.lane === "log" || item.ledger === "personal") return "personal";
  if (item.garment?.isGarment) {
    return accessoryKind(item.garment.kind) ? "accessories" : "garments";
  }
  return item.highLevel?.suggestedCollection ?? "inbox";
}

export function laneForLedger(ledger: LedgerId, explicit?: LaneId | null): LaneId {
  if (explicit) return explicit;
  return ledger === "personal" ? "log" : "resell";
}

export function editPlanFor(item: CatalogItem): Pick<
  PhotoEdit,
  "recipe" | "bgRemoval" | "enhance" | "notes" | "crops"
> {
  if (item.lane === "social") {
    return {
      recipe: "social-minimal",
      bgRemoval: "not-needed",
      enhance: "preview-local",
      notes: ["Minimal grade only — no cutout, no beauty filter"],
      crops: ["4:5", "1:1", "9:16"],
    };
  }
  const role = item.garment?.photoRole;
  const onBody = role === "fit-on-body" || role === "in-situ";
  if (onBody) {
    return {
      recipe: "resell-batch",
      bgRemoval: "skipped-on-body",
      enhance: "preview-local",
      notes: [
        "Do not cut a person out of this plate",
        "Preview enhance only",
        "Still need a flat-lay for listing",
      ],
      crops: ["4:5"],
    };
  }
  const keepContext = role === "label" || role === "hangtag" || role === "defect";
  return {
    recipe: "resell-batch",
    bgRemoval: keepContext ? "not-needed" : "pending-tbd",
    enhance: "pending-tbd",
    notes: keepContext
      ? ["Keep context — no background removal on labels or defects"]
      : [
          "Background removal — program TBD",
          "Auto enhance — program TBD",
          "Local preview grade until the program is locked",
        ],
    crops: ["1:1", "4:5"],
  };
}

export function uniqueById<T extends { id: string }>(rows: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out;
}

export function needsResellEdit(item: CatalogItem) {
  if (item.lane !== "resell" || !item.garment?.isGarment) return false;
  const st = item.edit?.status ?? "none";
  return st === "none" || st === "queued" || st === "processing";
}

export function isListingPlate(item: CatalogItem) {
  const st = item.edit?.status;
  return st === "ready-to-post" || st === "recataloged";
}
