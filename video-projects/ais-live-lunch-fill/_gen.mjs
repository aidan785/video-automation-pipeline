// AIS LIVE — Block 3: LUNCH / AFTERNOON PREVIEW (main stage, 2:00-2:35 CT, Day 1).
// Brief: 35-min build that RUNS ONCE and fills the whole window (no loop).
// Program (per production direction), assembled in order each pass:
//   1. AFTERNOON  — what's coming this afternoon (agenda + spotlights, VIP directing)
//   2. EXPO       — networking + expo prompt (lunch pacing)
//   3. AIS+       — membership information (mounted ad on alternating passes)
//   4. SPONSORS   — HyperAgent + Glaido logo beats; in pass 1 ONLY (~9:05) the
//                   HyperAgent slot becomes: 5s presenting-sponsor card -> the full
//                   18:25 HyperAgent keynote (with audio, plays ONCE) -> Glaido
//   5. TESTIMONIAL— community reels (#4 building / #5 earning, alternating), each
//                   followed by 3 member-win cards (screenshots from the wins folder)
//   6. soft loop  — proof/reset beats; a filler pool tops the build up to 35:00,
//                   then a fixed outro lands on "up next at 2:35" as the window ends.
//
// The build is N varied passes of that sequence (copy variants, alternating reels,
// membership ad every other pass to avoid ad fatigue), then filler-pool beats, then
// the outro. TOTAL is pinned to exactly 2100s (35:00) — the pad rides the outro hold.
//
// Engine forked from ais-live-workshop-block1-fill/_gen.mjs (command-deck style:
// depth grid tunnel, beam, chrome type, whip cuts, breathing vignette, grain,
// solid AIS/LIVE mark w/ live dot). New beat type here:
//   rooms — the VIP working-sessions card (5 rooms, title + facilitator rows)
//
// AUDIO: mounted pieces (AIS+ ad, testimonial reels, HyperAgent spot) keep their
// voice audio; every authored card is silent — venue runs the music bed underneath.
//
//   node _gen.mjs         -> writes cards/lunch-fill.html
//   node _gen.mjs --set   -> also copies it to index.html (active for preview/render)

import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const TARGET = 2100; // 35:00 exactly — plays once, fills the 2:00-2:35 window

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
  membership: { file: "ais-plus-membership",  dur: probe("ais-plus-membership.mp4"),  audio: true },
  building:   { file: "testi-building",       dur: probe("testi-building.mp4"),       audio: true },
  earning:    { file: "testi-earning",        dur: probe("testi-earning.mp4"),        audio: true },
  // the 18:25 HyperAgent keynote (same piece Block 1 mounts) — plays ONCE, in pass 1
  keynote:    { file: "hyperagent-keynote",   dur: probe("hyperagent-keynote.mp4"),   audio: true },
};

