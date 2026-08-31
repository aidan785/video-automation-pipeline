// AIS LIVE — YouTube Doors-Open Loop (NEW asset, 2026-07-10).
// 15:00 SILENT loop for the public YouTube live stream, aimed at COLD viewers:
// what AIS LIVE is -> "Join the event today" CTA -> Day 1 schedule ->
// rotating speaker spotlights -> member-quote / stat proof. Loops seamlessly.
//
// Aidan's brief: "essentially a doors open loop, but hosting on YouTube trying
// to gain new viewers. What it is, the schedule, some of the speakers. 15 min."
// CTA (his words): "Join the event today." / "This is what's in store for
// today. Join the event." — event CTA only, nothing YouTube-wise, no URL.
//
// Schedule = Day 1 only (Agenda v7.1 times) with the 2026-07-10 client
// retitles baked in: "AI Evals: Catch Mistakes Before Your Clients Do" and the
// merged 5:05 "AIS+ Certification and Closing Remarks".
//
// Engine forked from ais-live-testi-wins-loops/_gen.mjs (local gsap, exact
// landing, whip loop seam). New card type: speaker spotlight (medallion left,
// name/role/session right). No mounts, no audio — venue music bed rides on top.
//
//   node _gen.mjs          -> writes cards/youtube-doors-loop.html
//   node _gen.mjs --set    -> also copies it to index.html
//
import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const TARGET = 900; // 15:00 exactly

// ---------------------------------------------------------------------------
// DAY 1 SCHEDULE — Agenda v7.1 verbatim times + the 7/10 client retitles
// ---------------------------------------------------------------------------
const DAY1 = [
  { t: "10:15 AM", label: "Welcome to AIS LIVE" },
  { t: "10:30 AM", label: "Anatomy of Three Real Deals" },
  { t: "11:40 AM", label: "The New Standard: A Fleet of Always-On Agents" },
  { t: "12:00 PM", label: "Building an AI Native SaaS Company" },
  { t: "12:20 PM", label: "AI Evals: Catch Mistakes Before Your Clients Do" },
  { t: "12:45 PM", label: "Workshop Block 1 (Foundation + Advanced)" },
  { t: "2:35 PM",  label: "Run an Entire AI Agency Using Claude Code" },
  { t: "3:10 PM",  label: "Workshop Block 2 (Foundation + Advanced)" },
  { t: "4:20 PM",  label: "Workshop 3: Enterprise AI Services" },
  { t: "5:05 PM",  label: "AIS+ Certification and Closing Remarks" },
];

// ---------------------------------------------------------------------------
// DAY 1 SPEAKERS — spotlight rotation (medallions from the #18 card system)
// ---------------------------------------------------------------------------
const SPEAKERS = [
  { img: "nate-herk",         name: "Nate Herk",         role: "Founder · Uppit AI & AIS",     session: "Welcome to AIS LIVE",                              time: "10:15 AM CT" },
  { img: "alex-mcdonnell",    name: "Alex McDonnell",    role: "Product Marketing · HyperAgent", session: "Why You Need a Fleet of Always-On Agents",      time: "11:40 AM CT" },
  { img: "jannis-moore",      name: "Jannis Moore",      role: "Co-Founder · Glaido",          session: "Building an AI Native SaaS Company",               time: "12:00 PM CT" },
  { img: "ednan-abdullayev",  name: "Ednan Abdullayev",  role: "Tech Lead · AIS",              session: "AI Evals: Catch Mistakes Before Your Clients Do",  time: "12:20 PM CT" },
  { img: "liberty-white",     name: "Liberty White",     role: "Founder · She Learns AI",      session: "Your First 30 Days in AI Automation",              time: "12:45 PM CT" },
  { img: "dave-ebbelaar",     name: "Dave Ebbelaar",     role: "Founder · Datalumina",         session: "Low-Code to Full-Code",                            time: "12:45 PM CT" },
  { img: "jon-morrow",        name: "Jon Morrow",        role: "President & COO · Uppit AI",   session: "Land Your First Paying Client",                    time: "2:00 PM CT" },
  { img: "kacper-rutkiewicz", name: "Kacper Rutkiewicz", role: "Founder · DeepRooted",         session: "Run an Entire AI Agency Using Claude Code",        time: "2:35 PM CT" },
  { img: "sabrina-ramonov",   name: "Sabrina Ramonov",   role: "Founder & CEO · Blotato",      session: "Build Your First AI Content Engine",               time: "3:10 PM CT" },
  { img: "samin-yasar",       name: "Samin Yasar",       role: "Founder & CEO · BookedIn.ai",  session: "Build a Voice AI Sales Rep",                       time: "3:10 PM CT" },
  { img: "tangy-frederick",   name: "Tangy Frederick",   role: "President · Regal Unicorn",    session: "Enterprise AI Services",                           time: "4:20 PM CT" },
  { img: "jack-roberts",      name: "Jack Roberts",      role: "Co-Founder · Glaido",          session: "Building an AI Native SaaS Company",               time: "12:00 PM CT" },
];
const SPK_PER_PASS = 3;
const spkSlice = (start, count) =>
  Array.from({ length: count }, (_, i) => ({ type: "speaker", dur: 8, ...SPEAKERS[(start + i) % SPEAKERS.length] }));

