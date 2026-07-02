// AIS LIVE — #1 Doors-Open LOOP (long-form, depth + kinetic rework).
// Brief: 3-5 min energy-building montage, plays 6-8x across the 30-min doors window,
// one version both days. This is ONE ~208s composition of ~34 distinct beats.
//
// Motion system (per MOTION_PHILOSOPHY.md):
//   DEPTH      perspective grid tunnel (floor + ceiling), light beam, seeded particle
//              field, crosshairs, breathing vignette, grain, slow continuous camera dolly.
//   TYPE       chrome-gradient + halo headlines, revealed word-by-word with blur-in.
//   CUTS       motion-blur whip on the beat plane + a light streak firing at every cut.
//   SIGNATURE  3D-flip speaker cards, photos rising from depth w/ parallax drift,
//              count-up stats, glowing sponsor reveal, drawing-line agenda,
//              dolly-through-type on the two punchlines.
// The AIS/LIVE mark stays SOLID (brand §3.2) — only headlines get the chrome gradient.
// Determinism: no Math.random/Date.now (seeded harmonic hash). Padded to a 1.6s multiple
// so ambient tiles seamlessly at the loop point; ends on a welcome beat (calm seam).
//
//   node _gen-doors-loop.mjs         -> writes cards/doors-open-loop.html
//   node _gen-doors-loop.mjs --set   -> also copies it to index.html (active for preview/render)

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

