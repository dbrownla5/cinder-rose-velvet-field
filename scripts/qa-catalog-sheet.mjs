import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.setDefaultTimeout(20000);
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const dump = await page.getByRole("button", { name: /Dump photos/ }).count();
const sku = await page.getByText("UNB-WATCH-MABL-0001").count();
const coat = await page.getByText("UNB-COAT-CHAR-0001").count();
const template = await page.getByText("BRAND-KIND-COLOR-0001").count();
await page.screenshot({ path: "/workspace/screenshots/qa-catalog.png", fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await page.screenshot({ path: "/workspace/screenshots/qa-mobile-catalog.png", fullPage: true });

await browser.close();
const report = { dump, sku, coat, template, ok: dump > 0 && sku > 0 && coat > 0 && template > 0 };
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
