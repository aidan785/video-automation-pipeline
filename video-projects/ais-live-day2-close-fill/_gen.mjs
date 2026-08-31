// AIS LIVE — Block 8: CLOSING STAGE LOOP (End of Day 2 / general room during the
// VIP After-Party, 6:10-7:10 PM Day 2). LOOPS through the After-Party hour.
// The Closing Sizzle plays ONCE at the very end of Nate's close (6:08) — separate
// from this loop; this loop is membership + sponsors + community.
//
// Assembled in the production order (per Aidan's Block 8 brief):
//   1. WRAP OPEN        — that's a wrap on AIS LIVE (two days, one community)
//   2. AIS+ MEMBERSHIP  — welcome new members + the mounted 66s ad (voice audio)
//   3. SPONSOR THANK-YOU— HyperAgent 60s (spot mounts 1:1 when it lands; logo
//                         spotlight card holds the slot) + Glaido. NO Clay
//                         (removed as sponsor 2026-07-07, applies event-wide,
//                         reconfirmed by Aidan for Block 8 on 2026-07-08).
//   4. HIGHLIGHTS       — two-day recap (verbatim titles, NO times: Day 2 times
//                         unverified against the latest agenda) + testimonial
//                         reels (mounted) + fresh community-voice clips (native)
//   5. LOOP SEAM        — calm settling markflash back into the wrap open
//
// LOOP SEAM (doors-open-loop pattern): ends on a calm settling markflash, D padded
// up to the next 1.6s ambient beat so the live-dot pulse + yoyo cycles tile at the
// wrap; grid scroll is 1716px = 26 x 66px so it tiles too.
//
// AUDIO: mounted pieces (AIS+ ad, testimonial reels, HyperAgent spot when it
// lands) and community-voice clips keep their voice audio; every authored card
// is silent — the room runs a music bed underneath.
//
//   node _gen.mjs         -> writes cards/day2-close-fill.html
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
const probe = p => {
  const d = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${join(DIR, p)}"`).toString().trim();
  return Math.floor(d * 30) / 30;
};
const MOUNT_HOLD = 0.4; // lastframe hold at the tail so the exit whip rides a real frame
const VID = {
  membership: { file: "ais-plus-membership", dur: probe("assets/video/ais-plus-membership.mp4"), audio: true },
  building:   { file: "testi-building",      dur: probe("assets/video/testi-building.mp4"),      audio: true },
  earning:    { file: "testi-earning",       dur: probe("assets/video/testi-earning.mp4"),       audio: true },
};
// HyperAgent's 60s sponsor spot is sponsor-provided and not delivered yet.
// Drop it at assets/video/hyperagent-60.mp4 (+ re-run _gen.mjs --set) and it
// mounts here 1:1. Until then the slot renders as a finished-looking HyperAgent
// logo spotlight (never a dashed placeholder — this plays in the live room).
const H60 = existsSync(join(DIR, "assets/video/hyperagent-60.mp4"))
  ? { file: "hyperagent-60", dur: probe("assets/video/hyperagent-60.mp4"), audio: true }
  : null;

// ---------------------------------------------------------------------------
// COMMUNITY VOICES — fresh Descript soundbite clips (assets/voices/<slug>.mp4
// + -poster.jpg + -lastframe.jpg). Members NOT in the mounted reels. Quote text
// mirrors what the clip actually says (display line, distilled). Clips that
// haven't landed yet are skipped with a warning so the loop always builds.
// ---------------------------------------------------------------------------
const VOICE_LEAD = 0.6, VOICE_TAIL = 0.8;
const VOICE_DEFS = [
  { file: "tonia-hardeman",       name: "Tonia Hardeman",       quote: "I found my home. I found my tribe." },
  { file: "marvin-martinez",      name: "Marvin Martinez",      quote: "People with your same mindset push you to be better." },
  { file: "jan-goergen-makinson", name: "Jan Goergen Makinson", quote: "My backup team is just the keyboard away." },
  { file: "usman-mohammed",       name: "Usman Mohammed",       quote: "Join for the community. That will remain with you for life." },
  { file: "nick-mohler",          name: "Nick Mohler",          quote: "That's how I met my business partner." },
  { file: "maria-somana",         name: "Maria Somana",         quote: "Put a question and you'll receive ten answers." },
];
const VOICES = VOICE_DEFS.filter(v => {
  const ok = existsSync(join(DIR, `assets/voices/${v.file}.mp4`));
  if (!ok) console.warn(`voice clip missing (skipped): assets/voices/${v.file}.mp4`);
  return ok;
}).map(v => ({ ...v, dur: probe(`assets/voices/${v.file}.mp4`) }));
const voiceBeat = v => ({ type: "voice", v, dur: +(VOICE_LEAD + v.dur + VOICE_TAIL).toFixed(3) });
const BANK1 = VOICES.slice(0, 3).map(voiceBeat);
const BANK2 = VOICES.slice(3).map(voiceBeat);

