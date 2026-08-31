// AIS LIVE — Community Testimonial Reels (#4 Building / #5 Earning).
// Slideshow-style HyperFrames VIDEO: branded intro -> member slides (rounded 16:9
// clip + name / win) -> outro. The BUILDING reel now carries REAL member footage
// (assets/builder/*.mp4, trimmed + de-captioned in Descript); EARNING is still
// placeholder copy. Real clips are root-level <video> + sibling <audio> positioned
// over each slide's box (HyperFrames contract: video muted, audio separate, video
// not nested in a timed clip). The EARNING reel keeps the dashed placeholder box.
// Self-contained (own HyperFrames contract + brand CSS). Brand source: AIS-LIVE-BRAND.md.
//
//   node _gen.mjs <building|earning>  -> writes cards/*.html + copies <slug> to index.html
//   node _gen.mjs                      -> writes both cards/*.html

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

// timing (seconds). INTRO/OUTRO fixed; member slide length = its clip length
// (m.clip) when real footage is present, else the MEMBER default.
const INTRO = 6.4, MEMBER = 9.6, OUTRO = 8.0;

// rounded 16:9 clip box geometry inside .mslide (padding 178/112/156, align center).
const VID_W = 900, VID_H = 506, VID_LEFT = 112, VID_TOP = 298, VID_RADIUS = 26;

// Live-asset directives (DESIGN.md): ALL accents are brand blue — coral/yellow
// keys retained so member data reads unchanged, but every key resolves to blue.
const BLUE = { hex: "#37bdf8", glow: "rgba(55,189,248,0.55)" };
const ACCENT = { blue: BLUE, coral: BLUE, yellow: BLUE };

const REELS = [
  {
    slug: "testi-building",
    accent: "blue",
    eyebrow: "Real Members · Real Builds",
    introKicker: "Community Testimonials",
    introLine: `What They <em>Built</em>`,
    introSub: "AIS members on what shifted the moment they stopped watching and started shipping.",
    outroLine: `You're <em>Next</em>.`,
    outroSub: "Real projects start inside AIS+.",
    members: [
      { name: "Frank Priboy",      role: "AIS+ Member",  accent: "blue",   quote: "I have yet to find something I can't build.",        built: "AI consultancy",        video: "assets/builder/frank-priboy.mp4",      clip: 14.72 },
      { name: "Amy Simpson",       role: "AIS+ Member",  accent: "coral",  quote: "I swore I'd never design a website. Now it comes naturally to me.", built: "Websites & code", video: "assets/builder/amy-simpson.mp4",      clip: 11.10 },
      { name: "Balaji Iyer",       role: "AIS+ Member",  accent: "yellow", quote: "I spun up a workflow I never thought I would build.", built: "Self-hosted n8n system", video: "assets/builder/balaji-iyer.mp4",       clip: 10.24 },
      { name: "Miguel Zamarripa",  role: "AIS+ Member",  accent: "blue",   quote: "I deliver real projects now, not just nice demos.", built: "Real client projects", video: "assets/builder/miguel-zamarripa.mp4", clip: 8.96 },
      { name: "Griffin Maklansky", role: "AIS+ Member",  accent: "coral",  quote: "A month and a half from laid off to hired.",          built: "First app + a job",     video: "assets/builder/griffin-maklansky.mp4", clip: 4.50 },
    ],
  },
  {
    slug: "testi-earning",
    accent: "yellow",
    eyebrow: "Real Members · Real Revenue",
    introKicker: "Community Testimonials",
    introLine: `What They <em>Earned</em>`,
    introSub: "Members who turned the skill into income, and the numbers to prove it.",
    outroLine: `Your Turn to <em>Get Paid</em>.`,
    outroSub: "Build it. Price it. Close it. Inside AIS+.",
    members: [
      { name: "Glenn Marcus",        role: "AIS+ Member", accent: "yellow", metric: "$60K",  metricSub: "one signed contract", quote: "Yesterday we just signed a $60,000 contract.",   video: "assets/earning/glenn-marcus.mp4",       clip: 3.23 },
      { name: "Mike Aheirwe",        role: "AIS+ Member", accent: "blue",   metric: "$6K",   metricSub: "first client quote",  quote: "I was able to quote him out at $6K.",            video: "assets/earning/mike-aheirwe.mp4",       clip: 2.83 },
      { name: "Abdurrahman Ibrahim", role: "AIS+ Member", accent: "coral",  metric: "$8K",   metricSub: "earned from AIS+",    quote: "I calculated it. I made $8,000 from AIS+.",      video: "assets/earning/abdurrahman-ibrahim.mp4", clip: 11.05 },
      { name: "Maciej Wesolowski",   role: "AIS+ Member", accent: "yellow", metric: "$8.5K", metricSub: "across two deals",     quote: "Two contracts: $3,300 and $5,200.",              video: "assets/earning/maciej-wesolowski.mp4",  clip: 13.90 },
      { name: "Sven Loeffler",       role: "AIS+ Member", accent: "blue",   metric: "$10K",  metricSub: "new project rate",    quote: "Two months ago I'd never have charged this much.", video: "assets/earning/sven-loeffler.mp4",  clip: 9.60 },
      { name: "Jose M Lopes",        role: "AIS+ Member", accent: "coral",  metric: "$12K",  metricSub: "per system",          quote: "Now I can charge $12K for this.",                video: "assets/earning/jose-lopes.mp4",         clip: 3.43 },
      { name: "Aidan Finnegan",      role: "AIS+ Member", accent: "yellow", metric: "$14K",  metricSub: "consulting contract", quote: "We landed a $14,000 contract.",                  video: "assets/earning/aidan-finnegan.mp4",     clip: 5.06 },
      { name: "Latoya Robinson",     role: "AIS+ Member", accent: "blue",   metric: "$24K",  metricSub: "client engagement",   quote: "I closed a client for a $24,000 engagement.",    video: "assets/earning/latoya-robinson.mp4",    clip: 6.40 },
    ],
  },
];

