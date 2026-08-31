// AIS LIVE — Day 1 Agenda Walkthrough (~3 min).
// A chronological rundown of EVERYTHING on Day 1 (Build Day, Sat July 11) with the
// exact times + speakers from the Full Agenda doc v7.1 (all times Central).
//
// Motion system: same house style as the doors-open loop (MOTION_PHILOSOPHY.md) —
//   DEPTH      perspective grid tunnel, light beam, breathing vignette, grain.
//   TYPE       chrome-gradient + halo italic headlines, word-by-word reveals.
//   CUTS       light-streak whip on every beat change (never a hard cut).
//   SIGNATURE  big gradient session times, concurrent-track split cards,
//              VIP 5-room row list, and a DAY PROGRESS RAIL along the bottom
//              that tracks from 9:00 AM -> 5:35 PM as the day advances.
// The AIS/LIVE mark stays SOLID (brand §3.2) — only headlines/times get gradients.
// Determinism: no Math.random / Date.now anywhere.
//
//   node _gen-agenda.mjs   -> writes index.html

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// DAY RAIL — maps a clock time to progress through the day (9:00a -> 5:35p CT)
// ---------------------------------------------------------------------------
const RAIL_W = 1200;
const DAY_START = 9 * 60;            // 9:00 AM
const DAY_END = 17 * 60 + 35;        // 5:35 PM (close ends)
const mins = t => {                  // "9:30 AM" -> minutes since midnight
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let h = +m[1] % 12; if (/pm/i.test(m[3])) h += 12;
  return h * 60 + +m[2];
};
const prog = t => +(((mins(t) - DAY_START) / (DAY_END - DAY_START))).toFixed(4);
const TICKS = [
  { lab: "9AM", t: "9:00 AM" }, { lab: "11AM", t: "11:00 AM" }, { lab: "1PM", t: "1:00 PM" },
  { lab: "3PM", t: "3:00 PM" }, { lab: "5PM", t: "5:00 PM" },
];

