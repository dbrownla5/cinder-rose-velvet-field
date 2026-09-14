# Lotbook — photo intake / resale catalog (part of Dayna's OS ecosystem)

This repo is the photo-intake/resale domain of ONE larger product: Dayna's
MCP/LLM operating system (spec lives in sibling repo
`dream-lark-plaza-juniper/packet/control_repo/dayna_build_control/` — read it
first). End state: merged behind one remote dashboard. Rules that bind all
work: evidence over claims, no mocks in production paths, originals are
preserved before anything else, never print or commit secrets.

## LLM provider

Single client file: `src/lib/ai.ts` — Gemini OpenAI-compatible endpoint,
vision + JSON mode. Env (server-only, `.env` gitignored on purpose):
`GEMINI_API_KEY` (Dayna provides), optional `LLM_API_KEY`/`LLM_BASE_URL`/
`LLM_MODEL` overrides. Default model `gemini-3.6-flash`. Without a key every
AI server-fn degrades gracefully ("unavailable") — that is by design.

## Verify (proven green in a remote container, 2026-08-29)

`npm run typecheck && npm run lint && npm test` (9 pre-existing Grok scaffold
test failures are not the app's), `npm run build`, dev on :8080 →
`scripts/browser-smoke.mjs`, `node scripts/live-smoke.mjs` (one live call);
vision path verified live with a data-URL image + response_format json.
Deploy: Netlify free tier or node host; Vercel is out (no credits).
