import { createServerFn } from "@tanstack/react-start";
import {
  formatIntakeCode,
  formatLotCode,
  inboxLotCode,
  lotPrefix,
  prettyCatalogName,
  yyyymmdd,
} from "./catalog-code";

export type CatalogLotRow = {
  id: string;
  catalog_code: string;
  pretty_name: string;
  brand: string | null;
  kind: string | null;
  style_name: string | null;
  colorway: string | null;
  condition: string | null;
  lane: string;
  collection: string;
  status: string;
  plate_count: number;
  created_at: string;
  updated_at: string;
};

export type CatalogPlateRow = {
  id: string;
  lot_id: string;
  intake_code: string;
  role: string | null;
  lane: string;
  bytes: number;
  width: number;
  height: number;
  edit_status: string;
  created_at: string;
  taken_at: string | null;
  camera: string | null;
  iso: number | null;
  focal_mm: number | null;
  has_gps: boolean;
  hash_sha256: string | null;
  aperture: string | null;
  shutter: string | null;
  content_hash: string | null;
  dupe_of: string | null;
  dupe_kind: string | null;
  exif_score: number | null;
};

export type CatalogSnapshot = {
  lots: CatalogLotRow[];
  plates: CatalogPlateRow[];
};

export type LotWrite = {
  id: string;
  catalog_code: string;
  pretty_name: string;
  brand: string | null;
  kind: string | null;
  style_name: string | null;
  colorway: string | null;
  condition: string | null;
  lane: string;
  collection: string;
  status: string;
  plate_count: number;
};

export type PlateWrite = {
  id: string;
  lot_id: string;
  intake_code: string;
  role: string | null;
  lane: string;
  bytes: number;
  width: number;
  height: number;
  edit_status: string;
  taken_at?: string | null;
  camera?: string | null;
  iso?: number | null;
  focal_mm?: number | null;
  has_gps?: boolean;
  hash_sha256?: string | null;
  aperture?: string | null;
  shutter?: string | null;
  content_hash?: string | null;
  dupe_of?: string | null;
  dupe_kind?: string | null;
  exif_score?: number | null;
};

const SAMPLE_LOTS: LotWrite[] = [
  {
    id: "group-coat",
    catalog_code: "UNB-COAT-CHAR-0001",
    pretty_name: "Unbranded wool coat charcoal",
    brand: "Unbranded",
    kind: "coat",
    style_name: "wool coat",
    colorway: "charcoal",
    condition: "excellent",
    lane: "resell",
    collection: "garments",
    status: "ready",
    plate_count: 1,
  },
  {
    id: "group-watch",
    catalog_code: "UNB-WATCH-MABL-0001",
    pretty_name: "Unbranded watch matte black",
    brand: "Unbranded",
    kind: "watch",
    style_name: "watch",
    colorway: "matte black",
    condition: "like-new",
    lane: "resell",
    collection: "accessories",
    status: "paused",
    plate_count: 1,
  },
  {
    id: "group-coffee",
    catalog_code: "SOC-STILL-MRBL-0001",
    pretty_name: "Pour-over still life",
    brand: null,
    kind: "still",
    style_name: "still life",
    colorway: "marble",
    condition: null,
    lane: "social",
    collection: "social",
    status: "intake",
    plate_count: 1,
  },
  {
    id: "group-living",
    catalog_code: "LOG-ROOM-OAKX-0001",
    pretty_name: "Sunlit living room",
    brand: null,
    kind: "room",
    style_name: "living room",
    colorway: "oak",
    condition: null,
    lane: "log",
    collection: "personal",
    status: "intake",
    plate_count: 1,
  },
  {
    id: "group-foundation",
    catalog_code: "LOG-WALL-CRCK-0001",
    pretty_name: "Hairline crack in concrete",
    brand: null,
    kind: "wall",
    style_name: "foundation",
    colorway: "crack",
    condition: null,
    lane: "log",
    collection: "personal",
    status: "intake",
    plate_count: 1,
  },
  {
    id: "group-fern",
    catalog_code: "LOG-ART-FERN-0001",
    pretty_name: "Framed botanical fern",
    brand: null,
    kind: "art",
    style_name: "botanical",
    colorway: "fern",
    condition: null,
    lane: "log",
    collection: "personal",
    status: "intake",
    plate_count: 1,
  },
];

