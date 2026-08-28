# Clothing taxonomy

Closed IDs for routing; free-text for what the eye actually sees.

## Garment kinds

| ID | Includes |
|---|---|
| `coat` | wool coat, trench, parka, raincoat, duster |
| `jacket` | bomber, denim jacket, puffer, windbreaker |
| `blazer` | sport coat, structured jacket |
| `suit` | matching jacket+trouser or skirt set |
| `dress` | day, evening, wrap, shift |
| `skirt` | mini to maxi, kilt |
| `jumpsuit` | romper, overall |
| `top` | blouse, shirt, tee, tank, camisole |
| `knit` | sweater, cardigan, knit vest |
| `hoodie` | zip or pullover fleece |
| `pants` | trousers, chinos, leggings |
| `jeans` | denim bottoms |
| `shorts` | all short bottoms |
| `shoes` | pumps, loafers, dress shoes |
| `boots` | ankle to knee, work, fashion |
| `sneakers` | athletic, fashion trainers |
| `bag` | tote, shoulder, crossbody, clutch |
| `belt` | |
| `scarf` | wrap, shawl |
| `hat` | cap, brim, beanie |
| `jewelry` | necklace, earrings, ring, bracelet |
| `watch` | wristwatch |
| `other` | anything else — describe in `kind` free text too |

If two garments are in one frame (a look), classify the **dominant** piece and
tag `look-set`. Prefer a second photo per piece.

## Resell categories

`contemporary` · `designer` · `vintage` · `streetwear` · `workwear` · `outdoor` · `formal` · `kids` · `accessories` · `shoes` · `bags` · `jewelry` · `home-textile` · `other`

Pick one primary. `designer` only when a readable label or unmistakable house
code is in frame; otherwise `contemporary` or `vintage` by era cues.

## Condition (observed)

| ID | Meaning |
|---|---|
| `nwt` | New with tags visible in this lot |
| `like-new` | No tags, no wear visible |
| `excellent` | Light wear, no obvious defects |
| `good` | Normal wear, still listable |
| `fair` | Obvious wear; price must reflect it |
| `as-is` | Stains, holes, damage are the story |

Condition comes from **this lot's photos**, not from the client's word. If they
said NWT but no tag photo exists, grade from what you see and add
`measurementsNeeded: ["tag-photo"]`.

## Photo roles

`hero-front` · `hero-back` · `side` · `detail` · `label` · `hangtag` · `defect` · `fit-on-body` · `in-situ` · `flat-lay` · `other`

A complete resale group wants at least `hero-front` + `hero-back` + `label`
(if branded) + `defect` (if condition < excellent). Missing roles go on the
group checklist, not invented.

## Colorway

One short phrase from the palette + description: `charcoal`, `wash-indigo`,
`cream-windowpane`. Use the low-level dominant hex as a check — if the model
says "navy" and the plate is warm brown, trust the plate.

## Channels (suggestion only)

`poshmark` · `ebay` · `depop` · `grailed` · `realreal` · `vestiaire` · `facebook` · `local-consign` · `shop-own`

Suggest 1–2. Do not claim a channel's authentication outcome.
