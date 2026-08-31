#!/usr/bin/env node
// CAIC Interview 01 — overlay generator.
//
// Each graphic in _plan.json is emitted as its own standalone 1920x1080
// composition under compositions/. They render to alpha MOVs and get
// composited onto the clean interview with ffmpeg (_composite.sh) — a
// 53-minute HyperFrames render of the whole video would be slow and
// re-encode the source through Chrome for no gain.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = resolve(HERE, "../../style-library/02-kallaway");
const plan = JSON.parse(readFileSync(join(HERE, "_plan.json"), "utf8"));
const tokens = readFileSync(join(LIB, "tokens.css"), "utf8");

mkdirSync(join(HERE, "g"), { recursive: true });

// ---------------------------------------------------------------------------
// Per-card position overrides. The Zoom recording burns its own name tag into
// the bottom-LEFT corner, so every overlay lives bottom-RIGHT to avoid a
// double-nameplate. Cards are authored top/left-anchored, so we re-anchor.
// ---------------------------------------------------------------------------
const OVERRIDES = {
  // Lower thirds are the exception: they sit bottom-LEFT and are made opaque
  // and edge-bleeding on purpose, so the branded nameplate REPLACES Zoom's
  // burnt-in tag for the seconds it's up rather than sitting beside it.
  "t2-lt-min": `
    #t2-lt-min .local-bloom { left: 0; right: auto; bottom: 0; width: 560px; }
    #t2-lt-min .underlay {
      left: 0; right: auto; bottom: 0;
      min-width: 430px;
      padding: 26px 60px 30px 58px;
      background: linear-gradient(115deg, #071018 0%, #0D2031 100%);
      backdrop-filter: none; -webkit-backdrop-filter: none;
      border: none; border-top: var(--stroke) solid var(--glass-border);
      border-right: var(--stroke) solid var(--glass-border);
      border-radius: 0 var(--radius-sm) 0 0;
    }
    /* name-only lower third: drop the empty role line and its gap */
    #t2-lt-min .role:empty { display: none; }
    #t2-lt-min .underlay:has(.role:empty) .underline { margin-bottom: 0; }
  `,
  "t2-lb-def": `
    #t2-lb-def .local-glow { top: auto; bottom: 56px; }
    #t2-lb-def .card       { top: auto; bottom: 76px; }
  `,
  "t2-lb-take": `
    #t2-lb-take .local-glow { left: auto; right: 72px; top: auto; bottom: 56px; }
    #t2-lb-take .card       { left: auto; right: 80px; top: auto; bottom: 76px; }
  `,
  "t2-lb-key": `
    #t2-lb-key .local-glow { left: auto; right: 60px; top: auto; bottom: 56px; }
    #t2-lb-key .wrap       { left: auto; right: 80px; top: auto; bottom: 76px; }
  `,
};

// The title card is bespoke: the library section card has no logo slot, so its
// whole .stage is replaced with one centred stack — CAIC wordmark, a flat
// "little button", the headline, then the guest credit. Everything else (bloom,
// dot grid, vignette, grain) is the library card's, untouched.
//
// NOTE: .stage is positioned `left:50% top:50% translate(-50%,-50%)`. Any
// override that sets `transform` without repeating that translate knocks the
// whole stack off-centre — that bug shipped in v1.
const TITLE_CSS = `
  #t1-sec-chap .stage { gap: 0; }

  #t1-sec-chap .caic-lockup { width: 360px; }
  #t1-sec-chap .caic-lockup img { width: 100%; display: block; }

  /* "just a little button" — flat, no bloom, no neon edge, no side glow */
  #t1-sec-chap .chapter-card {
    margin-top: 46px;
    padding: 11px 26px;
    gap: 0;
    background: rgba(255, 255, 255, 0.05);
    border: var(--stroke) solid rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    backdrop-filter: none; -webkit-backdrop-filter: none;
    box-shadow: none;
  }
  #t1-sec-chap .chapter-card::before,
  #t1-sec-chap .chapter-card::after { content: none; }
  #t1-sec-chap .chap-label {
    font-size: 15px; letter-spacing: 0.22em;
    color: var(--text-dim); text-shadow: none;
  }

  #t1-sec-chap .headline { margin-top: 40px; font-size: 84px; }
  #t1-sec-chap .sep { margin-top: 42px; width: 200px; }

  #t1-sec-chap .guest {
    margin-top: 30px; text-align: center;
    font-family: var(--font-body); font-weight: var(--wt-med);
    font-size: 25px; letter-spacing: 0.02em; color: var(--text-dim);
  }
  #t1-sec-chap .guest strong { color: var(--white); font-weight: var(--wt-semi); }
`;
// Replaces the card's own .stage block wholesale.
const TITLE_STAGE = `
      <div class="stage">
        <div class="caic-lockup"><img src="assets/caic-wordmark.png" alt="CAIC — Certified AI Consultant" /></div>
        <div class="chapter-card">
          <span class="chap-label" data-slot="chapter">EXPERT INTERVIEW 01</span>
        </div>
        <div class="headline" data-slot="headline">AI Governance<br>for <em>Builders</em></div>
        <div class="sep"></div>
        <div class="guest"><strong>Katharina Koerner</strong> &nbsp;&middot;&nbsp; Sr. Principal Consultant, AI Governance</div>
      </div>
`;
const TITLE_TL = `
      tl.from("#t1-sec-chap .caic-lockup",
        { autoAlpha: 0, y: 26, filter: "blur(10px)", duration: 0.9, ease: "power4.out" }, 0.2);
      tl.from("#t1-sec-chap .guest",
        { autoAlpha: 0, y: 14, duration: 0.7, ease: "power3.out" }, 1.5);
`;

