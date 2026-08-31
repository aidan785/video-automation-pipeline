// AIS LIVE — #24 What's Next tease STATIC GRAPHICS (neutral copy, no September per standing rule).
// Emits graphics/static-<format>.html (1s comps) — snapshot each to PNG:
//   node _gen-graphics.mjs
//   for f in landscape square story; do cp graphics/static-$f.html index.html; npx hyperframes snapshot . --at 0.5 --output snapshots/static-$f; done
//   (restore index.html from git or _video-index backup after)

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(DIR, "graphics"), { recursive: true });

const FORMATS = {
  landscape: { w: 1920, h: 1080, markSize: 210, lnSize: 96,  subSize: 38, eyeSize: 24, gap: 26, pad: "90px 140px" },
  square:    { w: 1080, h: 1080, markSize: 150, lnSize: 74,  subSize: 32, eyeSize: 20, gap: 22, pad: "80px 70px" },
  story:     { w: 1080, h: 1920, markSize: 170, lnSize: 88,  subSize: 36, eyeSize: 22, gap: 30, pad: "140px 80px" },
};

function html(fmt, f) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${f.w}, height=${f.h}" />
<title>AIS LIVE — #24 tease graphic · ${fmt}</title>
<link href="assets/fonts/fonts.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
<style>
  :root{
    --onyx:#07121c; --blue:#37bdf8; --red-live:#ff3b30; --blue-rgb:55,189,248; --red-rgb:255,59,48;
    --fd:"Montserrat",sans-serif; --fb:"Inter",sans-serif; --fm:"JetBrains Mono",monospace;
    --grad-chrome:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
    --grad-blue:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:${f.w}px;height:${f.h}px;overflow:hidden;background:#000;color:#fff;font-family:var(--fb);}
  #root{position:relative;width:${f.w}px;height:${f.h}px;overflow:hidden;background:var(--onyx);isolation:isolate;}
  #root .clip{position:absolute;inset:0;width:${f.w}px;height:${f.h}px;pointer-events:none;}
  .depth{position:absolute;left:-40%;right:-40%;height:60%;
    background-image:
      repeating-linear-gradient(0deg, rgba(var(--blue-rgb),.16) 0 1px, transparent 1px 66px),
      repeating-linear-gradient(90deg, rgba(var(--blue-rgb),.09) 0 1px, transparent 1px 66px);}
  .grid-floor{bottom:-12%;transform:perspective(680px) rotateX(66deg);transform-origin:50% 100%;
    -webkit-mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);
    mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);}
  .grid-ceiling{top:-12%;transform:perspective(680px) rotateX(-66deg);transform-origin:50% 0%;opacity:.6;
    -webkit-mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);
    mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);}
  .glow{position:absolute;top:-160px;left:50%;width:700px;height:700px;margin-left:-350px;border-radius:50%;
    background:var(--blue);filter:blur(150px);opacity:.18;}
  .vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.62) 96%);}
  .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:screen;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

  .wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:${f.gap}px;padding:${f.pad};text-align:center;}
  .eyebrow{font-family:var(--fm);font-weight:700;font-size:${f.eyeSize}px;letter-spacing:.34em;text-transform:uppercase;
    color:var(--blue);text-shadow:0 0 16px rgba(var(--blue-rgb),.45);}
  .mark{font-family:var(--fd);font-style:italic;font-weight:900;letter-spacing:-.03em;line-height:.9;
    font-size:${f.markSize}px;display:inline-flex;align-items:baseline;position:relative;}
  .mark .ais{color:#fff;}
  .mark .gap{display:inline-block;width:.08em;}
  .live{position:relative;color:var(--blue);text-shadow:0 0 60px rgba(var(--blue-rgb),.55);padding-right:.28em;}
  .dot{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
    background:var(--red-live);box-shadow:0 0 .7em var(--red-live),0 0 .25em var(--red-live);}
  .ln{font-family:var(--fd);font-style:italic;font-weight:900;font-size:${f.lnSize}px;line-height:1.12;letter-spacing:-.03em;}
  .ln .wd{display:inline-block;padding:.06em .1em .22em;
    background:var(--grad-chrome);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
    text-shadow:0 0 34px rgba(255,255,255,.22);}
  .ln .ac{background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
    text-shadow:0 0 48px rgba(var(--blue-rgb),.62);}
  .sub{font-family:var(--fb);font-weight:300;font-style:italic;font-size:${f.subSize}px;line-height:1.3;color:rgba(209,220,232,.85);}
  .footer{font-family:var(--fm);font-weight:700;font-size:${f.eyeSize}px;letter-spacing:.30em;text-transform:uppercase;
    color:#fff;padding:14px 30px;border:1px solid rgba(var(--blue-rgb),.4);border-radius:12px;background:rgba(4,10,17,.5);}
</style>
</head>
<body>
<div id="root" data-composition-id="tease-${fmt}" data-start="0" data-duration="1" data-width="${f.w}" data-height="${f.h}">
  <div id="bg" class="clip" data-start="0" data-duration="1" data-track-index="0">
    <div class="depth grid-ceiling"></div>
    <div class="depth grid-floor"></div>
    <div class="glow"></div>
    <div class="vignette"></div>
    <div class="grain"></div>
  </div>
  <div id="scene" class="clip" data-start="0" data-duration="1" data-track-index="1">
    <div class="wrap">
      <div class="eyebrow">2026 &middot; THAT'S A WRAP</div>
      <div class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="dot"></span></span></div>
      <div class="ln"><span class="wd">This&nbsp;was&nbsp;just&nbsp;the</span> <span class="wd ac">beginning.</span></div>
      <div class="sub">Two days. 1600+ builders. One community.</div>
      <div class="footer">MORE TO BUILD &middot; MORE TO EARN &middot; STAY CLOSE</div>
    </div>
  </div>
</div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  tl.set({}, {}, 1);
  window.__timelines["tease-${fmt}"] = tl;
<\/script>
</body>
</html>
`;
}

for (const [fmt, f] of Object.entries(FORMATS)) {
  writeFileSync(join(DIR, "graphics", `static-${fmt}.html`), html(fmt, f));
  console.log(`graphic -> graphics/static-${fmt}.html (${f.w}x${f.h})`);
}
console.log("done");
