// AIS LIVE — Sponsor Sting Cards (#10). Short animated "brought to you by" announcer
// cards, one per sponsor, played before each sponsor session. Sponsor LOGO is a
// PLACEHOLDER plate (reserved zone + wordmark stand-in) until real logo files land —
// drop the logo art into the .plate and remove the .wordmark / placeholder chip.
// Presenting sponsor per Event Schedule v6.1 = HyperAgent (NOT Airtable). Self-contained
// HyperFrames VIDEO. Brand source: AIS-LIVE-BRAND.md.
//
//   node _gen.mjs <hyperagent|glaido|hostinger>  -> writes cards/*.html + copies <slug> to index.html
//   node _gen.mjs                                  -> writes all cards/*.html

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const D = 4.8; // 3 beats — matches the ~5s spec while staying on the 1.6s brand beat

const ACCENT = {
  blue:   "#37bdf8",
  coral:  "#ff8a5c",
  yellow: "#f5d82a",
};

// Real logos dropped in 2026-06-30 (Hostinger removed — no longer a sponsor).
// logo = transparent PNG in assets/logos/; logoH = render height in px (wordmark vs icon differ).
const SPONSORS = [
  { slug: "hyperagent", name: "HyperAgent", role: "Presenting Sponsor", accent: "blue",  logo: "sponsor-hyperagent.png", logoH: 132, tagline: "A Fleet of Always-On Agents" },
  { slug: "glaido",     name: "Glaido",     role: "Sponsor",            accent: "coral", logo: "sponsor-glaido.png",     wordmark: "Glaido", iconH: 150, wmSize: 120, gap: 38, tagline: "Sponsored Session · Day 1" },
];

const MARK = `<span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span>`;

function timelineJS(s) {
  const dotRepeat = Math.round(D / 0.8) - 1;
  const ringRepeat = Math.round(D / 1.6) - 1;
  const glowDur = +(D / 2).toFixed(2);
  return `      window.__timelines = window.__timelines || {};
      const D = ${D};
      const tl = gsap.timeline({ paused: true });

      /* AMBIENT — phase-locked to the 1.6s brand beat */
      tl.to(".dot", { scale: 1.1, duration: 0.8, yoyo: true, repeat: ${dotRepeat}, ease: "sine.inOut", transformOrigin: "50% 50%" }, 0);
      tl.fromTo(".ring", { scale: 1, autoAlpha: 0 }, { keyframes: [
        { autoAlpha: 0.5, scale: 1, duration: 0.001 },
        { autoAlpha: 0, scale: 2.6, duration: 0.999, ease: "power2.out" },
        { autoAlpha: 0, scale: 1, duration: 0.6 }
      ], repeat: ${ringRepeat}, ease: "none" }, 0);
      tl.to(".glow", { x: 36, y: -20, duration: ${glowDur}, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      tl.to(".grid", { backgroundPosition: "24px 24px", duration: D, ease: "none" }, 0);

      /* ENTRANCE — quick, energetic, settles and holds */
      tl.from(".hostbug", { autoAlpha: 0, y: -12, duration: 0.45, ease: "power2.out" }, 0.1);
      tl.from(".eyebrow", { autoAlpha: 0, y: -12, duration: 0.45, ease: "power2.out" }, 0.28);
      tl.set(".plate", { autoAlpha: 0, scale: 0.9 }, 0);
      tl.to (".plate", { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" }, 0.45);
      tl.set(".logo-content", { clipPath: "inset(0 100% 0 0)" }, 0);
      tl.to (".logo-content", { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power3.out" }, 0.72);
      tl.from(".role", { autoAlpha: 0, y: 14, duration: 0.45, ease: "power2.out" }, 1.05);
      tl.from(".tagline", { autoAlpha: 0, y: 10, duration: 0.4, ease: "power2.out" }, 1.2);

      tl.set({}, {}, D); // Law #11 — fill the slot
      window.__timelines["cmp-spon-${s.slug}"] = tl;`;
}

