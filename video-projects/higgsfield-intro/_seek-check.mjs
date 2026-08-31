import { chromium } from "playwright";
const S = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("http://localhost:3002/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5000);
const info = await p.evaluate(() => {
  const pl = document.querySelector("hyperframes-player");
  return { hasPlayer: !!pl, hasCT: pl ? "currentTime" in pl : false, dur: pl?.duration };
});
console.log(JSON.stringify(info));
for (const t of [0.15, 0.8, 1.7, 2.7, 4.3, 4.75, 38.3, 39.3, 41.5]) {
  await p.evaluate((tt) => {
    const pl = document.querySelector("hyperframes-player");
    if (pl) pl.currentTime = tt;
  }, t);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${S}/studio-${t}.png` });
}
await b.close();
console.log("shots done");
