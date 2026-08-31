// AIS LIVE — Block 2: WORKSHOP BLOCK 1 FILL (main stage, 12:45-2:00 CT, Day 1).
// Brief: 15-20 min build that loops ~4-5x across the 75-min window while workshops
// run in the rooms. Program (per production direction), assembled in order:
//   1. DIRECTING   — workshops are live; how to pick + join your room (Foundation vs Advanced)
//   2. AIS+        — membership ad (every workshop template is saved for members)
//   3. TESTIMONIAL — community reels (#4 building / #5 earning)
//   4. SPONSORS    — HyperAgent 60s spot (drop-in) + Glaido (Clay removed per Aidan 2026-07-07)
//   5. EXPO        — expo + networking prompt
//   6. loop seam
//
// The build is TWO rotations (pass A / pass B) of that sequence with varied copy,
// alternating testimonial reels, and an alternating "what's next" block — so
// back-to-back loops don't read identical. ~13.2 min as-is; ~14.9 min once the
// HyperAgent 60s spot lands in assets/video/hyperagent-60.mp4 (re-run this script,
// timings recompute automatically).
//
// Engine forked from ais-live-loops/_gen-doors-loop.mjs (command-deck style:
// depth grid tunnel, beam, chrome type, whip cuts, breathing vignette, grain,
// solid AIS/LIVE mark w/ live dot). New beat types here:
//   worksplit — the two-room directing card (Foundation vs Advanced), long signage holds
//   mount     — a finished rendered mp4 mounted full-screen (poster/lastframe bracketed,
//               muted <video> + sibling <audio> when the piece carries voice)
//
// AUDIO: mounted pieces (AIS+ ad, testimonial reels, HyperAgent spot) keep their
// voice audio; every authored card is silent — venue runs the music bed underneath.
//
//   node _gen.mjs         -> writes cards/wb1-fill-loop.html
//   node _gen.mjs --set   -> also copies it to index.html (active for preview/render)

import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

// ---------------------------------------------------------------------------
// MOUNTED VIDEO PIECES — probed at gen time so re-rendered reels stay exact.
// Durations floor-snapped to the 30fps frame grid.
// ---------------------------------------------------------------------------
const probe = f => {
  const d = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${join(DIR, "assets/video", f)}"`).toString().trim();
  return Math.floor(d * 30) / 30;
};
const MOUNT_HOLD = 0.4; // lastframe hold at the tail so the exit whip rides a real frame
const VID = {
  membership: { file: "ais-plus-membership", dur: probe("ais-plus-membership.mp4"), audio: true },
  building:   { file: "testi-building",      dur: probe("testi-building.mp4"),      audio: true },
  earning:    { file: "testi-earning",       dur: probe("testi-earning.mp4"),       audio: true },
};
// HyperAgent's 60s sponsor spot is sponsor-provided. Drop it at
// assets/video/hyperagent-60.mp4 (+ re-run _gen.mjs) and it mounts in both passes.
// Until then the slot renders as a finished-looking HyperAgent logo beat instead
// (never a dashed placeholder — this loops on the main stage).
const H60 = existsSync(join(DIR, "assets/video/hyperagent-60.mp4"))
  ? { file: "hyperagent-60", dur: probe("hyperagent-60.mp4"), audio: true }
  : null;

// ---------------------------------------------------------------------------
// WORKSHOP BLOCK 1 — Agenda v7.1 (doc 1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18)
// ---------------------------------------------------------------------------
// all-blue accents per the live-asset directives (DESIGN.md) — no track color-coding
const WB1 = [
  { lab: "FOUNDATION", title: "Your First 30 Days in AI Automation", spk: "Liberty White" },
  { lab: "ADVANCED",   title: "Low-Code to Full-Code",               spk: "Dave Ebbelaar" },
];
const WB2 = [
  { lab: "FOUNDATION", title: "Build Your First AI Content Engine", spk: "Sabrina Ramonov" },
  { lab: "ADVANCED",   title: "Build a Voice AI Sales Rep",          spk: "Samin Yasar" },
];
const AFTERNOON = [
  { t: "2:00p", label: "Lunch + Practice + VIP Working Sessions" },
  { t: "2:35p", label: "Featured: Run an Agency with Claude Code" },
  { t: "3:10p", label: "Workshop Block 2 (Foundation + Advanced)" },
  { t: "4:20p", label: "Workshop 3: Enterprise AI Services" },
  { t: "5:05p", label: "Get AIS+ Certified" },
  { t: "5:20p", label: "Day 1 Closing Remarks" },
];

