import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";

const PREVIEW = "http://localhost:3002/api/projects/ais-live-ads/preview";
const KEY = "ais-live-body";
const times = process.argv.slice(2).map(Number);
if (!times.length) { console.error("pass times"); process.exit(1); }

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(PREVIEW, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.evaluate(async () => { if (document.fonts) await document.fonts.ready; });
await page.evaluate(() => new Promise((r) => setTimeout(r, 1200)));

for (const t of times) {
  await page.evaluate(async (t, KEY) => {
    const v = document.getElementById("bg-video");
    if (v) { try { v.pause(); } catch (e) {} v.currentTime = t; }
    const tl = window.__timelines && window.__timelines[KEY];
    if (tl) { tl.pause(); tl.time(t, false); }
  }, t, KEY);
  await page.evaluate(() => new Promise((r) => setTimeout(r, 350)));
  const label = String(t).replace(".", "_");
  await page.screenshot({ path: `assets/shots/intro1_${label}.png` });
  console.log("shot", t);
}
await browser.close();
console.log("done");
