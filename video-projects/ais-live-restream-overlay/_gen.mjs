// AIS LIVE — Restream sidebar overlay (HyperAgent, TITLE SPONSOR).
// Full-canvas 1920x1080 TRANSPARENT PNG for Restream Studio's custom-overlay slot —
// Restream natively toggles overlays on/off, so a static PNG is the whole deliverable.
// Vertical tab down the RIGHT edge, rotated 90° (reads bottom-to-top), per Anne Marie.
//   node _gen.mjs            -> render all variants -> png/<variant>.png (+ png/preview-<variant>.png in context)
//   node _gen.mjs glass      -> render one
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/aidanstanik/Projects/Video Automation/node_modules/playwright-core/index.js");

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "png");
const TMP = join(OUT, "_html");
mkdirSync(TMP, { recursive: true });
const FONTS = join(ROOT, "..", "ais-live-stings", "assets", "fonts", "fonts.css");
const LOGO = join(ROOT, "..", "ais-live-sponsor-cards", "logos", "hyperagent-white.png");
const LOGO_BLACK = join(ROOT, "..", "ais-live-sponsor-cards", "logos", "hyperagent-black.png");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const LABEL = "TITLE SPONSOR";
const BLUE = "#37BDF8";

// Each variant supplies the panel treatment (applied to the UNROTATED full-height strip).
// Square corners, full 1080px height, flush to the right screen edge — no rounded tab.
const VARIANTS = [
  {
    slug: "glass",
    note: "dark glass strip flush to the edge, liquid-glass line",
    panelCSS: `
      background: linear-gradient(180deg, rgba(7,18,28,0.72), rgba(4,10,17,0.80));
      border-left: 1px solid rgba(255,255,255,0.12);
      backdrop-filter: blur(10px);`,
    accentBar: true,
  },
  {
    slug: "minimal",
    note: "no panel — floating text + lockup with shadow, reads top-down",
    panelCSS: `background: transparent;`,
    accentBar: false,
    floating: true,
    flip: true, // match black: text reads top-to-bottom for the right-hand edge
  },
  {
    slug: "solid",
    note: "opaque onyx strip, max legibility on busy backgrounds",
    panelCSS: `
      background: linear-gradient(180deg, #0B1A28, #07121C);
      border-left: 1px solid rgba(55,189,248,0.25);`,
    accentBar: true,
  },
  {
    slug: "black",
    note: "pure black strip, square corners, top to bottom, no line, reads top-down",
    panelCSS: `background: #000000;`,
    accentBar: false,
    flip: true, // rotate +90: text reads top-to-bottom (for the right-hand edge)
  },
  {
    slug: "black-logo",
    note: "all-black logo + text on fully transparent background (for light footage)",
    panelCSS: `background: transparent;`,
    accentBar: false,
    flip: true,
    dark: true, // black logo/divider, no glow/shadow — meant for light backgrounds
  },
];

function overlayHTML(v, { preview = false } = {}) {
  const bg = preview
    ? `background:
        radial-gradient(1200px 700px at 42% 40%, #23405a 0%, #101d2b 55%, #060d15 100%);`
    : `background: transparent;`;
  const shadow = v.floating
    ? `filter: drop-shadow(0 4px 18px rgba(0,0,0,0.75)) drop-shadow(0 0 2px rgba(0,0,0,0.6));`
    : "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<link href="file://${FONTS}" rel="stylesheet"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:1920px;height:1080px;overflow:hidden;}
  body{${bg}font-family:'Inter',sans-serif;}
  /* mock "speaker frame" so preview reads as a stream, not a poster */
  .mock{position:absolute;inset:0;display:${preview ? "block" : "none"};}
  .mock .cam{position:absolute;left:120px;top:120px;width:1240px;height:840px;border-radius:18px;
    background:linear-gradient(160deg,#1a2c3e,#0d1826);border:1px solid rgba(255,255,255,0.10);}
  .mock .name{position:absolute;left:150px;top:900px;padding:10px 22px;border-radius:8px;
    background:rgba(0,0,0,0.55);color:#fff;font-weight:600;font-size:26px;}
  /* the actual overlay: full-height vertical strip on the right edge, reads bottom-to-top */
  .anchor{position:absolute;right:0;top:0;height:1080px;${shadow}}
  /* panel styling lives on the UNROTATED strip: square corners, spans the full screen height */
  .rotbox{position:relative;display:flex;align-items:center;justify-content:center;
    width:${v.floating ? 150 : 176}px;height:1080px;${v.panelCSS}}
  .tab{flex:none;display:flex;align-items:center;justify-content:center;gap:34px;
    width:1080px;height:${v.floating ? 150 : 176}px;
    transform:rotate(${v.flip ? "90deg" : "-90deg"});transform-origin:center;background:transparent;}
  .eyebrow{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:26px;letter-spacing:0.34em;
    text-transform:uppercase;color:${v.dark ? "#000000" : BLUE};white-space:nowrap;
    text-shadow:${v.dark ? "none" : "0 0 22px rgba(55,189,248,0.45)"};}
  .divider{width:2px;height:56px;background:${v.dark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.28)"};flex:none;}
  .logo{height:60px;width:auto;display:block;}
  /* accent lives on the UNROTATED rotbox so it runs vertically along the panel's inner edge.
     "liquid glass": translucent frosted white-blue with a soft specular sheen, not a solid bar */
  .accent{position:absolute;left:10px;top:50%;transform:translateY(-50%);width:5px;height:70%;
    border-radius:3px;z-index:2;
    background:linear-gradient(180deg,
      rgba(255,255,255,0.70) 0%,
      rgba(190,230,252,0.38) 22%,
      rgba(55,189,248,0.28) 50%,
      rgba(190,230,252,0.38) 78%,
      rgba(255,255,255,0.60) 100%);
    box-shadow:0 0 14px rgba(55,189,248,0.30), inset 0 0 3px rgba(255,255,255,0.55);
    display:${v.accentBar ? "block" : "none"};}
</style></head>
<body>
  <div class="mock">
    <div class="cam"></div>
    <div class="name">Anne Marie</div>
  </div>
  <div class="anchor">
    <div class="rotbox">
      <div class="accent"></div>
      <div class="tab">
        <span class="eyebrow">${LABEL}</span>
        <div class="divider"></div>
        <img class="logo" src="file://${v.dark ? LOGO_BLACK : LOGO}" alt="Hyperagent"/>
      </div>
    </div>
  </div>
</body></html>`;
}

const only = process.argv[2];
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const v of VARIANTS) {
  if (only && v.slug !== only) continue;
  for (const preview of [false, true]) {
    const html = overlayHTML(v, { preview });
    const f = join(TMP, `${preview ? "preview-" : ""}${v.slug}.html`);
    writeFileSync(f, html);
    await page.goto(`file://${f}`);
    await page.waitForTimeout(400); // fonts
    const out = join(OUT, `${preview ? "preview-" : ""}${v.slug}.png`);
    if (preview) {
      await page.screenshot({ path: out });
    } else {
      // deliverable = just the sliver (tab element + margin for glow/shadow), transparent
      const box = await page.locator(".anchor").boundingBox();
      const M = 50; // breathing room so the soft glow isn't clipped
      await page.screenshot({
        path: out,
        omitBackground: true,
        clip: {
          x: Math.max(0, box.x - M),
          y: Math.max(0, box.y - M),
          width: Math.min(1920 - Math.max(0, box.x - M), box.width + 2 * M),
          height: Math.min(1080 - Math.max(0, box.y - M), box.height + 2 * M),
        },
      });
    }
    console.log("wrote", out, `(${v.note})`);
  }
}
await browser.close();
