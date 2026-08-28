/** Catalog naming template — one SKU per lot, one intake code per plate. */

const KIND_CODE: Record<string, string> = {
  coat: "COAT",
  jacket: "JKT",
  blazer: "BLZ",
  suit: "SUIT",
  dress: "DRESS",
  skirt: "SKRT",
  jumpsuit: "JUMP",
  top: "TOP",
  knit: "KNIT",
  hoodie: "HOOD",
  pants: "PANT",
  jeans: "JEAN",
  shorts: "SHRT",
  shoes: "SHOE",
  boots: "BOOT",
  sneakers: "SNEK",
  bag: "BAG",
  belt: "BELT",
  scarf: "SCRF",
  hat: "HAT",
  jewelry: "JWL",
  watch: "WATCH",
  other: "ITEM",
};

function letters(s: string, n: number) {
  const slug = s.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return (slug || "X").slice(0, n).padEnd(n, "X");
}

export function brandCode(brand?: string | null) {
  const raw = (brand ?? "").trim();
  if (!raw || /^unbranded$|^none$|^unknown$/i.test(raw)) return "UNB";
  const words = raw
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return words.map((w) => w[0]!).join("").slice(0, 4);
  return letters(words[0] ?? "UNB", 4);
}

export function kindCode(kind?: string | null) {
  const k = (kind ?? "item").toLowerCase().trim();
  if (KIND_CODE[k]) return KIND_CODE[k];
  return letters(k, 5);
}

export function colorCode(color?: string | null) {
  const raw = (color ?? "").trim();
  if (!raw) return "UNKN";
  const words = raw
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (letters(words[0]!, 2) + letters(words[1]!, 2)).slice(0, 4);
  return letters(words[0]!, 4);
}

export function lotPrefix(brand?: string | null, kind?: string | null, colorway?: string | null) {
  return `${brandCode(brand)}-${kindCode(kind)}-${colorCode(colorway)}`;
}

export function formatLotCode(prefix: string, seq: number) {
  return `${prefix}-${String(Math.max(1, seq)).padStart(4, "0")}`;
}

export function prettyCatalogName(brand?: string | null, style?: string | null, colorway?: string | null) {
  const b = (brand ?? "").trim() || "Unbranded";
  return [b, (style ?? "").trim(), (colorway ?? "").trim()].filter(Boolean).join(" ");
}

export function yyyymmdd(at = Date.now()) {
  const d = new Date(at);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dgt = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${dgt}`;
}

export function formatIntakeCode(day: string, seq: number) {
  return `LB-${day}-${String(Math.max(1, seq)).padStart(4, "0")}`;
}

export function inboxLotCode(day: string, seq: number) {
  return `INB-${day}-${String(Math.max(1, seq)).padStart(4, "0")}`;
}

export const SKU_TEMPLATE = "BRAND-KIND-COLOR-0001";
export const INTAKE_TEMPLATE = "LB-YYYYMMDD-0001";
