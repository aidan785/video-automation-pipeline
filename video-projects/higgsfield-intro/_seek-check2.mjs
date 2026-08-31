import { chromium } from "playwright";
const S = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("http://localhost:3002/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5000);
for (const t of [0.5, 1.2, 2.7, 4.3, 4.75, 39.3]) {
  await p.evaluate((tt) => { document.querySelector("hyperframes-player").currentTime = tt; }, t);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${S}/v2-${t}.png` });
}
await b.close();
console.log("done");
