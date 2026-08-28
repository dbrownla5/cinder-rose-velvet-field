import { useMemo, useState } from "react";
import { Aperture, Check, ImageOff, RotateCcw, Scissors, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { editPlanFor, prettyItemName, uniqueById } from "@/lib/grouping";
import { useStudio } from "@/lib/store";
import type { CatalogItem, EditRecipe, EditStatus } from "@/lib/types";

function plateTitle(item: CatalogItem) {
  if (item.garment?.isGarment) return prettyItemName(item.garment);
  return item.highLevel?.title ?? item.name;
}

function bgLabel(item: CatalogItem) {
  const v = item.edit?.bgRemoval ?? editPlanFor(item).bgRemoval;
  switch (v) {
    case "skipped-on-body":
      return "No cutout — on-body";
    case "pending-tbd":
      return "Bg-remove · TBD";
    case "preview-only":
      return "Preview only";
    default:
      return "No bg-remove";
  }
}

function byStatus(items: CatalogItem[], statuses: EditStatus[]) {
  return uniqueById(
    items.filter((i) => {
      const st = i.edit?.status ?? "none";
      return statuses.includes(st);
    }),
  );
}

export function EditDesk() {
  const items = useStudio((s) => s.items);
  const queueForEdit = useStudio((s) => s.queueForEdit);
  const dequeueEdit = useStudio((s) => s.dequeueEdit);
  const runQueuedEdits = useStudio((s) => s.runQueuedEdits);
  const recatalogEdited = useStudio((s) => s.recatalogEdited);
  const rejectEdited = useStudio((s) => s.rejectEdited);
  const select = useStudio((s) => s.select);
  const [tab, setTab] = useState<"resell" | "social">("resell");

  const resell = uniqueById(items.filter((i) => i.lane === "resell"));
  const social = uniqueById(items.filter((i) => i.lane === "social"));

  const resellBacklog = byStatus(resell, ["none"]);
  const resellQueued = byStatus(resell, ["queued", "processing"]);
  const resellReady = byStatus(resell, ["ready-to-post"]);
  const socialBacklog = byStatus(social, ["none"]);
  const socialQueued = byStatus(social, ["queued", "processing"]);
  const socialReady = byStatus(social, ["ready-to-post"]);

  const [picked, setPicked] = useState<string[]>([]);
  const board = tab === "resell" ? resellBacklog : socialBacklog;
  const queued = tab === "resell" ? resellQueued : socialQueued;
  const ready = tab === "resell" ? resellReady : socialReady;
  const recipe: EditRecipe = tab === "resell" ? "resell-batch" : "social-minimal";

  const allowed = useMemo(() => new Set(board.map((i) => i.id)), [board]);
  const chosen = picked.filter((id) => allowed.has(id));

  function toggle(id: string) {
    setPicked((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
      <h1 className="font-display text-2xl sm:text-3xl">Edit</h1>
      <p className="mt-1 max-w-xl text-sm text-muted">
        Sell backlog and social content stay apart. A plate lives in one place: pick list, in the
        batch, or ready to post.
      </p>

      <div className="mt-5 flex rounded-lg bg-surface p-1">
        <button
          onClick={() => {
            setTab("resell");
            setPicked([]);
          }}
          className={cn(
            "h-9 flex-1 rounded-md text-xs font-medium whitespace-nowrap",
            tab === "resell" ? "bg-raised text-fg" : "text-muted",
          )}
        >
          Resell batch
          {resellBacklog.length + resellQueued.length ? (
            <span className="ml-1.5 font-mono tabular-nums text-warn">
              {resellBacklog.length + resellQueued.length}
            </span>
          ) : null}
        </button>
        <button
          onClick={() => {
            setTab("social");
            setPicked([]);
          }}
          className={cn(
            "h-9 flex-1 rounded-md text-xs font-medium whitespace-nowrap",
            tab === "social" ? "bg-raised text-fg" : "text-muted",
          )}
        >
          Social task
          {socialBacklog.length + socialQueued.length ? (
            <span className="ml-1.5 font-mono tabular-nums text-ok">
              {socialBacklog.length + socialQueued.length}
            </span>
          ) : null}
        </button>
      </div>

      {tab === "resell" ? (
        <p className="mt-4 rounded-lg border border-border bg-surface px-3 py-3 text-xs leading-relaxed text-muted">
          Background removal and auto-enhance run through a program we have not locked. This batch
          queues plates, applies a local preview grade, and stamps ready-to-post. On-body shots are
          never cut out. Swap the real program in later — the catalog does not care which tool.
        </p>
      ) : (
        <p className="mt-4 rounded-lg border border-border bg-surface px-3 py-3 text-xs leading-relaxed text-muted">
          Throw social plates in here. Light exposure only, crop notes for 4:5 · 1:1 · 9:16. No
          background removal, no beauty filter, not inventory.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">
            {tab === "resell" ? "Sell backlog" : "Social pile"}
          </p>
          <h2 className="font-display text-xl">
            {tab === "resell" ? "Ready-to-post batch" : "Minimal edit task"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!chosen.length}
            onClick={() => {
              queueForEdit(chosen, recipe);
              setPicked([]);
            }}
          >
            {tab === "resell" ? (
              <ImageOff className="size-3.5" />
            ) : (
              <Scissors className="size-3.5" />
            )}
            {tab === "resell" ? `Queue${chosen.length ? ` ${chosen.length}` : ""}` : "Throw in task"}
          </Button>
          <Button
            size="sm"
            disabled={!queued.length}
            onClick={() => void runQueuedEdits(recipe)}
          >
            <Aperture className="size-3.5" />
            Run preview grade
          </Button>
        </div>
      </div>

      <ul data-board={`${tab}-backlog`} className="mt-4 flex flex-col gap-2">
        {board.map((item) => {
          const on = chosen.includes(item.id);
          const plan = editPlanFor(item);
          return (
            <li key={item.id} data-item-id={item.id} data-edit-stage="backlog">
              <label
                className={cn(
                  "flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2",
                  on ? "border-border-strong bg-raised" : "border-border bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(item.id)}
                  className="size-4 shrink-0 accent-accent"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    select(item.id);
                  }}
                  className="size-12 shrink-0 overflow-hidden rounded-md bg-raised"
                >
                  <img src={item.thumbDataUrl} alt="" className="size-full object-cover" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{plateTitle(item)}</div>
                  <div className="truncate text-[11px] text-muted">
                    {bgLabel(item)}
                    {plan.crops.length ? ` · crops ${plan.crops.join(" ")}` : ""}
                  </div>
                </div>
              </label>
            </li>
          );
        })}
        {!board.length ? (
          <li className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
            {queued.length
              ? tab === "resell"
                ? "Nothing left in the pick list — finish the batch below."
                : "Pile is empty. Finish the task below."
              : tab === "resell"
                ? "No sell plates waiting on the batch."
                : "Social task is empty."}
          </li>
        ) : null}
      </ul>

      {queued.length ? (
        <section className="mt-8" data-board={`${tab}-queued`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">In the batch</p>
              <h2 className="font-display text-xl">
                {queued.some((i) => i.editing || i.edit?.status === "processing")
                  ? "Grading…"
                  : "Queued — not ready yet"}
              </h2>
            </div>
            <p className="text-xs text-muted">Program still TBD. Run the preview grade to move them.</p>
          </div>
          <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {queued.map((item) => (
              <li
                key={item.id}
                data-item-id={item.id}
                data-edit-stage="queued"
                className="w-40 shrink-0 overflow-hidden rounded-lg border border-border-strong bg-raised"
              >
                <button onClick={() => select(item.id)} className="block w-full text-left">
                  <img src={item.thumbDataUrl} alt="" className="aspect-square w-full object-cover" />
                  <div className="px-2.5 py-2">
                    <div className="truncate text-sm">{plateTitle(item)}</div>
                    <div className="truncate text-[11px] text-muted">
                      {item.editing || item.edit?.status === "processing" ? "Grading · " : "Queued · "}
                      {bgLabel(item)}
                    </div>
                  </div>
                </button>
                <div className="border-t border-border px-2 py-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-full"
                    onClick={() => dequeueEdit([item.id])}
                  >
                    <Undo2 className="size-3.5" />
                    Back to pile
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {ready.length ? (
        <section className="mt-8" data-board={`${tab}-ready`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">Ready to post</p>
              <h2 className="font-display text-xl">File the ready photos</h2>
            </div>
            <Button size="sm" onClick={() => recatalogEdited(ready.map((i) => i.id))}>
              <Check className="size-3.5" />
              File
              {tab === "resell" ? " · then price" : ""}
            </Button>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ready.map((item) => (
              <li
                key={item.id}
                data-item-id={item.id}
                data-edit-stage="ready"
                className="overflow-hidden rounded-lg border border-border bg-surface"
              >
                <button onClick={() => select(item.id)} className="block w-full text-left">
                  <div className="grid grid-cols-2">
                    <img src={item.thumbDataUrl} alt="" className="aspect-square object-cover" />
                    <img
                      src={item.edit?.previewUrl ?? item.thumbDataUrl}
                      alt=""
                      className="aspect-square object-cover"
                    />
                  </div>
                  <div className="px-2.5 py-2">
                    <div className="truncate text-sm">{plateTitle(item)}</div>
                    <div className="text-[11px] text-muted">
                      Original · preview · {bgLabel(item)}
                    </div>
                  </div>
                </button>
                <div className="border-t border-border px-2 py-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-full"
                    onClick={() => rejectEdited([item.id])}
                  >
                    <RotateCcw className="size-3.5" />
                    Send back
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
