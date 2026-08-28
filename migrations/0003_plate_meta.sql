-- Technical metadata on plates. No GPS coordinates, no personal names.
alter table catalog_plates add column if not exists taken_at text;
alter table catalog_plates add column if not exists camera text;
alter table catalog_plates add column if not exists iso integer;
alter table catalog_plates add column if not exists focal_mm integer;
alter table catalog_plates add column if not exists has_gps boolean not null default false;
alter table catalog_plates add column if not exists hash_sha256 text;
alter table catalog_plates add column if not exists aperture text;
alter table catalog_plates add column if not exists shutter text;

create index if not exists catalog_plates_hash_idx on catalog_plates (hash_sha256);
create index if not exists catalog_plates_taken_idx on catalog_plates (taken_at);