// ---------------------------------------------------------------------------
// BEAT PROGRAM — an energy arc that resets to welcome for a clean loop seam.
// ---------------------------------------------------------------------------
const BEATS = [
  // ---- ACT 1 · arrival / welcome ----
  { type: "welcome", dur: 6, eyebrow: "DOORS OPEN · WELCOME", pre: "You made it. ", accent: "Grab a seat.", sub: "AIS LIVE begins shortly." },
  { type: "tagline", dur: 6, pre: "Real projects. ", accent: "Real revenue.", sub: "Two days. Built live, in the room." },
  { type: "tagline", dur: 6, pre: "Welcome to ", accent: "the room.", sub: "Where builders become earners." },
  { type: "stat",    dur: 6, kicker: "ON STAGE THIS WEEKEND", num: "25+", unit: "SPEAKERS", sub: "Founders, operators, and closers." },
  { type: "hero",    dur: 5, eyebrow: "WELCOME", pre: "Doors are ", accent: "open." },

  // ---- ACT 2 · what this is ----
  { type: "tagline", dur: 6, pre: "Build Day ", accent: "-> Earn Day.", accentColor: "coral", sub: "Day 1 you build it. Day 2 you get paid." },
  { type: "stat",    dur: 6, kicker: "THIS IS", num: "2", unit: "DAYS IN THE ROOM", sub: "July 11 - 12" },
  { type: "hero",    dur: 5, pre: "One room. ", accent: "Every builder." },
  { type: "hero",    dur: 5, pre: "Two days. ", accent: "One mission.", accentColor: "coral" },
  { type: "stat",    dur: 6, kicker: "BUILDERS SHIPPING TOGETHER", num: "00", unit: "IN ATTENDANCE", sub: "set the real headcount", ph: true },
  { type: "stat",    dur: 6, kicker: "ACROSS TWO DAYS", num: "30+", unit: "LIVE SESSIONS", sub: "Talks, panels, and hands-on workshops." },
  { type: "tagline", dur: 6, pre: "You're not here to watch. ", accent: "You're here to build.", sub: "That's the whole point of the room." },
  { type: "hero",    dur: 5, pre: "No theory. ", accent: "Just building.", accentColor: "coral" },

  // ---- ACT 3 · who's here (real speaker cards + proof + sponsors) ----
  { type: "hero",    dur: 5, eyebrow: "THE LINEUP", pre: "The people ", accent: "you came for." },
  { type: "speakers", dur: 8, eyebrow: "SPEAKERS", cards: ["nate-herk", "matt-wolfe", "jonathan-stark", "devin-kearns"] },
  { type: "speakers", dur: 8, eyebrow: "ON THE MAIN STAGE", cards: ["dave-ebbelaar", "jon-morrow", "cole-medin", "sabrina-ramonov"] },
  { type: "speakers", dur: 8, eyebrow: "AND MORE", cards: ["kacper-rutkiewicz", "alex-mcdonnell", "amy-simpson", "aidan-finnegan"] },
  { type: "quote",   dur: 7, eyebrow: "MEMBER WIN", quote: "Every client came to me. I never sent a single cold DM.", attrib: "Abdurrahman Ibrahim" },
  { type: "quote",   dur: 7, eyebrow: "FROM THE COMMUNITY", quote: "In six weeks I landed two contracts worth nearly $20,000. And the sky's the limit.", attrib: "Amy Simpson" },
  { type: "sponsor", dur: 6, eyebrow: "OUR SPONSORS", logos: [
      { src: "hyperagent-white", w: 1100, role: "PRESENTING SPONSOR" },
      { src: "glaido-white", w: 1100, h: 100, role: "SPONSOR" },
    ] },
  { type: "hero",    dur: 5, eyebrow: "COMMUNITY", pre: "Built with ", accent: "the room.", accentColor: "coral" },

  // ---- ACT 4 · what's coming (real two-day agenda) ----
  { type: "hero",    dur: 5, eyebrow: "ON THE AGENDA", pre: "Here's what's ", accent: "coming.", accentColor: "coral" },
  { type: "agenda",  dur: 8, eyebrow: "BUILD DAY · JULY 11", rows: [
      { t: "10:30", label: "Always-On Agent Fleets" },
      { t: "11:00", label: "Anatomy of Three Real Deals" },
      { t: "2:45", label: "Run an Agency with Claude Code" },
    ], caption: "All times Central" },
  { type: "agenda",  dur: 8, eyebrow: "EARN DAY · JULY 12", rows: [
      { t: "11:10", label: "The Tool War Panel" },
      { t: "12:30", label: "The Sales Arc, Live" },
      { t: "5:20", label: "Closing: Build to Sell" },
    ], caption: "All times Central" },
  { type: "stat",    dur: 6, kicker: "WHAT YOU'LL LEAVE WITH", num: "1", unit: "AGENT SHIPPED", sub: "Built by you. Working by tonight." },
  { type: "tagline", dur: 6, pre: "Stop watching. ", accent: "Start building.", accentColor: "coral", sub: "By tonight, it works.", dollyOut: true },
  { type: "tagline", dur: 6, pre: "Ship it. ", accent: "Then get paid.", accentColor: "coral", sub: "That's the promise." },
  { type: "tracks",  dur: 8, eyebrow: "WHAT YOU'LL LEAVE WITH", rows: ["Land your first client", "Price to sell, not by the hour", "Ship a real, working agent"] },
  { type: "hero",    dur: 5, pre: "Let's get to ", accent: "work.", accentColor: "coral", dollyOut: true },

  // ---- ACT 5 · proof + loop reset ----
  { type: "stat",    dur: 6, kicker: "MEMBER RESULT", num: "$60K", unit: "FIRST CONTRACT, ONE WEEK IN", sub: "Glenn Marcus, AIS member" },
  { type: "tagline", dur: 6, pre: "You're in ", accent: "the right room.", sub: "Let's make it count." },
  { type: "markflash", dur: 6, sub: "Welcome to the room." },
  { type: "welcome", dur: 6, eyebrow: "DOORS OPEN · WELCOME", pre: "Find your seat. ", accent: "We start soon.", sub: "AIS LIVE begins shortly." },
];

// pad up to the next 1.6s beat (seamless ambient) — fraction of a sec extra hold on the last beat.
const contentSum = BEATS.reduce((s, b) => s + b.dur, 0);
const TOTAL = Math.ceil(contentSum / 1.6) * 1.6;
BEATS[BEATS.length - 1].dur += +(TOTAL - contentSum).toFixed(3);

