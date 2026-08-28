-- Content hash + dupe pointer. Extras are kept; GPS coords still never stored.
alter table catalog_plates add column if not exists content_hash text;
alter table catalog_plates add column if not exists dupe_of text;
alter table catalog_plates add column if not exists dupe_kind text;
alter table catalog_plates add column if not exists exif_score integer;

create index if not exists catalog_plates_content_hash_idx on catalog_plates (content_hash);
create index if not exists catalog_plates_dupe_of_idx on catalog_plates (dupe_of);
