import type { LowLevelAnalysis, PaletteSwatch } from "./types";
import { aspectLabel } from "./image-utils";

function hex(r: number, g: number, b: number) {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function luma(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export function analyzeLowLevel(img: HTMLImageElement): LowLevelAnalysis {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return {
      palette: [],
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
      temperature: "neutral",
      histogram: Array(24).fill(0),
      orientation:
        img.width === img.height
          ? "square"
          : img.width > img.height
            ? "landscape"
            : "portrait",
      aspectLabel: aspectLabel(img.width, img.height),
    };
  }
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  let sumY = 0;
  let sumY2 = 0;
  let sumSat = 0;
  let sumR = 0;
  let sumB = 0;
  const hist = Array(24).fill(0);
  const n = size * size;
  let edge = 0;

  for (let i = 0, p = 0; i < n; i++, p += 4) {
    const r = data[p]!;
    const g = data[p + 1]!;
    const b = data[p + 2]!;
    const y = luma(r, g, b);
    sumY += y;
    sumY2 += y * y;
    sumR += r;
    sumB += b;
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    sumSat += max === 0 ? 0 : (max - min) / max;
    const bin = Math.min(23, Math.floor(y * 24));
    hist[bin]! += 1;
    const q = (v: number) => Math.round(v / 24) * 24;
    const key = `${q(r)}:${q(g)}:${q(b)}`;
    const rec = buckets.get(key);
    if (rec) rec.n += 1;
    else buckets.set(key, { r: q(r), g: q(g), b: q(b), n: 1 });

    if (i % size !== size - 1) {
      const r2 = data[p + 4]!;
      const g2 = data[p + 5]!;
      const b2 = data[p + 6]!;
      edge += Math.abs(y - luma(r2, g2, b2));
    }
    if (i < n - size) {
      const r2 = data[p + size * 4]!;
      const g2 = data[p + size * 4 + 1]!;
      const b2 = data[p + size * 4 + 2]!;
      edge += Math.abs(y - luma(r2, g2, b2));
    }
  }

  const mean = sumY / n;
  const variance = Math.max(0, sumY2 / n - mean * mean);
  const contrast = Math.min(1, Math.sqrt(variance) * 2.4);
  const sharpness = Math.min(1, (edge / n) * 3.2);
  const meanR = sumR / n;
  const meanB = sumB / n;
  const delta = meanR - meanB;
  const temperature = delta > 12 ? "warm" : delta < -12 ? "cool" : "neutral";

  const palette: PaletteSwatch[] = [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, 7)
    .map((s) => ({
      hex: hex(Math.min(255, s.r), Math.min(255, s.g), Math.min(255, s.b)),
      pct: s.n / n,
    }));

  const ratio = img.width / img.height;
  const orientation =
    Math.abs(ratio - 1) < 0.05 ? "square" : ratio > 1 ? "landscape" : "portrait";

  return {
    palette,
    brightness: mean,
    contrast,
    saturation: sumSat / n,
    sharpness,
    temperature,
    histogram: hist.map((v) => v / n),
    orientation,
    aspectLabel: aspectLabel(img.width, img.height),
  };
}
