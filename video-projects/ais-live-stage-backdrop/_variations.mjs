// AIS LIVE — Stage Backdrop VARIATIONS (#15). Distinct broadcast-backdrop looks to choose from.
// All 16:9 1920x1080, center kept CLEAR for the speaker feed, on the AIS LIVE brand.
// Sponsor lockup = HyperAgent (presenting sponsor per Event Schedule v6.1) — real white wordmark from assets/logos/.
// Static -> Playwright screenshot @2x. Pick favorites, then export to 3 sizes via _gen.mjs.
//
//   node _variations.mjs            -> render all variations + contact sheet
//   node _variations.mjs <slug>     -> render one

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = dirname(fileURLToPath(import.meta.url));
const RENDERS = join(ROOT, "renders");
const TMP = join(RENDERS, "_html");
mkdirSync(TMP, { recursive: true });
const FONTS = join(ROOT, "..", "ais-live-stings", "assets", "fonts", "fonts.css");
const SPONSOR_LOGO = join(ROOT, "assets", "logos", "sponsor-hyperagent.png");

const AC = { blue: "#37bdf8", coral: "#ff8a5c", yellow: "#f5d82a" };

const MARK = (size, glow = true) => `<span class="mark" style="font-size:${size}px">
  <span class="ais">AIS</span><span class="gap"></span><span class="live"${glow ? "" : ' style="text-shadow:none"'}>LIVE<span class="dot"></span></span></span>`;
const PILL = (text, ac) => `<span class="pill" style="--p:${ac}"><span class="d"></span>${text}</span>`;
const TAG = (ac) => `<div class="tag">Real Projects.<br/>Real <em style="color:${ac}">Revenue.</em></div>`;
const SPON = () => `<div class="sponsor"><span class="lbl">Presented by</span><span class="slot"><img src="file://${SPONSOR_LOGO}" alt="HyperAgent"/></span></div>`;

// shared CSS (mark, pill, tagline, sponsor, vignette, grid)
const BASE_CSS = `
  :root{ --blue:#37bdf8; --red:#ff3b30; --soft:rgba(209,220,232,0.82); --mute:rgba(209,220,232,0.50); }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ width:1920px; height:1080px; }
  body{ color:#fff; font-family:'Inter',sans-serif; position:relative; overflow:hidden; }
  .vig{ position:absolute; inset:0; background:radial-gradient(125% 115% at 50% 45%, transparent 50%, rgba(0,0,0,0.62) 100%); }
  .cmdgrid{ position:absolute; inset:0; background-image:
      linear-gradient(rgba(55,189,248,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(55,189,248,0.06) 1px, transparent 1px); background-size:26px 26px; }
  .glow{ position:absolute; border-radius:50%; filter:blur(150px); }
  .mark{ font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; letter-spacing:-0.03em;
      line-height:0.9; display:inline-flex; align-items:baseline; position:relative; }
  .mark .ais{ color:#fff; } .mark .gap{ display:inline-block; width:0.08em; }
  .mark .live{ color:var(--blue); position:relative; text-shadow:0 0 60px rgba(55,189,248,0.55); padding-right:0.30em; }
  .mark .dot{ position:absolute; top:0.08em; left:100%; margin-left:0.04em; width:0.15em; height:0.15em; border-radius:50%;
      background:var(--red); box-shadow:0 0 0.7em #ff3b30,0 0 0.25em #ff3b30; }
  .pill{ display:inline-flex; align-items:center; gap:11px; font-family:'JetBrains Mono',monospace; font-weight:700;
      font-size:18px; letter-spacing:0.30em; text-transform:uppercase; color:var(--soft);
      border:1px solid rgba(255,255,255,0.18); border-radius:999px; padding:10px 18px 10px 15px; background:rgba(255,255,255,0.05); }
  .pill .d{ width:9px; height:9px; border-radius:50%; background:var(--p); box-shadow:0 0 9px var(--p); }
  .tag{ font-family:'Montserrat',sans-serif; font-weight:900; font-style:italic; letter-spacing:-0.03em; line-height:1.0; font-size:42px; }
  .tag em{ font-style:italic; }
  .sponsor{ display:flex; flex-direction:column; gap:9px; }
  .sponsor .lbl{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:13px; letter-spacing:0.28em; text-transform:uppercase; color:var(--mute); }
  .sponsor .slot img{ display:block; height:38px; width:auto; filter:drop-shadow(0 0 18px rgba(255,255,255,0.10)); }
  .abs{ position:absolute; }
`;

