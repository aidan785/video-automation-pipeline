// AIS LIVE — transition / break sting generator
// Emits one standalone HyperFrames composition per sting (sting_<slug>.html).
//   node _stings.mjs            -> writes all 10 sting_*.html
//   node _stings.mjs <slug>     -> writes all 10, then copies that slug to index.html (for render)
//
// Brand source of truth: AIS-LIVE-BRAND.md (§3.2 mark, §4 pulse, §10 motion, §12 checklist).
// SOLID mark colors per §3.2 (#fff AIS / #37bdf8 LIVE) — NOT a gradient (§3.5 forbids it).
// Mark is live HTML text (not the PNG) so the red live-dot can pulse — the brand's #1 motion rule.
// Determinism: no Math.random/Date.now; every timeline ends with tl.set({},{},D) (Law #11).

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
// Sting sources live in stings/ so the project root keeps exactly ONE composition
// (index.html). HyperFrames treats every root-level html with data-composition-id as a
// separate entry point, so multiple root compositions trip the linter + dup audio.
const SRC = join(DIR, "stings");
mkdirSync(SRC, { recursive: true });

const ACCENT = {
  blue: { hex: "#37bdf8", glow: "rgba(55,189,248,0.55)" },
  coral: { hex: "#ff8a5c", glow: "rgba(255,138,92,0.55)" },
};

// Durations are 1.6s multiples so loops stay in phase with the live-dot.
const STINGS = [
  { slug: "be-right-back", variant: "message", eyebrow: "INTERMISSION", pre: "We'll be right ", accent: "back.", accentColor: "blue", glow: "blue", dur: 8.0 },
  { slug: "back-in-5", variant: "countdown", eyebrow: "BREAK", kicker: "BACK IN", num: "5", unit: "MINUTES", accentColor: "blue", glow: "blue", dur: 8.0 },
  { slug: "back-in-10", variant: "countdown", eyebrow: "BREAK", kicker: "BACK IN", num: "10", unit: "MINUTES", accentColor: "blue", glow: "blue", dur: 8.0 },
  { slug: "up-next", variant: "message", eyebrow: "TRACK 02", pre: "Up ", accent: "next.", accentColor: "blue", glow: "blue", dur: 8.0 },
  { slug: "grab-a-coffee", variant: "message", eyebrow: "BREAK", pre: "Grab a ", accent: "coffee.", accentColor: "coral", glow: "coral", dur: 8.0 },
  { slug: "starting-soon", variant: "message", eyebrow: "STANDBY", pre: "Session starting ", accent: "soon.", accentColor: "blue", glow: "blue", dur: 8.0 },
  { slug: "lunch-break", variant: "message", eyebrow: "BREAK", pre: "Lunch ", accent: "break.", accentColor: "coral", glow: "coral", dur: 8.0 },
  { slug: "welcome-back", variant: "message", eyebrow: "WELCOME BACK", pre: "Let's ", accent: "go.", accentColor: "blue", glow: "blue", dur: 8.0 },
  { slug: "brand-loop-a", variant: "brand", sub: "a", accentColor: "blue", glow: "blue", dur: 6.4 },
  { slug: "brand-loop-b", variant: "brand", sub: "b", accentColor: "blue", glow: "blue", dur: 9.6 },
];

const MARK = `<span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span>`;

function sceneInner(s) {
  if (s.variant === "message") {
    return `<div class="eyebrow">${s.eyebrow}</div>
        <div class="line">${s.pre}<span class="accent">${s.accent}</span></div>
        <div class="markwrap">${MARK}</div>`;
  }
  if (s.variant === "countdown") {
    return `<div class="eyebrow">${s.eyebrow}</div>
        <div class="count">
          <div class="kicker">${s.kicker}</div>
          <div class="num">${s.num}</div>
          <div class="unit">${s.unit}</div>
        </div>
        <div class="markwrap">${MARK}</div>`;
  }
  // brand
  return `<div class="markwrap">${MARK}</div>`;
}