function fillSlot(html, slot, value) {
  const re = new RegExp(`(data-slot="${slot}"[^>]*>)([\\s\\S]*?)(</)`, "");
  if (!re.test(html)) {
    console.warn(`  ! slot "${slot}" not found on card`);
    return html;
  }
  return html.replace(re, (_m, open, _old, close) => `${open}${value}${close}`);
}

for (const g of plan.graphics) {
  let html = readFileSync(join(LIB, "cards", g.card), "utf8");
  const rootId = (html.match(/data-composition-id="([^"]+)"/) || [])[1];
  if (!rootId) throw new Error(`${g.id}: no data-composition-id`);

  // tokens.css is inlined — the card's ../../tokens.css link would 404 from
  // compositions/ and the card would render unstyled.
  html = html.replace(
    /<link rel="stylesheet" href="\.\.\/\.\.\/tokens\.css"\s*\/?>/,
    `<style>\n${tokens}\n</style>`,
  );

  // No render-time network fetches (see the Render Contract) — vendor GSAP.
  html = html.replace(
    /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/gsap[^"]*"><\/script>/,
    `<script src="assets/gsap.min.js"></script>`,
  );

  for (const [slot, value] of Object.entries(g.slots || {})) {
    html = fillSlot(html, slot, value);
  }

  let extraCss = OVERRIDES[rootId] || "";
  if (g.kind === "title") {
    extraCss += TITLE_CSS;
    html = html.replace(
      /\n\s*<div class="stage">[\s\S]*?\n\s*<\/div>\n\n\s*<div class="vignette">/,
      `\n${TITLE_STAGE}\n      <div class="vignette">`,
    );
    if (!html.includes("caic-lockup")) throw new Error("title: stage replacement missed");
    // The pill is meant to read flat, so drop the card's glow pulse on it.
    html = html.replace(
      /\n\s*\/\* soft glow pulse on the chapter card \*\/[\s\S]*?\}, 2\.2\);\n/,
      "\n",
    );
  }
  // Must land AFTER the card's own <style> (tokens.css is inlined before it),
  // so the overrides actually win.
  html = html.replace(
    /<\/head>/,
    `<style>\n/* --- caic-interview-1 overrides --- */\n${extraCss}\n</style>\n  </head>`,
  );

  // Re-time: drop the card's own tail pad, add our hold + a fade-out so the
  // ffmpeg overlay never pops off.
  //
  // The title is the exception. HyperFrames' MOV path captures on a transparent
  // page, and the card's opaque `background: var(--canvas)` does NOT survive it
  // — the rendered alpha is ~12/255, so the interview ghosts through. So the
  // title holds at full opacity here and `_composite.mjs` lays it on a black
  // plate and dissolves that instead.
  const fade = g.kind === "title" ? 0 : 0.45;
  const holdAt = +(g.duration - fade).toFixed(2);
  html = html.replace(/\n\s*tl\.set\(\{\},\s*\{\},\s*[\d.]+\);\s*\n/, "\n");
  const tail =
    (g.kind === "title" ? TITLE_TL : "") +
    `\n      tl.set({}, {}, ${holdAt});\n` +
    (fade
      ? `      tl.to("#${rootId}", { autoAlpha: 0, duration: ${fade}, ease: "power2.inOut" }, ${holdAt});\n`
      : "");
  html = html.replace(
    new RegExp(`(\\n\\s*window\\.__timelines\\["${rootId}"\\] = tl;)`),
    `${tail}$1`,
  );

  // Unique per-graphic composition id so nothing collides at render time.
  html = html.replaceAll(rootId, `caic-${g.id}`);

  // One self-contained mini-project per graphic: the CLI lints and renders a
  // DIR containing index.html, and serves that dir as the web root, so assets
  // have to live inside it.
  const dir = join(HERE, "g", g.id);
  mkdirSync(join(dir, "assets"), { recursive: true });
  copyFileSync(join(HERE, "assets", "gsap.min.js"), join(dir, "assets", "gsap.min.js"));
  copyFileSync(join(HERE, "assets", "caic-wordmark.png"), join(dir, "assets", "caic-wordmark.png"));
  copyFileSync(join(HERE, "hyperframes.json"), join(dir, "hyperframes.json"));
  writeFileSync(join(dir, "index.html"), html);
  console.log(`${g.id.padEnd(14)} ${g.card.padEnd(34)} ${g.duration}s -> g/${g.id}/index.html`);
}

console.log(`\n${plan.graphics.length} compositions written.`);
