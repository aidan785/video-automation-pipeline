// AIS+ Membership Promo — AIS LIVE branding (NEW asset, 2026-07-10).
// ~10:00 single-arc conversion video for the event: promote AIS+ with the
// $699 event deal (back up to $849 after). Aidan's brief: use wins, use the
// building + earning testimonial reels, pull NEW quotes from the Descript
// soundbite shortlist — NOTHING repeats across the full 10 minutes.
//
// Structure (5 acts, every beat unique):
//   OPEN    — what AIS+ is (free community builds, AIS+ earns)
//   BUILD   — building reel MOUNT + wins + fresh quotes + the 6-module classroom
//   UNLOCK  — what membership unlocks (live calls w/ Nate, earning community,
//             templates + 90-day planner) + wins + quotes
//   EARN    — earning reel MOUNT + wins + quotes + the client math
//   OFFER   — $699 event deal (count-up), $849-after urgency, final wins/quotes, CTA
//
// Sources (all previously verified):
//   reels   — #4/#5 testimonial reels (v2 descender-fix renders), member audio ON
//   WINS    — real community win posts (Yash's folder set, numbers verbatim), all 16, once each
//   QUOTES  — testimonial-soundbites.md shortlist (verbatim Descript fragments);
//             19 members, none of whom appear in the reels' clip lineup or win cards
//             EXCEPT zero — checked. No membership-price quotes ($89/$94/$98) used
//             so nothing conflicts with the $699/$849 offer.
//   AIS+    — benefit copy grounded in the membership video scaffold (NOTES.md):
//             6 real classroom modules, unlocks, $1K-$10K+ client math
//
// SINGLE-RUN video (not a loop): ends on a settle-out + breathing hold.
// SILENT except the two reels' member audio.
//
//   node _gen.mjs         -> writes cards/ais-plus-live-promo.html
//   node _gen.mjs --set   -> also copies it to index.html

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const TARGET = 600; // ~10:00 — pad rides the closing hold

const probe = f => {
  const d = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${join(DIR, "assets/video", f)}"`).toString().trim();
  return Math.floor(d * 30) / 30;
};
const MOUNT_HOLD = 0.4;
const VID = {
  building: { file: "testi-building-v2", dur: probe("testi-building-v2.mp4"), audio: true },
  earning:  { file: "testi-earning-v2",  dur: probe("testi-earning-v2.mp4"),  audio: true },
};

// ---------------------------------------------------------------------------
// MEMBER WINS — all 16, used exactly once
// ---------------------------------------------------------------------------
const WINS = [
  { img: "david-kim", name: "David Kim", pre: "$385,000 ", accent: "contract.",
    sub: "A $25K implementation fee plus $15K a month for 24 months, closed at a 76% profit margin." },
  { img: "jacob-west", name: "Jacob West", pre: "Two deals, ", accent: "one week.",
    sub: "$22.5K and $42K sold in the same week, crossing $15K MRR and making his first hire." },
  { img: "mohammad-sallam", name: "Mohammad Sallam", pre: "$50K+ in ", accent: "the pipeline.",
    sub: "Four new clients within a month, just a couple of weeks in." },
  { img: "kobe-shemesh", name: "Kobe Shemesh", pre: "$40K ", accent: "upfront.",
    sub: "Plus 20% revenue share, on one custom AI build." },
  { img: "joe-scott", name: "Joe Scott", pre: "£1K to ", accent: "£30K projects.",
    sub: "From selling £1,000 workflows a year ago to closing AI agent projects at £25-30K." },
  { img: "sef-el", name: "Sef El", pre: "$25K ", accent: "this month.",
    sub: "What started as a side hustle now invoices $25K a month, with $9K more in the pipeline." },
  { img: "abdurrahman-ibrahim", name: "Abdurrahman Ibrahim", pre: "$10K in ", accent: "one year.",
    sub: "A side hustle while still in university. 80% of it came through AIS+ connections." },
  { img: "noel-payano", name: "Noel Payano", pre: "First client, ", accent: "$5K.",
    sub: "Closed at 18 years old." },
  { img: "tyler-capps", name: "Tyler Capps", pre: "$5,000, ", accent: "locked in.",
    sub: "First client closed at 38, with a full-time job and a toddler at home." },
  { img: "michael-elliott", name: "Michael Elliott", pre: "Three builds, ", accent: "one week.",
    sub: "Two recurring sites at $150 and $200 a month, plus a $1,000 portfolio build." },
  { img: "galyn-fergerson", name: "Galyn Fergerson", pre: "$750 in ", accent: "six days.",
    sub: "Landed her first AI OS build less than a week after joining." },
  { img: "nika-matveeva", name: "Nika Matveeva", pre: "Paid $800, ", accent: "first project.",
    sub: "A Claude-coded home inventory system cataloging 1,000+ items." },
  { img: "christian-barraza", name: "Christian Barraza", pre: "Second client ", accent: "in 3 days.",
    sub: "Three days after signing his first, and the new client paid on the spot." },
  { img: "chase-coughlin", name: "Chase Coughlin", pre: "Client in ", accent: "week one.",
    sub: "Two courses finished and a first paying client, all in the first week." },
  { img: "diane-mccracken", name: "Diane McCracken", pre: "100 sessions ", accent: "at 68.",
    sub: "Her 100th Claude Code session, building automations at 68 years young." },
  { img: "wayne-dowden", name: "Wayne Dowden", pre: "Analyst ", accent: "to builder.",
    sub: "After 15 years designing systems, he finally builds them, and signed a monthly retainer." },
];
let winCursor = 0;
const wins = n => Array.from({ length: n }, () => ({ type: "win", dur: 8, ...WINS[winCursor++] }));

