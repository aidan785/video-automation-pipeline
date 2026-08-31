#!/usr/bin/env node
/*
  Up/Down Sell VSLs — AIS+ motion-graphics generator (Agent 3).
  Emits index.html for BOTH projects (updown-upsell + updown-downsell).

  Beats are full-frame takeover cutaways over the clean talking-head edit
  (narration continues underneath). AIS command-deck base (grid tunnel, beam,
  glows, vignette, grain) but branded AIS+ (white product mark bottom-right,
  NO AIS/LIVE event mark, no red live-dot — these are membership videos, not
  the event broadcast). All-blue accents per Aidan's standing directives.

  Card kinds: stat (count-up) · browser (screenshot in chrome w/ pan + highlight
  rings) · qa (split: event card + copy) · pricemath (staged offer math) ·
  guarantee (thesis) · events (3-clip real-footage montage).

  NOTE: no will-change on any background-clip:text element (descender-clip
  render bug), horizontal padding on all gradient text, seeded/deterministic
  everything, every timeline padded to its slot (Law 11).
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

/* ---------------------------------------------------------------- tokens */
const CSS = `
*{margin:0;padding:0;box-sizing:border-box;}
html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#000;color:#fff;font-family:"Inter",system-ui,sans-serif;}
:root{
  --onyx:#07121C;--onyx-deep:#040A11;--white:#fff;
  --text:#fff;--text-dim:rgba(209,220,232,.85);--text-faint:rgba(180,214,238,.72);
  --blue:#37BDF8;--blue-rgb:55,189,248;--coral:#FF8A5C;--coral-rgb:255,138,92;
  --font-display:"Montserrat",system-ui,sans-serif;
  --font-body:"Inter",system-ui,sans-serif;
  --font-mono:"JetBrains Mono",ui-monospace,monospace;
  --grad-chrome:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
  --grad-blue:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
  --glow-chrome:0 0 34px rgba(255,255,255,.22);
  --glow-blue:0 0 48px rgba(var(--blue-rgb),.62);
  --glow-num:0 0 90px rgba(var(--blue-rgb),.60);
  --grid-lines:repeating-linear-gradient(0deg,rgba(var(--blue-rgb),.16) 0 1px,transparent 1px 66px),
               repeating-linear-gradient(90deg,rgba(var(--blue-rgb),.09) 0 1px,transparent 1px 66px);
  --beam:conic-gradient(from 180deg at 50% 0%,transparent 0deg,rgba(var(--blue-rgb),.14) 22deg,transparent 44deg);
  --vignette:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.62) 96%);
  --tex-grain:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
video{position:absolute;inset:0;width:1920px;height:1080px;object-fit:cover;}

/* ------- beat shell: every beat is a full-frame takeover ------- */
.beat{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;background:var(--onyx);isolation:isolate;}
.beat .bg{position:absolute;inset:0;overflow:hidden;will-change:transform;}
.beat .depth{position:absolute;left:-40%;right:-40%;height:78%;background-image:var(--grid-lines);will-change:background-position;}
.beat .grid-floor{bottom:-14%;transform:perspective(680px) rotateX(66deg);transform-origin:50% 100%;
  -webkit-mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);
  mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);}
.beat .grid-ceiling{top:-14%;transform:perspective(680px) rotateX(-66deg);transform-origin:50% 0%;opacity:.6;
  -webkit-mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);
  mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);}
.beat .beam{position:absolute;top:-20%;left:50%;width:1400px;height:1200px;margin-left:-700px;background:var(--beam);filter:blur(30px);opacity:.7;will-change:transform,opacity;}
.beat .glowb{position:absolute;border-radius:50%;will-change:transform;top:-160px;left:50%;width:760px;height:760px;margin-left:-380px;background:var(--blue);filter:blur(155px);opacity:.18;}
.beat .glowc{position:absolute;border-radius:50%;will-change:transform;bottom:-220px;right:-140px;width:620px;height:620px;background:var(--coral);filter:blur(165px);opacity:.10;}
.beat .vig{position:absolute;inset:0;pointer-events:none;background:var(--vignette);will-change:opacity;}
.beat .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:screen;background-image:var(--tex-grain);}
.beat .whip{position:absolute;top:50%;left:0;width:46%;height:10px;margin-top:-5px;opacity:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.95),rgba(var(--blue-rgb),.8),transparent);
  filter:blur(7px);will-change:transform,opacity;z-index:8;}

/* AIS+ product mark, bottom right, ALL WHITE incl the + (never tinted) */
.beat .pmark{position:absolute;right:72px;bottom:56px;z-index:6;font-family:var(--font-display);font-style:italic;
  font-weight:900;font-size:76px;letter-spacing:-0.03em;color:var(--white);text-shadow:0 0 34px rgba(255,255,255,.28);
  padding:0 .1em .1em 0;}

.beat .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:30px;padding:90px 120px;text-align:center;will-change:transform,opacity;}

/* labels: plain mono, no marker dots, no strips */
.eyebrow{font-family:var(--font-mono);font-weight:700;font-size:27px;letter-spacing:.34em;text-transform:uppercase;
  color:var(--blue);text-shadow:0 0 16px rgba(var(--blue-rgb),.45);}
.kicker{font-family:var(--font-mono);font-weight:700;font-size:27px;letter-spacing:.30em;text-transform:uppercase;color:var(--white);}

/* gradient text: generous padding, NO will-change (render clip bug) */
.num{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:320px;line-height:1;letter-spacing:-0.04em;
  padding:.06em .13em .18em;background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-num);}
.unit{font-family:var(--font-mono);font-weight:700;font-size:28px;letter-spacing:.30em;text-transform:uppercase;color:var(--blue);}
.sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:41px;line-height:1.25;color:var(--text-dim);max-width:1440px;}
.ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:122px;line-height:1.16;letter-spacing:-0.03em;max-width:1640px;}
.ln .wd{display:inline-block;padding:.08em .13em .24em;background:var(--grad-chrome);-webkit-background-clip:text;
  background-clip:text;-webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-chrome);}
.ln .wd.ac{background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-blue);}

/* ------- browser panel ------- */
.bwrap{position:relative;display:flex;flex-direction:column;align-items:center;gap:26px;}
.bframe{position:relative;width:1560px;border-radius:20px;overflow:hidden;background:#0b1723;
  border:1px solid rgba(255,255,255,.16);box-shadow:0 34px 80px rgba(0,0,0,.5),0 0 120px rgba(var(--blue-rgb),.18);}
.bbar{display:flex;align-items:center;gap:14px;height:58px;padding:0 22px;background:rgba(255,255,255,.05);
  border-bottom:1px solid rgba(255,255,255,.10);}
.bdots{display:flex;gap:9px;}
.bdots i{width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,.22);}
.burl{flex:0 1 640px;margin:0 auto;height:34px;border-radius:17px;background:rgba(255,255,255,.07);
  display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-weight:500;font-size:17px;
  letter-spacing:.04em;color:var(--text-faint);}
.bview{position:relative;width:100%;overflow:hidden;}
/* .bpan carries the screenshot AND its highlight rings, so rings track pan/zoom */
.bpan{position:absolute;top:0;left:0;width:100%;transform-origin:0 0;}
.bpan img{display:block;width:100%;height:auto;}
.ring{position:absolute;border:3px solid var(--blue);border-radius:16px;box-shadow:0 0 26px rgba(var(--blue-rgb),.65),inset 0 0 20px rgba(var(--blue-rgb),.20);pointer-events:none;z-index:4;}

/* animated elements start hidden; their fromTo reveal unhides them (prevents
   pre-reveal flash on seek/scrub) */
.hid{opacity:0;visibility:hidden;}
.ln .wd{opacity:0;visibility:hidden;}

/* ------- qa split ------- */
.qsplit{display:flex;align-items:center;gap:80px;text-align:left;}
.qcard{width:620px;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,.16);
  box-shadow:0 34px 80px rgba(0,0,0,.5),0 0 120px rgba(var(--blue-rgb),.18);}
.qcard img{display:block;width:100%;height:auto;}
.qcol{display:flex;flex-direction:column;align-items:flex-start;gap:26px;max-width:860px;}
.qcol .ln{font-size:112px;text-align:left;}

/* ------- pricemath ------- */
.pm{display:flex;flex-direction:column;align-items:center;gap:8px;}
.pmrow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-display);font-style:italic;font-weight:900;letter-spacing:-0.03em;}
.pm .monthly{font-size:120px;padding:.06em .13em .18em;background:var(--grad-chrome);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-chrome);}
.pm .yearly{position:relative;font-size:120px;padding:.06em .13em .18em;background:var(--grad-chrome);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-chrome);}
.pm .strike{position:absolute;left:4%;top:52%;width:0;height:9px;border-radius:5px;background:var(--blue);
  box-shadow:0 0 22px rgba(var(--blue-rgb),.8);z-index:3;}
.pm .oplabel{font-family:var(--font-mono);font-weight:700;font-size:24px;letter-spacing:.30em;text-transform:uppercase;color:var(--text-faint);}
.pm .hero799{font-size:300px;line-height:1;padding:.06em .13em .16em;background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-num);}
.pm .save{display:flex;align-items:baseline;gap:22px;}
.pm .save .savenum{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:96px;letter-spacing:-0.03em;
  padding:.06em .13em .18em;background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-blue);}

/* ------- events montage ------- */
.evwrap{position:relative;display:flex;flex-direction:column;align-items:center;gap:26px;}
.evframe{position:relative;width:1480px;height:834px;border-radius:20px;overflow:hidden;background:#000;
  border:1px solid rgba(255,255,255,.16);box-shadow:0 34px 80px rgba(0,0,0,.5),0 0 120px rgba(var(--blue-rgb),.18);}
.evframe video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
`;

