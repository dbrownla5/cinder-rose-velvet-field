import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.setDefaultTimeout(20000);
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1800);

await page.getByRole("button", { name: /^Plates/ }).click();
await page.waitForTimeout(500);
const hashHeader = await page.getByText("Hash", { exact: true }).count();
const takenHeader = await page.getByText("Taken", { exact: true }).count();
await page.screenshot({ path: "/workspace/screenshots/qa-catalog.png", fullPage: true });

await page.locator("table tbody tr").first().click();
await page.waitForTimeout(600);
const hashFact = await page.getByText("Hash", { exact: true }).count();
const gps = await page.getByText(/GPS in file/).count();
await page.screenshot({ path: "/workspace/screenshots/qa-inspect.png", fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/qa-mobile-catalog.png", fullPage: true });

await browser.close();
const report = { hashHeader, takenHeader, hashFact, gps, ok: hashHeader > 0 && takenHeader > 0 };
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
