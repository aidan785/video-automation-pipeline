// AIS LIVE — Session Cards (#14). Static branded cards for the RingCentral schedule + social.
//   Title / time / speaker / hook on the locked AIS LIVE brand (onyx command-deck, Shift mark).
//   Static, so we render via Playwright screenshot (NOT HyperFrames video).
//   SOURCE OF TRUTH = "Event Schedule v6.1" Google Doc (199fpdNwKfbe_hFAAgyGPil_lzu7ytpRi-XhzuFn_Dvw).
//   One card per substantive session; transitions/breaks/doors/wraps/buffers are intentionally skipped.
//
//   node _gen.mjs            -> render all session cards to renders/<slug>.png + contact-sheet.png
//   node _gen.mjs <slug>     -> render just one

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = dirname(fileURLToPath(import.meta.url));
const RENDERS = join(ROOT, "renders");
const TMP = join(RENDERS, "_html");
mkdirSync(TMP, { recursive: true });
const FONTS = join(ROOT, "..", "ais-live-stings", "assets", "fonts", "fonts.css");

const D1 = { day: "DAY 1", date: "SAT · JULY 11" };
const D2 = { day: "DAY 2", date: "SUN · JULY 12" };

// accent: blue (default/workshops/keynotes) | coral (panels/sponsor) | yellow (money/VIP)
const SESSIONS = [
  // ---------- DAY 1 ----------
  { slug: "d1-01-vip-qa-nate", ...D1, track: "VIP EXCLUSIVE · Q&A", accent: "yellow",
    title: `VIP <em>Q&A</em> with Nate`, time: "9:30 AM", meta: "CT · 45 MIN", speakers: "Nate Herk",
    hook: "A real conversation with Nate before the broadcast begins. Bring your questions on services, agencies, and pricing." },
  { slug: "d1-02-hyperagent-keynote", ...D1, track: "PRESENTING SPONSOR · HYPERAGENT", accent: "coral",
    title: `The New Standard: Why You Need a Fleet of <em>Always-On Agents</em>`, time: "10:30 AM", meta: "CT · 20 MIN", speakers: "Alex McDonnell",
    hook: "The best agents operate as persistent members of your team. What it takes to run a true fleet of always-on agents." },
  { slug: "d1-03-anatomy-three-deals", ...D1, track: "MAIN STAGE", accent: "yellow",
    title: `Anatomy of <em>Three Real Deals</em>`, time: "11:00 AM", meta: "CT · 55 MIN", speakers: "Aidan Finnegan · Wyatt Lyonsmith · Glenn Marcus · Nate Herk",
    hook: "Three community members walk real client engagements end to end. The cold email, the price, the retainer. Real numbers, no hype." },
  { slug: "d1-04-sponsored-glaido", ...D1, track: "SPONSORED SESSION", accent: "coral",
    title: `<em>Glaido</em>`, time: "12:00 PM", meta: "CT · 20 MIN", speakers: "Glaido team",
    hook: "How AI agencies use Glaido for voice-enabled client work. Live demo and the integration patterns that make voice billable." },
  { slug: "d1-05-opening-keynote", ...D1, track: "OPENING KEYNOTE", accent: "blue",
    title: `You Just Watched Three Real Deals. <em>Here's How You Build the Fourth.</em>`, time: "12:30 PM", meta: "CT · 25 MIN", speakers: "Nate Herk",
    hook: "Nate frames the two days and sets the Build Day arc, then tells you what to expect from the hands-on work ahead." },
  { slug: "d1-06-wb1-foundation", ...D1, track: "WORKSHOP BLOCK 1 · FOUNDATION", accent: "blue",
    title: `Your First <em>30 Days</em> in AI Automation`, time: "12:55 PM", meta: "CT · 75 MIN", speakers: "Liberty White",
    hook: "What to build, what to ignore, and what to ship first so you have a portfolio piece prospects can evaluate." },
  { slug: "d1-07-wb1-advanced", ...D1, track: "WORKSHOP BLOCK 1 · ADVANCED", accent: "blue",
    title: `Low-Code to <em>Full-Code</em>`, time: "12:55 PM", meta: "CT · 75 MIN", speakers: "Dave Ebbelaar",
    hook: "How Dave built an AI agency without coding, then moved from low-code tools to production systems. When to stay no-code, when to commit." },
  { slug: "d1-08-featured-kacper", ...D1, track: "FEATURED SESSION", accent: "blue",
    title: `How I Run an Entire AI Agency Using <em>Claude Code</em>`, time: "2:45 PM", meta: "CT · 25 MIN", speakers: "Kacper Rutkiewicz",
    hook: "Client delivery, sales, content, retainers, daily planning, all inside one Claude Code workspace. Workflows you can steal Monday." },
  { slug: "d1-09-wb2-foundation", ...D1, track: "WORKSHOP BLOCK 2 · FOUNDATION · LIVE BUILD", accent: "blue",
    title: `Build Your First AI <em>Content Engine</em>`, time: "3:20 PM", meta: "CT · 60 MIN", speakers: "Sabrina Ramonov",
    hook: "A no-code build, end to end, customized to your niche. Leave with a working system to show prospects this week." },
  { slug: "d1-10-wb2-advanced", ...D1, track: "WORKSHOP BLOCK 2 · ADVANCED · LIVE BUILD", accent: "blue",
    title: `Build a <em>Voice AI</em> Sales Rep`, time: "3:20 PM", meta: "CT · 60 MIN", speakers: "Samin Yasar",
    hook: "The production architecture and the live build, including the failure modes you'll hit and how to recover from them." },
  { slug: "d1-11-wb3-enterprise", ...D1, track: "WORKSHOP BLOCK 3 · ENTERPRISE", accent: "blue",
    title: `Enterprise AI <em>Services</em>`, time: "4:30 PM", meta: "CT · 60 MIN", speakers: "Tangy Frederick",
    hook: "What Fortune 500 buyers actually pay AI consultants for, and how to position yourself for that buyer." },
  { slug: "d1-12-day1-close", ...D1, track: "DAY 1 CLOSE", accent: "blue",
    title: `Day 1 Close + <em>Overnight Challenge</em>`, time: "5:30 PM", meta: "CT · 15 MIN", speakers: "Nate Herk",
    hook: "Nate wraps Build Day and sets your overnight challenge. The work between now and Sunday morning matters." },
  // ---------- DAY 2 ----------
  { slug: "d2-01-day2-open", ...D2, track: "DAY 2 OPEN", accent: "blue",
    title: `Now Let's Turn This Into <em>Money</em>`, time: "9:00 AM", meta: "CT · 10 MIN", speakers: "Nate Herk",
    hook: "The Build Day is done. Nate opens Earn Day with a quick frame before VIPs head into their exclusive Q&A." },
  { slug: "d2-02-vip-qa-jon-devin", ...D2, track: "VIP EXCLUSIVE · Q&A", accent: "yellow",
    title: `VIP Q&A with <em>Jon + Devin</em>`, time: "9:10 AM", meta: "CT · 45 MIN", speakers: "Jon Morrow · Devin Kearns",
    hook: "The business side: agency exits, M&A positioning, and the operating shifts from $10K/mo operator to million-dollar exit." },
  { slug: "d2-03-hyperagent-workshop", ...D2, track: "SPONSORED WORKSHOP · HYPERAGENT", accent: "coral",
    title: `How to Build an <em>Always-On Fleet</em> of Agents`, time: "10:00 AM", meta: "CT · 60 MIN", speakers: "Alex McDonnell",
    hook: "System prompts, skills, tools, integrations, loops. Build and sell agents that act on their own without being prompted." },
  { slug: "d2-04-tool-war-panel", ...D2, track: "PANEL", accent: "coral",
    title: `The <em>Tool War</em>: What Actually Makes Money in 2026`, time: "11:10 AM", meta: "CT · 35 MIN", speakers: "Nate Herk (mod) · Dave Ebbelaar · Devin Kearns · Cole Medin",
    hook: "n8n, Claude Code, Make, custom code, voice. Which tools are actually making money in 2026? Three practitioners debate." },
  { slug: "d2-05-niche-selection", ...D2, track: "MAIN STAGE", accent: "yellow",
    title: `Niche Selection + <em>Where Leads Hide</em>`, time: "11:50 AM", meta: "CT · 35 MIN", speakers: "Nate Herk · Jon Morrow",
    hook: "Which industries are writing the checks, and where leads hide when you don't have a network. Real data from AIS deployments." },
  { slug: "d2-06-sales-arc-live", ...D2, track: "LIVE ON STAGE", accent: "coral",
    title: `The <em>Sales Arc</em>, Live`, time: "12:30 PM", meta: "CT · 65 MIN", speakers: "Nate Herk · Jon Morrow",
    hook: "A live sales call performed on stage (Nate sells, Jon plays the buyer), then a working breakdown of every move." },
  { slug: "d2-07-discovery-call-practice", ...D2, track: "LUNCH · LIVE ACTIVITY", accent: "blue",
    title: `Practice a <em>Discovery Call</em>`, time: "1:35 PM", meta: "CT · 35 MIN", speakers: "AIS team hosts",
    hook: "Paired matching and five-minute structured exercises with feedback from AIS team hosts. Open through the afternoon." },
  { slug: "d2-08-pricing-tentpole", ...D2, track: "DAY 2 TENTPOLE", accent: "yellow",
    title: `Pricing Your AI Services: <em>Real Numbers</em>, Real Frameworks`, time: "2:10 PM", meta: "CT · 45 MIN", speakers: "Speaker TBA",
    hook: "How to price AI services so you stop leaving money on the table, plus the framework that prevents pricing pushback." },
  { slug: "d2-09-sponsored-hostinger", ...D2, track: "SPONSORED SESSION", accent: "coral",
    title: `<em>Hostinger</em>`, time: "3:00 PM", meta: "CT · 20 MIN", speakers: "Hostinger team",
    hook: "How AI agencies use Hostinger for client deliveries and hosting infrastructure at scale. Real architecture, real cost economics." },
  { slug: "d2-10-scope", ...D2, track: "DELIVERY", accent: "blue",
    title: `Scope Like You <em>Mean It</em>`, time: "3:30 PM", meta: "CT · 30 MIN", speakers: "Speaker TBA",
    hook: "Scope an engagement so it ships, gets paid, and converts to a retainer. SOWs, change-order discipline, the handoff doc." },
  { slug: "d2-11-live-retainer", ...D2, track: "DELIVERY", accent: "yellow",
    title: `Inside a <em>Live Retainer</em>`, time: "4:00 PM", meta: "CT · 30 MIN", speakers: "Speaker TBA",
    hook: "What a $5K-$10K/month AI services retainer actually looks like, walked end to end. Real numbers, real client examples." },
  { slug: "d2-12-vip-pricing-war-room", ...D2, track: "VIP EXCLUSIVE", accent: "yellow",
    title: `VIP <em>Pricing War Room</em>`, time: "4:00 PM", meta: "CT · 45 MIN", speakers: "Nate Herk · Jon Morrow",
    hook: "Hot-seat pricing coaching. Bring your real pricing problem and work it through live with Nate and Jon." },
  { slug: "d2-13-matt-tina-panel", ...D2, track: "FEATURED PANEL", accent: "coral",
    title: `What's Actually <em>Working</em> in 2026`, time: "4:45 PM", meta: "CT · 30 MIN", speakers: "Matt Wolfe · Tina Huang · Nate Herk (mod)",
    hook: "Matt Wolfe and Tina Huang on what's breaking through right now, the patterns they're seeing, what's overhyped and underbuilt." },
  { slug: "d2-14-closing-keynote-build-to-sell", ...D2, track: "CLOSING KEYNOTE", accent: "yellow",
    title: `Build to <em>Sell</em>`, time: "5:20 PM", meta: "CT · 30 MIN", speakers: "Devin Kearns",
    hook: "Why AI agencies will be the most sought-after acquisition targets, and how to position for a premium exit." },
  { slug: "d2-15-nates-close", ...D2, track: "CLOSING", accent: "blue",
    title: `Nate's Close + <em>What's Next</em>`, time: "5:55 PM", meta: "CT · 25 MIN", speakers: "Nate Herk",
    hook: "Nate ties the two days together and tells you exactly what's next, including how to keep building with the community." },
  { slug: "d2-16-vip-after-party", ...D2, track: "VIP EXCLUSIVE", accent: "yellow",
    title: `VIP <em>After-Party</em> with Nate`, time: "6:20 PM", meta: "CT · 60 MIN", speakers: "Nate Herk",
    hook: "A casual after-party. No agenda. Just time with Nate at the end of two days, talking through what landed and what's next." },
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

function cardHTML(s) {
  const ac = ACCENT[s.accent] || ACCENT.blue;
  const glow = GLOW[s.accent] || GLOW.blue;
  const tfs = titleSize(s.title);
  const sfs = spkSize(s.speakers);
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
  .body{ flex:1; display:flex; flex-direction:column; justify-content:center; max-width:1560px; }
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
  .time .t{ font-family:'Montserrat',sans-serif; font-weight:900; font-style:italic; font-size:52px;
      letter-spacing:-0.03em; line-height:0.9; }
  .time .m{ font-family:'JetBrains Mono',monospace; font-weight:500; font-size:16px; letter-spacing:0.22em;
      text-transform:uppercase; color:var(--paper-mute); }
  .spk{ text-align:right; display:flex; flex-direction:column; gap:6px; max-width:1080px; }
  .spk .lbl{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:14px; letter-spacing:0.28em;
      text-transform:uppercase; color:var(--paper-mute); }
  .spk .name{ font-family:'Montserrat',sans-serif; font-weight:800; font-size:${sfs}px; letter-spacing:-0.02em; line-height:1.05; }
</style></head>
<body>
  <div class="grid"></div><div class="glow"></div><div class="vig"></div>
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
      <div class="time"><span class="t">${s.time}</span><span class="m">${s.meta}</span></div>
      <div class="spk"><span class="lbl">${s.speakers.includes("·") ? "Speakers" : "Speaker"}</span><span class="name">${s.speakers}</span></div>
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
  await page.screenshot({ path: join(RENDERS, `${s.slug}.png`) });
  made.push(s.slug);
  console.log("card ->", `renders/${s.slug}.png`);
}

if (!only) {
  const cells = SESSIONS.map((s) => {
    const png = join(RENDERS, `${s.slug}.png`);
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
  </head><body><h1>AIS <span class="b">LIVE</span> — Session Cards (v6.1)</h1>
  <div class="sub">${made.length} sessions · 1920×1080 @2x · July 11–12</div>
  <div class="g">${cells}</div></body></html>`;
  const sp = join(TMP, "_contact.html");
  writeFileSync(sp, sheet);
  await page.setViewportSize({ width: 1920, height: 1600 });
  await page.goto("file://" + sp);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(RENDERS, "contact-sheet.png"), fullPage: true });
  console.log("contact sheet -> renders/contact-sheet.png");
}

await browser.close();
console.log(`\ndone — ${made.length} card(s)`);