// ---------------------------------------------------------------------------
// BEAT PROGRAM — Day 1 v7.1, complete, in order. accent: blue=main stage /
// coral=sponsor+featured / yellow=foundation. `pre`/`accent` split the headline
// into chrome vs accent-gradient words.
// ---------------------------------------------------------------------------
const BEATS = [
  { type: "hero", dur: 9.5, eyebrow: "SATURDAY · JULY 11 · ALL TIMES CENTRAL",
    pre: "Day 1: ", accent: "Build Day.", sub: "Here's everything happening today." },

  { type: "session", dur: 7, time: "9:00 AM", tag: "NETWORKING · 30 MIN", accent: "blue",
    pre: "Doors Open + ", accentTxt: "Visit the Expo", spk: "Lobby + sponsor booths open" , spkDim: true },

  { type: "session", dur: 8.5, time: "9:30 AM", tag: "VIP EXCLUSIVE · 45 MIN", accent: "blue",
    pre: "VIP ", accentTxt: "Q&amp;A", post: " with Nate", spk: "Nate Herk" },

  { type: "session", dur: 8, time: "10:15 AM", tag: "MAIN STAGE · 15 MIN", accent: "blue",
    pre: "Welcome to ", accentTxt: "AIS LIVE", spk: "Nate Herk" },

  { type: "session", dur: 11, time: "10:30 AM", tag: "MAIN STAGE · PANEL · 55 MIN", accent: "blue",
    pre: "Anatomy of ", accentTxt: "Three Real Deals",
    spk: "Aidan Finnegan · Wyatt Lyonsmith · Glenn Marcus · Nate Herk" },

  { type: "session", dur: 7, time: "11:25 AM", tag: "LIVE DEBRIEF · 15 MIN", accent: "blue",
    pre: "Patterns from ", accentTxt: "Real Deals", spk: "Jon Morrow" },

  { type: "session", dur: 9.5, time: "11:40 AM", tag: "HYPERAGENT KEYNOTE · 20 MIN", accent: "blue",
    pre: "The New Standard: A Fleet of ", accentTxt: "Always-On Agents", spk: "Alex McDonnell",
    logo: { src: "hyperagent-white.png", w: 360 } },

  { type: "session", dur: 7, time: "12:00 PM", tag: "SPONSORED SESSION · 20 MIN", accent: "blue",
    logoHero: { src: "glaido-white.png", w: 680 }, spk: "Voice AI for client work, live demo", spkDim: true },

  { type: "session", dur: 8.5, time: "12:20 PM", tag: "MAIN STAGE · CO-BUILD · 25 MIN", accent: "blue",
    pre: "Evals, ", accentTxt: "Live", spk: "Nate Herk · Ednan Abdullayev" },

  { type: "worksplit", dur: 13, time: "12:45 PM", tag: "WORKSHOP BLOCK 1 · 75 MIN · PICK YOUR ROOM",
    tracks: [
      { lab: "FOUNDATION", ac: "yellow", title: "Your First 30 Days in AI Automation", spk: "Liberty White" },
      { lab: "ADVANCED", ac: "coral", title: "Low-Code to Full-Code", spk: "Dave Ebbelaar" },
    ], sub: "Two rooms, same time. Pick where you are." },

  { type: "session", dur: 6.5, time: "2:00 PM", tag: "LUNCH · 35 MIN", accent: "blue",
    pre: "Lunch + ", accentTxt: "Practice", spk: "Networking rooms + Expo open", spkDim: true },

  { type: "viprooms", dur: 15.5, time: "2:00 PM", tag: "VIP WORKING SESSIONS · 5 ROOMS · 35 MIN",
    rooms: [
      { title: "Land Your First Paying Client", spk: "Jon Morrow" },
      { title: "Turn Your Expertise Into a Service", spk: "Jenn Van Wagner" },
      { title: "Price It Right", spk: "Russ Henneberry" },
      { title: "Scope to Ship", spk: "Kodi Zene" },
      { title: "Tooling Reset", spk: "Meghan Cox" },
    ] },

  { type: "session", dur: 10, time: "2:35 PM", tag: "FEATURED SESSION · 25 MIN", accent: "blue",
    pre: "Run an Entire AI Agency Using ", accentTxt: "Claude Code", spk: "Kacper Rutkiewicz" },

  { type: "break", dur: 5, time: "3:00 PM", tag: "BREAK · 10 MIN",
    pre: "Break + ", accentTxt: "Visit the Expo" },

  { type: "worksplit", dur: 13, time: "3:10 PM", tag: "WORKSHOP BLOCK 2 · 60 MIN · PICK YOUR ROOM",
    tracks: [
      { lab: "FOUNDATION", ac: "yellow", title: "Build Your First AI Content Engine", spk: "Sabrina Ramonov" },
      { lab: "ADVANCED", ac: "coral", title: "Build a Voice AI Sales Rep", spk: "Samin Yasar" },
    ], sub: "Live builds, end to end, in both rooms." },

  { type: "break", dur: 5, time: "4:10 PM", tag: "BREAK · 10 MIN",
    pre: "Break + ", accentTxt: "Visit the Expo" },

  { type: "session", dur: 9, time: "4:20 PM", tag: "WORKSHOP BLOCK 3 · 45 MIN", accent: "blue",
    pre: "Enterprise ", accentTxt: "AI Services", spk: "Tangy Frederick" },

  { type: "session", dur: 8.5, time: "5:05 PM", tag: "MAIN STAGE · 15 MIN", accent: "blue",
    pre: "Get AIS+ ", accentTxt: "Certified", spk: "Ednan Abdullayev" },

  { type: "session", dur: 9.5, time: "5:20 PM", tag: "MAIN STAGE · CLOSE · 15 MIN", accent: "blue",
    pre: "Day 1 ", accentTxt: "Closing Remarks", spk: "Nate Herk",
    sub: "Plus the overnight challenge." },

  { type: "markflash", dur: 9, sub: "Day 1 · Build Day · See you in the room." },
];

// ---------------------------------------------------------------------------
// scene HTML renderers
// ---------------------------------------------------------------------------
const wrapWords = (str, cls) => str.trim().split(/\s+/)
  .map(w => `<span class="wd ${cls || ""}">${w}</span>`).join("");

function headline(b, hero) {
  const acCls = b.accent === "coral" ? "ac aco" : b.accent === "yellow" ? "ac acy" : "ac";
  const pre = b.pre ? wrapWords(b.pre) : "";
  const ac = b.accentTxt ? wrapWords(b.accentTxt, acCls) : (b.accent && !b.accentTxt && b.accentWords ? "" : "");
  const post = b.post ? wrapWords(b.post) : "";
  return `<div class="ln${hero ? " hero" : ""}">${pre}${ac}${post}</div>`;
}
const eyeb = txt => txt ? `<div class="eyebrow">${txt}</div>` : "";
const sub = t => t ? `<div class="sub">${t}</div>` : "";

