// AIS LIVE — shared brand engine for HyperFrames marketing cards.
// One source of truth for the mark, the command-deck CSS, the ambient (live-dot)
// motion, and the entrance choreography. Each project's _gen.mjs imports buildCard()
// and feeds it a data table. Brand source of truth: AIS-LIVE-BRAND.md.
//
//   - SOLID mark colors per §3.2 (#fff AIS / #37bdf8 LIVE) — never a gradient (§3.5).
//   - Mark is live HTML text (not the PNG) so the red live-dot can pulse — §4, the #1 rule.
//   - Live-dot pulse is the ONLY ambient motion; everything else is on the 1.6s beat (§10).
//   - Determinism: no Math.random/Date.now; every timeline ends with tl.set({},{},D) (Law #11).
//
// Variants: "headline" | "countdown" | "loop" | "brand".

export const ACCENT = {
  blue: { hex: "#37bdf8", glow: "rgba(55,189,248,0.55)" },
  coral: { hex: "#ff8a5c", glow: "rgba(255,138,92,0.55)" },
  red: { hex: "#ff3b30", glow: "rgba(255,59,48,0.55)" },
};

const MARK = `<span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span>`;
const RINGDOT = `<span class="ring"></span><span class="dot"></span>`;

function sceneInner(c) {
  const eyebrow = c.eyebrow
    ? `<div class="eyebrow">${c.eyebrow}</div>`
    : "";
  const subline = c.subline ? `<div class="subline">${c.subline}</div>` : "";
  const mark = c.showMark === false ? "" : `<div class="markwrap">${MARK}</div>`;

  if (c.variant === "headline") {
    const accentCls = c.live ? "accent live" : "accent";
    const accentInner = c.live ? `${c.accent}${RINGDOT}` : c.accent;
    const heroCls = c.hero ? " hero" : "";
    return `${eyebrow}
        <div class="line${heroCls}">${c.pre || ""}<span class="${accentCls}">${accentInner}</span></div>
        ${subline}
        ${mark}`;
  }

  if (c.variant === "countdown") {
    return `${eyebrow}
        <div class="count">
          ${c.kicker ? `<div class="kicker">${c.kicker}</div>` : ""}
          <div class="num">${c.num}</div>
          <div class="unit">${c.unit}</div>
        </div>
        ${subline}
        ${mark}`;
  }

  if (c.variant === "loop") {
    const line = c.line
      ? `<div class="line">${c.linePre || ""}<span class="accent">${c.line}</span></div>`
      : "";
    return `${eyebrow}
        ${line}
        ${subline}
        ${mark}`;
  }

  // brand — mark only
  return mark;
}

