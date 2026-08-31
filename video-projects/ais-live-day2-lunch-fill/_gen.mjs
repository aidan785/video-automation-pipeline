// AIS LIVE — Block 7: DAY 2 LUNCH / AFTERNOON (main stage, 1:35-2:10 CT, Day 2).
// Brief: 35-min build that RUNS ONCE and fills the whole window (no loop).
// Program (per Aidan's brief), assembled in order each pass:
//   1. CERT       — AIS Certification launch (feature). Russ's #7 launch video is
//                   NOT delivered — a visibly-marked dashed PLACEHOLDER slot fills
//                   it (per Aidan 2026-07-08). Do NOT deliver with the slot in.
//   2. AIS+       — membership information (mounted ad on alternating passes)
//   3. SPONSORS   — HyperAgent 60s (placeholder spotlight until the spot lands)
//                   + Glaido. NO CLAY (out per Aidan 2026-07-08; brief predated
//                   the 7/7 removal).
//   4. TESTIMONIAL— community reels (#4 building / #5 earning, alternating)
//   5. DISCOVERY  — Discovery Call practice prompt (v7.1 lunch live activity)
//   6. AFTERNOON  — Day 2 afternoon agenda (v7.1 verbatim), then a filler pool
//                   tops the build up to 35:00 and a fixed outro lands on the
//                   2:10 "Welcome Back" (Nate Herk + Jon Morrow) as the window ends.
//
// The build is N varied passes of that sequence (copy variants, alternating reels,
// membership ad every other pass to avoid ad fatigue), then filler-pool beats, then
// the outro. TOTAL is pinned to exactly 2100s (35:00) — the pad rides the outro hold.
//
// Engine forked from ais-live-lunch-fill/_gen.mjs (Block 3). Beat changes:
//   + slot  — dashed cert-launch placeholder (from ais-live-day1-close-fill)
//   - rooms / worksplit — dropped (VIP rooms card excluded per Aidan; no WB2 on Day 2)
//
// AUDIO: mounted pieces (AIS+ ad, testimonial reels, cert + HyperAgent spots when
// they land) keep their voice audio; every authored card is silent — venue runs
// the music bed underneath.
//
//   node _gen.mjs         -> writes cards/day2-lunch-fill.html
//   node _gen.mjs --set   -> also copies it to index.html (active for preview/render)

import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const TARGET = 2100; // 35:00 exactly — plays once, fills the 1:35-2:10 window

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
  // -v2 = the 2026-07-08 descender-fix re-renders ("They" y no longer clipped);
  // renamed so browsers don't serve the old clipped reel from disk cache
  building:   { file: "testi-building-v2",   dur: probe("testi-building-v2.mp4"),   audio: true },
  earning:    { file: "testi-earning-v2",    dur: probe("testi-earning-v2.mp4"),    audio: true },
  // HyperAgent keynote (Alex McDonnell, 18:25) — plays ONCE, in pass 1's sponsor
  // slot, so the replay runs through the heart of the lunch window (Aidan 2026-07-08)
  keynote:    { file: "hyperagent-keynote",  dur: probe("hyperagent-keynote.mp4"),  audio: true },
};
// HyperAgent's 60s sponsor spot is sponsor-provided. Drop it at
// assets/video/hyperagent-60.mp4 (+ re-run _gen.mjs) and it mounts in every pass;
// pass count / filler recompute automatically so TOTAL stays 35:00. Until then the
// slot renders as a finished-looking HyperAgent logo beat (never a dashed
// placeholder — this plays on the main stage).
const H60 = existsSync(join(DIR, "assets/video/hyperagent-60.mp4"))
  ? { file: "hyperagent-60", dur: probe("hyperagent-60.mp4"), audio: true }
  : null;
// AIS Certification launch video — the new 56.6s cert video from Block 4
// (ais-live-day1-close-fill), copied in 2026-07-08 per Aidan. Mounts 1:1 in every
// pass; the dashed placeholder only returns if the file goes missing.
const CERT = existsSync(join(DIR, "assets/video/cert-launch.mp4"))
  ? { file: "cert-launch", dur: probe("cert-launch.mp4"), audio: true }
  : null;

