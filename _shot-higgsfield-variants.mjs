// Sample-QA the generated higgsfield variants: 3 per purpose (seeded pick),
// shot at 90% timeline progress. Usage: node _shot-higgsfield-variants.mjs
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const reg = JSON.parse(readFileSync("style-library/registry.json", "utf8"));
const style = reg.styles.find((s) => s.id === "higgsfield");
const variants = style.cards.filter((c) => c.id.match(/\.v\d{3}$/));
const byPurpose = {};
variants.forEach((c) => (byPurpose[c.purpose] = byPurpose[c.purpose] || []).push(c));

let s = 20260723;
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
const sample = [];
for (const cards of Object.values(byPurpose))
  for (let i = 0; i < 3; i++) sample.push(cards[Math.floor(rnd() * cards.length)]);

mkdirSync("_shots-higgsfield-variants", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
let fails = 0;
for (const card of sample) {
  const url = "http://localhost:8090/" + card.file.replace(/^/, "").replace(/ /g, "%20");
  try {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__timelines && Object.keys(window.__timelines).length > 0, null, { timeout: 12000 });
    await page.evaluate((tier) => {
      for (const k of Object.keys(window.__timelines)) window.__timelines[k].progress(0.9).pause();
      if (tier !== "tier1") {
        const bg = document.createElement("div");
        bg.style.cssText = "position:fixed;inset:0;z-index:-1;background:linear-gradient(135deg,#5d5852 0%,#3a3631 55%,#262320 100%)";
        document.body.prepend(bg);
      }
    }, card.tier);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `_shots-higgsfield-variants/${card.id}.png` });
    console.log("ok", card.id, "-", card.treatment);
  } catch (e) {
    fails++;
    console.log("FAIL", card.id, e.message.split("\n")[0]);
  }
}
await browser.close();
console.log(`done: ${sample.length - fails}/${sample.length} ok`);
