import { chromium } from "playwright";
const browser = await chromium.launch();
const CASES = [
  ["control", ""],
  ["flat", ".scene,.inner{transform-style:flat !important;}"],
  ["noshadow", ".ln .wd{text-shadow:none !important;}"],
  ["lnlh", ".ln{line-height:1.35 !important;}"],
];
for (const [name, css] of CASES) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto("http://localhost:3013/api/projects/ais-live-day2-opening-fill/preview", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4500);
  await page.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 20000 });
  if (css) await page.addStyleTag({ content: css });
  await page.evaluate(async () => { window.__player.pause(); window.__player.seek(445); await document.fonts.ready; });
  await page.waitForTimeout(1500);
  const el = await page.$("[data-composition-id]");
  await el.screenshot({ path: `frames/iso_${name}.png` });
  await page.close();
  console.log("done", name);
}
await browser.close();
