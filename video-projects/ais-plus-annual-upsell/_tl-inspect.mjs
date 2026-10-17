import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("http://localhost:3002/api/projects/ais-plus-annual-upsell/preview", { waitUntil: "domcontentloaded", timeout: 120000 });
let ready = false;
for (let i = 0; i < 40 && !ready; i++) {
  await page.waitForTimeout(3000);
  ready = await page.evaluate(() => !!(window.__player && typeof window.__player.seek === "function"));
}
if (!ready) { console.error("no player"); await browser.close(); process.exit(1); }
await page.waitForTimeout(5000);
const info = await page.evaluate(() => {
  const tl = window.__timelines["ais-plus-annual-upsell"];
  const rows = [];
  const walk = (t, base, depth) => {
    for (const c of t.getChildren(false, true, true)) {
      const st = base + c.startTime();
      const en = st + c.totalDuration();
      let tg = "";
      try { tg = (c.targets ? c.targets() : []).map(x => x.id ? "#" + x.id : (x.className && typeof x.className === "string" ? "." + x.className.split(" ").slice(0,2).join(".") : (x.tagName || "obj"))).slice(0,3).join(","); } catch {}
      rows.push({ kind: c.getChildren ? "tl" : "tw", st: +st.toFixed(3), en: +en.toFixed(3), dur: +c.totalDuration().toFixed(3), tg, depth, vars: c.vars ? Object.keys(c.vars).filter(k=>!["onComplete","onStart"].includes(k)).slice(0,6).join(",") : "" });
      if (c.getChildren && depth < 3) walk(c, st, depth + 1);
    }
  };
  walk(tl, 0, 0);
  rows.sort((a, b) => b.en - a.en);
  return { duration: tl.duration(), top: rows.slice(0, 12) };
});
console.log("duration", info.duration);
for (const r of info.top) console.log(JSON.stringify(r));
await browser.close();
