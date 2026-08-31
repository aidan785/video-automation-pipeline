#!/usr/bin/env node
// Assemble index.html: screen recording (bg) + speaker PIP (bottom right) +
// bottom-band motion graphics.
//
// Every graphic is confined to a band anchored at the BOTTOM LEFT, ending 56px
// short of the PIP, so nothing ever covers the screen recording's working area.
// Band box: left 80 · bottom 44 · width 1360 (x 80-1440, y ~840-1036).
//
// Nine band treatments, each with its own entrance choreography — see BANDS below.
// Styling follows style-library/09-higgsfield (tokens inlined at build time).
//
//   node _gen.mjs [--plan band-plan.json] [--out index.html]

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const PLAN = opt("--plan", "band-plan.json");
const OUT = opt("--out", "index.html");
const TOKENS = readFileSync(resolve("../../style-library/09-higgsfield/tokens.css"), "utf8");

const plan = JSON.parse(readFileSync(PLAN, "utf8"));
const SLUG = "editing-os-tutorial";
const W = 1920, H = 1080;
const TOTAL = plan.duration;
const PIP = plan.stage.pip;

// ---------------------------------------------------------------------------
// Band geometry — the one rule every treatment obeys.
// ---------------------------------------------------------------------------
const BAND_LEFT = 80;
const BAND_BOTTOM = 44;
const BAND_W = W - PIP.size - PIP.margin - 56 - BAND_LEFT; // 1360

const esc = (s) => String(s ?? "");
// slot text may carry <em> for the lime accent; everything else is literal
const emSplit = (s) => esc(s);

