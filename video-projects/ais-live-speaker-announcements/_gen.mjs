// AIS LIVE — Session Announcement Cards (#18). 16:9 motion cards, ONE PER SESSION SLOT
// on the v7.1 agenda (repeat speakers get a card per session they're in).
//   Layout: SOLO session -> full-color portrait cutout on the left (normal). MULTI session ->
//   circular profile-picture headshots stacked vertically on the left (same size, top→bottom).
//   RIGHT: session TITLE (hero) -> speaker name(s) -> credentials -> day/time. No eyebrow, no track.
//   Profile pics: assets/medallions/<slug>.png · solo cutout: assets/cutouts-clean/<slug>.png.
//   No headshot yet -> silhouette placeholder.
//   Data: Full Agenda v7.1 (July 11-12, 2026). All times Central.
//
//   node _gen.mjs            -> write all cards to cards/<id>.html
//   node _gen.mjs <id>       -> write all + copy <id> to index.html (for preview/render)

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const CARDS = join(DIR, "cards");
mkdirSync(CARDS, { recursive: true });

const DUR = 6.4; // 4 × 1.6s brand beat

// ---- People (name + credential; placeholder = no headshot yet) ----
const PEOPLE = {
  "nate-herk": { name: "Nate Herk", role: "Founder · Uppit AI & AIS" },
  "aidan-finnegan": { name: "Aidan Finnegan", role: "Founder · Opulence AI" },
  "glenn-marcus": { name: "Glenn Marcus", role: "Founder · Cliq Consulting" },
  "wyatt-lyonsmith": { name: "Wyatt Lyonsmith", role: "Owner · GrowMoto" },
  "jon-morrow": { name: "Jon Morrow", role: "President & COO · Uppit AI" },
  "alex-mcdonnell": { name: "Alex McDonnell", role: "Product Marketing · HyperAgent" },
  "ednan-abdullayev": { name: "Ednan Abdullayev", role: "Tech Lead · AIS" },
  "jannis-moore": { name: "Jannis Moore", role: "Co-Founder · Glaido" },
  "liberty-white": { name: "Liberty White", role: "Founder · She Learns AI" },
  "dave-ebbelaar": { name: "Dave Ebbelaar", role: "Founder · Datalumina" },
  "jenn-van-wagner": { name: "Jenn Van Wagner", role: "Business Operations Specialist · Uppit AI" },
  "russ-henneberry": { name: "Russ Henneberry", role: "Founder · theCLICK" },
  "kodi": { name: "Kodi Zene", role: "" },
  "meghan-cox": { name: "Meghan Cox", role: "", placeholder: true },
  "kacper-rutkiewicz": { name: "Kacper Rutkiewicz", role: "Founder · DeepRooted" },
  "sabrina-ramonov": { name: "Sabrina Ramonov", role: "Founder & CEO · Blotato" },
  "samin-yasar": { name: "Samin Yasar", role: "Founder & CEO · BookedIn.ai" },
  "tangy-frederick": { name: "Tangy Frederick", role: "President · Regal Unicorn" },
  "devin-kearns": { name: "Devin Kearns", role: "Founder · Custom AI Studio" },
  "cole-medin": { name: "Cole Medin", role: "Founder · Dynamous AI" },
  "pat-blakely": { name: "Pat Blakely", role: "Writer & Product Manager" },
  "yash-chauhan": { name: "Yash Chauhan", role: "Community Manager · AIS" },
  "jonathan-stark": { name: "Jonathan Stark", role: "Founder · The Ditching Hourly Guy" },
  "dariia-vasylieva": { name: "Dr. Dariia Vasylieva", role: "Founder & CEO · RaiseTalks" },
  "anne-marie-enns": { name: "Anne-Marie Enns", role: "" },
  "amy-simpson": { name: "Amy Simpson", role: "Co-Owner · Simpatico Design Studio" },
  "matt-wolfe": { name: "Matt Wolfe", role: "Founder · Future Tools" },
  "jack-roberts": { name: "Jack Roberts", role: "Co-Founder · Glaido" },
};

// per-portrait scale nudges for the solo full-color cutout
const IMGSCALE = { "liberty-white": 1.22, "tangy-frederick": 1.18, "alex-mcdonnell": 1.12, "dave-ebbelaar": 1.12,
  "russ-henneberry": 1.12, "sabrina-ramonov": 1.12, "samin-yasar": 1.12, "jonathan-stark": 1.1, "amy-simpson": 1.12 };

