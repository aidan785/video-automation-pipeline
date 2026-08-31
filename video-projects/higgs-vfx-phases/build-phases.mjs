// Generates 3 standalone VOX-style "phase" topic cards (1920x1080), green #cdfa2d
// accent (the AIS blue highlight, --yellow #37BDF8, recolored to green). Each card
// renders alone — no background video. Tokens are inlined so there's no ../tokens.css 404.
import fs from "fs";
import path from "path";

const TOKENS = "/Users/aidanstanik/Projects/Video Automation/style-library/01-vox-explainer/tokens.css";
const OUTDIR = "/Users/aidanstanik/Projects/Video Automation/video-projects/higgs-vfx-phases";

// pull the @import font line + the :root{...} block from tokens.css, recolor blue->green
const css = fs.readFileSync(TOKENS, "utf8");
const fontImport = css.match(/@import url\([^)]*\);/)[0];
let root = css.match(/:root\s*\{[\s\S]*?\n\}/)[0];
root = root.replace(/#37BDF8/gi, "#cdfa2d"); // the blue highlight -> green

const PHASES = [
  { n: "01", l1: "Practical", l2: "VFX", l3: "",
    dek: "Still camera, simple effects dropped in — fire on your hand, a creature walking through. The easiest and cheapest to generate." },
  { n: "02", l1: "Composite", l2: "Replace", l3: "",
    dek: "Still camera, but the full background and your wardrobe get swapped — one composited output, like a keynote stage." },
  { n: "03", l1: "Full Camera", l2: "Move", l3: "",
    dek: "Move freely through a fully composited world — you're color-keyed out and dropped into a brand-new environment." },
];

const card = (p) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      ${fontImport}
      ${root}
      html, body { margin: 0; background: #000; }
      #card {
        position: absolute; inset: 0; width: 1920px; height: 1080px;
        background: var(--paper); color: var(--ink);
        font-family: var(--font-display); overflow: hidden;
      }
      #card .grid {
        position: absolute; inset: -2px;
        background-image:
          repeating-linear-gradient(0deg,  var(--grid-line) 0 1px, transparent 1px var(--grid-size)),
          repeating-linear-gradient(90deg, var(--grid-line) 0 1px, transparent 1px var(--grid-size));
      }
      #card .grain {
        position: absolute; inset: -40px; background: var(--tex-grain);
        background-size: 180px 180px; mix-blend-mode: multiply; opacity: 0.4; pointer-events: none;
      }
      #card .vignette {
        position: absolute; inset: 0; pointer-events: none;
        background: radial-gradient(130% 120% at 40% 50%, transparent 56%, rgba(23,19,14,0.16) 100%);
      }
      #card .ghost {
        position: absolute; right: -60px; top: 50%; transform: translateY(-50%);
        font-weight: var(--wt-black); font-style: italic; font-size: 1180px; line-height: 0.7;
        color: transparent; -webkit-text-stroke: 5px rgba(23,19,14,0.10);
        z-index: 1; user-select: none;
      }
      #card .stage { position: absolute; left: 150px; top: 250px; transform-origin: left top; z-index: 3; }
      #card .kicker {
        font-family: var(--font-label); font-weight: var(--wt-bold);
        font-size: var(--size-label); letter-spacing: var(--track-wide);
        text-transform: uppercase; color: var(--ink); margin-bottom: 28px;
      }
      #card .kicker::before {
        content: ""; display: inline-block; width: 56px; height: 3px;
        background: var(--yellow); margin-right: 16px; vertical-align: middle;
      }
      #card .line {
        display: inline-block; font-weight: var(--wt-black); font-size: 150px;
        line-height: 1.0; letter-spacing: var(--track-tight); color: var(--ink);
        background: var(--yellow); padding: 2px 28px; margin: 0 0 18px; clear: both; float: left;
        box-shadow: 8px 8px 0 rgba(23,19,14,0.14);
      }
      #card .l1 { transform: skewX(-1.6deg) rotate(-0.6deg); }
      #card .l2 { transform: skewX(1.2deg) rotate(0.5deg); background: var(--ink); color: var(--paper); }
      #card .dek {
        position: absolute; left: 154px; top: 760px; width: 1180px; z-index: 3;
        font-family: var(--font-label); font-weight: var(--wt-reg);
        font-size: var(--size-body); line-height: 1.4; color: rgba(23,19,14,0.82);
      }
      #card .dek b { font-weight: var(--wt-bold); }
      #card .underline { position: absolute; left: 154px; top: 736px; width: 0; height: 8px; background: var(--yellow); z-index: 2; }
      #card .badge {
        position: absolute; right: 150px; bottom: 140px; width: 168px; height: 168px;
        background: var(--red); color: var(--paper); border-radius: 50%;
        display: flex; align-items: center; justify-content: center; text-align: center;
        font-family: var(--font-label); font-weight: var(--wt-black); font-size: 30px;
        letter-spacing: 0.04em; transform: rotate(-8deg); line-height: 1.05; z-index: 4;
      }
    </style>
  </head>
  <body>
    <div id="card" data-composition-id="card" data-start="0" data-width="1920" data-height="1080">
      <div class="grid"></div>
      <div class="ghost">${p.n.replace(/^0/, "")}</div>
      <div class="stage">
        <div class="kicker">Higgsfield VFX &middot; The Workflow</div>
        <div class="line l1">${p.l1}</div>
        <div class="line l2">${p.l2}</div>
        ${p.l3 ? `<div class="line l3">${p.l3}</div>` : ""}
      </div>
      <div class="underline"></div>
      <div class="dek">${p.dek}</div>
      <div class="badge">PHASE<br/>${p.n}</div>
      <div class="vignette"></div>
      <div class="grain"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#card .grain", { backgroundPosition: "0px 0px" },
                { backgroundPosition: "150px 140px", duration: 0.5, ease: "steps(4)", repeat: 13, yoyo: true }, 0);
      tl.from("#card .ghost", { autoAlpha: 0, scale: 1.2, x: 120, transformOrigin: "70% 50%", duration: 0.7, ease: "power3.out" }, 0.1)
        .from("#card .kicker", { autoAlpha: 0, y: -18, duration: 0.3, ease: "steps(4)" }, 0.3)
        .from("#card .l1", { autoAlpha: 0, scaleX: 0, transformOrigin: "left center", duration: 0.36, ease: "power3.out" }, 0.5)
        .from("#card .l2", { autoAlpha: 0, scaleX: 0, transformOrigin: "left center", duration: 0.36, ease: "power3.out" }, 0.68)
        ${p.l3 ? `.from("#card .l3", { autoAlpha: 0, scaleX: 0, transformOrigin: "left center", duration: 0.36, ease: "power3.out" }, 0.86)` : ""}
        .to("#card .underline", { width: 520, duration: 0.5, ease: "power2.out" }, 0.95)
        .from("#card .dek", { autoAlpha: 0, y: 22, duration: 0.45, ease: "power3.out" }, 1.05)
        .from("#card .badge", { autoAlpha: 0, scale: 0, rotate: -60, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(2.4)" }, 1.2)
        .set({}, {}, 5.5);
      window.__timelines["card"] = tl;
    </script>
  </body>
</html>`;

PHASES.forEach((p, i) => {
  const file = path.join(OUTDIR, `phase-${i + 1}.html`);
  fs.writeFileSync(file, card(p));
  console.log("wrote", file);
});
