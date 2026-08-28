import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const url = process.argv[2] || "http://127.0.0.1:8080/";
await mkdir("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.setDefaultTimeout(20000);

await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(600);

async function openEdit() {
  const edit = page.locator("nav button", { hasText: "Edit" }).first();
  await edit.click();
  await page.waitForTimeout(400);
  await page.getByRole("heading", { name: "Edit" }).waitFor();
}

function stagesFor(id) {
  return page.evaluate((itemId) => {
    const nodes = [...document.querySelectorAll(`[data-item-id="${itemId}"]`)];
    return nodes.map((n) => n.getAttribute("data-edit-stage"));
  }, id);
}

await openEdit();
await page.locator('[data-item-id="sample-coat"][data-edit-stage="backlog"]').waitFor();

const before = await stagesFor("sample-coat");
await page.screenshot({ path: "/workspace/screenshots/qa-edit-resell.png", fullPage: true });

const coatRow = page.locator('[data-item-id="sample-coat"][data-edit-stage="backlog"]');
await coatRow.locator('input[type="checkbox"]').check();
await page.getByRole("button", { name: /Queue/ }).click();
await page.waitForTimeout(400);

const queued = await stagesFor("sample-coat");
await page.screenshot({ path: "/workspace/screenshots/qa-edit-queued.png", fullPage: true });

await page.getByRole("button", { name: /Run preview grade/ }).click();
await page.waitForTimeout(1600);
await page.locator('[data-item-id="sample-coat"][data-edit-stage="ready"]').waitFor();

const ready = await stagesFor("sample-coat");
await page.screenshot({ path: "/workspace/screenshots/qa-edit-ready.png", fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/qa-mobile-edit.png", fullPage: true });

const socialTab = page.getByRole("button", { name: /Social task/ });
await socialTab.click();
await page.waitForTimeout(300);
const coffee = await stagesFor("sample-coffee");
await page.screenshot({ path: "/workspace/screenshots/qa-edit-social.png", fullPage: true });

await browser.close();

const report = { before, queued, ready, coffee };
const ok =
  JSON.stringify(before) === JSON.stringify(["backlog"]) &&
  JSON.stringify(queued) === JSON.stringify(["queued"]) &&
  JSON.stringify(ready) === JSON.stringify(["ready"]) &&
  JSON.stringify(coffee) === JSON.stringify(["backlog"]);

console.log(JSON.stringify({ ok, ...report }, null, 2));
if (!ok) process.exit(1);