// ---- Sessions (one card each). speakers[0] = featured (portrait / listed first). ----
export const SESSIONS = [
  // Day 1 · Build Day (Sat Jul 11)
  { id: "d1-nate-vipqa", title: "VIP Q&A with Nate", day: "SAT · JUL 11", time: "9:30 AM CT", speakers: ["nate-herk"] },
  { id: "d1-welcome", title: "Welcome to AIS Live", day: "SAT · JUL 11", time: "10:15 AM CT", speakers: ["nate-herk"] },
  { id: "d1-anatomy", title: "Anatomy of Three Real Deals", day: "SAT · JUL 11", time: "10:30 AM CT", speakers: ["aidan-finnegan", "nate-herk", "glenn-marcus", "wyatt-lyonsmith"] },
  { id: "d1-debrief-deals", title: "Live Debrief: Patterns from Real Deals", day: "SAT · JUL 11", time: "11:25 AM CT", speakers: ["russ-henneberry", "yash-chauhan"] },
  { id: "d1-alex-keynote", title: "Why You Need a Fleet of Always-On Agents", day: "SAT · JUL 11", time: "11:40 AM CT", speakers: ["alex-mcdonnell"] },
  { id: "d1-glaido", title: "Building an AI Native SaaS Company Sponsored by Glaido", day: "SAT · JUL 11", time: "12:00 PM CT", speakers: ["jannis-moore", "dave-ebbelaar", "jack-roberts", "nate-herk"] },
  { id: "d1-evals", title: "AI Evals: Catch Mistakes Before Your Clients Do", day: "SAT · JUL 11", time: "12:20 PM CT", speakers: ["nate-herk", "ednan-abdullayev"] },
  { id: "d1-liberty-30days", title: "Your First 30 Days in AI Automation", day: "SAT · JUL 11", time: "12:45 PM CT", speakers: ["liberty-white"] },
  { id: "d1-dave-lowcode", title: "Low-Code to Full-Code", day: "SAT · JUL 11", time: "12:45 PM CT", speakers: ["dave-ebbelaar"] },
  { id: "d1-jon-land", title: "Land Your First Paying Client", day: "SAT · JUL 11", time: "2:00 PM CT", speakers: ["jon-morrow"] },
  { id: "d1-jenn-expertise", title: "Turn Your Expertise Into a Service", day: "SAT · JUL 11", time: "2:00 PM CT", speakers: ["jenn-van-wagner"] },
  { id: "d1-russ-price", title: "Price It Right", day: "SAT · JUL 11", time: "2:00 PM CT", speakers: ["russ-henneberry"] },
  { id: "d1-kodi-scope", title: "Scope to Ship", day: "SAT · JUL 11", time: "2:00 PM CT", speakers: ["kodi"] },
  { id: "d1-meghan-tooling", title: "Tooling Reset", day: "SAT · JUL 11", time: "2:00 PM CT", speakers: ["meghan-cox"] },
  { id: "d1-kacper-claude", title: "How I Run an Entire AI Agency Using Claude Code", day: "SAT · JUL 11", time: "2:35 PM CT", speakers: ["kacper-rutkiewicz"] },
  { id: "d1-sabrina-content", title: "Build Your First AI Content Engine", day: "SAT · JUL 11", time: "3:10 PM CT", speakers: ["sabrina-ramonov"] },
  { id: "d1-samin-voice", title: "Build a Voice AI Sales Rep", day: "SAT · JUL 11", time: "3:10 PM CT", speakers: ["samin-yasar"] },
  { id: "d1-tangy-enterprise", title: "Enterprise AI Services", day: "SAT · JUL 11", time: "4:20 PM CT", speakers: ["tangy-frederick"] },
  { id: "d1-certified-close", title: "AIS+ Certification and Closing Remarks", day: "SAT · JUL 11", time: "5:05 PM CT", speakers: ["nate-herk", "ednan-abdullayev"] },

  // Day 2 · Earn Day (Sun Jul 12)
  { id: "d2-nate-open", title: "Now Let's Turn This Into Money", day: "SUN · JUL 12", time: "9:45 AM CT", speakers: ["nate-herk"] },
  { id: "d2-alex-workshop", title: "How to Build an Always-On Fleet of Agents", day: "SUN · JUL 12", time: "10:00 AM CT", speakers: ["alex-mcdonnell"] },
  { id: "d2-toolwar", title: "The Tool War: What Makes Money in 2026", day: "SUN · JUL 12", time: "11:10 AM CT", speakers: ["devin-kearns", "dave-ebbelaar", "cole-medin"] },
  { id: "d2-where10", title: "Where Your First 10 Clients Are Hiding", day: "SUN · JUL 12", time: "11:50 AM CT", speakers: ["jon-morrow", "pat-blakely"] },
  { id: "d2-salesarc", title: "The Sales Arc, Live", day: "SUN · JUL 12", time: "12:30 PM CT", speakers: ["jon-morrow", "pat-blakely", "nate-herk"] },
  { id: "d2-pat-10plan", title: "Your First 10 Clients Plan", day: "SUN · JUL 12", time: "1:35 PM CT", speakers: ["pat-blakely"] },
  { id: "d2-jenn-expertise", title: "Turn Your Expertise Into a Service", day: "SUN · JUL 12", time: "1:35 PM CT", speakers: ["jenn-van-wagner"] },
  { id: "d2-jon-land", title: "Land Your First Paying Client", day: "SUN · JUL 12", time: "1:35 PM CT", speakers: ["jon-morrow"] },
  { id: "d2-russ-salescall", title: "First Sales Call Prep", day: "SUN · JUL 12", time: "1:35 PM CT", speakers: ["russ-henneberry"] },
  { id: "d2-yash-solo", title: "From Solo to Real Business", day: "SUN · JUL 12", time: "1:35 PM CT", speakers: ["yash-chauhan"] },
  { id: "d2-welcomeback", title: "Welcome Back: Sales Call Recap", day: "SUN · JUL 12", time: "2:10 PM CT", speakers: ["nate-herk", "jon-morrow"] },
  { id: "d2-jonathan-hourly", title: "Ditching Hourly", day: "SUN · JUL 12", time: "2:25 PM CT", speakers: ["jonathan-stark"] },
  { id: "d2-buying-ai", title: "What Companies Are Actually Buying in AI", day: "SUN · JUL 12", time: "3:10 PM CT", speakers: ["dariia-vasylieva", "anne-marie-enns"] },
  { id: "d2-amy-client", title: "The Client Didn't Ask for AI", day: "SUN · JUL 12", time: "4:05 PM CT", speakers: ["amy-simpson"] },
  { id: "d2-pricing-warroom", title: "VIP Pricing War Room", day: "SUN · JUL 12", time: "4:05 PM CT", speakers: ["nate-herk", "jon-morrow"] },
  { id: "d2-matt-matters", title: "What Actually Matters in AI Right Now", day: "SUN · JUL 12", time: "4:45 PM CT", speakers: ["matt-wolfe", "nate-herk"] },
  { id: "d2-devin-buildtosell", title: "Build to Sell", day: "SUN · JUL 12", time: "5:15 PM CT", speakers: ["devin-kearns"] },
  { id: "d2-nate-finalclose", title: "Nate's Close + AIS+ Pitch", day: "SUN · JUL 12", time: "5:45 PM CT", speakers: ["nate-herk"] },
  { id: "d2-nate-afterparty", title: "VIP After-Party with Nate", day: "SUN · JUL 12", time: "6:10 PM CT", speakers: ["nate-herk"], confetti: true },
];

