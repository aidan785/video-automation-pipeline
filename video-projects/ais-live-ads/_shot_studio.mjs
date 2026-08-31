import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";

const PREVIEW = "http://localhost:3002/api/projects/ais-live-ads/preview";
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

const t = 1.6;
await page.evaluate(async (t) => {
  const v = document.getElementById("bg-video");
  if (v) { try { v.pause(); } catch (e) {} v.currentTime = t; }
  const tl = window.__timelines && window.__timelines["ais-live-body"];
  if (tl) { tl.pause(); tl.time(t, false); }
}, t);
await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
await page.screenshot({ path: "assets/shots/studio_1_6.png" });

// also dump the rendered mark width with fonts loaded
const w = await page.evaluate(() => {
  const m = document.querySelector("#bug .aismark");
  const f = document.querySelector("#bug .ais");
  return { markW: m && m.getBoundingClientRect().width, font: f && getComputedStyle(f).fontFamily };
});
console.log("mark width (fonts loaded):", JSON.stringify(w));
await browser.close();
console.log("done");
