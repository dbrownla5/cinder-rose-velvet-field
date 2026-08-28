import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.setDefaultTimeout(20000);
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1600);
await page.getByRole("button", { name: /^Plates/ }).click();
await page.waitForTimeout(400);
const dupe = await page.getByText("Dupe", { exact: true }).count();
const hash = await page.getByText("Hash", { exact: true }).count();
await page.screenshot({ path: "/workspace/screenshots/qa-catalog.png", fullPage: true });
await browser.close();
console.log(JSON.stringify({ dupe, hash, ok: dupe > 0 && hash > 0 }));
if (!(dupe > 0 && hash > 0)) process.exit(1);
