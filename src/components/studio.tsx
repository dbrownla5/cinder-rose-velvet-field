import { useEffect, useMemo, useRef, useState } from "react";
import {
  Aperture,
  BookOpen,
  Check,
  ChevronDown,
  CirclePause,
  Copy,
  Handshake,
  Inbox,
  Layers,
  LayoutGrid,
  Pause,
  Scale,
  Search,
  Send,
  Shield,
  Shirt,
  Table2,
  Trash2,
  Upload,
  User,
  Watch,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { CatalogSheet } from "@/components/catalog-sheet";
import { EditDesk } from "@/components/edit-desk";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  catalogSortKey,
  isListingPlate,
  needsResellEdit,
  prettyItemName,
  prettyLotName,
} from "@/lib/grouping";
import { formatBytes } from "@/lib/image-utils";
import { itemSrc, matchesQuery, useStudio } from "@/lib/store";
import {
  COLLECTIONS,
  LANES,
  LEDGERS,
  collectionLabel,
  conditionLabel,
  laneLabel,
  money,
  moneyOrDash,
  roleLabel,
} from "@/lib/taxonomy";
import type {
  CatalogItem,
  CollectionId,
  HandshakeDecision,
  LaneId,
  LedgerId,
  LogEvent,
  LotGroup,
  LowLevelAnalysis,
  StudioView,
  ValuationReport,
} from "@/lib/types";

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.08" />
      <rect x="6" y="6" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect x="17" y="6" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.72" />
      <rect x="6" y="17" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="17" y="17" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.32" />
    </svg>
  );
}

function copyText(label: string, text: string) {
  void navigator.clipboard.writeText(text).then(
    () => toast.success(`Copied ${label}`),
    () => toast.error("Clipboard blocked"),
  );
}

function plateTitle(item: CatalogItem) {
  if (item.garment?.isGarment) return prettyItemName(item.garment);
  return item.highLevel?.title ?? item.name;
}

const NAV: { id: StudioView; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "rail", label: "Batch", Icon: LayoutGrid },
  { id: "inspect", label: "Open", Icon: Layers },
  { id: "edit", label: "Edit", Icon: Aperture },
  { id: "approve", label: "Price", Icon: Scale },
  { id: "clients", label: "Send", Icon: Handshake },
  { id: "log", label: "Log", Icon: BookOpen },
];

function handshakeLabel(group: LotGroup) {
  const h = group.handshake;
  if (group.status === "listed") return "Listed";
  if (group.status === "hold") return "Held";
  if (h?.waiting) return `Round ${h.round} · waiting`;
  if (h?.reply?.decision === "approve") return "Client sent back · not ready to list";
  if (h?.reply?.decision === "adjust") return `They asked ${money(h.reply.listPrice ?? h.listAsk)}`;
  if (h?.reply?.decision === "decline") return "They declined";
  if (group.status === "paused" || group.status === "pricing") return group.pricing ? "Pricing" : "Paused";
  if (group.status === "approved") return "Approved";
  if (group.status === "client-back") return "Client sent back · not ready to list";
  if (group.status === "sent") return "Waiting on client";
  return group.status;
}