// ---------------------------------------------------------------------------
// DAY 1 SESSION HIGHLIGHTS — real footage cut from the Day 1 recordings
// (assets/recap/, cloned from Block 5's word-accurate recap clips; cutter lives
// in ais-live-day2-sizzle-clips). Same card as the community voices, but the
// label carries the session tag instead of FROM THE COMMUNITY. One clip per
// Day 1 session flavor, short picks so the loop stays inside the 8-10 min brief.
// ---------------------------------------------------------------------------
const HILITE_DEFS = [
  { file: "recap-dave-no-code-6mo",   name: "Dave Ebbelaar",   role: "AI ENGINEER · DATALUMINA", tag: "DAY 1 · LOW-CODE TO FULL-CODE",
    quote: "I haven't written a single line of code in over six months." },
  { file: "recap-liberty-tribe",      name: "Liberty White",   role: "FOUNDER · SHE LEARNS AI",  tag: "DAY 1 · FIRST 30 DAYS IN AI AUTOMATION",
    quote: "People are waiting for your opinion. Your tribe will find you." },
  { file: "recap-sabrina-zero-edits", name: "Sabrina Ramonov", role: "FOUNDER · BLOTATO",        tag: "DAY 1 · YOUR FIRST AI CONTENT ENGINE",
    quote: "Zero edits. And the post is going viral." },
  { file: "recap-mustafa-value",      name: "Mustafa Tawfiq",  role: "AIS LIVE EVENT TEAM",      tag: "DAY 1 · VIP: SCOPE TO SHIP",
    quote: "What matters is the value you deliver." },
];
const HILITES = HILITE_DEFS.filter(h => {
  const ok = existsSync(join(DIR, `assets/recap/${h.file}.mp4`));
  if (!ok) console.warn(`highlight clip missing (skipped): assets/recap/${h.file}.mp4`);
  return ok;
}).map(h => ({ ...h, dir: "recap", dur: probe(`assets/recap/${h.file}.mp4`) }));
const HILITE_BEATS = HILITES.map(voiceBeat);

// ---------------------------------------------------------------------------
// TWO-DAY HIGHLIGHTS — session titles verbatim (Day 1 from Agenda v7.1, Day 2
// from the doors-open schedule set). Deliberately NO times: Day 2 times are not
// re-verified against the latest agenda, and a recap doesn't need them.
// ---------------------------------------------------------------------------
const HIGHLIGHTS = [
  { t: "DAY 1", label: "Anatomy of Three Real Deals" },
  { t: "DAY 1", label: "The New Standard: A Fleet of Always-On Agents" },
  { t: "DAY 1", label: "Evals, Live" },
  { t: "DAY 1", label: "Run an Entire AI Agency Using Claude Code" },
  { t: "DAY 1", label: "Get AIS+ Certified" },
  { t: "DAY 2", label: "Turn This Into Money" },
  { t: "DAY 2", label: "The Tool War Panel" },
  { t: "DAY 2", label: "The Sales Arc, LIVE" },
  { t: "DAY 2", label: "Ditching Hourly: The Pricing Mindset" },
  { t: "DAY 2", label: "Closing Keynote: Build to Sell" },
];

