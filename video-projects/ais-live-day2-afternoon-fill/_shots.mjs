// One-off: screenshot the Block 8 day 2 close fill at hero moments via the live player.
// usage: node _shots.mjs [--port N] <t> <t> ...
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-day2-afternoon-fill/frames";
mkdirSync(OUT, { recursive: true });

const argv = process.argv.slice(2);
const pi = argv.indexOf("--port");
const PORT = pi >= 0 ? argv.splice(pi, 2)[1] : "3002";
const TIMES = argv.map(Number);
const URL = `http://localhost:${PORT}/api/projects/ais-live-day2-afternoon-fill/preview`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(URL, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(5000); // player boots + compiles the comp; hot-reload WS keeps network busy forever

// wait for the preview runtime player
await page.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 20000 });

for (const t of TIMES) {
  await page.evaluate(async (t) => {
    window.__player.pause();
    window.__player.seek(t);
    await document.fonts.ready;
  }, t);
  await page.waitForTimeout(1100); // let media elements land on the frame
  const el = await page.$("[data-composition-id]");
  await el.screenshot({ path: `${OUT}/t_${String(t).replace(".", "_")}.png` });
  console.log("shot", t);
}
await browser.close();