// ---------------------------------------------------------------------------
// DAY 2 AFTERNOON PROGRAM — Agenda v7.1 (doc 1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18)
// all times Central, verbatim; all-blue accents per the live-asset directives
// ---------------------------------------------------------------------------
const AFTERNOON = [
  { t: "1:35 PM", label: "Lunch + Practice Discovery Call + VIP Working Sessions" },
  { t: "2:10 PM", label: "Welcome Back: Sales Call Recap + Intro to Pricing" },
  { t: "2:25 PM", label: "Ditching Hourly: The Pricing Mindset That Changes Everything" },
  { t: "3:10 PM", label: "What Companies Are Actually Buying in AI" },
  { t: "3:55 PM", label: "Live Debrief: What Buyers Actually Want" },
  { t: "4:05 PM", label: "The Client Didn't Ask for AI + VIP Pricing War Room" },
  { t: "4:45 PM", label: "What Actually Matters in AI Right Now" },
  { t: "5:15 PM", label: "Closing Keynote: Build to Sell" },
  { t: "5:45 PM", label: "Nate's Close + AIS+ Pitch" },
];
// per-pass afternoon spotlight (rotates so back-to-back passes don't read identical)
const SPOTLIGHTS = [
  { pre: "Ditching ", accent: "Hourly.", sub: "Jonathan Stark, 2:25 PM, the pricing mindset that changes everything" },
  { pre: "What companies are ", accent: "actually buying.", sub: "Dr. Dariia Vasylieva with Anne-Marie Enns, 3:10 PM" },
  { pre: "What actually matters ", accent: "in AI right now.", sub: "Matt Wolfe + Nate Herk, 4:45 PM" },
  { pre: "Closing keynote: ", accent: "Build to Sell.", sub: "Devin Kearns, 5:15 PM" },
];

// verified member quotes (testimonial-soundbites shortlist, face-checked set used in #1)
const QUOTES = [
  { eyebrow: "FROM THE COMMUNITY",     quote: "In six weeks I landed two contracts worth nearly $20,000. And the sky's the limit.", attrib: "Amy Simpson" },
  { eyebrow: "MEMBER WIN",             quote: "Every client came to me. I never sent a single cold DM.",                            attrib: "Abdurrahman Ibrahim" },
  { eyebrow: "FROM LAID OFF TO HIRED", quote: "In a month and a half, I went from being laid off to having a job.",                 attrib: "Griffin Maklansky" },
  { eyebrow: "MEMBER WIN",             quote: "Six months of engineering work, compressed into one afternoon.",                     attrib: "Duy Nguyen" },
  { eyebrow: "WHY WE'RE HERE",         quote: "I found my home. I found my tribe.",                                                 attrib: "Tonia Hardeman" },
  { eyebrow: "CAREER SHIFT",           quote: "I actually got my dream role: head of AI.",                                          attrib: "Pedro Gomez" },
  { eyebrow: "THE VERDICT",            quote: "The best money I've ever spent on any community.",                                   attrib: "Nick Mohler" },
];
const STATS = [
  { kicker: "MEMBERS WORLDWIDE",       num: "400K+", unit: "BUILDERS STRONG",     sub: "One community. Every timezone." },
  { kicker: "THE ROOM IS PACKED",      num: "1300+", unit: "PEOPLE GOING",        sub: "Two days, together in the room." },
  { kicker: "SHIPPED BY THE COMMUNITY",num: "100K+", unit: "AUTOMATIONS SHIPPED", sub: "Real workflows. Real businesses." },
  { kicker: "THE WORLD IS WATCHING",   num: "40M+",  unit: "VIEWS & COUNTING",    sub: "They watch. We build." },
];

// ---------------------------------------------------------------------------
// MEMBER WINS — real community win posts (screenshots from Yash's wins folder,
// same verified set as Block 1). Shown in slices after the testimonial reel +
// woven through the filler pool — ≥20 scattered across the build (Aidan 2026-07-08).
// Numbers verbatim from the posts.
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
const WINS_PER_PASS = 5;
// deterministic slice w/ wraparound — pass(n) is evaluated twice during assembly,
// so win selection must be a pure function of position, never a stateful cursor
const winSlice = (start, count) =>
  Array.from({ length: count }, (_, i) => ({ type: "win", dur: 8, ...WINS[(start + i) % WINS.length] }));

