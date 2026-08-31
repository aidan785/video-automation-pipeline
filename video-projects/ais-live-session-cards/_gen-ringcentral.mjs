// AIS LIVE — Session Cards, RingCentral schedule (accurate 17-session lineup).
//   Same locked AIS LIVE house style as _gen.mjs (onyx command-deck, Shift mark,
//   italic Montserrat headline w/ one accent phrase, big time, speaker footer),
//   but populated from the accurate RingCentral cards in ~/Downloads/ringcentral.
//   Track color-coding matches those references: Foundation -> yellow, Advanced ->
//   coral, VIP -> blue.
//
//   node _gen-ringcentral.mjs         -> render all -> renders/ringcentral/<slug>.png
//   node _gen-ringcentral.mjs <slug>  -> render just one

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "renders", "ringcentral");
const TMP = join(OUT, "_html");
mkdirSync(TMP, { recursive: true });
const FONTS = join(ROOT, "..", "ais-live-stings", "assets", "fonts", "fonts.css");

const D1 = { day: "DAY 1", date: "SAT · JULY 11" };
const D2 = { day: "DAY 2", date: "SUN · JULY 12" };
const PEER = { speakers: "Small-Group Room", spkLabel: "Peer-Driven · Light-Touch Moderation" };

// accent: foundation -> yellow, advanced -> coral, VIP -> blue (per RingCentral refs)
// time = full range (start – end); conc = "CONCURRENT" flag; spkLabel = the OG role context line.
const SESSIONS = [
  { slug: "01-foundation-first-30-days", ...D1, track: "FOUNDATION TRACK · WORKSHOP BLOCK 1", accent: "yellow",
    title: `Your First <em>30 Days</em> in AI Automation`, time: "12:55 – 2:10 PM", meta: "CT · 75 MIN", conc: true, speakers: "Liberty White", spkLabel: "Foundation Workshop · Block 1",
    hook: "Liberty White walks the first 30 days of an AI automation business end to end — what to build first, what to ignore, and what to ship in week one so you leave with a portfolio piece prospects can evaluate." },
  { slug: "02-foundation-content-engine", ...D1, track: "FOUNDATION TRACK · WORKSHOP BLOCK 2", accent: "yellow",
    title: `Build Your First AI <em>Content Engine</em>`, time: "3:20 – 4:20 PM", meta: "CT · 60 MIN", conc: true, speakers: "Sabrina Ramonov", spkLabel: "Foundation Workshop · Block 2",
    hook: "Sabrina Ramonov opens a screen share and builds an AI content engine live, end to end, in 60 minutes — setup, prompts, integrations, and the outputs you can carry straight into client work." },
  { slug: "03-advanced-low-code-to-full-code", ...D1, track: "ADVANCED TRACK · WORKSHOP BLOCK 1", accent: "coral",
    title: `Low-Code to <em>Full-Code</em>`, time: "12:55 – 2:10 PM", meta: "CT · 75 MIN", conc: true, speakers: "Dave Ebbelaar", spkLabel: "Advanced Workshop · Block 1",
    hook: "Dave Ebbelaar built his agency with zero code, then leapt to full-code production. The architecture that holds up at scale, the traps that take out most operators, and the real cost of every tooling decision." },
  { slug: "04-advanced-voice-ai-sales-rep", ...D1, track: "ADVANCED TRACK · WORKSHOP BLOCK 2", accent: "coral",
    title: `Build a <em>Voice AI</em> Sales Rep`, time: "3:20 – 4:20 PM", meta: "CT · 60 MIN", conc: true, speakers: "Samin Yasar", spkLabel: "Advanced Workshop · Block 2",
    hook: "Samin Yasar builds a voice AI sales rep live, end to end — the production architecture that holds up in the wild, the failure modes you'll hit on first deploy, and the path to getting started. His promise: anyone can." },
  { slug: "05-vip-qa-with-nate-herk", ...D1, track: "VIP EXCLUSIVE · LIVE Q&A", accent: "blue",
    title: `VIP <em>Q&A</em> with Nate Herk`, time: "9:30 – 10:15 AM", meta: "CT · 45 MIN", speakers: "Nate Herk", spkLabel: "Host · AIS+",
    hook: "Forty-five minutes with Nate before the cameras turn on — just the VIP room. Bring the question your AIS+ membership doesn't quite answer. Pre-submitted questions run first, live ones from the room get woven in." },
  { slug: "06-vip-d1-land-your-first-paying-client", ...D1, track: "VIP WORKING SESSION · ROOM 01 OF 5", accent: "blue", ...PEER,
    title: `Land Your <em>First Paying Client</em>`, time: "2:10 – 2:45 PM", meta: "CT · 35 MIN", conc: true,
    hook: "The exact path from zero to a signed first engagement — where to look, what to say, and how to get to yes without underselling the work." },
  { slug: "07-vip-d1-turn-expertise-into-a-service", ...D1, track: "VIP WORKING SESSION · ROOM 02 OF 5", accent: "blue", ...PEER,
    title: `Turn Your Expertise Into a <em>Service</em>`, time: "2:10 – 2:45 PM", meta: "CT · 35 MIN", conc: true,
    hook: "Shape what you already know into a repeatable, sellable offer — the packaging move that turns loose skills into a service line." },
  { slug: "08-vip-d1-price-it-right", ...D1, track: "VIP WORKING SESSION · ROOM 03 OF 5", accent: "blue", ...PEER,
    title: `Price It <em>Right</em>`, time: "2:10 – 2:45 PM", meta: "CT · 35 MIN", conc: true,
    hook: "Set numbers you can defend. Anchor points, packaging, and the language that holds your price when the client pushes back." },
  { slug: "09-vip-d1-scope-to-ship", ...D1, track: "VIP WORKING SESSION · ROOM 04 OF 5", accent: "blue", ...PEER,
    title: `Scope to <em>Ship</em>`, time: "2:10 – 2:45 PM", meta: "CT · 35 MIN", conc: true,
    hook: "Cut a sprawling idea down to something you can actually deliver — the scoping discipline that protects both margin and timeline." },
  { slug: "10-vip-d1-tooling-reset", ...D1, track: "VIP WORKING SESSION · ROOM 05 OF 5", accent: "blue", ...PEER,
    title: `Tooling <em>Reset</em>`, time: "2:10 – 2:45 PM", meta: "CT · 35 MIN", conc: true,
    hook: "Strip the stack back to what earns its place. What to keep, what to cut, and what to standardize before your next build." },
  { slug: "11-vip-d2-your-first-10-clients-plan", ...D2, track: "VIP WORKING SESSION · ROOM 01 OF 5", accent: "blue", ...PEER,
    title: `Your First <em>10 Clients</em> Plan`, time: "1:35 – 2:10 PM", meta: "CT · 35 MIN", conc: true,
    hook: "Build the concrete plan for landing ten clients — the channels, the cadence, and the outreach moves that actually get picked up." },
  { slug: "12-vip-d2-turn-expertise-into-a-service", ...D2, track: "VIP WORKING SESSION · ROOM 02 OF 5", accent: "blue", ...PEER,
    title: `Turn Your Expertise Into a <em>Service</em>`, time: "1:35 – 2:10 PM", meta: "CT · 35 MIN", conc: true,
    hook: "Shape what you already know into a repeatable, sellable offer — the packaging move that turns loose skills into a service line." },
  { slug: "13-vip-d2-first-sales-call-prep", ...D2, track: "VIP WORKING SESSION · ROOM 03 OF 5", accent: "blue", ...PEER,
    title: `First <em>Sales Call</em> Prep`, time: "1:35 – 2:10 PM", meta: "CT · 35 MIN", conc: true,
    hook: "Rehearse the call before it counts — opening, discovery, and handling the objection you already know is coming." },
  { slug: "14-vip-d2-solo-to-real-business", ...D2, track: "VIP WORKING SESSION · ROOM 04 OF 5", accent: "blue", ...PEER,
    title: `From Solo to <em>Real Business</em>`, time: "1:35 – 2:10 PM", meta: "CT · 35 MIN", conc: true,
    hook: "Move from doing everything yourself to an operation that runs — the first systems, hires, and handoffs that make it real." },
  { slug: "15-vip-d2-land-your-first-paying-client", ...D2, track: "VIP WORKING SESSION · ROOM 05 OF 5", accent: "blue", ...PEER,
    title: `Land Your <em>First Paying Client</em>`, time: "1:35 – 2:10 PM", meta: "CT · 35 MIN", conc: true,
    hook: "The exact path from zero to a signed first engagement — where to look, what to say, and how to get to yes without underselling the work." },
  { slug: "16-vip-pricing-war-room", ...D2, track: "VIP EXCLUSIVE · LIVE CASE WORK", accent: "blue",
    title: `VIP <em>Pricing War Room</em>`, time: "4:00 – 4:45 PM", meta: "CT · 45 MIN", conc: true, speakers: "Jon Morrow · Blair Enns", spkLabel: "Facilitators",
    hook: "Real pricing problems submitted by VIPs in advance — five to seven curated cases worked live with Jon Morrow and Blair Enns. Jonathan Stark's keynote frameworks, applied to actual businesses in the room. Yours might be one." },
  { slug: "17-vip-after-party-with-nate", ...D2, track: "VIP EXCLUSIVE · CLOSING", accent: "blue", confetti: true,
    title: `VIP <em>After-Party</em> with Nate`, time: "6:10 – 7:10 PM", meta: "CT · 60 MIN", speakers: "Nate Herk", spkLabel: "Host · AIS+",
    hook: "Sixty minutes with Nate to close out the weekend. Unstructured time, two facilitated peer breakouts built for actual connection, and a final fireside conversation with the host." },
];

