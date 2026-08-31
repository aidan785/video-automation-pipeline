// AIS LIVE — Block 4: END OF DAY 1 (lobby loop after Nate's close, ~5:45 PM Day 1).
// Brief: 4-5 min build that LOOPS on the lobby. Assembled in this order:
//   1. WRAP OPEN     — that's a wrap on Build Day
//   2. CERTIFICATION — AIS Certification Programme (Russ's #7 launch video mounts
//                      1:1 when it lands; until then a finished-looking authored
//                      segment fills the slot — never a dashed placeholder)
//   3. AIS+          — membership ad, mounted (66s, voice audio)
//   4. DAY 1 RECAP   — what we covered today (Agenda v7.1, verbatim)
//   5. OVERNIGHT     — challenge tease (generic — Nate set the specifics live)
//   6. TOMORROW      — see you tomorrow, Day 2 Earn Day, doors 8:30 AM card
//
// LOOP SEAM (doors-open-loop pattern): ends on a calm settling markflash, D padded
// up to the next 1.6s ambient beat so the live-dot pulse + yoyo cycles tile at the
// wrap; grid scroll is 1716px = 26 x 66px so it tiles too.
//
// AUDIO: mounted pieces (AIS+ ad, cert video when it lands) keep their voice audio;
// every authored card is silent — the lobby runs a music bed underneath.
//
//   node _gen.mjs         -> writes cards/day1-close-fill.html
//   node _gen.mjs --set   -> also copies it to index.html (active for preview/render)

import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

// ---------------------------------------------------------------------------
// MOUNTED VIDEO PIECES — probed at gen time so re-rendered pieces stay exact.
// Durations floor-snapped to the 30fps frame grid.
// ---------------------------------------------------------------------------
const probe = f => {
  const d = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${join(DIR, "assets/video", f)}"`).toString().trim();
  return Math.floor(d * 30) / 30;
};
const MOUNT_HOLD = 0.4; // lastframe hold at the tail so the exit whip rides a real frame
const VID = {
  membership: { file: "ais-plus-membership", dur: probe("ais-plus-membership.mp4"), audio: true },
};
// Russ's AIS Certification Programme launch video (#7) is not delivered yet
// (Drive folder 7 is empty as of 2026-07-08). Drop it at assets/video/cert-launch.mp4
// (+ poster/lastframe jpgs, + re-run _gen.mjs --set) and it mounts here, replacing
// the authored cert segment 1:1; total duration recomputes automatically.
const CERT = existsSync(join(DIR, "assets/video/cert-launch.mp4"))
  ? { file: "cert-launch", dur: probe("cert-launch.mp4"), audio: true }
  : null;

// ---------------------------------------------------------------------------
// DAY 1 RECAP — Agenda v7.1 (doc 1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18)
// session titles + times verbatim; all-blue accents per the live-asset directives
// ---------------------------------------------------------------------------
const RECAP = [
  { t: "10:15 AM", label: "Welcome to AIS LIVE" },
  { t: "10:30 AM", label: "Anatomy of Three Real Deals" },
  { t: "11:40 AM", label: "The New Standard: A Fleet of Always-On Agents" },
  { t: "12:20 PM", label: "Evals, Live" },
  { t: "12:45 PM", label: "Workshop Block 1 (Foundation + Advanced)" },
  { t: "2:35 PM",  label: "Run an Entire AI Agency Using Claude Code" },
  { t: "3:10 PM",  label: "Workshop Block 2 (Foundation + Advanced)" },
  { t: "4:20 PM",  label: "Workshop 3: Enterprise AI Services" },
  { t: "5:05 PM",  label: "Get AIS Certified" }, // "AIS Certified", NOT AIS+ (Aidan 2026-07-08)
  { t: "5:20 PM",  label: "Day 1 Closing Remarks" },
];

// verified member quotes (testimonial-soundbites shortlist, face-checked set used in #1)
const QUOTES = [
  { eyebrow: "FROM THE COMMUNITY",     quote: "In six weeks I landed two contracts worth nearly $20,000. And the sky's the limit.", attrib: "Amy Simpson" },
  { eyebrow: "MEMBER WIN",             quote: "Six months of engineering work, compressed into one afternoon.",                     attrib: "Duy Nguyen" },
  { eyebrow: "WHY WE'RE HERE",         quote: "I found my home. I found my tribe.",                                                 attrib: "Tonia Hardeman" },
];
// verified stats (same set as #1/Blocks 2-3), labels adapted to end-of-day tense
const STAT_ROOM    = { kicker: "TODAY AT AIS LIVE",         num: "1600+", unit: "BUILDERS IN THE ROOM",  sub: "Day 1, together." }; // 1600+ per Aidan 2026-07-11 (was 1300+)
const STAT_SHIPPED = { kicker: "SHIPPED BY THE COMMUNITY",  num: "100K+", unit: "AUTOMATIONS SHIPPED",   sub: "Real workflows. Real businesses." };