// ---------------------------------------------------------------------------
// BEAT PROGRAM — pass(n): cert feature -> AIS+ -> sponsors -> testimonials ->
// discovery-call prompt -> afternoon agenda -> proof/reset. Copy varies per pass.
// ---------------------------------------------------------------------------
const HEROES = [
  { pre: "Refuel. ", accent: "Then we earn." },
  { pre: "Lunch now. ", accent: "Pricing next." },
  { pre: "The afternoon is ", accent: "loaded." },
  { pre: "Eat. Reset. ", accent: "Earn." },
  { pre: "Big afternoon ", accent: "ahead." },
];
const EXPO_TAGS = [
  { pre: "Grab lunch, ", accent: "stay close.", sub: "We're back on the main stage at 2:10 CT." },
  { pre: "Best time to ", accent: "work the floor.", sub: "The whole community is out of session right now." },
  { pre: "Make one connection ", accent: "over lunch.", sub: "That's the whole assignment." },
  { pre: "Booths are ", accent: "wide open.", sub: "No lines during lunch. Go say hi." },
  { pre: "Eat fast, ", accent: "network slow.", sub: "Networking rooms run all lunch." },
];
const PRACTICE_TAGS = [
  { pre: "Run reps on what you ", accent: "just watched.", sub: "Paired matching, five-minute structured rounds, feedback every round." },
  { pre: "You watched the call. ", accent: "Now run one.", sub: "The Discovery Call Practice room pairs you up automatically." },
];
const BACK_TAGS = [
  { pre: "We're back at ", accent: "2:10 CT.", sub: "Welcome Back: Sales Call Recap + Intro to Pricing" },
  { pre: "Main stage returns ", accent: "2:10 CT.", sub: "Nate Herk + Jon Morrow pull the sales call apart" },
];

// AIS Certification feature segment — mounted launch video when it lands,
// visibly-marked placeholder until then (Aidan 2026-07-08). Real certification
// messaging comes from Russ's #7 launch video. Do NOT deliver with this slot in.
const CERT_SEGMENT = CERT
  ? [{ type: "mount", video: CERT, dur: +(CERT.dur + MOUNT_HOLD).toFixed(3) }]
  : [{ type: "slot", dur: 16, eyebrow: "AIS CERTIFICATION PROGRAMME",
       label: "CERT LAUNCH VIDEO", note: "[ TBC · drops in at assets/video/cert-launch.mp4 ]" }];