function timelineJS(s) {
  const D = s.dur;
  const hasGrid = s.variant !== "brand" || s.sub === "b";
  const dotRepeat = Math.round(D / 0.8) - 1; // even play-count -> ends at rest scale 1
  const ringRepeat = Math.round(D / 1.6) - 1; // 1.6s period: born small/bright, expand+fade, rest invisible
  const glowDur = D / 2; // yoyo x1 -> returns to origin (and zero velocity) at D

  const lines = [];
  lines.push(`      window.__timelines = window.__timelines || {};`);
  lines.push(`      const D = ${D};`);
  lines.push(`      const tl = gsap.timeline({ paused: true });`);
  lines.push(``);
  lines.push(`      /* AMBIENT — phase-locked to 1.6s, seamless at the loop point */`);
  lines.push(`      // live-dot pulse — scale 1 -> 1.1 -> 1, the only ambient motion the brand allows`);
  lines.push(`      tl.to(".mark .dot", { scale: 1.1, duration: 0.8, yoyo: true, repeat: ${dotRepeat}, ease: "sine.inOut", transformOrigin: "50% 50%" }, 0);`);
  lines.push(`      // outward ring — appears small+bright, expands and fades, invisible at every cycle edge`);
  lines.push(`      tl.fromTo(".mark .ring", { scale: 1, autoAlpha: 0 }, { keyframes: [`);
  lines.push(`        { autoAlpha: 0.5, scale: 1, duration: 0.001 },`);
  lines.push(`        { autoAlpha: 0, scale: 2.6, duration: 0.999, ease: "power2.out" },`);
  lines.push(`        { autoAlpha: 0, scale: 1, duration: 0.6 }`);
  lines.push(`      ], repeat: ${ringRepeat}, ease: "none" }, 0);`);
  lines.push(`      // glow blob drift — sine.inOut yoyo returns to origin with zero velocity (seamless)`);
  lines.push(`      tl.to(".glow", { x: 40, y: -22, duration: ${glowDur}, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);`);
  if (hasGrid) {
    lines.push(`      // command-deck grid scan — one 24px tile over the full duration (tiles seamlessly)`);
    lines.push(`      tl.to(".grid", { backgroundPosition: "24px 24px", duration: D, ease: "none" }, 0);`);
  }

  if (s.variant === "message") {
    lines.push(``);
    lines.push(`      /* ENTRANCE — settles to the rest pose, then holds */`);
    lines.push(`      tl.from(".eyebrow", { autoAlpha: 0, y: -12, duration: 0.5, ease: "power2.out" }, 0.15);`);
    lines.push(`      tl.from(".line", { clipPath: "inset(0 100% 0 0)", duration: 0.6, ease: "power3.out" }, 0.32);`);
    lines.push(`      tl.from(".markwrap", { autoAlpha: 0, scale: 0.92, y: 8, duration: 0.5, ease: "back.out(1.4)", transformOrigin: "50% 50%" }, 0.72);`);
  } else if (s.variant === "countdown") {
    lines.push(``);
    lines.push(`      /* ENTRANCE — number pops, then holds */`);
    lines.push(`      tl.from(".eyebrow", { autoAlpha: 0, y: -12, duration: 0.5, ease: "power2.out" }, 0.15);`);
    lines.push(`      tl.from(".kicker", { autoAlpha: 0, y: 14, duration: 0.45, ease: "power2.out" }, 0.3);`);
    lines.push(`      tl.from(".num", { autoAlpha: 0, scale: 0.6, duration: 0.6, ease: "back.out(1.5)", transformOrigin: "50% 60%" }, 0.45);`);
    lines.push(`      tl.from(".unit", { autoAlpha: 0, y: 10, duration: 0.4, ease: "power2.out" }, 0.85);`);
    lines.push(`      tl.from(".markwrap", { autoAlpha: 0, scale: 0.92, y: 8, duration: 0.5, ease: "back.out(1.4)", transformOrigin: "50% 50%" }, 0.95);`);
  } else if (s.variant === "brand" && s.sub === "b") {
    lines.push(``);
    lines.push(`      /* MARK GLOW SWELL — text-shadow 30 -> 80px, 2.4s, ends at rest (seamless) */`);
    lines.push(`      tl.fromTo(".mark .live", { textShadow: "0 0 30px rgba(55,189,248,0.40)" }, { textShadow: "0 0 80px rgba(55,189,248,0.75)", duration: 2.4, yoyo: true, repeat: ${Math.round(D / 2.4) - 1}, ease: "sine.inOut" }, 0);`);
  }
  // brand-a: ambient only, no entrance -> perfectly seamless loop

  lines.push(``);
  lines.push(`      tl.set({}, {}, D); // Law #11 — fill the slot`);
  lines.push(`      window.__timelines["sting-${s.slug}"] = tl;`);
  return lines.join("\n");
}