// verified member quotes (testimonial-soundbites shortlist, face-checked set used in #1)
const QUOTES = [
  { eyebrow: "FROM THE COMMUNITY",    quote: "In six weeks I landed two contracts worth nearly $20,000. And the sky's the limit.", attrib: "Amy Simpson" },
  { eyebrow: "MEMBER WIN",            quote: "Every client came to me. I never sent a single cold DM.",                            attrib: "Abdurrahman Ibrahim" },
  { eyebrow: "FROM LAID OFF TO HIRED",quote: "In a month and a half, I went from being laid off to having a job.",                 attrib: "Griffin Maklansky" },
  { eyebrow: "MEMBER WIN",            quote: "Six months of engineering work, compressed into one afternoon.",                     attrib: "Duy Nguyen" },
];

// ---------------------------------------------------------------------------
// BEAT PROGRAM — two varied rotations of: directing -> AIS+ -> testimonials ->
// sponsors -> expo/networking -> what's next -> community proof -> reset.
// ---------------------------------------------------------------------------
function pass(n) {
  const A = n === 0;
  return [
    // ---- 1 · DIRECTING — workshops are live, pick + join your room ----
    { type: "hero", dur: 5, eyebrow: "WORKSHOP BLOCK 1 · LIVE NOW",
      ...(A ? { pre: "Workshops are ", accent: "live." } : { pre: "Two rooms, ", accent: "running now." }) },
    { type: "worksplit", dur: 48, time: "12:45", tag: "WORKSHOP BLOCK 1 · UNTIL 2:00 CT · PICK YOUR ROOM",
      tracks: WB1, sub: "Two rooms, same time. Pick where you are." },
    { type: "tagline", dur: 9, eyebrow: "HOW TO PICK", pre: "New to automation? ", accent: "Foundation.",
      sub: "Liberty White, Your First 30 Days in AI Automation" },
    { type: "tagline", dur: 9, eyebrow: "HOW TO PICK", pre: "Already shipping builds? ", accent: "Advanced.",
      sub: "Dave Ebbelaar, Low-Code to Full-Code" },
    { type: "action", dur: 8, eyebrow: "RIGHT NOW",
      ...(A ? { pre: "Join your room ", accent: "now.", sub: "Rooms are open. Jump in any time." }
            : { pre: "It's not too late ", accent: "to join.", sub: "Drop into either room mid-session." }) },
    { type: "worksplit", dur: 36, time: "12:45", tag: "WORKSHOP BLOCK 1 · UNTIL 2:00 CT · PICK YOUR ROOM",
      tracks: WB1, sub: A ? "You can't pick wrong. Both rooms build live." : "Both rooms run until 2:00 Central." },

    // ---- 2 · AIS+ MEMBERSHIP ----
    { type: "tagline", dur: 9, eyebrow: "AIS+ MEMBERS", pre: "Every workshop template is ", accent: "saved for members.",
      sub: "Build along today, keep the templates forever." },
    { type: "mount", video: VID.membership, dur: +(VID.membership.dur + MOUNT_HOLD).toFixed(3) },

    // ---- 3 · COMMUNITY TESTIMONIALS (alternating reel per pass) ----
    { type: "hero", dur: 5, eyebrow: "FROM THE COMMUNITY",
      ...(A ? { pre: "Real members. ", accent: "Real numbers." } : { pre: "Real builds. ", accent: "Real paydays." }) },
    { type: "mount", video: A ? VID.building : VID.earning, dur: +((A ? VID.building : VID.earning).dur + MOUNT_HOLD).toFixed(3) },

    // ---- 4 · SPONSOR REEL — HyperAgent 60s + Glaido ----
    { type: "hero", dur: 5, eyebrow: "THANK YOU", pre: "The sponsors ", accent: "behind AIS LIVE." },
    ...(H60
      ? [{ type: "mount", video: H60, dur: +(H60.dur + MOUNT_HOLD).toFixed(3) }]
      : [{ type: "sponsor", dur: 10, eyebrow: "OUR SPONSORS", logos: [{ src: "hyperagent-white-big", hgt: 130, role: "PRESENTING SPONSOR" }] }]),
    { type: "sponsor", dur: 10, eyebrow: "OUR SPONSORS", logos: [{ src: "glaido-white", hgt: 150, role: "SPONSOR" }] },

    // ---- 5 · EXPO + NETWORKING ----
    { type: "action", dur: 9, eyebrow: "BETWEEN SESSIONS", pre: "Visit the ", accent: "Expo.",
      sub: "Sponsor booths are open all block." },
    { type: "action", dur: 9, eyebrow: "BETWEEN SESSIONS", pre: "Jump into ", accent: "Networking.",
      sub: "Meet the people you'll build with." },
    { type: "tagline", dur: 9,
      ...(A ? { pre: "Not in a room? ", accent: "Work the floor.", sub: "Expo + networking run until 2:00 CT." }
            : { pre: "Make one connection ", accent: "before 2:00.", sub: "That's the whole assignment." }) },

    // ---- what's next (alternates: afternoon agenda / WB2 tease) ----
    { type: "hero", dur: 5, eyebrow: "COMING UP", pre: "After this ", accent: "block." },
    ...(A
      ? [{ type: "agenda", dur: 16, eyebrow: "DAY 1 · THIS AFTERNOON", rows: AFTERNOON, caption: "All times Central" }]
      : [{ type: "worksplit", dur: 24, time: "3:10", tag: "WORKSHOP BLOCK 2 · THIS AFTERNOON",
           tracks: WB2, sub: "Same two rooms. Round two." }]),

    // ---- community proof + reset (loop seam back to directing) ----
    { type: "stat", dur: 7, ...(A
      ? { kicker: "MEMBERS WORLDWIDE",  num: "400K+", unit: "BUILDERS STRONG",     sub: "One community. Every timezone." }
      : { kicker: "SHIPPED BY THE COMMUNITY", num: "100K+", unit: "AUTOMATIONS SHIPPED", sub: "Real workflows. Real businesses." }) },
    { type: "stat", dur: 7, ...(A
      ? { kicker: "THE ROOM IS PACKED", num: "1300+", unit: "PEOPLE GOING",        sub: "Two days, together in the room." }
      : { kicker: "THE WORLD IS WATCHING", num: "40M+", unit: "VIEWS & COUNTING",  sub: "They watch. We build." }) },
    { type: "quote", dur: 8, ...QUOTES[A ? 0 : 1] },
    { type: "quote", dur: 8, ...QUOTES[A ? 2 : 3] },
    { type: "tagline", dur: 8, pre: "Workshops run until ", accent: "2:00 CT.",
      sub: "Foundation or Advanced. Pick your room." },
    { type: "markflash", dur: 8, sub: "Day 1 · Workshop Block 1" },
  ];
}
const BEATS = [...pass(0), ...pass(1)];