function pass(n) {
  const spot = SPOTLIGHTS[n % SPOTLIGHTS.length];
  const withMembership = n % 2 === 0; // ad every other pass — no ad fatigue over 35 min
  return [
    // ---- open ----
    { type: "hero", dur: 5, eyebrow: "DAY 2 · LUNCH · BACK AT 2:10 CT", ...HEROES[n % HEROES.length] },

    // ---- 1 · AIS CERTIFICATION (feature) — "AIS Certified", NOT AIS+ (Aidan 2026-07-08) ----
    { type: "tagline", dur: 8, eyebrow: "LAUNCHED THIS WEEKEND · AIS CERTIFICATION",
      pre: "Get AIS ", accent: "Certified.", sub: "The credential that proves you can build and sell real AI services" },
    ...CERT_SEGMENT,

    // ---- 2 · AIS+ MEMBERSHIP (mounted ad on alternating passes) ----
    { type: "tagline", dur: 9, eyebrow: "AIS+ MEMBERS",
      ...(withMembership
        ? { pre: "Every workshop template is ", accent: "saved for members.", sub: "Build along this weekend, keep the templates forever." }
        : { pre: "Membership questions? ", accent: "Ask at the booth.", sub: "Nate takes a full pass at AIS+ at the close, 5:45 PM." }) },
    ...(withMembership
      ? [{ type: "mount", video: VID.membership, dur: +(VID.membership.dur + MOUNT_HOLD).toFixed(3) }]
      : []),

    // ---- 3 · SPONSOR REEL — HyperAgent + Glaido (NO Clay, out per Aidan 2026-07-08) ----
    // Pass 1 carries the FULL 18:25 keynote replay (plays ONCE — Aidan 2026-07-08);
    // later passes hold the 60s spotlight card (or the hyperagent-60 spot drop-in).
    ...(n === 0
      ? [
          { type: "tagline", dur: 8, eyebrow: "REPLAY · PRESENTING SPONSOR · HYPERAGENT",
            pre: "The keynote, ", accent: "again.", sub: "Alex McDonnell: The New Standard, Why You Need a Fleet of Always-On Agents" },
          { type: "mount", video: VID.keynote, dur: +(VID.keynote.dur + MOUNT_HOLD).toFixed(3) },
        ]
      : [
          { type: "hero", dur: 5, eyebrow: "THANK YOU", pre: "The sponsors ", accent: "behind AIS LIVE." },
          ...(H60
            ? [{ type: "mount", video: H60, dur: +(H60.dur + MOUNT_HOLD).toFixed(3) }]
            : [{ type: "sponsor", dur: 60, eyebrow: "OUR SPONSORS", logos: [{ src: "hyperagent-white-big", hgt: 130, role: "PRESENTING SPONSOR" }] }]),
        ]),
    { type: "sponsor", dur: 10, eyebrow: "OUR SPONSORS", logos: [{ src: "glaido-white", hgt: 150, role: "SPONSOR" }] },

    // ---- 4 · COMMUNITY TESTIMONIALS (alternating reel per pass) + member wins ----
    { type: "hero", dur: 5, eyebrow: "FROM THE COMMUNITY",
      ...(n % 2 === 0 ? { pre: "Real members. ", accent: "Real numbers." } : { pre: "Real builds. ", accent: "Real paydays." }) },
    { type: "mount", video: n % 2 === 0 ? VID.building : VID.earning,
      dur: +((n % 2 === 0 ? VID.building : VID.earning).dur + MOUNT_HOLD).toFixed(3) },
    // member win posts — fresh slice each pass, right after the reel
    ...winSlice(n * WINS_PER_PASS, WINS_PER_PASS),

    // ---- 5 · DISCOVERY CALL PRACTICE (v7.1 lunch live activity) ----
    { type: "action", dur: 9, eyebrow: "LUNCH · LIVE ACTIVITY", pre: "Practice a ", accent: "Discovery Call.",
      sub: "The practice room is open right now, all lunch." },
    { type: "tagline", dur: 9, eyebrow: "DISCOVERY CALL PRACTICE", ...PRACTICE_TAGS[n % PRACTICE_TAGS.length] },
    { type: "tagline", dur: 9, ...EXPO_TAGS[n % EXPO_TAGS.length] },

    // ---- 6 · AFTERNOON AGENDA — what's coming ----
    { type: "agenda", dur: 34, eyebrow: "DAY 2 · THIS AFTERNOON", rows: AFTERNOON, caption: "All times Central" },
    { type: "tagline", dur: 10, eyebrow: "UP NEXT · MAIN STAGE · 2:10 PM",
      pre: "Sales call recap + ", accent: "intro to pricing.", sub: "Nate Herk + Jon Morrow, live on the main stage" },
    { type: "tagline", dur: 9, eyebrow: "ALSO THIS AFTERNOON", ...spot },

    // ---- 7 · PROOF + RESET (soft-loop seam back to the cert feature) ----
    { type: "stat", dur: 7, ...STATS[n % STATS.length] },
    { type: "quote", dur: 8, ...QUOTES[(2 * n) % QUOTES.length] },
    { type: "quote", dur: 8, ...QUOTES[(2 * n + 1) % QUOTES.length] },
    { type: "tagline", dur: 8, ...BACK_TAGS[n % BACK_TAGS.length] },
    { type: "markflash", dur: 8, sub: "Day 2 · Lunch · Back at 2:10 CT" },
  ];
}

// ---------------------------------------------------------------------------
// ASSEMBLY — as many full passes as fit, then filler-pool beats, then the
// fixed outro. Pad rides the outro markflash so TOTAL lands on 2100s exactly.
// ---------------------------------------------------------------------------
const OUTRO = [
  { type: "hero", dur: 6, eyebrow: "STARTING NEXT · MAIN STAGE", pre: "Back in the ", accent: "room." },
  { type: "tagline", dur: 12, eyebrow: "MAIN STAGE · 2:10 PM",
    pre: "Sales call recap + ", accent: "intro to pricing.", sub: "Nate Herk + Jon Morrow, starting now on the main stage" },
  { type: "markflash", dur: 10, sub: "Day 2 · The afternoon starts now." },
];
const sum = arr => arr.reduce((s, b) => s + b.dur, 0);
const outroDur = sum(OUTRO);