function buildHTML(s) {
  const D = s.dur;
  const a = ACCENT[s.accentColor];
  const hasGrid = s.variant !== "brand" || s.sub === "b";
  const markSize = s.variant === "brand" ? "240px" : "92px";
  const lineSize = "112px";

  const bgLayers = [
    hasGrid ? `<div class="grid"></div>` : "",
    `<div class="glow ${s.glow}"></div>`,
    `<div class="vignette"></div>`,
  ].filter(Boolean).join("\n        ");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — sting: ${s.slug}</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root {
        --onyx: #07121c;
        --charcoal: #0a0e14;
        --blue: #37bdf8;
        --coral: #ff8a5c;
        --red-live: #ff3b30;
        --font-display: "Montserrat", sans-serif;
        --font-body: "Inter", sans-serif;
        --font-mono: "JetBrains Mono", monospace;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: 1920px; height: 1080px; overflow: hidden;
        background: #000; color: #fff; font-family: var(--font-body);
      }
      #root {
        position: relative; width: 1920px; height: 1080px;
        overflow: hidden; background: var(--onyx); isolation: isolate;
      }
      /* clip layers fill the frame so the mark glow / italic overhang / live-dot are never chopped */
      #root .clip { position: absolute; inset: 0; width: 1920px; height: 1080px; pointer-events: none; }

      /* ---------- background ---------- */
      .grid {
        position: absolute; inset: -48px;
        background-image:
          linear-gradient(rgba(55, 189, 248, 0.065) 1px, transparent 1px),
          linear-gradient(90deg, rgba(55, 189, 248, 0.065) 1px, transparent 1px);
        background-size: 24px 24px;
      }
      .glow { position: absolute; top: -160px; left: 50%; border-radius: 50%; }
      .glow.blue { width: 760px; height: 760px; margin-left: -380px; background: var(--blue); filter: blur(150px); opacity: 0.20; }
      .glow.coral { width: 680px; height: 680px; margin-left: -340px; background: var(--coral); filter: blur(140px); opacity: 0.20; }
      .vignette {
        position: absolute; inset: 0; pointer-events: none;
        background: radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.55) 95%);
      }

      /* ---------- scene ---------- */
      .wrap {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 44px; padding: 120px; text-align: center;
      }

      /* eyebrow — JetBrains Mono, UPPER +0.32em, accent color */
      .eyebrow {
        font-family: var(--font-mono); font-weight: 700; font-size: 24px;
        letter-spacing: 0.32em; text-transform: uppercase; color: ${a.hex};
        display: inline-flex; align-items: center; gap: 12px;
      }
      .eyebrow::before {
        content: ""; width: 9px; height: 9px; border-radius: 2px;
        background: currentColor; box-shadow: 0 0 10px currentColor;
      }

      /* message line — Montserrat 900 italic, one colored accent word */
      .line {
        font-family: var(--font-display); font-style: italic; font-weight: 900;
        font-size: ${lineSize}; line-height: 0.95; letter-spacing: -0.035em;
        color: #fff; max-width: 1520px; clip-path: inset(0 0 0 0);
      }
      .line .accent { color: ${a.hex}; font-style: italic; }

      /* countdown */
      .count { display: flex; flex-direction: column; align-items: center; gap: 6px; }
      .kicker {
        font-family: var(--font-display); font-style: italic; font-weight: 900;
        font-size: 64px; line-height: 0.95; letter-spacing: -0.03em; color: #fff;
      }
      .num {
        font-family: var(--font-display); font-style: italic; font-weight: 900;
        font-size: 300px; line-height: 0.86; letter-spacing: -0.05em; color: ${a.hex};
        text-shadow: 0 0 80px ${a.glow};
      }
      .unit {
        font-family: var(--font-mono); font-weight: 700; font-size: 26px;
        letter-spacing: 0.32em; text-transform: uppercase; color: ${a.hex};
      }

      /* ---------- AIS LIVE mark (solid, brand §3.2) ---------- */
      .markwrap { display: inline-flex; }
      .mark {
        font-family: var(--font-display); font-style: italic; font-weight: 900;
        letter-spacing: -0.03em; line-height: 0.9; font-size: ${markSize};
        display: inline-flex; align-items: baseline; position: relative;
      }
      .mark .ais { color: #fff; }
      .mark .gap { display: inline-block; width: 0.08em; }
      .mark .live {
        position: relative; color: var(--blue);
        text-shadow: 0 0 60px rgba(55, 189, 248, 0.55);
        padding-right: 0.28em;
      }
      .mark .dot {
        position: absolute; top: 0.08em; left: 100%; margin-left: 0.06em;
        width: 0.16em; height: 0.16em; border-radius: 50%;
        background: var(--red-live);
        box-shadow: 0 0 0.7em #ff3b30, 0 0 0.25em #ff3b30;
      }
      .mark .ring {
        position: absolute; top: 0.08em; left: 100%; margin-left: 0.06em;
        width: 0.16em; height: 0.16em; border-radius: 50%;
        background: rgba(255, 59, 48, 0.55); opacity: 0;
        transform-origin: 50% 50%; pointer-events: none;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="sting-${s.slug}" data-start="0" data-duration="${D}" data-width="1920" data-height="1080" style="--mark-size: ${markSize}">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        ${bgLayers}
      </div>
      <div id="scene" class="clip" data-start="0" data-duration="${D}" data-track-index="1">
        <div class="wrap">
        ${sceneInner(s)}
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
for (const s of STINGS) {
  writeFileSync(join(SRC, `${s.slug}.html`), buildHTML(s));
  wrote++;
}

const arg = process.argv[2];
if (arg) {
  copyFileSync(join(SRC, `${arg}.html`), join(DIR, "index.html"));
  console.log(`wrote ${wrote} stings/*.html; index.html <- stings/${arg}.html`);
} else {
  console.log(`wrote ${wrote} stings/*.html`);
}