// verified member quotes (testimonial-soundbites shortlist) — members whose
// clips are NOT mounted anywhere in this loop (no doubling)
const QUOTES = [
  { eyebrow: "MEMBER WIN",        quote: "Six months of engineering work, compressed into one afternoon.", attrib: "Duy Nguyen" },
  { eyebrow: "FROM THE COMMUNITY", quote: "Afterwards, it's this village of people there to help you.",    attrib: "Lutfiya Miller" },
];
// verified stats (same set as Blocks 1-4), labels in end-of-event tense
const STAT_ROOM     = { kicker: "THIS WEEKEND, TOGETHER",    num: "1600+", unit: "BUILDERS",             sub: "Thank you for showing up." };
const STAT_SHIPPED  = { kicker: "SHIPPED BY THE COMMUNITY",  num: "100K+", unit: "AUTOMATIONS SHIPPED",  sub: "Real workflows. Real businesses." };
const STAT_SPEAKERS = { kicker: "ON STAGE THIS WEEKEND",     num: "25+",   unit: "SPEAKERS",             sub: "Founders, operators, and closers. Thank you." };

// ---------------------------------------------------------------------------
// BEAT PROGRAM — single sequence, loops through the After-Party hour.
// Order per the Block 8 brief: membership -> sponsors -> highlights/testimonials.
// ---------------------------------------------------------------------------
const BEATS = [
  // ---- 1 · WRAP OPEN ----
  { type: "hero", dur: 6, eyebrow: "AIS LIVE · JULY 11-12", pre: "That's a wrap on ", accent: "AIS LIVE." },
  { type: "tagline", dur: 9, eyebrow: "TWO DAYS · ONE COMMUNITY", pre: "You built it. ", accent: "You earned it.",
    sub: "Build Day and Earn Day, in the books." },
  { type: "stat", dur: 7, ...STAT_ROOM },

  // ---- 2 · AIS+ MEMBERSHIP — welcome, new members (mounted ad, voice audio) ----
  // lead-in copy deliberately differs from the ad's own opening line
  { type: "tagline", dur: 9, eyebrow: "AIS+ · NEW MEMBERS", pre: "Just joined? ", accent: "Welcome home.",
    sub: "To everyone who became an AIS+ member this weekend: this is your community now." },
  { type: "mount", video: VID.membership, dur: +(VID.membership.dur + MOUNT_HOLD).toFixed(3) },

  // ---- 3 · SPONSOR THANK-YOU — HyperAgent 60s + Glaido (no Clay) ----
  { type: "hero", dur: 5, eyebrow: "THANK YOU", pre: "The sponsors ", accent: "behind AIS LIVE." },
  ...(H60
    ? [{ type: "mount", video: H60, dur: +(H60.dur + MOUNT_HOLD).toFixed(3) }]
    : [{ type: "sponsor", dur: 60, eyebrow: "OUR SPONSORS", caption: "Thank you for powering AIS LIVE.",
         logos: [{ src: "hyperagent-white-big", hgt: 130, role: "PRESENTING SPONSOR" }] }]),
  { type: "sponsor", dur: 12, eyebrow: "OUR SPONSORS", caption: "Thank you for powering AIS LIVE.",
    logos: [{ src: "glaido-white", hgt: 150, role: "SPONSOR" }] },

  // ---- 4 · EVENT HIGHLIGHTS / TESTIMONIALS ----
  { type: "hero", dur: 5, eyebrow: "THE WEEKEND", pre: "Look what we ", accent: "covered." },
  { type: "agenda", dur: 36, eyebrow: "TWO DAYS AT AIS LIVE", rows: HIGHLIGHTS, caption: "Build Day + Earn Day highlights" },
  // real Day 1 session footage — straight from the stage (same card as the voices)
  ...(HILITE_BEATS.length ? [
    { type: "tagline", dur: 6, eyebrow: "FROM THE STAGE", pre: "Straight from ", accent: "Day 1." },
    ...HILITE_BEATS,
  ] : []),
  { type: "stat", dur: 7, ...STAT_SPEAKERS },

  { type: "hero", dur: 5, eyebrow: "FROM THE COMMUNITY", pre: "Real builds. ", accent: "Real numbers." },
  { type: "mount", video: VID.building, dur: +(VID.building.dur + MOUNT_HOLD).toFixed(3) },
  ...(BANK1.length ? [
    { type: "tagline", dur: 6, eyebrow: "IN THEIR WORDS", pre: "Why they ", accent: "stay." },
    ...BANK1,
  ] : []),
  { type: "stat", dur: 7, ...STAT_SHIPPED },

  { type: "hero", dur: 5, eyebrow: "FROM THE COMMUNITY", pre: "Real work. ", accent: "Real paydays." },
  { type: "mount", video: VID.earning, dur: +(VID.earning.dur + MOUNT_HOLD).toFixed(3) },
  ...BANK2,
  { type: "quote", dur: 8, ...QUOTES[0] },
  { type: "quote", dur: 8, ...QUOTES[1] },

  // ---- 5 · CLOSE / LOOP SEAM ----
  { type: "tagline", dur: 9, eyebrow: "AIS LIVE 2026", pre: "This is just ", accent: "the beginning.",
    sub: "Stay building. Stay connected. The community does not stop when the stream does." },
  { type: "action", dur: 9, eyebrow: "TONIGHT", pre: "The conversation ", accent: "continues.",
    sub: "Keep the wins coming. See you in the community." },
  // calm loop seam — settles out, then the wrap lands on the open's entrance
  { type: "markflash", dur: 16, sub: "That's a wrap on AIS LIVE. Thank you." },
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
const rootHTML = [];  // mounted video stages + voice cards (outside #camera — stay pin-sharp)
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

  // ---- COMMUNITY VOICE / SESSION HIGHLIGHT — native card, real clip in a
  //      rounded 16:9 box. Highlights (v.dir="recap") reuse the exact card,
  //      just with the session tag as the label + the speaker's role. ----
  if (b.type === "voice") {
    const v = b.v, m = `vc${mountN++}`;
    const dir = v.dir || "voices";
    rootHTML.push(
`      <div id="${m}" class="vcard">
        <div class="vbox">
          <img id="${m}-poster" class="vfill" src="assets/${dir}/${v.file}-poster.jpg" alt="" />
          <video id="${m}-v" class="vfill" muted playsinline data-has-audio="false" src="assets/${dir}/${v.file}.mp4" data-start="${S(VOICE_LEAD)}" data-duration="${v.dur}" data-track-index="${500 + mountN}"></video>
          <img id="${m}-last" class="vfill" src="assets/${dir}/${v.file}-lastframe.jpg" alt="" />
        </div>
        <div class="vmeta">
          <div class="vlabel">${v.tag || "FROM THE COMMUNITY"}</div>
          <div class="vname">${v.name}</div>
          <div class="vrole">${plusMark(v.role || "AIS+ MEMBER")}</div>
          <div class="vquote">${v.quote}</div>
        </div>
      </div>`);
    audioHTML.push(`      <audio id="${m}-a" src="assets/${dir}/${v.file}.mp4" data-start="${S(VOICE_LEAD)}" data-duration="${v.dur}" data-track-index="${560 + mountN}" data-volume="1"></audio>`);
    tj.push(`      // ${s} · voice ${v.file}  (${b.dur}s, voice audio)`);
    tj.push(`      streak(${S(0)});`);
    tj.push(`      tl.set("#${m}", { autoAlpha: 0 }, 0);`);
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 0 }, 0);`);
    tj.push(`      tl.set("#${m}", { autoAlpha: 1 }, ${S(0)});`);
    tj.push(`      slideFrom("#${m} .vbox", ${S(0.10)}, -70);`);
    tj.push(`      drop("#${m} .vlabel", ${S(0.30)});`);
    tj.push(`      slideFrom("#${m} .vname", ${S(0.40)}, 70);`);
    tj.push(`      drop("#${m} .vrole", ${S(0.58)});`);
    tj.push(`      drop("#${m} .vquote", ${S(0.72)});`);
    tj.push(`      tl.set("#${m}-poster", { autoAlpha: 0 }, ${S(VOICE_LEAD + 0.2)});`); // video is live by now
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 1 }, ${S(VOICE_LEAD + v.dur - 0.04)});`); // cover video end
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
  } else if (b.type === "sponsor") {
    tj.push(`      glowIn("#${s} .logo", ${S(0.34)}, 0.14);`);
  } else if (b.type === "agenda") {
    tj.push(`      slideX("#${s} .agrow", ${S(0.30)}, 0.07);`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub || b.caption) tj.push(`      drop("#${s} .sub", ${S(b.type === "quote" ? 0.95 : 0.82)});`);

  // ---- long-hold ambient: gentle drift on signage so nothing sits dead ----
  if ((b.type === "agenda" || b.type === "sponsor") && b.dur > 16) {
    const box = b.type === "agenda" ? ".agenda" : ".logorow";
    tj.push(`      drift("#${s} ${box}", ${S(2.0)}, ${+((b.dur - 3.0) / 4.8).toFixed(2)});`);
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
    <title>AIS LIVE — Block 8: Closing Stage Loop (${(D / 60).toFixed(1)} min loop)</title>
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
         background-clip:text box (paint box = padding box). Sides need extra room
         for italic descender tails (the 'y' in "they" clips at .15em) — pad wide
         and pull word spacing back with negative margins so the visual inter-word
         gap stays the original .15em */
      .ln .wd{display:inline-block;padding:.16em .26em .38em;margin:0 -.11em;will-change:transform,opacity;
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

      /* agenda / two-day highlights */
      .agenda{display:flex;flex-direction:column;gap:14px;width:max-content;max-width:1680px;will-change:transform;}
      .agrow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-body);font-weight:700;font-size:38px;color:#fff;text-align:left;will-change:transform,opacity;}
      .agt{font-family:var(--font-mono);font-weight:700;font-size:22px;color:var(--blue);min-width:130px;letter-spacing:.04em;}

      /* mounted finished pieces — full-frame, above the camera scenes */
      .mount{position:absolute;inset:0;background:#000;will-change:transform,opacity,filter;z-index:20;}
      .mfill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}

      /* community voice cards — real member clip over the live ambient background */
      .vcard{position:absolute;inset:0;z-index:20;display:flex;align-items:center;gap:84px;
        padding:0 120px;will-change:transform,opacity,filter;}
      .vbox{position:relative;width:980px;height:551px;border-radius:26px;overflow:hidden;flex:none;
        background:#000;border:1px solid rgba(55,189,248,.35);
        box-shadow:0 0 90px rgba(55,189,248,.22), 0 30px 80px rgba(0,0,0,.55);will-change:transform,opacity;}
      .vfill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
      .vmeta{display:flex;flex-direction:column;align-items:flex-start;gap:24px;text-align:left;max-width:620px;}
      .vlabel{font-family:var(--font-mono);font-weight:700;font-size:24px;letter-spacing:.32em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 16px rgba(55,189,248,.45);will-change:transform,opacity;}
      .vname{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:64px;line-height:1.08;
        letter-spacing:-.02em;color:#fff;text-shadow:0 0 30px rgba(255,255,255,.2);padding:0 .1em .08em 0;will-change:transform,opacity;}
      .vrole{font-family:var(--font-mono);font-weight:700;font-size:23px;letter-spacing:.24em;text-transform:uppercase;
        color:rgba(180,214,238,.85);will-change:transform,opacity;}
      .vrole .plus{font-size:26px;}
      .vquote{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:38px;line-height:1.3;
        color:rgba(209,220,232,.88);will-change:transform,opacity;}
      .vquote::before{content:"\\201C";color:var(--blue);margin-right:.04em;}
      .vquote::after{content:"\\201D";color:var(--blue);margin-left:.04em;}

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
    <div id="stage" data-composition-id="cmp-day2-close-fill" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function slideFrom(sel, at, x){ tl.fromTo(sel,{autoAlpha:0,x:x,scale:.96},
        {autoAlpha:1,x:0,scale:1,duration:.55,ease:"power3.out"},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      function glowIn(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,scale:.7,filter:"brightness(2.4) blur(6px)"},
        {autoAlpha:1,scale:1,filter:"brightness(1) blur(0px)",duration:.7,ease:"power2.out",stagger:step||.12,transformOrigin:"50% 50%"},at); }
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
      window.__timelines["cmp-day2-close-fill"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(SRC, "day2-close-fill.html"), html);
console.log(`wrote cards/day2-close-fill.html — ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min) LOOP, pad ${pad}s`
  + `${H60 ? " · HyperAgent 60s spot MOUNTED" : " · HyperAgent spot NOT present (logo spotlight holds the 60s slot)"}`
  + ` · ${VOICES.length}/${VOICE_DEFS.length} voice clips present`);
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "day2-close-fill.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/day2-close-fill.html");
}
