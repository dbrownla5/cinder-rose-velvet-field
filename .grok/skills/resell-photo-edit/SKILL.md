---
name: resell-photo-edit
description: >
  Ready-to-post batch for resale clothing photos: separate sell-backlog
  plates from social content, queue resell shots for background removal and
  auto-enhance (program TBD), stamp ready-to-post, recatalog, then refine
  valuation on the cleaned plates. Social plates take a separate minimal-edit
  task — no cutouts, no heavy grade. Use when the user mentions photo edits,
  background removal, enhance, ready to post, packshot cleanup, social vs
  resale photos, backlog of items to sell vs content of themselves, or
  recatalog after retouch.
metadata:
  short-description: "Resell ready-to-post edit batch; social stays minimal"
user-invocable: true
---

# Resell photo edit (ready-to-post)

Two backlogs, two recipes. Do not mix them.

```
camera roll
  ├─ resell (items to sell) → ready-to-post BATCH
  │     queue → bg-remove (TBD) + enhance (TBD)
  │     → local preview grade until the program is locked
  │     → ready-to-post → recatalog → valuation (refine)
  └─ social (me / content for socials) → MINIMAL TASK
        light exposure, crop notes (4:5, 1:1, 9:16)
        no background removal, no catalog as inventory
```

Compose with **clothing-intake** for classify / lots / valuation / handshake.
This skill owns the **pixels after classify and before a listing-grade
valuation**. A street plate can be catalogued; it is not ready to post.

Read `references/batch.md` for the queue, TBD program contract, and QC.

## When this triggers

Sell vs social split, "edit these for listing", "remove the background",
"enhance the packshots", "ready to post", "I dump socials in a different
pile", "minimal grade on my photos", recatalog after retouch, refine a
valuation once the plates are clean.

If they are only naming a garment or asking a price, stay on clothing-intake.
If they are talking about the photo as a file to finish, use this skill.

## Procedure

1. **Split the backlog** — every plate has a `lane`: `resell` | `social` | `log`.
   Log is personal documentation (rooms, cracks, art) — catalog only, no
   edit batch. Never send social plates through the resell batch.
2. **Classify first** (clothing-intake). Edit does not invent a garment.
3. **Plan the recipe**
   - Resell packshot / flat-lay / hero → `resell-batch` (bg-remove + enhance).
   - Resell on-body / in-situ → enhance only; **do not cut a person out**.
     Note that a flat-lay is still needed for listing.
   - Social → `social-minimal`.
4. **Queue a batch** — operator selects plates. One batch object. Log
   `edit-queue`. Do not run until they send the batch.
5. **Run** — call the locked program if there is one. If not, apply a **local
   preview grade** only and stamp `bgRemoval: pending-tbd`,
   `enhance: preview-local`, `program: tbd`. Never pretend the background
   was removed.
6. **Ready-to-post** — QC checklist (below). Human can reject a plate back
   to queue. Log `ready-to-post`.
7. **Recatalog** — update photo role, quality notes, tags (`ready-to-post`).
   Original file stays. Edited preview is the listing plate. Log `recatalog`.
8. **Valuation** — only after recatalog (or an explicit skip on a plate that
   was already a clean packshot). If a lot was valued on a dirty plate,
   mark it to **refine** on the cleaned set. Pause still applies.

Social plates stop at step 6 as a social-ready task. They never enter
valuation.

## QC checklist (resell batch)

- Background: removed **or** honestly `pending-tbd` / `skipped-on-body`
- Color not crushed; texture still readable
- Defects and labels not cloned out
- Hero-front exists; missing angles still listed
- Filename / client / lot key unchanged
- Not posted, not listed — ready-to-post ≠ live

## TBD program

Background removal and auto-enhance are **not locked**. The queue, stamps,
and recatalog are real; the pixel vendor is a slot (`program: tbd`). Do not
hard-wire a SaaS. When a program is chosen, it must: keep the original,
write an edited copy, fail loud, never silently skip QC.

## Output

1. Lane counts: resell backlog · social task · log
2. Batch: N queued / processing / ready-to-post
3. Per plate: recipe, bg-removal status, enhance status, preview vs original
4. Recatalog stamp, then whether valuation may run or needs refine

## Spend and safety

- User-initiated batches. No auto-run on intake.
- Do not strip people from on-body plates.
- Do not invent a seamless studio that was not shot.
- Do not claim "background removed" on a preview grade.
- Social likeness stays on the social lane; it is not a listing photo.
- Skip sexual content involving minors; refuse and stop.