function timelineJS(c) {
  const D = c.dur;
  const hasGrid = c.showGrid !== false;
  const dotRepeat = Math.round(D / 0.8) - 1; // even play-count -> ends at rest scale 1
  const ringRepeat = Math.round(D / 1.6) - 1; // 1.6s period, invisible at every cycle edge
  const glowDur = D / 2; // yoyo x1 -> returns to origin (zero velocity) at D

  const L = [];
  L.push(`      window.__timelines = window.__timelines || {};`);
  L.push(`      const D = ${D};`);
  L.push(`      const tl = gsap.timeline({ paused: true });`);
  L.push(``);
  L.push(`      /* AMBIENT — phase-locked to 1.6s, seamless at the loop point */`);
  L.push(`      // live-dot pulse — the only ambient motion the brand allows. Targets every .dot`);
  L.push(`      // (the mark's, and any headline live-dot) so they pulse together on the beat.`);
  L.push(`      tl.to(".dot", { scale: 1.1, duration: 0.8, yoyo: true, repeat: ${dotRepeat}, ease: "sine.inOut", transformOrigin: "50% 50%" }, 0);`);
  L.push(`      tl.fromTo(".ring", { scale: 1, autoAlpha: 0 }, { keyframes: [`);
  L.push(`        { autoAlpha: 0.5, scale: 1, duration: 0.001 },`);
  L.push(`        { autoAlpha: 0, scale: 2.6, duration: 0.999, ease: "power2.out" },`);
  L.push(`        { autoAlpha: 0, scale: 1, duration: 0.6 }`);
  L.push(`      ], repeat: ${ringRepeat}, ease: "none" }, 0);`);
  L.push(`      tl.to(".glow", { x: 40, y: -22, duration: ${glowDur}, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);`);
  if (hasGrid) {
    L.push(`      tl.to(".grid", { backgroundPosition: "24px 24px", duration: D, ease: "none" }, 0);`);
  }
  if (c.glowSwell) {
    L.push(`      tl.fromTo(".mark .live", { textShadow: "0 0 30px rgba(55,189,248,0.40)" }, { textShadow: "0 0 80px rgba(55,189,248,0.75)", duration: 2.4, yoyo: true, repeat: ${Math.round(D / 2.4) - 1}, ease: "sine.inOut" }, 0);`);
  }

  // entrance — loops/brand stay ambient-only (seamless); message/countdown re-animate.
  if (c.variant === "headline") {
    L.push(``);
    L.push(`      /* ENTRANCE — settles to the rest pose, then holds */`);
    if (c.eyebrow) L.push(`      tl.from(".eyebrow", { autoAlpha: 0, y: -12, duration: 0.5, ease: "power2.out" }, 0.15);`);
    L.push(`      tl.from(".line", { clipPath: "inset(0 100% 0 0)", duration: 0.62, ease: "power3.out" }, 0.32);`);
    if (c.subline) L.push(`      tl.from(".subline", { autoAlpha: 0, y: 14, duration: 0.5, ease: "power2.out" }, 0.7);`);
    if (c.showMark !== false) L.push(`      tl.from(".markwrap", { autoAlpha: 0, scale: 0.92, y: 8, duration: 0.5, ease: "back.out(1.4)", transformOrigin: "50% 50%" }, 0.85);`);
  } else if (c.variant === "countdown") {
    L.push(``);
    L.push(`      /* ENTRANCE — number pops, then holds */`);
    if (c.eyebrow) L.push(`      tl.from(".eyebrow", { autoAlpha: 0, y: -12, duration: 0.5, ease: "power2.out" }, 0.15);`);
    if (c.kicker) L.push(`      tl.from(".kicker", { autoAlpha: 0, y: 14, duration: 0.45, ease: "power2.out" }, 0.3);`);
    L.push(`      tl.from(".num", { autoAlpha: 0, scale: 0.6, duration: 0.6, ease: "back.out(1.5)", transformOrigin: "50% 60%" }, 0.45);`);
    L.push(`      tl.from(".unit", { autoAlpha: 0, y: 10, duration: 0.4, ease: "power2.out" }, 0.85);`);
    if (c.subline) L.push(`      tl.from(".subline", { autoAlpha: 0, y: 12, duration: 0.45, ease: "power2.out" }, 0.98);`);
    L.push(`      tl.from(".markwrap", { autoAlpha: 0, scale: 0.92, y: 8, duration: 0.5, ease: "back.out(1.4)", transformOrigin: "50% 50%" }, 1.05);`);
  }
  // loop + brand: ambient only -> perfectly seamless

  L.push(``);
  L.push(`      tl.set({}, {}, D); // Law #11 — fill the slot`);
  L.push(`      window.__timelines["cmp-${c.slug}"] = tl;`);
  return L.join("\n");
}

