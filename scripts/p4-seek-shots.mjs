// Frame-verify a comp through the Studio preview runtime (window.__player.seek).
// Usage: node scripts/p4-seek-shots.mjs <port> <slug> <outdir> <t1> <t2> ...
// Dev tool: seeks the preview iframe to each time, waits for the seek to settle,
// and screenshots 1920x1080 PNGs named t<sec>.png into <outdir>.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [port, slug, outdir, ...times] = process.argv.slice(2);
if (!port || !slug || !outdir || !times.length) { console.error("usage: p4-seek-shots.mjs <port> <slug> <outdir> <t...>"); process.exit(2); }
mkdirSync(outdir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`http://localhost:${port}/api/projects/${slug}/preview`, { waitUntil: "domcontentloaded", timeout: 120000 });
let ready = false;
for (let i = 0; i < 40 && !ready; i++) {
  await page.waitForTimeout(2500);
  ready = await page.evaluate(() => !!(window.__player && typeof window.__player.seek === "function"));
}
if (!ready) { console.error("no __player.seek on the preview page"); await browser.close(); process.exit(1); }
await page.waitForTimeout(6000);
// fonts
await page.evaluate(() => Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise(r => setTimeout(r, 4000))]));

for (const raw of times) {
  const t = Number(raw);
  // seek up to 3x (Studio seek races: currentTime reports target while paint lags)
  for (let k = 0; k < 3; k++) {
    await page.evaluate(async (t) => {
      await window.__player.seek(t);
      if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion();
    }, t);
    await page.waitForTimeout(1400);
    const ct = await page.evaluate(() => window.__player.currentTime ?? window.__player.getCurrentTime?.() ?? -1);
    if (Math.abs(ct - t) < 0.25 || ct === -1) break;
  }
  await page.screenshot({ path: `${outdir}/t${String(t).replace(".", "_")}.png` });
  console.log("shot", t);
}
await browser.close();
