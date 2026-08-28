import { parseJpegExif } from "./exif";

export async function readJpegOrientation(file: File): Promise<number> {
  if (!/jpe?g/i.test(file.type) && !/\.jpe?g$/i.test(file.name)) return 1;
  const buf = await file.arrayBuffer();
  return parseJpegExif(buf).orientation || 1;
}

export function drawOriented(
  img: HTMLImageElement,
  orientation: number,
  maxEdge = 2400,
): { canvas: HTMLCanvasElement; width: number; height: number } {
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  const swap = orientation >= 5 && orientation <= 8;
  const scale = Math.min(1, maxEdge / Math.max(srcW, srcH));
  const w = Math.max(1, Math.round(srcW * scale));
  const h = Math.max(1, Math.round(srcH * scale));
  const canvas = document.createElement("canvas");
  canvas.width = swap ? h : w;
  canvas.height = swap ? w : h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, w, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, w, h);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, h);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, h, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, h, w);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, w);
      break;
    default:
      break;
  }
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas, width: canvas.width, height: canvas.height };
}

export async function prepImageFile(file: File): Promise<{
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  orientation: number;
}> {
  const orientation = await readJpegOrientation(file);
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  const { canvas, width, height } = drawOriented(img, orientation, 2400);
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not encode plate"))),
      "image/jpeg",
      0.88,
    );
  });
  return {
    blob,
    dataUrl: canvas.toDataURL("image/jpeg", 0.88),
    width,
    height,
    orientation,
  };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = src;
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function drawToCanvas(
  img: CanvasImageSource,
  w: number,
  h: number,
  type = "image/jpeg",
  quality = 0.82,
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL(type, quality);
}

export function makeThumb(img: HTMLImageElement, maxEdge = 360): string {
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  return drawToCanvas(img, w, h, "image/jpeg", 0.72);
}

export function enhancePlate(
  img: HTMLImageElement,
  recipe: "resell-batch" | "social-minimal",
  maxEdge = 1600,
): string {
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
  const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
  const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.filter =
    recipe === "resell-batch"
      ? "contrast(1.12) saturate(1.05) brightness(1.04)"
      : "contrast(1.04) saturate(1.02) brightness(1.03)";
  ctx.drawImage(img, 0, 0, w, h);
  ctx.filter = "none";
  return canvas.toDataURL("image/jpeg", 0.88);
}

export function compressForApi(img: HTMLImageElement, maxEdge = 1280): string {
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  return drawToCanvas(img, w, h, "image/jpeg", 0.8);
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function aspectLabel(width: number, height: number): string {
  if (!width || !height) return "—";
  const g = gcd(width, height);
  let a = Math.round(width / g);
  let b = Math.round(height / g);
  const ratio = width / height;
  const known: [number, number, number][] = [
    [1, 1, 1],
    [3 / 2, 3, 2],
    [2 / 3, 2, 3],
    [4 / 3, 4, 3],
    [3 / 4, 3, 4],
    [16 / 9, 16, 9],
    [9 / 16, 9, 16],
    [5 / 4, 5, 4],
    [4 / 5, 4, 5],
  ];
  for (const [r, x, y] of known) {
    if (Math.abs(ratio - r) < 0.04) return `${x}:${y}`;
  }
  if (a > 21 || b > 21) {
    a = Math.round(ratio * 10);
    b = 10;
  }
  return `${a}:${b}`;
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}