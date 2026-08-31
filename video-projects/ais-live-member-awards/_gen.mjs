// AIS LIVE — Member Awards Recognition Cards (#8). 16:9 motion award cards, one per honoree.
//   Award-category eyebrow + emblem + member name + recognition blurb, on the locked AIS LIVE brand
//   (onyx command-deck, grid, glow, vignette, official logo + pulsing live-dot ring).
//   NAMES + CATEGORIES + BLURBS ARE PLACEHOLDERS — drop the real award list into AWARDS and re-render.
//   Designed to play back-to-back as a recognition sequence (the plan's 2-3 min reel).
//
//   node _gen.mjs            -> write all cards to cards/<slug>.html
//   node _gen.mjs <slug>     -> write all cards AND copy <slug> to index.html (preview/render)

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const CARDS = join(DIR, "cards");
mkdirSync(CARDS, { recursive: true });

const DUR = 6.4; // 4 × 1.6s brand beat

const ACCENT = {
  blue:   { hex: "#37bdf8", glow: "rgba(55,189,248,0.55)", blob: "rgba(55,189,248,0.20)" },
  coral:  { hex: "#ff8a5c", glow: "rgba(255,138,92,0.55)", blob: "rgba(255,138,92,0.20)" },
  yellow: { hex: "#f5d82a", glow: "rgba(245,216,42,0.50)", blob: "rgba(245,216,42,0.16)" },
};

// PLACEHOLDER honorees — swap name/blurb for the real recognition list. emblem is a unicode glyph.
const AWARDS = [
  { slug: "member-of-the-year", category: "MEMBER OF THE YEAR", accentColor: "yellow", emblem: "★",
    name: "Placeholder Name", blurb: "For outstanding contribution to the AIS community this year." },
  { slug: "fastest-first-deal", category: "FASTEST FIRST DEAL", accentColor: "blue", emblem: "⚡",
    name: "Placeholder Name", blurb: "Closed their first paid AI project faster than anyone in the cohort." },
  { slug: "biggest-comeback", category: "BIGGEST COMEBACK", accentColor: "coral", emblem: "▲",
    name: "Placeholder Name", blurb: "Turned an early setback into a six-figure book of business." },
  { slug: "community-mvp", category: "COMMUNITY MVP", accentColor: "blue", emblem: "◆",
    name: "Placeholder Name", blurb: "Showed up for everyone else, every single day." },
  { slug: "builder-of-the-year", category: "BUILDER OF THE YEAR", accentColor: "yellow", emblem: "⬢",
    name: "Placeholder Name", blurb: "Shipped the most ambitious agent build of the year." },
  { slug: "rookie-of-the-year", category: "ROOKIE OF THE YEAR", accentColor: "coral", emblem: "✦",
    name: "Placeholder Name", blurb: "Joined this year and already runs like a veteran." },
];

function nameSize(str) {
  const n = str.length;
  return n <= 14 ? 120 : n <= 20 ? 104 : n <= 26 ? 88 : 74;
}

