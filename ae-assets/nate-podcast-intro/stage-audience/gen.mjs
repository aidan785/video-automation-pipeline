// Vox-style theater stage + audience, built as stackable AE layers.
// Writes index.html; shot.mjs captures each layer as a transparent PNG.
// Palette/textures mirror style-library/01-vox-explainer/tokens.css.
import { writeFileSync } from "node:fs";

const W = 1920, H = 1080;

const PAPER = "#efe9dc";
const PAPER2 = "#e6dcc4";
const INK = "#17130e";
const BLUE = "#37BDF8";
const RED = "#e23b2e";
const RED_DK = "#c22e22";

// deterministic PRNG (render contract: no unseeded Math.random)
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- audience --
// One person, seen from behind, torso up: torso with sloped shoulders + neck
// + a plain slightly-oval head. No hair variants — normal head shapes only.
function person(rnd, cx, baseY, headR) {
  const scale = 0.9 + rnd() * 0.22;
  const R = headR * scale;
  const headRx = R * 0.84;             // head is a touch narrower than tall
  const headRy = R;
  const tw = R * (1.5 + rnd() * 0.3);  // torso half-width
  const torsoTop = baseY - R * 2.3;    // shoulder line
  const sh = R * 0.85;                 // shoulder rounding radius
  const hx = cx + (rnd() - 0.5) * R * 0.15;
  const hy = torsoTop - R * 0.3 - headRy;
  const rot = (rnd() - 0.5) * 5;

  const torso = `M ${cx - tw} ${baseY + 6}
    L ${cx - tw} ${torsoTop + sh}
    Q ${cx - tw} ${torsoTop} ${cx - tw + sh} ${torsoTop}
    L ${cx + tw - sh} ${torsoTop}
    Q ${cx + tw} ${torsoTop} ${cx + tw} ${torsoTop + sh}
    L ${cx + tw} ${baseY + 6} Z`;

  return `<g transform="rotate(${rot.toFixed(1)} ${cx} ${baseY})">
    <path d="${torso}"/>
    <rect x="${hx - R * 0.32}" y="${torsoTop - R * 0.45}" width="${R * 0.64}" height="${R * 0.6}"/>
    <ellipse cx="${hx}" cy="${hy}" rx="${headRx}" ry="${headRy}"/>
  </g>`;
}

// A row of people along a gentle theater arc (edges lift slightly).
function audienceRow(seed, baseY, headR, count, arcAmp, roughId) {
  const rnd = mulberry32(seed);
  const startX = -80, endX = W + 80;
  const step = (endX - startX) / (count - 1);
  let g = "";
  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) * 2 - 1; // -1..1
    const cx = startX + i * step + (rnd() - 0.5) * step * 0.3;
    const y = baseY - arcAmp * (t * t) + (rnd() - 0.5) * headR * 0.5;
    g += person(rnd, cx, y, headR);
  }
  return `<g fill="${INK}" filter="url(#${roughId})">${g}</g>`;
}

// ------------------------------------------------------------------- stage --
// Proscenium opening
const PX0 = 330, PX1 = 1590, PTOP = 110, PFLOOR = 645;

function curtainFolds(rnd, x0, x1, y0, y1) {
  // vertical fold shading stripes + scalloped bottom hem
  let stripes = "";
  for (let x = x0 + 30; x < x1 - 20; x += 62 + rnd() * 30) {
    const w = 14 + rnd() * 16;
    stripes += `<rect x="${x.toFixed(0)}" y="${y0}" width="${w.toFixed(0)}" height="${y1 - y0}" fill="${RED_DK}" opacity="${(0.5 + rnd() * 0.35).toFixed(2)}"/>`;
  }
  return stripes;
}

function scallopHem(x0, x1, y, depth, n, fill) {
  const w = (x1 - x0) / n;
  let d = `M ${x0} ${y - depth}`;
  for (let i = 0; i < n; i++) {
    d += ` A ${w / 2} ${depth} 0 0 0 ${x0 + (i + 1) * w} ${y - depth}`;
  }
  d += ` L ${x1} ${y - depth - 40} L ${x0} ${y - depth - 40} Z`;
  return `<path d="${d}" fill="${fill}" transform="translate(0 ${depth + 40})" />`;
}

