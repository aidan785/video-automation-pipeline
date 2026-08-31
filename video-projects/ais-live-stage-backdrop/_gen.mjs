// AIS LIVE — Stage Backdrop (#15). Static broadcast backdrop, multiple sizes.
//   Sits BEHIND a main-stage session, so the CENTER stays clear (speaker/content lives there).
//   Branding lives in the corners: Shift mark + MAIN STAGE eyebrow top, tagline + sponsor lockup bottom.
//   HyperAgent presenting-sponsor lockup per sponsor contract (white wordmark, assets/logos/sponsor-hyperagent.png).
//   Static -> Playwright screenshot (NOT HyperFrames video).
//
//   node _gen.mjs            -> render all 3 sizes to renders/
//   node _gen.mjs 16x9       -> render just one size

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = dirname(fileURLToPath(import.meta.url));
const RENDERS = join(ROOT, "renders");
const TMP = join(RENDERS, "_html");
mkdirSync(TMP, { recursive: true });
const FONTS = join(ROOT, "..", "ais-live-stings", "assets", "fonts", "fonts.css");
const SPONSOR_LOGO = join(ROOT, "assets", "logos", "sponsor-hyperagent.png");

const SIZES = [
  { name: "16x9", w: 1920, h: 1080, pad: 90, mark: 52, eyebrow: 18, tag: 40 },
  { name: "9x16", w: 1080, h: 1920, pad: 80, mark: 46, eyebrow: 16, tag: 38 },
  { name: "1x1", w: 1080, h: 1080, pad: 76, mark: 46, eyebrow: 16, tag: 34 },
];

function backdropHTML(s) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />
<link href="file://${FONTS}" rel="stylesheet" />
<style>
  :root{ --onyx:#07121c; --blue:#37bdf8; --paper-soft:rgba(209,220,232,0.82); --paper-mute:rgba(209,220,232,0.50); }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ width:${s.w}px; height:${s.h}px; }
  body{ background:#07121c; color:#fff; font-family:'Inter',sans-serif; position:relative; overflow:hidden; }
  .grid{ position:absolute; inset:0; background-image:
      linear-gradient(rgba(55,189,248,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(55,189,248,0.06) 1px, transparent 1px);
      background-size:26px 26px; }
  .glowA{ position:absolute; top:-14%; left:-8%; width:48%; height:52%; border-radius:50%;
      background:rgba(55,189,248,0.20); filter:blur(150px); }
  .glowB{ position:absolute; bottom:-16%; right:-10%; width:46%; height:50%; border-radius:50%;
      background:rgba(255,138,92,0.12); filter:blur(150px); }
  .vig{ position:absolute; inset:0; background:radial-gradient(125% 115% at 50% 45%, transparent 50%, rgba(0,0,0,0.62) 100%); }
  .safe{ position:absolute; inset:0; padding:${s.pad}px; display:flex; flex-direction:column; justify-content:space-between; }
  .top{ display:flex; align-items:flex-start; justify-content:space-between; }
  .mark{ font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; letter-spacing:-0.03em;
      line-height:0.9; font-size:${s.mark}px; display:inline-flex; align-items:baseline; position:relative; }
  .mark .ais{ color:#fff; } .mark .gap{ display:inline-block; width:0.08em; }
  .mark .live{ color:var(--blue); position:relative; text-shadow:0 0 60px rgba(55,189,248,0.55); padding-right:0.30em; }
  .mark .dot{ position:absolute; top:0.08em; left:100%; margin-left:0.04em; width:0.15em; height:0.15em;
      border-radius:50%; background:#ff3b30; box-shadow:0 0 0.7em #ff3b30,0 0 0.25em #ff3b30; }
  .stage{ display:inline-flex; align-items:center; gap:10px; font-family:'JetBrains Mono',monospace; font-weight:700;
      font-size:${s.eyebrow}px; letter-spacing:0.30em; text-transform:uppercase; color:var(--paper-soft);
      border:1px solid rgba(255,255,255,0.18); border-radius:999px; padding:9px 16px 9px 14px; background:rgba(255,255,255,0.05); }
  .stage .d{ width:9px; height:9px; border-radius:50%; background:#ff3b30; box-shadow:0 0 8px #ff3b30; }
  .bottom{ display:flex; align-items:flex-end; justify-content:flex-end; gap:24px; }
  .tag{ font-family:'Montserrat',sans-serif; font-weight:900; font-style:italic; letter-spacing:-0.03em;
      line-height:1.0; font-size:${s.tag}px; }
  .tag em{ font-style:italic; color:var(--blue); }
  .sponsor{ text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:10px; }
  .sponsor .lbl{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:${Math.round(s.eyebrow*0.78)}px;
      letter-spacing:0.28em; text-transform:uppercase; color:var(--paper-mute); }
  .sponsor .slot img{ display:block; height:${Math.round(s.eyebrow * 2.1)}px; width:auto;
      filter:drop-shadow(0 0 18px rgba(255,255,255,0.10)); }
</style></head>
<body>
  <div class="grid"></div><div class="glowA"></div><div class="glowB"></div><div class="vig"></div>
  <div class="safe">
    <div class="top">
      <span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="dot"></span></span></span>
    </div>
    <div class="bottom">
      <div class="sponsor"><span class="lbl">Presented by</span><span class="slot"><img src="file://${SPONSOR_LOGO}" alt="HyperAgent" /></span></div>
    </div>
  </div>
</body></html>`;
}

const only = process.argv[2];
const list = only ? SIZES.filter((s) => s.name === only) : SIZES;
if (!list.length) { console.error(`no size matching "${only}" (use 16x9 | 9x16 | 1x1)`); process.exit(1); }

const browser = await chromium.launch();
for (const s of list) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
  const htmlPath = join(TMP, `backdrop-${s.name}.html`);
  writeFileSync(htmlPath, backdropHTML(s));
  await page.goto("file://" + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(RENDERS, `backdrop-${s.name}.png`) });
  await page.close();
  console.log("backdrop ->", `renders/backdrop-${s.name}.png  (${s.w}x${s.h})`);
}
await browser.close();
console.log("\ndone");