function cardHTML(s) {
  const D = DUR;
  const a = ACCENT[s.accentColor] || ACCENT.blue;
  const nfs = nameSize(s.name);
  const ringRepeat = Math.round(D / 1.6) - 1;
  const glowDur = D / 2;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — Award · ${s.slug}</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root {
        --onyx: #07121c; --blue: #37bdf8; --red-live: #ff3b30; --accent: ${a.hex};
        --paper-soft: rgba(209,220,232,0.82); --paper-mute: rgba(209,220,232,0.52);
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
      .glow { position: absolute; top: -200px; left: 50%; width: 900px; height: 900px; margin-left: -450px;
        border-radius: 50%; background: ${a.blob}; filter: blur(160px); }
      .vignette { position: absolute; inset: 0; pointer-events: none;
        background: radial-gradient(ellipse at center, transparent 44%, rgba(0,0,0,0.60) 95%); }

      /* ---------- centered stack ---------- */
      .wrap { position: absolute; inset: 0; display: flex; flex-direction: column;
        align-items: center; justify-content: center; gap: 0; padding: 140px 180px 120px; text-align: center; }

      .emblem { position: relative; width: 132px; height: 132px; display: inline-flex; align-items: center; justify-content: center;
        border: 2px solid var(--accent); border-radius: 50%; margin-bottom: 32px;
        box-shadow: 0 0 50px ${a.blob}, inset 0 0 30px ${a.blob}; }
      .emblem span { font-size: 60px; line-height: 1; color: var(--accent); text-shadow: 0 0 24px ${a.glow}; }
      .emblem .halo { position: absolute; inset: -2px; border-radius: 50%; border: 2px solid var(--accent); opacity: 0; transform-origin: 50% 50%; }

      .category { font-family: var(--font-mono); font-weight: 700; font-size: 26px; letter-spacing: 0.38em;
        text-transform: uppercase; color: var(--accent); margin-bottom: 26px; }
      .name { font-family: var(--font-display); font-style: italic; font-weight: 900; letter-spacing: -0.03em;
        line-height: 0.95; font-size: ${nfs}px; color: #fff; text-shadow: 0 0 70px rgba(55,189,248,0.18); margin-bottom: 30px; }
      .blurb { font-family: var(--font-body); font-weight: 300; font-style: italic; font-size: 38px;
        line-height: 1.25; letter-spacing: -0.01em; color: var(--paper-soft); max-width: 1240px; }

      /* ---------- chrome ---------- */
      .chrome { position: absolute; top: 60px; left: 90px; right: 120px; display: flex; align-items: center; justify-content: space-between; }
      .logo { position: relative; display: inline-flex; }
      .logo img { height: 52px; display: block; filter: drop-shadow(0 0 40px rgba(55,189,248,0.45)); }
      .logo .ring { position: absolute; top: 12px; right: 13px; width: 7px; height: 7px;
        border-radius: 50%; background: rgba(255,59,48,0.6); opacity: 0; transform-origin: 50% 50%; }
      .tag { font-family: var(--font-mono); font-weight: 700; font-size: 18px; letter-spacing: 0.30em;
        text-transform: uppercase; color: var(--paper-mute); }
      .tag b { color: var(--accent); }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="cmp-${s.slug}" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        <div class="grid"></div>
        <div class="glow"></div>
        <div class="vignette"></div>
      </div>
      <div id="scene" class="clip" data-start="0" data-duration="${D}" data-track-index="1">
        <div class="wrap">
          <div class="emblem"><span>${s.emblem}</span><span class="halo"></span></div>
          <div class="category">${s.category}</div>
          <div class="name">${s.name}</div>
          <div class="blurb">${s.blurb}</div>
        </div>
        <div class="chrome">
          <span class="logo"><img src="assets/logos/AIS-LIVE-with-dot.png" crossorigin="anonymous" alt="AIS LIVE" /><span class="ring"></span></span>
          <span class="tag">MEMBER <b>RECOGNITION</b></span>
        </div>
      </div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const D = ${D};
      const tl = gsap.timeline({ paused: true });

      /* AMBIENT — phase-locked to the 1.6s brand beat */
      tl.fromTo(".ring", { scale: 1, autoAlpha: 0 }, { keyframes: [
        { autoAlpha: 0.5, scale: 1, duration: 0.001 },
        { autoAlpha: 0, scale: 2.6, duration: 0.999, ease: "power2.out" },
        { autoAlpha: 0, scale: 1, duration: 0.6 }
      ], repeat: ${ringRepeat}, ease: "none" }, 0);
      tl.fromTo(".emblem .halo", { scale: 1, autoAlpha: 0 }, { keyframes: [
        { autoAlpha: 0.6, scale: 1, duration: 0.001 },
        { autoAlpha: 0, scale: 1.7, duration: 1.199, ease: "power2.out" },
        { autoAlpha: 0, scale: 1, duration: 0.4 }
      ], repeat: ${ringRepeat}, ease: "none" }, 0);
      tl.to(".glow", { y: -24, duration: ${glowDur}, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      tl.to(".grid", { backgroundPosition: "24px 24px", duration: D, ease: "none" }, 0);

      /* ENTRANCE — settle to the rest pose, then hold */
      tl.from(".logo", { autoAlpha: 0, y: -14, duration: 0.5, ease: "power2.out" }, 0.15);
      tl.from(".tag", { autoAlpha: 0, x: 14, duration: 0.5, ease: "power2.out" }, 0.3);
      tl.from(".emblem", { autoAlpha: 0, scale: 0.6, duration: 0.6, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.5);
      tl.from(".category", { autoAlpha: 0, y: 12, duration: 0.45, ease: "power2.out" }, 0.9);
      tl.from(".name", { autoAlpha: 0, scale: 0.92, y: 12, duration: 0.6, ease: "back.out(1.3)", transformOrigin: "50% 50%" }, 1.05);
      tl.from(".blurb", { autoAlpha: 0, y: 14, duration: 0.5, ease: "power2.out" }, 1.35);

      tl.set({}, {}, D); // Law #11 — fill the slot
      window.__timelines["cmp-${s.slug}"] = tl;
    <\/script>
  </body>
</html>
`;
}

const only = process.argv[2];
for (const s of AWARDS) {
  writeFileSync(join(CARDS, `${s.slug}.html`), cardHTML(s));
  console.log("card ->", `cards/${s.slug}.html`);
}
if (only) {
  const m = AWARDS.find((s) => s.slug === only);
  if (!m) { console.error(`no award matching "${only}"`); process.exit(1); }
  copyFileSync(join(CARDS, `${only}.html`), join(DIR, "index.html"));
  console.log(`\nindex.html <- cards/${only}.html`);
}
console.log(`\ndone — ${AWARDS.length} card(s)`);
