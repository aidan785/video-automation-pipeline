// AIS LIVE — "Up Next" session bumpers (#NET-NEW). Short animated clips that play
// between sessions on the broadcast: UP NEXT · session title · speaker · time.
// HyperFrames VIDEO (mp4), one per v6.1 session. Self-contained (own HyperFrames
// contract + brand CSS) so it can't affect the 4 existing card projects, but matches
// the AIS LIVE look: onyx command-deck, live HTML mark with pulsing dot, 1.6s beat.
// Brand source: AIS-LIVE-BRAND.md. Sessions source: Event Schedule v6.1.
//
//   node _gen.mjs <slug>   -> writes all cards/*.html + copies <slug> to index.html for render

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const D = 8.0; // brand: multiples of 1.6s stay in phase with the live-dot

const ACCENT = {
  blue: { hex: "#37bdf8", glow: "rgba(55,189,248,0.55)" },
  coral: { hex: "#ff8a5c", glow: "rgba(255,138,92,0.55)" },
  yellow: { hex: "#f5d82a", glow: "rgba(245,216,42,0.45)" },
};

// accent: blue (workshops/keynotes) | coral (panels/sponsor) | yellow (money/VIP)
const SESSIONS = [
  { slug: "d1-01-vip-qa-nate", accent: "yellow", day: "DAY 1", time: "9:30 AM", title: `VIP <em>Q&A</em> with Nate`, speakers: "Nate Herk" },
  { slug: "d1-02-hyperagent-keynote", accent: "coral", day: "DAY 1", time: "10:30 AM", title: `A Fleet of <em>Always-On Agents</em>`, speakers: "Alex McDonnell · HyperAgent" },
  { slug: "d1-03-anatomy-three-deals", accent: "yellow", day: "DAY 1", time: "11:00 AM", title: `Anatomy of <em>Three Real Deals</em>`, speakers: "Aidan Finnegan · Wyatt Lyonsmith · Glenn Marcus · Nate Herk" },
  { slug: "d1-04-glaido", accent: "coral", day: "DAY 1", time: "12:00 PM", title: `Sponsored Session: <em>Glaido</em>`, speakers: "Glaido team" },
  { slug: "d1-05-opening-keynote", accent: "blue", day: "DAY 1", time: "12:30 PM", title: `Opening <em>Keynote</em>`, speakers: "Nate Herk" },
  { slug: "d1-06-wb1-foundation", accent: "blue", day: "DAY 1", time: "12:55 PM", title: `Your First <em>30 Days</em> in AI Automation`, speakers: "Liberty White" },
  { slug: "d1-07-wb1-advanced", accent: "blue", day: "DAY 1", time: "12:55 PM", title: `Low-Code to <em>Full-Code</em>`, speakers: "Dave Ebbelaar" },
  { slug: "d1-08-featured-kacper", accent: "blue", day: "DAY 1", time: "2:45 PM", title: `Run an Agency on <em>Claude Code</em>`, speakers: "Kacper Rutkiewicz" },
  { slug: "d1-09-wb2-foundation", accent: "blue", day: "DAY 1", time: "3:20 PM", title: `Build Your First AI <em>Content Engine</em>`, speakers: "Sabrina Ramonov" },
  { slug: "d1-10-wb2-advanced", accent: "blue", day: "DAY 1", time: "3:20 PM", title: `Build a <em>Voice AI</em> Sales Rep`, speakers: "Samin Yasar" },
  { slug: "d1-11-wb3-enterprise", accent: "blue", day: "DAY 1", time: "4:30 PM", title: `Enterprise AI <em>Services</em>`, speakers: "Tangy Frederick" },
  { slug: "d1-12-day1-close", accent: "blue", day: "DAY 1", time: "5:30 PM", title: `Day 1 Close + <em>Overnight Challenge</em>`, speakers: "Nate Herk" },
  { slug: "d2-01-day2-open", accent: "blue", day: "DAY 2", time: "9:00 AM", title: `Now Let's Turn This Into <em>Money</em>`, speakers: "Nate Herk" },
  { slug: "d2-02-vip-qa-jon-devin", accent: "yellow", day: "DAY 2", time: "9:10 AM", title: `VIP Q&A with <em>Jon + Devin</em>`, speakers: "Jon Morrow · Devin Kearns" },
  { slug: "d2-03-hyperagent-workshop", accent: "coral", day: "DAY 2", time: "10:00 AM", title: `Build an <em>Always-On Fleet</em> of Agents`, speakers: "Alex McDonnell · HyperAgent" },
  { slug: "d2-04-tool-war-panel", accent: "coral", day: "DAY 2", time: "11:10 AM", title: `The <em>Tool War</em> Panel`, speakers: "Nate Herk · Dave Ebbelaar · Devin Kearns · Cole Medin" },
  { slug: "d2-05-niche-selection", accent: "yellow", day: "DAY 2", time: "11:50 AM", title: `Niche Selection + <em>Where Leads Hide</em>`, speakers: "Nate Herk · Jon Morrow" },
  { slug: "d2-06-sales-arc-live", accent: "coral", day: "DAY 2", time: "12:30 PM", title: `The <em>Sales Arc</em>, Live`, speakers: "Nate Herk · Jon Morrow" },
  { slug: "d2-07-discovery-call-practice", accent: "blue", day: "DAY 2", time: "1:35 PM", title: `Practice a <em>Discovery Call</em>`, speakers: "AIS team hosts" },
  { slug: "d2-08-pricing-tentpole", accent: "yellow", day: "DAY 2", time: "2:10 PM", title: `Pricing Your <em>AI Services</em>`, speakers: "Speaker TBA" },
  { slug: "d2-09-hostinger", accent: "coral", day: "DAY 2", time: "3:00 PM", title: `Sponsored Session: <em>Hostinger</em>`, speakers: "Hostinger team" },
  { slug: "d2-10-scope", accent: "blue", day: "DAY 2", time: "3:30 PM", title: `Scope Like You <em>Mean It</em>`, speakers: "Speaker TBA" },
  { slug: "d2-11-live-retainer", accent: "yellow", day: "DAY 2", time: "4:00 PM", title: `Inside a <em>Live Retainer</em>`, speakers: "Speaker TBA" },
  { slug: "d2-12-vip-pricing-war-room", accent: "yellow", day: "DAY 2", time: "4:00 PM", title: `VIP <em>Pricing War Room</em>`, speakers: "Nate Herk · Jon Morrow" },
  { slug: "d2-13-matt-tina-panel", accent: "coral", day: "DAY 2", time: "4:45 PM", title: `What's Actually <em>Working</em> in 2026`, speakers: "Matt Wolfe · Tina Huang · Nate Herk" },
  { slug: "d2-14-closing-keynote", accent: "yellow", day: "DAY 2", time: "5:20 PM", title: `Closing Keynote: <em>Build to Sell</em>`, speakers: "Devin Kearns" },
  { slug: "d2-15-nates-close", accent: "blue", day: "DAY 2", time: "5:55 PM", title: `Nate's Close + <em>What's Next</em>`, speakers: "Nate Herk" },
  { slug: "d2-16-vip-after-party", accent: "yellow", day: "DAY 2", time: "6:20 PM", title: `VIP <em>After-Party</em> with Nate`, speakers: "Nate Herk" },
];

