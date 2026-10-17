// Dump every duration the runtime could be using, from inside the live preview iframe.
import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome", headless: !process.env.HEADED });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const diags = [];
await page.exposeFunction("__diag", (d) => diags.push(d));
await page.addInitScript(() => { window.addEventListener("message", (e) => { try { const d = e.data; if (d && d.source === "hf-preview" && d.type === "diagnostic") window.__diag(JSON.stringify({ code: d.code, details: d.details }).slice(0, 400)); } catch {} }); });
await page.goto(`http://localhost:${process.env.PORT || 3002}/#project/${process.env.SLUG || "ais-plus-annual-upsell"}`, { waitUntil: "domcontentloaded", timeout: 120000 });
let frame = null;
for (let i = 0; i < 40 && !frame; i++) { await page.waitForTimeout(1000); frame = page.frames().find((f) => f !== page.mainFrame() && /preview/.test(f.url())); }
for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); if (await frame.evaluate(() => !!window.__player).catch(() => false)) break; }
await page.waitForTimeout(5000);
const info = await frame.evaluate(() => {
  const id = document.querySelector("[data-composition-id]").getAttribute("data-composition-id");
  const tl = window.__timelines[id];
  const deepest = (t, base, depth) => { let mx = 0; for (const c of t.getChildren(false, true, true)) { const st = base + c.startTime(); const en = st + c.totalDuration(); mx = Math.max(mx, en); if (c.getChildren) mx = Math.max(mx, deepest(c, st, depth + 1)); } return mx; };
  const v = document.querySelector("video"), a = document.querySelector("audio");
  return { tlDuration: tl.duration(), tlTotal: tl.totalDuration(), deepestChildEnd: +deepest(tl, 0, 0).toFixed(3), timeScale: tl.timeScale(),
           videoIntrinsic: v?.duration, audioIntrinsic: a?.duration, stampedVideoStage: document.getElementById("video-stage")?.getAttribute("data-duration"), stampedScrim: document.getElementById("sp-scrim")?.getAttribute("data-duration"),
           playerDur: window.__player?.getDuration?.(), registryKeys: Object.keys(window.__timelines), beatTimelines: Object.keys(window.__beatTimelines || {}).length,
           beatTlMaxDur: Math.max(...Object.values(window.__beatTimelines || {}).map((t) => t.totalDuration())) };
});
console.log(JSON.stringify(info, null, 1));
console.log("diagnostics:", diags.filter((d) => /timeline_bound|duration|loop_guard/.test(d)).slice(0, 6).join("\n") || "none captured");
await browser.close();