// ---------------------------------------------------------------------------
// BEAT PROGRAM — single sequence, loops. Order per production direction:
// wrap open -> certification -> AIS+ membership -> Day 1 recap -> overnight
// challenge tease -> see-you-tomorrow / doors 8:30 -> calm loop seam.
// ---------------------------------------------------------------------------
const CERT_SEGMENT = CERT
  ? [{ type: "mount", video: CERT, dur: +(CERT.dur + MOUNT_HOLD).toFixed(3) }]
  : [
      // PLACEHOLDER (Aidan 2026-07-08) — visibly-marked slot, NOT finished copy.
      // Real certification messaging comes from Russ's #7 launch video (or approved
      // cert copy). Do NOT ship the loop to the lobby with this placeholder in.
      { type: "slot", dur: 16, eyebrow: "AIS CERTIFICATION PROGRAMME",
        label: "CERT LAUNCH VIDEO", note: "[ TBC · drops in at assets/video/cert-launch.mp4 ]" },
    ];

const BEATS = [
  // ---- 1 · WRAP OPEN ----
  { type: "hero", dur: 6, eyebrow: "AIS LIVE · DAY 1 COMPLETE", pre: "That's a wrap on ", accent: "Build Day." },
  { type: "tagline", dur: 9, eyebrow: "SATURDAY · JULY 11", pre: "You showed up. ", accent: "You built.", sub: "Day 1 is in the books." },
  { type: "stat", dur: 7, ...STAT_ROOM },

  // ---- 2 · AIS CERTIFICATION ----
  { type: "tagline", dur: 8, eyebrow: "LAUNCHED TODAY · MAIN STAGE · 5:05 PM",
    pre: "Get AIS ", accent: "Certified.", sub: "The AIS Certification Programme, announced today at AIS LIVE" },
  ...CERT_SEGMENT,

  // ---- 3 · AIS+ MEMBERSHIP (mounted ad, voice audio) ----
  // lead-in copy deliberately differs from the ad's own opening line
  { type: "tagline", dur: 8, eyebrow: "AIS+ MEMBERS", pre: "Built all day? ", accent: "Get paid next.",
    sub: "One minute on what AIS+ unlocks." },
  { type: "mount", video: VID.membership, dur: +(VID.membership.dur + MOUNT_HOLD).toFixed(3) },

  // ---- 4 · DAY 1 RECAP ----
  { type: "hero", dur: 5, eyebrow: "DAY 1 · THE RECAP", pre: "Look at what we ", accent: "covered." },
  { type: "agenda", dur: 34, eyebrow: "TODAY AT AIS LIVE", rows: RECAP, caption: "Day 1 · Build Day · All times Central" },
  { type: "quote", dur: 8, ...QUOTES[1] },
  { type: "stat", dur: 7, ...STAT_SHIPPED },
  { type: "quote", dur: 8, ...QUOTES[0] },
  { type: "quote", dur: 8, ...QUOTES[2] },

  // ---- 5 · OVERNIGHT CHALLENGE TEASE (generic — Nate set the specifics live) ----
  { type: "hero", dur: 6, eyebrow: "TONIGHT", pre: "The overnight challenge ", accent: "is on." },
  { type: "tagline", dur: 9, pre: "Build tonight. ", accent: "Bring it tomorrow.",
    sub: "Nate set the challenge at the close. Tonight, you ship." },
  { type: "action", dur: 9, eyebrow: "OVERNIGHT CHALLENGE", pre: "What you ship tonight ", accent: "starts Day 2.",
    sub: "We want to see it tomorrow." },

  // ---- 6 · SEE YOU TOMORROW · DOORS 8:30 AM ----
  { type: "tagline", dur: 10, eyebrow: "TOMORROW · DAY 2 · EARN DAY",
    pre: "Build day is done. ", accent: "Now let's get paid.", sub: "Sunday, July 12. Day 2 is Earn Day." },
  { type: "stat", dur: 14, kicker: "DOORS OPEN TOMORROW", num: "8:30", unit: "AM CENTRAL · SUNDAY, JULY 12",
    sub: "Virtual doors and the expo open at 8:30 AM." },
  // calm loop seam — settles out, then the wrap lands on the open's entrance
  { type: "markflash", dur: 12, sub: "See you tomorrow. Doors open 8:30 AM Central." },
];