/* ------------------------------------------------------------ html utils */
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
function words(text) {
  // <em>word</em> = blue accent
  return text.split(/(<em>.*?<\/em>)/).flatMap(part => {
    const m = part.match(/^<em>(.*)<\/em>$/);
    const cls = m ? "wd ac" : "wd";
    return (m ? m[1] : part).trim().split(/\s+/).filter(Boolean)
      .map(w => `<span class="${cls}">${esc(w)}</span>`);
  }).join("");
}

/* ----------------------------------------------------------- card DOM */
function bgLayers() {
  return `<div class="bg"><div class="depth grid-ceiling"></div><div class="depth grid-floor"></div>
    <div class="beam"></div><div class="glowb"></div><div class="glowc"></div></div>
    <div class="vig"></div><div class="grain"></div>`;
}

function statDOM(b) {
  return `${bgLayers()}<div class="inner">
    <div class="kicker hid">${esc(b.kicker)}</div>
    <div class="num hid" id="${b.id}-num">${esc(b.numFinal)}</div>
    <div class="unit hid">${esc(b.unit)}</div>
    ${b.sub ? `<div class="sub hid">${esc(b.sub)}</div>` : ""}
  </div>`;
}

/* camera: cam entries are {t,d,cx,cy,s} — cx/cy = point of the image (0..1)
   to center in the viewport, s = zoom on the 1560px-wide fit. Converted to
   clamped translate+scale on .bpan (transform-origin 0 0). */
