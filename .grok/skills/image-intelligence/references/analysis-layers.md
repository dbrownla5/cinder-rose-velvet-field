# Analysis layers

Two passes. Do not collapse them into one caption.

## Low level — measure first

Compute locally when a raster is in hand (canvas is preferred; do not spend a vision call on numbers the CPU can produce).

| Field | How |
|---|---|
| `width` `height` | Natural image size |
| `orientation` | landscape / portrait / square (within 5%) |
| `aspectLabel` | Reduced ratio, e.g. `3:2`, `4:3`, `16:9`, `1:1`, `2:3` |
| `palette` | Resize to ~64px, bucket RGB, return top 5–8 `{ hex, pct }` |
| `brightness` | Mean luminance 0–1 (0.21R+0.72G+0.07B) |
| `contrast` | Stddev of luminance, normalized ~0–1 |
| `saturation` | Mean HSL saturation 0–1 |
| `sharpness` | Mean absolute neighbor difference on luma (0–1, scaled) |
| `temperature` | Compare mean R vs B: warm / cool / neutral |
| `histogram` | 24-bin luma histogram, values 0–1 normalized |
| `textInImage` (low) | Vision OCR only — local CPU will miss this |

Quality heuristics (surface as issues later, do not auto-reject):

- brightness < 0.18 → underexposed; > 0.85 → clipped
- contrast < 0.08 → flat
- sharpness < 0.12 → soft / motion / heavy DoF (not always a defect)

## High level — see meaning

One vision call per image. Send the downscaled JPEG plus a strict JSON contract.

System (keep short):

```
You are a catalog photographer and picture editor. Return JSON only.
Describe only what is visible. Never invent brands, people names, or unseen rooms.
```

User text:

```
Analyze this image into JSON with keys:
title, summary, scene, subjects, composition, mood, lighting, style,
quality, objects, textInImage, suggestedCategory, suggestedTags,
suggestedWorkArea, suggestedCollection, confidence

subjects: [{ name, prominence 0-1, location }]
mood: 2-5 short adjectives
quality: { score 1-10, issues[], strengths[] }
textInImage: array of readable strings (empty if none)
suggestedWorkArea: one of real-estate | product | inspection | editorial | brand | archive | null
suggestedCollection: interiors | product | field | editorial | archive | inbox
suggestedTags: 5-12 lowercase hyphenated
confidence: 0-1
```

Parse JSON. Strip fences if the model wraps them. If parse fails, retry once with "JSON only, no markdown".

## Combining layers

The catalog record stores both objects separately. When writing copy for a workflow, use:

- low-level for production facts (crop ratio, palette tokens, exposure warnings)
- high-level for language (title, scene, subjects, mood)

Never let a high-level "warm golden hour" contradict a low-level cool palette without noting the mismatch (mixed lighting, white-balance).