const sum = arr => arr.reduce((s, b) => s + b.dur, 0);
// pad up to the next 1.6s ambient beat (dot/ring cycle) so ambient tiles at the
// loop point — fraction of a sec extra hold on the final markflash
const rawD = sum(BEATS);
const pad = +((Math.ceil(rawD / 1.6) * 1.6) - rawD).toFixed(3);
BEATS[BEATS.length - 1].dur = +(BEATS[BEATS.length - 1].dur + pad).toFixed(3);

// ---------------------------------------------------------------------------
// scene HTML renderers
// ---------------------------------------------------------------------------
const wrapWords = (str, cls) => str.trim().split(/\s+/)
  .map(w => `<span class="wd ${cls || ""}">${w}</span>`).join("");

// AIS+ product mark is ALL WHITE, + included (directives) — inline it in copy
const plusMark = s => s.replace(/AIS\+/g, `<span class="plus">AIS<span class="p">+</span></span>`);

function headline(b, heroForce) {
  const pre = b.pre ? wrapWords(b.pre) : "";
  const ac = b.accent ? wrapWords(b.accent, "ac") : ""; // accents are always brand blue (directives)
  const hero = heroForce || b.type === "hero" || b.hero;
  return `<div class="ln${hero ? " hero" : ""}">${pre}${ac}</div>`;
}
const eyeb = b => b.eyebrow ? `<div class="eyebrow">${plusMark(b.eyebrow)}</div>` : "";
const sub = t => t ? `<div class="sub">${plusMark(t)}</div>` : "";

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

    case "slot":
      return `${eyeb(b)}
        <div class="slotbox">
          <div class="slotlab">${b.label}</div>
          <div class="slotnote">${b.note}</div>
        </div>`;

    case "agenda": {
      const rows = b.rows.map(r =>
        `<div class="agrow"><span class="agt">${r.t}</span><span class="agl">${plusMark(r.label)}</span></div>`).join("");
      return `${eyeb(b)}<div class="agenda">${rows}</div>${sub(b.caption)}`;
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
        <video id="${m}-v" class="mfill" muted playsinline data-has-audio="false" src="assets/video/${v.file}.mp4" data-start="${S(0)}" data-duration="${v.dur}" data-track-index="${500 + mountN}"></video>
        <img id="${m}-last" class="mfill" src="assets/video/${v.file}-lastframe.jpg" alt="" />
      </div>`);
    if (v.audio) {
      audioHTML.push(`      <audio id="${m}-a" src="assets/video/${v.file}.mp4" data-start="${S(0)}" data-duration="${v.dur}" data-track-index="${560 + mountN}" data-volume="1"></audio>`);
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
`      <section id="${s}" class="scene clip" data-start="${+start.toFixed(3)}" data-duration="${last ? b.dur : win}" data-track-index="${track}">
        <div class="inner">
        ${sceneBody(b)}
        </div>
      </section>`);

  tj.push(`      // ${s} · ${b.type}  (${b.dur}s)`);
  if (!first) tj.push(`      streak(${S(0)});`);

  // ---- entrance ----
  if (b.eyebrow) tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
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
  } else if (b.type === "agenda") {
    tj.push(`      slideX("#${s} .agrow", ${S(0.30)}, 0.07);`);
  } else if (b.type === "slot") {
    tj.push(`      pop("#${s} .slotbox", ${S(0.30)});`);
    tj.push(`      drift("#${s} .slotbox", ${S(1.6)}, ${+((b.dur - 2.2) / 4.8).toFixed(2)});`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub || b.caption) tj.push(`      drop("#${s} .sub", ${S(b.type === "quote" ? 0.95 : 0.82)});`);

  // ---- long-hold ambient: gentle drift on signage so nothing sits dead ----
  if (b.type === "agenda" && b.dur > 16) {
    tj.push(`      drift("#${s} .agenda", ${S(2.0)}, ${+((b.dur - 3.0) / 4.8).toFixed(2)});`);
  }

  // ---- exit ----
  // last beat settles out calmly (loop seam — the wrap lands on the open's entrance)
  if (last) tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 0.9)});`);
  else tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
  // hard kill at the clip boundary — non-linear seek must land on a clean autoAlpha:0
  if (!last) tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
  tj.push(``);

  t += b.dur;
});

const D = +t.toFixed(3);
if (Math.abs(D / 1.6 - Math.round(D / 1.6)) > 0.01) throw new Error(`D=${D} not on the 1.6s ambient grid — loop seam breaks`);

// ambient cycle counts — short fixed periods, even segment counts so yoyo motion
// starts AND ends at rest (loop-clean); dot/ring tile because D is a 1.6s multiple
const segs = approx => { let n = Math.round(D / approx); if (n % 2) n++; return n; };
const CAM = segs(30), BEAM = segs(25), FLICK = segs(6), GLOW = segs(30), VIG = segs(8.4);

// ---------------------------------------------------------------------------
// assemble
// ---------------------------------------------------------------------------
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — Block 4: End of Day 1 (${(D / 60).toFixed(1)} min loop)</title>
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
         background-clip:text box; side padding supplies the inter-word gap.
         NO will-change on gradient text — compositor promotion under the animated
         #camera truncates the text mask (chopped descenders in renders) */
      .ln .wd{display:inline-block;padding:.12em .15em .32em;
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

      /* AIS+ product mark — ALL WHITE incl. the +, never tinted (directives) */
      .plus{font-family:var(--font-display);font-style:italic;font-weight:900;color:#fff;letter-spacing:-.02em;}
      .plus .p{color:#fff;}

      /* stat (also the doors 8:30 card) */
      .statwrap{display:flex;flex-direction:column;align-items:center;gap:2px;}
      .kicker{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.30em;text-transform:uppercase;color:#fff;}
      .num{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:320px;line-height:1.0;
        letter-spacing:-.04em;padding:.08em .14em .26em;
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 90px rgba(55,189,248,.6);}
      .unit{font-family:var(--font-mono);font-weight:700;font-size:28px;letter-spacing:.30em;text-transform:uppercase;color:var(--blue);}

      /* agenda / recap */
      .agenda{display:flex;flex-direction:column;gap:14px;width:max-content;max-width:1680px;will-change:transform;}
      .agrow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-body);font-weight:700;font-size:38px;color:#fff;text-align:left;will-change:transform,opacity;}
      .agt{font-family:var(--font-mono);font-weight:700;font-size:22px;color:var(--blue);min-width:130px;letter-spacing:.04em;}

      /* placeholder slot — dashed frame, unmistakably interim (scaffold house style) */
      .slotbox{width:1240px;height:480px;border:3px dashed rgba(55,189,248,.45);border-radius:26px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;
        background:rgba(9,20,32,.35);will-change:transform,opacity;}
      .slotlab{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:66px;
        letter-spacing:-.02em;color:#fff;text-shadow:0 0 28px rgba(255,255,255,.18);padding:0 .14em .08em;}
      .slotnote{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.10em;
        text-transform:uppercase;color:var(--blue);text-shadow:0 0 14px rgba(55,189,248,.4);}

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
    <div id="stage" data-composition-id="cmp-day1-close-fill" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
      // force3D:false on gradient-text tweens — translate3d re-promotes the span
      // mid-tween and re-triggers the truncated text mask (Studio + renders)
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%",force3D:false},at); }
      function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%",force3D:false},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      // gentle float during long signage holds — lists only, never headline type
      function drift(sel, at, cycles){ tl.to(sel,{y:"-=12",duration:2.4,yoyo:true,repeat:Math.max(1,Math.round(cycles*2)-1),
        ease:"sine.inOut",stagger:{each:.25,from:"center"}},at); }
      function whipOut(sel, at){ tl.to(sel,{autoAlpha:0,y:-155,filter:"blur(30px)",duration:.26,ease:"power2.in"},at); }
      function settleOut(sel, at){ tl.to(sel,{autoAlpha:0,filter:"blur(12px)",duration:.8,ease:"power2.in"},at); }
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

      /* ---- AMBIENT — camera never sleeps; short fixed cycles, even segment counts
             so yoyo motion starts AND ends at rest (loop-clean); dot/ring tile
             because D is a multiple of their 1.6s cycle ---- */
      tl.to("#camera", { scale:1.035, y:-16, duration:D/${CAM}, yoyo:true, repeat:${CAM - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=1716px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=1716px", duration:D, ease:"none" }, 0);
      tl.to(".beam",     { rotation:8, duration:D/${BEAM}, yoyo:true, repeat:${BEAM - 1}, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/${FLICK}, yoyo:true, repeat:${FLICK - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:44, y:-24, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.coral",{ x:-36, y:22, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/${VIG}, yoyo:true, repeat:${VIG - 1}, ease:"sine.inOut" }, 0);
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
      window.__timelines["cmp-day1-close-fill"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(SRC, "day1-close-fill.html"), html);
console.log(`wrote cards/day1-close-fill.html — ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min) LOOP, pad ${pad}s${CERT ? " · cert launch video MOUNTED" : " · cert video NOT present (PLACEHOLDER slot in its place)"}`);
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "day1-close-fill.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/day1-close-fill.html");
}