const plain = (h) => h.replace(/<[^>]+>/g, "");
const titleSize = (h) => { const n = plain(h).length; return n <= 20 ? 150 : n <= 32 ? 124 : n <= 46 ? 100 : n <= 64 ? 80 : 64; };
const spkSize = (s) => (s.length > 48 ? 30 : s.length > 30 ? 36 : 44);

function timelineJS(c) {
  const dotRepeat = Math.round(D / 0.8) - 1;
  const ringRepeat = Math.round(D / 1.6) - 1;
  const glowDur = D / 2;
  return `      window.__timelines = window.__timelines || {};
      const D = ${D};
      const tl = gsap.timeline({ paused: true });

      /* AMBIENT — phase-locked to 1.6s (brand §10), seamless at the beat */
      tl.to(".dot", { scale: 1.1, duration: 0.8, yoyo: true, repeat: ${dotRepeat}, ease: "sine.inOut", transformOrigin: "50% 50%" }, 0);
      tl.fromTo(".ring", { scale: 1, autoAlpha: 0 }, { keyframes: [
        { autoAlpha: 0.5, scale: 1, duration: 0.001 },
        { autoAlpha: 0, scale: 2.6, duration: 0.999, ease: "power2.out" },
        { autoAlpha: 0, scale: 1, duration: 0.6 }
      ], repeat: ${ringRepeat}, ease: "none" }, 0);
      tl.to(".glow", { x: 40, y: -22, duration: ${glowDur}, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      tl.to(".grid", { backgroundPosition: "24px 24px", duration: D, ease: "none" }, 0);

      /* ENTRANCE — settles to the rest pose, then holds */
      tl.from(".eyebrow", { autoAlpha: 0, y: -12, duration: 0.5, ease: "power2.out" }, 0.15);
      tl.from(".title", { clipPath: "inset(0 100% 0 0)", duration: 0.62, ease: "power3.out" }, 0.32);
      tl.from(".speakers", { autoAlpha: 0, y: 16, duration: 0.5, ease: "power2.out" }, 0.82);
      tl.from(".when", { autoAlpha: 0, y: 10, duration: 0.45, ease: "power2.out" }, 0.98);
      tl.from(".markwrap", { autoAlpha: 0, scale: 0.92, y: 8, duration: 0.5, ease: "back.out(1.4)", transformOrigin: "50% 50%" }, 1.12);

      tl.set({}, {}, D); // Law #11 — fill the slot
      window.__timelines["cmp-${c.slug}"] = tl;`;
}

