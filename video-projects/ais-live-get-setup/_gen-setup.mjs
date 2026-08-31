// AIS LIVE — "Get Set Up" walkthrough (~1 min).
// Plays while doors are open: three quick moves before the show starts —
//   STEP 01  Build your agenda
//   STEP 02  Visit the booths (sponsor Expo — real HyperAgent + Glaido logos)
//   STEP 03  Meet people in Networking
//
// Same house motion engine as the Day 1 agenda walkthrough (depth grid tunnel,
// chrome italic type, whip cuts, solid AIS/LIVE mark bug), all-blue styling per
// Aidan's direction (no coral/yellow accents, no eyebrow dots, no on-screen em
// dashes). The day-progress rail becomes a 3-STEP rail that fills as steps pass.
// Determinism: no Math.random / Date.now anywhere.
//
//   node _gen-setup.mjs   -> writes index.html

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// STEP RAIL — 3 segments, fills to each step as it arrives
// ---------------------------------------------------------------------------
const RAIL_W = 1200;
const TICKS = [
  { lab: "STEP 1", p: 0 }, { lab: "STEP 2", p: 0.5 }, { lab: "STEP 3", p: 1 },
];

// ---------------------------------------------------------------------------
// BEAT PROGRAM
// step: big gradient "01" numeral + headline. rows: checklist. sponsor: logos.
// ---------------------------------------------------------------------------
const BEATS = [
  { type: "hero", dur: 6.5, eyebrow: "DOORS ARE OPEN · WELCOME IN",
    pre: "First things ", accent: "first.", sub: "Get set up in three quick moves." },

  { type: "step", dur: 6, num: "01", rail: 0, tag: "STEP 01 OF 03",
    pre: "Build your ", accentTxt: "agenda." },

  { type: "rows", dur: 8, rail: 0, tag: "STEP 01 · YOUR AGENDA",
    rows: [
      "Open the Agenda tab",
      "Star the sessions you don't want to miss",
      "Pick your workshop track",
    ], sub: "Foundation or Advanced. Choose the room that matches where you are." },

  { type: "step", dur: 6, num: "02", rail: 0.5, tag: "STEP 02 OF 03",
    pre: "Visit the ", accentTxt: "booths." },

  { type: "sponsor", dur: 8, rail: 0.5, tag: "STEP 02 · THE EXPO IS OPEN",
    logos: [
      { src: "hyperagent-white.png", w: 560, role: "PRESENTING SPONSOR" },
      { src: "glaido-white.png", w: 460, role: "SPONSOR" },
    ], sub: "Stop by the sponsor booths. Live demos all weekend." },

  { type: "step", dur: 6, num: "03", rail: 1, tag: "STEP 03 OF 03",
    pre: "Meet people in ", accentTxt: "Networking." },

  { type: "rows", dur: 8, rail: 1, tag: "STEP 03 · SAY HI",
    rows: [
      "Complete your profile",
      "Jump into the Networking room",
      "Introduce yourself to three people",
    ], sub: "You'll be building with these people all weekend." },

  { type: "hero", dur: 6, eyebrow: "THAT'S IT",
    pre: "You're in ", accent: "the right room.", sub: "AIS LIVE starts soon." },

  { type: "markflash", dur: 6.5, sub: "Get set up · We start soon." },
];

// ---------------------------------------------------------------------------
// scene HTML renderers
// ---------------------------------------------------------------------------
const wrapWords = (str, cls) => str.trim().split(/\s+/)
  .map(w => `<span class="wd ${cls || ""}">${w}</span>`).join("");

const eyeb = txt => txt ? `<div class="eyebrow">${txt}</div>` : "";
const sub = t => t ? `<div class="sub">${t}</div>` : "";

function sceneBody(b) {
  switch (b.type) {
    case "hero":
      return `${eyeb(b.eyebrow)}<div class="ln hero">${wrapWords(b.pre)}${wrapWords(b.accent, "ac")}</div>${sub(b.sub)}`;

    case "step":
      return `${eyeb(b.tag)}
        <div class="time">${b.num}</div>
        <div class="lnwrap"><div class="ln">${wrapWords(b.pre)}${wrapWords(b.accentTxt, "ac")}</div></div>${sub(b.sub)}`;

    case "rows": {
      const rows = b.rows.map(r =>
        `<div class="vrow"><span class="varr">&rsaquo;</span><span class="vtitle">${r}</span></div>`).join("");
      return `${eyeb(b.tag)}<div class="viplist">${rows}</div>${sub(b.sub)}`;
    }

    case "sponsor": {
      const logos = b.logos.map(l => `
          <div class="logo">
            <div class="logobox"><img src="assets/sponsors/${l.src}" style="width:${l.w}px" alt="" /></div>
            <div class="logorole">${l.role}</div>
          </div>`).join("");
      return `${eyeb(b.tag)}<div class="logorow">${logos}</div>${sub(b.sub)}`;
    }

    case "markflash":
      return `<div class="bigmark"><span class="mark big"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>${sub(b.sub)}`;
  }
  return "";
}

