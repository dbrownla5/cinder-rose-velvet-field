import type { CatalogItem, DupeRecord, ImageMeta } from "./types";

export const CONTENT_HAMMING_MAX = 8;

export function hammingHex(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return 64;
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    let x = parseInt(a[i]!, 16) ^ parseInt(b[i]!, 16);
    while (x) {
      n += x & 1;
      x >>= 1;
    }
  }
  return n;
}

export function contentHashFromImage(img: HTMLImageElement) {
  const w = 9;
  const h = 8;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "0".repeat(16);
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  let bits = 0n;
  let bit = 0n;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      const j = (y * w + x + 1) * 4;
      const l1 = 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
      const l2 = 0.299 * data[j]! + 0.587 * data[j + 1]! + 0.114 * data[j + 2]!;
      if (l1 > l2) bits |= 1n << bit;
      bit += 1n;
    }
  }
  return bits.toString(16).padStart(16, "0");
}

export function exifAccuracy(meta?: ImageMeta | null, item?: Pick<CatalogItem, "width" | "height" | "lowLevel" | "bytes">) {
  if (!meta) return 0;
  let s = 0;
  if (meta.takenSource === "original") s += 40;
  else if (meta.takenSource === "modify") s += 12;
  if (meta.make) s += 16;
  if (meta.model) s += 12;
  if (meta.lens) s += 8;
  if (meta.iso != null) s += 6;
  if (meta.aperture) s += 6;
  if (meta.shutter) s += 6;
  if (meta.focalMm != null) s += 6;
  if (meta.hasGps) s += 8;
  const bytes = meta.sourceBytes || item?.bytes || 0;
  if (bytes > 0) s += Math.min(18, Math.log2(bytes) - 10);
  const px = (item?.width ?? 0) * (item?.height ?? 0);
  if (px > 0) s += Math.min(14, Math.log2(px) - 16);
  if (item?.lowLevel) s += Math.round(item.lowLevel.sharpness * 10);
  return Math.max(0, Math.round(s));
}

function aspectClose(a: CatalogItem, b: CatalogItem) {
  if (!a.width || !a.height || !b.width || !b.height) return true;
  const ra = a.width / a.height;
  const rb = b.width / b.height;
  return Math.abs(ra - rb) / Math.max(ra, rb) < 0.12;
}

function samePhoto(a: CatalogItem, b: CatalogItem): DupeRecord["kind"] | null {
  const ha = a.meta?.hashSha256;
  const hb = b.meta?.hashSha256;
  if (ha && hb && ha === hb) return "hash";
  const ca = a.meta?.contentHash;
  const cb = b.meta?.contentHash;
  if (ca && cb && hammingHex(ca, cb) <= CONTENT_HAMMING_MAX && aspectClose(a, b)) return "content";
  return null;
}

function pickKeeper(cluster: CatalogItem[]) {
  return [...cluster].sort((a, b) => {
    const sa = exifAccuracy(a.meta, a);
    const sb = exifAccuracy(b.meta, b);
    if (sb !== sa) return sb - sa;
    const pa = a.width * a.height;
    const pb = b.width * b.height;
    if (pb !== pa) return pb - pa;
    const ba = a.meta?.sourceBytes ?? a.bytes;
    const bb = b.meta?.sourceBytes ?? b.bytes;
    if (bb !== ba) return bb - ba;
    return a.createdAt - b.createdAt;
  })[0]!;
}

/** Cluster by exact SHA-256 or near content hash. Keep the richest EXIF. Never delete extras. */
export function markDupes(items: CatalogItem[]): CatalogItem[] {
  const n = items.length;
  const parent = items.map((_, i) => i);
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]!]!;
      i = parent[i]!;
    }
    return i;
  };
  const unite = (i: number, j: number) => {
    const a = find(i);
    const b = find(j);
    if (a !== b) parent[a] = b;
  };

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (samePhoto(items[i]!, items[j]!)) unite(i, j);
    }
  }

  const clusters = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const r = find(i);
    const list = clusters.get(r) ?? [];
    list.push(i);
    clusters.set(r, list);
  }

  const next = items.map((item) => ({ ...item, dupe: undefined as DupeRecord | undefined }));
  for (const idxs of clusters.values()) {
    if (idxs.length < 2) continue;
    const cluster = idxs.map((i) => next[i]!);
    const keeper = pickKeeper(cluster);
    const keeperScore = exifAccuracy(keeper.meta, keeper);
    const kind =
      cluster.some(
        (c) => c.id !== keeper.id && c.meta?.hashSha256 && c.meta.hashSha256 === keeper.meta?.hashSha256,
      )
        ? "hash"
        : "content";
    for (const i of idxs) {
      const item = next[i]!;
      const score = exifAccuracy(item.meta, item);
      const extra = item.id !== keeper.id;
      const dist =
        item.meta?.contentHash && keeper.meta?.contentHash
          ? hammingHex(item.meta.contentHash, keeper.meta.contentHash)
          : undefined;
      const rec: DupeRecord = {
        kind: item.meta?.hashSha256 && item.meta.hashSha256 === keeper.meta?.hashSha256 ? "hash" : kind,
        ofId: keeper.id,
        ofIntake: keeper.intakeCode,
        score,
        keeperScore,
        distance: dist,
        status: extra ? "extra" : "keeper",
        reason: extra
          ? `Same ${item.meta?.hashSha256 === keeper.meta?.hashSha256 ? "bytes" : "content"} as ${keeper.intakeCode ?? keeper.id} · weaker EXIF (${score} vs ${keeperScore})`
          : `Canonical · richest EXIF in a ${idxs.length}-plate match`,
      };
      const tags = extra
        ? [...item.tags.filter((t) => t !== "possible-duplicate" && t !== "duplicate-extra" && t !== "duplicate-keeper"), "duplicate-extra"]
        : [...item.tags.filter((t) => t !== "possible-duplicate" && t !== "duplicate-extra" && t !== "duplicate-keeper"), "duplicate-keeper"];
      next[i] = { ...item, dupe: rec, tags };
    }
  }
  return next;
}

export function dupeLabel(d?: DupeRecord | null) {
  if (!d) return "—";
  if (d.status === "keeper") return "Keeper";
  return d.kind === "hash" ? "Extra · hash" : "Extra · content";
}
