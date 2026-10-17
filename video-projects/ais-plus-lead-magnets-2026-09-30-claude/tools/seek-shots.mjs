#!/usr/bin/env node
// Fast layout preview without rendering: seek the GSAP timeline to each scene's hero moment, emulate clip
// visibility (data-start/duration) the way the HyperFrames runtime does, and screenshot. Speaker video is not
// decoded here (graphics/layout check only). Writes a contact sheet.
// Usage: node tools/seek-shots.mjs 06-compositions/<comp> <out.jpg> [t1 t2 ...]   (no times = every scene's hero)
import { chromium } from "playwright";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const [comp, out, ...ts] = process.argv.slice(2);
const dir = resolve(comp);
const tmp = resolve(out + ".frames"); mkdirSync(tmp, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio"] });
const page = await browser.newPage();
await page.goto("file://" + dir + "/index.html");
await page.waitForTimeout(700);
const { W, H, times } = await page.evaluate((ts) => {
  const m = document.getElementById("main");
  const sc = [...document.querySelectorAll("section.scene")].map((s) => { const a = +s.dataset.start, b = a + +s.dataset.duration; return +Math.max(a + 0.9, b - 0.45).toFixed(2); });
  return { W: m.offsetWidth, H: m.offsetHeight, times: ts.length ? ts.map(Number) : sc };
}, ts);
await page.setViewportSize({ width: W, height: H });
const files = [];
for (const [i, t] of times.entries()) {
  await page.evaluate((t) => {
    window.__timelines.main.seek(t);
    document.querySelectorAll(".clip").forEach((el) => { const a = +el.dataset.start, b = a + +el.dataset.duration; el.style.visibility = t >= a && t < b ? "visible" : "hidden"; });
  }, t);
  const f = `${tmp}/${String(i).padStart(3, "0")}.jpg`;
  await page.screenshot({ path: f, type: "jpeg", quality: 80 });
  files.push([f, t]);
}
await browser.close();
// contact sheet via ffmpeg tile (labels are the seek times, printed to stdout)
const cols = W > H ? 3 : 6;
execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", "1", "-i", `${tmp}/%03d.jpg`, "-vf", `scale=${W > H ? 640 : 270}:-2,tile=${cols}x${Math.ceil(files.length / cols)}:padding=6:color=0x222222`, "-frames:v", "1", "-q:v", "3", out]);
rmSync(tmp, { recursive: true, force: true });
console.log(files.map(([, t], i) => `${i + 1}:${t}`).join("  "));
