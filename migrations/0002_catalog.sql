-- Lotbook catalog: SKUs and plate intake codes. No personal names.
create table if not exists catalog_seq (
  prefix text primary key,
  next_n integer not null
);

create table if not exists catalog_lots (
  id text primary key,
  catalog_code text not null unique,
  pretty_name text not null,
  brand text,
  kind text,
  style_name text,
  colorway text,
  condition text,
  lane text not null default 'resell',
  collection text not null default 'inbox',
  status text not null default 'intake',
  plate_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_lots_lane_idx on catalog_lots (lane);
create index if not exists catalog_lots_status_idx on catalog_lots (status);

create table if not exists catalog_plates (
  id text primary key,
  lot_id text not null references catalog_lots (id) on delete cascade,
  intake_code text not null unique,
  role text,
  lane text not null default 'resell',
  bytes integer not null default 0,
  width integer not null default 0,
  height integer not null default 0,
  edit_status text not null default 'none',
  created_at timestamptz not null default now()
);

create index if not exists catalog_plates_lot_idx on catalog_plates (lot_id);
create index if not exists catalog_plates_lane_idx on catalog_plates (lane);