// pad up to the next 1.6s beat (seamless ambient tiling) — extra hold on the last beat.
const contentSum = BEATS.reduce((s, b) => s + b.dur, 0);
const TOTAL = Math.ceil(contentSum / 1.6) * 1.6;
BEATS[BEATS.length - 1].dur += +(TOTAL - contentSum).toFixed(3);

// ---------------------------------------------------------------------------
// scene HTML renderers
// ---------------------------------------------------------------------------
const wrapWords = (str, cls) => str.trim().split(/\s+/)
  .map(w => `<span class="wd ${cls || ""}">${w}</span>`).join("");

function headline(b, heroForce) {
  const pre = b.pre ? wrapWords(b.pre) : "";
  const ac = b.accent ? wrapWords(b.accent, "ac") : ""; // accents are always brand blue (directives)
  const hero = heroForce || b.type === "hero" || b.hero;
  return `<div class="ln${hero ? " hero" : ""}">${pre}${ac}</div>`;
}
const eyeb = b => b.eyebrow ? `<div class="eyebrow">${b.eyebrow}</div>` : "";
const eyebTxt = t => t ? `<div class="eyebrow">${t}</div>` : "";
const sub = t => t ? `<div class="sub">${t}</div>` : "";

function numStart(b) {
  if (/^\d+$/.test(b.num)) return "0";
  if (/^\d+K\+$/.test(b.num)) return "0K+";
  if (/^\d+M\+$/.test(b.num)) return "0M+";
  if (/^\d+\+$/.test(b.num)) return "0+";
  return b.num;
}