// ---------------------------------------------------------------------------
// The nine band treatments. Each returns { dom, css, js }.
// `js` runs inside an IIFE with `root` (selector) and `tl` (unpaused timeline)
// already in scope, and must leave the timeline at least `hold` seconds long.
// ---------------------------------------------------------------------------
const BANDS = {
  /* 01 · SECTION — den bar wipes open, lime index chip pops, title chars rise
     and flip to lime, a lime rule sweeps under it. The chapter marker. */
  section: (id, s) => ({
    dom: `
      <div class="bandbox sec-box">
        <div class="sec-chip"><span class="sec-chip-t">${esc(s.kicker)}</span></div>
        <div class="sec-text">
          <div class="sec-title">${esc(s.title)}</div>
          <div class="sec-sub">${esc(s.sub)}</div>
        </div>
        <div class="sec-rule"></div>
      </div>`,
    css: `
      #${id} .sec-box { display:inline-flex; align-items:center; gap:28px; position:relative;
        background:rgba(25,35,42,0.90); border:1px solid rgba(255,255,255,0.13);
        border-radius:var(--radius); padding:26px 38px; overflow:hidden;
        box-shadow:0 26px 60px rgba(0,0,0,0.5); transform-origin:left center; }
      #${id} .sec-chip { flex:none; background:var(--lime); border-radius:var(--radius-sm);
        padding:9px 16px; }
      #${id} .sec-chip-t { font-family:var(--font-mono); font-weight:var(--wt-bold);
        font-size:20px; letter-spacing:var(--track-pill); color:var(--navy); display:block; }
      #${id} .sec-title { font-family:var(--font-display); font-weight:var(--wt-black);
        font-size:60px; line-height:1; letter-spacing:var(--track-caps);
        text-transform:uppercase; color:var(--grey-pre); white-space:nowrap; }
      #${id} .sec-title .ch { display:inline-block; }
      #${id} .sec-sub { font-family:var(--font-mono); font-weight:var(--wt-med);
        font-size:19px; letter-spacing:0.22em; text-transform:uppercase;
        color:rgba(255,255,255,0.5); margin-top:9px; }
      #${id} .sec-rule { position:absolute; left:0; bottom:0; height:4px; width:100%;
        background:var(--lime); transform-origin:left center; }`,
    js: `
      splitChars(q(".sec-title"));
      tl.fromTo(root+" .sec-box", { scaleX:0.02, autoAlpha:1 },
                { scaleX:1, duration:0.5, ease:"expo.out" }, 0)
        .from(root+" .sec-chip", { scale:0.3, autoAlpha:0, duration:0.4, ease:"back.out(2.2)" }, 0.34)
        .from(root+" .sec-title .ch", { yPercent:110, autoAlpha:0, duration:0.42,
                ease:"expo.out", stagger:0.018 }, 0.42)
        .from(root+" .sec-sub", { autoAlpha:0, y:10, duration:0.35, ease:"expo.out" }, 0.72)
        /* the flip */
        .to(root+" .sec-title .ch", { color:LIME, duration:0.22, ease:"power2.inOut",
                stagger:0.012 }, 0.95)
        .fromTo(root+" .sec-rule", { scaleX:0 }, { scaleX:1, duration:0.7, ease:"expo.out" }, 0.5);`,
  }),

  /* 02 · THESIS — the statement. Words rise out of a clipping mask one by one;
     the emphasised words flip lime last with a scale kiss. */
  thesis: (id, s) => ({
    dom: `
      <div class="bandbox th-box">
        <div class="th-kicker">${esc(s.kicker)}</div>
        <div class="th-head">${emSplit(s.headline)}</div>
      </div>`,
    css: `
      #${id} .th-box { padding:4px 2px; }
      #${id} .th-kicker { font-family:var(--font-mono); font-weight:var(--wt-bold);
        font-size:19px; letter-spacing:var(--track-eyebrow); text-transform:uppercase;
        color:var(--lime); margin-bottom:14px; }
      #${id} .th-head { font-family:var(--font-display); font-weight:var(--wt-black);
        font-size:58px; line-height:1.06; letter-spacing:var(--track-caps);
        text-transform:uppercase; color:var(--grey-pre);
        text-shadow:0 3px 0 rgba(0,0,0,0.55), 0 14px 30px rgba(0,0,0,0.5); }
      #${id} .th-head .wmask { display:inline-block; overflow:hidden; vertical-align:bottom; }
      #${id} .th-head .w { display:inline-block; }`,
    js: `
      splitWordsMasked(q(".th-head"));
      tl.from(root+" .th-kicker", { autoAlpha:0, x:-24, duration:0.4, ease:"expo.out" }, 0)
        .from(root+" .th-head .w", { yPercent:108, duration:0.5, ease:"expo.out",
                stagger:0.05 }, 0.16)
        .to(root+" .th-head .w:not(.em)", { color:"var(--white)", duration:0.24,
                ease:"power2.inOut" }, 0.95)
        .to(root+" .th-head .w.em", { color:LIME, duration:0.22, ease:"power2.inOut" }, 1.25)
        .fromTo(root+" .th-head .w.em", { scale:1 }, { scale:1.05, yoyo:true, repeat:1,
                duration:0.15, ease:"power2.inOut" }, 1.25);`,
  }),

  /* 03 · STAT — the number counts up (when numeric) while a lime rule fills
     beneath it and a dot-matrix shimmer resolves; the label types on. */
  stat: (id, s) => ({
    dom: `
      <div class="bandbox st-box">
        <div class="st-dots"></div>
        <div class="st-kicker">${esc(s.kicker)}</div>
        <div class="st-row">
          <div class="st-val" data-target="${esc(s.stat)}">${esc(s.stat)}</div>
          <div class="st-label">${esc(s.label)}</div>
        </div>
        <div class="st-rule"><i></i></div>
      </div>`,
    css: `
      #${id} .st-box { position:relative; padding:8px 2px 14px; }
      #${id} .st-dots { position:absolute; inset:-10px -20px; background:var(--dot-grid);
        background-size:var(--dot-grid-size); opacity:0; pointer-events:none; }
      #${id} .st-kicker { font-family:var(--font-mono); font-weight:var(--wt-bold);
        font-size:19px; letter-spacing:var(--track-eyebrow); text-transform:uppercase;
        color:rgba(255,255,255,0.62); margin-bottom:6px; }
      #${id} .st-row { display:flex; align-items:baseline; gap:26px; }
      #${id} .st-val { font-family:var(--font-display); font-weight:var(--wt-black);
        font-size:104px; line-height:0.95; letter-spacing:-0.01em; color:var(--lime);
        text-shadow:0 0 42px rgba(var(--lime-rgb),0.32), 0 4px 0 rgba(0,0,0,0.5); }
      #${id} .st-label { font-family:var(--font-display); font-weight:var(--wt-heavy);
        font-size:36px; letter-spacing:0.03em; text-transform:uppercase; color:var(--white);
        text-shadow:0 3px 0 rgba(0,0,0,0.55); }
      #${id} .st-label .ch { display:inline-block; }
      #${id} .st-rule { margin-top:14px; height:4px; width:100%;
        background:rgba(255,255,255,0.14); border-radius:2px; overflow:hidden; }
      #${id} .st-rule i { display:block; height:100%; width:100%; background:var(--lime);
        transform-origin:left center; }`,
    js: `
      splitChars(q(".st-label"));
      tl.fromTo(root+" .st-dots", { opacity:0 }, { opacity:1, duration:0.3,
                ease:"power2.out" }, 0)
        .to(root+" .st-dots", { opacity:0, duration:1.1, ease:"sine.inOut" }, 0.5)
        .from(root+" .st-kicker", { autoAlpha:0, x:-20, duration:0.38, ease:"expo.out" }, 0.05)
        .fromTo(root+" .st-val", { autoAlpha:0, y:34, filter:"blur(14px)" },
                { autoAlpha:1, y:0, filter:"blur(0px)", duration:0.55, ease:"expo.out" }, 0.2)
        .from(root+" .st-label .ch", { autoAlpha:0, duration:0.02, stagger:0.026 }, 0.6)
        .fromTo(root+" .st-rule i", { scaleX:0 }, { scaleX:1, duration:0.9, ease:"expo.out" }, 0.3);
      countUp(q(".st-val"), tl, 0.2, 0.9);`,
  }),

  /* 04 · STEPS — three columns of the pipeline. Each column rises with a lime
     numeral popping first, then flips grey to white as the next lands. */
  steps: (id, s) => ({
    dom: `
      <div class="bandbox sp-box">
        <div class="sp-kicker">${esc(s.kicker)}</div>
        <div class="sp-row">
          ${["s1", "s2", "s3"].map((k, i) => s[k] ? `
          <div class="sp-item">
            <div class="sp-num">0${i + 1}</div>
            <div class="sp-txt">${esc(s[k])}</div>
          </div>` : "").join("")}
        </div>
      </div>`,
    css: `
      #${id} .sp-box { padding:4px 2px; }
      #${id} .sp-kicker { font-family:var(--font-mono); font-weight:var(--wt-bold);
        font-size:19px; letter-spacing:var(--track-eyebrow); text-transform:uppercase;
        color:var(--lime); margin-bottom:16px; }
      #${id} .sp-row { display:flex; gap:26px; align-items:stretch; }
      #${id} .sp-item { flex:1; display:flex; align-items:center; gap:16px;
        background:rgba(25,35,42,0.90); border:1px solid rgba(255,255,255,0.13);
        border-radius:var(--radius); padding:20px 24px;
        box-shadow:0 20px 46px rgba(0,0,0,0.44); }
      #${id} .sp-num { flex:none; font-family:var(--font-mono); font-weight:var(--wt-bold);
        font-size:26px; color:var(--lime); }
      #${id} .sp-txt { font-family:var(--font-display); font-weight:var(--wt-heavy);
        font-size:29px; line-height:1.12; letter-spacing:0.01em; text-transform:uppercase;
        color:var(--grey-pre); }`,
    js: `
      const items = qa(".sp-item");
      tl.from(root+" .sp-kicker", { autoAlpha:0, x:-20, duration:0.38, ease:"expo.out" }, 0);
      items.forEach((el, i) => {
        const at = 0.2 + i * 0.26;
        tl.from(el, { autoAlpha:0, y:44, duration:0.5, ease:"expo.out" }, at)
          .from(el.querySelector(".sp-num"), { scale:0.2, autoAlpha:0, duration:0.4,
                ease:"back.out(2.4)" }, at + 0.14)
          .to(el.querySelector(".sp-txt"), { color:"var(--white)", duration:0.24,
                ease:"power2.inOut" }, at + 0.42);
      });`,
  }),

  /* 05 · LIST — a horizontal chip row. Chips pop in sequence; each flips lime
     the moment the next one arrives, so the eye is walked along the row. */
  list: (id, s) => {
    const items = ["i1", "i2", "i3", "i4"].map((k) => s[k]).filter(Boolean);
    return {
      dom: `
      <div class="bandbox ls-box">
        <div class="ls-row">
          ${items.map((t, i) => `
          <div class="ls-chip"><span class="ls-n">${String(i + 1).padStart(2, "0")}</span><span class="ls-t">${esc(t)}</span></div>`).join("")}
        </div>
      </div>`,
      css: `
      #${id} .ls-row { display:flex; flex-wrap:wrap; gap:18px; align-items:center; }
      #${id} .ls-chip { display:inline-flex; align-items:center; gap:13px;
        background:rgba(25,35,42,0.90); border:1px solid rgba(255,255,255,0.13);
        border-radius:100px; padding:16px 28px 16px 20px;
        box-shadow:0 18px 42px rgba(0,0,0,0.44); }
      #${id} .ls-n { font-family:var(--font-mono); font-weight:var(--wt-bold);
        font-size:18px; color:var(--lime); }
      #${id} .ls-t { font-family:var(--font-display); font-weight:var(--wt-heavy);
        font-size:28px; letter-spacing:0.02em; text-transform:uppercase;
        color:var(--grey-pre); white-space:nowrap; }`,
      js: `
      const chips = qa(".ls-chip");
      chips.forEach((el, i) => {
        const at = i * 0.22;
        tl.from(el, { autoAlpha:0, y:30, scale:0.9, duration:0.46, ease:"back.out(1.7)" }, at)
          .to(el.querySelector(".ls-t"), { color:LIME, duration:0.22,
                ease:"power2.inOut" }, at + 0.34);
      });`,
    };
  },

  /* 06 · PROMPT — the mono command bar. Wipes open, a caret blinks, the prompt
     types itself in, the lime dot pulses. Used for every prompt he types. */
  prompt: (id, s) => ({
    dom: `
      <div class="bandbox pr-box">
        <div class="pr-head"><span class="pr-dot"></span><span class="pr-tag">${esc(s.sub)}</span></div>
        <div class="pr-line"><span class="pr-caret">&gt;</span><span class="pr-wrap"><span class="pr-ghost">${esc(s.title)}</span><span class="pr-txt" data-full="${esc(s.title).replace(/"/g, "&quot;")}"></span></span></div>
      </div>`,
    css: `
      #${id} .pr-box { display:inline-block; max-width:100%;
        background:rgba(2,6,15,0.90); border:1px solid rgba(var(--lime-rgb),0.34);
        border-radius:var(--radius); padding:22px 30px; overflow:hidden;
        box-shadow:0 26px 60px rgba(0,0,0,0.55); transform-origin:left center; }
      #${id} .pr-head { display:flex; align-items:center; gap:11px; margin-bottom:13px; }
      #${id} .pr-dot { width:11px; height:11px; border-radius:50%; background:var(--lime);
        box-shadow:0 0 12px rgba(var(--lime-rgb),0.8); }
      #${id} .pr-tag { font-family:var(--font-mono); font-weight:var(--wt-bold);
        font-size:17px; letter-spacing:var(--track-pill); text-transform:uppercase;
        color:rgba(255,255,255,0.52); }
      #${id} .pr-line { display:flex; align-items:baseline; gap:12px; }
      #${id} .pr-caret { font-family:var(--font-mono); font-weight:var(--wt-bold);
        font-size:26px; color:var(--lime); }
      #${id} .pr-txt { font-family:var(--font-mono); font-weight:var(--wt-med);
        font-size:26px; line-height:1.3; color:var(--white); }
      #${id} .pr-cursor { display:inline-block; width:12px; height:26px; background:var(--lime);
        transform:translateY(3px); }`,
    js: `
      tl.fromTo(root+" .pr-box", { scaleX:0.02, autoAlpha:1 },
                { scaleX:1, duration:0.46, ease:"expo.out" }, 0)
        .from(root+" .pr-head", { autoAlpha:0, duration:0.3 }, 0.3)
        .fromTo(root+" .pr-dot", { scale:0.3 }, { scale:1, duration:0.4,
                ease:"back.out(2.6)" }, 0.34)
        .to(root+" .pr-cursor", { autoAlpha:0, duration:0.001, repeat:14, yoyo:true,
                repeatDelay:0.26 }, 0.4);
      typeOn(q(".pr-txt"), tl, 0.5, 1.25);`,
  }),

  /* 07 · PILL — the compact den pill. Slides in from the left with a small
     overshoot, lime dot pulses once, the role fades in underneath. */
  pill: (id, s) => ({
    dom: `
      <div class="bandbox pl-box">
        <span class="pl-dot"></span>
        <span class="pl-text">
          <span class="pl-name">${esc(s.name)}</span>
          <span class="pl-role">${esc(s.role)}</span>
        </span>
      </div>`,
    css: `
      #${id} .pl-box { display:inline-flex; align-items:center; gap:18px;
        background:rgba(25,35,42,0.92); border:1px solid rgba(255,255,255,0.14);
        border-radius:100px; padding:18px 38px 18px 26px;
        box-shadow:0 20px 46px rgba(0,0,0,0.48); }
      #${id} .pl-dot { flex:none; width:14px; height:14px; border-radius:50%;
        background:var(--lime); box-shadow:0 0 14px rgba(var(--lime-rgb),0.75); }
      #${id} .pl-text { display:flex; flex-direction:column; gap:4px; }
      #${id} .pl-name { font-family:var(--font-mono); font-weight:var(--wt-bold);
        font-size:27px; letter-spacing:0.06em; text-transform:uppercase; color:var(--white); }
      #${id} .pl-role { font-family:var(--font-body); font-weight:var(--wt-med);
        font-size:18px; letter-spacing:0.14em; text-transform:uppercase;
        color:rgba(255,255,255,0.56); }`,
    js: `
      tl.from(root+" .pl-box", { autoAlpha:0, x:-70, duration:0.5, ease:"back.out(1.5)" }, 0)
        .fromTo(root+" .pl-dot", { scale:0.35 }, { scale:1, duration:0.42,
                ease:"back.out(2.6)" }, 0.24)
        .to(root+" .pl-dot", { boxShadow:"0 0 30px rgba(214,253,3,0.95)", duration:0.3,
                yoyo:true, repeat:1, ease:"sine.inOut" }, 0.42)
        .from(root+" .pl-role", { autoAlpha:0, y:8, duration:0.34, ease:"expo.out" }, 0.4);`,
  }),

  /* 08 · SLAM — the punch. Characters slam up out of blur with an overshoot,
     then a lime rule snaps across underneath them. */
  slam: (id, s) => ({
    dom: `
      <div class="bandbox sl-box">
        <div class="sl-text">${esc(s.text)}</div>
        <div class="sl-rule"></div>
      </div>`,
    css: `
      #${id} .sl-box { display:inline-block; padding:2px; }
      #${id} .sl-text { font-family:var(--font-display); font-weight:var(--wt-black);
        font-size:72px; line-height:1; letter-spacing:var(--track-caps);
        text-transform:uppercase; color:var(--lime); white-space:nowrap;
        text-shadow:0 4px 0 rgba(0,0,0,0.6), 0 16px 34px rgba(0,0,0,0.55); }
      #${id} .sl-text .ch { display:inline-block; }
      #${id} .sl-rule { height:6px; width:100%; background:var(--lime); margin-top:14px;
        transform-origin:left center; box-shadow:0 0 18px rgba(var(--lime-rgb),0.5); }`,
    js: `
      splitChars(q(".sl-text"));
      tl.fromTo(root+" .sl-text .ch",
                { yPercent:70, autoAlpha:0, filter:"blur(10px)" },
                { yPercent:0, autoAlpha:1, filter:"blur(0px)", duration:0.44,
                  ease:"back.out(2.1)", stagger:0.022 }, 0)
        .fromTo(root+" .sl-rule", { scaleX:0 }, { scaleX:1, duration:0.42,
                ease:"expo.out" }, 0.42);`,
  }),

  /* 09 · KINETIC — two caps lines shearing in from the left behind a motion
     blur, line 1 flipping lime as line 2 lands. The in-room voice. */
  kinetic: (id, s) => ({
    dom: `
      <div class="bandbox kn-box">
        <div class="kn-l1">${esc(s.line1)}</div>
        ${s.line2 ? `<div class="kn-l2">${esc(s.line2)}</div>` : ""}
      </div>`,
    css: `
      #${id} .kn-box { display:inline-block; transform:var(--kinetic-tilt-l);
        transform-origin:left bottom; }
      #${id} .kn-l1, #${id} .kn-l2 { font-family:var(--font-display);
        font-weight:var(--wt-black); font-size:62px; line-height:1.04;
        letter-spacing:var(--track-caps); text-transform:uppercase;
        text-shadow:var(--kinetic-shadow); white-space:nowrap; }
      #${id} .kn-l1 { color:var(--grey-pre); }
      #${id} .kn-l2 { color:var(--white); }`,
    js: `
      tl.fromTo(root+" .kn-l1", { x:-90, skewX:14, autoAlpha:0, filter:"blur(12px)" },
                { x:0, skewX:0, autoAlpha:1, filter:"blur(0px)", duration:0.52,
                  ease:"expo.out" }, 0);
      if (q(".kn-l2")) {
        tl.fromTo(root+" .kn-l2", { x:-90, skewX:14, autoAlpha:0, filter:"blur(12px)" },
                  { x:0, skewX:0, autoAlpha:1, filter:"blur(0px)", duration:0.52,
                    ease:"expo.out" }, 0.3)
          .to(root+" .kn-l1", { color:LIME, duration:0.22, ease:"power2.inOut" }, 0.52);
      } else {
        tl.to(root+" .kn-l1", { color:LIME, duration:0.22, ease:"power2.inOut" }, 0.5);
      }`,
  }),
};

