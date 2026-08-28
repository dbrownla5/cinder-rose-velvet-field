---
name: image-intelligence
description: >
  Dual-layer image intelligence: high-level scene/subject/composition analysis
  AND low-level palette/geometry/quality/OCR extraction, then categorize,
  catalog, and run domain workflows (real estate listings, product catalogs,
  field inspections, editorial/social, brand audits, collection archives).
  Use whenever the user uploads, pastes, or mentions photos, images,
  screenshots, scans, visual assets, DAM, tagging, cataloging, sorting a
  library, alt text, listing copy, punch lists, or any "what's in this
  picture" task — even if they never say "analyze" or "skill". Always apply
  this skill for visual intake before guessing contents from the filename.
  If the photos are clothing, consignment, client lots, resale, or a personal
  vs business camera-roll log, also apply the clothing-intake skill — that
  skill owns batching, standard logging, operator-selected valuation, and the
  price-approval pause.
metadata:
  short-description: "High/low image analysis, cataloging, and work-area workflows"
user-invocable: true
---

# Image Intelligence

Treat every image as two layers that must both be filled before filing or automating work.

1. **Low level** — measurable, mostly deterministic: geometry, palette, exposure, sharpness, text pixels, file facts.
2. **High level** — semantic: scene, subjects, composition, mood, style, quality judgment, suggested category.

Then **categorize + catalog**, then **route to a work-area workflow** if the image is for a job (listing, SKU, inspection, editorial, brand, archive).

For **client clothing / resale / consignment / dual photo logs**, continue into the `clothing-intake` skill after both layers are filled. Do not stop at a fashion caption.

Do not stop at a caption. A caption is only the high-level summary field.

## When this triggers

User is doing any of: drop/upload photos, "tag these", "sort my shots", "what room is this", "write a listing", "product bullets", "punch list from this crack", "alt text", "catalog this collection", screenshot audits, receipt/OCR, moodboards.

## Procedure (always in this order)

```
intake → low-level → high-level → categorize/catalog → (optional) workflow
```

Read the matching reference only when you need depth:

| Need | File |
|---|---|
| How to compute / prompt each layer, quality bar | `references/analysis-layers.md` |
| Taxonomy, collections, tags, catalog record shape | `references/catalog.md` |
| Work-area playbooks and output templates | `references/workflows.md` |

## Intake

- Accept raster images (jpeg/png/webp). Convert non-jpeg/png to JPEG before sending to a vision model.
- Downscale for the model: longest edge **1280px**, JPEG ~0.8. Keep the original for the catalog.
- Never invent pixels. If the image is missing, ask for it or stop — do not analyze a filename.
- One image at a time for vision calls unless the user explicitly asked for a set comparison.

## Dual-layer analysis

Fill **both** objects. Low-level may be computed in-process (canvas/histogram) plus a vision pass for OCR/objects; high-level is always a vision pass.

**Low-level (must include):** dimensions, orientation, aspect, dominant palette (≥5 swatches with %), brightness, contrast, saturation, sharpness, color temperature (cool/neutral/warm), luminance histogram, any readable text.

**High-level (must include):** title, 2–4 sentence summary, scene, subjects with prominence, composition notes, mood, lighting, style, quality score 1–10 with issues/strengths, objects, suggested category, tags, suggested work area, confidence 0–1.

Schema and prompt contract: `references/analysis-layers.md`.

If vision is unavailable, still compute low-level locally and catalog the file with `highLevel` empty — never fake semantics.

## Categorize and catalog

Every image becomes a **catalog record** (not a chat reply):

- `collection` from taxonomy (garments, accessories, personal, archive, inbox — or interiors/product/field/editorial when not in a clothing stack)
- `category` (room type, SKU class, finding type, garment kind, …)
- `tags` (5–12, lowercase, hyphenated)
- `workArea` suggestion (may be `null` if the shot is personal/untyped)

Prefer the user's existing collection names when they have a library. Full taxonomy: `references/catalog.md`.

## Automated workflows

Only run a workflow when the user asks, or when they picked a work area, or when the image is clearly a job asset (listing photo, packshot, defect close-up, lookbook frame, brand screenshot, museum plate).

Work areas:

| ID | Run when |
|---|---|
| `resale` | Clothing/accessory lots — hand off to clothing-intake (operator selects lots for valuation; price must pause) |
| `real-estate` | Interiors, exteriors, staging, listing sets |
| `product` | Packshots, SKUs, still-life commerce |
| `inspection` | Defects, sites, punch-list, insurance/field |
| `editorial` | Fashion, social, campaign, alt/caption |
| `brand` | UI, brand boards, palette/type audits |
| `archive` | Collections, art, documents, accession records |

Each workflow consumes **both layers** and returns structured deliverables (fields, copy blocks, checklist) — never a single blob of prose. Templates: `references/workflows.md`.

## Output to the user

Default reply shape when operating in chat (the app UI already renders panels):

1. One-line title + collection / category
2. High-level summary (short)
3. Low-level facts as compact stats (palette swatches, exposure, sharpness)
4. Tags
5. If a work area applies: the workflow deliverable, ready to copy

Do not hedge with "as an AI". If confidence < 0.45, say what is uncertain and still file the record.

## Spend and safety

Vision calls cost the app owner. User-initiated, one image per call, cap output tokens, cache results on the catalog record. Never loop. Do not give medical/legal determinations from inspection photos — describe what is visible and flag professional review. Skip sexual content involving minors; refuse and stop.
