// AIS LIVE — Speaker Quote Cards (#25). 16:9 motion pull-quote cards, one per speaker.
//   Typographic: big italic pull-quote + attribution (name · role), on the locked AIS LIVE brand
//   (onyx command-deck, grid, blue glow, vignette, official logo + pulsing live-dot ring).
//   QUOTES ARE REAL — mined verbatim from the AIS LIVE session transcripts (post-event pass, 7/14).
//   Aidan-approved picks. 13 cards: 8 roster speakers + 5 drip extras (Pat/Wyatt/Glenn/Sabrina/Ednan).
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

// REAL QUOTES — mined verbatim from the AIS LIVE session transcripts (2026-07-14 post-event pass).
// All-blue accents per the standing styling directives (no coral/yellow text).
const SPEAKERS = [
  { slug: "nate-herk", name: "Nate Herk", role: "Founder · Uppit AI & AIS", accentColor: "blue",
    quote: "AI native isn't what you know. It's what your hand reaches for." },
  { slug: "jon-morrow", name: "Jon Morrow", role: "President & COO · Uppit AI", accentColor: "blue",
    quote: "Everyone that makes money is making money on the retainers, not the first project." },
  { slug: "devin-kearns", name: "Devin Kearns", role: "Founder · Custom AI Studio", accentColor: "blue",
    quote: "91% of pilot projects fail. You don't want to be part of the 91%." },
  { slug: "kacper-rutkiewicz", name: "Kacper Rutkiewicz", role: "Founder · DeepRooted", accentColor: "blue",
    quote: "The stack you run is ultimately the stack you sell." },
  { slug: "aidan-finnegan", name: "Aidan Finnegan", role: "Founder · Opulence AI", accentColor: "blue",
    quote: "Make their employees love you and make their job easier, and you will become indispensable." },
  { slug: "dave-ebbelaar", name: "Dave Ebbelaar", role: "Founder · Datalumina", accentColor: "blue",
    quote: "I haven't written a single line of code in over six months. I still check every line. But I don't write it anymore." },
  { slug: "liberty-white", name: "Liberty White", role: "Founder · She Learns AI", accentColor: "blue",
    quote: "Don't worry about the sexy things that make you think you have a business. A business is your ability to make money." },
  { slug: "tangy-frederick", name: "Tangy Frederick", role: "President · Regal Unicorn", accentColor: "blue",
    quote: "Yes, it's good to find out who the people are. Yes, it's good to build something. But you want to sell a solution." },
  { slug: "pat-blakely", name: "Pat Blakely", role: "Writer & Product Manager", accentColor: "blue",
    quote: "If you wanna pay for commodity pricing, you're gonna get commodity attention, which is none." },
  { slug: "wyatt-lyonsmith", name: "Wyatt Lyonsmith", role: "Owner · GrowMoto", accentColor: "blue",
    quote: "Anybody can work all day, but are you brave enough to take the chance on something you really want to do?" },
  { slug: "glenn-marcus", name: "Glenn Marcus", role: "Founder · Cliq Consulting", accentColor: "blue",
    quote: "I wouldn't say SaaS is dead, but I certainly think front end is dead." },
  { slug: "sabrina-ramonov", name: "Sabrina Ramonov", role: "Founder & CEO · Blotato", accentColor: "blue",
    quote: "This set of skills is better than 99% of people who start making content." },
  { slug: "ednan-abdullayev", name: "Ednan Abdullayev", role: "Tech Lead · AIS", accentColor: "blue",
    quote: "In simple terms, evals are your proof." },
];

const ACCENT = {
  blue:   { hex: "#37bdf8", glow: "rgba(55,189,248,0.55)", blob: "rgba(55,189,248,0.20)" },
  coral:  { hex: "#ff8a5c", glow: "rgba(255,138,92,0.55)", blob: "rgba(255,138,92,0.20)" },
  yellow: { hex: "#f5d82a", glow: "rgba(245,216,42,0.50)", blob: "rgba(245,216,42,0.16)" },
};

// quote scales down as it gets longer so it always fits the safe area without a manual <br>.
function quoteSize(str) {
  const n = str.length;
  return n <= 70 ? 78 : n <= 100 ? 68 : n <= 130 ? 58 : 50;
}