// verified member quotes (face-checked soundbite set) + community stats
const QUOTES = [
  { eyebrow: "FROM THE COMMUNITY",     quote: "In six weeks I landed two contracts worth nearly $20,000. And the sky's the limit.", attrib: "Amy Simpson" },
  { eyebrow: "MEMBER WIN",             quote: "Every client came to me. I never sent a single cold DM.",                            attrib: "Abdurrahman Ibrahim" },
  { eyebrow: "FROM LAID OFF TO HIRED", quote: "In a month and a half, I went from being laid off to having a job.",                 attrib: "Griffin Maklansky" },
  { eyebrow: "WHY WE'RE HERE",         quote: "I found my home. I found my tribe.",                                                 attrib: "Tonia Hardeman" },
  { eyebrow: "CAREER SHIFT",           quote: "I actually got my dream role: head of AI.",                                          attrib: "Pedro Gomez" },
  { eyebrow: "THE VERDICT",            quote: "The best money I've ever spent on any community.",                                   attrib: "Nick Mohler" },
];
const STATS = [
  { kicker: "MEMBERS WORLDWIDE",        num: "400K+", unit: "BUILDERS STRONG",     sub: "One community. Every timezone." },
  { kicker: "THE ROOM IS PACKED",       num: "1300+", unit: "PEOPLE GOING",        sub: "Two days, together in the room." },
  { kicker: "SHIPPED BY THE COMMUNITY", num: "100K+", unit: "AUTOMATIONS SHIPPED", sub: "Real workflows. Real businesses." },
  { kicker: "THE WORLD IS WATCHING",    num: "40M+",  unit: "VIEWS & COUNTING",    sub: "They watch. We build." },
];

// ---------------------------------------------------------------------------
// BEAT PROGRAM — pass(n): who we are -> CTA -> today's schedule -> speakers ->
// proof -> CTA reset. Copy rotates per pass so the loop never reads identical.
// ---------------------------------------------------------------------------
const HEROES = [
  { pre: "This is ", accent: "AIS LIVE." },
  { pre: "Build Day ", accent: "is today." },
  { pre: "Learn it live. ", accent: "Today." },
  { pre: "The AI event ", accent: "is on." },
];
const WHATIS = [
  { eyebrow: "WHAT IS AIS LIVE", pre: "The AI Automation Society, ", accent: "live.",
    sub: "Two days of building and selling real AI services, streamed live" },
  { eyebrow: "TWO DAYS", pre: "Build Day. ", accent: "Earn Day.",
    sub: "July 11: build real AI systems. July 12: turn them into money." },
  { eyebrow: "HAPPENING TODAY", pre: "Real builds, ", accent: "live on stage.",
    sub: "Watch real AI deals, agents, and automations built in front of you" },
  { eyebrow: "WHO IT'S FOR", pre: "Builders and ", accent: "future founders.",
    sub: "From your first automation to your first $40K deal" },
];
const CTAS = [
  { eyebrow: "HAPPENING TODAY", pre: "Join the event ", accent: "today.", sub: "AIS LIVE · July 11-12 · All times Central" },
  { eyebrow: "TODAY'S LINEUP", pre: "This is what's ", accent: "in store.", sub: "Join the event. It's all happening today." },
  { eyebrow: "DON'T MISS IT", pre: "The room is ", accent: "open.", sub: "Join the event today" },
];
const SPK_HEROES = [
  { pre: "Today's ", accent: "speakers." },
  { pre: "Who's on ", accent: "stage today." },
  { pre: "The lineup, ", accent: "today." },
];

function pass(n) {
  return [
    { type: "markflash", dur: 7, sub: "Live today · Build Day" },
    { type: "hero", dur: 5, eyebrow: "STREAMING LIVE", ...HEROES[n % HEROES.length] },
    { type: "tagline", dur: 9, ...WHATIS[n % WHATIS.length] },
    { type: "tagline", dur: 9, ...WHATIS[(n + 1) % WHATIS.length] },
    { type: "stat", dur: 7, ...STATS[n % STATS.length] },
    { type: "action", dur: 9, ...CTAS[n % CTAS.length] },
    { type: "agenda", dur: 32, eyebrow: "TODAY AT AIS LIVE", rows: DAY1, caption: "Day 1 · Build Day · All times Central" },
    { type: "hero", dur: 5, eyebrow: "ON STAGE TODAY", ...SPK_HEROES[n % SPK_HEROES.length] },
    ...spkSlice(n * SPK_PER_PASS, SPK_PER_PASS),
    { type: "quote", dur: 8, ...QUOTES[n % QUOTES.length] },
    { type: "action", dur: 9, ...CTAS[(n + 1) % CTAS.length] },
  ];
}

