import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const TIMES = [60, 300, 620, 900];
const COMP = "editing-os-tutorial";
mkdirSync("snapshots-plain", { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("http://localhost:8099/", { waitUntil: "load" });
await p.waitForFunction(`!!(window.__timelines && window.__timelines["${COMP}"])`, { timeout: 30000 });
await p.waitForFunction(`[...document.querySelectorAll("video")].every(v => v.readyState >= 1)`, { timeout: 60000 });
await p.evaluate(() => document.querySelectorAll("video").forEach((v) => v.pause()));
for (const t of TIMES) {
  await p.evaluate(async (t) => {
    await Promise.all([...document.querySelectorAll("video")].map(v => new Promise(res => {
      v.addEventListener("seeked", res, { once: true }); v.currentTime = t; setTimeout(res, 4000);
    })));
  }, t);
  await p.evaluate(([c, t]) => { const tl = window.__timelines[c]; tl.pause(); tl.seek(t, false); }, [COMP, t]);
  await p.waitForTimeout(250);
  await p.locator(`#${COMP}`).screenshot({ path: `snapshots-plain/${t}s.png` });
  console.log(`${t}s`);
}
await b.close();
