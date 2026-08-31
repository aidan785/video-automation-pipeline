// AIS LIVE — sponsor cards (HyperAgent, Glaido, Clay).
// Premium white sponsor tile centered on a TRANSPARENT 1920x1080 canvas — built for
// 3D extrude / animation in After Effects. White card because Clay's wordmark is black
// (and HyperAgent/Glaido have clean colored/black marks that read on light).
//   node _gen-sponsors.mjs         -> render all -> png/<slug>.png (transparent)
//   node _gen-sponsors.mjs clay    -> render one

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
const LOGOS = join(ROOT, "logos");
const FONTS = join(ROOT, "..", "ais-live-stings", "assets", "fonts", "fonts.css");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SPON = [
  { slug:"hyperagent", logo:"hyperagent-big.png", tier:"PRESENTING SPONSOR", accent:"#37bdf8", imgStyle:"width:1180px;height:auto;", noUnderline:true },
  { slug:"glaido",     logo:"glaido-black-lockup.png", tier:"OFFICIAL SPONSOR",   accent:"#8ed11a", imgStyle:"width:1200px;height:auto;max-width:1200px;" },
  { slug:"clay",       logo:"clay.png",            tier:"OFFICIAL SPONSOR",   accent:"#29b6e6", imgStyle:"height:456px;max-width:1160px;" },
];

function cardHTML(s){
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<link href="file://${FONTS}" rel="stylesheet"/>
<style>
  :root{ --ac:${s.accent}; --ink:#0b1a28; }
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:1920px;height:1080px;}
  body{background:transparent;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;}
  .card{position:relative;width:1400px;height:820px;border-radius:44px;overflow:hidden;
    background:linear-gradient(158deg,#ffffff 0%,#eef2f7 100%);
    border:1px solid rgba(20,40,70,0.08);
    box-shadow:0 70px 170px rgba(10,25,45,0.45), inset 0 2px 0 rgba(255,255,255,0.9);
    display:flex;flex-direction:column;padding:74px 84px;}
  .sheen{position:absolute;top:-40%;left:-20%;width:70%;height:180%;transform:rotate(18deg);
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent);pointer-events:none;}
  .glow{position:absolute;bottom:-220px;right:-160px;width:640px;height:640px;border-radius:50%;
    background:${s.accent};opacity:0.14;filter:blur(120px);pointer-events:none;}
  .top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;}
  .tier{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:20px;letter-spacing:.28em;text-transform:uppercase;color:var(--ink);}
  .tier .u{display:block;width:64px;height:4px;border-radius:2px;background:var(--ac);margin-top:12px;box-shadow:0 0 18px ${s.accent}66;}
  .mark{font-family:'Montserrat',sans-serif;font-style:italic;font-weight:900;letter-spacing:-0.03em;font-size:30px;
    display:inline-flex;align-items:baseline;position:relative;}
  .mark .ais{color:var(--ink);} .mark .gap{width:.08em;display:inline-block;}
  .mark .live{color:#1f9fd6;position:relative;padding-right:.30em;}
  .mark .dot{position:absolute;top:.06em;left:100%;margin-left:.04em;width:.15em;height:.15em;border-radius:50%;background:#ff3b30;box-shadow:0 0 .5em #ff3b30;}
  .logowrap{position:relative;z-index:2;flex:1;display:flex;align-items:center;justify-content:center;}
  .logowrap img{${s.imgStyle}object-fit:contain;}
  .foot{position:relative;z-index:2;text-align:center;font-family:'JetBrains Mono',monospace;font-weight:500;
    font-size:17px;letter-spacing:.26em;text-transform:uppercase;color:rgba(11,26,40,0.5);}
</style></head>
<body>
  <div class="card">
    <div class="sheen"></div><div class="glow"></div>
    <div class="top">
      <span class="tier">${s.tier}${s.noUnderline ? "" : '<span class="u"></span>'}</span>
      <span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="dot"></span></span></span>
    </div>
    <div class="logowrap"><img src="file://${join(LOGOS, s.logo)}"/></div>
    <div class="foot">AIS LIVE 2026 · July 11–12</div>
  </div>
</body></html>`;
}

const only = process.argv[2];
const list = only ? SPON.filter(s => s.slug === only) : SPON;
if (!list.length){ console.error(`no sponsor "${only}"`); process.exit(1); }

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport:{ width:1920, height:1080 }, deviceScaleFactor:2 });
const made = [];
for (const s of list){
  const htmlPath = join(TMP, `${s.slug}.html`);
  writeFileSync(htmlPath, cardHTML(s));
  await page.goto("file://" + htmlPath, { waitUntil:"load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `sponsor-${s.slug}.png`), omitBackground:true });
  made.push(s.slug);
  console.log("card ->", `png/sponsor-${s.slug}.png`);
}
await browser.close();
console.log(`\ndone — ${made.length} transparent sponsor card(s) in png/`);