// ---------------------------------------------------------------------------
// scene HTML renderers
// ---------------------------------------------------------------------------
// join with "" — inter-word gap comes from each .wd's side padding (so it stays even
// and the italic/gradient words never collide or double-space).
const wrapWords = (str, cls) => str.trim().split(/\s+/)
  .map(w => `<span class="wd ${cls || ""}">${w}</span>`).join("");

function headline(b, heroForce) {
  const acCls = b.accentColor === "coral" ? "ac aco" : "ac";
  const pre = b.pre ? wrapWords(b.pre) : "";
  const ac = b.accent ? wrapWords(b.accent, acCls) : "";
  const hero = heroForce || b.type === "hero" || b.type === "septease" || b.hero;
  return `<div class="ln${hero ? " hero" : ""}">${pre}${ac}</div>`;
}
const eyeb = b => b.eyebrow ? `<div class="eyebrow${b.accentColor === "coral" ? " coral" : ""}">${b.eyebrow}</div>` : "";
const sub = t => t ? `<div class="sub">${t}</div>` : "";

// stat number start value (count-up) — placeholders stay static
function numStart(b) {
  if (b.ph) return b.num;
  if (/^\d+$/.test(b.num)) return "0";
  if (/^\d+K\+$/.test(b.num)) return "0K+";
  return b.num;
}