const MARK = `<span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span>`;
const kind = (reel) => (reel.slug.endsWith("earning") ? "earn" : "build");

// per-member slide lengths + cumulative starts + total duration
const memberDurs = (reel) => reel.members.map((m) => (m.clip ? +m.clip.toFixed(2) : MEMBER));
function memberStarts(reel) {
  const ds = memberDurs(reel);
  const s = [];
  let acc = INTRO;
  for (const d of ds) { s.push(+acc.toFixed(2)); acc += d; }
  return s;
}
const totalD = (reel) => +(INTRO + memberDurs(reel).reduce((a, b) => a + b, 0) + OUTRO).toFixed(2);

function videoBox(m) {
  // The rounded 16:9 clip frame. Real footage (m.video) is a root-level <video>
  // positioned over this box, so here we only render the frame + (for placeholders)
  // the dashed "Member Clip" prompt.
  const inner = m.video
    ? ``
    : `<div class="ph">
            <div class="play"><div class="pulse"></div></div>
            <div class="phlabel">Member Clip</div>
            <div class="phsub">16:9 · drop footage here</div>
          </div>`;
  return `<div class="vid">
          <div class="vgrid"></div>
          <div class="scan"></div>
          ${inner}
        </div>`;
}

function memberHTML(m, i, n, k) {
  const a = ACCENT[m.accent].hex;
  const counter = `${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
  const text =
    k === "earn"
      ? `<div class="mtext">
          <div class="tag">Earning</div>
          <div class="metricwrap"><div class="metric">${m.metric}</div><div class="msub">${m.metricSub}</div></div>
          <div class="quote"><span class="qm">&ldquo;</span>${m.quote}&rdquo;</div>
          <div class="nameline"><span class="name-sm">${m.name}</span><span class="role">${m.role}</span></div>
          <div class="counter">${counter}</div>
        </div>`
      : `<div class="mtext">
          <div class="tag">Building</div>
          <div class="name">${m.name}</div>
          <div class="role">${m.role}</div>
          <div class="quote"><span class="qm">&ldquo;</span>${m.quote}&rdquo;</div>
          <div class="built">Built · ${m.built}</div>
          <div class="counter">${counter}</div>
        </div>`;
  return `<div id="m${i}" class="panel mslide" style="--a:${a}">
        ${videoBox(m)}
        ${text}
      </div>`;
}

// root-level real footage: <video muted> + sibling <audio>, positioned over the box.
function rootMediaHTML(reel) {
  const starts = memberStarts(reel);
  const durs = memberDurs(reel);
  const out = [];
  reel.members.forEach((m, i) => {
    if (!m.video) return;
    const S = starts[i];
    const a = ACCENT[m.accent].hex;
    const vdur = (durs[i] + 0.6).toFixed(2); // tail covers the crossfade out
    const adur = durs[i].toFixed(2);
    out.push(
      `      <div id="rv-m${i}" class="realvid" style="--a:${a}; left:${VID_LEFT}px; top:${VID_TOP}px; width:${VID_W}px; height:${VID_H}px;">
        <video id="vid-m${i}" src="${m.video}" muted playsinline data-has-audio="false" data-start="${S}" data-duration="${vdur}" data-track-index="${10 + i}"></video>
      </div>
      <audio id="aud-m${i}" src="${m.video}" data-start="${S}" data-duration="${adur}" data-track-index="${20 + i}" data-volume="1"></audio>`
    );
  });
  return out.join("\n");
}

function timelineJS(reel) {
  const n = reel.members.length;
  const D = totalD(reel);
  const starts = memberStarts(reel);
  const durs = memberDurs(reel);
  const dotRepeat = Math.round(D / 0.8) - 1;
  const ringRepeat = Math.round(D / 1.6) - 1;
  const glowDur = +(D / 2).toFixed(2);
  const L = [];
  L.push(`      window.__timelines = window.__timelines || {};`);
  L.push(`      const D = ${D};`);
  L.push(`      const tl = gsap.timeline({ paused: true });`);
  L.push(``);
  L.push(`      /* AMBIENT — phase-locked to the 1.6s brand beat */`);
  L.push(`      tl.to(".dot", { scale: 1.1, duration: 0.8, yoyo: true, repeat: ${dotRepeat}, ease: "sine.inOut", transformOrigin: "50% 50%" }, 0);`);
  L.push(`      tl.fromTo(".ring", { scale: 1, autoAlpha: 0 }, { keyframes: [`);
  L.push(`        { autoAlpha: 0.5, scale: 1, duration: 0.001 },`);
  L.push(`        { autoAlpha: 0, scale: 2.6, duration: 0.999, ease: "power2.out" },`);
  L.push(`        { autoAlpha: 0, scale: 1, duration: 0.6 }`);
  L.push(`      ], repeat: ${ringRepeat}, ease: "none" }, 0);`);
  L.push(`      tl.to(".glow", { x: 40, y: -22, duration: ${glowDur}, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);`);
  L.push(`      tl.to(".grid", { backgroundPosition: "24px 24px", duration: D, ease: "none" }, 0);`);
  L.push(``);
  L.push(`      /* INTRO */`);
  L.push(`      tl.set("#intro", { autoAlpha: 1 }, 0);`);
  L.push(`      tl.set("#intro .i-kicker", { autoAlpha: 0, y: -14 }, 0);`);
  L.push(`      tl.to ("#intro .i-kicker", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.2);`);
  L.push(`      tl.set("#intro .i-line", { clipPath: "inset(0 100% 0 0)" }, 0);`);
  L.push(`      tl.to ("#intro .i-line", { clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power3.out" }, 0.4);`);
  L.push(`      tl.set("#intro .i-sub", { autoAlpha: 0, y: 16 }, 0);`);
  L.push(`      tl.to ("#intro .i-sub", { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.9);`);

  for (let i = 0; i < n; i++) {
    const m = reel.members[i];
    const S = starts[i];
    const Ldur = durs[i];
    const sel = `#m${i}`;
    const prev = i === 0 ? "#intro" : `#m${i - 1}`;
    const sweeps = Math.max(1, Math.round((Ldur - 1.5) / 2.6));
    const pulseRep = Math.max(1, Math.round(Ldur / 1.3) - 1);
    L.push(``);
    L.push(`      /* MEMBER ${i + 1} @ ${S}s (${Ldur}s) — crossfade from ${prev} */`);
    L.push(`      tl.to ("${prev}", { autoAlpha: 0, y: -26, duration: 0.5, ease: "power2.in" }, ${S});`);
    L.push(`      tl.set("${sel}", { autoAlpha: 1 }, ${S});`);
    L.push(`      tl.set("${sel} .vid", { autoAlpha: 0, x: -34, scale: 0.96 }, ${S});`);
    L.push(`      tl.to ("${sel} .vid", { autoAlpha: 1, x: 0, scale: 1, duration: 0.7, ease: "power3.out" }, ${(S + 0.05).toFixed(2)});`);
    L.push(`      tl.set("${sel} .mtext > *", { autoAlpha: 0, x: 36 }, ${S});`);
    L.push(`      tl.to ("${sel} .mtext > *", { autoAlpha: 1, x: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }, ${(S + 0.3).toFixed(2)});`);
    if (m.video) {
      // real footage crossfades in with the box and out into the next slide
      L.push(`      tl.set("#rv-m${i}", { autoAlpha: 0, x: -34, scale: 0.96 }, 0);`);
      L.push(`      tl.to ("#rv-m${i}", { autoAlpha: 1, x: 0, scale: 1, duration: 0.7, ease: "power3.out" }, ${(S + 0.05).toFixed(2)});`);
      L.push(`      tl.to ("#rv-m${i}", { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, ${(S + Ldur).toFixed(2)});`);
    } else {
      L.push(`      tl.fromTo("${sel} .scan", { yPercent: -30, autoAlpha: 0 }, { keyframes: [ { autoAlpha: 0.5, duration: 0.25 }, { yPercent: 130, autoAlpha: 0, duration: 2.4 } ], repeat: ${sweeps - 1}, ease: "none" }, ${(S + 0.8).toFixed(2)});`);
      L.push(`      tl.to ("${sel} .pulse", { scale: 1.14, autoAlpha: 0.85, duration: 1.3, yoyo: true, repeat: ${pulseRep}, ease: "sine.inOut", transformOrigin: "50% 50%" }, ${(S + 0.6).toFixed(2)});`);
    }
  }

  const So = +(D - OUTRO).toFixed(2);
  L.push(``);
  L.push(`      /* OUTRO @ ${So}s */`);
  L.push(`      tl.to ("#m${n - 1}", { autoAlpha: 0, y: -26, duration: 0.5, ease: "power2.in" }, ${So});`);
  L.push(`      tl.set("#outro", { autoAlpha: 1 }, ${So});`);
  L.push(`      tl.set("#outro .o-line", { clipPath: "inset(0 100% 0 0)" }, ${So});`);
  L.push(`      tl.to ("#outro .o-line", { clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power3.out" }, ${(So + 0.2).toFixed(2)});`);
  L.push(`      tl.set("#outro .o-sub", { autoAlpha: 0, y: 16 }, ${So});`);
  L.push(`      tl.to ("#outro .o-sub", { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, ${(So + 0.7).toFixed(2)});`);
  L.push(`      tl.set("#outro .o-cta", { autoAlpha: 0, scale: 0.9 }, ${So});`);
  L.push(`      tl.to ("#outro .o-cta", { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(1.4)" }, ${(So + 0.95).toFixed(2)});`);
  L.push(``);
  L.push(`      tl.set({}, {}, D); // Law #11 — fill the slot`);
  L.push(`      window.__timelines["cmp-${reel.slug}"] = tl;`);
  return L.join("\n");
}

function buildReel(reel) {
  const n = reel.members.length;
  const D = totalD(reel);
  const k = kind(reel);
  const ca = ACCENT[reel.accent].hex;
  const hasVideo = reel.members.some((m) => m.video);
  const members = reel.members.map((m, i) => memberHTML(m, i, n, k)).join("\n      ");
  const rootMedia = rootMediaHTML(reel);
  const botRight = hasVideo
    ? `<span class="tagchip">AIS LIVE · July 11–12, 2026</span>`
    : `<span class="phchip">Placeholder reel · swap footage + copy</span>`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — testimonials — ${reel.slug}</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root {
        --onyx: #07121c; --blue: #37bdf8; --coral: #ff8a5c; --yellow: #f5d82a; --red-live: #ff3b30;
        --font-display: "Montserrat", sans-serif; --font-body: "Inter", sans-serif; --font-mono: "JetBrains Mono", monospace;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #000; color: #fff; font-family: var(--font-body); }
      #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: var(--onyx); isolation: isolate; }
      #root .clip { position: absolute; inset: 0; width: 1920px; height: 1080px; pointer-events: none; }

      /* ---------- background ---------- */
      .grid { position: absolute; inset: -48px;
        background-image:
          linear-gradient(rgba(55,189,248,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(55,189,248,0.06) 1px, transparent 1px);
        background-size: 24px 24px; }
      .glow { position: absolute; top: -180px; left: 50%; width: 820px; height: 820px; margin-left: -410px;
        border-radius: 50%; background: ${ca}; filter: blur(155px); opacity: 0.16; }
      .vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 44%, rgba(0,0,0,0.58) 96%); }

      /* ---------- persistent chrome ---------- */
      .chrome { position: absolute; inset: 0; }
      .eyebrow-fixed { position: absolute; top: 62px; left: 112px; font-family: var(--font-mono); font-weight: 700;
        font-size: 20px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(209,220,232,0.62);
        display: inline-flex; align-items: center; gap: 13px; }
      /* no ::before marker chip — live-asset directives */
      .markbug { position: absolute; top: 52px; right: 108px; }
      .botbar { position: absolute; bottom: 56px; left: 112px; right: 108px; display: flex; justify-content: flex-end; align-items: center; }
      .tagchip { font-family: var(--font-mono); font-weight: 700; font-size: 14px; letter-spacing: 0.24em; text-transform: uppercase;
        color: rgba(209,220,232,0.7); border: 1px solid rgba(255,255,255,0.16); border-radius: 6px; padding: 8px 14px; }
      .phchip { font-family: var(--font-mono); font-weight: 700; font-size: 14px; letter-spacing: 0.24em; text-transform: uppercase;
        color: rgba(255,138,92,0.92); border: 1px dashed rgba(255,138,92,0.42); border-radius: 6px; padding: 8px 14px; }

      /* ---------- panels ---------- */
      .panel { position: absolute; inset: 0; opacity: 0; visibility: hidden; }
      .center { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 34px; padding: 200px 240px; }
      .i-kicker { font-family: var(--font-mono); font-weight: 700; font-size: 24px; letter-spacing: 0.34em; text-transform: uppercase; color: ${ca};
        display: inline-flex; align-items: center; gap: 13px; }
      /* the wipe-reveal clip-path clips at the BORDER box, so italic-900 descenders
         (the y in "They") need generous room inside it — 0.16em bottom still clipped
         at 128px (Aidan 2026-07-08); 0.30em clears the full descender. Negative
         margin returns the extra padding so the sub line doesn't drift down. */
      .i-line, .o-line { font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: 128px; line-height: 1.1;
        letter-spacing: -0.035em; color: #fff; clip-path: inset(0 0% 0 0); padding: 0.08em 0.18em 0.30em; margin-bottom: -0.17em; }
      .i-line em, .o-line em { font-style: italic; color: ${ca}; }
      .i-sub, .o-sub { font-family: var(--font-body); font-weight: 300; font-style: italic; font-size: 40px; line-height: 1.22;
        letter-spacing: -0.01em; color: rgba(209,220,232,0.82); max-width: 1180px; }
      .o-cta { font-family: var(--font-mono); font-weight: 700; font-size: 22px; letter-spacing: 0.26em; text-transform: uppercase;
        color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 14px 26px; }

      /* ---------- member slide ---------- */
      .mslide { display: flex; align-items: center; gap: 78px; padding: 178px 112px 156px; }
      .vid { position: relative; width: 900px; height: 506px; flex: 0 0 auto; border-radius: 26px; overflow: hidden;
        background: linear-gradient(158deg, #0c1724, #0a131c);
        border: 1px solid rgba(255,255,255,0.10);
        box-shadow: 0 34px 90px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02), 0 0 70px -14px var(--a); }
      .vgrid { position: absolute; inset: 0;
        background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 44px 44px; }
      .scan { position: absolute; left: 0; right: 0; top: 0; height: 150px; opacity: 0; mix-blend-mode: screen;
        background: linear-gradient(180deg, transparent, var(--a), transparent); }
      .ph { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
      .play { position: relative; width: 118px; height: 118px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.55);
        display: flex; align-items: center; justify-content: center; }
      .play::after { content: ""; width: 0; height: 0; border-left: 34px solid #fff; border-top: 21px solid transparent; border-bottom: 21px solid transparent; margin-left: 9px; }
      .pulse { position: absolute; inset: -3px; border-radius: 50%; border: 2px solid var(--a); opacity: 0.5; }
      .phlabel { font-family: var(--font-mono); font-weight: 700; font-size: 22px; letter-spacing: 0.34em; text-transform: uppercase; color: rgba(255,255,255,0.82); }
      .phsub { font-family: var(--font-mono); font-weight: 600; font-size: 15px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(255,255,255,0.5); }

      /* real footage layer — positioned over the .vid box, animated via wrapper */
      .realvid { position: absolute; border-radius: ${VID_RADIUS}px; overflow: hidden; z-index: 3;
        opacity: 0; visibility: hidden;
        border: 1px solid rgba(255,255,255,0.10);
        box-shadow: 0 34px 90px rgba(0,0,0,0.5), 0 0 70px -14px var(--a); }
      .realvid video { width: 100%; height: 100%; object-fit: cover; display: block; }

      .mtext { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
      .tag { align-self: flex-start; display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-mono);
        font-weight: 700; font-size: 19px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--a); }
      /* no ::before marker line — live-asset directives */
      .name { font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: 86px; line-height: 0.96; letter-spacing: -0.03em; color: #fff; }
      .role { font-family: var(--font-mono); font-weight: 600; font-size: 19px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(209,220,232,0.72); }
      .quote { font-family: var(--font-display); font-style: italic; font-weight: 600; font-size: 42px; line-height: 1.2; letter-spacing: -0.015em; color: #fff; max-width: 720px; }
      .qm { color: var(--a); font-weight: 900; margin-right: 2px; }
      .built { align-self: flex-start; display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-mono);
        font-weight: 700; font-size: 18px; letter-spacing: 0.14em; text-transform: uppercase; color: #fff;
        border: 1px solid rgba(255,255,255,0.18); border-radius: 999px; padding: 11px 20px; }
      /* no ::before dot in the built chip — live-asset directives */
      .metricwrap { display: flex; align-items: baseline; gap: 20px; }
      .metric { font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: 116px; line-height: 0.9; letter-spacing: -0.04em; color: var(--a); text-shadow: 0 0 60px rgba(255,255,255,0.12); }
      .msub { font-family: var(--font-mono); font-weight: 700; font-size: 20px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(209,220,232,0.74); }
      .nameline { display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; }
      .name-sm { font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: 42px; letter-spacing: -0.02em; color: #fff; }
      .counter { margin-top: 6px; font-family: var(--font-mono); font-weight: 700; font-size: 18px; letter-spacing: 0.3em; color: rgba(209,220,232,0.55); }

      /* ---------- AIS LIVE mark (solid, brand §3.2) ---------- */
      .mark { font-family: var(--font-display); font-style: italic; font-weight: 900; letter-spacing: -0.03em; line-height: 0.9;
        font-size: 52px; display: inline-flex; align-items: baseline; position: relative; }
      .mark .ais { color: #fff; }
      .mark .gap { display: inline-block; width: 0.08em; }
      .live { position: relative; color: var(--blue); text-shadow: 0 0 60px rgba(55,189,248,0.55); padding-right: 0.28em; }
      .dot { position: absolute; top: 0.08em; left: 100%; margin-left: 0.06em; width: 0.16em; height: 0.16em; border-radius: 50%;
        background: var(--red-live); box-shadow: 0 0 0.7em #ff3b30, 0 0 0.25em #ff3b30; }
      .ring { position: absolute; top: 0.08em; left: 100%; margin-left: 0.06em; width: 0.16em; height: 0.16em; border-radius: 50%;
        background: rgba(255,59,48,0.55); opacity: 0; transform-origin: 50% 50%; pointer-events: none; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="cmp-${reel.slug}" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        <div class="grid"></div>
        <div class="glow"></div>
        <div class="vignette"></div>
      </div>
      <div id="scene" class="clip" data-start="0" data-duration="${D}" data-track-index="1">
        <div class="chrome">
          <div class="eyebrow-fixed">${reel.eyebrow}</div>
          <div class="markbug">${MARK}</div>
          <div class="botbar">${botRight}</div>
        </div>

        <div id="intro" class="panel center">
          <div class="i-kicker">${reel.introKicker}</div>
          <div class="i-line">${reel.introLine}</div>
          <div class="i-sub">${reel.introSub}</div>
        </div>

      ${members}

        <div id="outro" class="panel center">
          <div class="o-line">${reel.outroLine}</div>
          <div class="o-sub">${reel.outroSub}</div>
          <div class="o-cta">AIS LIVE · July 11–12, 2026</div>
        </div>
      </div>
${rootMedia}
    </div>

    <script>
${timelineJS(reel)}
    <\/script>
  </body>
</html>
`;
}

let wrote = 0;
for (const reel of REELS) {
  const slug = reel.slug.replace(/^testi-/, "");
  writeFileSync(join(SRC, `${slug}.html`), buildReel(reel));
  wrote++;
}
const arg = process.argv[2];
if (arg) {
  copyFileSync(join(SRC, `${arg}.html`), join(DIR, "index.html"));
  console.log(`wrote ${wrote} cards/*.html; index.html <- cards/${arg}.html`);
} else {
  console.log(`wrote ${wrote} cards/*.html  (building, earning)`);
}
