# Work-area workflows

A workflow turns dual-layer analysis into something a working person can paste into their system. Always return:

```
title: string
fields: [{ label, value }]     // short facts
sections: [{ heading, body }]  // copy blocks
checklist: [{ item }]          // next actions
```

Consume both layers. Mention palette hexes, aspect, and quality issues in fields when they affect the job.

## real-estate

**When:** rooms, facades, staging, listing sets.

Fields: property role (hero/room/detail), room type, staging quality, light, visible finishes, recommended set order.

Sections: listing headline, 80–140 word listing paragraph, alt text.

Checklist: missing rooms in the set, verticals/keystoning, clutter, twilight vs daylight pairing.

Do not invent square footage, beds, address, or amenities not visible.

## product

**When:** packshots, kits, tabletop commerce.

Fields: product type, colorway (from palette + description), background (seamless/lifestyle), aspect, ecommerce-readiness.

Sections: product title, 4–6 bullets, alt text.

Checklist: color accuracy, dust/reflections, label/legal text, missing packshot angle.

Do not invent brand, SKU, price, or materials you cannot see.

## inspection

**When:** defects, job sites, insurance, punch lists.

Fields: finding, likely material, severity (`observe` | `repair` | `urgent-review`), location in frame, moisture/safety flags.

Sections: field note (factual), client-facing summary (non-alarmist).

Checklist: measurements to take, follow-up photo (scale ruler, wider context), specialist to call **as a suggestion only**.

Never diagnose structural failure or write legal language. Visible crack ≠ "foundation is failing".

## editorial

**When:** fashion, social, campaign, portraits.

Fields: frame role, crop advice for 1:1 / 4:5 / 9:16, wardrobe/scene, mood.

Sections: caption (1–2 sentences), alt text, usage notes.

Checklist: release/likeness if a person is identifiable, logo/signage cleanup, color grade consistency.

## brand

**When:** UI screenshots, brand boards, packaging systems, palettes.

Fields: extracted palette (hex + role), type notes, layout pattern, a11y contrast flags.

Sections: audit summary, token suggestions (`--color-bg` etc.).

Checklist: contrast failures, crowded type, off-brand hues.

## archive

**When:** art, specimens, documents, historical plates.

Fields: object type, subject, medium/support if visible, condition notes (foxing, tears), orientation.

Sections: catalog description (museum tone), subject headings.

Checklist: need for verso/detail shots, OCR of any inscriptions, condition photography.

## Running

1. Confirm work area (user pick overrides suggestion).
2. Send compact analysis JSON + optional downscaled image.
3. Validate the three arrays exist; drop empty sections.
4. Store on the record under `workflows[]` (do not overwrite prior runs of other areas).
