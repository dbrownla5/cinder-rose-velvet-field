# Batching, client names, like items, backlog

Average load is about **100 images/week**, often dumped as a single camera-roll
drop. The unit of work is the **batch**, then the **like-item group**, not the
lonely file.

## Intake

1. Accept jpeg/png/webp (and heic only after conversion).
2. **Dump first.** A bulk drop needs no ticket, no client name, no labels. Lane
   sticky (resell / social / log) is the only gate. Client first+last is optional
   and assigned later.
3. Parse filenames for a person name if present; otherwise `clientId: null`.
4. Mint codes immediately (see Catalog codes). One `intake` log, then `prep`.

Do not block intake on a missing name. File first, assign later.

The client key is **first + last name**. Never collect address, phone, email,
government ID, or payment details in this stack. Unowned database rows also
never store personal names — SKUs and garment fields only.

## Catalog codes

Two identifiers, generated — the operator does not type them.

| Level | Template | Example |
|---|---|---|
| Plate (every file) | `LB-YYYYMMDD-0001` | `LB-20260825-0007` |
| Lot (the physical piece) | `BRAND-KIND-COLOR-0001` | `UNB-WATCH-MABL-0001` |

Pretty recognition name (not the SKU): `Brand style color` → `Unbranded watch matte black`. Client, if known, is local only: `Unbranded watch matte black · Maya Chen`.

Brand code: `UNB` when unbranded; else initials or first 4 letters. Kind: `COAT`, `WATCH`, `JEAN`, … Color: first 2 letters of first two words (`matte black` → `MABL`) or first 4 of one word (`charcoal` → `CHAR`). Sequence is per prefix, zero-padded to 4.

Unclassified dumps sit on `INB-YYYYMMDD-0001` until classify mints the lot SKU. Like-item angles share one SKU. The Postgres catalog is the spreadsheet; the rail is the visual desk.

## Prep before catalog

Every plate is rotated from EXIF and sized for the rail **before** it is
offered for selection. `prepped: true` means the operator can pass the lot
without waiting on a resize. Vision still receives a compressed copy.

## Like-item groups

A group is "the same physical piece, different angles."

**Catalog order (recognition first):**

1. Brand (or `Unbranded`)
2. Style (`styleName` or kind)
3. Colorway
4. Client first + last

Pretty name: `Unbranded wool coat charcoal · Maya Chen`

**Group key (in order):**

1. `brand + style + colorway + client`
2. Else vision `groupHint` + client
3. Else singleton

Sort the rail **item then client**, not dump order.

Photos of *similar* but distinct pieces (two black tees) must **not** merge:
if labels, sizes, or defect maps disagree, split. When unsure, split — the
human can merge cheaper than unpicking a bad join.

**Roles inside a group:** first good front becomes `hero-front` unless vision
says otherwise. Extra fronts stay as `detail`.

## Cleaning a group

Before a lot is even *eligible* to pass to valuation:

- Drop near-duplicates (same role, same hash-ish crop) — keep the sharper
  low-level `sharpness`
- Flag blur / extreme underexposure as `photo-quality` issues, do not delete
  without the user
- Note missing roles on the checklist (`need: label photo`)

## Selection gate — not auto-price

When every image in a business group has high-level analysis **and** is
prepped, the group is `ready`. Ready lots **wait**. Valuation runs only after
the operator selects the lot and passes it through (`select-pass`).

Personal groups never enter valuation.

## Backlog catch-up

Goal: empty `inbox` and ungrouped business files.

Split **lanes** first so a social dump never hits the sell batch:

- `resell` — items to sell → ready-to-post edit (`resell-photo-edit`) → recatalog → valuation
- `social` — content of the operator → minimal-edit task, never valued
- `log` — rooms, defects, art — catalog only

Weekly loop:

1. Count images in the last 7 days vs the ~100-image week
2. Process `inbox` first (unclassified)
3. Then ungrouped classified garments on the resell lane
4. Then resell plates still waiting on the ready-to-post batch
5. Then ready groups waiting on operator selection (listing plates only)
6. Then paused groups older than 48h (nudge the human — do not auto-approve)

Social and log backlogs are separate desks. Never mix them in the valuation queue.

## Batch status

`intake` → `sorting` → `ready` → (operator pass) → `pricing` → `paused` → `approved` → `listed`

A batch can be `ready` while some groups are still sorting. Status is the
*least advanced* business group, so a mixed lot cannot look "done" early.