// ---------------------------------------------------------------------------
// Assemble
// ---------------------------------------------------------------------------
const css = [];
const dom = [];
const js = [];
const master = [];
const counts = {};

plan.beats.forEach((b, n) => {
  const id = `band${String(n + 1).padStart(3, "0")}`;
  const make = BANDS[b.type];
  if (!make) throw new Error(`beat ${n + 1}: unknown band type "${b.type}"`);
  const built = make(id, b.slots);
  counts[b.type] = (counts[b.type] || 0) + 1;

  css.push(`/* ${id} · ${b.type} */${built.css}`);
  dom.push(
    `    <!-- ${id} · ${b.type} @ ${b.start}s -->\n` +
      `    <div id="${id}" class="band clip" data-start="${b.start}" ` +
      `data-duration="${b.duration}" data-track-index="${b.track}">${built.dom}\n    </div>`
  );

  // Each card script is IIFE-wrapped: classic <script> blocks share one global
  // scope, so bare top-level `const root` would collide across beats.
  js.push(`  <script>
(function () {
  const root = "#${id}";
  const q  = (s) => document.querySelector(root + " " + s);
  const qa = (s) => [...document.querySelectorAll(root + " " + s)];
  const LIME = getComputedStyle(document.documentElement).getPropertyValue("--lime").trim();
  const tl = gsap.timeline();
${built.js}
  /* exit: mirror the entrance, faster — slide down and out */
  tl.to(root + " .bandbox", { y: 26, autoAlpha: 0, duration: 0.3, ease: "power2.in" },
        Math.max(1.6, ${b.duration} - 0.36));
  tl.set({}, {}, ${b.duration});
  window.__bandTimelines["${id}"] = tl;
})();
  </script>`);

  const end = b.start + b.duration;
  master.push(
    `  MT.fromTo("#${id}", { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" }, ${b.start});\n` +
      `  MT.add(window.__bandTimelines["${id}"], ${b.start});\n` +
      `  MT.set("#${id}", { opacity: 0 }, ${end});`
  );
});