const SAMPLE_PLATES: PlateWrite[] = [
  {
    id: "sample-coat",
    lot_id: "group-coat",
    intake_code: "LB-20260823-0001",
    role: "fit-on-body",
    lane: "resell",
    bytes: 470960,
    width: 0,
    height: 0,
    edit_status: "none",
  },
  {
    id: "sample-watch",
    lot_id: "group-watch",
    intake_code: "LB-20260823-0002",
    role: "hero-front",
    lane: "resell",
    bytes: 479929,
    width: 0,
    height: 0,
    edit_status: "recataloged",
  },
  {
    id: "sample-coffee",
    lot_id: "group-coffee",
    intake_code: "LB-20260823-0003",
    role: "in-situ",
    lane: "social",
    bytes: 359264,
    width: 0,
    height: 0,
    edit_status: "none",
  },
  {
    id: "sample-living-room",
    lot_id: "group-living",
    intake_code: "LB-20260823-0004",
    role: "in-situ",
    lane: "log",
    bytes: 773343,
    width: 0,
    height: 0,
    edit_status: "none",
  },
  {
    id: "sample-foundation",
    lot_id: "group-foundation",
    intake_code: "LB-20260823-0005",
    role: "defect",
    lane: "log",
    bytes: 1079258,
    width: 0,
    height: 0,
    edit_status: "none",
  },
  {
    id: "sample-fern",
    lot_id: "group-fern",
    intake_code: "LB-20260823-0006",
    role: "other",
    lane: "log",
    bytes: 609848,
    width: 0,
    height: 0,
    edit_status: "none",
  },
];

async function sql() {
  const { getSql } = await import("./db");
  return getSql();
}

async function nextSeq(prefix: string, count = 1) {
  const db = await sql();
  const existing = await db<{ next_n: number }>`select next_n from catalog_seq where prefix = ${prefix}`;
  if (!existing.length) {
    await db`insert into catalog_seq (prefix, next_n) values (${prefix}, ${count})`;
    return { start: 1, end: count };
  }
  const start = existing[0]!.next_n + 1;
  const end = existing[0]!.next_n + count;
  await db`update catalog_seq set next_n = ${end} where prefix = ${prefix}`;
  return { start, end };
}

async function upsertLot(lot: LotWrite) {
  const db = await sql();
  await db`
    insert into catalog_lots (
      id, catalog_code, pretty_name, brand, kind, style_name, colorway, condition,
      lane, collection, status, plate_count, updated_at
    ) values (
      ${lot.id}, ${lot.catalog_code}, ${lot.pretty_name}, ${lot.brand}, ${lot.kind},
      ${lot.style_name}, ${lot.colorway}, ${lot.condition}, ${lot.lane}, ${lot.collection},
      ${lot.status}, ${lot.plate_count}, now()
    )
    on conflict (id) do update set
      catalog_code = excluded.catalog_code,
      pretty_name = excluded.pretty_name,
      brand = excluded.brand,
      kind = excluded.kind,
      style_name = excluded.style_name,
      colorway = excluded.colorway,
      condition = excluded.condition,
      lane = excluded.lane,
      collection = excluded.collection,
      status = excluded.status,
      plate_count = excluded.plate_count,
      updated_at = now()
  `;
}

