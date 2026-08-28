import { useEffect, useMemo, useState } from "react";
import { Copy, LayoutGrid, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listCatalog, type CatalogLotRow, type CatalogPlateRow } from "@/lib/catalog";
import { INTAKE_TEMPLATE, SKU_TEMPLATE } from "@/lib/catalog-code";
import { cn } from "@/lib/cn";
import { useStudio } from "@/lib/store";
import type { CatalogItem } from "@/lib/types";

function copy(text: string) {
  void navigator.clipboard.writeText(text);
}

function localLotRows(items: CatalogItem[]): CatalogLotRow[] {
  const byCode = new Map<string, CatalogItem[]>();
  for (const item of items) {
    const code = item.catalogCode ?? item.intakeCode ?? item.id;
    const list = byCode.get(code) ?? [];
    list.push(item);
    byCode.set(code, list);
  }
  return [...byCode.entries()].map(([code, members]) => {
    const hero = members[0]!;
    const g = hero.garment;
    return {
      id: hero.groupId ?? hero.id,
      catalog_code: code,
      pretty_name: g?.isGarment
        ? [g.brandVisible || "Unbranded", g.styleName || g.kind, g.colorway].filter(Boolean).join(" ")
        : (hero.highLevel?.title ?? hero.name),
      brand: g?.brandVisible ?? null,
      kind: g?.kind ?? null,
      style_name: g?.styleName ?? null,
      colorway: g?.colorway ?? null,
      condition: g?.condition ?? null,
      lane: hero.lane,
      collection: hero.collectionId,
      status: hero.edit?.status && hero.edit.status !== "none" ? hero.edit.status : hero.collectionId === "inbox" ? "intake" : "ready",
      plate_count: members.length,
      created_at: new Date(hero.createdAt).toISOString(),
      updated_at: new Date(hero.createdAt).toISOString(),
    };
  });
}

function localPlateRows(items: CatalogItem[]): CatalogPlateRow[] {
  return items.map((item) => ({
    id: item.id,
    lot_id: item.groupId ?? item.id,
    intake_code: item.intakeCode ?? item.id,
    role: item.garment?.photoRole ?? null,
    lane: item.lane,
    bytes: item.bytes,
    width: item.width,
    height: item.height,
    edit_status: item.edit?.status ?? "none",
    created_at: new Date(item.createdAt).toISOString(),
    taken_at: item.meta?.takenAt ?? null,
    camera: [item.meta?.make, item.meta?.model].filter(Boolean).join(" ") || null,
    iso: item.meta?.iso ?? null,
    focal_mm: item.meta?.focalMm != null ? Math.round(item.meta.focalMm) : null,
    has_gps: item.meta?.hasGps ?? false,
    hash_sha256: item.meta?.hashSha256 ?? null,
    aperture: item.meta?.aperture ?? null,
    shutter: item.meta?.shutter ?? null,
    content_hash: item.meta?.contentHash ?? null,
    dupe_of: item.dupe?.status === "extra" ? item.dupe.ofId : null,
    dupe_kind: item.dupe?.kind ?? null,
    exif_score: item.dupe?.score ?? null,
  }));
}