const page = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
${TOKENS}

    html, body { margin: 0; background: #000; }
    #${SLUG} { position: absolute; inset: 0; width: ${W}px; height: ${H}px; overflow: hidden; }

    #video-stage { position: absolute; inset: 0; }
    #video-stage video { width: 100%; height: 100%; object-fit: cover; display: block; }

    /* Speaker PIP — bottom right, above everything so the face is never covered. */
    #pip-frame {
      position: absolute; z-index: 30;
      right: ${PIP.margin}px; bottom: ${PIP.margin}px;
      width: ${PIP.size}px; height: ${PIP.size}px;
      border-radius: ${PIP.radius}px; overflow: hidden;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.10);
    }
    #pip-frame video { width: 100%; height: 100%; object-fit: cover; display: block; }

    /* THE BAND — every graphic lives here and nowhere else. Ends 56px short of
       the PIP, so the screen recording's working area is never covered. */
    .band {
      position: absolute; z-index: 10; opacity: 0;
      left: ${BAND_LEFT}px; bottom: ${BAND_BOTTOM}px; width: ${BAND_W}px;
    }
    .band .bandbox { will-change: transform, opacity; }

${css.join("\n")}
  </style>
</head>
<body>
  <div id="${SLUG}" data-composition-id="${SLUG}" data-start="0" data-width="${W}" data-height="${H}">
    <div id="video-stage">
      <video id="bg-video" muted data-start="0" data-duration="${TOTAL}" data-track-index="0" src="${plan.stage.bg}"></video>
      <audio id="bg-audio" data-start="0" data-duration="${TOTAL}" data-track-index="1" src="${plan.stage.audio}"></audio>
    </div>

