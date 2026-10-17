import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-size=1400,900"] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const warns = [];
page.on("console", (m) => { if (m.type() === "warning" && /useTimelinePlayer/.test(m.text())) warns.push(m.text().slice(0, 240)); });
await page.goto(`http://localhost:${process.env.PORT || 3002}/#project/${process.env.SLUG || "ais-plus-annual-upsell"}`, { waitUntil: "domcontentloaded", timeout: 120000 });
let frame = null;
for (let i = 0; i < 40 && !frame; i++) { await page.waitForTimeout(1000); frame = page.frames().find((f) => f !== page.mainFrame() && /preview/.test(f.url())); }
for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); if (await frame.evaluate(() => !!window.__player).catch(() => false)) break; }
await page.waitForTimeout(4000);
const info = await frame.evaluate(() => {
  const root = document.querySelector("[data-composition-id]");
  const rows = [];
  for (const el of document.querySelectorAll("[data-start]")) {
    const st = parseFloat(el.getAttribute("data-start")), du = parseFloat(el.getAttribute("data-duration") ?? "") || parseFloat(el.getAttribute("data-hf-authored-duration") ?? "");
    rows.push({ tag: el.tagName, id: el.id, st, du, authored: el.getAttribute("data-hf-authored-duration"), end: +(st + du).toFixed(3) });
  }
  rows.sort((a, b) => b.end - a.end);
  const tl = window.__timelines?.[root.getAttribute("data-composition-id")];
  return { rootDur: root.getAttribute("data-duration"), rootAuthored: root.getAttribute("data-hf-authored-duration"), n: rows.length, top: rows.slice(0, 5), tlDur: tl?.duration?.(), playerDur: window.__player?.getDuration?.() };
});
console.log(JSON.stringify(info, null, 1));
console.log("warnings:", warns.join("\n") || "none");
await browser.close();