// title font size scales with length so long session names never overflow
function lnSize(b) {
  const len = ((b.pre || "") + (b.accentTxt || "") + (b.post || "")).replace(/&\w+;/g, "?").length;
  return len <= 22 ? 122 : len <= 36 ? 104 : len <= 52 ? 86 : 70;
}

function sceneBody(b) {
  switch (b.type) {
    case "hero": {
      const acCls = "ac";
      return `${eyeb(b.eyebrow)}<div class="ln hero">${wrapWords(b.pre)}${wrapWords(b.accent, acCls)}</div>${sub(b.sub)}`;
    }

    case "session": case "break": {
      const spkLine = b.spk
        ? `<div class="spkline${b.spkDim ? " dim" : ""}">${b.spk}</div>` : "";
      const title = b.logoHero
        ? `<div class="slogo hero"><img src="assets/sponsors/${b.logoHero.src}" style="width:${b.logoHero.w}px" alt="" /></div>`
        : `<div style="font-size:${lnSize(b)}px" class="lnwrap">${headline(b)}</div>`;
      const logo = b.logo
        ? `<div class="slogo"><img src="assets/sponsors/${b.logo.src}" style="width:${b.logo.w}px" alt="" /></div>` : "";
      return `${eyeb(b.tag)}
        <div class="time ${b.accent || "blue"}">${b.time}</div>
        ${title}
        ${spkLine}${logo}${sub(b.sub)}`;
    }

    case "worksplit": {
      const cards = b.tracks.map((tr, i) => `
          <div class="wscard ${tr.ac} ${i === 0 ? "wleft" : "wright"}">
            <div class="wstrack">${tr.lab}</div>
            <div class="wstitle">${tr.title}</div>
            <div class="wsspk">${tr.spk}</div>
          </div>`).join("");
      return `${eyeb(b.tag)}
        <div class="time blue">${b.time}</div>
        <div class="wsrow">${cards}</div>${sub(b.sub)}`;
    }

    case "viprooms": {
      const rows = b.rooms.map(r =>
        `<div class="vrow"><span class="varr">&rsaquo;</span><span class="vtitle">${r.title}</span><span class="vname">${r.spk}</span></div>`).join("");
      return `${eyeb(b.tag)}
        <div class="time blue small">${b.time}</div>
        <div class="viplist">${rows}</div>`;
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

  tj.push(`      // ${s} · ${b.type}  (${b.dur}s)${b.time ? " · " + b.time : ""}`);
  if (!first) tj.push(`      streak(${S(0)});`);

  // ---- day rail advances to this beat's clock time ----
  if (b.time) tj.push(`      railTo(${prog(b.time)}, ${S(0.05)});`);
  if (last) tj.push(`      railTo(1, ${S(0.05)});`);

  // ---- entrance ----
  if (b.eyebrow || b.tag) tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
  if (b.type === "hero") {
    tj.push(`      words("#${s} .ln .wd", ${S(0.26)});`);
  } else if (b.type === "session" || b.type === "break") {
    tj.push(`      pop("#${s} .time", ${S(0.22)}, .55);`);
    if (b.logoHero) tj.push(`      glowIn("#${s} .slogo.hero", ${S(0.34)});`);
    else tj.push(`      words("#${s} .ln .wd", ${S(0.34)});`);
    if (b.spk) tj.push(`      drop("#${s} .spkline", ${S(0.72)});`);
    if (b.logo) tj.push(`      glowIn("#${s} .slogo:not(.hero)", ${S(0.95)});`);
  } else if (b.type === "worksplit") {
    tj.push(`      pop("#${s} .time", ${S(0.22)}, .55);`);
    tj.push(`      slideFrom("#${s} .wleft", ${S(0.40)}, -70);`);
    tj.push(`      slideFrom("#${s} .wright", ${S(0.52)}, 70);`);
    tj.push(`      drift("#${s} .wscard", ${S(1.6)}, ${+((b.dur - 2.2) / 4.8).toFixed(2)});`);
  } else if (b.type === "viprooms") {
    tj.push(`      pop("#${s} .time", ${S(0.22)}, .5);`);
    tj.push(`      slideX("#${s} .vrow", ${S(0.38)}, 0.18);`);
    tj.push(`      drift("#${s} .vrow", ${S(2.0)}, ${+((b.dur - 2.6) / 4.8).toFixed(2)});`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub) tj.push(`      drop("#${s} .sub", ${S(b.type === "worksplit" ? 1.15 : 0.88)});`);

  // ---- exit ----
  if (last) tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 0.7)});`);
  else tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
  // hard kill at the clip boundary — non-linear seek must land on clean autoAlpha:0
  if (!last) tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
  tj.push(``);

  t += b.dur;
});

const D = +t.toFixed(3);

const ticksHTML = TICKS.map(k =>
  `<div class="tick" style="left:${(prog(k.t) * RAIL_W).toFixed(1)}px"><i></i><span>${k.lab}</span></div>`).join("");

// ---------------------------------------------------------------------------
// assemble
// ---------------------------------------------------------------------------
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — Day 1 Agenda Walkthrough (${Math.round(D)}s)</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root{
        --onyx:#07121c; --blue:#37bdf8; --coral:#ff8a5c; --yellow:#f5d82a; --red-live:#ff3b30;
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
        gap:26px;padding:96px 120px 150px;text-align:center;transform-style:preserve-3d;will-change:transform,opacity;}

      .eyebrow{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.32em;text-transform:uppercase;
        color:var(--blue);display:inline-flex;align-items:center;text-shadow:0 0 16px rgba(55,189,248,.45);}

      /* big gradient session time */
      .time{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:150px;line-height:1;
        letter-spacing:-.04em;padding:.06em .14em .2em;will-change:transform,opacity;
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 80px rgba(55,189,248,.55);}
      .time.coral{background:linear-gradient(180deg,#ffdcc0 0%,#ff8a5c 56%,#e5673a 100%);
        -webkit-background-clip:text;background-clip:text;text-shadow:0 0 80px rgba(255,138,92,.5);}
      .time.small{font-size:110px;}

      .lnwrap{line-height:0;}
      .ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:1em;line-height:1.16;
        letter-spacing:-.03em;max-width:1640px;}
      .ln.hero{font-size:170px;}
      /* background-clip:text only paints inside each word's box — italic 900 overhang
         needs generous padding or glyph edges render transparent (looks cut). */
      .ln .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}
      .ln .wd.aco{background:linear-gradient(180deg,#ffdcc0 0%,#ff8a5c 56%,#e5673a 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(255,138,92,.58);}
      .ln .wd.acy{background:linear-gradient(180deg,#fdf2b0 0%,#f5d82a 56%,#cbb114 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(245,216,42,.5);}

      .spkline{font-family:var(--font-mono);font-weight:700;font-size:33px;letter-spacing:.08em;color:#fff;
        will-change:transform,opacity;max-width:1560px;}
      .spkline.dim{color:rgba(209,220,232,.78);font-weight:500;font-style:italic;font-family:var(--font-body);font-size:36px;letter-spacing:0;}

      .sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:39px;line-height:1.25;
        color:rgba(209,220,232,.85);max-width:1440px;will-change:transform,opacity;}

      /* sponsor logos — white marks with a soft blue halo */
      .slogo{display:flex;justify-content:center;will-change:transform,opacity;}
      .slogo img{display:block;filter:drop-shadow(0 0 36px rgba(55,189,248,.30));}
      .slogo.hero{padding:12px 0 6px;}

      /* concurrent workshop split cards */
      .wsrow{display:flex;gap:44px;justify-content:center;transform-style:preserve-3d;}
      .wscard{width:640px;min-height:300px;border-radius:22px;padding:44px 48px;text-align:left;
        display:flex;flex-direction:column;gap:18px;justify-content:center;will-change:transform,opacity;
        background:linear-gradient(180deg, rgba(9,20,32,0.92), rgba(6,14,22,0.94));
        border:1px solid rgba(255,255,255,.10);box-shadow:0 40px 100px rgba(0,0,0,.5);}
      .wstrack{font-family:var(--font-mono);font-weight:700;font-size:22px;letter-spacing:.30em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 14px rgba(55,189,248,.45);}
      .wstitle{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:48px;line-height:1.18;
        letter-spacing:-.02em;color:#fff;text-shadow:0 0 28px rgba(255,255,255,.18);padding-bottom:.08em;
        text-wrap:balance;hyphens:none;-webkit-hyphens:none;}
      .wsspk{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.06em;color:rgba(180,214,238,.9);}

      /* VIP 5-room list */
      .viplist{display:flex;flex-direction:column;gap:20px;width:max-content;max-width:1500px;}
      .vrow{display:flex;align-items:baseline;gap:24px;text-align:left;will-change:transform,opacity;}
      .varr{font-family:var(--font-display);font-weight:900;font-size:44px;color:var(--blue);
        text-shadow:0 0 22px rgba(55,189,248,.55);}
      .vtitle{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:52px;letter-spacing:-.02em;
        color:#fff;text-shadow:0 0 26px rgba(255,255,255,.16);white-space:nowrap;padding-right:.14em;}
      .vname{font-family:var(--font-mono);font-weight:700;font-size:27px;letter-spacing:.06em;color:var(--blue);
        text-shadow:0 0 14px rgba(55,189,248,.45);white-space:nowrap;}

      /* ---------- day progress rail ---------- */
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
      .tick span{position:absolute;top:24px;left:0;transform:translateX(-50%);
        font-family:var(--font-mono);font-weight:700;font-size:19px;letter-spacing:.18em;color:rgba(209,220,232,.55);}
      .raillab{position:absolute;top:-44px;right:0;white-space:nowrap;
        font-family:var(--font-mono);font-weight:700;font-size:19px;letter-spacing:.24em;color:rgba(209,220,232,.45);}

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
    <div id="stage" data-composition-id="cmp-day1-agenda" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
      <div id="rail" class="clip" data-start="0" data-duration="${D}" data-track-index="3">
        <div class="railwrap">
          <div class="railline"><div class="railfill" id="railfill"></div></div>
          <div class="railhead" id="railhead"></div>
          ${ticksHTML}
          <div class="raillab">ALL TIMES CT</div>
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

      /* ---- reveal / transition helpers (all fromTo so nothing is left invisible) ---- */
      function drop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:d||.5,ease:"power2.out"},at); }
      // transform+opacity only — NO filter on text (a filter region clips italic edges + glow)
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%"},at); }
      function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%"},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function slideFrom(sel, at, dx){ tl.fromTo(sel,{autoAlpha:0,x:dx,rotationY:dx<0?24:-24,z:-120},
        {autoAlpha:1,x:0,rotationY:0,z:0,duration:.65,ease:"power3.out"},at); }
      // gentle float during long holds — cards/rows only, never headline type
      function drift(sel, at, cycles){ tl.to(sel,{y:"-=12",duration:2.4,yoyo:true,repeat:Math.max(1,Math.round(cycles*2)-1),
        ease:"sine.inOut",stagger:{each:.25,from:"center"}},at); }
      function glowIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.7,filter:"brightness(2.4) blur(6px)"},
        {autoAlpha:1,scale:1,filter:"brightness(1) blur(0px)",duration:.7,ease:"back.out(1.4)"},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      function whipOut(sel, at){ tl.to(sel,{autoAlpha:0,y:-155,filter:"blur(30px)",duration:.26,ease:"power2.in"},at); }
      function settleOut(sel, at){ tl.to(sel,{autoAlpha:0,filter:"blur(12px)",duration:.6,ease:"power2.in"},at); }
      function streak(at){
        tl.fromTo("#whip",{xPercent:-130,scaleX:.5,autoAlpha:0},{autoAlpha:.95,duration:.1,ease:"none",immediateRender:false,overwrite:"auto"},at-0.05);
        tl.to("#whip",{xPercent:270,scaleX:1.7,autoAlpha:0,duration:.34,ease:"power3.in",overwrite:"auto"},at+0.02);
      }
      /* day rail — fill + head glide to the current session's clock position */
      function railTo(p, at){
        tl.to("#railfill",{scaleX:p,duration:.7,ease:"power2.inOut",overwrite:"auto"},at);
        tl.to("#railhead",{x:p*RAIL_W,duration:.7,ease:"power2.inOut",overwrite:"auto"},at);
      }

      /* ---- AMBIENT — the camera never sleeps ---- */
      tl.to("#camera", { scale:1.035, y:-16, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=660px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=660px", duration:D, ease:"none" }, 0);
      tl.to(".beam",     { rotation:8, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/8, yoyo:true, repeat:7, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:44, y:-24, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".glow.coral",{ x:-36, y:22, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/8, yoyo:true, repeat:7, ease:"sine.inOut" }, 0);
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(D / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(D / 1.6) - 1}, ease:"none" }, 0);
      drop(".railwrap", 0.35, .7);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // fill the slot
      window.__timelines["cmp-day1-agenda"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(DIR, "index.html"), html);
console.log(`wrote index.html — ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min)`);
