#!/usr/bin/env node
// Frame-by-frame scroll recording of a real web page (for the Scrollcraft before/after demo).
// Headless system Chrome, audio muted, 1920x1080 @ DPR 1. Each frame: one wheel step (eased), a short settle,
// then a screenshot. Frames are assembled at 30fps, so scroll-driven animation plays out smoothly.
// Usage: node tools/scroll-record.mjs <url> <out.mp4> [--secs 14] [--hold 1.2] [--distance 3600] [--settle 45]
import { chromium } from "playwright";
import { mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";

const [url, out, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i >= 0 ? Number(rest[i + 1]) : d; };
const SECS = opt("secs", 14), HOLD = opt("hold", 1.2), SETTLE = opt("settle", 45), FPS = 30;
const tmp = join(dirname(out), `.frames-${Date.now()}`);
mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio", "--enable-gpu-rasterization", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(4500);
await page.evaluate(() => document.querySelectorAll("video,audio").forEach((m) => { m.muted = true; }));
const pageH = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
const DIST = Math.min(opt("distance", 3600), pageH - 1080);
await page.mouse.move(960, 600);

const total = Math.round(SECS * FPS), holdF = Math.round(HOLD * FPS);
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2); // easeInOutQuad
let sent = 0;
for (let f = 0; f < total; f++) {
  if (f >= holdF) {
    const target = ease((f - holdF + 1) / (total - holdF)) * DIST;
    const dy = target - sent;
    if (dy > 0.5) { await page.mouse.wheel(0, dy); sent += dy; }
  }
  await page.waitForTimeout(SETTLE);
  await page.screenshot({ path: join(tmp, `${String(f).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
}
await browser.close();
execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", String(FPS), "-i", join(tmp, "%05d.jpg"), "-c:v", "libx264", "-preset", "medium", "-crf", "18",
  "-pix_fmt", "yuv420p", "-g", "30", "-movflags", "+faststart", out]);
rmSync(tmp, { recursive: true, force: true });
console.log(JSON.stringify({ url, out, secs: SECS, frames: total, scrolled: Math.round(sent), pageHeight: pageH }));