function buildBumper(c) {
  const a = ACCENT[c.accent] || ACCENT.blue;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — up next — ${c.slug}</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root { --onyx:#07121c; --blue:#37bdf8; --red-live:#ff3b30;
        --font-display:"Montserrat",sans-serif; --font-body:"Inter",sans-serif; --font-mono:"JetBrains Mono",monospace; }
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { width:1920px; height:1080px; overflow:hidden; background:#000; color:#fff; font-family:var(--font-body); }
      #root { position:relative; width:1920px; height:1080px; overflow:hidden; background:var(--onyx); isolation:isolate; }
      #root .clip { position:absolute; inset:0; width:1920px; height:1080px; pointer-events:none; }
      .grid { position:absolute; inset:-48px;
        background-image:
          linear-gradient(rgba(55,189,248,0.065) 1px, transparent 1px),
          linear-gradient(90deg, rgba(55,189,248,0.065) 1px, transparent 1px);
        background-size:24px 24px; }
      .glow { position:absolute; top:-160px; left:50%; width:760px; height:760px; margin-left:-380px;
        border-radius:50%; background:${a.hex}; filter:blur(150px); opacity:0.18; }
      .vignette { position:absolute; inset:0; background:radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 95%); }
      .wrap { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:34px; padding:120px 140px; text-align:center; }
      .eyebrow { font-family:var(--font-mono); font-weight:700; font-size:26px; letter-spacing:0.34em;
        text-transform:uppercase; color:${a.hex}; display:inline-flex; align-items:center; gap:13px; }
      .eyebrow::before { content:""; width:10px; height:10px; border-radius:2px; background:currentColor; box-shadow:0 0 10px currentColor; }
      .title { font-family:var(--font-display); font-style:italic; font-weight:900; font-size:${titleSize(c.title)}px;
        line-height:0.96; letter-spacing:-0.035em; color:#fff; max-width:1580px; clip-path:inset(0 0 0 0); }
      .title em { font-style:italic; color:${a.hex}; }
      .speakers { font-family:var(--font-display); font-weight:800; font-size:${spkSize(c.speakers)}px;
        letter-spacing:-0.02em; color:#fff; max-width:1500px; line-height:1.1; }
      .when { font-family:var(--font-mono); font-weight:700; font-size:27px; letter-spacing:0.3em;
        text-transform:uppercase; color:${a.hex}; }
      .markwrap { display:inline-flex; margin-top:8px; }
      .mark { font-family:var(--font-display); font-style:italic; font-weight:900; letter-spacing:-0.03em;
        line-height:0.9; font-size:64px; display:inline-flex; align-items:baseline; position:relative; }
      .mark .ais { color:#fff; }
      .mark .gap { display:inline-block; width:0.08em; }
      .live { position:relative; color:var(--blue); text-shadow:0 0 60px rgba(55,189,248,0.55); padding-right:0.28em; }
      .dot { position:absolute; top:0.08em; left:100%; margin-left:0.06em; width:0.16em; height:0.16em; border-radius:50%;
        background:var(--red-live); box-shadow:0 0 0.7em #ff3b30, 0 0 0.25em #ff3b30; }
      .ring { position:absolute; top:0.08em; left:100%; margin-left:0.06em; width:0.16em; height:0.16em; border-radius:50%;
        background:rgba(255,59,48,0.55); opacity:0; transform-origin:50% 50%; pointer-events:none; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="cmp-${c.slug}" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        <div class="grid"></div>
        <div class="glow"></div>
        <div class="vignette"></div>
      </div>
      <div id="scene" class="clip" data-start="0" data-duration="${D}" data-track-index="1">
        <div class="wrap">
          <div class="eyebrow">Up Next</div>
          <div class="title">${c.title}</div>
          <div class="speakers">${c.speakers}</div>
          <div class="when">${c.day} · ${c.time} CT</div>
          <div class="markwrap"><span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>
        </div>
      </div>
    </div>
    <script>
${timelineJS(c)}
    <\/script>
  </body>
</html>
`;
}

let wrote = 0;
for (const c of SESSIONS) { writeFileSync(join(SRC, `${c.slug}.html`), buildBumper(c)); wrote++; }
const arg = process.argv[2];
if (arg) {
  copyFileSync(join(SRC, `${arg}.html`), join(DIR, "index.html"));
  console.log(`wrote ${wrote} cards/*.html; index.html <- cards/${arg}.html`);
} else {
  console.log(`wrote ${wrote} cards/*.html`);
}
