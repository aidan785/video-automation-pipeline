import { chromium } from "playwright";
const S = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("http://localhost:3002/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5000);
for (const t of [41.3, 42.3, 45.0, 47.6]) {
  await p.evaluate((tt) => { document.querySelector("hyperframes-player").currentTime = tt; }, t);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${S}/n-${t}.png` });
}
await b.close(); console.log("done");
