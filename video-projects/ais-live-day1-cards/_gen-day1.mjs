// AIS LIVE — Day 1 (Build Day) session cards, one per event.
// Contained glass card centered on a TRANSPARENT 1920x1080 canvas so each PNG drops
// straight onto a background in After Effects. AIS house style: onyx glass, italic
// Montserrat, accent time + tag chip, JetBrains Mono labels.
//   Source: Final Agenda doc (Day 1, Sat July 11). All times Central.
//   node _gen-day1.mjs         -> render all -> png/<slug>.png (transparent)
//   node _gen-day1.mjs 05       -> render just the one whose slug starts 05
//   accent: main=blue · foundation=yellow · advanced/sponsor=coral · vip=blue

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/aidanstanik/Projects/Video Automation/node_modules/playwright-core/index.js");

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "png");
const TMP = join(OUT, "_html");
mkdirSync(TMP, { recursive: true });
const FONTS = join(ROOT, "..", "ais-live-stings", "assets", "fonts", "fonts.css");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Day 1 — Build Day · Vision. Proof. Application.
const S = [
  { slug:"01-doors-open", time:"9:00 AM", tag:"DOORS · EXPO", accent:"blue",
    title:"Doors Open + Visit the Expo", role:"Lobby & sponsor booths open", speakers:"" },
  { slug:"02-vip-qa-nate", time:"9:30 AM", tag:"VIP EXCLUSIVE", accent:"blue",
    title:"VIP Q&A with Nate Herk", role:"Host · AIS+", speakers:"Nate Herk" },
  { slug:"03-welcome", time:"10:15 AM", tag:"MAIN STAGE", accent:"blue",
    title:"Welcome to AIS LIVE", role:"Host", speakers:"Nate Herk" },
  { slug:"04-new-standard-fleet", time:"10:30 AM", tag:"PRESENTING SPONSOR · HYPERAGENT", accent:"coral",
    title:"The New Standard: Why You Need a Fleet of Always-On Agents", role:"Presenting Sponsor: HyperAgent", speakers:"Alex McDonnell" },
  { slug:"05-anatomy-three-deals", time:"11:00 AM", tag:"MAIN STAGE · PANEL", accent:"blue",
    title:"Anatomy of Three Real Deals", role:"Moderated by Nate Herk", speakers:"Aidan Finnegan · Wyatt Lyonsmith · Glenn Marcus" },
  { slug:"06-live-debrief-patterns", time:"11:55 AM", tag:"MAIN STAGE · DEBRIEF", accent:"blue",
    title:"Live Debrief: Patterns from Real Deals", role:"Debrief", speakers:"Yash · Jon Morrow" },
  { slug:"07-glaido-voice", time:"12:10 PM", tag:"SPONSORED SESSION", accent:"coral",
    title:"Glaido: Voice-Enabled Client Work, Live", role:"Sponsored Session", speakers:"Glaido Team" },
  { slug:"08-evals", time:"12:30 PM", tag:"MAIN STAGE", accent:"blue",
    title:"Evals with Nate Herk & Ednan Abdullayev", role:"Evals", speakers:"Nate Herk · Ednan Abdullayev" },
  { slug:"09-ws1-first-30-days", time:"12:55 PM", tag:"WORKSHOP · FOUNDATION", accent:"yellow", conc:true,
    title:"Your First 30 Days in AI Automation", role:"Workshop Block 1 · Foundation", speakers:"Liberty White" },
  { slug:"10-ws1-low-to-full-code", time:"12:55 PM", tag:"WORKSHOP · ADVANCED", accent:"coral", conc:true,
    title:"Low-Code to Full-Code", role:"Workshop Block 1 · Advanced", speakers:"Dave Ebbelaar" },
  { slug:"11-lunch-expo", time:"2:10 PM", tag:"LUNCH · EXPO", accent:"blue", conc:true,
    title:"Lunch + Visit the Expo", role:"Networking & sponsor booths", speakers:"" },
  { slug:"12-vip-working-sessions", time:"2:10 PM", tag:"VIP EXCLUSIVE · 5 ROOMS", accent:"blue", conc:true,
    title:"VIP Working Sessions", role:"5 parallel rooms · pick your moment", speakers:"VIP Ticket Holders" },
  { slug:"13-claude-code-agency", time:"2:45 PM", tag:"FEATURED SESSION", accent:"blue",
    title:"How I Run an Entire AI Automation Agency Using Claude Code", role:"Featured Session", speakers:"Kacper Rutkiewicz" },
  { slug:"14-break-expo", time:"3:10 PM", tag:"BREAK · EXPO", accent:"blue",
    title:"Break + Visit the Expo", role:"Stretch, refuel, visit booths", speakers:"" },
  { slug:"15-ws2-content-engine", time:"3:20 PM", tag:"WORKSHOP · FOUNDATION", accent:"yellow", conc:true,
    title:"Build Your First AI Content Engine", role:"Workshop Block 2 · Foundation", speakers:"Sabrina Ramonov" },
  { slug:"16-ws2-voice-ai-sales-rep", time:"3:20 PM", tag:"WORKSHOP · ADVANCED", accent:"coral", conc:true,
    title:"Build a Voice AI Sales Rep", role:"Workshop Block 2 · Advanced", speakers:"Samin Yasar" },
  { slug:"17-ws3-enterprise-ai", time:"4:30 PM", tag:"WORKSHOP BLOCK 3", accent:"coral",
    title:"Enterprise AI Services", role:"Workshop Block 3", speakers:"Tangy Frederick" },
  { slug:"18-day1-close-overnight", time:"5:30 PM", tag:"MAIN STAGE · CLOSE", accent:"blue",
    title:"Day 1 Close + Overnight Challenge", role:"Host", speakers:"Nate Herk" },
];