function sceneBody(b) {
  switch (b.type) {
    case "welcome": case "tagline": case "hero": case "action":
      return `${eyeb(b)}${headline(b)}${sub(b.sub)}`;

    case "quote":
      return `${eyeb(b)}<div class="ln quoteln">${wrapWords(b.quote)}</div><div class="sub attrib">${b.attrib}</div>`;

    case "stat":
      return `${eyeb(b)}
        <div class="statwrap">
          ${b.kicker ? `<div class="kicker">${b.kicker}</div>` : ""}
          <div class="num">${numStart(b)}</div>
          <div class="unit">${b.unit || ""}</div>
        </div>${sub(b.sub)}`;

    case "sponsor": {
      // explicit height so lockups render main-stage sized, not at natural px
      const logos = b.logos.map(l =>
        `<div class="logo"><div class="logobox"><img src="assets/sponsors/${l.src}.png" alt="" style="height:${l.hgt}px" /></div>${l.role ? `<div class="logorole">${l.role}</div>` : ""}</div>`).join("");
      return `${eyeb(b)}<div class="logorow">${logos}</div>${sub(b.caption)}`;
    }

    case "agenda": {
      const rows = b.rows.map(r =>
        `<div class="agrow"><span class="agt">${r.t}</span><span class="agl">${r.label}</span></div>`).join("");
      return `${eyeb(b)}<div class="agenda">${rows}</div>${sub(b.caption)}`;
    }

    case "worksplit": {
      const cards = b.tracks.map((tr, i) => `
          <div class="wscard ${i === 0 ? "wleft" : "wright"}">
            <div class="wstrack">${tr.lab}</div>
            <div class="wstitle">${tr.title}</div>
            <div class="wsspk">${tr.spk}</div>
          </div>`).join("");
      return `${eyebTxt(b.tag)}
        <div class="time">${b.time}</div>
        <div class="wsrow">${cards}</div>${sub(b.sub)}`;
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
const rootHTML = [];  // mounted video stages (outside #camera — stay pin-sharp)
const audioHTML = []; // voice audio siblings for mounted pieces
const tj = [];
let mountN = 0;

BEATS.forEach((b, idx) => {
  const start = t, s = `sc${idx}`, track = 12 + idx;
  const win = +(b.dur + OVERLAP).toFixed(3);
  const first = idx === 0, last = idx === BEATS.length - 1;
  const S = n => +(start + n).toFixed(3);

  // ---- MOUNTED PIECE — finished mp4 full-screen, poster/lastframe bracketed ----
  if (b.type === "mount") {
    const v = b.video, m = `mnt${mountN++}`;
    rootHTML.push(
`      <div id="${m}" class="mount">
        <img id="${m}-poster" class="mfill" src="assets/video/${v.file}-poster.jpg" alt="" />
        <video id="${m}-v" class="mfill" muted playsinline data-has-audio="false" src="assets/video/${v.file}.mp4" data-start="${S(0)}" data-duration="${v.dur}" data-track-index="${200 + mountN}"></video>
        <img id="${m}-last" class="mfill" src="assets/video/${v.file}-lastframe.jpg" alt="" />
      </div>`);
    if (v.audio) {
      audioHTML.push(`      <audio id="${m}-a" src="assets/video/${v.file}.mp4" data-start="${S(0)}" data-duration="${v.dur}" data-track-index="${250 + mountN}" data-volume="1"></audio>`);
    }
    tj.push(`      // ${s} · mount ${v.file}  (${b.dur}s${v.audio ? ", voice audio" : ""})`);
    tj.push(`      streak(${S(0)});`);
    tj.push(`      tl.set("#${m}", { autoAlpha: 0 }, 0);`);
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 0 }, 0);`);
    tj.push(`      mountIn("#${m}", ${S(0)});`);
    tj.push(`      tl.set("#${m}-poster", { autoAlpha: 0 }, ${S(0.2)});`); // video is live by now
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 1 }, ${S(v.dur - 0.04)});`); // cover video end
    tj.push(`      whipOut("#${m}", ${S(b.dur - 0.30)});`);
    tj.push(`      tl.set("#${m}", { autoAlpha: 0 }, ${S(b.dur)});`);
    tj.push(``);
    t += b.dur;
    return;
  }

  scenesHTML.push(
`      <section id="${s}" class="scene clip" data-start="${+start.toFixed(3)}" data-duration="${win}" data-track-index="${track}">
        <div class="inner">
        ${sceneBody(b)}
        </div>
      </section>`);

  tj.push(`      // ${s} · ${b.type}  (${b.dur}s)`);
  if (!first) tj.push(`      streak(${S(0)});`);

  // ---- entrance ----
  if (b.eyebrow || b.tag) tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
  if (["welcome", "tagline", "hero", "action"].includes(b.type)) {
    tj.push(`      words("#${s} .ln .wd", ${S(0.24)});`);
  } else if (b.type === "quote") {
    tj.push(`      words("#${s} .quoteln .wd", ${S(0.26)});`);
    tj.push(`      drop("#${s} .attrib", ${S(0.95)});`);
  } else if (b.type === "stat") {
    tj.push(`      drop("#${s} .kicker", ${S(0.28)});`);
    tj.push(`      pop("#${s} .num", ${S(0.42)});`);
    if (/^\d+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${b.num}, 0.9, 0);`);
    else if (/^(\d+)K\+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${b.num.replace(/K\+$/, "")}, 1.0, "K+");`);
    else if (/^(\d+)M\+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${b.num.replace(/M\+$/, "")}, 1.0, "M+");`);
    else if (/^(\d+)\+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${b.num.replace(/\+$/, "")}, 1.1, "+");`);
    tj.push(`      drop("#${s} .unit", ${S(0.78)});`);
  } else if (b.type === "sponsor") {
    tj.push(`      glowIn("#${s} .logo", ${S(0.34)}, 0.14);`);
  } else if (b.type === "agenda") {
    tj.push(`      slideX("#${s} .agrow", ${S(0.30)}, 0.07);`);
  } else if (b.type === "worksplit") {
    tj.push(`      pop("#${s} .time", ${S(0.22)}, .55);`);
    tj.push(`      slideFrom("#${s} .wleft", ${S(0.40)}, -70);`);
    tj.push(`      slideFrom("#${s} .wright", ${S(0.52)}, 70);`);
    tj.push(`      drift("#${s} .wscard", ${S(1.6)}, ${+((b.dur - 2.2) / 4.8).toFixed(2)});`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub || b.caption) tj.push(`      drop("#${s} .sub", ${S(b.type === "quote" ? 0.95 : b.type === "worksplit" ? 1.15 : 0.82)});`);

  // ---- exit ----
  if (last) tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 0.7)});`);
  else tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
  // hard kill at the clip boundary — non-linear seek must land on a clean autoAlpha:0
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
    <title>AIS LIVE — Workshop Block 1 Fill (${(D / 60).toFixed(1)} min loop)</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root{
        --onyx:#07121c; --blue:#37bdf8; --coral:#ff8a5c; --red-live:#ff3b30; /* coral = ambient bg glow only */
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
        filter:blur(7px);will-change:transform,opacity;z-index:30;}

      /* ---------- scene ---------- */
      .scene{display:flex;align-items:center;justify-content:center;transform-style:preserve-3d;}
      .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:34px;padding:96px 120px;text-align:center;transform-style:preserve-3d;will-change:transform,opacity;}

      .eyebrow{font-family:var(--font-mono);font-weight:700;font-size:27px;letter-spacing:.34em;text-transform:uppercase;
        color:var(--blue);display:inline-flex;align-items:center;gap:13px;text-shadow:0 0 16px rgba(55,189,248,.45);}
      /* no ::before marker chip, no coral variant — live-asset directives */

      .ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:122px;line-height:1.16;
        letter-spacing:-.03em;max-width:1600px;}
      .ln.hero{font-size:176px;}
      /* generous padding so italic-900 ascenders/descenders never clip out of the
         background-clip:text box; side padding supplies the inter-word gap */
      .ln .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}
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
        letter-spacing:-.04em;padding:.08em .14em .26em;will-change:transform,opacity;
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 90px rgba(55,189,248,.6);}
      .unit{font-family:var(--font-mono);font-weight:700;font-size:28px;letter-spacing:.30em;text-transform:uppercase;color:var(--blue);}

      /* sponsor logos (white on transparent) */
      .logorow{display:flex;gap:110px;justify-content:center;align-items:flex-start;}
      .logo{display:flex;flex-direction:column;align-items:center;gap:44px;will-change:transform,opacity;}
      .logobox{height:180px;display:flex;align-items:center;justify-content:center;}
      .logo img{width:auto;object-fit:contain;display:block;filter:drop-shadow(0 0 36px rgba(55,189,248,.28));}
      .logorole{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.24em;text-transform:uppercase;color:var(--blue);text-shadow:0 0 14px rgba(55,189,248,.4);}

      /* agenda */
      .agenda{display:flex;flex-direction:column;gap:15px;width:max-content;max-width:1680px;}
      .agrow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-body);font-weight:700;font-size:40px;color:#fff;text-align:left;will-change:transform,opacity;}
      .agt{font-family:var(--font-mono);font-weight:700;font-size:22px;color:var(--blue);min-width:112px;letter-spacing:.04em;}

      /* worksplit — the two-room directing card */
      .time{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:132px;line-height:1;
        letter-spacing:-.04em;padding:.06em .14em .2em;will-change:transform,opacity;
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 80px rgba(55,189,248,.55);}
      .wsrow{display:flex;gap:44px;justify-content:center;transform-style:preserve-3d;}
      .wscard{width:640px;min-height:300px;border-radius:22px;padding:44px 48px;text-align:left;
        display:flex;flex-direction:column;gap:18px;justify-content:center;will-change:transform,opacity;
        background:linear-gradient(180deg, rgba(9,20,32,0.92), rgba(6,14,22,0.94));
        border:1px solid rgba(255,255,255,.10);box-shadow:0 40px 100px rgba(0,0,0,.5);}
      .wstrack{font-family:var(--font-mono);font-weight:700;font-size:22px;letter-spacing:.30em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 14px rgba(55,189,248,.45);}
      /* no colored top strips, track labels stay blue — live-asset directives */
      .wstitle{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:48px;line-height:1.18;
        letter-spacing:-.02em;color:#fff;text-shadow:0 0 28px rgba(255,255,255,.18);padding-bottom:.08em;
        text-wrap:balance;hyphens:none;-webkit-hyphens:none;}
      .wsspk{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.06em;color:rgba(180,214,238,.9);}

      /* mounted finished pieces — full-frame, above the camera scenes */
      .mount{position:absolute;inset:0;background:#000;will-change:transform,opacity,filter;z-index:20;}
      .mfill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}

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
    <div id="stage" data-composition-id="cmp-wb1-fill" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
${rootHTML.join("\n")}
${audioHTML.join("\n")}
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const D = ${D};
      const tl = gsap.timeline({ paused: true });

      /* ---- reveal / transition helpers (all fromTo so nothing is left invisible) ---- */
      function drop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:d||.5,ease:"power2.out"},at); }
      // transform+opacity only — NO filter on text (a filter region clips italic edges + glow)
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%"},at); }
      function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%"},at); }
      function glowIn(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,scale:.7,filter:"brightness(2.4) blur(6px)"},
        {autoAlpha:1,scale:1,filter:"brightness(1) blur(0px)",duration:.7,ease:"back.out(1.4)",stagger:step||.12},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function slideFrom(sel, at, dx){ tl.fromTo(sel,{autoAlpha:0,x:dx,rotationY:dx<0?24:-24,z:-120},
        {autoAlpha:1,x:0,rotationY:0,z:0,duration:.65,ease:"power3.out"},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      // gentle float during long signage holds — cards only, never headline type
      function drift(sel, at, cycles){ tl.to(sel,{y:"-=12",duration:2.4,yoyo:true,repeat:Math.max(1,Math.round(cycles*2)-1),
        ease:"sine.inOut",stagger:{each:.25,from:"center"}},at); }
      function whipOut(sel, at){ tl.to(sel,{autoAlpha:0,y:-155,filter:"blur(30px)",duration:.26,ease:"power2.in"},at); }
      function settleOut(sel, at){ tl.to(sel,{autoAlpha:0,filter:"blur(12px)",duration:.6,ease:"power2.in"},at); }
      function mountIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:1.045,filter:"blur(14px)"},
        {autoAlpha:1,scale:1,filter:"blur(0px)",duration:.5,ease:"power2.out",transformOrigin:"50% 50%"},at); }
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
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(TOTAL / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(TOTAL / 1.6) - 1}, ease:"none" }, 0);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // Law #11 — fill the slot
      window.__timelines["cmp-wb1-fill"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(SRC, "wb1-fill-loop.html"), html);
console.log(`wrote cards/wb1-fill-loop.html — ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min)${H60 ? " · HyperAgent 60s spot MOUNTED" : " · HyperAgent 60s spot NOT present (logo beat in its slot)"}`);
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "wb1-fill-loop.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/wb1-fill-loop.html");
}