export function buildCard(c) {
  const D = c.dur;
  const a = ACCENT[c.accentColor] || ACCENT.blue;
  const eyebrowColor = c.eyebrowColor ? (ACCENT[c.eyebrowColor]?.hex || c.eyebrowColor) : a.hex;
  const hasGrid = c.showGrid !== false;
  const markSize = c.markSize || (c.variant === "brand" ? "240px" : c.backdrop ? "60px" : "92px");
  const lineSize = c.hero ? "152px" : "112px";

  const bgLayers = [
    hasGrid ? `<div class="grid"></div>` : "",
    `<div class="glow ${c.glow || "blue"}"></div>`,
    `<div class="vignette"></div>`,
  ].filter(Boolean).join("\n        ");

  // backdrop puts the mark in a corner bug, leaving the center clear for overlaid content.
  const scene = c.backdrop
    ? `<div class="backdrop-mark">${MARK}</div>`
    : `<div class="wrap">
        ${sceneInner(c)}
        </div>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — ${c.slug}</title>
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
        gap: 40px; padding: 110px; text-align: center;
      }

      .eyebrow {
        font-family: var(--font-mono); font-weight: 700; font-size: 24px;
        letter-spacing: 0.32em; text-transform: uppercase; color: ${eyebrowColor};
        display: inline-flex; align-items: center; gap: 12px;
      }
      .eyebrow::before {
        content: ""; width: 9px; height: 9px; border-radius: 2px;
        background: currentColor; box-shadow: 0 0 10px currentColor;
      }

      .line {
        font-family: var(--font-display); font-style: italic; font-weight: 900;
        font-size: ${lineSize}; line-height: 0.95; letter-spacing: -0.035em;
        color: #fff; max-width: 1560px; clip-path: inset(0 0 0 0);
      }
      .line .accent { color: ${a.hex}; font-style: italic; position: relative; }

      .subline {
        font-family: var(--font-body); font-weight: 300; font-style: italic;
        font-size: 40px; line-height: 1.2; letter-spacing: -0.01em;
        color: rgba(209, 220, 232, 0.82); max-width: 1400px;
      }

      /* countdown */
      .count { display: flex; flex-direction: column; align-items: center; gap: 4px; }
      .kicker {
        font-family: var(--font-mono); font-weight: 700; font-size: 26px;
        letter-spacing: 0.32em; text-transform: uppercase; color: #fff;
      }
      .num {
        font-family: var(--font-display); font-style: italic; font-weight: 900;
        font-size: 300px; line-height: 0.86; letter-spacing: -0.05em; color: ${a.hex};
        text-shadow: 0 0 80px ${a.glow};
      }
      .unit {
        font-family: var(--font-mono); font-weight: 700; font-size: 28px;
        letter-spacing: 0.32em; text-transform: uppercase; color: ${a.hex};
      }

      /* ---------- AIS LIVE mark (solid, brand §3.2) ---------- */
      .markwrap { display: inline-flex; }
      .backdrop-mark { position: absolute; right: 72px; bottom: 60px; display: inline-flex; }
      .mark {
        font-family: var(--font-display); font-style: italic; font-weight: 900;
        letter-spacing: -0.03em; line-height: 0.9; font-size: ${markSize};
        display: inline-flex; align-items: baseline; position: relative;
      }
      .mark .ais { color: #fff; }
      .mark .gap { display: inline-block; width: 0.08em; }
      /* .live treatment is shared by the mark AND any headline live-word */
      .live {
        position: relative; color: var(--blue);
        text-shadow: 0 0 60px rgba(55, 189, 248, 0.55);
        padding-right: 0.28em;
      }
      .dot {
        position: absolute; top: 0.08em; left: 100%; margin-left: 0.06em;
        width: 0.16em; height: 0.16em; border-radius: 50%;
        background: var(--red-live);
        box-shadow: 0 0 0.7em #ff3b30, 0 0 0.25em #ff3b30;
      }
      .ring {
        position: absolute; top: 0.08em; left: 100%; margin-left: 0.06em;
        width: 0.16em; height: 0.16em; border-radius: 50%;
        background: rgba(255, 59, 48, 0.55); opacity: 0;
        transform-origin: 50% 50%; pointer-events: none;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="cmp-${c.slug}" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        ${bgLayers}
      </div>
      <div id="scene" class="clip" data-start="0" data-duration="${D}" data-track-index="1">
        ${scene}
      </div>
    </div>

    <script>
${timelineJS(c)}
    <\/script>
  </body>
</html>
`;
}
