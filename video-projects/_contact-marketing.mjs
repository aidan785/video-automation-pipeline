// Combined contact sheet for the AIS LIVE marketing-asset batch (3 projects, 15 cards).
//   1. extract one settled hero frame from each project's renders/<slug>.mp4
//   2. lay them out in an onyx HTML grid, sectioned by project, brand fonts via file://
//   3. screenshot with Playwright -> ais-live-marketing-renders/contact-sheet.png
// Run AFTER all three batches render. Playwright resolves from workspace-root node_modules.

import { execSync } from "node:child_process";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = dirname(fileURLToPath(import.meta.url)); // video-projects/
const OUT = join(ROOT, "ais-live-marketing-renders");
const FRAMES = join(OUT, "_frames");
mkdirSync(FRAMES, { recursive: true });
const HERO_TS = 3.0; // all cards settled by ~1.5s; loops are static — 3.0s is safe everywhere

const SECTIONS = [
  {
    title: "Week-of Countdown + Registration", proj: "ais-live-countdowns",
    items: [
      { slug: "countdown-7", line: "7 days to go", meta: "COUNTDOWN · 8.0s" },
      { slug: "countdown-5", line: "5 days to go", meta: "COUNTDOWN · 8.0s" },
      { slug: "countdown-3", line: "3 days to go", meta: "COUNTDOWN · 8.0s" },
      { slug: "countdown-2", line: "2 days to go", meta: "COUNTDOWN · 8.0s" },
      { slug: "countdown-1", line: "1 day to go", meta: "COUNTDOWN · 8.0s" },
      { slug: "reg-super-early", line: "Super early bird ends soon.", meta: "REGISTRATION · 8.0s" },
      { slug: "reg-early-bird", line: "Early bird closing.", meta: "PRICING · 8.0s" },
      { slug: "reg-final-call", line: "Final days.", meta: "LAST CALL · 8.0s" },
    ],
  },
  {
    title: "We're Live + Day-1 Outro", proj: "ais-live-moments",
    items: [
      { slug: "live-day1", line: "We're live — Day 1", meta: "ON AIR · 8.0s" },
      { slug: "live-day2", line: "We're live — Day 2", meta: "ON AIR · 8.0s" },
      { slug: "wrap-day1", line: "Day 1 done.", meta: "THAT'S A WRAP · 8.0s" },
      { slug: "see-you-tomorrow", line: "See you tomorrow.", meta: "DAY 1 COMPLETE · 8.0s" },
    ],
  },
  {
    title: "Holding Loops + Tease", proj: "ais-live-loops",
    items: [
      { slug: "doors-open", line: "Real projects. Real revenue.", meta: "DOORS OPEN · 16s loop" },
      { slug: "stage-backdrop", line: "Corner mark · center clear", meta: "STAGE BACKDROP · 16s loop" },
      { slug: "september-tease", line: "September.", meta: "COMING TO AUSTIN · 11.2s" },
    ],
  },
];

let n = 0;
const sectionHTML = SECTIONS.map((sec) => {
  const cells = sec.items.map((it) => {
    const mp4 = join(ROOT, sec.proj, "renders", `${it.slug}.mp4`);
    const png = join(FRAMES, `${it.slug}.png`);
    if (!existsSync(mp4)) { console.warn(`! missing ${mp4}`); return ""; }
    execSync(`ffmpeg -nostdin -loglevel error -y -i "${mp4}" -ss ${HERO_TS} -frames:v 1 "${png}"`);
    n++;
    return `
    <figure class="cell">
      <div class="shot"><img src="file://${png}" alt="${it.slug}" /></div>
      <figcaption>
        <span class="slug">${it.slug}</span>
        <span class="line">${it.line}</span>
        <span class="meta">${it.meta}</span>
      </figcaption>
    </figure>`;
  }).join("\n");
  return `<h2 class="sec">${sec.title}</h2>\n<div class="grid">${cells}</div>`;
}).join("\n");

const fontsCss = join(ROOT, "ais-live-countdowns", "assets", "fonts", "fonts.css");
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" />
<link href="file://${fontsCss}" rel="stylesheet" />
<style>
  :root { --onyx:#07121c; --blue:#37bdf8; --mute:rgba(209,220,232,0.55); }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1920px; background:var(--onyx); color:#fff; font-family:'Inter',sans-serif; padding:64px 72px 90px; }
  .head { display:flex; align-items:baseline; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.10); padding-bottom:22px; margin-bottom:30px; }
  .title { font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; font-size:46px; letter-spacing:-0.03em; }
  .title .b { color:var(--blue); }
  .sub { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:16px; letter-spacing:0.26em; text-transform:uppercase; color:var(--mute); }
  .sec { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:18px; letter-spacing:0.24em; text-transform:uppercase; color:var(--blue); margin:42px 0 22px; padding-bottom:10px; border-bottom:1px solid rgba(55,189,248,0.18); }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:32px 32px; }
  .cell { display:flex; flex-direction:column; gap:14px; }
  .shot { border:1px solid rgba(55,189,248,0.22); border-radius:6px; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.5); }
  .shot img { display:block; width:100%; height:auto; }
  figcaption { display:flex; flex-direction:column; gap:5px; }
  .slug { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:17px; letter-spacing:0.05em; color:var(--blue); }
  .line { font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; font-size:25px; letter-spacing:-0.02em; }
  .meta { font-family:'JetBrains Mono',monospace; font-weight:500; font-size:13px; letter-spacing:0.2em; text-transform:uppercase; color:var(--mute); }
</style></head>
<body>
  <div class="head">
    <div class="title">AIS <span class="b">LIVE</span> — Marketing Asset Kit</div>
    <div class="sub">${n} cards · 1920×1080 · 60fps</div>
  </div>
  ${sectionHTML}
</body></html>`;

const htmlPath = join(FRAMES, "_contact.html");
writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1600 }, deviceScaleFactor: 1 });
await page.goto("file://" + htmlPath);
await page.waitForTimeout(600);
const out = join(OUT, "contact-sheet.png");
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`contact sheet -> ${out} (${n} cells)`);