const BEATS = [];
let p = 0;
// full passes while a whole pass + outro still fits
while (sum(BEATS) + sum(pass(p)) + outroDur <= TARGET) { BEATS.push(...pass(p)); p++; }
const PASSES = p;

// soft-loop filler pool — light rotating proof/prompt cards (no mounts, no ads).
// Every OTHER filler beat is a member-win screenshot (continuing the pass rotation)
// so wins land scattered through the tail of the build too.
const FILLER = [
  { type: "quote", dur: 8, ...QUOTES[4] },
  { type: "stat", dur: 7, ...STATS[(PASSES) % STATS.length] },
  { type: "action", dur: 9, eyebrow: "STILL LUNCH", pre: "Booths are ", accent: "still open.", sub: "A few minutes left to work the floor." },
  { type: "agenda", dur: 30, eyebrow: "DAY 2 · THIS AFTERNOON", rows: AFTERNOON, caption: "All times Central" },
  { type: "quote", dur: 8, ...QUOTES[5] },
  { type: "tagline", dur: 9, eyebrow: "DISCOVERY CALL PRACTICE", pre: "Still time to ", accent: "run a rep.",
    sub: "Five-minute rounds until 2:10." },
  { type: "tagline", dur: 9, pre: "Find your seat by ", accent: "2:10.", sub: "The recap starts on time." },
  { type: "quote", dur: 8, ...QUOTES[6] },
  { type: "stat", dur: 7, ...STATS[(PASSES + 1) % STATS.length] },
  { type: "markflash", dur: 8, sub: "Day 2 · Lunch · Back at 2:10 CT" },
];
// greedy fill — alternate member-win / pool beat; skip candidates that don't fit
// and keep trying smaller ones, so the exact-landing pad stays short
let f = 0, fUsed = 0, misses = 0, wf = PASSES * WINS_PER_PASS;
while (misses < FILLER.length + 1) {
  const wantWin = f % 2 === 1;
  const cand = wantWin ? winSlice(wf, 1)[0] : FILLER[Math.floor(f / 2) % FILLER.length];
  if (sum(BEATS) + cand.dur + outroDur <= TARGET) {
    BEATS.push({ ...cand });
    if (wantWin) wf++;
    fUsed++; misses = 0;
  } else misses++;
  f++;
}
f = fUsed;
BEATS.push(...OUTRO.map(b => ({ ...b })));
// exact-landing pad — extra hold on the final markflash
const pad = +(TARGET - sum(BEATS)).toFixed(3);
BEATS[BEATS.length - 1].dur += pad;

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

    case "sponsor": {
      // explicit height so lockups render main-stage sized, not at natural px
      const logos = b.logos.map(l =>
        `<div class="logo"><div class="logobox"><img src="assets/sponsors/${l.src}.png" alt="" style="height:${l.hgt}px" /></div>${l.role ? `<div class="logorole">${l.role}</div>` : ""}</div>`).join("");
      return `${eyeb(b)}<div class="logorow">${logos}</div>${sub(b.caption)}`;
    }

    case "agenda": {
      const rows = b.rows.map(r =>
        `<div class="agrow"><span class="agt">${r.t}</span><span class="agl">${plusMark(r.label)}</span></div>`).join("");
      return `${eyeb(b)}<div class="agenda">${rows}</div>${sub(b.caption)}`;
    }

    case "slot":
      return `${eyeb(b)}
        <div class="slotbox">
          <div class="slotlab">${b.label}</div>
          <div class="slotnote">${b.note}</div>
        </div>`;

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
`      <section id="${s}" class="scene clip" data-start="${+start.toFixed(3)}" data-duration="${win}" data-track-index="${track}">
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
  } else if (b.type === "sponsor") {
    tj.push(`      glowIn("#${s} .logo", ${S(0.34)}, 0.14);`);
  } else if (b.type === "agenda") {
    tj.push(`      slideX("#${s} .agrow", ${S(0.30)}, 0.07);`);
  } else if (b.type === "slot") {
    tj.push(`      pop("#${s} .slotbox", ${S(0.30)});`);
    tj.push(`      drift("#${s} .slotbox", ${S(1.6)}, ${+((b.dur - 2.2) / 4.8).toFixed(2)});`);
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
  if ((b.sub || b.caption) && b.type !== "win") tj.push(`      drop("#${s} .sub", ${S(b.type === "quote" ? 0.95 : 0.82)});`);

  // ---- long-hold ambient: gentle drift on signage so nothing sits dead ----
  if ((b.type === "agenda" || b.type === "sponsor") && b.dur > 16) {
    const box = b.type === "agenda" ? ".agenda" : ".logorow";
    tj.push(`      drift("#${s} ${box}", ${S(2.0)}, ${+((b.dur - 3.0) / 4.8).toFixed(2)});`);
  }

  // ---- exit ----
  if (last) tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 0.9)});`);
  else tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
  // hard kill at the clip boundary — non-linear seek must land on a clean autoAlpha:0
  if (!last) tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
  tj.push(``);

  t += b.dur;
});

