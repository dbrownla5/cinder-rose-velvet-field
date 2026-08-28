import type { ImageMeta } from "./types";

type ExifFields = {
  orientation: number;
  make: string | null;
  model: string | null;
  lens: string | null;
  dateTime: string | null;
  dateTimeOriginal: string | null;
  iso: number | null;
  aperture: string | null;
  shutter: string | null;
  focalMm: number | null;
  hasGps: boolean;
};

const EMPTY: ExifFields = {
  orientation: 1,
  make: null,
  model: null,
  lens: null,
  dateTime: null,
  dateTimeOriginal: null,
  iso: null,
  aperture: null,
  shutter: null,
  focalMm: null,
  hasGps: false,
};

function ascii(view: DataView, offset: number, len: number) {
  let s = "";
  const end = Math.min(view.byteLength, offset + len);
  for (let i = offset; i < end; i++) {
    const c = view.getUint8(i);
    if (c === 0) break;
    if (c >= 32 && c < 127) s += String.fromCharCode(c);
  }
  return s.trim() || null;
}

function rational(view: DataView, offset: number, le: boolean) {
  if (offset + 8 > view.byteLength) return null;
  const n = le ? view.getUint32(offset, true) : view.getUint32(offset, false);
  const d = le ? view.getUint32(offset + 4, true) : view.getUint32(offset + 4, false);
  if (!d) return null;
  return n / d;
}

function exifDateToIso(raw: string | null) {
  if (!raw) return null;
  const m = raw.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) return raw;
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
}

function fmtAperture(n: number | null) {
  if (n == null || !Number.isFinite(n)) return null;
  return `f/${Number.isInteger(n) ? n : n.toFixed(1)}`;
}

function fmtShutter(n: number | null) {
  if (n == null || !Number.isFinite(n) || n <= 0) return null;
  if (n >= 1) return `${n.toFixed(n >= 10 ? 0 : 1)}s`;
  const den = Math.round(1 / n);
  return `1/${den}s`;
}

function readIfd(
  view: DataView,
  tiff: number,
  ifd: number,
  le: boolean,
  into: ExifFields,
  depth = 0,
) {
  if (depth > 3 || ifd + 2 > view.byteLength) return;
  const u16 = (o: number) => (le ? view.getUint16(o, true) : view.getUint16(o, false));
  const u32 = (o: number) => (le ? view.getUint32(o, true) : view.getUint32(o, false));
  const entries = u16(ifd);
  for (let i = 0; i < entries; i++) {
    const e = ifd + 2 + i * 12;
    if (e + 12 > view.byteLength) break;
    const tag = u16(e);
    const type = u16(e + 2);
    const count = u32(e + 4);
    const inline = e + 8;
    const size = type === 3 ? 2 : type === 4 || type === 9 ? 4 : type === 5 || type === 10 ? 8 : 1;
    const dataOff = count * size > 4 ? tiff + u32(inline) : inline;
    if (tag === 0x0112 && type === 3) into.orientation = u16(inline) || 1;
    else if (tag === 0x010f) into.make = ascii(view, dataOff, count);
    else if (tag === 0x0110) into.model = ascii(view, dataOff, count);
    else if (tag === 0x0132) into.dateTime = ascii(view, dataOff, count);
    else if (tag === 0x9003) into.dateTimeOriginal = ascii(view, dataOff, count);
    else if (tag === 0x8827) into.iso = type === 3 ? u16(inline) : u32(inline);
    else if (tag === 0x829d) into.aperture = fmtAperture(rational(view, dataOff, le));
    else if (tag === 0x829a) into.shutter = fmtShutter(rational(view, dataOff, le));
    else if (tag === 0x920a) {
      const mm = rational(view, dataOff, le);
      into.focalMm = mm != null ? Math.round(mm * 10) / 10 : null;
    } else if (tag === 0xa434) into.lens = ascii(view, dataOff, count);
    else if (tag === 0x8769) readIfd(view, tiff, tiff + u32(inline), le, into, depth + 1);
    else if (tag === 0x8825) into.hasGps = true;
  }
}

export function parseJpegExif(buf: ArrayBuffer): ExifFields {
  const view = new DataView(buf);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return { ...EMPTY };
  let offset = 2;
  const out = { ...EMPTY };
  while (offset + 4 < view.byteLength) {
    const marker = view.getUint16(offset);
    if ((marker & 0xff00) !== 0xff00) break;
    const size = view.getUint16(offset + 2);
    if (marker === 0xffe1 && offset + 8 < view.byteLength) {
      const code = String.fromCharCode(
        view.getUint8(offset + 4),
        view.getUint8(offset + 5),
        view.getUint8(offset + 6),
        view.getUint8(offset + 7),
      );
      if (code === "Exif") {
        const tiff = offset + 10;
        if (tiff + 8 > view.byteLength) break;
        const le = view.getUint16(tiff) === 0x4949;
        const u32 = (o: number) => (le ? view.getUint32(o, true) : view.getUint32(o, false));
        readIfd(view, tiff, tiff + u32(tiff + 4), le, out);
        break;
      }
    }
    if (size < 2) break;
    offset += 2 + size;
  }
  return out;
}

export async function sha256Hex(buf: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function extractImageMeta(file: File): Promise<ImageMeta> {
  const buf = await file.arrayBuffer();
  const exif = parseJpegExif(buf);
  const hash = await sha256Hex(buf);
  return {
    takenAt: exifDateToIso(exif.dateTimeOriginal ?? exif.dateTime),
    takenSource: exif.dateTimeOriginal ? "original" : exif.dateTime ? "modify" : null,
    make: exif.make,
    model: exif.model,
    lens: exif.lens,
    iso: exif.iso,
    aperture: exif.aperture,
    shutter: exif.shutter,
    focalMm: exif.focalMm,
    orientation: exif.orientation,
    hasGps: exif.hasGps,
    hashSha256: hash,
    contentHash: "",
    sourceMime: file.type || "application/octet-stream",
    sourceBytes: file.size,
    extractedAt: Date.now(),
  };
}

export function cameraLabel(meta?: ImageMeta | null) {
  if (!meta) return null;
  const line = [meta.make, meta.model].filter(Boolean).join(" ").trim();
  return line || null;
}
