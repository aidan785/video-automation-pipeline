import puppeteer from "/Users/aidanstanik/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import { pathToFileURL } from "url";

const TIMES = [1.6, 6.5, 9.0, 12.0, 14.3, 18.9, 22.5];
const url = pathToFileURL(process.cwd() + "/index.html").href;

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0" });
await page.evaluate(async () => { if (document.fonts) await document.fonts.ready; });
// Simulate the player clipping every .clip layer to its own box (worst case).
await page.evaluate(() => {
  const s = document.createElement("style");
  s.textContent = "#root .clip{overflow:hidden !important;}";
  document.head.appendChild(s);
});
await page.evaluate(() => new Promise(r => setTimeout(r, 400)));

for (const t of TIMES) {
  await page.evaluate(async (t) => {
    const v = document.getElementById("bg-video");
    if (v) {
      await new Promise((res) => {
        const done = () => { v.removeEventListener("seeked", done); res(); };
        v.addEventListener("seeked", done);
        try { v.pause(); } catch (e) {}
        v.currentTime = Math.min(t, (v.duration || 25) - 0.05);
        setTimeout(done, 600);
      });
    }
    const tl = window.__timelines && window.__timelines["ais-live-body"];
    if (tl) tl.time(t, false);
  }, t);
  await page.evaluate(() => new Promise(r => setTimeout(r, 150)));
  const name = `assets/shots/f_${String(t).replace(".", "_")}.png`;
  await page.screenshot({ path: name });
  console.log("shot", name);
}
await browser.close();
console.log("done");