function camXY(shot, vh, k) {
  const W = 1560 * k.s, H = 1560 * (shot.h / shot.w) * k.s;
  let tx = 780 - k.cx * W, ty = vh / 2 - k.cy * H;
  tx = Math.min(0, Math.max(1560 - W, tx));
  ty = Math.min(0, Math.max(vh - H, ty));
  return { x: Math.round(tx), y: Math.round(ty) };
}

function browserDOM(b) {
  const viewH = b.viewH || 800;
  const rings = (b.rings || []).map((r, i) =>
    `<div class="ring hid" id="${b.id}-ring${i}" style="left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%;"></div>`).join("");
  return `${bgLayers()}<div class="inner"><div class="bwrap">
    <div class="eyebrow hid">${esc(b.label)}</div>
    <div class="bframe hid"><div class="bbar"><div class="bdots"><i></i><i></i><i></i></div>
      <div class="burl">skool.com/ai-automation-society-plus</div></div>
      <div class="bview" style="height:${viewH}px;"><div class="bpan" id="${b.id}-pan"><img src="${b.img}">${rings}</div></div>
    </div></div></div>`;
}

function qaDOM(b) {
  return `${bgLayers()}<div class="inner"><div class="qsplit">
    <div class="qcard hid"><img src="assets/shots/05-qa-event-2x.png"></div>
    <div class="qcol">
      <div class="eyebrow hid">INSIDE AIS+</div>
      <div class="ln" id="${b.id}-ln">${words(b.headline)}</div>
      <div class="sub hid" style="text-align:left">${esc(b.sub)}</div>
    </div></div></div>`;
}

