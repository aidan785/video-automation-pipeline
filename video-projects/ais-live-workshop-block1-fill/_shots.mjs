// One-off: screenshot the WB1 fill loop at hero moments via the live player.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-workshop-block1-fill/frames";
mkdirSync(OUT, { recursive: true });

const TIMES = process.argv.slice(2).map(Number);
const URL = "http://localhost:3012/api/projects/ais-live-workshop-block1-fill/preview";

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