// ---------------------------------------------------------------------------
// FRESH QUOTES — testimonial-soundbites.md, verbatim fragments, one per member.
// small:true drops the quote type size for the longer lines.
// ---------------------------------------------------------------------------
const Q = {
  matthew:  { eyebrow: "WHY AIS+",            quote: "I needed literally a room full of people who were actually doing it. And AIS was that room.", attrib: "Matthew Sutherland", small: true },
  duy:      { eyebrow: "BUILD SPEED",         quote: "Six months of engineering work compressed into one afternoon.", attrib: "Duy Nguyen" },
  janine:   { eyebrow: "FIRST CLIENT",        quote: "I've only been in this community for two months, and we landed our first client.", attrib: "Janine Cosino" },
  josh:     { eyebrow: "COMMITMENT",          quote: "If you're willing to pay, you're willing to play.", attrib: "Josh Holladay" },
  kacper:   { eyebrow: "PAID FOR ITSELF",     quote: "I was able to win the hackathon and I already paid for my full year.", attrib: "Kacper Rutkiewicz" },
  jan:      { eyebrow: "THE COMMUNITY",       quote: "If I have a problem, my backup team is just a keyboard away.", attrib: "Jan Goergen Makinson" },
  wacht:    { eyebrow: "CONFIDENCE",          quote: "When I go to talk to a customer, I don't have a bunch of butterflies. It is second nature.", attrib: "Michael Wacht", small: true },
  maria:    { eyebrow: "FAST SUPPORT",        quote: "You can just put a question and you will receive at least five or 10 answers.", attrib: "Maria Somana" },
  dion:     { eyebrow: "EVERYTHING YOU NEED", quote: "You have all the info you need, you have all the people you need.", attrib: "Dion Wang" },
  marvin:   { eyebrow: "TRANSFORMATION",      quote: "You will definitely see a before and an after. You can really make a living out of this.", attrib: "Marvin Martinez", small: true },
  jonroth:  { eyebrow: "CLIENT ROI",          quote: "They're saving about $18,700 a year, just from this one workflow automation.", attrib: "Jon Roth" },
  pedro:    { eyebrow: "CAREER SHIFT",        quote: "I actually got my dream role: head of AI.", attrib: "Pedro Gomez" },
  anthony:  { eyebrow: "NO FLUFF",            quote: "It's like a no BS place. You wanna be good at this? Here it is.", attrib: "Anthony Caspari" },
  usman:    { eyebrow: "WHAT LASTS",          quote: "Don't join for the tools. Join for the community, for the experience, for the network. That will remain with you for life.", attrib: "Usman Mohammed", small: true },
  prentice: { eyebrow: "VALUE",               quote: "You paid for a dollar meal from McDonald's and you get a buffet from one of the finest Michelin restaurants on the planet.", attrib: "Prentice Alston", small: true },
  tonia:    { eyebrow: "BELONGING",           quote: "I found my home. I found my tribe.", attrib: "Tonia Hardeman" },
  ailin:    { eyebrow: "DON'T OVERTHINK IT",  quote: "This one is by far one of the very best out there. So don't overthink it. Just do it.", attrib: "Ailin Werner", small: true },
  nick:     { eyebrow: "THE VERDICT",         quote: "It was the best money I've ever spent on any community.", attrib: "Nick Mohler" },
  brett:    { eyebrow: "NO-BRAINER",          quote: "It's a no-brainer. You have to join AIS+.", attrib: "Brett Fairall" },
};
const quote = k => ({ type: "quote", dur: 8, ...Q[k] });