const picSrc = (slug) => (PEOPLE[slug]?.placeholder ? "assets/medallions/_placeholder.png" : `assets/medallions/${slug}.png`);
const cutoutSrc = (slug) => (PEOPLE[slug]?.placeholder ? "assets/cutouts-clean/_placeholder.png" : `assets/cutouts-clean/${slug}.png`);

function titleSize(str) {
  const n = str.length;
  return n <= 15 ? 116 : n <= 24 ? 98 : n <= 34 ? 80 : n <= 46 ? 66 : 56;
}

// Deterministic confetti burst (seeded LCG so every render frame is identical). Pieces
// emit from an upper-center origin, pop outward with a back-ease, then fall + fade.
function confettiParts() {
  let s = 1337;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296);
  const COLORS = ["#37bdf8", "#ff8a5c", "#ffffff", "#ff3b30"];
  const N = 48;
  const P = [];
  for (let i = 0; i < N; i++) {
    const ang = rnd() * Math.PI * 2;
    const rad = 220 + rnd() * 780;
    const tx = Math.round(Math.cos(ang) * rad);
    const ty = Math.round(Math.sin(ang) * rad * 0.6) - 70;
    const rot = Math.round((rnd() * 2 - 1) * 540);
    const fall = 280 + Math.round(rnd() * 440);
    const d = +(rnd() * 0.3).toFixed(3);
    const w = 8 + Math.round(rnd() * 8);
    const h = 10 + Math.round(rnd() * 12);
    const col = COLORS[i % COLORS.length];
    const round = rnd() < 0.25 ? "50%" : "1px";
    P.push({ tx, ty, rot, fall, d, w, h, col, round });
  }
  const html =
    `<div class="confetti">` +
    P.map((p) => `<i class="cf" style="width:${p.w}px;height:${p.h}px;background:${p.col};border-radius:${p.round};"></i>`).join("") +
    `</div>`;
  const cf = JSON.stringify(P.map((p) => ({ tx: p.tx, ty: p.ty, rot: p.rot, fall: p.fall, d: p.d })));
  return { html, cf };
}

