// Frame-verify the assembled comp via the preview runtime (window.__player.seek —
// see ais-live-wb1-fill memory). Dev tool, not part of the build.
// Usage (from this project dir): node _seek-shots.mjs <outdir> <t1> <t2> ...
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [outdir, ...times] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
// networkidle never fires (hot-reload WS) — use domcontentloaded + settle wait
await page.goto("http://localhost:3002/api/projects/ais-plus-annual-upsell/preview", { waitUntil: "domcontentloaded", timeout: 120000 });
let ready = false;
for (let i = 0; i < 40 && !ready; i++) {
  await page.waitForTimeout(3000);
  ready = await page.evaluate(() => !!(window.__player && typeof window.__player.seek === "function"));
}
if (!ready) { console.error("no __player.seek"); await browser.close(); process.exit(1); }
console.log("player up");
await page.waitForTimeout(8000);

for (const t of times.map(Number)) {
  await page.evaluate(async (t) => {
    await window.__player.seek(t);
    if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion();
  }, t);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${outdir}/t${String(t).replace(".", "_")}.png` });
  console.log("shot", t);
}
await browser.close();