// ---------------------------------------------------------------------------
// AFTERNOON PROGRAM — Agenda v7.1 (doc 1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18)
// all times Central, verbatim; all-blue accents per the live-asset directives
// ---------------------------------------------------------------------------
const AFTERNOON = [
  { t: "2:00 PM", label: "Lunch + Practice, Networking rooms + Expo open" },
  { t: "2:00 PM", label: "VIP Working Sessions, 5 rooms" },
  { t: "2:35 PM", label: "Featured: Run an Entire AI Agency Using Claude Code" },
  { t: "3:00 PM", label: "Break + Visit the Expo" },
  { t: "3:10 PM", label: "Workshop Block 2 (Foundation + Advanced)" },
  { t: "4:10 PM", label: "Break + Visit the Expo" },
  { t: "4:20 PM", label: "Workshop 3: Enterprise AI Services" },
  { t: "5:05 PM", label: "Get AIS+ Certified" },
  { t: "5:20 PM", label: "Day 1 Closing Remarks" },
];
const VIP_ROOMS = [
  { title: "Land Your First Paying Client",      spk: "Jon Morrow" },
  { title: "Turn Your Expertise Into a Service", spk: "Jenn Van Wagner" },
  { title: "Price It Right",                     spk: "Russ Henneberry" },
  { title: "Scope to Ship",                      spk: "Kodi Zene" },
  { title: "Tooling Reset",                      spk: "Meghan Cox" },
];
const WB2 = [
  { lab: "FOUNDATION", title: "Build Your First AI Content Engine", spk: "Sabrina Ramonov" },
  { lab: "ADVANCED",   title: "Build a Voice AI Sales Rep",          spk: "Samin Yasar" },
];
// per-pass afternoon spotlight (rotates so back-to-back passes don't read identical)
const SPOTLIGHTS = [
  { pre: "Enterprise ", accent: "AI Services.", sub: "Workshop 3, 4:20 PM, Tangy Frederick" },
  { pre: "Get AIS+ ", accent: "Certified.", sub: "Main stage, 5:05 PM, Ednan Abdullayev", plus: true },
  { pre: "Day 1 ", accent: "Closing Remarks.", sub: "5:20 PM, Nate Herk, plus the overnight challenge" },
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
// MEMBER WINS — real community win posts (screenshots ported from the Block 1
// wins folder, numbers verbatim from the posts). 3 rotate in after each
// testimonial reel; selection is index-math (no cursor — pass() runs twice).
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
const WINS_PER_REEL = 3;
const winsFor = n => Array.from({ length: WINS_PER_REEL },
  (_, i) => ({ type: "win", dur: 8, ...WINS[(n * WINS_PER_REEL + i) % WINS.length] }));

const STATS = [
  { kicker: "MEMBERS WORLDWIDE",       num: "400K+", unit: "BUILDERS STRONG",     sub: "One community. Every timezone." },
  { kicker: "THE ROOM IS PACKED",      num: "1300+", unit: "PEOPLE GOING",        sub: "Two days, together in the room." },
  { kicker: "SHIPPED BY THE COMMUNITY",num: "100K+", unit: "AUTOMATIONS SHIPPED", sub: "Real workflows. Real businesses." },
  { kicker: "THE WORLD IS WATCHING",   num: "40M+",  unit: "VIEWS & COUNTING",    sub: "They watch. We build." },
];

// ---------------------------------------------------------------------------
// BEAT PROGRAM — pass(n): afternoon preview -> expo/networking -> AIS+ ->
// sponsors -> testimonials -> proof/reset. Copy varies per pass.
// ---------------------------------------------------------------------------
const HEROES = [
  { pre: "The afternoon is ", accent: "loaded." },
  { pre: "Lunch now. ", accent: "Build next." },
  { pre: "Halfway there. ", accent: "It gets bigger." },
  { pre: "Refuel. ", accent: "Then we build." },
  { pre: "Big afternoon ", accent: "ahead." },
];
const EXPO_TAGS = [
  { pre: "Grab lunch, ", accent: "stay close.", sub: "We're back on the main stage at 2:35 CT." },
  { pre: "Best time to ", accent: "work the floor.", sub: "The whole community is out of session right now." },
  { pre: "Make one connection ", accent: "over lunch.", sub: "That's the whole assignment." },
  { pre: "Booths are ", accent: "wide open.", sub: "No lines during lunch. Go say hi." },
  { pre: "Eat fast, ", accent: "network slow.", sub: "Networking rooms run all lunch." },
];
const BACK_TAGS = [
  { pre: "We're back at ", accent: "2:35 CT.", sub: "Featured: Run an Entire AI Agency Using Claude Code" },
  { pre: "Main stage returns ", accent: "2:35 CT.", sub: "Kacper Rutkiewicz, live on the main stage" },
];

function pass(n) {
  const spot = SPOTLIGHTS[n % SPOTLIGHTS.length];
  const withMembership = n % 2 === 0; // ad every other pass — no ad fatigue over 35 min
  return [
    // ---- 1 · AFTERNOON PREVIEW — what's coming ----
    { type: "hero", dur: 5, eyebrow: "LUNCH BREAK · BACK AT 2:35 CT", ...HEROES[n % HEROES.length] },
    { type: "agenda", dur: 34, eyebrow: "DAY 1 · THIS AFTERNOON", rows: AFTERNOON, caption: "All times Central" },
    { type: "tagline", dur: 10, eyebrow: "UP NEXT · FEATURED SESSION · 2:35 PM",
      pre: "Run an entire AI agency using ", accent: "Claude Code.", sub: "Kacper Rutkiewicz, live on the main stage" },
    { type: "rooms", dur: 26, tag: "VIP · WORKING SESSIONS · LIVE NOW UNTIL 2:35", rows: VIP_ROOMS,
      sub: "VIP? Your working sessions are running right now. Pick a room." },
    { type: "worksplit", dur: 26, time: "3:10", tag: "WORKSHOP BLOCK 2 · THIS AFTERNOON · PICK YOUR ROOM",
      tracks: WB2, sub: "Same two rooms. Round two." },
    { type: "tagline", dur: 9, eyebrow: "ALSO THIS AFTERNOON", ...spot },

    // ---- 2 · NETWORKING + EXPO ----
    { type: "action", dur: 9, eyebrow: "LUNCH · 35 MIN", pre: "Visit the ", accent: "Expo.",
      sub: "Sponsor booths are open all lunch." },
    { type: "action", dur: 9, eyebrow: "LUNCH · 35 MIN", pre: "Jump into ", accent: "Networking.",
      sub: "Meet the people you'll build with." },
    { type: "tagline", dur: 9, ...EXPO_TAGS[n % EXPO_TAGS.length] },

    // ---- 3 · AIS+ MEMBERSHIP (mounted ad on alternating passes) ----
    { type: "tagline", dur: 9, eyebrow: "AIS+ MEMBERS", plus: true,
      ...(withMembership
        ? { pre: "Every workshop template is ", accent: "saved for members.", sub: "Build along today, keep the templates forever." }
        : { pre: "Membership questions? ", accent: "Ask at the booth.", sub: "And get AIS+ Certified at 5:05 PM today." }) },
    ...(withMembership
      ? [{ type: "mount", video: VID.membership, dur: +(VID.membership.dur + MOUNT_HOLD).toFixed(3) }]
      : []),

    // ---- 4 · SPONSOR REEL — HyperAgent + Glaido (Clay removed 2026-07-07, no longer a sponsor).
    //         Pass 1 ONLY: 5s presenting-sponsor card, then the 18:25 keynote (once), then Glaido.
    { type: "hero", dur: 5, eyebrow: "THANK YOU", pre: "The sponsors ", accent: "behind AIS LIVE." },
    ...(n === 1
      ? [{ type: "sponsor", dur: 5, eyebrow: "OUR PRESENTING SPONSOR", logos: [{ src: "hyperagent-white-big", hgt: 130, role: "PRESENTING SPONSOR" }] },
         { type: "mount", video: VID.keynote, dur: +(VID.keynote.dur + MOUNT_HOLD).toFixed(3) }]
      : [{ type: "sponsor", dur: 10, eyebrow: "OUR SPONSORS", logos: [{ src: "hyperagent-white-big", hgt: 130, role: "PRESENTING SPONSOR" }] }]),
    { type: "sponsor", dur: 10, eyebrow: "OUR SPONSORS", logos: [{ src: "glaido-white", hgt: 150, role: "SPONSOR" }] },

    // ---- 5 · COMMUNITY TESTIMONIALS (alternating reel per pass) + member wins ----
    { type: "hero", dur: 5, eyebrow: "FROM THE COMMUNITY",
      ...(n % 2 === 0 ? { pre: "Real members. ", accent: "Real numbers." } : { pre: "Real builds. ", accent: "Real paydays." }) },
    { type: "mount", video: n % 2 === 0 ? VID.building : VID.earning,
      dur: +((n % 2 === 0 ? VID.building : VID.earning).dur + MOUNT_HOLD).toFixed(3) },
    ...winsFor(n),

    // ---- 6 · PROOF + RESET (soft-loop seam back to the afternoon preview) ----
    { type: "stat", dur: 7, ...STATS[n % STATS.length] },
    { type: "quote", dur: 8, ...QUOTES[(2 * n) % QUOTES.length] },
    { type: "quote", dur: 8, ...QUOTES[(2 * n + 1) % QUOTES.length] },
    { type: "tagline", dur: 8, ...BACK_TAGS[n % BACK_TAGS.length] },
    { type: "markflash", dur: 8, sub: "Day 1 · Lunch · Back at 2:35 CT" },
  ];
}

// ---------------------------------------------------------------------------
// ASSEMBLY — as many full passes as fit, then filler-pool beats, then the
// fixed outro. Pad rides the outro markflash so TOTAL lands on 2100s exactly.
// ---------------------------------------------------------------------------
const OUTRO = [
  { type: "hero", dur: 6, eyebrow: "STARTING NEXT · MAIN STAGE", pre: "Back in the ", accent: "room." },
  { type: "tagline", dur: 12, eyebrow: "FEATURED SESSION · 2:35 PM",
    pre: "Run an entire AI agency using ", accent: "Claude Code.", sub: "Kacper Rutkiewicz, starting now on the main stage" },
  { type: "markflash", dur: 10, sub: "Day 1 · The afternoon starts now." },
];
const sum = arr => arr.reduce((s, b) => s + b.dur, 0);
const outroDur = sum(OUTRO);

const BEATS = [];
let p = 0;
// full passes while a whole pass + outro still fits
while (sum(BEATS) + sum(pass(p)) + outroDur <= TARGET) { BEATS.push(...pass(p)); p++; }
const PASSES = p;

// soft-loop filler pool — light rotating proof/prompt cards (no mounts, no ads)
const FILLER = [
  { type: "quote", dur: 8, ...QUOTES[4] },
  { type: "stat", dur: 7, ...STATS[(PASSES) % STATS.length] },
  { type: "action", dur: 9, eyebrow: "STILL LUNCH", pre: "Booths are ", accent: "still open.", sub: "A few minutes left to work the floor." },
  { type: "agenda", dur: 30, eyebrow: "DAY 1 · THIS AFTERNOON", rows: AFTERNOON, caption: "All times Central" },
  { type: "quote", dur: 8, ...QUOTES[5] },
  { type: "tagline", dur: 9, pre: "Find your seat by ", accent: "2:35.", sub: "The featured session starts on time." },
  { type: "quote", dur: 8, ...QUOTES[6] },
  { type: "stat", dur: 7, ...STATS[(PASSES + 1) % STATS.length] },
  { type: "worksplit", dur: 22, time: "3:10", tag: "WORKSHOP BLOCK 2 · THIS AFTERNOON · PICK YOUR ROOM",
    tracks: WB2, sub: "Foundation or Advanced. Decide over lunch." },
  { type: "markflash", dur: 8, sub: "Day 1 · Lunch · Back at 2:35 CT" },
];
let f = 0;
while (sum(BEATS) + FILLER[f % FILLER.length].dur + outroDur <= TARGET) {
  BEATS.push({ ...FILLER[f % FILLER.length] });
  f++;
}
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
const eyebTxt = t => t ? `<div class="eyebrow">${t}</div>` : "";
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

    case "rooms": {
      const rows = b.rows.map(r =>
        `<div class="rmrow"><span class="rmtitle">${r.title}</span><span class="rmspk">${r.spk}</span></div>`).join("");
      return `${eyebTxt(b.tag)}<div class="roomlist">${rows}</div>${sub(b.sub)}`;
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
  if (b.eyebrow || b.tag) tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
  if (["welcome", "tagline", "hero", "action"].includes(b.type)) {
    tj.push(`      words("#${s} .ln .wd", ${S(0.24)});`);
  } else if (b.type === "quote") {
    tj.push(`      words("#${s} .quoteln .wd", ${S(0.26)});`);
    tj.push(`      drop("#${s} .attrib", ${S(0.95)});`);
  } else if (b.type === "win") {
    tj.push(`      drop("#${s} .peyebrow", ${S(0.14)});`);
    tj.push(`      words("#${s} .winhead .wd", ${S(0.28)});`);
    tj.push(`      drop("#${s} .winsub", ${S(0.75)});`);
    tj.push(`      drop("#${s} .winname", ${S(0.92)});`);
    tj.push(`      shotIn("#${s} .winshot", ${S(0.4)});`);
    tj.push(`      drift("#${s} .winshot", ${S(1.8)}, ${+((b.dur - 2.4) / 4.8).toFixed(2)});`);
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
  } else if (b.type === "rooms") {
    tj.push(`      slideX("#${s} .rmrow", ${S(0.30)}, 0.09);`);
  } else if (b.type === "worksplit") {
    tj.push(`      pop("#${s} .time", ${S(0.22)}, .55);`);
    tj.push(`      slideFrom("#${s} .wleft", ${S(0.40)}, -70);`);
    tj.push(`      slideFrom("#${s} .wright", ${S(0.52)}, 70);`);
    tj.push(`      drift("#${s} .wscard", ${S(1.6)}, ${+((b.dur - 2.2) / 4.8).toFixed(2)});`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub || b.caption) tj.push(`      drop("#${s} .sub", ${S(b.type === "quote" ? 0.95 : (b.type === "worksplit" || b.type === "rooms") ? 1.15 : 0.82)});`);

  // ---- long-hold ambient: gentle drift on signage so nothing sits dead ----
  if ((b.type === "agenda" || b.type === "rooms" || b.type === "sponsor") && b.dur > 16) {
    const box = b.type === "agenda" ? ".agenda" : b.type === "rooms" ? ".roomlist" : ".logorow";
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
    <title>AIS LIVE — Block 3: Lunch / Afternoon Preview (${(D / 60).toFixed(1)} min)</title>
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

      /* ---------- member win card: summary left, post screenshot right ---------- */
      .winwrap{position:absolute;inset:0;display:flex;align-items:center;gap:70px;padding:80px 110px 90px 150px;}
      .wintext{flex:0 0 760px;display:flex;flex-direction:column;align-items:flex-start;text-align:left;}
      .peyebrow{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.32em;text-transform:uppercase;
        color:var(--blue);margin-bottom:26px;text-shadow:0 0 16px rgba(55,189,248,.45);will-change:transform,opacity;}
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

      /* VIP working-session rooms */
      .roomlist{display:flex;flex-direction:column;gap:20px;width:max-content;max-width:1560px;will-change:transform;}
      .rmrow{display:flex;align-items:baseline;gap:34px;text-align:left;will-change:transform,opacity;}
      .rmtitle{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:52px;line-height:1.14;
        letter-spacing:-.02em;color:#fff;text-shadow:0 0 24px rgba(255,255,255,.16);padding-bottom:.06em;}
      .rmspk{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.06em;color:var(--blue);white-space:nowrap;}

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
    <div id="stage" data-composition-id="cmp-lunch-fill" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
      window.__timelines["cmp-lunch-fill"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(SRC, "lunch-fill.html"), html);
const kAt = BEATS.slice(0, BEATS.findIndex(b => b.type === "mount" && b.video === VID.keynote)).reduce((s, b) => s + b.dur, 0);
console.log(`wrote cards/lunch-fill.html — ${BEATS.length} beats, ${PASSES} passes + ${f} filler beats + outro, ${D}s (${(D / 60).toFixed(2)} min), pad ${pad}s · keynote (${(VID.keynote.dur / 60).toFixed(1)} min) mounts once at ${Math.floor(kAt / 60)}:${String(Math.round(kAt % 60)).padStart(2, "0")}`);
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "lunch-fill.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/lunch-fill.html");
}
