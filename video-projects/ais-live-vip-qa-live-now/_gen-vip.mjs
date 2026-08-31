// AIS LIVE — VIP prompt: "Your Q&A with Nate is live now in the VIP room" (~34s).
// In-show prompt card fired at 9:30 AM Day 1: tells VIP attendees the Q&A is
// happening RIGHT NOW and routes them to the VIP room.
//
// Same house motion engine as the Get Set Up / Day 1 agenda walkthroughs
// (depth grid tunnel, chrome italic type, whip cuts, solid AIS/LIVE mark bug),
// all-blue styling per Aidan's standing directives (no coral/yellow accents,
// no eyebrow dots, no on-screen em dashes). Instead of a progress rail, a
// persistent LIVE NOW pill (blue mono + red tally dot) sits top-left.
// Session facts verbatim from Agenda v7.1: 9:30am · 45 min · VIP room · Nate Herk.
// Determinism: no Math.random / Date.now anywhere.
//
//   node _gen-vip.mjs   -> writes index.html

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// BEAT PROGRAM
// ---------------------------------------------------------------------------
const BEATS = [
  { type: "hero", dur: 6, eyebrow: "VIP · HAPPENING NOW", mw: 1330,
    pre: "Your Q&amp;A with Nate ", accent: "is live.",
    sub: "Right now, in the VIP room." },

  { type: "portrait", dur: 8, tag: "LIVE NOW · VIP ROOM ONLY",
    img: "nate-herk.png",
    title: "VIP Q&amp;A with Nate",
    name: "Nate Herk", role: "Founder · Uppit AI & AIS",
    meta: "9:30 AM CT · 45 MIN · VIP ROOM" },

  { type: "rows", dur: 8, tag: "HOW IT WORKS",
    rows: [
      "Bring the question you've been mulling over",
      "Pre-submitted questions get worked through first",
      "Live questions from the room woven in",
    ], sub: "Forty-five minutes with Nate before the cameras turn on." },

  { type: "hero", dur: 6, eyebrow: "DON'T MISS IT",
    pre: "Head to the ", accent: "VIP room.",
    sub: "The session is live now." },

  { type: "markflash", dur: 6, sub: "VIP Q&amp;A with Nate · Live now in the VIP room" },
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
      return `${eyeb(b.eyebrow)}<div class="ln hero"${b.mw ? ` style="max-width:${b.mw}px"` : ""}>${wrapWords(b.pre)}${wrapWords(b.accent, "ac")}</div>${sub(b.sub)}`;

    case "portrait":
      return `<div class="portrait"><img src="assets/${b.img}" alt="" /></div>
        <div class="pcontent">
          ${eyeb(b.tag)}
          <div class="ptitle">${wrapWords(b.title)}</div>
          <div class="divider"></div>
          <div class="pname">${b.name}</div>
          <div class="prole">${b.role}</div>
          <div class="pmeta">${b.meta}</div>
        </div>`;

    case "rows": {
      const rows = b.rows.map(r =>
        `<div class="vrow"><span class="varr">&rsaquo;</span><span class="vtitle">${r}</span></div>`).join("");
      return `${eyeb(b.tag)}<div class="viplist">${rows}</div>${sub(b.sub)}`;
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
`      <section id="${s}" class="scene clip ${b.type === "portrait" ? "scene-portrait" : ""}" data-start="${+start.toFixed(3)}" data-duration="${win}" data-track-index="${track}">
        <div class="inner">
        ${sceneBody(b)}
        </div>
      </section>`);

  tj.push(`      // ${s} · ${b.type}  (${b.dur}s)`);
  if (!first) tj.push(`      streak(${S(0)});`);

  if (b.type === "hero") {
    tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
    tj.push(`      words("#${s} .ln .wd", ${S(0.26)});`);
  } else if (b.type === "portrait") {
    tj.push(`      rise("#${s} .portrait", ${S(0.16)});`);
    tj.push(`      drop("#${s} .eyebrow", ${S(0.22)});`);
    tj.push(`      words("#${s} .ptitle .wd", ${S(0.34)});`);
    tj.push(`      wipe("#${s} .divider", ${S(0.7)});`);
    tj.push(`      drop("#${s} .pname", ${S(0.85)});`);
    tj.push(`      drop("#${s} .prole", ${S(0.98)});`);
    tj.push(`      drop("#${s} .pmeta", ${S(1.15)});`);
  } else if (b.type === "rows") {
    tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
    tj.push(`      slideX("#${s} .vrow", ${S(0.34)}, 0.18);`);
    tj.push(`      drift("#${s} .vrow", ${S(1.8)}, ${+((b.dur - 2.4) / 4.8).toFixed(2)});`);
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

// portrait scene word-title split (title is wrapped after sceneBody, so wrap here)
// -> handled by wrapping in sceneBody output via post-process below.

// ---------------------------------------------------------------------------
// assemble
// ---------------------------------------------------------------------------
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — VIP Q&amp;A Live Now (${Math.round(D)}s)</title>
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

      /* ---------- LIVE NOW pill (persistent, top-left) ---------- */
      .pillwrap{position:absolute;left:150px;top:64px;display:inline-flex;align-items:center;gap:16px;
        font-family:var(--font-mono);font-weight:700;font-size:24px;letter-spacing:.32em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 16px rgba(55,189,248,.45);will-change:transform,opacity;}
      .pdot{position:relative;width:14px;height:14px;border-radius:50%;background:var(--red-live);
        box-shadow:0 0 14px #ff3b30,0 0 5px #ff3b30;}
      .pring{position:absolute;left:150px;top:64px;margin-top:5px;margin-left:0;width:14px;height:14px;border-radius:50%;
        background:rgba(255,59,48,.55);opacity:0;transform-origin:50% 50%;pointer-events:none;}

      /* ---------- scene ---------- */
      .scene{display:flex;align-items:center;justify-content:center;transform-style:preserve-3d;}
      .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:26px;padding:96px 120px 150px;text-align:center;transform-style:preserve-3d;will-change:transform,opacity;}

      .eyebrow{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.32em;text-transform:uppercase;
        color:var(--blue);display:inline-flex;align-items:center;text-shadow:0 0 16px rgba(55,189,248,.45);}

      .ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:104px;line-height:1.16;
        letter-spacing:-.03em;max-width:1640px;}
      .ln.hero{font-size:138px;}
      .ln .wd,.ptitle .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}

      .sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:39px;line-height:1.25;
        color:rgba(209,220,232,.85);max-width:1440px;will-change:transform,opacity;}

      /* ---------- portrait scene ---------- */
      .scene-portrait .inner{display:block;padding:0;text-align:left;}
      .portrait{position:absolute;left:30px;bottom:0;width:860px;height:960px;
        display:flex;align-items:flex-end;justify-content:center;will-change:transform,opacity;}
      .portrait img{max-width:100%;max-height:100%;object-fit:contain;object-position:bottom center;
        filter:drop-shadow(0 26px 54px rgba(0,0,0,.55));
        -webkit-mask-image:
          linear-gradient(to bottom,#000 80%,transparent 100%),
          linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%);
        -webkit-mask-composite:source-in;
        mask-image:
          linear-gradient(to bottom,#000 80%,transparent 100%),
          linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%);
        mask-composite:intersect;}
      .pcontent{position:absolute;left:930px;right:110px;top:0;bottom:40px;
        display:flex;flex-direction:column;align-items:flex-start;justify-content:center;}
      .pcontent .eyebrow{margin-bottom:26px;}
      .ptitle{font-family:var(--font-display);font-style:italic;font-weight:900;letter-spacing:-.03em;
        line-height:1.1;font-size:94px;color:#fff;max-width:660px;margin-left:-.15em;}
      .divider{width:128px;height:2px;background:var(--blue);margin:26px 0 28px;
        box-shadow:0 0 16px rgba(55,189,248,.6);transform-origin:left center;will-change:transform,opacity;}
      .pname{font-family:var(--font-display);font-style:italic;font-weight:800;letter-spacing:-.02em;
        font-size:46px;color:#fff;line-height:1.02;will-change:transform,opacity;}
      .prole{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:29px;
        letter-spacing:-.01em;color:rgba(209,220,232,.85);margin-top:8px;will-change:transform,opacity;}
      .pmeta{font-family:var(--font-mono);font-weight:500;font-size:23px;letter-spacing:.22em;
        text-transform:uppercase;color:var(--blue);margin-top:36px;text-shadow:0 0 14px rgba(55,189,248,.4);will-change:transform,opacity;}

      /* checklist rows */
      .viplist{display:flex;flex-direction:column;gap:24px;width:max-content;max-width:1560px;}
      .vrow{display:flex;align-items:baseline;gap:24px;text-align:left;will-change:transform,opacity;}
      .varr{font-family:var(--font-display);font-weight:900;font-size:44px;color:var(--blue);
        text-shadow:0 0 22px rgba(55,189,248,.55);}
      .vtitle{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:54px;letter-spacing:-.02em;
        color:#fff;text-shadow:0 0 26px rgba(255,255,255,.16);white-space:nowrap;padding-right:.14em;}

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
    <div id="stage" data-composition-id="cmp-vip-qa-live" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
      <div id="livepill" class="clip" data-start="0" data-duration="${D}" data-track-index="3">
        <div class="pillwrap"><span class="pdot"></span>LIVE NOW · VIP</div>
      </div>

      <div id="camera">
${scenesHTML.join("\n")}
      </div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const D = ${D};
      const tl = gsap.timeline({ paused: true });

      /* ---- reveal / transition helpers ---- */
      function drop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:d||.5,ease:"power2.out"},at); }
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%"},at); }
      function rise(sel, at){ tl.fromTo(sel,{autoAlpha:0,y:110,filter:"blur(10px)"},
        {autoAlpha:1,y:0,filter:"blur(0px)",duration:.7,ease:"power3.out"},at); }
      function wipe(sel, at){ tl.fromTo(sel,{autoAlpha:0,scaleX:0},{autoAlpha:1,scaleX:1,duration:.55,ease:"power2.out"},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
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

      /* ---- AMBIENT ---- */
      tl.to("#camera", { scale:1.035, y:-16, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=660px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=660px", duration:D, ease:"none" }, 0);
      tl.to(".beam",     { rotation:8, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/8, yoyo:true, repeat:7, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:44, y:-24, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue2",{ x:-36, y:22, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/8, yoyo:true, repeat:7, ease:"sine.inOut" }, 0);
      tl.to(".dot, .pdot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(t / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(t / 1.6) - 1}, ease:"none" }, 0);
      drop(".pillwrap", 0.35, .7);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // fill the slot
      window.__timelines["cmp-vip-qa-live"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(DIR, "index.html"), html);
console.log(`wrote index.html — ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min)`);
