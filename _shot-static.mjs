import { chromium } from "playwright";
const [url, comp, times, prefix] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(url, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(3500);
for (const t of times.split(",")) {
  await p.evaluate(([c, tt]) => window.__timelines[c].seek(+tt), [comp, t]);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${prefix}-${t}.png` });
}
await b.close();