// AIS+ classroom — the 6 REAL modules (membership video scaffold, verified)
const MODULES = [
  { t: "01", label: "Start Here" },
  { t: "02", label: "The AI Partner Model" },
  { t: "03", label: "Build Your Portfolio" },
  { t: "04", label: "Claude Code" },
  { t: "05", label: "Get Your First Clients" },
  { t: "06", label: "Scale" },
];

// ---------------------------------------------------------------------------
// THE ARC — hand-authored, no passes, nothing repeats
// ---------------------------------------------------------------------------
const BEATS = [
  // ---- OPEN: what AIS+ is ----
  { type: "markflash", dur: 7, sub: "Meet AIS+." },
  { type: "hero", dur: 5, eyebrow: "AIS+", pre: "You learned to ", accent: "build." },
  { type: "tagline", dur: 9, eyebrow: "NOW GET PAID", pre: "Here's how you ", accent: "get paid.",
    sub: "AIS+ is the earning arm of the AI Automation Society" },
  { type: "tagline", dur: 9, eyebrow: "WHAT AIS+ IS", pre: "The free community builds. ", accent: "AIS+ earns.",
    sub: "Courses, live calls, and a community built around landing paid AI work" },
  { type: "stat", dur: 7, kicker: "MEMBERS WORLDWIDE", num: "400K+", unit: "BUILDERS STRONG",
    sub: "AIS+ is where builders go pro." },
  quote("matthew"),

  // ---- BUILD: building reel + wins + classroom ----
  { type: "hero", dur: 5, eyebrow: "FROM THE COMMUNITY", pre: "They started ", accent: "where you are." },
  { type: "mount", video: VID.building, dur: +(VID.building.dur + MOUNT_HOLD).toFixed(3) },
  ...wins(4),
  quote("duy"),
  quote("janine"),
  quote("josh"),
  { type: "tagline", dur: 9, eyebrow: "THE CURRICULUM", pre: "Six modules. ", accent: "One path.",
    sub: "The AIS+ classroom takes you from setup to scale" },
  { type: "agenda", dur: 26, eyebrow: "INSIDE THE AIS+ CLASSROOM", rows: MODULES, caption: "Every module, included with membership" },
  quote("jan"),
  quote("kacper"),
  { type: "stat", dur: 7, kicker: "SHIPPED BY THE COMMUNITY", num: "100K+", unit: "AUTOMATIONS SHIPPED",
    sub: "Built by members like these." },

  // ---- UNLOCK: what membership gets you ----
  { type: "hero", dur: 5, eyebrow: "MEMBERSHIP", pre: "What's ", accent: "unlocked." },
  { type: "tagline", dur: 9, eyebrow: "LIVE ACCESS", pre: "Live calls ", accent: "with Nate.",
    sub: "Bring your build, your pricing, your client questions" },
  { type: "tagline", dur: 9, eyebrow: "THE EARNING COMMUNITY", pre: "A room that ", accent: "gets you paid.",
    sub: "Templates, the 90-day planner, and members who close deals every week" },
  ...wins(4),
  quote("wacht"),
  quote("maria"),
  quote("dion"),
  quote("marvin"),

  // ---- EARN: earning reel + wins + the math ----
  { type: "hero", dur: 5, eyebrow: "FROM THE COMMUNITY", pre: "Then they ", accent: "got paid." },
  { type: "mount", video: VID.earning, dur: +(VID.earning.dur + MOUNT_HOLD).toFixed(3) },
  ...wins(4),
  quote("jonroth"),
  quote("pedro"),
  quote("anthony"),
  { type: "tagline", dur: 9, eyebrow: "THE MATH", pre: "One client pays for it, ", accent: "many times over.",
    sub: "AI skills bill at $1K-$10K+ per client project" },
  { type: "stat", dur: 7, kicker: "THE WORLD IS WATCHING", num: "40M+", unit: "VIEWS & COUNTING",
    sub: "The community the whole space watches." },

  // ---- OFFER: $699 event deal ----
  { type: "hero", dur: 5, eyebrow: "THIS WEEKEND ONLY", pre: "The ", accent: "deal." },
  { type: "price", dur: 10, kicker: "AIS LIVE EVENT PRICE", amount: 699, unit: "JOIN AIS+ THIS WEEKEND",
    sub: "Goes back up to $849 after the event" },
  { type: "tagline", dur: 9, eyebrow: "AFTER THE EVENT", pre: "The price goes back to ", accent: "$849.",
    sub: "Lock in $699 before the event ends" },
  ...wins(4),
  quote("usman"),
  quote("prentice"),
  quote("tonia"),
  { type: "action", dur: 9, eyebrow: "JOIN AIS+", pre: "Join at the ", accent: "event price.",
    sub: "$699 this weekend only" },
  quote("ailin"),
  quote("nick"),
  quote("brett"),
  { type: "action", dur: 9, eyebrow: "AIS+", pre: "Become a ", accent: "member.",
    sub: "Join AIS+ before the price goes back up" },
  { type: "markflash", dur: 9, sub: "Join AIS+ · $699 at the event", closer: true },
];