// ---------------------------------------------------------------------------
// scene HTML renderers
// ---------------------------------------------------------------------------
const wrapWords = (str, cls) => str.trim().split(/\s+/)
  .map(w => `<span class="wd ${cls || ""}">${w}</span>`).join("");
const plusMark = s => s.replace(/AIS\+/g, `<span class="plus">AIS<span class="p">+</span></span>`);

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
      return `${eyeb(b)}<div class="ln quoteln">${wrapWords(b.quote)}</div><div class="sub attrib">${b.attrib}</div>`;
    case "stat":
      return `${eyeb(b)}
        <div class="statwrap">
          ${b.kicker ? `<div class="kicker">${b.kicker}</div>` : ""}
          <div class="num">${b.num.replace(/^\d+/, "0")}</div>
          <div class="unit">${b.unit || ""}</div>
        </div>${sub(b.sub)}`;
    case "agenda": {
      const rows = b.rows.map(r =>
        `<div class="agrow"><span class="agt">${r.t}</span><span class="agl">${plusMark(r.label)}</span></div>`).join("");
      return `${eyeb(b)}<div class="agenda">${rows}</div>${sub(b.caption)}`;
    }
    case "speaker":
      return `<div class="spkwrap">
          <div class="spkpic"><img src="assets/medallions/${b.img}.png" alt="" /></div>
          <div class="spktext">
            <div class="peyebrow">ON STAGE TODAY</div>
            <div class="spkname">${wrapWords(b.name)}</div>
            <div class="spkrole">${b.role}</div>
            <div class="spksession">${plusMark(b.session)}</div>
            <div class="spktime">${b.time}</div>
          </div>
        </div>`;
    case "markflash":
      return `<div class="bigmark"><span class="mark big"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>${sub(b.sub)}`;
  }
  return "";
}

// ---------------------------------------------------------------------------
// ASSEMBLY — full passes, then quote/stat/CTA filler, closer markflash w/ pad
// ---------------------------------------------------------------------------
const sum = arr => arr.reduce((s, b) => s + b.dur, 0);
const CLOSER = { type: "markflash", dur: 8, sub: "Join the event today." };

const BEATS = [];
let p = 0;
while (sum(BEATS) + sum(pass(p)) + CLOSER.dur <= TARGET) { BEATS.push(...pass(p)); p++; }
const PASSES = p;

let f = 0, fUsed = 0, misses = 0, sf = PASSES * SPK_PER_PASS, qf = PASSES;
const POOL = () => {
  const k = f % 3;
  if (k === 0) return spkSlice(sf, 1)[0];
  if (k === 1) return { type: "quote", dur: 8, ...QUOTES[qf % QUOTES.length] };
  return { type: "action", dur: 9, ...CTAS[f % CTAS.length] };
};
while (misses < 5) {
  const cand = POOL();
  if (sum(BEATS) + cand.dur + CLOSER.dur <= TARGET) {
    BEATS.push({ ...cand });
    if (cand.type === "speaker") sf++;
    if (cand.type === "quote") qf++;
    fUsed++; misses = 0;
  } else misses++;
  f++;
}
BEATS.push({ ...CLOSER });
const pad = +(TARGET - sum(BEATS)).toFixed(3);
BEATS[BEATS.length - 1].dur += pad;

// ---------------------------------------------------------------------------
// scenes + timeline
// ---------------------------------------------------------------------------
let t = 0;
const OVERLAP = 0.4;
const scenesHTML = [], tj = [];