const ACCENT = { blue: "#37bdf8", coral: "#ff8a5c", yellow: "#f5d82a" };
const GLOW = { blue: "rgba(55,189,248,0.22)", coral: "rgba(255,138,92,0.20)", yellow: "rgba(245,216,42,0.16)" };

function titleSize(html) {
  const len = html.replace(/<[^>]+>/g, "").length;
  return len <= 26 ? 116 : len <= 40 ? 98 : len <= 58 ? 80 : len <= 80 ? 64 : 54;
}
function spkSize(str) {
  return str.length > 48 ? 26 : str.length > 30 ? 31 : 38;
}
// Still (frozen) confetti scatter — deterministic seeded pieces across the whole frame,
// sits behind the text so headline/hook stay readable. Brand palette, tilted rects + dots.
function confettiStill() {
  let s = 90210;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296);
  const COLORS = ["#37bdf8", "#ff8a5c", "#ffffff", "#ff3b30"];
  // keep confetti OUT of the text zones so the layout reads identical to the other cards:
  //   [chrome], [track+title+hook], [footer]. Pieces land only in the negative space.
  const EX = [ [70, 48, 1850, 140], [80, 250, 1440, 700], [80, 855, 1520, 1050] ];
  const inEx = (x, y) => EX.some(([a, b, c, d]) => x >= a && x <= c && y >= b && y <= d);
  const P = [];
  let guard = 0;
  while (P.length < 42 && guard < 5000) {
    guard++;
    const x = Math.round(rnd() * 1860) + 30;
    const y = Math.round(rnd() * 1020) + 20;
    if (inEx(x, y)) continue;
    const i = P.length;
    P.push({
      x, y, rot: Math.round((rnd() * 2 - 1) * 72),
      w: 9 + Math.round(rnd() * 12), h: 12 + Math.round(rnd() * 15),
      col: COLORS[i % COLORS.length], round: rnd() < 0.22 ? "50%" : "1px",
      op: (0.7 + rnd() * 0.3).toFixed(2),
    });
  }
  return `<div class="confetti">` +
    P.map((p) => `<i class="cf" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;background:${p.col};border-radius:${p.round};opacity:${p.op};transform:rotate(${p.rot}deg);"></i>`).join("") +
    `</div>`;
}
// faint bottom-right ghost watermark, mirroring the RingCentral reference cards:
//   Foundation -> FDN, Advanced -> ADV, VIP exclusive -> VIP, VIP working room -> its room number.
function ghostFor(s) {
  const room = s.track.match(/ROOM (\d{2}) OF/);
  if (room) return room[1];
  if (/FOUNDATION/.test(s.track)) return "FDN";
  if (/ADVANCED/.test(s.track)) return "ADV";
  return "VIP";
}

