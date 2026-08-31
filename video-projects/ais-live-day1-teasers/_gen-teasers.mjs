// AIS LIVE — "What's coming today" Day 1 session teasers (~84s).
// Block 1 morning hype cut: teases the marquee Day 1 sessions with a hook line
// each, speaker cutouts + real sponsor logos, exact v7.1 times + speakers.
//
// Same house motion engine as the other Block 1 assets (depth grid tunnel,
// chrome italic type, whip cuts, solid AIS/LIVE mark bug), all-blue styling per
// Aidan's standing directives (no coral/yellow accents, no eyebrow dots, no
// on-screen em dashes). Persistent plain mono day label top-left.
// Determinism: no Math.random / Date.now anywhere.
//
//   node _gen-teasers.mjs   -> writes index.html

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// BEAT PROGRAM — session facts verbatim from Agenda v7.1
// ---------------------------------------------------------------------------
const BEATS = [
  { type: "hero", dur: 5.5, eyebrow: "TODAY'S LINEUP", mw: 1330,
    pre: "Here's what's ", accent: "coming today.",
    sub: "Saturday, July 11. All times Central." },

  { type: "tcard", dur: 8, tag: "MAIN STAGE · 55 MIN", time: "10:30 AM",
    title: "Anatomy of Three Real Deals",
    spk: "Aidan Finnegan · Nate Herk · Glenn Marcus · Wyatt Lyonsmith",
    sub: "Three real client engagements, end to end. The actual version, numbers attached." },

  { type: "portrait", dur: 7, tag: "KEYNOTE · 11:40 AM · MAIN STAGE",
    img: "cutouts/alex-mcdonnell.png", logo: "hyperagent-white.png",
    title: "The New Standard", tsize: 84,
    name: "Alex McDonnell", role: "Why you need a fleet of always-on agents.",
    meta: "11:40 AM CT · MAIN STAGE" },

  { type: "logotease", dur: 6.5, tag: "SPONSORED SESSION · 12:00 PM",
    logo: "glaido-white.png", lw: 520,
    sub: "Voice AI you can actually bill for. Live demo from the Glaido team.",
    meta: "12:00 PM CT · MAIN STAGE" },

  { type: "portrait", dur: 7, tag: "CO-BUILD · 12:20 PM · MAIN STAGE",
    imgs: ["cutouts/nate-herk.png", "cutouts/ednan-abdullayev.png"],
    title: "Evals", tsize: 94,
    name: "Nate Herk + Ednan Abdullayev",
    role: "Built live. The eval results tell you exactly what to fix.",
    meta: "12:20 PM CT · MAIN STAGE" },

  { type: "worksplit", dur: 8, tag: "WORKSHOP BLOCK 1 · 12:45 PM · PICK YOUR TRACK",
    cards: [
      { track: "FOUNDATION", title: "Your First 30 Days in AI Automation", spk: "Liberty White" },
      { track: "ADVANCED", title: "Low-Code to Full-Code", spk: "Dave Ebbelaar" },
    ], sub: "Two rooms, same time. Choose the one that matches where you are." },

  { type: "portrait", dur: 7, tag: "FEATURED SESSION · 2:35 PM",
    img: "cutouts/kacper-rutkiewicz.png",
    title: "An Entire AI Automation Agency, Run in Claude Code", tsize: 64,
    name: "Kacper Rutkiewicz",
    role: "Client delivery. Sales. Content. One workspace.",
    meta: "2:35 PM CT · MAIN STAGE" },

  { type: "worksplit", dur: 8, tag: "WORKSHOP BLOCK 2 · 3:10 PM · PICK YOUR TRACK",
    cards: [
      { track: "FOUNDATION", title: "Build Your First AI Content Engine", spk: "Sabrina Ramonov" },
      { track: "ADVANCED", title: "Build a Voice AI Sales Rep", spk: "Samin Yasar" },
    ], sub: "Live builds, end to end, on a real screen share." },

  { type: "portrait", dur: 7, tag: "WORKSHOP BLOCK 3 · 4:20 PM",
    img: "cutouts/tangy-frederick.png",
    title: "Enterprise AI Services", tsize: 84,
    name: "Tangy Frederick",
    role: "How a small AI agency wins deals against firms ten times its size.",
    meta: "4:20 PM CT · MAIN STAGE" },

  { type: "agrows", dur: 7.5, tag: "TO CLOSE THE DAY",
    rows: [
      { time: "5:05 PM", title: "Get AIS+ Certified", spk: "Ednan Abdullayev" },
      { time: "5:20 PM", title: "Day 1 Closing Remarks", spk: "Nate Herk" },
    ], sub: "Plus the overnight challenge that sets up Day 2." },

  { type: "hero", dur: 6, eyebrow: "MAIN STAGE", mw: 1240,
    pre: "It all starts at ", accent: "10:15 AM.",
    sub: "Welcome to AIS Live, with Nate Herk." },

  { type: "markflash", dur: 6, sub: "Day 1 · Build Day" },
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

    case "tcard":
      return `${eyeb(b.tag)}
        <div class="time">${b.time}</div>
        <div class="lnwrap"><div class="ln">${wrapWords(b.title)}</div></div>
        <div class="spkline">${b.spk}</div>${sub(b.sub)}`;

    case "portrait": {
      // solo: aspect-aware full-height cutout (4:5 at 96%, squarish chest-up
      // at 88%). 2+ speakers: circle-medallion column (the announcement-card
      // "circle format").
      const SQUARISH = ["cutouts/nate-herk.png", "cutouts/ednan-abdullayev.png", "cutouts/kacper-rutkiewicz.png", "cutouts/tangy-frederick.png"];
      const list = b.imgs || [b.img];
      let imgs;
      if (list.length === 1) {
        imgs = `<img src="assets/${list[0]}" style="height:${SQUARISH.includes(list[0]) ? 88 : 96}%;width:auto;max-width:none" alt="" />`;
      } else {
        const size = list.length === 2 ? 340 : 260;
        return `<div class="pics" style="gap:30px">${list.map(i =>
          `<img class="pic" src="assets/${i.replace("cutouts/", "medallions/")}" style="width:${size}px;height:${size}px" alt="" />`).join("")}</div>
        <div class="pcontent">
          ${eyeb(b.tag)}
          <div class="ptitle" style="font-size:${b.tsize || 94}px">${wrapWords(b.title)}</div>
          <div class="divider"></div>
          <div class="pname">${b.name}</div>
          <div class="prole">${b.role}</div>
          <div class="pmeta">${b.meta}</div>
        </div>`;
      }
      const logo = b.logo ? `<div class="plogo"><img src="assets/${b.logo}" alt="" /></div>` : "";
      return `<div class="portrait ${b.imgs ? "duo" : ""}">${imgs}</div>
        <div class="pcontent">
          ${eyeb(b.tag)}
          ${logo}
          <div class="ptitle" style="font-size:${b.tsize || 94}px">${wrapWords(b.title)}</div>
          <div class="divider"></div>
          <div class="pname">${b.name}</div>
          <div class="prole">${b.role}</div>
          <div class="pmeta">${b.meta}</div>
        </div>`;
    }

    case "logotease":
      return `${eyeb(b.tag)}
        <div class="bigl"><img src="assets/${b.logo}" style="width:${b.lw}px" alt="" /></div>
        ${sub(b.sub)}<div class="pmeta center">${b.meta}</div>`;

    case "worksplit": {
      const cards = b.cards.map(c => `
          <div class="wcard">
            <div class="wtrack">${c.track}</div>
            <div class="wtitle">${c.title}</div>
            <div class="wspk">${c.spk}</div>
          </div>`).join("");
      return `${eyeb(b.tag)}<div class="wrow">${cards}</div>${sub(b.sub)}`;
    }

    case "agrows": {
      const rows = b.rows.map(r =>
        `<div class="arow"><span class="atime">${r.time}</span><span class="atitle">${r.title}</span><span class="aspk">${r.spk}</span></div>`).join("");
      return `${eyeb(b.tag)}<div class="arows">${rows}</div>${sub(b.sub)}`;
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
  if (b.eyebrow || b.tag) tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);

  if (b.type === "hero") {
    tj.push(`      words("#${s} .ln .wd", ${S(0.26)});`);
  } else if (b.type === "tcard") {
    tj.push(`      pop("#${s} .time", ${S(0.22)}, .55);`);
    tj.push(`      words("#${s} .ln .wd", ${S(0.38)});`);
    tj.push(`      drop("#${s} .spkline", ${S(0.7)});`);
  } else if (b.type === "portrait") {
    if (b.imgs) tj.push(`      glowIn("#${s} .pic", ${S(0.16)}, 0.12);`);
    else tj.push(`      rise("#${s} .portrait", ${S(0.16)});`);
    if (b.logo) tj.push(`      drop("#${s} .plogo", ${S(0.26)});`);
    tj.push(`      words("#${s} .ptitle .wd", ${S(0.36)});`);
    tj.push(`      wipe("#${s} .divider", ${S(0.72)});`);
    tj.push(`      drop("#${s} .pname", ${S(0.86)});`);
    tj.push(`      drop("#${s} .prole", ${S(0.99)});`);
    tj.push(`      drop("#${s} .pmeta", ${S(1.16)});`);
  } else if (b.type === "logotease") {
    tj.push(`      glowIn("#${s} .bigl", ${S(0.3)});`);
    tj.push(`      drop("#${s} .pmeta", ${S(1.0)});`);
  } else if (b.type === "worksplit") {
    tj.push(`      slideX("#${s} .wcard", ${S(0.34)}, 0.2);`);
    tj.push(`      drift("#${s} .wcard", ${S(1.8)}, ${+((b.dur - 2.4) / 4.8).toFixed(2)});`);
  } else if (b.type === "agrows") {
    tj.push(`      slideX("#${s} .arow", ${S(0.34)}, 0.2);`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub) tj.push(`      drop("#${s} .sub", ${S(0.9)});`);

  if (last) tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 0.7)});`);
  else tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
  if (!last) tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
  tj.push(``);

  t += b.dur;
});

const D = +t.toFixed(3);

// ---------------------------------------------------------------------------
// assemble
// ---------------------------------------------------------------------------
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — What's Coming Today (${Math.round(D)}s)</title>
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

      /* ---------- persistent day label (plain mono, no marker) ---------- */
      .daylab{position:absolute;left:150px;top:64px;
        font-family:var(--font-mono);font-weight:700;font-size:22px;letter-spacing:.3em;text-transform:uppercase;
        color:rgba(209,220,232,.55);will-change:transform,opacity;}
      .daylab b{color:var(--blue);font-weight:700;}

      /* ---------- scene ---------- */
      .scene{display:flex;align-items:center;justify-content:center;transform-style:preserve-3d;}
      .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:26px;padding:96px 120px 150px;text-align:center;transform-style:preserve-3d;will-change:transform,opacity;}

      .eyebrow{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.32em;text-transform:uppercase;
        color:var(--blue);display:inline-flex;align-items:center;text-shadow:0 0 16px rgba(55,189,248,.45);}

      /* big gradient time */
      .time{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:150px;line-height:1;
        letter-spacing:-.04em;padding:.06em .14em .2em;will-change:transform,opacity;
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 80px rgba(55,189,248,.55);}

      .lnwrap{line-height:0;font-size:88px;}
      .ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:1em;line-height:1.16;
        letter-spacing:-.03em;max-width:1640px;}
      .ln.hero{font-size:138px;}
      .ln .wd,.ptitle .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}

      .spkline{font-family:var(--font-display);font-style:italic;font-weight:800;font-size:33px;letter-spacing:-.01em;
        color:var(--blue);text-shadow:0 0 22px rgba(55,189,248,.45);will-change:transform,opacity;}

      .sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:37px;line-height:1.3;
        color:rgba(209,220,232,.85);max-width:1400px;will-change:transform,opacity;}

      /* ---------- portrait scene ---------- */
      .scene-portrait .inner{display:block;padding:0;text-align:left;}
      .portrait{position:absolute;left:-60px;top:40px;bottom:0;width:880px;
        display:flex;align-items:flex-end;justify-content:center;will-change:transform,opacity;}
      .portrait img{object-fit:contain;object-position:bottom center;
        filter:drop-shadow(0 26px 54px rgba(0,0,0,.55));
        -webkit-mask-image:
          linear-gradient(to bottom,#000 80%,transparent 100%),
          linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%);
        -webkit-mask-composite:source-in;
        mask-image:
          linear-gradient(to bottom,#000 80%,transparent 100%),
          linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%);
        mask-composite:intersect;}
      .pics{position:absolute;left:170px;top:0;bottom:40px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;}
      .pic{display:block;border-radius:50%;will-change:transform,opacity;
        filter:drop-shadow(0 18px 36px rgba(0,0,0,.55));}
      .pcontent{position:absolute;left:930px;right:110px;top:0;bottom:40px;
        display:flex;flex-direction:column;align-items:flex-start;justify-content:center;}
      .pcontent .eyebrow{margin-bottom:26px;}
      .plogo{margin-bottom:10px;will-change:transform,opacity;}
      .plogo img{height:60px;display:block;filter:drop-shadow(0 0 28px rgba(55,189,248,.30));}
      .ptitle{font-family:var(--font-display);font-style:italic;font-weight:900;letter-spacing:-.03em;
        line-height:1.1;color:#fff;max-width:840px;margin-left:-.15em;}
      .divider{width:128px;height:2px;background:var(--blue);margin:26px 0 28px;
        box-shadow:0 0 16px rgba(55,189,248,.6);transform-origin:left center;will-change:transform,opacity;}
      .pname{font-family:var(--font-display);font-style:italic;font-weight:800;letter-spacing:-.02em;
        font-size:44px;color:#fff;line-height:1.02;will-change:transform,opacity;}
      .prole{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:29px;line-height:1.3;
        letter-spacing:-.01em;color:rgba(209,220,232,.85);margin-top:10px;max-width:820px;will-change:transform,opacity;}
      .pmeta{font-family:var(--font-mono);font-weight:500;font-size:23px;letter-spacing:.22em;
        text-transform:uppercase;color:var(--blue);margin-top:34px;text-shadow:0 0 14px rgba(55,189,248,.4);will-change:transform,opacity;}
      .pmeta.center{margin-top:6px;}

      /* ---------- logo tease ---------- */
      .bigl{will-change:transform,opacity;}
      .bigl img{display:block;filter:drop-shadow(0 0 44px rgba(55,189,248,.35));}

      /* ---------- worksplit ---------- */
      .wrow{display:flex;gap:44px;justify-content:center;}
      .wcard{width:640px;padding:46px 48px 42px;border-radius:20px;text-align:left;
        background:rgba(255,255,255,.045);border:1px solid rgba(55,189,248,.20);
        box-shadow:0 24px 60px rgba(0,0,0,.35);will-change:transform,opacity;}
      .wtrack{font-family:var(--font-mono);font-weight:700;font-size:23px;letter-spacing:.3em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 14px rgba(55,189,248,.4);}
      .wtitle{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:46px;letter-spacing:-.02em;
        line-height:1.14;color:#fff;margin-top:20px;text-wrap:balance;hyphens:none;-webkit-hyphens:none;
        padding-right:.1em;}
      .wspk{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:29px;
        color:rgba(209,220,232,.85);margin-top:18px;}

      /* ---------- agenda rows ---------- */
      .arows{display:flex;flex-direction:column;gap:30px;width:max-content;max-width:1600px;}
      .arow{display:flex;align-items:baseline;gap:34px;text-align:left;will-change:transform,opacity;}
      .atime{font-family:var(--font-mono);font-weight:700;font-size:34px;letter-spacing:.08em;color:var(--blue);
        text-shadow:0 0 18px rgba(55,189,248,.5);min-width:170px;}
      .atitle{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:52px;letter-spacing:-.02em;
        color:#fff;text-shadow:0 0 26px rgba(255,255,255,.16);white-space:nowrap;padding-right:.14em;}
      .aspk{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:30px;
        color:rgba(209,220,232,.75);white-space:nowrap;}

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
    <div id="stage" data-composition-id="cmp-day1-teasers" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
      <div id="daylab" class="clip" data-start="0" data-duration="${D}" data-track-index="3">
        <div class="daylab">SAT JULY 11 · <b>DAY 1 · BUILD DAY</b></div>
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
      function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%"},at); }
      function rise(sel, at){ tl.fromTo(sel,{autoAlpha:0,y:110,filter:"blur(10px)"},
        {autoAlpha:1,y:0,filter:"blur(0px)",duration:.7,ease:"power3.out"},at); }
      function wipe(sel, at){ tl.fromTo(sel,{autoAlpha:0,scaleX:0},{autoAlpha:1,scaleX:1,duration:.55,ease:"power2.out"},at); }
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
      drop(".daylab", 0.35, .7);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // fill the slot
      window.__timelines["cmp-day1-teasers"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(DIR, "index.html"), html);
console.log(`wrote index.html — ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min)`);
