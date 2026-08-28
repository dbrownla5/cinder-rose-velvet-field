# Valuation reports and the approval gate

Price is a **draft listing range**, not an appraisal, not fair-market value,
not a promise to the client. The valuation report is an operator aid.

## When the script runs

Only after the operator **passes a ready business lot** through to valuation.
Do **not** auto-run when classify finishes.

Do not run for personal ledger, `isGarment: false`, or lots still sorting.

## Full report (required)

```
brand                  // as-read or null — never invented
size                   // as-read or null
yearMade               // from label, era guess, or null
yearBasis              // label | era-guess | unknown
condition              // observed grade
noticeableFeatures[]   // hardware, lining, cut, as seen
vintage30              // true only when 30+ years is supportable
vintageNote
designerVerifiable     // not-designer | unverified | label-present | needs-second-pass
uniqueOrRare, uniqueNote
highEnd
market:
  soldHigh             // estimated sold band, high-quality examples
  soldLow              // estimated sold band, low-quality / worn examples
  daysToSell           // typical days
  topOfMarket          // ask if you can wait
  fasterSell           // ask if you need it gone
  channels[]           // marketplace recommendations
  notes                // 2–5 sentences, estimates only
```

Plus the listing band the operator will approve:

```
listLow, listHigh, listSuggested
channel
compsNote
confidence
flags[]                // no-brand-visible, street-not-packshot,
                       // needs-measurements, authenticity-unverified,
                       // defect-unpriced, unique-deeper-pass, high-end-second-pass
status: "paused"
```

Use visible condition, category, photo quality, and whether a brand/size is
readable. A street editorial plate of an unbranded coat is worth less as a
listing photo than a clean flat-lay of the same piece — say so in `compsNote`.

Never invent a comparable SKU ("this is a real The Row coat, comps at $2,400")
unless the label is in frame **and** you still set designer/authenticity as
unverified.

## Second passes

Run automatically as part of valuation for lots the operator already selected:

| Trigger | Pass | What it may say | What it must not say |
|---|---|---|---|
| `uniqueOrRare` or `vintage30` | Deeper research | Era cues, comparable silhouettes, scarcity as hypothesis | Invented house, year, or sold SKU |
| `highEnd` or designer label present / needs-second-pass | Authenticity review | Visible tells (stitch, hardware, label set, fonts) | authentic / genuine / real / fake as a fact |

Authenticity status is `unverified` or `flagged`. There is no certificate
path. Flag for a human authenticator when tells conflict; do not list as a
named house if the mark is unreadable.

## The pause (non-negotiable)

After the draft:

1. `select-pass` (operator)
2. `valuation` log event (full report written)
3. `deeper-pass` / `auth-pass` if those ran
4. `price-pause` — queue entered; waiting on human
5. UI / reply shows the report and stops
6. No listing title, bullets, hashtags, or export until `approve`

The human may:

- **Adjust** the list price (clamped to something they type, not silently
  snapped) → `price-adjust`
- **Approve** → `approve`, then generate template → `template`
- **Hold** → stay paused, leave the queue visible

Silence is not approval. A timeout is not approval.

## Value adjustment

The approved list price is `userList` if set, else `listSuggested`. Store both
the machine range and the human number. Templates use the **approved** number
only, labeled "operator list price", never "appraised".

## Listing template (post-approval only)

```
title            // channel-aware, no shouting, no invented brand
bullets[4–6]     // visible facts + condition as observed
description      // short paragraph
measurementsNeeded[]
hashtags[]       // optional, channel-native, no trademark stuffing
channelNotes     // e.g. "Poshmark: add bust/length before publish"
```

Title pattern: `{color} {kind}` plus brand **only** if `brandVisible`.
Condition phrase from the grade. Defects belong in bullets, not hidden.

## Copy rules

- Do not claim "authentic", "rare find", "investment piece", "worth $X"
- Do not claim "fake" as a fact
- Do not claim measurements you do not have
- Do not claim the client's asking price as market
- Do not issue an appraisal, certificate, or legal opinion
- Do flag missing tag / back / defect photos as publish blockers
