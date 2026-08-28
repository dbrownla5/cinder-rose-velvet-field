# Standard data logging

The photo log is a **business record of observations and approvals**. It is not
a legal opinion, appraisal, authenticity certificate, or warranty.

Do not give legal advice. If a situation needs a lawyer, insurer, or
authenticator, say so in the checklist and keep the log factual.

## Why a log exists

Client lots move through many hands (client → operator → listing → buyer).
Photos get dumped in camera rolls mixed with personal shots. The log answers:
what arrived, when, under which client name, what was visible, who passed a
lot to valuation, who approved a price, and which images are personal vs
business.

## Record shape (every event)

```
id, at (unix ms), actor (system | user)
type, ledger (business | personal)
message                      // one line, plain language
clientId?                    // first + last, e.g. Maya Chen
batchId?, groupId?, itemIds[]
observedOnly: true           // always
```

### Event types

| type | When |
|---|---|
| `intake` | Batch accepted (files + optional first/last + ledger) |
| `prep` | Plates sized and rotated upright |
| `meta-extract` | EXIF + SHA-256 hashed; GPS coords never stored |
| `dupe` | Hash and content match; keeper chosen by richest EXIF; extras kept |
| `classify` | Garment record written from dual-layer analysis |
| `group` | Like-item group formed or membership changed |
| `move-ledger` | Personal ↔ business |
| `assign-client` | First/last attached or changed |
| `select-pass` | Operator sent a ready lot to valuation |
| `valuation` | Full report written |
| `deeper-pass` | Unique / rare / vintage research memo filed |
| `auth-pass` | High-end authenticity review filed (unverified/flagged) |
| `price-draft` | Listing band written |
| `price-pause` | Queue entered; waiting on human |
| `price-adjust` | Human changed the list price |
| `approve` | Human approved range/value — gate opens |
| `template` | Listing copy generated post-approval |
| `hold` | Human sent back / not listing yet |
| `export` | Copy/export of a template or catalog row |
| `delete` | Record removed from the working catalog |

## Fields to keep on the garment / lot (not in chat)

Intake date · client first+last · ledger · photo count · roles present ·
condition (observed) · defects (observed) · noticeable features · brand as
read from label · size as read · year as read · vintage 30+ flag · unique/rare
· high-end · valuation report · approved list price · who approved · timestamp
of approval · template version.

## Never put in this log

- Address, phone, email, government ID, payment details, SSN
- Medical notes, children's identities beyond a `kids` category flag
- "Authentic", "genuine", "fake", "certificate", "appraised at", "fair market
  value" as a fact — those are professional opinions this workflow does not issue
- Invented SKUs, UPCs, serials, or brands

First and last name is the lot key so the operator can recognize the drop. It
is not a KYC file.

## Standard phrasing

- "Condition as observed in lot photos on {date}."
- "Brand read from in-frame label: {x}. Authenticity not verified."
- "Price is an estimated listing range, not an appraisal."
- "High-end second pass: tells listed; no authentic/fake verdict."
- "Listing template generated after operator approval at {time}."

## Personal vs business

Every image has a ledger. Personal shots (family, rooms, receipts, mood) still
get dual-layer cataloging so the camera roll can be caught up — they do **not**
enter the valuation queue. Moving a personal image to business is an explicit
`move-ledger` event.

## Retention tone

Treat business-ledger photos as work product of the lot. Do not strip EXIF in
a way that destroys the intake timestamp the log relies on; the app may still
downscale copies for vision.