// no-repeat guards
if (winCursor !== WINS.length) throw new Error(`win usage ${winCursor} != ${WINS.length}`);
{
  const seen = new Set();
  for (const b of BEATS) if (b.type === "quote") {
    if (seen.has(b.attrib)) throw new Error(`repeated quote: ${b.attrib}`);
    seen.add(b.attrib);
  }
}

const sum = arr => arr.reduce((s, b) => s + b.dur, 0);
const pad = +(TARGET - sum(BEATS)).toFixed(3);
if (pad < 0) throw new Error(`over target by ${-pad}s`);
BEATS[BEATS.length - 1].dur += pad; // breathing outro hold rides the pad

// ---------------------------------------------------------------------------
// scene HTML renderers — AIS+ in headlines renders as the all-white mark
// ---------------------------------------------------------------------------
const plusMark = s => s.replace(/AIS\+/g, `<span class="plus">AIS<span class="p">+</span></span>`);
const wrapWords = (str, cls) => str.trim().split(/\s+/)
  .map(w => w.includes("AIS+")
    ? `<span class="wd solid ${cls || ""}">${plusMark(w)}</span>`
    : `<span class="wd ${cls || ""}">${w}</span>`).join("");

function headline(b) {
  const pre = b.pre ? wrapWords(b.pre) : "";
  const ac = b.accent ? wrapWords(b.accent, "ac") : "";
  return `<div class="ln${b.type === "hero" ? " hero" : ""}">${pre}${ac}</div>`;
}
const eyeb = b => b.eyebrow ? `<div class="eyebrow">${plusMark(b.eyebrow)}</div>` : "";
const sub = t => t ? `<div class="sub">${plusMark(t)}</div>` : "";

function sceneBody(b) {
  switch (b.type) {
    case "hero": case "tagline": case "action":
      return `${eyeb(b)}${headline(b)}${sub(b.sub)}`;
    case "quote":
      return `${eyeb(b)}<div class="ln quoteln${b.small ? " qsm" : ""}">${wrapWords(b.quote)}</div><div class="sub attrib">${b.attrib}</div>`;
    case "stat":
      return `${eyeb(b)}
        <div class="statwrap">
          <div class="kicker">${b.kicker}</div>
          <div class="num">${b.num.replace(/^\d+/, "0")}</div>
          <div class="unit">${b.unit || ""}</div>
        </div>${sub(b.sub)}`;
    case "price":
      return `${eyeb(b)}
        <div class="statwrap">
          <div class="kicker">${b.kicker}</div>
          <div class="num">$0</div>
          <div class="unit">${plusMark(b.unit || "")}</div>
        </div>${sub(b.sub)}`;
    case "agenda": {
      const rows = b.rows.map(r =>
        `<div class="agrow"><span class="agt">${r.t}</span><span class="agl">${plusMark(r.label)}</span></div>`).join("");
      return `${eyeb(b)}<div class="agenda">${rows}</div>${sub(b.caption)}`;
    }
    case "win":
      return `<div class="winwrap">
          <div class="wintext">
            <div class="peyebrow">MEMBER WIN</div>
            <div class="winhead">${wrapWords(b.pre)}${wrapWords(b.accent, "ac")}</div>
            <div class="winsub">${plusMark(b.sub)}</div>
            <div class="winname">${b.name}</div>
          </div>
          <div class="winshot"><img src="assets/wins/${b.img}.png" alt="" /></div>
        </div>`;
    case "markflash":
      return `<div class="bigmark"><span class="mark big"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>${sub(b.sub)}`;
  }
  return "";
}