const ACCENT = { blue:"#37bdf8", coral:"#ff8a5c", yellow:"#f5d82a" };
const GLOW   = { blue:"rgba(55,189,248,0.30)", coral:"rgba(255,138,92,0.28)", yellow:"rgba(245,216,42,0.22)" };
function titleSize(t){ const n=t.length; return n<=24?92:n<=38?76:n<=54?62:n<=72?52:44; }

function cardHTML(s){
  const ac = ACCENT[s.accent], glow = GLOW[s.accent];
  const tfs = titleSize(s.title);
  const speakers = s.speakers
    ? `<div class="spk"><span class="lbl">${s.role}</span><span class="name">${s.speakers}</span></div>`
    : `<div class="spk"><span class="lbl">${s.role}</span></div>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<link href="file://${FONTS}" rel="stylesheet"/>
<style>
  :root{ --ac:${ac}; }
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:1920px;height:1080px;}
  body{background:transparent;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;}
  .card{position:relative;width:1560px;min-height:560px;border-radius:30px;overflow:hidden;
    background:linear-gradient(180deg, rgba(9,20,32,0.96), rgba(6,14,22,0.97));
    border:1px solid rgba(255,255,255,0.10);
    box-shadow:0 60px 150px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
    padding:70px 78px 66px;display:flex;flex-direction:column;}
  .glow{position:absolute;top:-160px;right:-120px;width:620px;height:620px;border-radius:50%;background:${glow};filter:blur(120px);}
  .grid{position:absolute;inset:0;opacity:.5;background-image:
    linear-gradient(rgba(55,189,248,0.05) 1px,transparent 1px),
    linear-gradient(90deg,rgba(55,189,248,0.05) 1px,transparent 1px);background-size:26px 26px;}
  .in{position:relative;z-index:2;display:flex;flex-direction:column;height:100%;flex:1;}
  .top{display:flex;align-items:center;justify-content:space-between;}
  .mark{font-family:'Montserrat',sans-serif;font-style:italic;font-weight:900;letter-spacing:-0.03em;font-size:30px;
    display:inline-flex;align-items:baseline;position:relative;}
  .mark .ais{color:#fff;} .mark .gap{width:.08em;display:inline-block;}
  .mark .live{color:#37bdf8;position:relative;text-shadow:0 0 30px rgba(55,189,248,0.55);padding-right:.30em;}
  .mark .dot{position:absolute;top:.06em;left:100%;margin-left:.04em;width:.15em;height:.15em;border-radius:50%;
    background:#ff3b30;box-shadow:0 0 .7em #ff3b30;}
  .day{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:16px;letter-spacing:.24em;text-transform:uppercase;color:rgba(209,220,232,0.55);}
  .day b{color:var(--ac);}
  .mid{flex:1;display:flex;flex-direction:column;justify-content:center;padding:34px 0;}
  .chip{align-self:flex-start;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:16px;letter-spacing:.24em;
    text-transform:uppercase;color:var(--ac);margin-bottom:24px;}
  .chip .c{color:rgba(209,220,232,0.6);}
  .title{font-family:'Montserrat',sans-serif;font-style:italic;font-weight:900;letter-spacing:-0.035em;line-height:0.98;
    font-size:${tfs}px;color:#fff;max-width:1320px;}
  .foot{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;border-top:1px solid rgba(255,255,255,0.12);padding-top:28px;}
  .time .t{font-family:'Montserrat',sans-serif;font-style:italic;font-weight:900;font-size:56px;letter-spacing:-0.03em;line-height:0.9;color:var(--ac);white-space:nowrap;}
  .time .m{font-family:'JetBrains Mono',monospace;font-weight:500;font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:rgba(209,220,232,0.5);margin-top:8px;}
  .spk{text-align:right;display:flex;flex-direction:column;gap:7px;max-width:920px;}
  .spk .lbl{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;letter-spacing:.24em;text-transform:uppercase;color:rgba(209,220,232,0.5);}
  .spk .name{font-family:'Montserrat',sans-serif;font-weight:800;font-size:32px;letter-spacing:-0.02em;line-height:1.06;color:#fff;}
</style></head>
<body>
  <div class="card">
    <div class="glow"></div><div class="grid"></div>
    <div class="in">
      <div class="top">
        <span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="dot"></span></span></span>
        <span class="day"><b>DAY 1</b> · SAT JULY 11</span>
      </div>
      <div class="mid">
        <span class="chip">${s.tag}${s.conc ? `<span class="c"> · CONCURRENT</span>` : ""}</span>
        <h1 class="title">${s.title}</h1>
      </div>
      <div class="foot">
        <div class="time"><div class="t">${s.time}</div><div class="m">Central Time</div></div>
        ${speakers}
      </div>
    </div>
  </div>
</body></html>`;
}

const only = process.argv[2];
const list = only ? S.filter(s => s.slug.startsWith(only)) : S;
if (!list.length){ console.error(`no session matching "${only}"`); process.exit(1); }

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport:{ width:1920, height:1080 }, deviceScaleFactor:2 });
const made = [];
for (const s of list){
  const htmlPath = join(TMP, `${s.slug}.html`);
  writeFileSync(htmlPath, cardHTML(s));
  await page.goto("file://" + htmlPath, { waitUntil:"load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(OUT, `${s.slug}.png`), omitBackground:true }); // transparent
  made.push(s.slug);
  console.log("card ->", `png/${s.slug}.png`);
}
await browser.close();
console.log(`\ndone — ${made.length} transparent card(s) in png/`);
