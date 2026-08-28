---
name: clothing-intake
description: >
  Client clothing intake, garment identification/classification, like-item
  cataloging (item then client), legal-standard photo data logging, dual
  personal/business image post-log, operator-selected valuation reports, and
  resale price evaluation that MUST pause for human approval before listing
  templates or value changes. Use whenever the user mentions clothing,
  garments, consignment, client drop-off, closet intake, resale, Poshmark,
  eBay, Depop, The RealReal, thrift, vintage lots, hangtags, client names on
  photo batches, sorting like items, cataloging clothes, valuation, price
  comps, listing templates, backlog of photos, or a personal vs business
  photo log — even if they never say "skill" or "intake". Apply this skill
  before treating clothing photos as generic product or editorial shots.
metadata:
  short-description: "Clothing intake lots, catalog logging, selected valuation, paused pricing"
user-invocable: true
---

# Clothing intake

This is the business workflow for a clothing operator who receives client lots,
shoots or dumps photos in batches (~100/week), and needs those images to become
searchable catalog records — then, **only for lots the operator passes through**,
a full valuation report that **pauses** until a human approves before any listing
template or value change.

Compose with **image-intelligence** for the dual-layer (low-level measure +
high-level see). This skill owns what happens *after* the pixels are understood:
prep the plate, classify the garment, file the log, group the lot, and gate the
money.

```
intake dump (no labels required)
      → prep (size + rotate) → mint intake code LB-YYYYMMDD-0001
      → auto EXIF + SHA-256 (GPS coords never stored)
      → dual-layer analyze → classify garment
      → mint lot SKU BRAND-KIND-COLOR-0001 (e.g. UNB-WATCH-MABL-0001)
      → split lane (resell | social | log)
      → catalog in Postgres sheet + visual rail
      → pretty name Brand Style Color · First Last (client local only)
      → data log (always)
      → (resell) ready-to-post edit batch — see resell-photo-edit
      → recatalog cleaned plates
      → WAIT for operator selection
      → (selected resale lots) full valuation report
        → deeper pass if unique / rare / vintage 30+
        → authenticity second pass if high-end (never a fake/real verdict)
      → PAUSE
      → send round to client → they send back → list (not ready yet)
```

Never skip the pause. Never auto-price after classify. A suggested price is a
draft, not a listing.

Read the matching reference only when you need depth:

| Need | File |
|---|---|
| Garment kinds, condition grades, resell categories, photo roles | `references/taxonomy.md` |
| What to log, standard fields, what never to claim | `references/logging.md` |
| Client first+last, batching, like-item grouping, backlog catch-up | `references/batching.md` |
| Valuation report, market bands, second passes, approval gate | `references/pricing.md` |

## When this triggers

User is doing any of: dropping a batch of clothing photos, typing a client first
and last name, "sort these by like items", "catalog this consignment", "what's
this garment", "condition report", "pass this to valuation", "price this lot",
"Poshmark title", "catch up my camera roll", "personal vs business photos",
hangtag / SKU / lot tickets, vintage vs contemporary vs designer vs streetwear.

If the images are rooms, defects, or generic packshots with no clothing, stay
on image-intelligence work areas. If they *might* be clothes, run this skill's
classifier — a coat on a street is a garment record, not only an editorial frame.

## Procedure (always this order)

1. **Intake** — accept the batch. Capture optional first name + last name (this
   is the client key), `ledger` (`business` | `personal`), and source (drop,
   camera roll, backlog). Parse first+last from filenames when present
   (`Maya_Chen_coat.jpg`). Do not invent a client. One batch object per drop.
   Never collect address, SSN, payment, phone, or email here.
2. **Prep** — size and rotate plates upright (EXIF orientation, longest-edge
   cap). Catalog copies stay prepped and ready for selection. Vision still
   receives a downscaled JPEG.
3. **Metadata extract (automatic on dump)** — read EXIF (taken time, camera,
   ISO, aperture, shutter, focal length, orientation), SHA-256 the original
   bytes, dHash the plate content, measure the plate. Flag possible duplicates
   by **exact hash** and **near content** (Hamming ≤ 8). **Never store GPS
   coordinates** in the catalog; `hasGps` is a boolean only.
3b. **Dupe pick** — in each match cluster, keep the plate with the richest,
   most original EXIF (`DateTimeOriginal` > file DateTime, camera body, lens,
   ISO/aperture/shutter, native bytes/pixels, sharpness). Extras stay filed
   and tagged; they are not deleted. Vision classify skips extras. Operator
   may promote another plate as keeper.