function pricemathDOM(b) {
  return `${bgLayers()}<div class="inner"><div class="pm">
    <div class="kicker hid" id="${b.id}-kick">THE AIS+ ANNUAL PLAN</div>
    <div class="pmrow" id="${b.id}-r1"><span class="monthly hid">$129<span style="font-size:56px">/MO</span></span>
      <span class="oplabel hid" id="${b.id}-x12">x 12 MONTHS</span>
      <span class="yearly hid" id="${b.id}-yr">$<span id="${b.id}-yrnum">1,548</span><span style="font-size:56px">/YR</span><span class="strike" id="${b.id}-strike"></span></span></div>
    <div class="hero799 hid" id="${b.id}-hero"><span style="font-size:120px;vertical-align:baseline">$</span><span id="${b.id}-heronum">799</span></div>
    <div class="unit hid" id="${b.id}-herounit">TODAY, FOR THE ENTIRE YEAR</div>
    <div class="save hid" id="${b.id}-save"><span class="oplabel" style="color:var(--text-dim);opacity:1;visibility:inherit">YOU SAVE</span>
      <span class="savenum">$<span id="${b.id}-savenum">750</span></span></div>
  </div></div>`;
}

function guaranteeDOM(b) {
  return `${bgLayers()}<div class="inner">
    <div class="eyebrow hid">ZERO RISK</div>
    <div class="ln" id="${b.id}-ln">${words(b.headline)}</div>
    <div class="sub hid">${esc(b.sub)}</div>
  </div>`;
}

function eventsDOM(b, trackBase) {
  const vids = b.clips.map((c, i) =>
    `<video id="${b.id}-clip${i}" src="${c.src}" data-start="${(b.start + i * b.per).toFixed(2)}" data-duration="${b.per.toFixed(2)}" data-track-index="${trackBase + 1 + i}" muted></video>`).join("");
  return `${bgLayers()}<div class="inner"><div class="evwrap">
    <div class="eyebrow hid">${esc(b.label)}</div>
    <div class="evframe hid">${vids}</div>
  </div></div>`;
}

/* ----------------------------------------------------------- timelines */
function statTL(b) {
  const r = b.revealAt ?? 0.5; // relative time the number pops (sync to the spoken number)
  const t = [];
  t.push(`drop("#${b.id} .kicker", ${b.start} + 0.35);`);
  t.push(`pop("#${b.id}-num", ${b.start} + ${r});`);
  if (b.count) t.push(`countUp("#${b.id}-num", ${b.start} + ${r} + 0.05, ${b.count.target}, ${b.count.dur || 1.0}, ${JSON.stringify(b.count.suffix || "")}, ${JSON.stringify(b.count.prefix || "")}, ${b.count.comma ? "true" : "false"});`);
  t.push(`drop("#${b.id} .unit", ${b.start} + ${r} + 0.4);`);
  if (b.sub) t.push(`drop("#${b.id} .sub", ${b.start} + ${r} + 0.55);`);
  return t.join("\n");
}

function browserTL(b) {
  const vh = b.viewH || 800;
  const t = [];
  t.push(`drop("#${b.id} .eyebrow", ${b.start} + 0.3);`);
  t.push(`pop("#${b.id} .bframe", ${b.start} + 0.42, .7);`);
  // camera path inside the screenshot (computed, clamped, image-space)
  const kf = b.cam || [];
  for (let i = 0; i < kf.length; i++) {
    const k = kf[i];
    const p = camXY(b.shot, vh, k);
    if (i === 0) t.push(`tl.set("#${b.id}-pan", {x:${p.x}, y:${p.y}, scale:${k.s}}, ${b.start});`);
    else t.push(`tl.to("#${b.id}-pan", {x:${p.x}, y:${p.y}, scale:${k.s}, duration:${k.d}, ease:"power2.inOut"}, ${b.start} + ${k.t});`);
  }
  for (let i = 0; i < (b.rings || []).length; i++) {
    const r = b.rings[i];
    t.push(`ringPop("#${b.id}-ring${i}", ${b.start} + ${r.t}, ${r.out != null ? b.start + r.out : "null"});`);
  }
  return t.join("\n");
}

