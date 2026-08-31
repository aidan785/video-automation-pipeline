import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("file:///Users/aidanstanik/Projects/Video Automation/video-projects/updown-upsell/index.html", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__timelines && Object.keys(window.__timelines).length && document.fonts.status === "loaded", { timeout: 20000 }).catch(() => {});
await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/_warm.png" });
for (const t of [174.10, 174.30, 174.50, 174.70, 174.95]) {
  await page.evaluate((t) => {
    // emulate HF clip gating: show beats whose window contains t
    document.querySelectorAll(".beat").forEach(el => {
      const s = parseFloat(el.dataset.start), d = parseFloat(el.dataset.duration);
      el.style.display = (t >= s && t < s + d) ? "block" : "none";
    });
    document.querySelectorAll("video").forEach(v => v.pause());
    const tl = window.__timelines[Object.keys(window.__timelines)[0]];
    tl.seek(t, false);
  }, t);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `video-projects/updown-upsell/frames/seam-${t.toFixed(2)}.png` });
  console.log(`seam-${t.toFixed(2)}.png`);
}
await browser.close();
