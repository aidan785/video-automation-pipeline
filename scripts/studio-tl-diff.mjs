// Which card timeline outlives the video, and in which context (Studio shell iframe vs bare preview)?
import { chromium } from "playwright";
const PORT = process.env.PORT || 3002, SLUG = process.env.SLUG || "ais-plus-annual-upsell";
const browser = await chromium.launch({ channel: "chrome", headless: true });
async function measure(mode) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  let frame;
  if (mode === "shell") {
    await page.goto(`http://localhost:${PORT}/#project/${SLUG}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    for (let i = 0; i < 40 && !frame; i++) { await page.waitForTimeout(1000); frame = page.frames().find((f) => f !== page.mainFrame() && /preview/.test(f.url())); }
  } else {
    await page.goto(`http://localhost:${PORT}/api/projects/${SLUG}/preview`, { waitUntil: "domcontentloaded", timeout: 120000 });
    frame = page.mainFrame();
  }
  for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); if (await frame.evaluate(() => !!(window.__player && window.__timelines)).catch(() => false)) break; }
  await page.waitForTimeout(6000);
  const r = await frame.evaluate(() => {
    const id = document.querySelector("[data-composition-id]").getAttribute("data-composition-id");
    const tl = window.__timelines[id];
    const desc = (c) => { let tg = ""; try { tg = (c.targets ? c.targets() : []).map((x) => x.id ? "#" + x.id : (typeof x.className === "string" ? "." + x.className.split(" ").slice(0, 2).join(".") : (x.tagName || "obj"))).slice(0, 2).join(","); } catch {} return { tg, dur: +c.totalDuration().toFixed(2), rep: c.repeat?.(), vars: c.vars ? Object.keys(c.vars).filter((k) => !/^on/.test(k)).slice(0, 7).join(",") : "" }; };
    const beats = Object.entries(window.__beatTimelines || {}).map(([k, t]) => ({ k, total: +t.totalDuration().toFixed(2), longest: t.getChildren(true, true, true).map((c) => ({ ...desc(c), end: +(c.startTime() + c.totalDuration()).toFixed(2) })).sort((a, b) => b.end - a.end)[0] })).filter((b) => b.total > 10.01);
    // MT children that end past the video
    const late = tl.getChildren(false, true, true).map((c) => ({ st: +c.startTime().toFixed(2), en: +(c.startTime() + c.totalDuration()).toFixed(2), isTl: !!c.getChildren, ...desc(c) })).filter((c) => c.en > 383.71).sort((a, b) => b.en - a.en).slice(0, 4);
    return { tl: tl.duration(), beatsOver10: beats.slice(0, 4), late, studioEditsHook: typeof window.__hfStudioManualEditsApply, motionAttr: document.querySelectorAll("[data-hf-studio-motion]").length };
  });
  await page.close();
  return r;
}
console.log("=== SHELL IFRAME ===\n" + JSON.stringify(await measure("shell"), null, 1));
console.log("=== BARE PREVIEW ===\n" + JSON.stringify(await measure("bare"), null, 1));
await browser.close();