function cardHTML(s) {
  const D = DUR;
  const a = ACCENT[s.accentColor] || ACCENT.blue;
  const qfs = quoteSize(s.quote);
  const dotRepeat = Math.round(D / 0.8) - 1;
  const ringRepeat = Math.round(D / 1.6) - 1;
  const glowDur = D / 2;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — Quote · ${s.slug}</title>
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
        align-items: center; justify-content: center; gap: 0; padding: 150px 220px 130px; text-align: center; }
      .eyebrow { font-family: var(--font-mono); font-weight: 700; font-size: 24px; letter-spacing: 0.36em;
        text-transform: uppercase; color: var(--accent); display: inline-flex; align-items: center; gap: 13px; margin-bottom: 36px; }

      .qmark { font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: 200px;
        line-height: 0.5; color: var(--accent); opacity: 0.30; height: 96px; margin-bottom: 8px; }
      .quote { font-family: var(--font-display); font-style: italic; font-weight: 900; letter-spacing: -0.025em;
        line-height: 1.08; font-size: ${qfs}px; color: #fff; max-width: 1480px; text-shadow: 0 0 60px rgba(55,189,248,0.18); margin-bottom: 50px; }

      .attr { display: inline-flex; flex-direction: column; align-items: center; gap: 8px; }
      .name { font-family: var(--font-display); font-style: italic; font-weight: 900; letter-spacing: -0.03em;
        font-size: 46px; color: #fff; }
      .role { font-family: var(--font-mono); font-weight: 600; font-size: 21px; letter-spacing: 0.22em;
        text-transform: uppercase; color: var(--paper-mute); }

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
          <div class="eyebrow">FROM THE STAGE</div>
          <div class="qmark">&ldquo;</div>
          <div class="quote">${s.quote}</div>
          <div class="attr">
            <div class="name">${s.name}</div>
            <div class="role">${s.role}</div>
          </div>
        </div>
        <div class="chrome">
          <span class="logo"><img src="assets/logos/AIS-LIVE-with-dot.png" crossorigin="anonymous" alt="AIS LIVE" /><span class="ring"></span></span>
          <span class="tag">REAL PROJECTS · <b>REAL REVENUE</b></span>
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
      tl.to(".glow", { y: -24, duration: ${glowDur}, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      tl.to(".grid", { backgroundPosition: "24px 24px", duration: D, ease: "none" }, 0);

      /* ENTRANCE — settle to the rest pose, then hold */
      tl.from(".logo", { autoAlpha: 0, y: -14, duration: 0.5, ease: "power2.out" }, 0.15);
      tl.from(".tag", { autoAlpha: 0, x: 14, duration: 0.5, ease: "power2.out" }, 0.3);
      tl.from(".eyebrow", { autoAlpha: 0, y: -12, duration: 0.5, ease: "power2.out" }, 0.5);
      tl.from(".qmark", { autoAlpha: 0, scale: 0.7, duration: 0.5, ease: "back.out(1.6)", transformOrigin: "50% 100%" }, 0.66);
      tl.from(".quote", { clipPath: "inset(0 100% 0 0)", duration: 0.8, ease: "power3.out" }, 0.8);
      tl.from(".name", { autoAlpha: 0, y: 14, duration: 0.5, ease: "back.out(1.3)" }, 1.55);
      tl.from(".role", { autoAlpha: 0, y: 10, duration: 0.45, ease: "power2.out" }, 1.72);

      tl.set({}, {}, D); // Law #11 — fill the slot
      window.__timelines["cmp-${s.slug}"] = tl;
    <\/script>
  </body>
</html>
`;
}

const only = process.argv[2];
for (const s of SPEAKERS) {
  writeFileSync(join(CARDS, `${s.slug}.html`), cardHTML(s));
  console.log("card ->", `cards/${s.slug}.html`);
}
if (only) {
  const m = SPEAKERS.find((s) => s.slug === only);
  if (!m) { console.error(`no speaker matching "${only}"`); process.exit(1); }
  copyFileSync(join(CARDS, `${only}.html`), join(DIR, "index.html"));
  console.log(`\nindex.html <- cards/${only}.html`);
}
console.log(`\ndone — ${SPEAKERS.length} card(s)`);