function cardHTML(sess) {
  const D = DUR;
  const faces = sess.speakers;
  const N = faces.length;
  const isMulti = N > 1;
  const tfs = titleSize(sess.title || "");

  const DIA = ({ 1: 380, 2: 300, 3: 250, 4: 184 })[N] || 380;
  const GAP = ({ 1: 0, 2: 34, 3: 30, 4: 24 })[N] || 0;
  const picsLeft = 130;
  const contentLeft = isMulti ? picsLeft + DIA + 96 : 928;
  const imgScale = IMGSCALE[faces[0]] || 1.08;
  const spNameFs = N <= 2 ? 42 : 34;
  const spRoleFs = N <= 2 ? 27 : 22;

  const dayChrome = `<b>${sess.day.split(" · ")[0]}</b> · ${sess.day.split(" · ")[1]}`;
  const ringRepeat = Math.round(D / 1.6) - 1;
  const glowDur = D / 2;
  const confetti = sess.confetti ? confettiParts() : { html: "", cf: "null" };

  const picsHTML = faces
    .map((slug) => `<img class="pic" src="${picSrc(slug)}" crossorigin="anonymous" alt="${PEOPLE[slug]?.name || slug}" />`)
    .join("\n          ");

  const portraitHTML = isMulti
    ? `<div class="pics">\n          ${picsHTML}\n        </div>`
    : `<div class="portrait"><img src="${cutoutSrc(faces[0])}" crossorigin="anonymous" alt="${PEOPLE[faces[0]]?.name || faces[0]}" /></div>`;

  const speakersHTML = faces
    .map((slug) => {
      const p = PEOPLE[slug] || { name: slug, role: "" };
      return `<div class="sp"><div class="sp-name">${p.name}</div>${p.role ? `<div class="sp-role">${p.role}</div>` : ""}</div>`;
    })
    .join("\n            ");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — ${sess.id}</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root {
        --onyx: #07121c; --blue: #37bdf8; --red-live: #ff3b30;
        --paper-soft: rgba(209,220,232,0.82); --paper-mute: rgba(209,220,232,0.55);
        --font-display: "Montserrat", sans-serif; --font-body: "Inter", sans-serif; --font-mono: "JetBrains Mono", monospace;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #000; color: #fff; font-family: var(--font-body); }
      #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: var(--onyx); isolation: isolate; }
      #root .clip { position: absolute; inset: 0; width: 1920px; height: 1080px; pointer-events: none; }

      /* ---------- background ---------- */
      .grid { position: absolute; inset: -48px;
        background-image:
          linear-gradient(rgba(55,189,248,0.065) 1px, transparent 1px),
          linear-gradient(90deg, rgba(55,189,248,0.065) 1px, transparent 1px);
        background-size: 24px 24px; }
      .glow { position: absolute; top: -180px; left: 20%; width: 760px; height: 760px; margin-left: -380px;
        border-radius: 50%; background: var(--blue); filter: blur(150px); opacity: 0.16; }
      .pedestal { position: absolute; left: 40px; bottom: -280px; width: 760px; height: 760px;
        border-radius: 50%; background: var(--blue); filter: blur(150px); opacity: 0.20; }
      .vignette { position: absolute; inset: 0; pointer-events: none;
        background: radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.58) 95%); }

      /* ---------- portrait (solo, full-color cutout) ---------- */
      .portrait { position: absolute; left: 10px; bottom: 0; width: 900px; height: 1000px;
        display: flex; align-items: flex-end; justify-content: center; }
      .portrait img { max-width: 100%; max-height: 100%; object-fit: contain; object-position: bottom center;
        transform: scale(${imgScale}); transform-origin: bottom center;
        filter: drop-shadow(0 26px 54px rgba(0,0,0,0.55));
        -webkit-mask-image:
          linear-gradient(to bottom, #000 80%, transparent 100%),
          linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%);
        -webkit-mask-composite: source-in;
        mask-image:
          linear-gradient(to bottom, #000 80%, transparent 100%),
          linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%);
        mask-composite: intersect; }

      /* ---------- profile pics (multi: left column, vertically centered, left-aligned) ---------- */
      .pics { position: absolute; left: ${picsLeft}px; top: 0; bottom: 0; width: ${DIA}px;
        display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: ${GAP}px; }
      .pic { width: ${DIA}px; height: ${DIA}px; display: block;
        filter: drop-shadow(0 18px 36px rgba(0,0,0,0.55)); }

      /* ---------- content (right) ---------- */
      .content { position: absolute; left: ${contentLeft}px; right: 110px; top: 0; bottom: 0;
        display: flex; flex-direction: column; justify-content: center; }
      .ses-title { font-family: var(--font-display); font-style: italic; font-weight: 900; letter-spacing: -0.03em;
        line-height: 1.08; font-size: ${tfs}px; color: #fff; max-width: 1180px;
        padding: 0.06em 0.42em 0.16em 0; clip-path: inset(-0.16em -0.44em -0.30em -0.08em);
        text-shadow: 0 0 60px rgba(55,189,248,0.20); }
      .divider { width: 128px; height: 2px; background: var(--blue); margin: 34px 0 30px;
        box-shadow: 0 0 16px rgba(55,189,248,0.6); transform-origin: left center; }
      .speakers { display: flex; flex-direction: column; gap: ${N <= 2 ? 18 : 14}px; }
      .sp-name { font-family: var(--font-display); font-style: italic; font-weight: 800; letter-spacing: -0.02em;
        font-size: ${spNameFs}px; color: #fff; line-height: 1.02; }
      .sp-role { font-family: var(--font-body); font-weight: 300; font-style: italic; font-size: ${spRoleFs}px;
        letter-spacing: -0.01em; color: var(--paper-soft); margin-top: 4px; }
      .ses-meta { font-family: var(--font-mono); font-weight: 500; font-size: 21px; letter-spacing: 0.22em;
        text-transform: uppercase; color: var(--paper-mute); margin-top: 34px; }

      /* ---------- chrome ---------- */
      .chrome { position: absolute; top: 60px; left: 90px; right: 110px;
        display: flex; align-items: center; justify-content: space-between; }
      .logo { position: relative; display: inline-flex; }
      .logo img { height: 52px; display: block; filter: drop-shadow(0 0 40px rgba(55,189,248,0.45)); }
      .logo .ring { position: absolute; top: 12px; right: 13px; width: 7px; height: 7px;
        border-radius: 50%; background: rgba(255,59,48,0.6); opacity: 0; transform-origin: 50% 50%; }
      .day { font-family: var(--font-mono); font-weight: 700; font-size: 20px; letter-spacing: 0.26em;
        text-transform: uppercase; color: var(--paper-mute); text-align: right; }
      .day b { color: var(--blue); }

      /* ---------- confetti ---------- */
      .confetti { position: absolute; left: 960px; top: 430px; z-index: 7; pointer-events: none; }
      .cf { position: absolute; left: 0; top: 0; display: block; box-shadow: 0 2px 6px rgba(0,0,0,0.35); }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="cmp-${sess.id}" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        <div class="grid"></div>
        <div class="glow"></div>
        <div class="pedestal"></div>
        <div class="vignette"></div>
      </div>
      <div id="scene" class="clip" data-start="0" data-duration="${D}" data-track-index="1">
        ${portraitHTML}
        <div class="content">
          <div class="ses-title">${sess.title}</div>
          <div class="divider"></div>
          <div class="speakers">
            ${speakersHTML}
          </div>
          <div class="ses-meta">${sess.day} · ${sess.time}</div>
        </div>
        <div class="chrome">
          <span class="logo"><img src="assets/logos/AIS-LIVE-with-dot.png" crossorigin="anonymous" alt="AIS LIVE" /><span class="ring"></span></span>
          <span class="day">${dayChrome}</span>
        </div>
        ${confetti.html}
      </div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const D = ${D};
      const tl = gsap.timeline({ paused: true });

      tl.fromTo(".ring", { scale: 1, autoAlpha: 0 }, { keyframes: [
        { autoAlpha: 0.5, scale: 1, duration: 0.001 },
        { autoAlpha: 0, scale: 2.6, duration: 0.999, ease: "power2.out" },
        { autoAlpha: 0, scale: 1, duration: 0.6 }
      ], repeat: ${ringRepeat}, ease: "none" }, 0);
      tl.to(".glow", { x: 40, y: -20, duration: ${glowDur}, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      tl.to(".pedestal", { scale: 1.06, duration: ${glowDur}, yoyo: true, repeat: 1, ease: "sine.inOut", transformOrigin: "50% 50%" }, 0);
      tl.to(".grid", { backgroundPosition: "24px 24px", duration: D, ease: "none" }, 0);
      tl.fromTo(".ses-title", { textShadow: "0 0 50px rgba(55,189,248,0.14)" }, { textShadow: "0 0 92px rgba(55,189,248,0.32)", duration: 2.4, yoyo: true, repeat: ${Math.round(D / 2.4) - 1}, ease: "sine.inOut" }, 0);

      tl.from(".logo", { autoAlpha: 0, y: -14, duration: 0.5, ease: "power2.out" }, 0.15);
      tl.from(".day", { autoAlpha: 0, x: 14, duration: 0.5, ease: "power2.out" }, 0.3);
      ${isMulti
        ? `tl.from(".pic", { autoAlpha: 0, x: -50, scale: 0.7, duration: 0.6, ease: "back.out(1.5)", stagger: 0.13 }, 0.2);`
        : `tl.from(".portrait", { autoAlpha: 0, x: -60, scale: 0.97, filter: "blur(14px)", duration: 0.9, ease: "power3.out", transformOrigin: "50% 100%" }, 0.2);`}
      tl.from(".ses-title", { clipPath: "inset(-0.16em 100% -0.30em -0.08em)", duration: 0.66, ease: "power3.out" }, 0.6);
      tl.from(".divider", { scaleX: 0, duration: 0.5, ease: "power3.inOut" }, 0.98);
      tl.from(".sp", { autoAlpha: 0, y: 18, duration: 0.5, ease: "power2.out", stagger: 0.12 }, 1.08);
      tl.from(".ses-meta", { autoAlpha: 0, y: 10, duration: 0.45, ease: "power2.out" }, 1.5);

      /* confetti pop -> fall + fade (deterministic, baked positions) */
      const CF = ${confetti.cf};
      if (CF) {
        tl.set(".cf", { x: 0, y: 0, scale: 0, autoAlpha: 0 }, 0);
        tl.to(".cf", { x: (i) => CF[i].tx, y: (i) => CF[i].ty, rotation: (i) => CF[i].rot, scale: 1, autoAlpha: 1,
          duration: 0.72, ease: "back.out(1.7)", stagger: (i) => CF[i].d }, 1.7);
        tl.to(".cf", { y: (i) => CF[i].ty + CF[i].fall, rotation: (i) => CF[i].rot + 220, autoAlpha: 0,
          duration: 2.1, ease: "power1.in", stagger: (i) => CF[i].d }, 2.55);
      }

      tl.set({}, {}, D);
      window.__timelines["cmp-${sess.id}"] = tl;
    <\/script>
  </body>
</html>
`;
}

const only = process.argv[2];
for (const sess of SESSIONS) {
  writeFileSync(join(CARDS, `${sess.id}.html`), cardHTML(sess));
}
console.log(`wrote ${SESSIONS.length} session cards to cards/`);
if (only) {
  const match = SESSIONS.find((s) => s.id === only);
  if (!match) { console.error(`no session id "${only}"`); process.exit(1); }
  copyFileSync(join(CARDS, `${only}.html`), join(DIR, "index.html"));
  console.log(`index.html <- cards/${only}.html`);
}

// export the people map for the filename generator
export { PEOPLE };