${dom.join("\n\n")}

    <div id="pip-frame">
      <video id="pip-video" muted data-start="0" data-duration="${TOTAL}" data-track-index="2" src="${PIP.src}"></video>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <script>
    window.__bandTimelines = {};

    /* split an element into per-character spans (spaces preserved) */
    function splitChars(el) {
      if (!el) return;
      const text = el.textContent;
      el.textContent = "";
      for (const ch of text) {
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch === " " ? "\\u00A0" : ch;
        el.appendChild(s);
      }
    }

    /* split into words, each in an overflow-hidden mask so they can rise out of
       nothing. <em> children keep an .em marker for the lime accent flip. */
    function splitWordsMasked(el) {
      if (!el) return;
      const parts = [];
      el.childNodes.forEach((n) => {
        const em = n.nodeType === 1 && n.tagName === "EM";
        (n.textContent || "").split(/\\s+/).filter(Boolean).forEach((w) => parts.push({ w, em }));
      });
      el.textContent = "";
      parts.forEach(({ w, em }, i) => {
        const mask = document.createElement("span");
        mask.className = "wmask";
        const word = document.createElement("span");
        word.className = "w" + (em ? " em" : "");
        word.textContent = w;
        mask.appendChild(word);
        el.appendChild(mask);
        if (i < parts.length - 1) el.appendChild(document.createTextNode(" "));
      });
    }

    /* type the element's data-full in over the given duration, whatever its length */
    function typeOn(el, tl, at, dur) {
      if (!el) return;
      const full = el.getAttribute("data-full") || "";
      const state = { n: 0 };
      tl.to(state, {
        n: full.length, duration: dur, ease: "none",
        onUpdate: () => { el.textContent = full.slice(0, Math.round(state.n)); },
      }, at);
    }

    /* count a numeric stat up; non-numeric values (like "3:35") just hold */
    function countUp(el, tl, at, dur) {
      if (!el) return;
      const raw = el.getAttribute("data-target") || "";
      const num = Number(raw.replace(/,/g, ""));
      if (!isFinite(num) || raw.trim() === "") return;
      const grouped = raw.includes(",");
      const state = { v: 0 };
      tl.to(state, {
        v: num, duration: dur, ease: "power2.out",
        onUpdate: () => {
          const v = Math.round(state.v);
          el.textContent = grouped ? v.toLocaleString("en-US") : String(v);
        },
      }, at);
    }
  </script>

${js.join("\n")}

  <script>
    window.__timelines = window.__timelines || {};
    const MT = gsap.timeline({ paused: true });
${master.join("\n")}
    MT.set({}, {}, ${TOTAL});
    window.__timelines["${SLUG}"] = MT;
  </script>
</body>
</html>
`;

writeFileSync(OUT, page);
console.log(`assembled ${plan.beats.length} band beats → ${OUT}`);
console.log(`  band box: left ${BAND_LEFT} · bottom ${BAND_BOTTOM} · width ${BAND_W} (clears PIP by 56px)`);
console.log(`  treatments: ${Object.entries(counts).map(([k, v]) => `${k}×${v}`).join(", ")}`);
