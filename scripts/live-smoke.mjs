#!/usr/bin/env node
// Live LLM smoke test. Makes ONE real chat call with the cheapest model.
// Not part of `npm test` — run manually: node scripts/live-smoke.mjs
// Requires GEMINI_API_KEY (or LLM_API_KEY) in the environment. Never logs the key.

const base = (process.env.LLM_BASE_URL?.trim() || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/+$/, "");
const model = process.env.LLM_SMOKE_MODEL?.trim() || "gemini-flash-lite-latest";
const apiKey = (process.env.LLM_API_KEY || process.env.GEMINI_API_KEY)?.trim();

if (!apiKey) {
  console.error("live-smoke: no LLM_API_KEY/GEMINI_API_KEY in environment — nothing was called.");
  process.exit(1);
}

const res = await fetch(`${base}/chat/completions`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
  body: JSON.stringify({
    model,
    max_tokens: 20,
    temperature: 0,
    messages: [{ role: "user", content: "Reply with exactly: LIVE_SMOKE_OK" }],
  }),
});

if (!res.ok) {
  const body = await res.text().catch(() => "");
  console.error(`live-smoke: FAIL ${res.status} ${body.slice(0, 300)}`);
  process.exit(1);
}
const json = await res.json();
const text = json.choices?.[0]?.message?.content?.trim() ?? "";
const usage = json.usage ?? {};
if (!text.includes("LIVE_SMOKE_OK")) {
  console.error(`live-smoke: FAIL unexpected reply: ${text.slice(0, 120)}`);
  process.exit(1);
}
console.log(`live-smoke: PASS model=${json.model ?? model} prompt_tokens=${usage.prompt_tokens ?? "?"} completion_tokens=${usage.completion_tokens ?? "?"}`);
