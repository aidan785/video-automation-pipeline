import { chromium } from "playwright";
// real installed Google Chrome, GPU on — match Aidan's viewing stack
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-position=3000,3000"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("http://localhost:3013/api/projects/ais-live-day2-opening-fill/preview", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(5000);
await page.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 20000 });
await page.evaluate(async () => { window.__player.pause(); window.__player.seek(445); await document.fonts.ready; });
await page.waitForTimeout(1500);
const el = await page.$("[data-composition-id]");
await el.screenshot({ path: "frames/chrome_445.png" });
// also mid-entrance
await page.evaluate(async () => { window.__player.seek(442.9); });
await page.waitForTimeout(1200);
await el.screenshot({ path: "frames/chrome_442_9.png" });
await browser.close();
console.log("done");