4. **Dual-layer** — low-level locally, high-level via one vision pass per image
   (image-intelligence `references/analysis-layers.md`).
5. **Classify** — fill the garment record (or mark `isGarment: false` and file
   on the personal or archive ledger). Object ID is the garment *kind* plus
   visible attributes. Never invent a brand, size, fiber, or year that is not
   readable or clearly typical of the silhouette.
6. **Catalog / group** — sort and group **by item, then by client**. Pretty
   name for recognition: `Brand Style Color · First Last` (use `Unbranded` when
   no label is in frame). Same client + brand + style + colorway become one
   lot. See `references/batching.md`.
7. **Data log** — append a chain event for every state change. This is the
   record of what was observed and who approved what, not legal advice. Schema:
   `references/logging.md`.
8. **Selection gate** — prepped, classified business lots sit at `ready`.
   **Do not** run valuation until the operator passes a lot through.
9. **Valuation (passed lots only)** — write a full report (brand, size, year
   made, condition, noticeable features, vintage 30+, designer-verifiable
   status) plus market estimates (sold high/low quality, time to sell,
   marketplace recs, top-of-market, faster-sell). Then **pause**. Details:
   `references/pricing.md`.
10. **Second passes** — unique / rare / vintage 30+ get a deeper research pass.
   High-end or designer-label lots get an authenticity *review* pass. Never
   write authentic, genuine, real, or fake as a fact. Never issue a certificate.
11. **Human approval** — show the report. The user may adjust the list price.
    Only on explicit approve: stamp the log, then generate the listing template.
    No template, no export, no "listed" state without that stamp.

Personal-ledger images skip steps 8–11 unless the user later moves them to
business.

## Garment record (minimum)

Fill from what is visible. Empty is better than invented.

- `kind` — coat, jean, knit, sneaker, bag, … (`taxonomy.md`)
- `styleName` — short style phrase (wool overcoat, trench, moto)
- `category` — contemporary, designer, vintage, streetwear, workwear, …
- `colorway`, `pattern`
- `condition` — nwt | like-new | excellent | good | fair | as-is (observed)
- `brandVisible`, `sizeVisible`, `fiberVisible`, `yearMade` — strings or null
- `noticeableFeatures[]` — hardware, lining, cut, as seen
- `defects[]` — stains, pills, wear, missing buttons, as seen
- `photoRole` — hero-front, hero-back, label, defect, fit-on-body, …
- `groupHint` — short stable key for like-item clustering
- `measurementsNeeded[]` — what a listing still lacks (chest, inseam, …)
- `uniqueOrRare`, `highEnd` — booleans that trigger second passes at valuation

## Output to the user

Default reply (chat) or panel (app):

1. Lot line: First Last (or "unassigned") · N photos · M groups · ledger
2. Each group pretty name: Brand Style Color · First Last · condition · roles
3. Log stamp: intake time + last event
4. Ready lots: wait for operator pass-through (do not invent a price yet)
5. If passed to valuation: full report + paused market bands + second-pass notes
6. After approval: listing title, bullets, description, measurements still needed

Do not hedge with "as an AI". Do say when brand/authenticity is unverified.

## Spend and safety

Vision, valuation, and second-pass calls cost the app owner. User-initiated
batches; one vision call per image; cache on the catalog record; never loop.
Valuation and second passes run only on lots the operator selected. Cap tokens.

- Condition is **observed**, not a warranty or appraisal.
- Do not authenticate designer goods. Flag tells and leave status unverified
  or flagged. Never write "fake" or "authentic" as a fact.
- Do not invent brands, SKUs, years, or sold-comp listings you cannot support.
- Do not issue authenticity certificates, appraisals, or legal advice.
- Client key is first + last name only. Never store address, SSN, payment,
  phone, or email in this photo log.
- Skip sexual content involving minors; refuse and stop.
- Counterfeit / stolen-goods suspicion: flag for human review, do not list.

## Relationship to image-intelligence

Keep both layers on the catalog record. Clothing-intake **adds** garment,
batch, group, valuation, template, and the event log. It does not replace
low-level palette/geometry or high-level scene notes — those still inform
photo quality, missing angles, and whether a street shot will suppress price
vs a layflat.