function qaTL(b) {
  return [
    `drop("#${b.id} .eyebrow", ${b.start} + 0.3);`,
    `pop("#${b.id} .qcard", ${b.start} + 0.42, .7);`,
    `wordsIn("#${b.id}-ln .wd", ${b.start} + 0.55);`,
    `drop("#${b.id} .sub", ${b.start} + 1.15);`,
  ].join("\n");
}

function pricemathTL(b) {
  const s = b.start, st = b.stages; // rel times: x12, y1548, hero, save
  return [
    `drop("#${b.id}-kick", ${s} + 0.35);`,
    `pop("#${b.id} .monthly", ${s} + 0.5);`,
    `drop("#${b.id}-x12", ${s} + ${st.x12});`,
    `pop("#${b.id}-yr", ${s} + ${st.x12} + 0.25);`,
    `countUp("#${b.id}-yrnum", ${s} + ${st.x12} + 0.3, 1548, 0.9, "", "", true);`,
    `tl.to("#${b.id}-strike", {width:"92%", duration:.4, ease:"power3.inOut"}, ${s} + ${st.strike});`,
    `tl.to("#${b.id}-r1", {opacity:.38, scale:.82, y:-30, duration:.5, ease:"power2.inOut", transformOrigin:"50% 100%"}, ${s} + ${st.strike} + 0.15);`,
    `pop("#${b.id}-hero", ${s} + ${st.hero}, .7);`,
    `countUp("#${b.id}-heronum", ${s} + ${st.hero} + 0.05, 799, 0.9, "", "", false);`,
    `drop("#${b.id}-herounit", ${s} + ${st.hero} + 0.55);`,
    `pop("#${b.id}-save", ${s} + ${st.save}, .62);`,
    `countUp("#${b.id}-savenum", ${s} + ${st.save} + 0.05, 750, 0.8, "", "", false);`,
  ].join("\n");
}

function guaranteeTL(b) {
  return [
    `drop("#${b.id} .eyebrow", ${b.start} + 0.3);`,
    `wordsIn("#${b.id}-ln .wd", ${b.start} + 0.45);`,
    `drop("#${b.id} .sub", ${b.start} + 1.3);`,
  ].join("\n");
}

function eventsTL(b) {
  const t = [
    `drop("#${b.id} .eyebrow", ${b.start} + 0.3);`,
    `pop("#${b.id} .evframe", ${b.start} + 0.42, .7);`,
  ];
  return t.join("\n");
}

/* -------------------------------------------------------------- builder */
function buildProject(cfg) {
  let track = 2;
  const beatHTML = [];
  const beatTL = [];
  for (const [bi, b] of cfg.beats.entries()) {
    // crossfade seam: if the next beat starts right after this one, hold this
    // beat's cover until the next bg is fully in so the talking head never
    // flashes through the gap
    const next = cfg.beats[bi + 1];
    const clipEnd = (next && next.start - b.end < 0.8) ? +(next.start + 0.5).toFixed(2) : b.end;
    b.dur = +(clipEnd - b.start).toFixed(2);
    b.outAt = clipEnd;
    const tbase = track;
    let dom = "";
    if (b.kind === "stat") dom = statDOM(b);
    else if (b.kind === "browser") dom = browserDOM(b);
    else if (b.kind === "qa") dom = qaDOM(b);
    else if (b.kind === "pricemath") dom = pricemathDOM(b);
    else if (b.kind === "guarantee") dom = guaranteeDOM(b);
    else if (b.kind === "events") { dom = eventsDOM(b, tbase); track += b.clips.length; }
    beatHTML.push(`<div id="${b.id}" class="beat clip" data-start="${b.start}" data-duration="${b.dur}" data-track-index="${tbase}" data-anchor="${esc(b.anchor)}">${dom}</div>`);
    track++;

    // shared shell animation: whip entry/exit + ambient bg ride
    beatTL.push(`
/* ---- ${b.id} (${b.kind}) ${b.start}s -> ${b.end}s ---- */
beatIn("#${b.id}", ${b.start});
beatOut("#${b.id}", ${b.outAt});
ambient("#${b.id}", ${b.start}, ${b.dur});`);
    if (b.kind === "stat") beatTL.push(statTL(b));
    else if (b.kind === "browser") beatTL.push(browserTL(b));
    else if (b.kind === "qa") beatTL.push(qaTL(b));
    else if (b.kind === "pricemath") beatTL.push(pricemathTL(b));
    else if (b.kind === "guarantee") beatTL.push(guaranteeTL(b));
    else if (b.kind === "events") beatTL.push(eventsTL(b));
  }

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,900;1,900&family=Inter:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<div id="${cfg.id}" data-composition-id="${cfg.id}" data-start="0" data-width="1920" data-height="1080">
  <video id="bg-video" src="assets/clean-1080.mp4" data-start="0" data-duration="${cfg.duration}" data-track-index="0" muted></video>
  ${beatHTML.join("\n  ")}
</div>
<audio id="bg-audio" src="assets/clean-1080.mp4" data-start="0" data-duration="${cfg.duration}" data-track-index="1"></audio>

<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
const DUR = ${cfg.duration};

/* helpers — all fromTo so nothing is left invisible */
function drop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:d||.5,ease:"power2.out",immediateRender:false},at); }
function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%",immediateRender:false},at); }
function wordsIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
  {autoAlpha:1,yPercent:0,scale:1,duration:.55,ease:"expo.out",stagger:.075,transformOrigin:"50% 100%",immediateRender:false},at); }