export function Studio() {
  const fileRef = useRef<HTMLInputElement>(null);
  const labeledRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [draftFirst, setDraftFirst] = useState("");
  const [draftLast, setDraftLast] = useState("");
  const [draftLedger, setDraftLedger] = useState<LedgerId>("business");
  const [draftLane, setDraftLane] = useState<LaneId>("resell");

  const items = useStudio((s) => s.items);
  const selectedId = useStudio((s) => s.selectedId);
  const view = useStudio((s) => s.view);
  const collection = useStudio((s) => s.collection);
  const ledgerFilter = useStudio((s) => s.ledgerFilter);
  const query = useStudio((s) => s.query);
  const addFiles = useStudio((s) => s.addFiles);
  const setView = useStudio((s) => s.setView);
  const setQuery = useStudio((s) => s.setQuery);
  const setCollection = useStudio((s) => s.setCollection);
  const setLedgerFilter = useStudio((s) => s.setLedgerFilter);
  const lastClientFirst = useStudio((s) => s.lastClientFirst);
  const lastClientLast = useStudio((s) => s.lastClientLast);
  const lastLedger = useStudio((s) => s.lastLedger);
  const lastLane = useStudio((s) => s.lastLane);
  const laneFilter = useStudio((s) => s.laneFilter);
  const setLaneFilter = useStudio((s) => s.setLaneFilter);
  const railMode = useStudio((s) => s.railMode);
  const setRailMode = useStudio((s) => s.setRailMode);
  const groups = useStudio((s) => s.groups);
  const paused = groups.filter((g) => g.status === "paused" || g.status === "pricing").length;
  const waiting = groups.filter((g) => g.status === "sent" || g.handshake?.waiting).length;
  const editBacklog = items.filter(
    (i) =>
      (i.lane === "resell" && needsResellEdit(i)) ||
      (i.lane === "social" && (!i.edit || i.edit.status === "none" || i.edit.status === "queued")),
  ).length;

  useEffect(() => {
    let alive = true;
    void (async () => {
      await useStudio.persist.rehydrate();
      if (alive) await useStudio.getState().hydrate();
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setDraftFirst(lastClientFirst);
    setDraftLast(lastClientLast);
    setDraftLedger(lastLedger);
    setDraftLane(lastLane);
  }, [lastClientFirst, lastClientLast, lastLedger, lastLane]);

  useEffect(() => {
    function onDrag(e: DragEvent) {
      if (![...((e.dataTransfer?.types as unknown as string[]) ?? [])].includes("Files")) return;
      e.preventDefault();
      setDragging(true);
    }
    function onLeave(e: DragEvent) {
      e.preventDefault();
      if (e.relatedTarget === null) setDragging(false);
    }
    function onDrop(e: DragEvent) {
      e.preventDefault();
      setDragging(false);
      const files = [...(e.dataTransfer?.files ?? [])];
      if (files.length) {
        void addFiles(files, {
          ledger: lastLane === "resell" ? "business" : "personal",
          lane: lastLane,
          labeled: false,
        });
        toast.message(`Added · ${lastLane} · no labels`);
      }
    }
    window.addEventListener("dragenter", onDrag);
    window.addEventListener("dragover", onDrag);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDrag);
      window.removeEventListener("dragover", onDrag);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [addFiles, lastLane]);

  const visible = useMemo(
    () =>
      items
        .filter((i) => matchesQuery(i, query, collection, ledgerFilter, laneFilter))
        .sort((a, b) => catalogSortKey(a).localeCompare(catalogSortKey(b))),
    [items, query, collection, ledgerFilter, laneFilter],
  );
  const selected = items.find((i) => i.id === selectedId) ?? visible[0] ?? items[0];

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const c of COLLECTIONS) map[c.id] = items.filter((i) => i.collectionId === c.id).length;
    return map;
  }, [items]);

  function pickFiles() {
    labeledRef.current = true;
    useStudio.getState().setLastIntake(
      draftFirst.trim(),
      draftLast.trim(),
      draftLane === "resell" ? "business" : "personal",
      draftLane,
    );
    fileRef.current?.click();
    setIntakeOpen(false);
  }

  function dumpNow() {
    labeledRef.current = false;
    setIntakeOpen(false);
    fileRef.current?.click();
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1c1a18",
            border: "1px solid color-mix(in oklab, #f0ece4 12%, transparent)",
            color: "#f0ece4",
          },
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          if (files.length) {
            void addFiles(files, {
              clientFirst: labeledRef.current && draftLane === "resell" ? draftFirst.trim() || null : null,
              clientLast: labeledRef.current && draftLane === "resell" ? draftLast.trim() || null : null,
              ledger: draftLane === "resell" ? "business" : "personal",
              lane: draftLane,
              labeled: labeledRef.current && draftLane === "resell",
            });
          }
        }}
      />

      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <Mark className="size-7 text-fg" />
          <div className="leading-tight">
            <div className="font-display text-[1.15rem] tracking-tight">Lotbook</div>
            <div className="hidden text-[10px] uppercase tracking-[0.18em] text-subtle sm:block">
              Sort · catalog · send
            </div>
          </div>
        </div>
        <nav className="ml-2 hidden items-center rounded-lg bg-surface p-1 md:flex">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cn(
                "relative flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium whitespace-nowrap",
                view === id ? "bg-raised text-fg" : "text-muted hover:text-fg",
              )}
            >
              <Icon className="size-3.5" />
              {label}
              {id === "approve" && paused > 0 ? (
                <span className="ml-0.5 min-w-4 rounded-full bg-warn/20 px-1 text-[10px] text-warn tabular-nums">
                  {paused}
                </span>
              ) : null}
              {id === "clients" && waiting > 0 ? (
                <span className="ml-0.5 min-w-4 rounded-full bg-ok/20 px-1 text-[10px] text-ok tabular-nums">
                  {waiting}
                </span>
              ) : null}
              {id === "edit" && editBacklog > 0 ? (
                <span className="ml-0.5 min-w-4 rounded-full bg-warn/20 px-1 text-[10px] text-warn tabular-nums">
                  {editBacklog}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lots, names, tags"
              className="h-9 w-48 rounded-md border border-border bg-surface pr-3 pl-8 text-sm text-fg placeholder:text-subtle focus:ring-2 focus:ring-ring/50 focus:outline-none lg:w-64"
            />
          </div>
          <div className="hidden rounded-md bg-surface p-1 sm:flex">
            {LANES.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setDraftLane(l.id);
                  setDraftLedger(l.id === "resell" ? "business" : "personal");
                  useStudio.getState().setLastIntake(
                    draftFirst,
                    draftLast,
                    l.id === "resell" ? "business" : "personal",
                    l.id,
                  );
                }}
                className={cn(
                  "h-8 rounded-sm px-2.5 text-xs font-medium",
                  draftLane === l.id ? "bg-raised text-fg" : "text-muted",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="relative flex">
            <Button size="sm" onClick={dumpNow} className="rounded-r-none">
              <Upload className="size-3.5" />
              Add photos
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-l-none border-l-0 px-2"
              aria-label="Optional lot ticket"
              onClick={() => setIntakeOpen((o) => !o)}
            >
              <ChevronDown className="size-3.5" />
            </Button>
            {intakeOpen ? (
              <div className="absolute top-11 right-0 z-30 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-panel)]">
                <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">
                  Optional ticket
                </p>
                <p className="mt-1 text-[11px] leading-snug text-muted">
                  Drop needs no names. Fill this only when you already know the client.
                </p>
                {draftLane === "resell" ? (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="block text-xs text-muted">
                      First name
                      <input
                        value={draftFirst}
                        onChange={(e) => setDraftFirst(e.target.value)}
                        placeholder="Maya"
                        className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
                      />
                    </label>
                    <label className="block text-xs text-muted">
                      Last name
                      <input
                        value={draftLast}
                        onChange={(e) => setDraftLast(e.target.value)}
                        placeholder="Chen"
                        className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
                      />
                    </label>
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] leading-snug text-muted">
                    {draftLane === "social"
                      ? "Social pile — not inventory."
                      : "Personal log — rooms, notes, field shots."}
                  </p>
                )}
                <Button className="mt-3 w-full" size="sm" onClick={pickFiles}>
                  Add with this name
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border bg-surface/60 lg:flex">
          <div className="px-4 pt-5 pb-2 text-[10px] font-medium tracking-[0.16em] text-subtle uppercase">
            Ledger
          </div>
          <nav className="flex flex-col gap-0.5 px-2">
            {([{ id: "all" as const, label: "Both ledgers" }, ...LEDGERS]).map((l) => (
              <button
                key={l.id}
                onClick={() => setLedgerFilter(l.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm",
                  ledgerFilter === l.id
                    ? "bg-raised text-fg"
                    : "text-muted hover:bg-fg/5 hover:text-fg",
                )}
              >
                {l.id === "personal" ? (
                  <User className="size-3.5" />
                ) : l.id === "business" ? (
                  <Shirt className="size-3.5" />
                ) : (
                  <LayoutGrid className="size-3.5" />
                )}
                <span className="flex-1 truncate">{l.label}</span>
              </button>
            ))}
          </nav>
          <div className="px-4 pt-5 pb-2 text-[10px] font-medium tracking-[0.16em] text-subtle uppercase">
            Lane
          </div>
          <nav className="flex flex-col gap-0.5 px-2">
            {([{ id: "all" as const, label: "All lanes" }, ...LANES]).map((l) => (
              <button
                key={l.id}
                onClick={() => setLaneFilter(l.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm",
                  laneFilter === l.id
                    ? "bg-raised text-fg"
                    : "text-muted hover:bg-fg/5 hover:text-fg",
                )}
              >
                <span className="flex-1 truncate">{l.label}</span>
              </button>
            ))}
          </nav>
          <div className="px-4 pt-5 pb-2 text-[10px] font-medium tracking-[0.16em] text-subtle uppercase">
            Collections
          </div>
          <nav className="flex flex-col gap-0.5 px-2">
            {([{ id: "all" as const, label: "All plates" }, ...COLLECTIONS]).map((c) => {
              const active = collection === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setCollection(c.id);
                    setView("rail");
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm",
                    active ? "bg-raised text-fg" : "text-muted hover:bg-fg/5 hover:text-fg",
                  )}
                >
                  {c.id === "inbox" ? (
                    <Inbox className="size-3.5 shrink-0" />
                  ) : c.id === "accessories" ? (
                    <Watch className="size-3.5 shrink-0" />
                  ) : c.id === "social" ? (
                    <Aperture className="size-3.5 shrink-0" />
                  ) : c.id === "personal" ? (
                    <User className="size-3.5 shrink-0" />
                  ) : (
                    <Shirt className="size-3.5 shrink-0" />
                  )}
                  <span className="flex-1 truncate">{c.label}</span>
                  <span className="font-mono text-[10px] text-subtle tabular-nums">
                    {c.id === "all" ? items.length : (counts[c.id] ?? 0)}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-border p-4">
            <p className="font-display text-sm leading-snug text-muted">
              Sell one way. Social another. You pick what goes next.
            </p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          {view === "rail" ? (
            railMode === "sheet" ? (
              <CatalogSheet onDump={dumpNow} />
            ) : (
              <RailGrid
                items={visible}
                selectedId={selected?.id}
                empty={items.length === 0}
                onAdd={dumpNow}
              />
            )
          ) : view === "edit" ? (
            <EditDesk />
          ) : view === "approve" ? (
            <ApproveQueue />
          ) : view === "clients" ? (
            <ClientsBoard />
          ) : view === "log" ? (
            <LogView />
          ) : (
            <InspectLayout item={selected} />
          )}
        </main>
      </div>

      <nav className="flex shrink-0 border-t border-border bg-surface md:hidden">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={cn(
              "relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[10px]",
              view === id ? "text-fg" : "text-muted",
            )}
          >
            <Icon className="size-4" />
            {label}
            {id === "approve" && paused > 0 ? (
              <span className="absolute top-1.5 right-[18%] size-1.5 rounded-full bg-warn" />
            ) : null}
            {id === "clients" && waiting > 0 ? (
              <span className="absolute top-1.5 right-[12%] size-1.5 rounded-full bg-ok" />
            ) : null}
            {id === "edit" && editBacklog > 0 ? (
              <span className="absolute top-1.5 right-[12%] size-1.5 rounded-full bg-warn" />
            ) : null}
          </button>
        ))}
      </nav>

      {dragging ? (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-bg/80">
          <div className="rounded-xl border border-border-strong bg-surface px-10 py-8 text-center shadow-[var(--shadow-panel)]">
            <Upload className="mx-auto mb-3 size-6 text-accent" />
            <div className="font-display text-2xl">Add photos</div>
            <p className="mt-1 text-sm text-muted">
              No labels needed. Drop them in — they size, code, and file.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RailGrid({
  items,
  selectedId,
  empty,
  onAdd,
}: {
  items: CatalogItem[];
  selectedId?: string;
  empty: boolean;
  onAdd: () => void;
}) {
  const select = useStudio((s) => s.select);
  const collection = useStudio((s) => s.collection);
  const setCollection = useStudio((s) => s.setCollection);
  const query = useStudio((s) => s.query);
  const setQuery = useStudio((s) => s.setQuery);
  const itemsAll = useStudio((s) => s.items);
  const batches = useStudio((s) => s.batches);
  const groups = useStudio((s) => s.groups);
  const setView = useStudio((s) => s.setView);
  const passToValuation = useStudio((s) => s.passToValuation);
  const setRailMode = useStudio((s) => s.setRailMode);
  const weekCount = useStudio((s) =>
    s.items.filter((i) => Date.now() - i.createdAt < 7 * 24 * 60 * 60 * 1000).length,
  );
  const [picked, setPicked] = useState<string[]>([]);

  const readyLots = groups.filter((g) => {
    if (g.ledger !== "business" || g.status !== "ready" || g.price) return false;
    const members = itemsAll.filter((i) => g.itemIds.includes(i.id));
    return members.length > 0 && members.every((m) => isListingPlate(m));
  });
  const editLots = itemsAll.filter(
    (i) =>
      needsResellEdit(i) ||
      (i.lane === "social" && (!i.edit || i.edit.status === "none" || i.edit.status === "queued")),
  );
  const valuingLots = groups.filter(
    (g) => g.ledger === "business" && (g.status === "paused" || g.status === "pricing"),
  );
  const handshakeLots = groups.filter(
    (g) =>
      g.ledger === "business" &&
      (g.status === "sent" || g.status === "client-back" || g.handshake?.waiting),
  );

  const readyIds = readyLots.map((g) => g.id).join("|");
  useEffect(() => {
    const allowed = new Set(readyIds.split("|").filter(Boolean));
    setPicked((ids) => ids.filter((id) => allowed.has(id)));
  }, [readyIds]);

  if (empty) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <Mark className="size-12 text-muted" />
        <h1 className="font-display text-3xl">Empty batch</h1>
        <p className="max-w-sm text-sm text-muted">
          Drop a roll. Photos size and rotate, file by item then client, and wait for you to pick
          what to price.
        </p>
        <Button onClick={onAdd}>
          <Upload className="size-4" />
          Add photos
        </Button>
      </div>
    );
  }

  function toggle(id: string) {
    setPicked((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 lg:hidden">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find"
          className="h-9 w-24 shrink-0 rounded-md border border-border bg-surface px-3 text-sm"
        />
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {([{ id: "all" as const, label: "All" }, ...COLLECTIONS]).map((c) => (
            <button
              key={c.id}
              onClick={() => setCollection(c.id)}
              className={cn(
                "h-9 shrink-0 rounded-md px-2.5 text-xs whitespace-nowrap",
                collection === c.id ? "bg-raised text-fg" : "text-muted",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl">
              {collection === "all" ? "This batch" : collectionLabel(collection)}
            </h1>
            <p className="text-sm text-muted">
              {items.length} plate{items.length === 1 ? "" : "s"} · catalogued item then client ·{" "}
              {weekCount} this week of ~100
            </p>
          </div>
          <div className="flex rounded-md bg-surface p-1">
            <button
              onClick={() => setRailMode("grid")}
              className="flex h-8 items-center gap-1.5 rounded-sm bg-raised px-3 text-xs font-medium"
            >
              <LayoutGrid className="size-3.5" />
              Grid
            </button>
            <button
              onClick={() => setRailMode("sheet")}
              className="flex h-8 items-center gap-1.5 rounded-sm px-3 text-xs font-medium text-muted"
            >
              <Table2 className="size-3.5" />
              Catalog
            </button>
          </div>
        </div>

        {editLots.length || valuingLots.length || handshakeLots.length ? (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {editLots.length ? (
              <button
                onClick={() => setView("edit")}
                className="min-w-[200px] shrink-0 rounded-lg border border-border bg-surface px-3 py-3 text-left"
              >
                <div className="flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-warn uppercase">
                  <Aperture className="size-3" />
                  Two backlogs
                </div>
                <div className="mt-1 truncate font-display text-base">Edit desk</div>
                <div className="mt-0.5 text-[11px] text-muted">
                  {editLots.filter((i) => i.lane === "resell").length} to sell ·{" "}
                  {editLots.filter((i) => i.lane === "social").length} social
                </div>
              </button>
            ) : null}
            {valuingLots.map((g) => (
              <button
                key={g.id}
                onClick={() => setView("approve")}
                className="min-w-[200px] shrink-0 rounded-lg border border-border bg-surface px-3 py-3 text-left"
              >
                <div className="flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-warn uppercase">
                  <CirclePause className="size-3" />
                  {g.status === "pricing" ? "Pricing" : "Send this round"}
                </div>
                <div className="mt-1 truncate font-display text-base">{g.prettyName}</div>
                <div className="mt-0.5 text-[11px] text-muted">
                  {g.clientId ?? "Unassigned"} · {g.itemIds.length} photo
                  {g.itemIds.length === 1 ? "" : "s"}
                  {g.price ? ` · ${money(g.price.userList ?? g.price.listSuggested)}` : ""}
                </div>
              </button>
            ))}
            {handshakeLots.map((g) => (
              <button
                key={g.id}
                onClick={() => setView("clients")}
                className="min-w-[200px] shrink-0 rounded-lg border border-border bg-surface px-3 py-3 text-left"
              >
                <div className="flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-ok uppercase">
                  <Handshake className="size-3" />
                  {g.handshake?.waiting ? "Waiting on them" : "Send"}
                </div>
                <div className="mt-1 truncate font-display text-base">{g.prettyName}</div>
                <div className="mt-0.5 text-[11px] text-muted">
                  {g.clientId ?? "Unassigned"} · {handshakeLabel(g)}
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {readyLots.length ? (
          <section className="mb-6 rounded-xl border border-border bg-surface p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">
                  Ready to pass
                </p>
                <h2 className="font-display text-xl">You pick what goes next</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Sized and rotated. Listing plates only — street shots go through the edit batch
                  first.
                </p>
              </div>
              <Button
                size="sm"
                className="w-full sm:w-auto"
                disabled={!picked.length}
                onClick={() => {
                  const ids = [...picked];
                  setPicked([]);
                  toast.message(
                    `Sent ${ids.length} lot${ids.length === 1 ? "" : "s"} to price`,
                  );
                  void passToValuation(ids);
                }}
              >
                <Scale className="size-3.5" />
                Price{picked.length ? ` ${picked.length}` : ""}
              </Button>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {readyLots.map((g) => {
                const on = picked.includes(g.id);
                const member = items.find((i) => g.itemIds.includes(i.id));
                return (
                  <li key={g.id}>
                    <label
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2",
                        on ? "border-border-strong bg-raised" : "border-border bg-bg",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(g.id)}
                        className="size-4 shrink-0 accent-accent"
                      />
                      {member ? (
                        <img
                          src={member.thumbDataUrl}
                          alt=""
                          className="size-10 shrink-0 rounded-sm object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm">{g.prettyName}</div>
                        <div className="truncate text-[11px] text-muted">
                          {g.itemIds.length} plate{g.itemIds.length === 1 ? "" : "s"} · prepped
                        </div>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {batches[0] ? (
          <p className="mb-3 text-[11px] text-subtle">
            Latest lot {batches[0].label} · {batches[0].itemIds.length} files · {batches[0].status}
          </p>
        ) : null}

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => select(item.id)}
                className={cn(
                  "group flex w-full flex-col overflow-hidden rounded-lg border bg-surface text-left",
                  selectedId === item.id ? "border-border-strong" : "border-border",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-raised">
                  <img
                    src={item.thumbDataUrl}
                    alt=""
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {item.analyzing ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg/50 text-[10px] tracking-wider uppercase">
                      Scanning
                    </div>
                  ) : null}
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    <span className="rounded-full bg-bg/70 px-1.5 py-0.5 text-[9px] tracking-wider text-fg uppercase">
                      {item.ledger}
                    </span>
                    {item.prepped ? (
                      <span className="rounded-full bg-bg/70 px-1.5 py-0.5 text-[9px] tracking-wider text-fg uppercase">
                        Prepped
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="px-2.5 py-2">
                  <div className="truncate text-sm">{plateTitle(item)}</div>
                  <div className="mt-0.5 truncate text-[11px] text-muted">
                    {item.clientId
                      ? item.clientId
                      : item.garment?.isGarment
                        ? `${item.garment.kind} · ${conditionLabel(item.garment.condition)}`
                        : (item.category ?? collectionLabel(item.collectionId))}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InspectLayout({ item }: { item?: CatalogItem }) {
  if (!item) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted">
        Open a photo from the batch.
      </div>
    );
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="flex h-[40vh] min-h-0 min-w-0 shrink-0 flex-col lg:h-auto lg:flex-1">
        <PlateStage item={item} />
        <Filmstrip currentId={item.id} />
      </div>
      <aside className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto border-t border-border bg-surface lg:w-[400px] lg:flex-none lg:border-t-0 lg:border-l">
        <LayersPanel item={item} />
      </aside>
    </div>
  );
}

function PlateStage({ item }: { item: CatalogItem }) {
  const src = itemSrc(item);
  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(240,236,228,0.04),transparent_60%)] p-3 sm:p-8">
      <figure className="flex max-h-full max-w-full flex-col items-center">
        <img
          src={src}
          alt={item.highLevel?.title ?? item.name}
          className="max-h-[calc(40vh-3.5rem)] max-w-full rounded-xs object-contain shadow-[var(--shadow-panel)] lg:max-h-[min(58dvh,720px)]"
        />
        <figcaption className="mt-2 flex w-full items-baseline justify-between gap-3 px-1 text-xs text-muted">
          <span className="truncate font-display text-sm text-fg">
            {plateTitle(item)}
          </span>
          <span className="shrink-0 font-mono tabular-nums">
            {item.width && item.height ? `${item.width}×${item.height}` : ""}
            {item.lowLevel ? ` · ${item.lowLevel.aspectLabel}` : ""}
            {item.prepped ? " · upright" : ""}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

function Filmstrip({ currentId }: { currentId: string }) {
  const items = useStudio((s) => s.items);
  const current = items.find((i) => i.id === currentId);
  const select = useStudio((s) => s.select);
  const peers = current?.groupId
    ? items.filter((i) => i.groupId === current.groupId)
    : items.filter((i) => matchesQuery(i, "", "all", current?.ledger ?? "all")).slice(0, 12);
  if (!peers.length) return null;
  return (
    <div className="hidden shrink-0 border-t border-border bg-surface/80 md:block">
      <ul className="flex gap-2 overflow-x-auto px-4 py-3">
        {peers.map((item) => (
          <li key={item.id} className="shrink-0">
            <button
              onClick={() => select(item.id)}
              className={cn(
                "block h-16 w-20 overflow-hidden rounded-sm border",
                item.id === currentId
                  ? "border-accent"
                  : "border-border opacity-70 hover:opacity-100",
              )}
            >
              <img src={item.thumbDataUrl} alt="" className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LayersPanel({ item }: { item: CatalogItem }) {
  const [layer, setLayer] = useState<"garment" | "high" | "low">("garment");
  const analyze = useStudio((s) => s.analyze);
  const recategorize = useStudio((s) => s.recategorize);
  const remove = useStudio((s) => s.remove);
  const setItemLedger = useStudio((s) => s.setItemLedger);
  const setItemLane = useStudio((s) => s.setItemLane);
  const promoteKeeper = useStudio((s) => s.promoteKeeper);
  const setItemClient = useStudio((s) => s.setItemClient);
  const setView = useStudio((s) => s.setView);
  const passToValuation = useStudio((s) => s.passToValuation);
  const groups = useStudio((s) => s.groups);
  const hl = item.highLevel;
  const ll = item.lowLevel;
  const group = groups.find((g) => g.id === item.groupId);
  const [firstDraft, setFirstDraft] = useState(item.clientFirst ?? "");
  const [lastDraft, setLastDraft] = useState(item.clientLast ?? "");

  useEffect(() => {
    setFirstDraft(item.clientFirst ?? "");
    setLastDraft(item.clientLast ?? "");
  }, [item.id, item.clientFirst, item.clientLast]);

  function commitClient() {
    setItemClient(item.id, firstDraft.trim() || null, lastDraft.trim() || null);
  }

  const pretty = prettyLotName(item.garment, item.clientId);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] tracking-[0.16em] text-subtle uppercase">
            {laneLabel(item.lane)} · {item.ledger} · {item.clientId ?? "unassigned"}
            {item.prepped ? " · prepped" : ""}
          </div>
          <h2 className="font-display text-xl leading-tight">
            {item.garment?.isGarment ? pretty : (hl?.title ?? item.name)}
          </h2>
          {item.catalogCode ? (
            <p className="mt-1 font-mono text-[11px] text-muted">
              {item.catalogCode}
              {item.intakeCode ? ` · ${item.intakeCode}` : ""}
            </p>
          ) : null}
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => void remove(item.id)}
          aria-label="Remove plate"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="flex rounded-lg bg-raised p-1">
        {(
          [
            ["garment", "Class"],
            ["high", "High"],
            ["low", "Low"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setLayer(id)}
            className={cn(
              "h-8 flex-1 rounded-md text-xs font-medium whitespace-nowrap",
              layer === id ? "bg-surface text-fg" : "text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {item.analyzing ? <p className="text-sm text-muted">Scanning the high layer…</p> : null}
      {item.analysisError ? <p className="text-sm text-danger">{item.analysisError}</p> : null}

      {layer === "garment" ? (
        <GarmentCard item={item} group={group} />
      ) : layer === "high" ? (
        <HighLayer item={item} />
      ) : (
        <LowLayer low={ll} item={item} />
      )}

      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      {item.dupe ? (
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">
            {item.dupe.status === "keeper" ? "Canonical plate" : "Duplicate extra"}
          </p>
          <p className="mt-1 text-sm text-muted">{item.dupe.reason}</p>
          <p className="mt-1 font-mono text-[11px] text-subtle">
            EXIF score {item.dupe.score}
            {item.dupe.status === "extra" ? ` · keeper ${item.dupe.keeperScore}` : ""}
            {item.dupe.distance != null ? ` · content Δ ${item.dupe.distance}` : ""}
          </p>
          {item.dupe.status === "extra" ? (
            <Button className="mt-3" size="sm" variant="outline" onClick={() => promoteKeeper(item.id)}>
              Use this EXIF as keeper
            </Button>
          ) : null}
        </div>
      ) : null}

      {item.meta ? (
        <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface p-3 text-sm">
          <Fact label="Taken" value={item.meta.takenAt ? item.meta.takenAt.replace("T", " ").slice(0, 19) : "—"} />
          <Fact
            label="Camera"
            value={[item.meta.make, item.meta.model].filter(Boolean).join(" ") || "—"}
          />
          <Fact label="ISO" value={item.meta.iso != null ? String(item.meta.iso) : "—"} />
          <Fact
            label="Lens"
            value={
              [item.meta.focalMm ? `${item.meta.focalMm}mm` : null, item.meta.aperture, item.meta.shutter]
                .filter(Boolean)
                .join(" ") || "—"
            }
          />
          <Fact label="Hash" value={item.meta.hashSha256.slice(0, 16)} />
          <Fact label="Content" value={item.meta.contentHash ? item.meta.contentHash.slice(0, 16) : "—"} />
          <Fact
            label="Taken source"
            value={
              item.meta.takenSource === "original"
                ? "DateTimeOriginal"
                : item.meta.takenSource === "modify"
                  ? "DateTime"
                  : "—"
            }
          />
          <Fact label="GPS in file" value={item.meta.hasGps ? "Present · coords not stored" : "None"} />
        </dl>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <label className="block text-xs text-muted">
          Lane
          <select
            value={item.lane}
            onChange={(e) => setItemLane(item.id, e.target.value as LaneId)}
            className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
          >
            {LANES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-muted">
          Ledger
          <select
            value={item.ledger}
            onChange={(e) => setItemLedger(item.id, e.target.value as LedgerId)}
            className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
          >
            {LEDGERS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-xs text-muted">
        Collection
        <select
          value={item.collectionId}
          onChange={(e) => recategorize(item.id, e.target.value as CollectionId)}
          className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
        >
          {COLLECTIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block text-xs text-muted">
          First name
          <input
            value={firstDraft}
            onChange={(e) => setFirstDraft(e.target.value)}
            onBlur={commitClient}
            placeholder="Maya"
            className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
          />
        </label>
        <label className="block text-xs text-muted">
          Last name
          <input
            value={lastDraft}
            onChange={(e) => setLastDraft(e.target.value)}
            onBlur={commitClient}
            placeholder="Chen"
            className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" onClick={() => void analyze(item.id)} disabled={item.analyzing}>
          <Search className="size-4" />
          {hl ? "Re-scan with AI" : "Scan high layer"}
        </Button>
        {item.garment?.isGarment && item.ledger === "business" && group ? (
          needsResellEdit(item) ? (
            <Button onClick={() => setView("edit")}>
              <Aperture className="size-4" />
              Send to ready-to-post batch
            </Button>
          ) : group.status === "sent" || group.status === "client-back" || group.handshake ? (
            <Button onClick={() => setView("clients")}>
              <Handshake className="size-4" />
              Open send
            </Button>
          ) : group.price || group.status === "paused" || group.status === "pricing" ? (
            <Button onClick={() => setView("approve")}>
              <Scale className="size-4" />
              {group.pricing ? "Pricing…" : "Open prices"}
            </Button>
          ) : (
            <Button
              onClick={() => {
                toast.message(`Sent ${group.prettyName} to price`);
                void passToValuation([group.id]);
              }}
            >
              <Scale className="size-4" />
              Price this lot
            </Button>
          )
        ) : (
          <Button variant="subtle" onClick={() => setView("log")}>
            <BookOpen className="size-4" />
            View post-log
          </Button>
        )}
      </div>
    </div>
  );
}

function GarmentCard({ item, group }: { item: CatalogItem; group?: LotGroup }) {
  const g = item.garment;
  if (!g?.isGarment) {
    return (
      <p className="text-sm text-muted">
        Not classified as clothing. Filed on the {item.ledger} ledger for the photo log. Move it
        to business if this is inventory.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <Fact label="Brand" value={g.brandVisible ?? "Unbranded"} />
        <Fact label="Style" value={g.styleName || g.kind} />
        <Fact label="Color" value={g.colorway || "—"} />
        <Fact label="Client" value={item.clientId ?? "Unassigned"} />
        <Fact label="Condition" value={conditionLabel(g.condition)} />
        <Fact label="Size (as read)" value={g.sizeVisible ?? "Not visible"} />
        <Fact label="Year made" value={g.yearMade ?? "Unknown"} />
        <Fact label="Photo role" value={roleLabel(g.photoRole)} />
      </dl>
      {g.noticeableFeatures.length ? (
        <p className="text-xs text-muted">Features: {g.noticeableFeatures.join(" · ")}</p>
      ) : null}
      {g.defects.length ? (
        <p className="text-xs text-warn">Defects observed: {g.defects.join(" · ")}</p>
      ) : (
        <p className="text-xs text-muted">No defects noted in this plate — observed only.</p>
      )}
      {g.measurementsNeeded.length ? (
        <p className="text-xs text-muted">Still need: {g.measurementsNeeded.join(", ")}</p>
      ) : null}
      {group ? (
        <p className="rounded-md border border-border bg-bg px-3 py-2 text-xs text-muted">
          {group.prettyName} is <span className="text-warn">{handshakeLabel(group)}</span>
          {group.price
            ? ` · ${money(group.price.userList ?? group.price.listSuggested)} draft on ${group.price.channel}. Not an appraisal.`
            : " · waiting on your pass-through."}
        </p>
      ) : null}
    </div>
  );
}

function HighLayer({ item }: { item: CatalogItem }) {
  const hl = item.highLevel;
  if (!hl) {
    return (
      <p className="text-sm text-muted">
        Low-level measurements are already on the record. Run a high-layer scan to file scene,
        subjects, and a garment class.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-fg/90">{hl.summary}</p>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <Fact label="Scene" value={hl.scene} />
        <Fact label="Style" value={hl.style} />
        <Fact label="Lighting" value={hl.lighting} />
        <Fact label="Quality" value={`${hl.quality.score}/10`} />
      </dl>
      <div>
        <div className="mb-1 text-[10px] tracking-[0.16em] text-subtle uppercase">Subjects</div>
        <ul className="flex flex-col gap-1.5">
          {hl.subjects.map((s) => (
            <li key={s.name} className="flex items-center gap-2 text-sm">
              <span className="flex-1 truncate">{s.name}</span>
              <span className="text-xs text-muted">{s.location}</span>
            </li>
          ))}
        </ul>
      </div>
      {hl.quality.issues.length ? (
        <p className="text-xs text-warn">Issues: {hl.quality.issues.join(" · ")}</p>
      ) : null}
    </div>
  );
}

function LowLayer({ low, item }: { low?: LowLevelAnalysis; item: CatalogItem }) {
  if (!low) {
    return <p className="text-sm text-muted">Measurements not yet computed for this plate.</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1.5">
        {low.palette.map((s) => (
          <div key={s.hex} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="h-10 w-full rounded-sm border border-border"
              style={{ background: s.hex }}
              title={s.hex}
            />
            <span className="font-mono text-[9px] text-subtle">{s.hex}</span>
          </div>
        ))}
      </div>
      <div className="flex h-12 items-end gap-px rounded-sm bg-raised px-1 py-1">
        {low.histogram.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-xs bg-accent/70"
            style={{ height: `${Math.max(6, v * 100 * 4)}%` }}
          />
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <Fact label="Orientation" value={low.orientation} />
        <Fact label="Aspect" value={low.aspectLabel} />
        <Fact label="Brightness" value={`${Math.round(low.brightness * 100)}%`} />
        <Fact label="Contrast" value={`${Math.round(low.contrast * 100)}%`} />
        <Fact label="Sharpness" value={`${Math.round(low.sharpness * 100)}%`} />
        <Fact label="File" value={formatBytes(item.bytes)} />
      </dl>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.16em] text-subtle uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm leading-snug">{value}</dd>
    </div>
  );
}

function designerLabel(v: ValuationReport["designerVerifiable"]) {
  switch (v) {
    case "not-designer":
      return "Not designer";
    case "label-present":
      return "Label present — unverified";
    case "needs-second-pass":
      return "Needs second pass";
    default:
      return "Unverified";
  }
}

function authLabel(v: ValuationReport["authenticity"]["status"]) {
  switch (v) {
    case "not-required":
      return "Not required";
    case "queued":
      return "Queued";
    case "flagged":
      return "Flagged for review";
    default:
      return "Unverified";
  }
}

function ApproveQueue() {
  const groups = useStudio((s) => s.groups);
  const items = useStudio((s) => s.items);
  const queue = groups.filter(
    (g) =>
      g.ledger === "business" &&
      (g.status === "pricing" || g.status === "paused" || (g.price && !g.handshake?.waiting && g.status !== "sent" && g.status !== "client-back")),
  );
  const paused = queue.filter((g) => g.status === "paused" || g.status === "pricing");
  const parked = queue.filter((g) => g.status === "hold" || g.status === "approved");

  if (!queue.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <Pause className="size-8 text-muted" />
        <h1 className="font-display text-3xl">Nothing to price</h1>
        <p className="max-w-sm text-sm text-muted">
          Sorted lots wait in the batch. Pick the ones you want — a full report is written, then
          you send that round. Listing is not ready yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
      <h1 className="font-display text-2xl sm:text-3xl">Price</h1>
      <p className="mt-1 max-w-xl text-sm text-muted">
        Full reports — estimates only, not appraisals. Adjust the ask, then send the round to the
        client. They send back; we list from the CRM. Listing itself is not ready yet.
      </p>
      <div className="mt-6 flex flex-col gap-4">
        {paused.map((g) => (
          <PriceCard key={g.id} group={g} items={items.filter((i) => g.itemIds.includes(i.id))} />
        ))}
        {parked.length ? (
          <h2 className="mt-4 font-display text-xl text-muted">Parked</h2>
        ) : null}
        {parked.map((g) => (
          <PriceCard key={g.id} group={g} items={items.filter((i) => g.itemIds.includes(i.id))} />
        ))}
      </div>
    </div>
  );
}

function PriceCard({ group, items }: { group: LotGroup; items: CatalogItem[] }) {
  const adjustPrice = useStudio((s) => s.adjustPrice);
  const holdGroup = useStudio((s) => s.holdGroup);
  const sendToClient = useStudio((s) => s.sendToClient);
  const select = useStudio((s) => s.select);
  const setView = useStudio((s) => s.setView);
  const price = group.price;
  const [edit, setEdit] = useState(String(price?.userList ?? price?.listSuggested ?? ""));

  useEffect(() => {
    setEdit(String(price?.userList ?? price?.listSuggested ?? ""));
  }, [group.id, price?.userList, price?.listSuggested]);

  const waiting = group.status === "sent" || !!group.handshake?.waiting;
  const back = group.status === "client-back";
  const held = group.status === "hold";
  const report = price?.report;
  const who = group.clientId ?? "the client";
  const nextRound = (group.handshake?.round ?? 0) + 1;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex gap-1 overflow-x-auto p-2">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => select(it.id)}
            className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-raised"
          >
            <img src={it.thumbDataUrl} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 px-4 pt-2 pb-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="text-[10px] tracking-[0.16em] text-subtle uppercase">
              {group.clientId ?? "unassigned"} · {price?.channel ?? "channel"} · {items.length}{" "}
              photo{items.length === 1 ? "" : "s"}
            </div>
            <h2 className="font-display text-xl">{group.prettyName}</h2>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] tracking-wider uppercase",
              back
                ? "bg-ok/15 text-ok"
                : waiting
                  ? "bg-ok/15 text-ok"
                  : held
                    ? "text-muted"
                    : "bg-warn/15 text-warn",
            )}
          >
            {handshakeLabel(group)}
          </span>
        </div>

        {group.pricing && !report ? (
          <p className="text-sm text-muted">Writing the price report…</p>
        ) : null}

        {report ? <ReportBlock report={report} /> : null}

        {price ? (
          <>
            <p className="text-sm leading-relaxed text-muted">{price.compsNote}</p>
            <div className="flex flex-wrap gap-4 font-mono text-sm tabular-nums">
              <span>Low {money(price.listLow)}</span>
              <span className="text-fg">Suggest {money(price.listSuggested)}</span>
              <span>High {money(price.listHigh)}</span>
            </div>
            {price.flags.length ? (
              <p className="text-[11px] text-warn">{price.flags.join(" · ")}</p>
            ) : null}

            {waiting ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted">
                  Round {group.handshake?.round} is with {who}. Listing not ready yet.
                </p>
                <Button size="sm" onClick={() => setView("clients")}>
                  <Handshake className="size-3.5" />
                  Open send
                </Button>
              </div>
            ) : back ? (
              <p className="text-sm text-ok">
                They sent back approval at {money(price.userList ?? price.listSuggested)}. Listing
                is not ready yet — packet lives in Clients.
              </p>
            ) : !held ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex min-w-0 flex-1 items-center gap-2 text-xs text-muted">
                  List price
                  <input
                    type="number"
                    min={1}
                    value={edit}
                    onChange={(e) => setEdit(e.target.value)}
                    onBlur={() => {
                      const n = Number(edit);
                      if (Number.isFinite(n) && n > 0) adjustPrice(group.id, n);
                    }}
                    className="h-10 w-28 rounded-md border border-border bg-bg px-3 font-mono text-sm text-fg"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => holdGroup(group.id)}
                    disabled={group.pricing || group.templating}
                  >
                    Hold
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      const n = Number(edit);
                      if (Number.isFinite(n) && n > 0) adjustPrice(group.id, n);
                      sendToClient(group.id);
                      toast.message(`Round ${nextRound} sent to ${who}`);
                    }}
                    disabled={group.pricing || group.templating}
                  >
                    <Send className="size-3.5" />
                    Send round {nextRound} to {who.split(" ")[0] ?? "client"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">Held — no send, no list.</p>
            )}
          </>
        ) : null}

        {group.template ? <TemplateBlock group={group} /> : null}
      </div>
    </article>
  );
}

function ClientsBoard() {
  const groups = useStudio((s) => s.groups);
  const items = useStudio((s) => s.items);
  const setView = useStudio((s) => s.setView);
  const clients = useMemo(() => {
    const map = new Map<
      string,
      { id: string; first: string | null; last: string | null; lots: LotGroup[] }
    >();
    for (const g of groups) {
      if (g.ledger !== "business") continue;
      const key = g.clientId ?? "unassigned";
      const row = map.get(key) ?? {
        id: key,
        first: g.clientFirst,
        last: g.clientLast,
        lots: [],
      };
      row.lots.push(g);
      map.set(key, row);
    }
    return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
  }, [groups]);

  if (!clients.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <Handshake className="size-8 text-muted" />
        <h1 className="font-display text-3xl">Nothing to send</h1>
        <p className="max-w-sm text-sm text-muted">
          Add a named lot when you know the client. After you price a round you send it here, they
          send back, then you list. Listing is not ready yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Send</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Send a round, record their send-back, then list. Marketplace publish is not ready yet —
            the packet stays here.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setView("approve")}>
          <Scale className="size-3.5" />
          Open prices
        </Button>
      </div>
      <div className="mt-6 flex flex-col gap-5">
        {clients.map((c) => (
          <section key={c.id} className="rounded-xl border border-border bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">Client</p>
                <h2 className="font-display text-2xl">{c.id === "unassigned" ? "Unassigned" : c.id}</h2>
              </div>
              <p className="text-xs text-muted">
                {c.lots.length} lot{c.lots.length === 1 ? "" : "s"} ·{" "}
                {c.lots.filter((g) => g.handshake?.waiting).length} waiting
              </p>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {c.lots.map((g) => (
                <HandshakeRow
                  key={g.id}
                  group={g}
                  items={items.filter((i) => g.itemIds.includes(i.id))}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function HandshakeRow({ group, items }: { group: LotGroup; items: CatalogItem[] }) {
  const sendToClient = useStudio((s) => s.sendToClient);
  const recordClientBack = useStudio((s) => s.recordClientBack);
  const setView = useStudio((s) => s.setView);
  const select = useStudio((s) => s.select);
  const hero = items[0];
  const h = group.handshake;
  const waiting = !!h?.waiting || group.status === "sent";
  const approved = h?.reply?.decision === "approve" || group.status === "client-back";
  const [note, setNote] = useState("");
  const [adjust, setAdjust] = useState(String(h?.listAsk ?? group.price?.listSuggested ?? ""));
  const [mode, setMode] = useState<HandshakeDecision | null>(null);

  useEffect(() => {
    setAdjust(String(h?.listAsk ?? group.price?.listSuggested ?? ""));
    setMode(null);
    setNote("");
  }, [group.id, h?.id, h?.listAsk, group.price?.listSuggested]);

  async function commit(decision: HandshakeDecision) {
    const n = Number(adjust);
    await recordClientBack(group.id, decision, {
      listPrice: Number.isFinite(n) ? n : undefined,
      note,
    });
    setMode(null);
    toast.message(
      decision === "approve"
        ? "They sent back approval — listing not ready yet"
        : decision === "adjust"
          ? "They sent back a different ask"
          : "They declined — lot held",
    );
  }

  return (
    <li className="rounded-lg border border-border bg-bg p-3 sm:p-4">
      <div className="flex gap-3">
        {hero ? (
          <button
            onClick={() => select(hero.id)}
            className="size-14 shrink-0 overflow-hidden rounded-md bg-raised"
          >
            <img src={hero.thumbDataUrl} alt="" className="size-full object-cover" />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm">{group.prettyName}</div>
              <div className="mt-0.5 text-[11px] text-muted">{handshakeLabel(group)}</div>
            </div>
            {group.price ? (
              <div className="font-mono text-sm tabular-nums">
                {money(group.price.userList ?? group.price.listSuggested)}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {!group.price ? (
        <p className="mt-3 text-xs text-muted">Still in the batch — price it first.</p>
      ) : waiting && h ? (
        <div className="mt-3 flex flex-col gap-3">
          <pre className="max-h-40 overflow-y-auto rounded-md border border-border bg-surface px-3 py-2 font-sans text-[12px] leading-relaxed whitespace-pre-wrap text-muted">
            {h.packet}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyText("round packet", h.packet)}
            >
              <Copy className="size-3.5" />
              Copy packet
            </Button>
          </div>
          <p className="text-[11px] text-subtle">
            Record their send-back. Listing is not ready yet.
          </p>
          <div className="flex flex-wrap gap-2">
            {(["approve", "adjust", "decline"] as const).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={mode === d ? "default" : "outline"}
                onClick={() => setMode(d)}
              >
                {d === "approve" ? "They approved" : d === "adjust" ? "They adjusted" : "They declined"}
              </Button>
            ))}
          </div>
          {mode ? (
            <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3">
              {mode === "adjust" ? (
                <label className="flex items-center gap-2 text-xs text-muted">
                  Their ask
                  <input
                    type="number"
                    min={1}
                    value={adjust}
                    onChange={(e) => setAdjust(e.target.value)}
                    className="h-10 w-28 rounded-md border border-border bg-bg px-3 font-mono text-sm text-fg"
                  />
                </label>
              ) : null}
              <label className="block text-xs text-muted">
                Note
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional — as they said it"
                  className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
                />
              </label>
              <Button size="sm" onClick={() => void commit(mode)} disabled={group.templating}>
                <Check className="size-3.5" />
                File send-back
              </Button>
            </div>
          ) : null}
        </div>
      ) : approved ? (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-sm text-ok">
            Handshake closed at {money(group.price.userList ?? group.price.listSuggested)}. Copy
            lives in the CRM.
          </p>
          {group.templating ? (
            <p className="text-xs text-muted">Drafting listing copy after their send-back…</p>
          ) : group.template ? (
            <TemplateBlock group={group} />
          ) : null}
          <Button size="sm" disabled className="w-full sm:w-auto">
            List — not ready yet
          </Button>
        </div>
      ) : group.status === "paused" || group.status === "hold" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {group.status === "paused" ? (
            <Button
              size="sm"
              onClick={() => {
                sendToClient(group.id);
                toast.message(`Round sent to ${group.clientId ?? "client"}`);
              }}
            >
              <Send className="size-3.5" />
              Send round {(h?.round ?? 0) + 1}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setView("approve")}>
              Review prices
            </Button>
          )}
        </div>
      ) : null}
    </li>
  );
}

function ReportBlock({ report }: { report: ValuationReport }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-bg p-3 sm:p-4">
      <div>
        <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">Lot report</p>
        <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
          <Fact label="Brand" value={report.brand ?? "None visible"} />
          <Fact label="Size" value={report.size ?? "Not visible"} />
          <Fact
            label="Year made"
            value={
              report.yearMade
                ? `${report.yearMade} (${report.yearBasis === "label" ? "from label" : report.yearBasis === "era-guess" ? "era guess" : "unknown"})`
                : "Unknown"
            }
          />
          <Fact label="Condition" value={conditionLabel(report.condition)} />
          <Fact
            label="Vintage 30+"
            value={report.vintage30 ? (report.vintageNote ?? "Yes — 30+ years") : "No"}
          />
          <Fact label="Designer" value={designerLabel(report.designerVerifiable)} />
        </dl>
      </div>
      {report.noticeableFeatures.length ? (
        <p className="text-xs text-muted">
          Noticeable features: {report.noticeableFeatures.join(" · ")}
        </p>
      ) : null}

      <div>
        <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">Market estimates</p>
        <p className="mt-1 text-[11px] text-muted">
          Typical sold bands, not an appraisal and not a promise.
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
          <Fact label="Sold high quality" value={moneyOrDash(report.market.soldHigh)} />
          <Fact label="Sold low quality" value={moneyOrDash(report.market.soldLow)} />
          <Fact
            label="Time to sell"
            value={report.market.daysToSell != null ? `${report.market.daysToSell} days` : "—"}
          />
          <Fact label="Top of market" value={moneyOrDash(report.market.topOfMarket)} />
          <Fact label="Faster sell" value={moneyOrDash(report.market.fasterSell)} />
          <Fact
            label="Marketplaces"
            value={report.market.channels.length ? report.market.channels.join(", ") : "—"}
          />
        </dl>
        {report.market.notes ? (
          <p className="mt-2 text-xs leading-relaxed text-muted">{report.market.notes}</p>
        ) : null}
      </div>

      {report.authenticity.status !== "not-required" ? (
        <div className="rounded-md border border-border px-3 py-3">
          <div className="flex items-start gap-1.5 text-[10px] font-medium tracking-wide text-warn uppercase">
            <Shield className="mt-0.5 size-3 shrink-0" />
            <span className="leading-snug">
              High-end second pass · {authLabel(report.authenticity.status)}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            {report.authenticity.note ||
              "Cannot verify a designer house from these plates. Not a certificate, not a fake verdict."}
          </p>
          {report.authenticity.tells.length ? (
            <p className="mt-1 text-[11px] text-muted">
              Tells: {report.authenticity.tells.join(" · ")}
            </p>
          ) : null}
        </div>
      ) : null}

      {report.deeper.ran ? (
        <div className="rounded-md border border-border px-3 py-3">
          <p className="text-[10px] tracking-[0.14em] text-subtle uppercase">
            Deeper unique / vintage pass
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{report.deeper.findings}</p>
        </div>
      ) : report.uniqueOrRare || report.vintage30 ? (
        <p className="text-[11px] text-muted">
          Unique or vintage 30+ — a deeper pass is queued with this report.
        </p>
      ) : null}
    </div>
  );
}

function TemplateBlock({ group }: { group: LotGroup }) {
  const t = group.template;
  if (!t) return null;
  const dump = [
    t.title,
    "",
    ...t.bullets.map((b) => `• ${b}`),
    "",
    t.description,
    t.hashtags.length ? t.hashtags.map((h) => `#${h}`).join(" ") : "",
    t.channelNotes,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="rounded-lg border border-border bg-bg p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg">{t.title}</h3>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => copyText("listing", dump)}
          aria-label="Copy listing"
        >
          <Copy className="size-3.5" />
        </Button>
      </div>
      <ul className="mt-3 flex flex-col gap-1 text-sm">
        {t.bullets.map((b) => (
          <li key={b} className="flex gap-2 text-muted">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
            {b}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm leading-relaxed">{t.description}</p>
      {t.measurementsNeeded.length ? (
        <p className="mt-2 text-xs text-warn">Measure: {t.measurementsNeeded.join(", ")}</p>
      ) : null}
      <p className="mt-2 text-[11px] text-subtle">{t.channelNotes}</p>
    </div>
  );
}

function LogView() {
  const log = useStudio((s) => s.log);
  const items = useStudio((s) => s.items);
  const [lane, setLane] = useState<LedgerId | "all">("all");
  const week = items.filter((i) => Date.now() - i.createdAt < 7 * 24 * 60 * 60 * 1000);
  const biz = week.filter((i) => i.ledger === "business").length;
  const per = week.filter((i) => i.ledger === "personal").length;
  const visible = log.filter((e) => lane === "all" || e.ledger === lane);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
      <h1 className="font-display text-2xl sm:text-3xl">Log</h1>
      <p className="mt-1 text-sm text-muted">
        Personal and business images in one stack. A round does not list until the client sends
        back — and listing itself is not ready yet.
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Stat label="Week" value={`${week.length}/100`} />
        <Stat label="Business" value={String(biz)} />
        <Stat label="Personal" value={String(per)} />
      </div>
      <div className="mt-5 flex rounded-lg bg-surface p-1">
        {(
          [
            ["all", "Both"],
            ["business", "Business"],
            ["personal", "Personal"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setLane(id)}
            className={cn(
              "h-8 flex-1 rounded-md text-xs font-medium",
              lane === id ? "bg-raised text-fg" : "text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <ol className="mt-5 flex flex-col">
        {visible.map((e) => (
          <LogRow key={e.id} event={e} />
        ))}
      </ol>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-3">
      <div className="text-[10px] tracking-[0.16em] text-subtle uppercase whitespace-nowrap">
        {label}
      </div>
      <div className="mt-1 font-mono text-lg tabular-nums">{value}</div>
    </div>
  );
}

function LogRow({ event }: { event: LogEvent }) {
  return (
    <li className="flex gap-3 border-b border-border py-3">
      <div className="w-16 shrink-0 font-mono text-[10px] text-subtle tabular-nums">
        {new Date(event.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        <div className="mt-0.5">
          {new Date(event.at).toLocaleDateString([], { month: "short", day: "numeric" })}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-wider text-subtle uppercase">
          <span>{event.type}</span>
          <span>{event.ledger}</span>
          <span>{event.actor}</span>
          {event.clientId ? <span>{event.clientId}</span> : null}
        </div>
        <p className="mt-0.5 text-sm leading-snug">{event.message}</p>
      </div>
    </li>
  );
}