function buildSting(s) {
  const a = ACCENT[s.accent];
  const eyebrow = s.role === "Presenting Sponsor" ? "Presented By" : "Brought To You By";
  // logo lockup: icon + recreated wordmark when `wordmark` set (icon-only sponsors), else the logo image alone
  const logoMarkup = s.wordmark
    ? `<span class="lockup"><img class="logo-ico" src="assets/logos/${s.logo}" crossorigin="anonymous" alt="${s.name}" /><span class="logo-wm">${s.wordmark}</span></span>`
    : `<img class="logo-img" src="assets/logos/${s.logo}" crossorigin="anonymous" alt="${s.name}" />`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — sponsor sting — ${s.slug}</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root { --onyx:#07121c; --blue:#37bdf8; --red-live:#ff3b30; --a:${a};
        --font-display:"Montserrat",sans-serif; --font-body:"Inter",sans-serif; --font-mono:"JetBrains Mono",monospace; }
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { width:1920px; height:1080px; overflow:hidden; background:#000; color:#fff; font-family:var(--font-body); }
      #root { position:relative; width:1920px; height:1080px; overflow:hidden; background:var(--onyx); isolation:isolate; }
      #root .clip { position:absolute; inset:0; width:1920px; height:1080px; pointer-events:none; }
      .grid { position:absolute; inset:-48px;
        background-image:
          linear-gradient(rgba(55,189,248,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(55,189,248,0.06) 1px, transparent 1px);
        background-size:24px 24px; }
      .glow { position:absolute; top:-170px; left:50%; width:780px; height:780px; margin-left:-390px;
        border-radius:50%; background:var(--a); filter:blur(150px); opacity:0.17; }
      .vignette { position:absolute; inset:0; background:radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.56) 96%); }

      .wrap { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:40px; padding:140px; text-align:center; }
      .hostbug { display:inline-flex; }
      .eyebrow { font-family:var(--font-mono); font-weight:700; font-size:26px; letter-spacing:0.4em; text-transform:uppercase;
        color:rgba(209,220,232,0.66); }

      .plate { position:relative; min-width:820px; padding:80px 120px; border-radius:24px;
        background:linear-gradient(158deg, rgba(255,255,255,0.05), rgba(255,255,255,0.014));
        border:1px solid rgba(255,255,255,0.12);
        box-shadow:0 34px 90px rgba(0,0,0,0.5), 0 0 80px -16px var(--a);
        display:flex; align-items:center; justify-content:center; }
      .logo-content { display:inline-flex; align-items:center; justify-content:center; clip-path:inset(0 0% 0 0);
        filter:drop-shadow(0 0 50px rgba(255,255,255,0.12)); }
      .logo-img { display:block; height:${s.logoH || 132}px; width:auto; max-width:1100px; }
      .lockup { display:inline-flex; align-items:center; gap:${s.gap || 38}px; }
      .lockup .logo-ico { display:block; height:${s.iconH || 150}px; width:auto; }
      .lockup .logo-wm { font-family:var(--font-display); font-weight:800; font-size:${s.wmSize || 120}px;
        letter-spacing:-0.025em; line-height:1; color:#fff; }

      .role { display:inline-flex; align-items:center; gap:16px; font-family:var(--font-mono); font-weight:700; font-size:24px;
        letter-spacing:0.3em; text-transform:uppercase; color:var(--a); }
      .role::before, .role::after { content:""; width:34px; height:2px; background:var(--a); opacity:0.8; }
      .tagline { font-family:var(--font-body); font-weight:300; font-style:italic; font-size:34px; letter-spacing:-0.01em; color:rgba(209,220,232,0.8); }

      .mark { font-family:var(--font-display); font-style:italic; font-weight:900; letter-spacing:-0.03em; line-height:0.9;
        font-size:60px; display:inline-flex; align-items:baseline; position:relative; }
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
    <div id="root" data-composition-id="cmp-spon-${s.slug}" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        <div class="grid"></div>
        <div class="glow"></div>
        <div class="vignette"></div>
      </div>
      <div id="scene" class="clip" data-start="0" data-duration="${D}" data-track-index="1">
        <div class="wrap">
          <div class="hostbug">${MARK}</div>
          <div class="eyebrow">${eyebrow}</div>
          <div class="plate"><span class="logo-content">${logoMarkup}</span></div>
          <div class="role">${s.role}</div>
          <div class="tagline">${s.tagline}</div>
        </div>
      </div>
    </div>

    <script>
${timelineJS(s)}
    <\/script>
  </body>
</html>
`;
}

let wrote = 0;
for (const s of SPONSORS) { writeFileSync(join(SRC, `${s.slug}.html`), buildSting(s)); wrote++; }
const arg = process.argv[2];
if (arg) {
  copyFileSync(join(SRC, `${arg}.html`), join(DIR, "index.html"));
  console.log(`wrote ${wrote} cards/*.html; index.html <- cards/${arg}.html`);
} else {
  console.log(`wrote ${wrote} cards/*.html  (${SPONSORS.map(s => s.slug).join(", ")})`);
}