function ringPop(sel, at, outAt){
  tl.fromTo(sel,{autoAlpha:0,scale:1.25},{autoAlpha:1,scale:1,duration:.45,ease:"back.out(1.6)",transformOrigin:"50% 50%",immediateRender:false},at);
  if (outAt !== null) tl.to(sel,{autoAlpha:0,duration:.3,ease:"power2.in"},outAt);
}
function countUp(sel, at, target, d, suffix, prefix, comma){
  var o={v:0};
  function fmt(n){ n=Math.round(n); return comma? n.toLocaleString("en-US") : String(n); }
  tl.call(function(){var el=document.querySelector(sel); if(el) el.textContent=(prefix||"")+"0"+(suffix||"");}, null, at-0.001);
  tl.to(o,{v:target,duration:d,ease:"power2.out",onUpdate:function(){
    var el=document.querySelector(sel); if(el) el.textContent=(prefix||"")+fmt(o.v)+(suffix||"");}},at);
}
/* beat shell: blur-scale in, blur out. HF gates visibility via clip windows;
   these tweens just carry the seam. */
function beatIn(sel, at){
  tl.fromTo(sel+" .inner",{autoAlpha:0,scale:1.05,filter:"blur(14px)"},
    {autoAlpha:1,scale:1,filter:"blur(0px)",duration:.5,ease:"power2.out",immediateRender:false},at+0.05);
  tl.fromTo(sel+" .bg",{autoAlpha:0},{autoAlpha:1,duration:.28,ease:"power1.out",immediateRender:false},at);
}
function beatOut(sel, end){
  tl.to(sel+" .inner",{autoAlpha:0,scale:.985,filter:"blur(12px)",duration:.3,ease:"power2.in"},end-0.32);
  tl.to(sel+" .bg",{autoAlpha:0,duration:.26,ease:"power1.in"},end-0.27);
}
function ambient(sel, at, d){
  tl.fromTo(sel+" .bg",{scale:1},{scale:1.06,y:-14,duration:d,ease:"sine.inOut",transformOrigin:"50% 50%",immediateRender:false},at);
  tl.to(sel+" .grid-floor",{backgroundPositionY:"+="+Math.round(d*55)+"px",duration:d,ease:"none"},at);
  tl.to(sel+" .grid-ceiling",{backgroundPositionY:"-="+Math.round(d*55)+"px",duration:d,ease:"none"},at);
  tl.to(sel+" .beam",{rotation:8,duration:d,ease:"sine.inOut",transformOrigin:"50% 0%"},at);
  tl.to(sel+" .glowb",{x:44,y:-24,duration:d,ease:"sine.inOut"},at);
  tl.to(sel+" .glowc",{x:-36,y:22,duration:d,ease:"sine.inOut"},at);
  tl.to(sel+" .vig",{opacity:.9,duration:d/4,yoyo:true,repeat:3,ease:"sine.inOut"},at);
}

