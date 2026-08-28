# Ready-to-post batch

## Lanes

| Lane | What | Edit | Valuation |
|---|---|---|---|
| `resell` | Items backlogged to sell (client lots or own inventory) | Ready-to-post batch | After recatalog |
| `social` | Content of the operator for socials | Minimal task | Never |
| `log` | Personal documentation (rooms, defects, art) | None | Never |

A mixed camera-roll drop is split by lane before any edit queue. Client first+last applies to resell only.

## Resell recipe (`resell-batch`)

Order:

1. Queue selected classified plates
2. Background removal — **program TBD**
3. Auto enhance — **program TBD** (exposure, contrast, color, dust)
4. Local preview grade while TBD (honest label)
5. Ready-to-post QC
6. Recatalog (edited copy + original)
7. Valuation or valuation-refine

### Background removal rules

| Photo role | Action |
|---|---|
| `flat-lay`, `hero-front`, `hero-back`, `side`, `detail` | Queue bg-remove (TBD). Preview grade does **not** count as removed. |
| `label`, `hangtag`, `defect` | No bg-remove. Keep context. Enhance only if needed. |
| `fit-on-body`, `in-situ` | **Skip cutout.** Enhance only. Need a later packshot. |

Never cut a person out of an on-body plate to fake a ghost mannequin.

### Enhance

Target: listing-readable, not beauty-filtered. Keep fabric tooth and defect honesty. Preview local grade may lift contrast ~10% and a touch of brightness. The locked program (when chosen) replaces this step; stamps change from `preview-local` to the vendor id.

## Social recipe (`social-minimal`)

One task the operator can dump into:

- Straighten already happened at intake prep
- Slight exposure lift only
- Crop notes for 4:5, 1:1, 9:16 — do not auto-crop unless they pick one
- No background removal, no HDR, no skin smoothing
- File as social-ready; never a SKU

## Status

`none` → `queued` → `processing` → `ready-to-post` → `recataloged`

A plate occupies **exactly one** stage. Pick list = `none`. Batch strip = `queued` | `processing`. Ready-to-post cards = `ready-to-post`. Recataloged plates leave the edit desk. Reject from ready sends back to `queued`. Dequeue from the strip returns to `none`.

Reject sends a plate back to `queued` with a note. Silence is not ready-to-post.

## Recatalog fields to refresh

Photo role if a better hero now exists · quality issues (street vs packshot) · tags add `ready-to-post` · `prepped` stays true · client/lot key unchanged · valuation refine flag if the lot already has a draft price.

## What not to do

- Mix social and resell in one batch
- Auto-send intake to the TBD program
- Overwrite the original file
- Treat ready-to-post as published
- Refine valuation on a plate still `pending-tbd` while claiming the background is gone