function page(extraCSS, body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<link href="file://${FONTS}" rel="stylesheet"/>
<style>${BASE_CSS}${extraCSS}</style></head><body>${body}</body></html>`;
}

// ---- variations ----
const VARIATIONS = [
  {
    slug: "v1-command-deck", name: "Command Deck",
    html: page(`body{background:#07121c;}
      .gA{top:-14%;left:-8%;width:48%;height:52%;background:rgba(55,189,248,0.20);}
      .gB{bottom:-16%;right:-10%;width:46%;height:50%;background:rgba(255,138,92,0.12);}`,
      `<div class="cmdgrid"></div><div class="glow gA"></div><div class="glow gB"></div><div class="vig"></div>
       <div class="abs" style="top:90px;left:120px">${MARK(54)}</div>
       <div class="abs" style="top:96px;right:120px">${PILL("Main Stage", "var(--red)")}</div>
       <div class="abs" style="bottom:90px;left:120px">${TAG(AC.blue)}</div>
       <div class="abs" style="bottom:90px;right:120px;text-align:right">${SPON()}</div>`),
  },
  {
    slug: "v2-minimal-centered", name: "Minimal · Centered Mark",
    html: page(`body{background:#07121c;}
      .cmdgrid{opacity:0.5;}
      .gA{top:-22%;left:50%;margin-left:-460px;width:920px;height:760px;background:rgba(55,189,248,0.16);}`,
      `<div class="cmdgrid"></div><div class="glow gA"></div><div class="vig"></div>
       <div class="abs" style="top:120px;left:0;width:100%;text-align:center">${MARK(78)}</div>
       <div class="abs" style="bottom:96px;left:0;width:100%;text-align:center">
         <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:18px;letter-spacing:0.34em;text-transform:uppercase;color:var(--mute)">Real Projects · Real Revenue</div>
       </div>`),
  },
  {
    slug: "v3-cinematic-vip", name: "Cinematic Black · VIP",
    html: page(`body{background:#000;}
      .gA{top:-18%;right:-12%;width:60%;height:64%;background:rgba(55,189,248,0.22);}
      .vig{background:radial-gradient(120% 110% at 50% 50%, transparent 38%, rgba(0,0,0,0.88) 100%);}`,
      `<div class="glow gA"></div><div class="vig"></div>
       <div class="abs" style="top:96px;right:120px">${PILL("VIP", "var(--blue)")}</div>
       <div class="abs" style="bottom:96px;left:120px">${MARK(60)}</div>
       <div class="abs" style="bottom:96px;right:120px;text-align:right">${SPON()}</div>`),
  },
  {
    slug: "v4-coral-energy", name: "Coral Energy · Breakout",
    html: page(`body{background:#07121c;}
      .gA{top:-16%;right:-8%;width:52%;height:56%;background:rgba(255,138,92,0.22);}
      .gB{bottom:-18%;left:-10%;width:42%;height:46%;background:rgba(245,216,42,0.10);}`,
      `<div class="cmdgrid"></div><div class="glow gA"></div><div class="glow gB"></div><div class="vig"></div>
       <div class="abs" style="top:90px;left:120px">${MARK(54)}</div>
       <div class="abs" style="top:96px;right:120px">${PILL("Breakout", AC.coral)}</div>
       <div class="abs" style="bottom:90px;left:120px">${TAG(AC.coral)}</div>
       <div class="abs" style="bottom:90px;right:120px;text-align:right">${SPON()}</div>`),
  },
  {
    slug: "v5-side-rail", name: "Side Rail · Charcoal",
    html: page(`body{background:#0a0e14;}
      .rail{position:absolute;top:0;left:0;width:430px;height:100%;background:linear-gradient(180deg,#0c1119,#070b11);
        border-right:2px solid rgba(55,189,248,0.45);box-shadow:8px 0 60px rgba(0,0,0,0.5);
        display:flex;flex-direction:column;justify-content:space-between;padding:90px 56px;}
      .rail .lbl{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:17px;letter-spacing:0.34em;
        text-transform:uppercase;color:var(--blue);margin-top:26px;}
      .stagegrid{position:absolute;top:0;left:430px;width:calc(100% - 430px);height:100%;background-image:
        linear-gradient(rgba(55,189,248,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(55,189,248,0.05) 1px,transparent 1px);
        background-size:26px 26px;}
      .gA{top:-20%;right:-10%;width:48%;height:54%;background:rgba(55,189,248,0.16);}`,
      `<div class="stagegrid"></div><div class="glow gA"></div><div class="vig"></div>
       <div class="rail">
         <div>${MARK(48)}<div class="lbl">Main Stage</div></div>
         <div class="tag" style="font-size:36px">Real Projects.<br/>Real <em style="color:var(--blue)">Revenue.</em></div>
         <div class="sponsor"><span class="lbl" style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;letter-spacing:0.28em;text-transform:uppercase;color:var(--mute)">Presented by</span><span class="slot"><img src="file://${SPONSOR_LOGO}" alt="HyperAgent"/></span></div>
       </div>`),
  },
  {
    slug: "v6-perspective-grid", name: "Perspective Grid · Depth",
    html: page(`body{background:#07121c;}
      .floor{position:absolute;left:50%;bottom:-2%;width:2600px;height:620px;margin-left:-1300px;
        transform:perspective(680px) rotateX(62deg);transform-origin:50% 100%;
        background-image:linear-gradient(rgba(55,189,248,0.5) 2px,transparent 2px),linear-gradient(90deg,rgba(55,189,248,0.5) 2px,transparent 2px);
        background-size:90px 90px;
        -webkit-mask-image:linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 78%);
        mask-image:linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 78%);opacity:0.55;}
      .horizon{position:absolute;left:50%;top:48%;width:1200px;height:300px;margin-left:-600px;border-radius:50%;
        background:rgba(55,189,248,0.18);filter:blur(130px);}
      .cross{position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px 0 0 -17px;opacity:0.5;}
      .cross::before,.cross::after{content:'';position:absolute;background:rgba(55,189,248,0.7);}
      .cross::before{left:50%;top:0;width:2px;height:100%;margin-left:-1px;}
      .cross::after{top:50%;left:0;height:2px;width:100%;margin-top:-1px;}`,
      `<div class="horizon"></div><div class="floor"></div><div class="cross"></div><div class="vig"></div>
       <div class="abs" style="top:120px;left:0;width:100%;text-align:center">${MARK(64)}</div>
       <div class="abs" style="top:96px;right:120px">${PILL("Main Stage", "var(--red)")}</div>
       <div class="abs" style="bottom:84px;left:0;width:100%;text-align:center">
         <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:18px;letter-spacing:0.34em;text-transform:uppercase;color:var(--mute)">Real Projects · Real Revenue</div>
       </div>`),
  },
];

const only = process.argv[2];
const list = only ? VARIATIONS.filter((v) => v.slug === only) : VARIATIONS;
if (!list.length) { console.error(`no variation "${only}"`); process.exit(1); }

const browser = await chromium.launch();
const page1 = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
const made = [];
for (const v of list) {
  const p = join(TMP, `${v.slug}.html`);
  writeFileSync(p, v.html);
  await page1.goto("file://" + p);
  await page1.evaluate(() => document.fonts.ready);
  await page1.waitForTimeout(250);
  await page1.screenshot({ path: join(RENDERS, `${v.slug}.png`) });
  made.push(v.slug);
  console.log("variation ->", `renders/${v.slug}.png`);
}

if (!only) {
  const cells = VARIATIONS.map((v) => existsSync(join(RENDERS, `${v.slug}.png`))
    ? `<figure><img src="file://${join(RENDERS, `${v.slug}.png`)}"/><figcaption>${v.slug} — ${v.name}</figcaption></figure>` : "").join("\n");
  const sheet = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><link href="file://${FONTS}" rel="stylesheet"/>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{width:1920px;background:#05080c;color:#fff;font-family:'Inter',sans-serif;padding:52px 60px}
  h1{font-family:'Montserrat',sans-serif;font-style:italic;font-weight:900;font-size:38px;letter-spacing:-0.03em;margin-bottom:6px}h1 .b{color:#37bdf8}
  .sub{font-family:'JetBrains Mono',monospace;font-size:14px;letter-spacing:0.24em;text-transform:uppercase;color:rgba(209,220,232,0.55);margin-bottom:32px}
  .g{display:grid;grid-template-columns:1fr 1fr;gap:24px}
  figure{border:1px solid rgba(55,189,248,0.20);border-radius:6px;overflow:hidden;background:#000}img{display:block;width:100%;height:auto}
  figcaption{font-family:'JetBrains Mono',monospace;font-size:14px;letter-spacing:0.05em;color:#37bdf8;padding:10px 14px}</style>
  </head><body><h1>AIS <span class="b">LIVE</span> — Stage Backdrop Variations</h1>
  <div class="sub">${made.length} looks · 1920×1080 @2x · center kept clear · sponsor = HyperAgent (real wordmark)</div>
  <div class="g">${cells}</div></body></html>`;
  const sp = join(TMP, "_contact.html");
  writeFileSync(sp, sheet);
  await page1.setViewportSize({ width: 1920, height: 1400 });
  await page1.goto("file://" + sp);
  await page1.evaluate(() => document.fonts.ready);
  await page1.waitForTimeout(300);
  await page1.screenshot({ path: join(RENDERS, "variations-contact-sheet.png"), fullPage: true });
  console.log("contact sheet -> renders/variations-contact-sheet.png");
}
await browser.close();
console.log(`\ndone — ${made.length} variation(s)`);