// ---------------------------------------------------------------------------
// build scenes + per-beat timeline
// ---------------------------------------------------------------------------
let t = 0;
const OVERLAP = 0.4;
const scenesHTML = [];
const tj = [];

BEATS.forEach((b, idx) => {
  const start = t, s = `sc${idx}`, track = 12 + idx;
  const win = +(b.dur + OVERLAP).toFixed(3);
  const first = idx === 0, last = idx === BEATS.length - 1;
  const S = n => +(start + n).toFixed(3);

  scenesHTML.push(
`      <section id="${s}" class="scene clip" data-start="${+start.toFixed(3)}" data-duration="${win}" data-track-index="${track}">
        <div class="inner">
        ${sceneBody(b)}
        </div>
      </section>`);

  tj.push(`      // ${s} · ${b.type}  (${b.dur}s)`);
  if (!first) tj.push(`      streak(${S(0)});`);
  if (b.rail !== undefined) tj.push(`      railTo(${b.rail}, ${S(0.05)});`);
  if (last) tj.push(`      railTo(1, ${S(0.05)});`);

  if (b.eyebrow || b.tag) tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
  if (b.type === "hero") {
    tj.push(`      words("#${s} .ln .wd", ${S(0.26)});`);
  } else if (b.type === "step") {
    tj.push(`      pop("#${s} .time", ${S(0.22)}, .55);`);
    tj.push(`      words("#${s} .ln .wd", ${S(0.34)});`);
  } else if (b.type === "rows") {
    tj.push(`      slideX("#${s} .vrow", ${S(0.34)}, 0.18);`);
    tj.push(`      drift("#${s} .vrow", ${S(1.8)}, ${+((b.dur - 2.4) / 4.8).toFixed(2)});`);
  } else if (b.type === "sponsor") {
    tj.push(`      glowIn("#${s} .logo", ${S(0.34)}, 0.16);`);
    tj.push(`      drift("#${s} .logo", ${S(1.8)}, ${+((b.dur - 2.4) / 4.8).toFixed(2)});`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub) tj.push(`      drop("#${s} .sub", ${S(0.85)});`);

  if (last) tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 0.7)});`);
  else tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
  if (!last) tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
  tj.push(``);

  t += b.dur;
});

const D = +t.toFixed(3);

const ticksHTML = TICKS.map(k =>
  `<div class="tick" style="left:${(k.p * RAIL_W).toFixed(1)}px"><i></i><span>${k.lab}</span></div>`).join("");

// ---------------------------------------------------------------------------
// assemble
// ---------------------------------------------------------------------------
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — Get Set Up (${Math.round(D)}s)</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root{
        --onyx:#07121c; --blue:#37bdf8; --red-live:#ff3b30;
        --font-display:"Montserrat",sans-serif; --font-body:"Inter",sans-serif; --font-mono:"JetBrains Mono",monospace;
      }
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{width:1920px;height:1080px;overflow:hidden;background:#000;color:#fff;font-family:var(--font-body);}
      #stage{position:relative;width:1920px;height:1080px;overflow:hidden;background:var(--onyx);
        isolation:isolate;perspective:1600px;perspective-origin:50% 44%;}
      #stage .clip{position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none;}
      #camera{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;}

      /* ---------- depth background ---------- */
      #bg{overflow:hidden;}
      .depth{position:absolute;left:-40%;right:-40%;height:78%;background-color:transparent;
        background-image:
          repeating-linear-gradient(0deg, rgba(55,189,248,.16) 0 1px, transparent 1px 66px),
          repeating-linear-gradient(90deg, rgba(55,189,248,.09) 0 1px, transparent 1px 66px);
        will-change:background-position;}
      .grid-floor{bottom:-14%;transform:perspective(680px) rotateX(66deg);transform-origin:50% 100%;
        -webkit-mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);
        mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);}
      .grid-ceiling{top:-14%;transform:perspective(680px) rotateX(-66deg);transform-origin:50% 0%;opacity:.6;
        -webkit-mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);
        mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);}
      .beam{position:absolute;top:-20%;left:50%;width:1400px;height:1200px;margin-left:-700px;
        background:conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(55,189,248,.14) 22deg, transparent 44deg);
        filter:blur(30px);opacity:.7;will-change:transform,opacity;}
      .glow{position:absolute;border-radius:50%;will-change:transform;}
      .glow.blue{top:-160px;left:50%;width:760px;height:760px;margin-left:-380px;background:var(--blue);filter:blur(155px);opacity:.18;}
      .glow.blue2{bottom:-220px;right:-140px;width:620px;height:620px;background:var(--blue);filter:blur(165px);opacity:.08;}
      .vignette{position:absolute;inset:0;pointer-events:none;
        background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.62) 96%);will-change:opacity;}
      .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:screen;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
      .whip{position:absolute;top:50%;left:0;width:46%;height:10px;margin-top:-5px;opacity:0;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,.95),rgba(55,189,248,.8),transparent);
        filter:blur(7px);will-change:transform,opacity;}

      /* ---------- scene ---------- */
      .scene{display:flex;align-items:center;justify-content:center;transform-style:preserve-3d;}
      .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:26px;padding:96px 120px 150px;text-align:center;transform-style:preserve-3d;will-change:transform,opacity;}

      .eyebrow{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.32em;text-transform:uppercase;
        color:var(--blue);display:inline-flex;align-items:center;text-shadow:0 0 16px rgba(55,189,248,.45);}

      /* big gradient step numeral */
      .time{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:190px;line-height:1;
        letter-spacing:-.04em;padding:.06em .14em .2em;will-change:transform,opacity;
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 80px rgba(55,189,248,.55);}

      .lnwrap{line-height:0;font-size:104px;}
      .ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:1em;line-height:1.16;
        letter-spacing:-.03em;max-width:1640px;}
      .ln.hero{font-size:150px;}
      .ln .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}

      .sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:39px;line-height:1.25;
        color:rgba(209,220,232,.85);max-width:1440px;will-change:transform,opacity;}

      /* checklist rows */
      .viplist{display:flex;flex-direction:column;gap:24px;width:max-content;max-width:1560px;}
      .vrow{display:flex;align-items:baseline;gap:24px;text-align:left;will-change:transform,opacity;}
      .varr{font-family:var(--font-display);font-weight:900;font-size:44px;color:var(--blue);
        text-shadow:0 0 22px rgba(55,189,248,.55);}
      .vtitle{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:56px;letter-spacing:-.02em;
        color:#fff;text-shadow:0 0 26px rgba(255,255,255,.16);white-space:nowrap;padding-right:.14em;}

      /* sponsor logos */
      .logorow{display:flex;gap:120px;justify-content:center;align-items:flex-start;}
      .logo{display:flex;flex-direction:column;align-items:center;gap:40px;will-change:transform,opacity;}
      .logobox{height:150px;display:flex;align-items:center;justify-content:center;}
      .logo img{display:block;filter:drop-shadow(0 0 36px rgba(55,189,248,.30));}
      .logorole{font-family:var(--font-mono);font-weight:700;font-size:25px;letter-spacing:.24em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 14px rgba(55,189,248,.4);}

      /* ---------- step rail ---------- */
      #rail{z-index:5;}
      .railwrap{position:absolute;left:150px;bottom:74px;width:${RAIL_W}px;will-change:opacity,transform;}
      .railline{position:relative;height:4px;border-radius:2px;background:rgba(209,220,232,.16);overflow:visible;}
      .railfill{position:absolute;inset:0;border-radius:2px;transform:scaleX(0);transform-origin:0 50%;
        background:linear-gradient(90deg,rgba(55,189,248,.5),var(--blue));
        box-shadow:0 0 14px rgba(55,189,248,.5);will-change:transform;}
      .railhead{position:absolute;top:-5px;left:-7px;width:14px;height:14px;border-radius:50%;background:#fff;
        box-shadow:0 0 16px rgba(55,189,248,.9),0 0 5px #fff;will-change:transform;}
      .tick{position:absolute;top:-7px;width:0;}
      .tick i{display:block;width:2px;height:18px;margin-left:-1px;background:rgba(209,220,232,.30);}
      .tick span{position:absolute;top:24px;left:0;transform:translateX(-50%);white-space:nowrap;
        font-family:var(--font-mono);font-weight:700;font-size:19px;letter-spacing:.18em;color:rgba(209,220,232,.55);}
      .tick:first-child span{transform:translateX(0);}
      .tick:last-of-type span{transform:translateX(-100%);}

      /* mark */
      .backdrop-mark{position:absolute;right:72px;bottom:60px;display:inline-flex;z-index:6;}
      .bigmark{display:inline-flex;will-change:transform,opacity,filter;}
      .mark{font-family:var(--font-display);font-style:italic;font-weight:900;letter-spacing:-.03em;line-height:.9;
        font-size:92px;display:inline-flex;align-items:baseline;position:relative;}
      .mark.big{font-size:262px;}
      .mark .ais{color:#fff;}
      .mark .gap{display:inline-block;width:.08em;}
      .live{position:relative;color:var(--blue);text-shadow:0 0 60px rgba(55,189,248,.55);padding-right:.28em;}
      .dot{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:var(--red-live);box-shadow:0 0 .7em #ff3b30,0 0 .25em #ff3b30;}
      .ring{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:rgba(255,59,48,.55);opacity:0;transform-origin:50% 50%;pointer-events:none;}
    </style>
  </head>
  <body>
    <div id="stage" data-composition-id="cmp-get-setup" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        <div class="depth grid-ceiling"></div>
        <div class="depth grid-floor"></div>
        <div class="beam"></div>
        <div class="glow blue"></div>
        <div class="glow blue2"></div>
        <div class="vignette"></div>
        <div class="grain"></div>
      </div>
      <div class="whip clip" id="whip" data-start="0" data-duration="${D}" data-track-index="1"></div>
      <div id="markbug" class="clip" data-start="0" data-duration="${D}" data-track-index="2">
        <div class="backdrop-mark"><span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>
      </div>
      <div id="rail" class="clip" data-start="0" data-duration="${D}" data-track-index="3">
        <div class="railwrap">
          <div class="railline"><div class="railfill" id="railfill"></div></div>
          <div class="railhead" id="railhead"></div>
          ${ticksHTML}
        </div>
      </div>

      <div id="camera">
${scenesHTML.join("\n")}
      </div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const D = ${D};
      const RAIL_W = ${RAIL_W};
      const tl = gsap.timeline({ paused: true });

      /* ---- reveal / transition helpers ---- */
      function drop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:d||.5,ease:"power2.out"},at); }
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%"},at); }
      function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%"},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function glowIn(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,scale:.7,filter:"brightness(2.4) blur(6px)"},
        {autoAlpha:1,scale:1,filter:"brightness(1) blur(0px)",duration:.7,ease:"back.out(1.4)",stagger:step||.12},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      function drift(sel, at, cycles){ tl.to(sel,{y:"-=12",duration:2.4,yoyo:true,repeat:Math.max(1,Math.round(cycles*2)-1),
        ease:"sine.inOut",stagger:{each:.25,from:"center"}},at); }
      function whipOut(sel, at){ tl.to(sel,{autoAlpha:0,y:-155,filter:"blur(30px)",duration:.26,ease:"power2.in"},at); }
      function settleOut(sel, at){ tl.to(sel,{autoAlpha:0,filter:"blur(12px)",duration:.6,ease:"power2.in"},at); }
      function streak(at){
        tl.fromTo("#whip",{xPercent:-130,scaleX:.5,autoAlpha:0},{autoAlpha:.95,duration:.1,ease:"none",immediateRender:false,overwrite:"auto"},at-0.05);
        tl.to("#whip",{xPercent:270,scaleX:1.7,autoAlpha:0,duration:.34,ease:"power3.in",overwrite:"auto"},at+0.02);
      }
      function railTo(p, at){
        tl.to("#railfill",{scaleX:p,duration:.7,ease:"power2.inOut",overwrite:"auto"},at);
        tl.to("#railhead",{x:p*RAIL_W,duration:.7,ease:"power2.inOut",overwrite:"auto"},at);
      }

      /* ---- AMBIENT ---- */
      tl.to("#camera", { scale:1.035, y:-16, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=660px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=660px", duration:D, ease:"none" }, 0);
      tl.to(".beam",     { rotation:8, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/8, yoyo:true, repeat:7, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:44, y:-24, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue2",{ x:-36, y:22, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/8, yoyo:true, repeat:7, ease:"sine.inOut" }, 0);
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(t / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(t / 1.6) - 1}, ease:"none" }, 0);
      drop(".railwrap", 0.35, .7);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // fill the slot
      window.__timelines["cmp-get-setup"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(DIR, "index.html"), html);
console.log(`wrote index.html — ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min)`);