async function upsertPlate(plate: PlateWrite) {
  const db = await sql();
  await db`
    insert into catalog_plates (
      id, lot_id, intake_code, role, lane, bytes, width, height, edit_status,
      taken_at, camera, iso, focal_mm, has_gps, hash_sha256, aperture, shutter,
      content_hash, dupe_of, dupe_kind, exif_score
    ) values (
      ${plate.id}, ${plate.lot_id}, ${plate.intake_code}, ${plate.role}, ${plate.lane},
      ${plate.bytes}, ${plate.width}, ${plate.height}, ${plate.edit_status},
      ${plate.taken_at ?? null}, ${plate.camera ?? null}, ${plate.iso ?? null},
      ${plate.focal_mm ?? null}, ${plate.has_gps ?? false}, ${plate.hash_sha256 ?? null},
      ${plate.aperture ?? null}, ${plate.shutter ?? null}, ${plate.content_hash ?? null},
      ${plate.dupe_of ?? null}, ${plate.dupe_kind ?? null}, ${plate.exif_score ?? null}
    )
    on conflict (id) do update set
      lot_id = excluded.lot_id,
      intake_code = excluded.intake_code,
      role = excluded.role,
      lane = excluded.lane,
      bytes = excluded.bytes,
      width = excluded.width,
      height = excluded.height,
      edit_status = excluded.edit_status,
      taken_at = excluded.taken_at,
      camera = excluded.camera,
      iso = excluded.iso,
      focal_mm = excluded.focal_mm,
      has_gps = excluded.has_gps,
      hash_sha256 = excluded.hash_sha256,
      aperture = excluded.aperture,
      shutter = excluded.shutter,
      content_hash = excluded.content_hash,
      dupe_of = excluded.dupe_of,
      dupe_kind = excluded.dupe_kind,
      exif_score = excluded.exif_score
  `;
}

async function snapshot(): Promise<CatalogSnapshot> {
  const db = await sql();
  const lots = await db<CatalogLotRow>`
    select id, catalog_code, pretty_name, brand, kind, style_name, colorway, condition,
           lane, collection, status, plate_count, created_at::text, updated_at::text
    from catalog_lots
    order by catalog_code asc
  `;
  const plates = await db<CatalogPlateRow>`
    select id, lot_id, intake_code, role, lane, bytes, width, height, edit_status,
           created_at::text, taken_at, camera, iso, focal_mm, has_gps, hash_sha256,
           aperture, shutter, content_hash, dupe_of, dupe_kind, exif_score
    from catalog_plates
    order by intake_code asc
  `;
  return { lots, plates };
}

async function seedIfEmpty() {
  const db = await sql();
  const count = await db<{ n: number }>`select count(*)::int as n from catalog_lots`;
  if ((count[0]?.n ?? 0) > 0) return;
  for (const lot of SAMPLE_LOTS) await upsertLot(lot);
  for (const plate of SAMPLE_PLATES) await upsertPlate(plate);
  await db`insert into catalog_seq (prefix, next_n) values ('LB-20260823', 6)
    on conflict (prefix) do nothing`;
  await db`insert into catalog_seq (prefix, next_n) values ('UNB-COAT-CHAR', 1)
    on conflict (prefix) do nothing`;
  await db`insert into catalog_seq (prefix, next_n) values ('UNB-WATCH-MABL', 1)
    on conflict (prefix) do nothing`;
}

export const listCatalog = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfEmpty();
  return snapshot();
});

export const mintIntakeCodes = createServerFn({ method: "POST" })
  .validator((input: { count: number; at?: number }) => input)
  .handler(async ({ data }) => {
    const count = Math.min(200, Math.max(1, Math.round(data.count)));
    const day = yyyymmdd(data.at ?? Date.now());
    const plate = await nextSeq(`LB-${day}`, count);
    const lot = await nextSeq(`INB-${day}`, count);
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push({
        intakeCode: formatIntakeCode(day, plate.start + i),
        inboxCode: inboxLotCode(day, lot.start + i),
        seq: plate.start + i,
      });
    }
    return { day, codes };
  });

export const mintLotCode = createServerFn({ method: "POST" })
  .validator((input: { brand?: string | null; kind?: string | null; colorway?: string | null; style?: string | null }) => input)
  .handler(async ({ data }) => {
    const prefix = lotPrefix(data.brand, data.kind, data.colorway);
    const { start } = await nextSeq(prefix, 1);
    return {
      prefix,
      seq: start,
      catalogCode: formatLotCode(prefix, start),
      prettyName: prettyCatalogName(data.brand, data.style ?? data.kind, data.colorway),
    };
  });

export const upsertCatalog = createServerFn({ method: "POST" })
  .validator((input: { lots: LotWrite[]; plates: PlateWrite[] }) => input)
  .handler(async ({ data }) => {
    const lots = data.lots.slice(0, 200);
    const plates = data.plates.slice(0, 200);
    for (const lot of lots) await upsertLot(lot);
    for (const plate of plates) await upsertPlate(plate);
    return { ok: true as const, lots: lots.length, plates: plates.length };
  });
