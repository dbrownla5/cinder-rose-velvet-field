import type {
  CollectionId,
  ConditionId,
  LaneId,
  LedgerId,
  PhotoRole,
  ResellCategory,
  WorkAreaId,
} from "./types";

export const COLLECTIONS: {
  id: CollectionId;
  label: string;
  hint: string;
}[] = [
  { id: "inbox", label: "Inbox", hint: "Unsorted intake" },
  { id: "garments", label: "Garments", hint: "Clothes to sell" },
  { id: "accessories", label: "Accessories", hint: "Bags, shoes, jewelry, watches" },
  { id: "social", label: "Social", hint: "Content for socials — not inventory" },
  { id: "personal", label: "Log", hint: "Camera-roll notes, not for resale" },
  { id: "archive", label: "Archive", hint: "Listed, done, or reference" },
];

export const LANES: { id: LaneId; label: string; hint: string }[] = [
  { id: "resell", label: "Resell", hint: "Items backlogged to sell" },
  { id: "social", label: "Social", hint: "Content of you for socials" },
  { id: "log", label: "Log", hint: "Personal notes, rooms, field shots" },
];

export const WORK_AREAS: {
  id: WorkAreaId;
  label: string;
  action: string;
  hint: string;
}[] = [
  {
    id: "resale",
    label: "Resale",
    action: "Pass selected lots to valuation",
    hint: "Full report after you pick the lot, then human approval before a listing template",
  },
  {
    id: "real-estate",
    label: "Real estate",
    action: "Run listing workflow",
    hint: "Headline, listing copy, alt text, set notes",
  },
  {
    id: "product",
    label: "Product",
    action: "Run catalog workflow",
    hint: "Title, bullets, attributes, alt text",
  },
  {
    id: "inspection",
    label: "Inspection",
    action: "Run field notes",
    hint: "Finding, severity, punch list — no verdicts",
  },
  {
    id: "editorial",
    label: "Editorial",
    action: "Run caption workflow",
    hint: "Caption, alt, crop notes, usage",
  },
  {
    id: "brand",
    label: "Brand",
    action: "Run brand audit",
    hint: "Palette tokens, type, layout, contrast",
  },
  {
    id: "archive",
    label: "Archive",
    action: "Run catalog record",
    hint: "Object record, condition, subject headings",
  },
];

export const CONDITIONS: { id: ConditionId; label: string; hint: string }[] = [
  { id: "nwt", label: "NWT", hint: "New with tags visible" },
  { id: "like-new", label: "Like new", hint: "No tags, no wear" },
  { id: "excellent", label: "Excellent", hint: "Light wear" },
  { id: "good", label: "Good", hint: "Normal wear, listable" },
  { id: "fair", label: "Fair", hint: "Obvious wear" },
  { id: "as-is", label: "As-is", hint: "Damage is the story" },
];

export const RESELL_CATEGORIES: { id: ResellCategory; label: string }[] = [
  { id: "contemporary", label: "Contemporary" },
  { id: "designer", label: "Designer" },
  { id: "vintage", label: "Vintage" },
  { id: "streetwear", label: "Streetwear" },
  { id: "workwear", label: "Workwear" },
  { id: "outdoor", label: "Outdoor" },
  { id: "formal", label: "Formal" },
  { id: "kids", label: "Kids" },
  { id: "accessories", label: "Accessories" },
  { id: "shoes", label: "Shoes" },
  { id: "bags", label: "Bags" },
  { id: "jewelry", label: "Jewelry" },
  { id: "home-textile", label: "Home textile" },
  { id: "other", label: "Other" },
];

export const PHOTO_ROLES: { id: PhotoRole; label: string }[] = [
  { id: "hero-front", label: "Front" },
  { id: "hero-back", label: "Back" },
  { id: "side", label: "Side" },
  { id: "detail", label: "Detail" },
  { id: "label", label: "Label" },
  { id: "hangtag", label: "Hangtag" },
  { id: "defect", label: "Defect" },
  { id: "fit-on-body", label: "On body" },
  { id: "in-situ", label: "In situ" },
  { id: "flat-lay", label: "Flat lay" },
  { id: "other", label: "Other" },
];

export const LEDGERS: { id: LedgerId; label: string; hint: string }[] = [
  { id: "business", label: "Business", hint: "Client lots and resale" },
  { id: "personal", label: "Personal", hint: "Camera-roll catch-up" },
];

export function collectionLabel(id: CollectionId) {
  return COLLECTIONS.find((c) => c.id === id)?.label ?? id;
}

export function laneLabel(id: LaneId) {
  return LANES.find((l) => l.id === id)?.label ?? id;
}

export function workAreaMeta(id: WorkAreaId) {
  return WORK_AREAS.find((w) => w.id === id);
}

export function conditionLabel(id: ConditionId) {
  return CONDITIONS.find((c) => c.id === id)?.label ?? id;
}

export function roleLabel(id: PhotoRole) {
  return PHOTO_ROLES.find((r) => r.id === id)?.label ?? id;
}

export function money(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export function moneyOrDash(n: number | null | undefined, currency = "USD") {
  if (n == null || !Number.isFinite(n)) return "—";
  return money(n, currency);
}
