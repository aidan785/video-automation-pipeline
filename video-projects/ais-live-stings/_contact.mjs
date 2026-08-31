// Build an on-brand contact sheet for the 10 stings.
//   1. extract one settled "hero" frame from each renders/sting_<slug>.mp4 (ffmpeg)
//   2. lay them out in an onyx HTML grid with captions (brand fonts via file://)
//   3. screenshot the page with Playwright -> renders/contact-sheet.png
// Run AFTER the batch render completes.

import { execSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const DIR = dirname(fileURLToPath(import.meta.url));
const HERO_TS = 2.0; // everything has settled by ~1.45s; dot + ring + glow all live by 2.0s

const ITEMS = [
  { slug: "be-right-back", eyebrow: "INTERMISSION", line: "We'll be right back.", dur: "8.0s" },
  { slug: "back-in-5", eyebrow: "BREAK", line: "Back in 5 minutes", dur: "8.0s" },
  { slug: "back-in-10", eyebrow: "BREAK", line: "Back in 10 minutes", dur: "8.0s" },
  { slug: "up-next", eyebrow: "TRACK 02", line: "Up next.", dur: "8.0s" },
  { slug: "grab-a-coffee", eyebrow: "BREAK", line: "Grab a coffee.", dur: "8.0s" },
  { slug: "starting-soon", eyebrow: "STANDBY", line: "Session starting soon.", dur: "8.0s" },
  { slug: "lunch-break", eyebrow: "BREAK", line: "Lunch break.", dur: "8.0s" },
  { slug: "welcome-back", eyebrow: "WELCOME BACK", line: "Let's go.", dur: "8.0s" },
  { slug: "brand-loop-a", eyebrow: "BRAND LOOP A", line: "Mark only · seamless", dur: "6.4s" },
  { slug: "brand-loop-b", eyebrow: "BRAND LOOP B", line: "Mark on grid · glow swell", dur: "9.6s" },
];

// 1 · extract hero frames
const cells = [];
for (const it of ITEMS) {
  const mp4 = join(DIR, "renders", `sting_${it.slug}.mp4`);
  const png = join(DIR, "frames", `hero_${it.slug}.png`);
  if (!existsSync(mp4)) {
    console.warn(`! missing ${mp4} — skipping`);
    continue;
  }
  execSync(`ffmpeg -nostdin -loglevel error -y -i "${mp4}" -ss ${HERO_TS} -frames:v 1 "${png}"`);
  cells.push({ ...it, png });
}

// 2 · build the HTML sheet
const fontsCss = join(DIR, "assets", "fonts", "fonts.css");
const cellHTML = cells
  .map(
    (c) => `
    <figure class="cell">
      <div class="shot"><img src="file://${c.png}" alt="${c.slug}" /></div>
      <figcaption>
        <span class="slug">sting_${c.slug}</span>
        <span class="line">${c.line}</span>
        <span class="meta">${c.eyebrow} · ${c.dur}</span>
      </figcaption>
    </figure>`
  )
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" />
<link href="file://${fontsCss}" rel="stylesheet" />
<style>
  :root { --onyx:#07121c; --blue:#37bdf8; --paper-mute:rgba(209,220,232,0.55); }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1920px; background:var(--onyx); color:#fff; font-family:'Inter',sans-serif; padding:64px 72px 80px; }
  .head { display:flex; align-items:baseline; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.10); padding-bottom:22px; margin-bottom:44px; }
  .title { font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; font-size:46px; letter-spacing:-0.03em; }
  .title .b { color:var(--blue); }
  .sub { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:16px; letter-spacing:0.28em; text-transform:uppercase; color:var(--paper-mute); }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:36px 36px; }
  .cell { display:flex; flex-direction:column; gap:16px; }
  .shot { border:1px solid rgba(55,189,248,0.22); border-radius:6px; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.5); }
  .shot img { display:block; width:100%; height:auto; }
  figcaption { display:flex; flex-direction:column; gap:5px; }
  .slug { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:17px; letter-spacing:0.06em; color:var(--blue); }
  .line { font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; font-size:26px; letter-spacing:-0.02em; }
  .meta { font-family:'JetBrains Mono',monospace; font-weight:500; font-size:13px; letter-spacing:0.22em; text-transform:uppercase; color:var(--paper-mute); }
</style></head>
<body>
  <div class="head">
    <div class="title">AIS <span class="b">LIVE</span> — Transition / Break Stings</div>
    <div class="sub">${cells.length} cards · 1920×1080 · 60fps · loop-friendly</div>
  </div>
  <div class="grid">
${cellHTML}
  </div>
</body></html>`;

const htmlPath = join(DIR, "frames", "_contact.html");
writeFileSync(htmlPath, html);

// 3 · screenshot with Playwright
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1400 }, deviceScaleFactor: 1 });
await page.goto("file://" + htmlPath);
await page.waitForTimeout(500); // let fonts + images paint
const out = join(DIR, "renders", "contact-sheet.png");
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`contact sheet -> ${out} (${cells.length} cells)`);