// ---------------------------------------------------------------------------
// scenes + timeline
// ---------------------------------------------------------------------------
let t = 0;
const OVERLAP = 0.4;
const scenesHTML = [], rootHTML = [], audioHTML = [], tj = [];
let mountN = 0;

BEATS.forEach((b, idx) => {
  const start = t, s = `sc${idx}`, track = 12 + idx;
  const win = +(b.dur + OVERLAP).toFixed(3);
  const first = idx === 0, last = idx === BEATS.length - 1;
  const S = n => +(start + n).toFixed(3);

  if (b.type === "mount") {
    const v = b.video, m = `mnt${mountN++}`;
    rootHTML.push(
`      <div id="${m}" class="mount">
        <img id="${m}-poster" class="mfill" src="assets/video/${v.file}-poster.jpg" alt="" />
        <video id="${m}-v" class="mfill" muted playsinline data-has-audio="false" src="assets/video/${v.file}.mp4" data-start="${S(0)}" data-duration="${v.dur}" data-track-index="${500 + mountN}"></video>
        <img id="${m}-last" class="mfill" src="assets/video/${v.file}-lastframe.jpg" alt="" />
      </div>`);
    audioHTML.push(`      <audio id="${m}-a" src="assets/video/${v.file}.mp4" data-start="${S(0)}" data-duration="${v.dur}" data-track-index="${560 + mountN}" data-volume="1"></audio>`);
    tj.push(`      // ${s} · mount ${v.file}  (${b.dur}s, voice audio)`);
    tj.push(`      streak(${S(0)});`);
    tj.push(`      tl.set("#${m}", { autoAlpha: 0 }, 0);`);
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 0 }, 0);`);
    tj.push(`      mountIn("#${m}", ${S(0)});`);
    tj.push(`      tl.set("#${m}-poster", { autoAlpha: 0 }, ${S(0.2)});`);
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 1 }, ${S(v.dur - 0.04)});`);
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

  if (b.eyebrow) tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
  if (["hero", "tagline", "action"].includes(b.type)) {
    tj.push(`      words("#${s} .ln .wd", ${S(0.24)});`);
  } else if (b.type === "quote") {
    tj.push(`      words("#${s} .quoteln .wd", ${S(0.26)});`);
    tj.push(`      drop("#${s} .attrib", ${S(0.95)});`);
  } else if (b.type === "stat") {
    tj.push(`      drop("#${s} .kicker", ${S(0.28)});`);
    tj.push(`      pop("#${s} .num", ${S(0.42)});`);
    const m = b.num.match(/^(\d+)(K\+|M\+|\+)$/);
    if (m) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${m[1]}, 1.0, "${m[2]}", "");`);
    tj.push(`      drop("#${s} .unit", ${S(0.78)});`);
  } else if (b.type === "price") {
    tj.push(`      drop("#${s} .kicker", ${S(0.28)});`);
    tj.push(`      pop("#${s} .num", ${S(0.42)});`);
    tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${b.amount}, 1.2, "", "$");`);
    tj.push(`      drop("#${s} .unit", ${S(0.85)});`);
  } else if (b.type === "agenda") {
    tj.push(`      slideX("#${s} .agrow", ${S(0.30)}, 0.09);`);
    tj.push(`      drift("#${s} .agenda", ${S(2.0)}, ${+((b.dur - 3.0) / 4.8).toFixed(2)});`);
  } else if (b.type === "win") {
    tj.push(`      drop("#${s} .peyebrow", ${S(0.14)});`);
    tj.push(`      words("#${s} .winhead .wd", ${S(0.28)});`);
    tj.push(`      drop("#${s} .winsub", ${S(0.75)});`);
    tj.push(`      drop("#${s} .winname", ${S(0.92)});`);
    tj.push(`      shotIn("#${s} .winshot", ${S(0.4)});`);
    tj.push(`      drift("#${s} .winshot", ${S(1.8)}, ${+((b.dur - 2.4) / 4.8).toFixed(2)});`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub && b.type !== "win") tj.push(`      drop("#${s} .sub", ${S(b.type === "quote" ? 0.95 : 0.82)});`);
  if (b.caption) tj.push(`      drop("#${s} .sub", ${S(0.82)});`);

  // exit — closer settles out and BREATHES (single-run video, not a loop)
  if (b.closer) {
    tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 1.2)});`);
  } else {
    tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
    tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
  }
  tj.push(``);

  t += b.dur;
});

const D = +t.toFixed(3);
if (Math.abs(D - TARGET) > 0.01) throw new Error(`duration drift: ${D} != ${TARGET}`);

const segs = approx => { let n = Math.round(D / approx); if (n % 2) n++; return n; };
const CAM = segs(30), BEAM = segs(25), FLICK = segs(6), GLOW = segs(30), VIG = segs(8.4);
const CID = "cmp-ais-plus-live-promo";

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS+ Membership Promo — AIS LIVE (10 min)</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="assets/gsap.min.js"><\/script>
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

      .ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:122px;line-height:1.16;
        letter-spacing:-.03em;max-width:1600px;}
      .ln.hero{font-size:176px;}
      .ln .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}
      /* AIS+ inside a headline — solid white mark, not gradient-clipped */
      .ln .wd.solid{background:none;-webkit-text-fill-color:#fff;color:#fff;}
      .ln.quoteln{font-size:74px;line-height:1.28;max-width:1520px;}
      .ln.quoteln.qsm{font-size:60px;}
      .quoteln{position:relative;}
      .quoteln::before{content:"\\201C";color:var(--blue);margin-right:.04em;}
      .quoteln::after{content:"\\201D";color:var(--blue);margin-left:.04em;}

      .sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:41px;line-height:1.25;
        color:rgba(209,220,232,.85);max-width:1440px;will-change:transform,opacity;}
      .attrib{font-style:normal;font-family:var(--font-mono);font-weight:500;font-size:27px;letter-spacing:.06em;color:rgba(180,214,238,.82);}

      .plus{font-family:var(--font-display);font-style:italic;font-weight:900;color:#fff;letter-spacing:-.02em;}
      .plus .p{color:#fff;}

      /* stat / price */
      .statwrap{display:flex;flex-direction:column;align-items:center;gap:2px;}
      .kicker{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.30em;text-transform:uppercase;color:#fff;}
      .num{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:320px;line-height:1.0;
        letter-spacing:-.04em;padding:.08em .14em .26em;will-change:transform,opacity;
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 90px rgba(55,189,248,.6);}
      .unit{font-family:var(--font-mono);font-weight:700;font-size:28px;letter-spacing:.30em;text-transform:uppercase;color:var(--blue);}
      .unit .plus{font-size:34px;}

      /* agenda (module list) */
      .agenda{display:flex;flex-direction:column;gap:16px;width:max-content;max-width:1680px;will-change:transform;}
      .agrow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-body);font-weight:700;font-size:46px;color:#fff;text-align:left;will-change:transform,opacity;}
      .agt{font-family:var(--font-mono);font-weight:700;font-size:24px;color:var(--blue);min-width:70px;letter-spacing:.04em;}

      /* member win card */
      .winwrap{position:absolute;inset:0;display:flex;align-items:center;gap:70px;padding:80px 110px 90px 150px;}
      .wintext{flex:0 0 760px;display:flex;flex-direction:column;align-items:flex-start;text-align:left;}
      .peyebrow{font-family:var(--font-mono);font-weight:700;font-size:27px;letter-spacing:.34em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 16px rgba(55,189,248,.45);will-change:transform,opacity;}
      .winhead{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:76px;line-height:1.12;
        letter-spacing:-.03em;margin-left:-.15em;max-width:780px;}
      .winhead .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .winhead .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}
      .winsub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:31px;line-height:1.35;
        color:rgba(209,220,232,.85);margin-top:16px;max-width:720px;will-change:transform,opacity;}
      .winname{font-family:var(--font-mono);font-weight:500;font-size:24px;letter-spacing:.2em;text-transform:uppercase;
        color:var(--blue);margin-top:30px;text-shadow:0 0 14px rgba(55,189,248,.4);will-change:transform,opacity;}
      .winshot{flex:1;display:flex;align-items:center;justify-content:center;max-height:840px;
        will-change:transform,opacity;transform-style:preserve-3d;}
      .winshot img{max-width:100%;max-height:840px;object-fit:contain;border-radius:20px;
        border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 90px rgba(0,0,0,.55), 0 0 60px rgba(55,189,248,.10);}

      /* mounted reels */
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
    <div id="stage" data-composition-id="${CID}" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%"},at); }
      function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%"},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      function shotIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,x:70,rotationY:-14,filter:"blur(8px)"},
        {autoAlpha:1,x:0,rotationY:0,filter:"blur(0px)",duration:.65,ease:"power3.out"},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function drift(sel, at, cycles){ tl.to(sel,{y:"-=12",duration:2.4,yoyo:true,repeat:Math.max(1,Math.round(cycles*2)-1),
        ease:"sine.inOut",stagger:{each:.25,from:"center"}},at); }
      function whipOut(sel, at){ tl.to(sel,{autoAlpha:0,y:-155,filter:"blur(30px)",duration:.26,ease:"power2.in"},at); }
      function settleOut(sel, at){ tl.to(sel,{autoAlpha:0,filter:"blur(12px)",duration:1.1,ease:"power2.in"},at); }
      function mountIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:1.045,filter:"blur(14px)"},
        {autoAlpha:1,scale:1,filter:"blur(0px)",duration:.5,ease:"power2.out",transformOrigin:"50% 50%"},at); }
      function streak(at){
        tl.fromTo("#whip",{xPercent:-130,scaleX:.5,autoAlpha:0},{autoAlpha:.95,duration:.1,ease:"none",immediateRender:false,overwrite:"auto"},at-0.05);
        tl.to("#whip",{xPercent:270,scaleX:1.7,autoAlpha:0,duration:.34,ease:"power3.in",overwrite:"auto"},at+0.02);
      }
      function countUp(sel, at, target, dur, suffix, prefix){
        var o={v:0};
        tl.call(function(){var el=document.querySelector(sel); if(el) el.textContent=(prefix||"")+"0"+(suffix||"");}, null, at-0.001);
        tl.to(o,{v:target,duration:dur,ease:"power2.out",onUpdate:function(){
          var el=document.querySelector(sel); if(el) el.textContent=(prefix||"")+Math.round(o.v)+(suffix||"");}},at);
      }

      /* ---- AMBIENT — short fixed cycles, even counts so motion ends at rest ---- */
      tl.to("#camera", { scale:1.035, y:-16, duration:D/${CAM}, yoyo:true, repeat:${CAM - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=1716px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=1716px", duration:D, ease:"none" }, 0);
      tl.to(".beam",     { rotation:8, duration:D/${BEAM}, yoyo:true, repeat:${BEAM - 1}, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/${FLICK}, yoyo:true, repeat:${FLICK - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:44, y:-24, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.coral",{ x:-36, y:22, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/${VIG}, yoyo:true, repeat:${VIG - 1}, ease:"sine.inOut" }, 0);
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(TARGET / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(TARGET / 1.6) - 1}, ease:"none" }, 0);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // Law #11 — fill the slot
      window.__timelines["${CID}"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(SRC, "ais-plus-live-promo.html"), html);
const qn = BEATS.filter(b => b.type === "quote").length;
const wn = BEATS.filter(b => b.type === "win").length;
console.log(`wrote cards/ais-plus-live-promo.html — ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min), pad ${pad}s · ${wn} wins (all unique) · ${qn} quotes (all unique members) · 2 reel mounts`);
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "ais-plus-live-promo.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/ais-plus-live-promo.html");
}
