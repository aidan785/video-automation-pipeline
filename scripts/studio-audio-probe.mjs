// Audio-path probe of the Studio shell. Real Chrome, NO autoplay override, fresh profile.
// Reports: AudioContext states, master gain, decode timing, audio element state, shell mute UI, resource loads.
import { chromium } from "playwright";
const SECS = +(process.argv[2] || 20);
const browser = await chromium.launch({ channel: "chrome", headless: !process.env.HEADED, args: ["--window-size=1600,1000"] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
await ctx.addInitScript(() => {
  const W = window; W.__ac = []; W.__acLog = []; W.__master = null; W.__decode = []; W.__mes = [];
  const AC = W.AudioContext;
  if (AC) {
    W.AudioContext = function (...a) { const c = new AC(...a); W.__ac.push(c); W.__acLog.push(`new AudioContext state=${c.state} t=${Math.round(performance.now())}`); c.addEventListener("statechange", () => W.__acLog.push(`statechange ${c.state} t=${Math.round(performance.now())}`)); return c; };
    W.AudioContext.prototype = AC.prototype;
    const res = AC.prototype.resume; AC.prototype.resume = function () { const p = res.call(this); p.then(() => W.__acLog.push(`resume ok -> ${this.state} t=${Math.round(performance.now())}`), (e) => W.__acLog.push(`resume FAIL ${e?.name} ${e?.message} t=${Math.round(performance.now())}`)); return p; };
    const dec = AC.prototype.decodeAudioData; AC.prototype.decodeAudioData = function (buf, ...r) { const t0 = performance.now(); const e = { bytes: buf.byteLength, t0: Math.round(t0), done: null, err: null }; W.__decode.push(e); const p = dec.call(this, buf, ...r); p.then((ab) => { e.done = Math.round(performance.now() - t0); e.dur = ab.duration; }, (err) => { e.err = String(err); }); return p; };
    const mes = AC.prototype.createMediaElementSource; AC.prototype.createMediaElementSource = function (el) { W.__mes.push(`${el.tagName}#${el.id} t=${Math.round(performance.now())}`); return mes.call(this, el); };
    const gconn = GainNode.prototype.connect; GainNode.prototype.connect = function (dst, ...r) { if (dst instanceof AudioDestinationNode) W.__master = this; return gconn.call(this, dst, ...r); };
  }
});
const page = await ctx.newPage();
const logs = [];
page.on("console", (m) => { const u = m.location()?.url || ""; if (/preview/.test(u) || /hyperframes\]/.test(m.text())) logs.push(`[${m.type()}] ${m.text().slice(0, 240)}`); });
page.on("requestfailed", (r) => logs.push(`[requestfailed] ${r.url().split("/").slice(-2).join("/")} ${r.failure()?.errorText}`));
page.on("response", (r) => { if (/clean-audio|clean\.mp4/.test(r.url()) && r.status() >= 400) logs.push(`[response ${r.status()}] ${r.url()}`); });
await page.goto(`http://localhost:${process.env.PORT || 3002}/#project/${process.env.SLUG || "ais-plus-annual-upsell"}`, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(5000);
console.log("shell prefs (fresh profile):", await page.evaluate(() => localStorage.getItem("hf-studio-ui-preferences")));
let frame = null;
for (let i = 0; i < 30 && !frame; i++) { frame = page.frames().find((f) => f !== page.mainFrame() && /preview/.test(f.url())); if (!frame) await page.waitForTimeout(1000); }
if (!frame) { console.log("NO PREVIEW IFRAME"); await browser.close(); process.exit(1); }
const getFrame = () => page.frames().find((f) => f !== page.mainFrame() && /preview/.test(f.url())) || frame;
for (let i = 0; i < 40; i++) { frame = getFrame(); if (await frame.evaluate(() => !!(window.__player && typeof window.__player.play === "function")).catch(() => false)) break; await page.waitForTimeout(1000); }
await page.waitForTimeout(2000);
const shellUI = () => page.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) => /mute audio/i.test(x.getAttribute("aria-label") || ""));
  const v = document.querySelector('input[aria-label="Preview volume"]');
  return { muteBtn: b?.getAttribute("aria-label"), pressed: b?.getAttribute("aria-pressed"), volume: v?.value };
});
const audio = () => getFrame().evaluate(() => {
  const a = document.querySelector("audio"), v = document.querySelector("video");
  const res = performance.getEntriesByType("resource").filter((e) => /clean-audio|clean\.mp4/.test(e.name)).map((e) => `${e.name.split("/").pop()} status=${e.responseStatus ?? "?"} bytes=${e.transferSize} ${Math.round(e.duration)}ms`);
  return { ac: (window.__ac || []).map((c) => `${c.state}@${c.currentTime.toFixed(2)}`), master: window.__master ? window.__master.gain.value : null, decode: window.__decode, mes: window.__mes,
    aT: +a?.currentTime.toFixed(2), aPaused: a?.paused, aMuted: a?.muted, aVol: a?.volume, aReady: a?.readyState, aErr: a?.error?.code ?? null, aSrc: a?.currentSrc?.split("/").slice(-1)[0],
    vT: +v?.currentTime.toFixed(2), vPaused: v?.paused, vMuted: v?.muted, tl: +(window.__player?.getTime?.() ?? NaN).toFixed(2), playing: !!window.__player?.isPlaying?.(), res: [...new Set(res)].slice(0, 6) };
}).catch((e) => ({ err: String(e).slice(0, 120) }));
console.log("shell UI before play:", JSON.stringify(await shellUI()));
console.log("iframe before play:", JSON.stringify(await audio()));
const play = page.getByRole("button", { name: "Play", exact: true }).first();
if (await play.count()) { await play.click(); console.log("clicked shell Play (real gesture)"); } else console.log("NO Play button");
for (let i = 1; i <= SECS / 2; i++) {
  await page.waitForTimeout(2000);
  const a = await audio();
  console.log(`t+${(i * 2).toString().padStart(2)}s ac=${JSON.stringify(a.ac)} master=${a.master} decode=${JSON.stringify(a.decode)} mes=${JSON.stringify(a.mes)} tl=${a.tl} playing=${a.playing} audio{t=${a.aT} paused=${a.aPaused} muted=${a.aMuted} vol=${a.aVol} ready=${a.aReady} err=${a.aErr}} video{t=${a.vT} paused=${a.vPaused}}${a.err ? " ERR " + a.err : ""}`);
}
const fin = await audio();
console.log("resources:", JSON.stringify(fin.res));
console.log("acLog:", JSON.stringify(await getFrame().evaluate(() => window.__acLog).catch(() => null)));
console.log("shell UI after:", JSON.stringify(await shellUI()));
console.log("console:", logs.length ? "\n" + [...new Set(logs)].slice(0, 25).join("\n") : "none");
await browser.close();
