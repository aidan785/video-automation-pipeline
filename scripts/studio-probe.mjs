// Headed probe of the Studio shell in the user's real Google Chrome (GPU on).
import { chromium } from "playwright";
const SECS = +(process.argv[2] || 20);
const browser = await chromium.launch({ channel: "chrome", headless: process.env.HEADED ? false : true, args: ["--autoplay-policy=no-user-gesture-required", "--window-size=1600,1000"] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const logs = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) logs.push(`[shell ${m.type()}] ${m.text().slice(0, 200)}`); });
page.on("pageerror", (e) => logs.push(`[shell pageerror] ${String(e).slice(0, 200)}`));
await page.goto(`http://localhost:${process.env.PORT || 3002}/#project/${process.env.SLUG || "ais-plus-annual-upsell"}`, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(6000);
// buttons available in the shell
const buttons = await page.evaluate(() => [...document.querySelectorAll("button")].map((b) => (b.getAttribute("aria-label") || b.title || b.textContent || "").trim()).filter(Boolean).slice(0, 40));
console.log("shell buttons:", JSON.stringify(buttons));
// find the preview iframe
let frame = null;
for (let i = 0; i < 30 && !frame; i++) {
  frame = page.frames().find((f) => f !== page.mainFrame() && /preview/.test(f.url()));
  if (!frame) await page.waitForTimeout(1000);
}
if (!frame) { console.log("NO PREVIEW IFRAME. frames:", page.frames().map((f) => f.url())); await browser.close(); process.exit(1); }
console.log("iframe:", frame.url());
frame.on?.("console", () => {});
page.on("console", (m) => { if (m.location()?.url?.includes("preview") && ["error", "warning"].includes(m.type())) logs.push(`[iframe ${m.type()}] ${m.text().slice(0, 200)}`); });
let ready = false;
for (let i = 0; i < 40 && !ready; i++) { await page.waitForTimeout(1000); ready = await frame.evaluate(() => !!(window.__player && typeof window.__player.play === "function")).catch(() => false); }
console.log("player ready:", ready);
await page.waitForTimeout(3000);
// instrument the iframe: rAF fps, long tasks, media state
await frame.evaluate(() => {
  window.__probe = { raf: 0, long: 0, longMs: 0, t0: performance.now() };
  const tick = () => { window.__probe.raf++; requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { window.__probe.long++; window.__probe.longMs += e.duration; })).observe({ entryTypes: ["longtask"] }); } catch {}
});
const media = async () => {
  // the Studio may reload the iframe (it writes hf-ids back into index.html); re-find + re-instrument
  const f2 = page.frames().find((f) => f !== page.mainFrame() && /preview/.test(f.url()));
  if (f2 && f2 !== frame) { frame = f2; console.log("  (iframe reloaded)"); }
  const has = await frame.evaluate(() => !!window.__probe).catch(() => false);
  if (!has) { await frame.evaluate(() => { window.__probe = { raf: 0, long: 0, longMs: 0 }; const tick = () => { window.__probe.raf++; requestAnimationFrame(tick); }; requestAnimationFrame(tick); try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { window.__probe.long++; window.__probe.longMs += e.duration; })).observe({ entryTypes: ["longtask"] }); } catch {} }).catch(() => {}); }
  return frame.evaluate(() => {
  const v = document.querySelector("video"), a = document.querySelector("audio");
  const q = v?.getVideoPlaybackQuality?.();
  return { vt: +v?.currentTime.toFixed(2), vPaused: v?.paused, vMuted: v?.muted, vReady: v?.readyState, vRate: v?.playbackRate, decoded: q?.totalVideoFrames, dropped: q?.droppedVideoFrames,
           at: +a?.currentTime.toFixed(2), aPaused: a?.paused, aMuted: a?.muted, aVol: a?.volume, aReady: a?.readyState, aSrc: a?.currentSrc?.split("/").pop(), vSrc: v?.currentSrc?.split("/").pop(),
           tl: +(window.__player?.getTime?.() ?? NaN), raf: window.__probe?.raf ?? 0, long: window.__probe?.long ?? 0, longMs: Math.round(window.__probe?.longMs ?? 0), now: performance.now() };
}); };
console.log("before play:", JSON.stringify(await media()));
// press play via the shell UI (fallback: player API inside the iframe)
const play = page.getByRole("button", { name: "Play", exact: true }).first();
const playing = () => frame.evaluate(() => ({ playing: !!window.__player?.isPlaying?.(), t: +(window.__player?.getTime?.() ?? NaN).toFixed(2), dur: window.__player?.getDuration?.() })).catch(() => ({}));
console.log("state before click:", JSON.stringify(await playing()));
if (await play.count()) { await play.click(); console.log("clicked shell Play"); } else console.log("NO Play button");
await page.waitForTimeout(1500);
let st = await playing(); console.log("state after click:", JSON.stringify(st));
if (!st.playing) { await frame.evaluate(() => window.__player.play()); await page.waitForTimeout(1000); st = await playing(); console.log("fallback __player.play():", JSON.stringify(st)); }
const waitPlayer = async () => { for (let i = 0; i < 30; i++) { const f2 = page.frames().find((f) => f !== page.mainFrame() && /preview/.test(f.url())); if (f2) frame = f2; if (await frame.evaluate(() => !!(window.__player && typeof window.__player.play === "function")).catch(() => false)) return true; await page.waitForTimeout(1000); } return false; };
let prev = await media().catch(() => null);
let reloads = 0;
for (let i = 0; i < SECS / 4; i++) {
  await page.waitForTimeout(4000);
  let m;
  try { m = await media(); } catch (e) { reloads++; console.log(`  (iframe navigated during sample; re-acquiring)`); await waitPlayer(); await page.waitForTimeout(1500); if (!(await playing()).playing) { await frame.evaluate(() => window.__player.play()).catch(() => {}); console.log("  (re-armed play after reload)"); } prev = await media().catch(() => null); continue; }
  if (!prev) { prev = m; continue; }
  const dt = (m.now - prev.now) / 1000;
  if (m.raf < prev.raf || m.now < prev.now) { reloads++; console.log("  (iframe reloaded)"); if (!(await playing()).playing) { await frame.evaluate(() => window.__player.play()).catch(() => {}); console.log("  (re-armed play after reload)"); } prev = await media().catch(() => null); continue; }
  console.log(`t+${((i + 1) * 4).toString().padStart(2)}s  fps ${((m.raf - prev.raf) / dt).toFixed(1)}  video ${prev.vt}->${m.vt} (${((m.vt - prev.vt) / dt).toFixed(2)}x)  decoded +${m.decoded - prev.decoded} dropped +${m.dropped - prev.dropped}  longtasks +${m.long - prev.long} (${m.longMs - prev.longMs}ms)  audio t=${m.at} paused=${m.aPaused} muted=${m.aMuted} vol=${m.aVol}  vMuted=${m.vMuted}`);
  prev = m;
}
console.log("final:", JSON.stringify(await media().catch(() => ({}))), "reloads:", reloads);
console.log("errors/warnings:", logs.length ? "\n" + [...new Set(logs)].slice(0, 15).join("\n") : "none");
await browser.close();