${beatTL.join("\n")}

tl.set({}, {}, DUR); /* Law 11 — fill the slot */
window.__timelines["${cfg.id}"] = tl;
</script>
</body>
</html>`;
  const out = path.join(ROOT, cfg.id, "index.html");
  fs.writeFileSync(out, html);
  console.log(`${cfg.id}: ${cfg.beats.length} beats -> ${out}`);
}

/* ================================================================ PLANS */
/* Classroom grid tile ring coords (% of 02-classroom-courses img 1152x785):
   tiles: r1c2 AI Partner x 34-67 y 1.5-48 · r2c1 Claude Code x 2-35 y 51-98 ·
   r2c2 First Client x 34-67 y 51-98 */
const RING_CC = { x: 2.6, y: 51, w: 32.4, h: 46 };
const RING_FC = { x: 34.5, y: 51, w: 32.4, h: 46 };
const RING_AP = { x: 34.5, y: 1.8, w: 32.4, h: 46 };

const UPSELL = {
  id: "updown-upsell",
  duration: 612.8,
  beats: [
    { id: "b1", kind: "browser", start: 149.6, end: 154.5, anchor: "you get access to our training",
      label: "INSIDE AIS+ · THE COMMUNITY", img: "assets/shots/01-community-feed-2x.png", viewH: 800,
      shot: { w: 2296, h: 1670 },
      cam: [{ cx: .5, cy: .32, s: 1.0 }, { t: 0.4, d: 4.0, cx: .5, cy: .46, s: 1.0 }] },
    { id: "b2", kind: "browser", start: 154.6, end: 174.2, anchor: "hands-on Claude Code build courses",
      label: "INSIDE AIS+ · THE CLASSROOM", img: "assets/shots/02-classroom-courses-2x.png", viewH: 820,
      shot: { w: 2304, h: 1570 },
      cam: [{ cx: .5, cy: .45, s: 1.0 }, { t: 2.0, d: 1.0, cx: .188, cy: .743, s: 1.32 },
            { t: 9.9, d: 1.2, cx: .506, cy: .743, s: 1.32 }, { t: 16.3, d: 1.2, cx: .506, cy: .249, s: 1.32 }],
      rings: [ { ...RING_CC, t: 3.1, out: 9.7 }, { ...RING_FC, t: 11.2, out: 16.1 }, { ...RING_AP, t: 17.6 } ] },
    { id: "b3", kind: "stat", start: 174.4, end: 181.6, anchor: "to build an AI agency from zero",
      kicker: "THE AI PARTNER MODEL", numFinal: "$100K", unit: "PER MONTH, RECURRING, IN 8 MONTHS", revealAt: 3.2,
      sub: "The exact model behind the agency.", count: { target: 100, prefix: "$", suffix: "K", dur: 1.0 } },
    { id: "b4", kind: "qa", start: 184.9, end: 194.0, anchor: "live Q&A calls with me personally",
      headline: "Live <em>Q&A calls,</em> every week", sub: "Bring what you're building, get help in real time." },
    { id: "b5", kind: "browser", start: 213.3, end: 223.9, anchor: "support from technical AI engineers",
      label: "INSIDE AIS+ · ENGINEER SUPPORT", img: "assets/shots/06-engineer-support-thread-2x.png", viewH: 800,
      shot: { w: 1544, h: 1454 },
      cam: [{ cx: .5, cy: .28, s: 1.0 }, { t: 0.5, d: 9.6, cx: .5, cy: .62, s: 1.0 }],
      rings: [{ x: 8, y: 46, w: 86, h: 50, t: 4.2 }] },
    { id: "b6", kind: "stat", start: 224.5, end: 229.5, anchor: "over three thousand builders",
      kicker: "THE COMMUNITY", numFinal: "3,700+", unit: "BUILDERS, FREELANCERS, OWNERS",
      sub: "", count: { target: 3700, suffix: "+", comma: true, dur: 1.1 } },
    { id: "b7", kind: "events", start: 256.3, end: 267.4, anchor: "future AIS Live events",
      label: "AIS LIVE · INCLUDED WITH YOUR YEAR", per: 3.7,
      clips: [{ src: "assets/ev1.mp4" }, { src: "assets/ev2.mp4" }, { src: "assets/ev3.mp4" }] },
    { id: "b8", kind: "pricemath", start: 283.8, end: 302.5, anchor: "normally a hundred and twenty-nine bucks",
      stages: { x12: 3.6, strike: 9.4, hero: 10.2, save: 13.7 } },
    { id: "b9", kind: "browser", start: 500.1, end: 510.2, anchor: "just start asking",
      label: "INSIDE AIS+ · ASK ANYTHING", img: "assets/shots/09-question-replies-2x.png", viewH: 800,
      shot: { w: 1534, h: 1526 },
      cam: [{ cx: .5, cy: .26, s: 1.0 }, { t: 0.5, d: 9.2, cx: .5, cy: .66, s: 1.0 }],
      rings: [{ x: 6, y: 57, w: 88, h: 40, t: 3.6 }] },
    { id: "b10", kind: "guarantee", start: 522.9, end: 529.8, anchor: "seven-day money-back guarantee",
      headline: "<em>7-day</em> money-back guarantee", sub: "Test drive everything inside AIS+. Not for you? Full refund." },
    { id: "b11", kind: "browser", start: 573.9, end: 583.5, anchor: "People who are actually building",
      label: "INSIDE AIS+ · MEMBER WINS", img: "assets/shots/08-member-win-post-2x.png", viewH: 800,
      shot: { w: 1532, h: 1078 },
      cam: [{ cx: .5, cy: .3, s: 1.0 }, { t: 0.5, d: 8.6, cx: .5, cy: .6, s: 1.0 }] },
    { id: "b12", kind: "stat", start: 592.3, end: 599.6, anchor: "seven hundred and fifty bucks less",
      kicker: "THE ANNUAL MEMBERSHIP", numFinal: "$799", unit: "PER YEAR, LOCKED FOR LIFE",
      sub: "$750 less than paying monthly.", count: { target: 799, prefix: "$", dur: 0.9 } },
  ],
};

const DOWNSELL = {
  id: "updown-downsell",
  duration: 108.63,
  beats: [
    { id: "b1", kind: "stat", start: 12.3, end: 16.6, anchor: "forty-nine bucks",
      kicker: "TRY AIS+", numFinal: "$49", unit: "YOUR FIRST MONTH", sub: "",
      count: { target: 49, prefix: "$", dur: 0.8 } },
    { id: "b2", kind: "browser", start: 16.7, end: 22.5, anchor: "the AIS Plus community",
      label: "INSIDE AIS+ · THE COMMUNITY", img: "assets/shots/01-community-feed-2x.png", viewH: 780,
      shot: { w: 2296, h: 1670 },
      cam: [{ cx: .5, cy: .32, s: 1.0 }, { t: 0.4, d: 5.0, cx: .5, cy: .46, s: 1.0 }] },
    { id: "b3", kind: "browser", start: 31.4, end: 35.1, anchor: "all of our Cloud Code trainings",
      label: "INSIDE AIS+ · THE CLASSROOM", img: "assets/shots/02-classroom-courses-2x.png", viewH: 780,
      shot: { w: 2304, h: 1570 },
      cam: [{ cx: .5, cy: .45, s: 1.0 }, { t: 0.4, d: 2.4, cx: .25, cy: .68, s: 1.22 }],
      rings: [{ ...RING_CC, t: 1.2 }] },
    { id: "b4", kind: "qa", start: 35.3, end: 39.7, anchor: "live Q&A calls with me personally",
      headline: "Live <em>Q&A calls,</em> every week", sub: "Bring what you're building, get help in real time." },
    { id: "b5", kind: "stat", start: 45.9, end: 50.4, anchor: "over three thousand people",
      kicker: "THE COMMUNITY", numFinal: "3,700+", unit: "MEMBERS BUILDING ALONGSIDE YOU", sub: "",
      count: { target: 3700, suffix: "+", comma: true, dur: 1.1 } },
    { id: "b6", kind: "stat", start: 76.4, end: 80.4, anchor: "only forty-nine dollars",
      kicker: "START TODAY", numFinal: "$49", unit: "ONE MONTH OF AIS+", sub: "",
      count: { target: 49, prefix: "$", dur: 0.8 } },
  ],
};

buildProject(UPSELL);
buildProject(DOWNSELL);
