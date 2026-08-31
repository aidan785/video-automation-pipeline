import { chromium } from "playwright";
const [url, comp, times, prefix] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
await p.waitForTimeout(3000);
for (const t of times.split(",")) {
  await p.evaluate(([c, tt]) => { window.__timelines[c].seek(+tt); return null; }, [comp, t]);
  await p.waitForTimeout(350);
  await p.screenshot({ path: `${prefix}-${t}.png` });
  console.log("shot", t);
}
await b.close();
console.log("all done");