function cardHTML(s) {
  const ac = ACCENT[s.accent] || ACCENT.blue;
  const glow = GLOW[s.accent] || GLOW.blue;
  const tfs = titleSize(s.title);
  const sfs = spkSize(s.speakers);
  const spkLabel = s.spkLabel || (s.speakers.includes("·") ? "Speakers" : "Speaker");
  const ghost = ghostFor(s);
  const ghostNum = /^\d+$/.test(ghost);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />
<link href="file://${FONTS}" rel="stylesheet" />
<style>
  :root{ --onyx:#07121c; --ac:${ac}; --paper-soft:rgba(209,220,232,0.80); --paper-mute:rgba(209,220,232,0.52); }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ width:1920px; height:1080px; }
  body{ background:var(--onyx); color:#fff; font-family:'Inter',sans-serif; position:relative; overflow:hidden; }
  .grid{ position:absolute; inset:0; background-image:
      linear-gradient(rgba(55,189,248,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(55,189,248,0.06) 1px, transparent 1px);
      background-size:24px 24px; }
  .glow{ position:absolute; top:-180px; right:-120px; width:760px; height:760px; border-radius:50%;
      background:${glow}; filter:blur(120px); }
  .vig{ position:absolute; inset:0; background:radial-gradient(120% 120% at 50% 38%, transparent 55%, rgba(0,0,0,0.55) 100%); }
  .frame{ position:absolute; inset:0; padding:84px 120px; display:flex; flex-direction:column; }
  .chrome{ display:flex; align-items:center; justify-content:space-between; }
  .mark{ font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; letter-spacing:-0.03em;
      line-height:0.9; font-size:34px; display:inline-flex; align-items:baseline; position:relative; }
  .mark .ais{ color:#fff; } .mark .gap{ display:inline-block; width:0.08em; }
  .mark .live{ color:#37bdf8; position:relative; text-shadow:0 0 40px rgba(55,189,248,0.55); padding-right:0.30em; }
  .mark .dot{ position:absolute; top:0.08em; left:100%; margin-left:0.04em; width:0.15em; height:0.15em;
      border-radius:50%; background:#ff3b30; box-shadow:0 0 0.7em #ff3b30,0 0 0.25em #ff3b30; }
  .when{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:17px; letter-spacing:0.26em;
      text-transform:uppercase; color:var(--paper-mute); text-align:right; }
  .when b{ color:var(--ac); }
  /* top-anchored (not centered) so the track+title start at the SAME Y on every card —
     keeps titles aligned across the set regardless of title line-count / hook length. */
  .body{ flex:1; display:flex; flex-direction:column; justify-content:flex-start; padding-top:88px; max-width:1560px; }
  .track{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:18px; letter-spacing:0.28em;
      text-transform:uppercase; color:var(--ac); display:inline-flex; align-items:center; gap:12px; margin-bottom:28px; }
  .track::before{ content:''; width:9px; height:9px; border-radius:2px; background:var(--ac); }
  .title{ font-family:'Montserrat',sans-serif; font-style:italic; font-weight:900; letter-spacing:-0.035em;
      line-height:0.96; font-size:${tfs}px; }
  .title em{ font-style:italic; color:var(--ac); }
  .hook{ font-family:'Inter',sans-serif; font-weight:300; font-style:italic; font-size:31px; line-height:1.4;
      color:var(--paper-soft); margin-top:32px; max-width:1240px; }
  .foot{ display:flex; align-items:flex-end; justify-content:space-between; gap:40px; border-top:1px solid rgba(255,255,255,0.12);
      padding-top:30px; }
  .time{ display:flex; flex-direction:column; gap:6px; flex:none; }
  .time .t{ font-family:'Montserrat',sans-serif; font-weight:900; font-style:italic; font-size:46px;
      letter-spacing:-0.03em; line-height:0.9; white-space:nowrap; }
  .time .m{ font-family:'JetBrains Mono',monospace; font-weight:500; font-size:16px; letter-spacing:0.22em;
      text-transform:uppercase; color:var(--paper-mute); white-space:nowrap; }
  .time .m b{ color:var(--ac); font-weight:700; }
  .spk{ text-align:right; display:flex; flex-direction:column; gap:6px; max-width:1080px; }
  .spk .lbl{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:14px; letter-spacing:0.28em;
      text-transform:uppercase; color:var(--paper-mute); }
  .spk .name{ font-family:'Montserrat',sans-serif; font-weight:800; font-size:${sfs}px; letter-spacing:-0.02em; line-height:1.05; }
  .ghost{ position:absolute; z-index:0; pointer-events:none; user-select:none;
      font-family:'Montserrat',sans-serif; font-weight:900; font-style:italic; letter-spacing:-0.04em; line-height:0.78;
      color:rgba(255,255,255,0.045); text-transform:uppercase; }
  .ghost.abbr{ right:120px; bottom:210px; font-size:176px; }
  .ghost.num{ right:110px; bottom:196px; font-size:250px; }
  .confetti{ position:absolute; inset:0; pointer-events:none; }
  .cf{ position:absolute; box-shadow:0 2px 5px rgba(0,0,0,0.3); }
</style></head>
<body>
  <div class="grid"></div><div class="glow"></div><div class="vig"></div>
  <span class="ghost ${ghostNum ? "num" : "abbr"}">${ghost}</span>
  ${s.confetti ? confettiStill() : ""}
  <div class="frame">
    <div class="chrome">
      <span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="dot"></span></span></span>
      <span class="when"><b>${s.day}</b> · ${s.date}</span>
    </div>
    <div class="body">
      <span class="track">${s.track}</span>
      <h1 class="title">${s.title}</h1>
      ${s.hook ? `<p class="hook">${s.hook}</p>` : ""}
    </div>
    <div class="foot">
      <div class="time"><span class="t">${s.time}</span><span class="m">${s.conc ? "<b>CONCURRENT</b> · " : ""}${s.meta}</span></div>
      <div class="spk"><span class="lbl">${spkLabel}</span><span class="name">${s.speakers}</span></div>
    </div>
  </div>
</body></html>`;
}

const only = process.argv[2];
const list = only ? SESSIONS.filter((s) => s.slug === only) : SESSIONS;
if (!list.length) { console.error(`no session matching "${only}"`); process.exit(1); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
const made = [];
for (const s of list) {
  const htmlPath = join(TMP, `${s.slug}.html`);
  writeFileSync(htmlPath, cardHTML(s));
  await page.goto("file://" + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(OUT, `${s.slug}.png`) });
  made.push(s.slug);
  console.log("card ->", `renders/ringcentral/${s.slug}.png`);
}

if (!only) {
  const cells = SESSIONS.map((s) => {
    const png = join(OUT, `${s.slug}.png`);
    if (!existsSync(png)) return "";
    return `<figure><img src="file://${png}" /><figcaption>${s.slug} · ${s.day} ${s.time}</figcaption></figure>`;
  }).join("\n");
  const sheet = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <link href="file://${FONTS}" rel="stylesheet"/>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{width:1920px;background:#07121c;color:#fff;
    font-family:'Inter',sans-serif;padding:56px 64px}
    h1{font-family:'Montserrat',sans-serif;font-style:italic;font-weight:900;font-size:40px;letter-spacing:-0.03em;margin-bottom:8px}
    h1 .b{color:#37bdf8}.sub{font-family:'JetBrains Mono',monospace;font-size:15px;letter-spacing:0.24em;
    text-transform:uppercase;color:rgba(209,220,232,0.55);margin-bottom:34px}
    .g{display:grid;grid-template-columns:1fr 1fr;gap:24px}
    figure{border:1px solid rgba(55,189,248,0.20);border-radius:6px;overflow:hidden;background:#000}
    img{display:block;width:100%;height:auto}
    figcaption{font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:0.05em;color:#37bdf8;padding:9px 13px}</style>
  </head><body><h1>AIS <span class="b">LIVE</span> — Session Cards (RingCentral)</h1>
  <div class="sub">${made.length} sessions · 1920×1080 @2x · July 11–12</div>
  <div class="g">${cells}</div></body></html>`;
  const sp = join(TMP, "_contact.html");
  writeFileSync(sp, sheet);
  await page.setViewportSize({ width: 1920, height: 1600 });
  await page.goto("file://" + sp);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, "contact-sheet.png"), fullPage: true });
  console.log("contact sheet -> renders/ringcentral/contact-sheet.png");
}

await browser.close();
console.log(`\ndone — ${made.length} card(s)`);