BEATS.forEach((b, idx) => {
  const start = t, s = `sc${idx}`, track = 12 + idx;
  const win = +(b.dur + OVERLAP).toFixed(3);
  const first = idx === 0, last = idx === BEATS.length - 1;
  const S = n => +(start + n).toFixed(3);

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
    if (m) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${m[1]}, 1.0, "${m[2]}");`);
    tj.push(`      drop("#${s} .unit", ${S(0.78)});`);
  } else if (b.type === "agenda") {
    tj.push(`      slideX("#${s} .agrow", ${S(0.30)}, 0.07);`);
    tj.push(`      drift("#${s} .agenda", ${S(2.0)}, ${+((b.dur - 3.0) / 4.8).toFixed(2)});`);
  } else if (b.type === "speaker") {
    tj.push(`      picIn("#${s} .spkpic", ${S(0.2)});`);
    tj.push(`      drop("#${s} .peyebrow", ${S(0.14)});`);
    tj.push(`      words("#${s} .spkname .wd", ${S(0.3)});`);
    tj.push(`      drop("#${s} .spkrole", ${S(0.7)});`);
    tj.push(`      drop("#${s} .spksession", ${S(0.85)});`);
    tj.push(`      drop("#${s} .spktime", ${S(1.0)});`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub && b.type !== "speaker") tj.push(`      drop("#${s} .sub", ${S(b.type === "quote" ? 0.95 : 0.82)});`);

  // exit — final beat also whips (loop seam)
  tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
  if (!last) tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
  tj.push(``);

  t += b.dur;
});

const D = +t.toFixed(3);
if (Math.abs(D - TARGET) > 0.01) throw new Error(`duration drift: ${D} != ${TARGET}`);

const segs = approx => { let n = Math.round(D / approx); if (n % 2) n++; return n; };
const CAM = segs(30), BEAM = segs(25), FLICK = segs(6), GLOW = segs(30), VIG = segs(8.4);
const CID = "cmp-youtube-doors-loop";

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — YouTube Doors-Open Loop (15 min)</title>
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
      .ln.quoteln{font-size:78px;line-height:1.28;max-width:1500px;}
      .quoteln{position:relative;}
      .quoteln::before{content:"\\201C";color:var(--blue);margin-right:.04em;}
      .quoteln::after{content:"\\201D";color:var(--blue);margin-left:.04em;}

      .sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:41px;line-height:1.25;
        color:rgba(209,220,232,.85);max-width:1440px;will-change:transform,opacity;}
      .attrib{font-style:normal;font-family:var(--font-mono);font-weight:500;font-size:27px;letter-spacing:.06em;color:rgba(180,214,238,.82);}

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

      /* agenda */
      .agenda{display:flex;flex-direction:column;gap:14px;width:max-content;max-width:1680px;will-change:transform;}
      .agrow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-body);font-weight:700;font-size:38px;color:#fff;text-align:left;will-change:transform,opacity;}
      .agt{font-family:var(--font-mono);font-weight:700;font-size:22px;color:var(--blue);min-width:130px;letter-spacing:.04em;}

      /* ---------- speaker spotlight: medallion left, details right ---------- */
      .spkwrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:110px;padding:80px 140px;}
      .spkpic{flex:0 0 480px;display:flex;align-items:center;justify-content:center;will-change:transform,opacity;}
      .spkpic img{width:480px;height:480px;display:block;filter:drop-shadow(0 26px 60px rgba(0,0,0,.55));}
      .spktext{display:flex;flex-direction:column;align-items:flex-start;text-align:left;max-width:960px;}
      .peyebrow{font-family:var(--font-mono);font-weight:700;font-size:27px;letter-spacing:.34em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 16px rgba(55,189,248,.45);will-change:transform,opacity;}
      .spkname{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:104px;line-height:1.08;
        letter-spacing:-.03em;margin-left:-.15em;}
      .spkname .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .spkrole{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:34px;color:rgba(209,220,232,.85);will-change:transform,opacity;}
      .spksession{font-family:var(--font-display);font-style:italic;font-weight:800;font-size:44px;line-height:1.15;
        letter-spacing:-.02em;color:var(--blue);margin-top:26px;text-shadow:0 0 30px rgba(55,189,248,.4);
        padding-bottom:.14em;will-change:transform,opacity;}
      .spktime{font-family:var(--font-mono);font-weight:500;font-size:25px;letter-spacing:.22em;text-transform:uppercase;
        color:rgba(180,214,238,.82);margin-top:14px;will-change:transform,opacity;}

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
      function picIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,x:-60,scale:.72},
        {autoAlpha:1,x:0,scale:1,duration:.6,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function drift(sel, at, cycles){ tl.to(sel,{y:"-=12",duration:2.4,yoyo:true,repeat:Math.max(1,Math.round(cycles*2)-1),
        ease:"sine.inOut",stagger:{each:.25,from:"center"}},at); }
      function whipOut(sel, at){ tl.to(sel,{autoAlpha:0,y:-155,filter:"blur(30px)",duration:.26,ease:"power2.in"},at); }
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

      /* ---- AMBIENT — short fixed cycles, even counts so motion rests at the loop seam ---- */
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

writeFileSync(join(SRC, "youtube-doors-loop.html"), html);
const spkCount = BEATS.filter(b => b.type === "speaker").length;
console.log(`wrote cards/youtube-doors-loop.html — ${BEATS.length} beats, ${PASSES} passes + ${fUsed} filler, ${D}s (${(D / 60).toFixed(2)} min), pad ${pad}s · ${spkCount} speaker spotlights · ${BEATS.filter(b => b.type === "agenda").length} agenda cards`);
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "youtube-doors-loop.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/youtube-doors-loop.html");
}