function sceneBody(b) {
  switch (b.type) {
    case "welcome": case "tagline": case "hero": case "septease":
      return `${eyeb(b)}${headline(b)}${sub(b.sub)}`;

    case "quote":
      return `${eyeb(b)}<div class="ln quoteln">${wrapWords(b.quote)}</div><div class="sub attrib">${b.attrib}</div>`;

    case "stat":
      return `${eyeb(b)}
        <div class="statwrap">
          ${b.kicker ? `<div class="kicker">${b.kicker}</div>` : ""}
          <div class="num ${b.ph ? "ph" : ""}">${numStart(b)}</div>
          <div class="unit">${b.unit || ""}</div>
        </div>${sub(b.sub)}`;

    case "photos": {
      const tiles = Array.from({ length: b.n || 3 }, () =>
        `<div class="tile"><div class="tinner"><div class="slotlab">PHOTO</div></div></div>`).join("");
      return `${eyeb(b)}<div class="strip">${tiles}</div>${sub(b.caption)}`;
    }

    case "speakers": {
      const cards = b.cards.map(slug =>
        `<div class="spkcard"><img src="assets/speakers/${slug}.jpg" alt="" /></div>`).join("");
      return `${eyeb(b)}<div class="spkrow">${cards}</div>`;
    }

    case "sponsor": {
      const logos = b.logos.map(l =>
        `<div class="logo"><div class="logobox"><img src="assets/sponsors/${l.src}.png" alt="" style="max-width:${l.w}px${l.h ? `;max-height:${l.h}px` : ""}" /></div>
           ${l.role ? `<div class="logorole">${l.role}</div>` : ""}</div>`).join("");
      return `${eyeb(b)}<div class="logorow">${logos}</div>${sub(b.caption)}`;
    }

    case "agenda": {
      const rows = b.rows.map(r =>
        `<div class="agrow"><span class="agt">${r.t}</span><span class="agl">${r.label}</span></div>`).join("");
      return `${eyeb(b)}<div class="agenda">${rows}</div>${sub(b.caption)}`;
    }

    case "tracks": {
      const rows = b.rows.map(r =>
        `<div class="trow"><span class="tarr">&rsaquo;</span><span class="tlabel">${r}</span></div>`).join("");
      return `${eyeb(b)}<div class="tracks">${rows}</div>${sub(b.caption)}`;
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
  scenesHTML.push(
`      <section id="${s}" class="scene clip" data-start="${+start.toFixed(3)}" data-duration="${win}" data-track-index="${track}">
        <div class="inner">
        ${sceneBody(b)}
        </div>
      </section>`);

  const S = n => +(start + n).toFixed(3);
  tj.push(`      // ${s} · ${b.type}  (${b.dur}s)`);
  if (!first) tj.push(`      streak(${S(0)});`);

  // ---- entrance ----
  if (b.eyebrow) tj.push(`      drop("#${s} .eyebrow", ${S(0.15)});`);
  if (["welcome", "tagline", "hero", "septease"].includes(b.type)) {
    tj.push(`      words("#${s} .ln .wd", ${S(0.30)});`);
  } else if (b.type === "quote") {
    tj.push(`      words("#${s} .quoteln .wd", ${S(0.30)});`);
    tj.push(`      drop("#${s} .attrib", ${S(1.05)});`);
  } else if (b.type === "stat") {
    tj.push(`      drop("#${s} .kicker", ${S(0.35)});`);
    tj.push(`      pop("#${s} .num", ${S(0.50)});`);
    if (!b.ph && /^\d+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.55)}, ${b.num}, 1.0, 0);`);
    else if (!b.ph && /^(\d+)K\+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.55)}, ${b.num.replace(/K\+$/, "")}, 1.1, "K+");`);
    tj.push(`      drop("#${s} .unit", ${S(0.85)});`);
  } else if (b.type === "photos") {
    tj.push(`      riseZ("#${s} .tile", ${S(0.35)}, 0.12);`);
    tj.push(`      drift("#${s} .tile", ${S(1.6)});`);
  } else if (b.type === "speakers") {
    tj.push(`      flip3d("#${s} .spkcard", ${S(0.35)}, 0.10);`);
    tj.push(`      drift("#${s} .spkcard", ${S(1.9)});`);
  } else if (b.type === "sponsor") {
    tj.push(`      glowIn("#${s} .logo", ${S(0.40)}, 0.16);`);
  } else if (b.type === "agenda") {
    tj.push(`      slideX("#${s} .agrow", ${S(0.40)}, 0.14);`);
  } else if (b.type === "tracks") {
    tj.push(`      slideX("#${s} .trow", ${S(0.40)}, 0.16);`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.25)});`);
  }
  if (b.sub || b.caption) tj.push(`      drop("#${s} .sub", ${S(b.type === "quote" ? 1.05 : 0.95)});`);

  // ---- exit ----
  if (last) tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 0.7)});`);
  else if (b.dollyOut) tj.push(`      dollyOut("#${s} .inner", ${S(b.dur - 0.5)});`);
  else tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.33)});`);
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
    <title>AIS LIVE — Doors-Open Loop (${Math.round(D)}s)</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root{
        --onyx:#07121c; --blue:#37bdf8; --coral:#ff8a5c; --red-live:#ff3b30;
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
      .glow.coral{bottom:-220px;right:-140px;width:620px;height:620px;background:var(--coral);filter:blur(165px);opacity:.11;}
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
        gap:34px;padding:96px 120px;text-align:center;transform-style:preserve-3d;will-change:transform,opacity;}

      .eyebrow{font-family:var(--font-mono);font-weight:700;font-size:27px;letter-spacing:.34em;text-transform:uppercase;
        color:var(--blue);display:inline-flex;align-items:center;gap:13px;text-shadow:0 0 16px rgba(55,189,248,.45);}
      .eyebrow::before{content:"";width:9px;height:9px;border-radius:2px;background:currentColor;box-shadow:0 0 12px currentColor;}
      .eyebrow.coral{color:var(--coral);text-shadow:0 0 16px rgba(255,138,92,.45);}

      .ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:122px;line-height:1.16;
        letter-spacing:-.03em;max-width:1600px;}
      .ln.hero{font-size:176px;}
      /* background-clip:text only paints inside each word's box — italic 900 ascenders/
         descenders/right-overhang fall OUTSIDE a tight box and render transparent (looks cut).
         Generous padding (esp. bottom) grows the background box to fully contain the glyph;
         the side padding also supplies the inter-word gap. */
      .ln .wd{display:inline-block;padding:.08em .13em .24em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}
      .ln .wd.aco{background:linear-gradient(180deg,#ffdcc0 0%,#ff8a5c 56%,#e5673a 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(255,138,92,.58);}
      .ln.quoteln{font-size:78px;line-height:1.28;max-width:1500px;}
      .quoteln{position:relative;}
      .quoteln::before{content:"\\201C";color:var(--blue);margin-right:.04em;}
      .quoteln::after{content:"\\201D";color:var(--blue);margin-left:.04em;}

      .sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:41px;line-height:1.25;
        color:rgba(209,220,232,.85);max-width:1440px;will-change:transform,opacity;}
      .attrib{font-style:normal;font-family:var(--font-mono);font-weight:500;font-size:27px;letter-spacing:.06em;color:rgba(180,214,238,.82);}

      /* stat */
      .statwrap{display:flex;flex-direction:column;align-items:center;gap:2px;}
      .kicker{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.30em;text-transform:uppercase;color:#fff;}
      .num{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:320px;line-height:1.0;
        letter-spacing:-.04em;padding:.06em .13em .18em;will-change:transform,opacity;
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 90px rgba(55,189,248,.6);}
      .num.ph{opacity:.5;}
      .unit{font-family:var(--font-mono);font-weight:700;font-size:28px;letter-spacing:.30em;text-transform:uppercase;color:var(--blue);}

      /* photos */
      .strip{display:flex;gap:30px;justify-content:center;transform-style:preserve-3d;}
      .tile{width:434px;height:560px;will-change:transform,opacity;transform-style:preserve-3d;}
      .tinner{width:100%;height:100%;border-radius:20px;overflow:hidden;position:relative;
        border:2px dashed rgba(55,189,248,.5);
        background:repeating-linear-gradient(135deg,rgba(55,189,248,.05) 0 22px,rgba(6,12,20,.35) 22px 44px);
        display:flex;align-items:center;justify-content:center;box-shadow:0 34px 80px rgba(0,0,0,.48);}
      .slotlab{font-family:var(--font-mono);font-weight:700;font-size:19px;letter-spacing:.22em;color:rgba(180,214,238,.7);}

      /* speakers — real 4:5 branded speaker cards */
      .spkrow{display:flex;gap:30px;justify-content:center;transform-style:preserve-3d;}
      .spkcard{width:396px;height:495px;border-radius:20px;overflow:hidden;will-change:transform,opacity;
        transform-style:preserve-3d;box-shadow:0 34px 80px rgba(0,0,0,.5);
        border:1px solid rgba(55,189,248,.22);}
      .spkcard img{width:100%;height:100%;object-fit:cover;display:block;}

      /* sponsor — real logos (white on transparent) */
      .logorow{display:flex;gap:110px;justify-content:center;align-items:flex-start;}
      .logo{display:flex;flex-direction:column;align-items:center;gap:44px;will-change:transform,opacity;}
      .logobox{height:140px;display:flex;align-items:center;justify-content:center;}
      .logo img{width:auto;height:auto;max-height:140px;object-fit:contain;display:block;filter:drop-shadow(0 0 36px rgba(55,189,248,.28));}
      .logorole{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.24em;text-transform:uppercase;color:var(--blue);text-shadow:0 0 14px rgba(55,189,248,.4);}

      /* agenda — block shrinks to content and is centered by the flex column, so the
         rows and the eyebrow/sub share one visual center (no left-dump). */
      .agenda{display:flex;flex-direction:column;gap:22px;width:max-content;max-width:1240px;}
      .agrow{display:flex;align-items:center;gap:28px;font-family:var(--font-body);font-weight:700;font-size:50px;color:#fff;text-align:left;will-change:transform,opacity;}
      .agt{font-family:var(--font-mono);font-weight:700;font-size:24px;color:var(--coral);min-width:124px;letter-spacing:.06em;}

      /* tracks — "what you'll leave with" */
      .tracks{display:flex;flex-direction:column;gap:26px;width:max-content;max-width:1360px;}
      .trow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-display);font-style:italic;font-weight:900;font-size:60px;letter-spacing:-.02em;color:#fff;text-align:left;will-change:transform,opacity;}
      .tarr{font-style:normal;font-weight:900;color:var(--coral);text-shadow:0 0 22px rgba(255,138,92,.55);}

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
    <div id="stage" data-composition-id="cmp-doors-open-loop" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        <div class="depth grid-ceiling"></div>
        <div class="depth grid-floor"></div>
        <div class="beam"></div>
        <div class="glow blue"></div>
        <div class="glow coral"></div>
        <div class="vignette"></div>
        <div class="grain"></div>
      </div>
      <div class="whip clip" id="whip" data-start="0" data-duration="${D}" data-track-index="1"></div>
      <div id="markbug" class="clip" data-start="0" data-duration="${D}" data-track-index="2">
        <div class="backdrop-mark"><span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>
      </div>

      <div id="camera">
${scenesHTML.join("\n")}
      </div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const D = ${D};
      const tl = gsap.timeline({ paused: true });

      /* ---- reveal / transition helpers (all fromTo so nothing is left invisible) ---- */
      function drop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:d||.5,ease:"power2.out"},at); }
      // transform+opacity only — NO filter on text (a filter region clips italic edges + glow)
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.55,ease:"expo.out",stagger:.075,transformOrigin:"50% 100%"},at); }
      function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%"},at); }
      function riseZ(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,z:-320,y:70,rotationX:14,filter:"blur(8px)"},
        {autoAlpha:1,z:0,y:0,rotationX:0,filter:"blur(0px)",duration:.75,ease:"power3.out",stagger:step||.1},at); }
      function flip3d(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,rotationY:78,z:-140,transformOrigin:"50% 50%"},
        {autoAlpha:1,rotationY:0,z:0,duration:.72,ease:"power3.out",stagger:step||.1},at); }
      function glowIn(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,scale:.7,filter:"brightness(2.4) blur(6px)"},
        {autoAlpha:1,scale:1,filter:"brightness(1) blur(0px)",duration:.7,ease:"back.out(1.4)",stagger:step||.12},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      function drift(sel, at){ tl.to(sel,{y:"-=14",duration:2.4,yoyo:true,repeat:1,ease:"sine.inOut",stagger:{each:.25,from:"center"}},at); }
      function whipOut(sel, at){ tl.to(sel,{autoAlpha:0,y:-130,filter:"blur(26px)",duration:.33,ease:"power2.in"},at); }
      function dollyOut(sel, at){ tl.to(sel,{autoAlpha:0,scale:5.2,filter:"blur(22px)",duration:.5,ease:"power2.in",transformOrigin:"50% 50%"},at); }
      function settleOut(sel, at){ tl.to(sel,{autoAlpha:0,filter:"blur(12px)",duration:.6,ease:"power2.in"},at); }
      function streak(at){
        tl.fromTo("#whip",{xPercent:-130,scaleX:.5,autoAlpha:0},{autoAlpha:.95,duration:.1,ease:"none",immediateRender:false,overwrite:"auto"},at-0.05);
        tl.to("#whip",{xPercent:270,scaleX:1.7,autoAlpha:0,duration:.34,ease:"power3.in",overwrite:"auto"},at+0.02);
      }
      function countUp(sel, at, target, dur, suffix){
        var o={v:0};
        tl.call(function(){var el=document.querySelector(sel); if(el) el.textContent="0"+(suffix||"");}, null, at-0.001);
        tl.to(o,{v:target,duration:dur,ease:"power2.out",onUpdate:function(){
          var el=document.querySelector(sel); if(el) el.textContent=Math.round(o.v)+(suffix||"");}},at);
      }

      /* ---- AMBIENT — camera never sleeps; phase-locked so it tiles at the loop ---- */
      tl.to("#camera", { scale:1.035, y:-16, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=660px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=660px", duration:D, ease:"none" }, 0);
      tl.to(".beam",     { rotation:8, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/8, yoyo:true, repeat:7, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:44, y:-24, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".glow.coral",{ x:-36, y:22, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/8, yoyo:true, repeat:7, ease:"sine.inOut" }, 0);
      // live-dot pulse — the only ambient motion on the SOLID mark (brand)
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(D / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(D / 1.6) - 1}, ease:"none" }, 0);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // Law #11 — fill the slot
      window.__timelines["cmp-doors-open-loop"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(SRC, "doors-open-loop.html"), html);
console.log(`wrote cards/doors-open-loop.html — ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min)`);
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "doors-open-loop.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/doors-open-loop.html");
}