function buildBackdrop() {
  const rnd = mulberry32(41);
  // closed main curtain inside the proscenium + faint construction grid on paper
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
        <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(23,19,14,0.07)" stroke-width="1"/>
      </pattern>
      <pattern id="halftone" width="7" height="7" patternUnits="userSpaceOnUse">
        <circle cx="3.5" cy="3.5" r="1.1" fill="${INK}"/>
      </pattern>
      <filter id="roughBg" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="11" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="6"/>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" fill="${PAPER}"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <!-- back wall band behind stage, slightly aged -->
    <rect x="0" y="0" width="${W}" height="${PFLOOR + 20}" fill="${PAPER2}" opacity="0.5"/>
    <g filter="url(#roughBg)">
      <!-- closed main curtain -->
      <rect x="${PX0}" y="${PTOP}" width="${PX1 - PX0}" height="${PFLOOR - PTOP}" fill="${RED}"/>
      ${curtainFolds(rnd, PX0, PX1, PTOP, PFLOOR)}
      <rect x="${PX0}" y="${PTOP}" width="${PX1 - PX0}" height="${PFLOOR - PTOP}" fill="url(#halftone)" opacity="0.08"/>
      <!-- center split shadow -->
      <rect x="${(PX0 + PX1) / 2 - 7}" y="${PTOP}" width="14" height="${PFLOOR - PTOP}" fill="${INK}" opacity="0.55"/>
      <rect x="${PX0}" y="${PTOP}" width="${PX1 - PX0}" height="${PFLOOR - PTOP}" fill="none" stroke="${INK}" stroke-width="5"/>
    </g>
  </svg>`;
}

function buildStageFrame() {
  // hatching on the stage front skirt
  let hatch = "";
  const hr = mulberry32(7);
  for (let x = 130; x < W - 110; x += 26) {
    hatch += `<line x1="${x}" y1="${PFLOOR + 42}" x2="${x - 14 - hr() * 8}" y2="${PFLOOR + 128}" stroke="${INK}" stroke-width="2.5" opacity="0.22"/>`;
  }

  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="halftone2" width="7" height="7" patternUnits="userSpaceOnUse">
        <circle cx="3.5" cy="3.5" r="1.1" fill="${INK}"/>
      </pattern>
      <filter id="roughFrame" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="23" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5"/>
      </filter>
    </defs>
    <g filter="url(#roughFrame)">
      <!-- proscenium arch: thick ink frame -->
      <rect x="${PX0 - 78}" y="${PTOP - 68}" width="${PX1 - PX0 + 156}" height="70" fill="${INK}"/>
      <rect x="${PX0 - 78}" y="${PTOP - 68}" width="60" height="${PFLOOR - PTOP + 116}" fill="${INK}"/>
      <rect x="${PX1 + 18}" y="${PTOP - 68}" width="60" height="${PFLOOR - PTOP + 116}" fill="${INK}"/>
      <!-- valance (scalloped top pelmet) -->
      ${scallopHem(PX0 - 18, PX1 + 18, PTOP + 26, 34, 12, RED)}
      ${scallopHem(PX0 - 18, PX1 + 18, PTOP + 14, 30, 12, RED_DK)}
      <rect x="${PX0 - 18}" y="${PTOP - 4}" width="${PX1 - PX0 + 36}" height="26" fill="${RED_DK}"/>
      <!-- stage floor: thin top surface + front skirt -->
      <rect x="90" y="${PFLOOR + 2}" width="${W - 180}" height="34" fill="${PAPER2}" stroke="${INK}" stroke-width="5"/>
      <rect x="110" y="${PFLOOR + 36}" width="${W - 220}" height="110" fill="${PAPER2}" stroke="${INK}" stroke-width="5"/>
      <rect x="110" y="${PFLOOR + 36}" width="${W - 220}" height="110" fill="url(#halftone2)" opacity="0.10"/>
      ${hatch}
    </g>
  </svg>`;
}

function buildSpotlights() {
  const cx = (PX0 + PX1) / 2;
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${BLUE}" stop-opacity="0.36"/>
        <stop offset="1" stop-color="${BLUE}" stop-opacity="0.05"/>
      </linearGradient>
      <radialGradient id="pool" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="${BLUE}" stop-opacity="0.4"/>
        <stop offset="1" stop-color="${BLUE}" stop-opacity="0"/>
      </radialGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
    </defs>
    <g filter="url(#soft)">
      <polygon points="140,-40 260,-40 ${cx + 200},${PFLOOR} ${cx - 240},${PFLOOR}" fill="url(#beam)"/>
      <polygon points="${W - 260},-40 ${W - 140},-40 ${cx + 240},${PFLOOR} ${cx - 200},${PFLOOR}" fill="url(#beam)"/>
    </g>
    <ellipse cx="${cx}" cy="${PFLOOR - 6}" rx="430" ry="64" fill="url(#pool)"/>
  </svg>`;
}

function buildAudienceLayer(id, seed, baseY, headR, count, arcAmp) {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="rough${id}" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="${seed}" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="${Math.max(2.5, headR * 0.05)}"/>
      </filter>
    </defs>
    ${audienceRow(seed, baseY, headR, count, arcAmp, "rough" + id)}
  </svg>`;
}

// ------------------------------------------------------------------- html ---
const grainCss = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:transparent;}
  .layer{position:absolute;top:0;left:0;width:${W}px;height:${H}px;}
  #grain{background-image:${grainCss};background-size:180px;opacity:0.16;mix-blend-mode:multiply;pointer-events:none;}
  #vignette{background:radial-gradient(ellipse 85% 75% at 50% 46%, transparent 62%, rgba(23,19,14,0.22) 100%);pointer-events:none;}
</style></head>
<body>
  <div class="layer" id="L1">${buildBackdrop()}</div>
  <div class="layer" id="L2">${buildStageFrame()}</div>
  <div class="layer" id="L3">${buildSpotlights()}</div>
  <div class="layer" id="L4">${buildAudienceLayer("Back", 101, 860, 34, 25, 46)}</div>
  <div class="layer" id="L5">${buildAudienceLayer("Mid", 202, 1095, 54, 14, 60)}</div>
  <div class="layer" id="L6">${buildAudienceLayer("Front", 303, 1395, 88, 8, 110)}</div>
  <div class="layer" id="grain"></div>
  <div class="layer" id="vignette"></div>
</body></html>`;

writeFileSync(new URL("./index.html", import.meta.url), html);
console.log("wrote index.html");