export function CatalogSheet({ onDump }: { onDump: () => void }) {
  const items = useStudio((s) => s.items);
  const select = useStudio((s) => s.select);
  const setRailMode = useStudio((s) => s.setRailMode);
  const [lots, setLots] = useState<CatalogLotRow[]>([]);
  const [plates, setPlates] = useState<CatalogPlateRow[]>([]);
  const [tab, setTab] = useState<"lots" | "plates">("lots");
  const [q, setQ] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    void listCatalog()
      .then((snap) => {
        if (!alive) return;
        setLots(snap.lots);
        setPlates(snap.plates);
        setLoaded(true);
      })
      .catch(() => {
        if (!alive) return;
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [items]);

  const lotRows = lots.length ? lots : localLotRows(items);
  const plateRows = plates.length ? plates : localPlateRows(items);

  const filteredLots = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return lotRows;
    return lotRows.filter((r) =>
      [r.catalog_code, r.pretty_name, r.brand, r.kind, r.style_name, r.colorway, r.lane, r.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(t),
    );
  }, [lotRows, q]);

  const filteredPlates = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return plateRows;
    return plateRows.filter((r) =>
      [r.intake_code, r.role, r.lane, r.edit_status, r.id].join(" ").toLowerCase().includes(t),
    );
  }, [plateRows, q]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border px-3 py-4 sm:px-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">Catalog</p>
            <h1 className="font-display text-2xl sm:text-3xl">Batch</h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Add photos first — no labels. Hash and content scan on drop; the plate with the
              richest EXIF is keeper. Extras stay filed. SKU: {SKU_TEMPLATE}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setRailMode("grid")}>
              <LayoutGrid className="size-3.5" />
              Photos
            </Button>
            <Button size="sm" onClick={onDump}>
              <Upload className="size-3.5" />
              Add photos
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex rounded-md bg-surface p-1">
            <button
              onClick={() => setTab("lots")}
              className={cn(
                "h-8 rounded-sm px-3 text-xs font-medium",
                tab === "lots" ? "bg-raised text-fg" : "text-muted",
              )}
            >
              Lots
              <span className="ml-1.5 font-mono tabular-nums text-subtle">{filteredLots.length}</span>
            </button>
            <button
              onClick={() => setTab("plates")}
              className={cn(
                "h-8 rounded-sm px-3 text-xs font-medium",
                tab === "plates" ? "bg-raised text-fg" : "text-muted",
              )}
            >
              Plates
              <span className="ml-1.5 font-mono tabular-nums text-subtle">{filteredPlates.length}</span>
            </button>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter SKU, kind, color…"
            className="h-9 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-subtle"
          />
        </div>
        <p className="mt-2 font-mono text-[10px] text-subtle">
          Lot {SKU_TEMPLATE} · plate {INTAKE_TEMPLATE}
          {loaded ? "" : " · loading"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {tab === "lots" ? (
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
            <thead className="sticky top-0 z-10 bg-bg">
              <tr className="text-[10px] tracking-[0.14em] text-subtle uppercase">
                <th className="border-b border-border px-3 py-2 font-medium">SKU</th>
                <th className="border-b border-border px-3 py-2 font-medium">Name</th>
                <th className="border-b border-border px-3 py-2 font-medium">Kind</th>
                <th className="border-b border-border px-3 py-2 font-medium">Brand</th>
                <th className="border-b border-border px-3 py-2 font-medium">Color</th>
                <th className="border-b border-border px-3 py-2 font-medium">Lane</th>
                <th className="border-b border-border px-3 py-2 font-medium">Status</th>
                <th className="border-b border-border px-3 py-2 font-medium text-right">Plates</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-raised/60"
                  onClick={() => {
                    const hit = items.find((i) => i.catalogCode === row.catalog_code || i.groupId === row.id);
                    if (hit) select(hit.id);
                  }}
                >
                  <td className="border-b border-border px-3 py-2 font-mono text-xs whitespace-nowrap">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        copy(row.catalog_code);
                      }}
                    >
                      {row.catalog_code}
                      <Copy className="size-3 text-subtle" />
                    </button>
                  </td>
                  <td className="border-b border-border px-3 py-2">{row.pretty_name}</td>
                  <td className="border-b border-border px-3 py-2 text-muted">{row.kind ?? "—"}</td>
                  <td className="border-b border-border px-3 py-2 text-muted">{row.brand ?? "—"}</td>
                  <td className="border-b border-border px-3 py-2 text-muted">{row.colorway ?? "—"}</td>
                  <td className="border-b border-border px-3 py-2 text-muted">{row.lane}</td>
                  <td className="border-b border-border px-3 py-2 text-muted">{row.status}</td>
                  <td className="border-b border-border px-3 py-2 text-right font-mono tabular-nums">
                    {row.plate_count}
                  </td>
                </tr>
              ))}
              {!filteredLots.length ? (
                <tr>
                  <td colSpan={8} className="px-3 py-12 text-center text-muted">
                    Catalog is empty. Add photos — names are optional and come later.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[920px] border-separate border-spacing-0 text-left text-sm">
            <thead className="sticky top-0 z-10 bg-bg">
              <tr className="text-[10px] tracking-[0.14em] text-subtle uppercase">
                <th className="border-b border-border px-3 py-2 font-medium">Intake</th>
                <th className="border-b border-border px-3 py-2 font-medium">SKU</th>
                <th className="border-b border-border px-3 py-2 font-medium">Taken</th>
                <th className="border-b border-border px-3 py-2 font-medium">Camera</th>
                <th className="border-b border-border px-3 py-2 font-medium">Dupe</th>
                <th className="border-b border-border px-3 py-2 font-medium">Hash</th>
                <th className="border-b border-border px-3 py-2 font-medium">Lane</th>
                <th className="border-b border-border px-3 py-2 font-medium">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlates.map((row) => {
                const item = items.find((i) => i.id === row.id);
                const sku = item?.catalogCode ?? lots.find((l) => l.id === row.lot_id)?.catalog_code;
                const taken = row.taken_at ?? item?.meta?.takenAt;
                const camera =
                  row.camera ?? [item?.meta?.make, item?.meta?.model].filter(Boolean).join(" ");
                const hash = row.hash_sha256 ?? item?.meta?.hashSha256;
                return (
                  <tr
                    key={row.id}
                    className="cursor-pointer hover:bg-raised/60"
                    onClick={() => select(row.id)}
                  >
                    <td className="border-b border-border px-3 py-2 font-mono text-xs whitespace-nowrap">
                      {row.intake_code}
                    </td>
                    <td className="border-b border-border px-3 py-2 font-mono text-xs whitespace-nowrap">
                      {sku ?? "—"}
                    </td>
                    <td className="border-b border-border px-3 py-2 font-mono text-xs whitespace-nowrap text-muted">
                      {taken ? taken.replace("T", " ").slice(0, 16) : "—"}
                    </td>
                    <td className="border-b border-border px-3 py-2 text-muted">
                      {camera || "—"}
                    </td>
                    <td className="border-b border-border px-3 py-2 text-muted">
                      {item?.dupe
                        ? item.dupe.status === "keeper"
                          ? `Keeper · ${item.dupe.score}`
                          : `Extra · ${item.dupe.kind}`
                        : row.dupe_of
                          ? "Extra"
                          : "—"}
                    </td>
                    <td className="border-b border-border px-3 py-2 font-mono text-xs text-muted">
                      {hash ? hash.slice(0, 12) : "—"}
                    </td>
                    <td className="border-b border-border px-3 py-2 text-muted">{row.lane}</td>
                    <td className="border-b border-border px-3 py-2 text-muted">{row.edit_status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
