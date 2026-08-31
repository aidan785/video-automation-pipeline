// Screenshot every 09-higgsfield card at ~90% timeline progress for visual QA.
// Usage: node _shot-higgsfield.mjs [progress 0-1]
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const prog = parseFloat(process.argv[2] ?? "0.9");
const reg = JSON.parse(readFileSync("style-library/registry.json", "utf8"));
const style = reg.styles.find((s) => s.id === "higgsfield");
mkdirSync("_shots-higgsfield", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

for (const card of style.cards) {
  const url = "http://localhost:8090/" + card.file.replace(/ /g, "%20");
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__timelines && Object.keys(window.__timelines).length > 0, null, { timeout: 15000 });
  await page.evaluate((p) => {
    document.fonts.ready.then(() => {});
    for (const k of Object.keys(window.__timelines)) {
      const tl = window.__timelines[k];
      tl.progress(p).pause();
    }
  }, prog);
  await page.waitForTimeout(400); // fonts + backdrop-filter settle
  const name = card.id.replace(/[^a-z0-9.-]/gi, "_");
  // tier2/custom cards are transparent — screenshot over a footage-grey backdrop
  // (fixed full-viewport div; body background doesn't reliably paint here)
  await page.evaluate((tier) => {
    if (tier !== "tier1") {
      const bg = document.createElement("div");
      bg.style.cssText = "position:fixed;inset:0;z-index:-1;background:linear-gradient(135deg,#5d5852 0%,#3a3631 55%,#262320 100%)";
      document.body.prepend(bg);
    }
  }, card.tier);
  await page.screenshot({ path: `_shots-higgsfield/${name}.png` });
  console.log("shot", card.id);
}

await browser.close();
console.log("done:", style.cards.length, "cards");
