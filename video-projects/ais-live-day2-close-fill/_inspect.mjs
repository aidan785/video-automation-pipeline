// Tight-crop screenshots of specific elements at specific times, native res.
// usage: node _inspect.mjs --port N  <t>:<selector>:<name> ...
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-day2-close-fill/frames/inspect";
mkdirSync(OUT, { recursive: true });

const argv = process.argv.slice(2);
const pi = argv.indexOf("--port");
const PORT = pi >= 0 ? argv.splice(pi, 2)[1] : "3014";
const JOBS = argv.map(a => { const [t, sel, name] = a.split("::"); return { t: +t, sel, name }; });
const URL = `http://localhost:${PORT}/api/projects/ais-live-day2-close-fill/preview`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(URL, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(5000);
await page.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 20000 });

for (const { t, sel, name } of JOBS) {
  await page.evaluate(async (t) => {
    window.__player.pause();
    window.__player.seek(t);
    await document.fonts.ready;
  }, t);
  await page.waitForTimeout(1100);
  const el = await page.$(sel);
  if (!el) { console.log("MISSING", sel); continue; }
  await el.screenshot({ path: `${OUT}/${name}.png` });
  console.log("shot", name);
}
await browser.close();