const D = +t.toFixed(3);
if (Math.abs(D - TARGET) > 0.01) throw new Error(`duration drift: ${D} != ${TARGET}`);

// ambient cycle counts — fixed short periods (a 35-min half-cycle reads as static);
// even segment counts so yoyo motion returns to rest at the end
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
    <title>AIS LIVE — Block 7: Day 2 Lunch / Afternoon (${(D / 60).toFixed(1)} min)</title>
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

      /* AIS+ product mark — ALL WHITE incl. the +, never tinted (directives) */
      .plus{font-family:var(--font-display);font-style:italic;font-weight:900;color:#fff;letter-spacing:-.02em;}
      .plus .p{color:#fff;}

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
      .agenda{display:flex;flex-direction:column;gap:14px;width:max-content;max-width:1680px;will-change:transform;}
      .agrow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-body);font-weight:700;font-size:38px;color:#fff;text-align:left;will-change:transform,opacity;}
      .agt{font-family:var(--font-mono);font-weight:700;font-size:22px;color:var(--blue);min-width:130px;letter-spacing:.04em;}

      /* ---------- member win card: summary left, post screenshot right ---------- */
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
    <div id="stage" data-composition-id="cmp-day2-lunch-fill" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      function shotIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,x:70,rotationY:-14,filter:"blur(8px)"},
        {autoAlpha:1,x:0,rotationY:0,filter:"blur(0px)",duration:.65,ease:"power3.out"},at); }
      // gentle float during long signage holds — cards/lists only, never headline type
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

      /* ---- AMBIENT — camera never sleeps; short fixed cycles (a 35-min half-cycle
             would read as static), even segment counts so yoyo motion ends at rest ---- */
      tl.to("#camera", { scale:1.035, y:-16, duration:D/${CAM}, yoyo:true, repeat:${CAM - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=1716px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=1716px", duration:D, ease:"none" }, 0);
      tl.to(".beam",     { rotation:8, duration:D/${BEAM}, yoyo:true, repeat:${BEAM - 1}, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/${FLICK}, yoyo:true, repeat:${FLICK - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:44, y:-24, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.coral",{ x:-36, y:22, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/${VIG}, yoyo:true, repeat:${VIG - 1}, ease:"sine.inOut" }, 0);
      // live-dot pulse — the only ambient motion on the SOLID mark (brand)
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(TARGET / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(TARGET / 1.6) - 1}, ease:"none" }, 0);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // Law #11 — fill the slot
      window.__timelines["cmp-day2-lunch-fill"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(SRC, "day2-lunch-fill.html"), html);
const winCount = BEATS.filter(b => b.type === "win").length;
console.log(`wrote cards/day2-lunch-fill.html — ${BEATS.length} beats, ${PASSES} passes + ${f} filler beats + outro, ${D}s (${(D / 60).toFixed(2)} min), pad ${pad}s`
  + ` · keynote 18:25 MOUNTED (once, pass 1) · ${winCount} member-win cards`
  + (H60 ? " · HyperAgent 60s spot MOUNTED" : "")
  + (CERT ? " · cert launch video MOUNTED" : " · CERT VIDEO NOT PRESENT — dashed PLACEHOLDER in its slot, DO NOT DELIVER"));
if (winCount < 20) console.warn(`WARNING: only ${winCount} member-win cards — Aidan asked for at least 20`);
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "day2-lunch-fill.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/day2-lunch-fill.html");
}
