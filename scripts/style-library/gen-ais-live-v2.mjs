#!/usr/bin/env node
// Generate style-library/11-ais-live-v2 cards from a shared command-deck shell.
// v2 upgrades over 03-ais-live:
//   - shared ICON vocabulary (stroke line icons, pathLength=100 draw-on)
//   - liquid-glass chips + sheen sweeps
//   - diagram cards (ladder / versus / growth-lines / hub / timeline)
//   - <br>-aware + <em>-nowrap word splitting (accent phrases never line-break)
//   - SELF-SCOPING cards: dash comp-ids so every CSS rule is #id-prefixed and
//     every query goes through ROOT — no global-selector collisions when inlined
// Usage: node scripts/style-library/gen-ais-live-v2.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../../style-library/11-ais-live-v2");
mkdirSync(join(OUT, "cards/tier1"), { recursive: true });
mkdirSync(join(OUT, "cards/tier2"), { recursive: true });

/* ============================ ICONS =======================================
   24x24 stroke line art. Injected at runtime into [data-icon] elements;
   every shape gets pathLength="100" so stroke-dashoffset 100->0 draws it. */
const ICONS = {
  compass:   `<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 5.8-5.8 2.2 2.2-5.8z"/>`,
  doc:       `<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>`,
  megaphone: `<path d="M4 10v4l3 .6V9.4z"/><path d="M7 9.4L19 5v14l-12-4.6"/><path d="M9.5 15.4l1.2 4.1h2.4l-1.2-4.4"/>`,
  target:    `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>`,
  gear:      `<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.8M12 18.7v2.8M2.5 12h2.8M18.7 12h2.8M5.3 5.3l2 2M16.7 16.7l2 2M18.7 5.3l-2 2M7.3 16.7l-2 2"/>`,
  users:     `<circle cx="9" cy="8" r="3.4"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16.6 14.6c2.5.5 4.4 2.7 4.4 5.4"/>`,
  userplus:  `<circle cx="10" cy="8" r="3.4"/><path d="M4 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M18.5 5.5v6M15.5 8.5h6"/>`,
  mail:      `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7.5l9 6 9-6"/>`,
  bulb:      `<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0012 3z"/>`,
  clock:     `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>`,
  briefcase: `<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2"/><path d="M3 13h18"/>`,
  building:  `<rect x="5" y="4" width="14" height="17"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2"/><path d="M10.5 21v-3h3v3"/>`,
  gradcap:   `<path d="M2 9l10-5 10 5-10 5z"/><path d="M6.5 11.5V16c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3v-4.5"/><path d="M22 9v5"/>`,
  code:      `<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>`,
  scales:    `<path d="M12 4v15M8.5 19h7M3.5 7h17"/><path d="M6 7l-2.4 5.2a2.9 2.9 0 004.8 0L6 7z"/><path d="M18 7l-2.4 5.2a2.9 2.9 0 004.8 0L18 7z"/>`,
  heart:     `<path d="M12 20s-7-4.6-9-9a4.8 4.8 0 018.6-3.4l.4.4.4-.4A4.8 4.8 0 0121 11c-2 4.4-9 9-9 9z"/>`,
  spark:     `<path d="M12 3l2 6 6 3-6 3-2 6-2-6-6-3 6-3z"/>`,
  flag:      `<path d="M5 21V4"/><path d="M5 4c4-2 7 2 12 0v9c-5 2-8-2-12 0"/>`,
  search:    `<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>`,
  pen:       `<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19z"/><path d="M14.5 6.5l3 3"/>`,
  repeat:    `<path d="M4 12a8 8 0 0113.6-5.7L20 8.5"/><path d="M20 3.5v5h-5"/><path d="M20 12a8 8 0 01-13.6 5.7L4 15.5"/><path d="M4 20.5v-5h5"/>`,
  chartup:   `<path d="M3 17.5l6-6 4 4 8-8"/><path d="M15 7.5h6v6"/>`,
  rocket:    `<path d="M12 2.6c2.5 1.9 3.9 4.8 3.9 7.9 0 1.9-.5 3.7-1.4 5.1H9.5c-.9-1.4-1.4-3.2-1.4-5.1 0-3.1 1.4-6 3.9-7.9z"/><circle cx="12" cy="9.7" r="1.8"/><path d="M9.5 15.6L7.6 19.2M14.5 15.6l1.9 3.6M12 16.4v3.8"/>`,
  shield:    `<path d="M12 3l7 2.6v5.2c0 4.4-2.9 7.6-7 10.2-4.1-2.6-7-5.8-7-10.2V5.6z"/><path d="M9 12.2l2.2 2.2 4.3-4.6"/>`,
  bot:       `<rect x="5" y="8" width="14" height="10" rx="3"/><path d="M12 8V5.2"/><circle cx="12" cy="3.8" r="1.2"/><circle cx="9.2" cy="12.5" r="1"/><circle cx="14.8" cy="12.5" r="1"/><path d="M9.5 15.5h5"/>`,
  chip:      `<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/>`,
  workflow:  `<circle cx="5.5" cy="6" r="2.4"/><circle cx="18.5" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M7.9 6h8.2M6.6 8.2l4.2 7.6M17.4 8.2l-4.2 7.6"/>`,
  layers:    `<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13.5l9 5 9-5"/>`,
  calendar:  `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>`,
  ticket:    `<path d="M3 9V7a2 2 0 012-2h14a2 2 0 012 2v2a3 3 0 000 6v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a3 3 0 000-6z"/><path d="M14 8v1.6M14 11.7v1.6M14 15.4V17"/>`,
  check:     `<path d="M4 12.5l5.5 5.5L20 6.5"/>`,
  undo:      `<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 016 6v1.5"/>`,
  funnel:    `<path d="M3 4h18l-7 8v7l-4-2v-5z"/>`,
  bolt:      `<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>`,
  link:      `<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.5-1.5"/>`,
  globe:     `<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21M12 3c-2.5 2.6-3.8 5.7-3.8 9s1.3 6.4 3.8 9"/>`,
  down:      `<path d="M12 4v15M6 13.5l6 6 6-6"/>`,
  up:        `<path d="M12 20V5M5.5 10.5L12 4l6.5 6.5"/>`,
  dollar:    `<path d="M12 3v18"/><path d="M16.5 7c-.8-1.5-2.4-2.2-4.5-2.2-2.5 0-4.5 1.2-4.5 3.3 0 4.5 9 2.7 9 7.2 0 2.1-2 3.3-4.5 3.3-2.1 0-3.9-.8-4.7-2.3"/>`,
  key:       `<circle cx="8" cy="14" r="4.5"/><path d="M11.5 10.5L20 2M15 7l3 3M18 4l2.5 2.5"/>`,
};
const ICONS_JS = "const ICONS = " + JSON.stringify(ICONS) + ";";

/* deterministic sparkle positions (harmonic hash, no Math.random) */
const sparks = Array.from({ length: 12 }, (_, i) => {
  const x = 6 + 88 * Math.abs(Math.sin(i * 1.7 + 0.4));
  const y = 8 + 80 * Math.abs(Math.cos(i * 2.3 + 1.1));
  return `<i class="spark" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%"></i>`;
}).join("");

/* ============================ SHELL ======================================= */
const shellCss = (cid) => `
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#000;color:var(--text);font-family:var(--font-body);}
      #${cid}{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;background:var(--onyx);isolation:isolate;}
      #${cid} .bg{position:absolute;inset:0;overflow:hidden;will-change:transform;}
      #${cid} .depth{position:absolute;left:-40%;right:-40%;height:78%;background-image:var(--grid-lines);will-change:background-position;}
      #${cid} .grid-floor{bottom:-14%;transform:perspective(680px) rotateX(66deg);transform-origin:50% 100%;
        -webkit-mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);
        mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);}
      #${cid} .grid-ceiling{top:-14%;transform:perspective(680px) rotateX(-66deg);transform-origin:50% 0%;opacity:.6;
        -webkit-mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);
        mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);}
      #${cid} .beam{position:absolute;top:-20%;left:50%;width:1400px;height:1200px;margin-left:-700px;background:var(--beam);filter:blur(30px);opacity:.7;will-change:transform,opacity;}
      #${cid} .glow{position:absolute;border-radius:50%;will-change:transform;}
      #${cid} .glow.blue{top:-160px;left:50%;width:760px;height:760px;margin-left:-380px;background:var(--blue);filter:blur(155px);opacity:.18;}
      #${cid} .glow.coral{bottom:-220px;right:-140px;width:620px;height:620px;background:var(--coral);filter:blur(165px);opacity:.10;}
      #${cid} .spark{position:absolute;width:14px;height:14px;opacity:.25;will-change:opacity;}
      #${cid} .spark::before{content:"";position:absolute;left:6px;top:0;width:2px;height:14px;background:rgba(var(--blue-rgb),.8);}
      #${cid} .spark::after{content:"";position:absolute;left:0;top:6px;width:14px;height:2px;background:rgba(var(--blue-rgb),.8);}
      #${cid} .vignette{position:absolute;inset:0;pointer-events:none;background:var(--vignette);will-change:opacity;}
      #${cid} .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:screen;background-image:var(--tex-grain);}

      #${cid} .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:34px;padding:var(--pad-y) var(--pad-x);text-align:center;will-change:transform,opacity;}

      #${cid} .eyebrow{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:var(--size-label);letter-spacing:var(--track-eyebrow);
        text-transform:uppercase;color:var(--blue);text-shadow:var(--glow-eyebrow);will-change:transform,opacity;}
      #${cid} .ln{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:var(--size-display);
        line-height:1.14;letter-spacing:var(--track-tight);max-width:1620px;white-space:nowrap;}
      #${cid} .ln.hero{font-size:var(--size-hero);}
      #${cid} .ln.panel{font-size:var(--size-panel);}
      #${cid} .ln .wd{display:inline-block;padding:.08em .13em .24em;will-change:transform,opacity;
        background:var(--grad-chrome);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-chrome);}
      #${cid} .ln .wd.ac{background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-blue);}
      #${cid} .ln .nw{white-space:nowrap;display:inline-block;}
      #${cid} .ln .lnbr{display:block;height:0;}
      #${cid} .sub{font-family:var(--font-body);font-weight:var(--wt-light);font-style:italic;font-size:var(--size-sub);
        line-height:1.25;color:var(--text-dim);max-width:1440px;will-change:transform,opacity;}

      /* icon chips */
      #${cid} .chip{position:relative;display:flex;align-items:center;justify-content:center;flex:0 0 auto;
        background-color:rgba(10,22,35,.92);background-image:var(--chip-glass);border:1px solid var(--chip-border);border-radius:var(--radius-chip);
        box-shadow:var(--chip-highlight),var(--chip-shadow),var(--chip-glow);overflow:hidden;will-change:transform,opacity;}
      #${cid} .chip .sheen{position:absolute;top:-30%;bottom:-30%;left:0;width:34%;pointer-events:none;
        background:linear-gradient(105deg,transparent,rgba(255,255,255,.15),transparent);transform:translateX(-160%) rotate(8deg);}
      #${cid} .ic{display:block;}
      #${cid} .ic svg{width:100%;height:100%;display:block;color:var(--icon-color);filter:var(--icon-halo);
        fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;}
      #${cid} .ic svg *{stroke-dasharray:100 100;}

      /* persistent corner mark */
      #${cid} .backdrop-mark{position:absolute;right:72px;bottom:60px;display:inline-flex;z-index:6;}
      #${cid} .mark{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);letter-spacing:var(--track-tight);
        line-height:.9;font-size:92px;display:inline-flex;align-items:baseline;position:relative;}
      #${cid} .mark.big{font-size:262px;}
      #${cid} .mark .ais{color:var(--white);}
      #${cid} .mark .gap{display:inline-block;width:.08em;}
      #${cid} .live{position:relative;color:var(--blue);text-shadow:0 0 60px rgba(var(--blue-rgb),.55);padding-right:.28em;}
      #${cid} .dot{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:var(--red-live);box-shadow:0 0 .7em var(--red-live),0 0 .25em var(--red-live);}
      #${cid} .ring{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:rgba(var(--red-rgb),.55);opacity:0;transform-origin:50% 50%;pointer-events:none;}
      #${cid} .plus{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);letter-spacing:var(--track-tight);
        display:inline-block;color:var(--white);text-shadow:0 0 34px rgba(255,255,255,.28);}
      #${cid} .plus .p{color:var(--white);text-shadow:0 0 34px rgba(255,255,255,.28);}
`;

const shellBg = `
      <div class="bg">
        <div class="depth grid-ceiling"></div>
        <div class="depth grid-floor"></div>
        <div class="beam"></div>
        <div class="glow blue"></div>
        <div class="glow coral"></div>
        ${sparks}
      </div>
      <div class="vignette"></div>
      <div class="grain"></div>
      <div class="backdrop-mark"><span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>`;

/* shared runtime helpers — self-scoping via ROOT. All element refs, no global
   selectors, so build-beats inlining needs zero script rewriting. */
const helpersJs = (cid, dur) => `
      window.__timelines = window.__timelines || {};
      const ROOT = document.getElementById("${cid}");
      const $  = (s) => ROOT.querySelectorAll(s);
      const $1 = (s) => ROOT.querySelector(s);
      const DUR = ${dur};
      const tl = gsap.timeline({ paused: true });

      ${ICONS_JS}
      $("[data-icon]").forEach(el => {
        const n = el.getAttribute("data-icon");
        if (!n || !ICONS[n]) { el.style.display = "none"; return; }
        el.innerHTML = "<svg viewBox='0 0 24 24'>" + ICONS[n] + "</svg>";
        el.querySelectorAll("path,circle,rect,line,polyline").forEach(p => p.setAttribute("pathLength", "100"));
      });

      /* prune baked spare rows the fill left empty (no text -> not a real row) */
      [".agrow", ".crow", ".vrow", ".chipwrap", ".popwrap"].forEach(sel =>
        $(sel).forEach(r => { if (!r.textContent.trim()) r.remove(); }));

      /* <br>-aware, <em>-nowrap word split: accent phrases never break lines */
      function splitWords(el){
        const out = document.createDocumentFragment();
        const mk = (w, ac) => { const s = document.createElement("span"); s.className = "wd" + (ac ? " ac" : ""); s.textContent = w; return s; };
        Array.from(el.childNodes).forEach(node => {
          if (node.nodeType === 1 && node.tagName === "BR") { const b = document.createElement("span"); b.className = "lnbr"; out.appendChild(b); return; }
          const em = node.nodeType === 1 && node.tagName === "EM";
          const ws = (node.textContent || "").trim().split(/\\s+/).filter(Boolean);
          if (!ws.length) return;
          if (em) { const g = document.createElement("span"); g.className = "nw"; ws.forEach(w => g.appendChild(mk(w, true))); out.appendChild(g); return; }
          ws.forEach(w => out.appendChild(mk(w, false)));
        });
        el.textContent = ""; el.appendChild(out);
      }
      $(".ln[data-split]").forEach(splitWords);

      /* one-line discipline: .ln never soft-wraps (nowrap; <br> makes lines).
         If the widest line overflows its box, shrink the font to fit. Runs
         again on raf + fonts.ready (guarded — never await it) for late metrics. */
      const fitLines = () => $(".ln[data-split]").forEach(ln => {
        const max = ln.clientWidth || 1600;
        const w = ln.scrollWidth;
        if (w > max + 2) ln.style.fontSize = (parseFloat(getComputedStyle(ln).fontSize) * max / w * 0.97) + "px";
      });
      fitLines();
      try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLines); } catch (e) {}

      const drop   = (sel, at, d) => tl.fromTo($(sel), {autoAlpha:0, y:-16}, {autoAlpha:1, y:0, duration:d||.5, ease:"power2.out"}, at);
      const rise   = (sel, at, d) => tl.fromTo($(sel), {autoAlpha:0, y:26},  {autoAlpha:1, y:0, duration:d||.55, ease:"power2.out"}, at);
      const words  = (sel, at)    => tl.fromTo($(sel), {autoAlpha:0, yPercent:110, scale:.92},
        {autoAlpha:1, yPercent:0, scale:1, duration:.55, ease:"expo.out", stagger:.075, transformOrigin:"50% 100%"}, at);
      const pop    = (sel, at, d) => tl.fromTo($(sel), {autoAlpha:0, scale:.55}, {autoAlpha:1, scale:1, duration:d||.62, ease:"back.out(1.6)", transformOrigin:"50% 55%"}, at);
      const slideX = (sel, at, step, from) => tl.fromTo($(sel), {autoAlpha:0, x:from??-46, filter:"blur(6px)"},
        {autoAlpha:1, x:0, filter:"blur(0px)", duration:.5, ease:"power2.out", stagger:step??.12}, at);
      const chipPop = (sel, at, step) => tl.fromTo($(sel), {autoAlpha:0, y:30, scale:.55},
        {autoAlpha:1, y:0, scale:1, duration:.58, ease:"back.out(1.7)", stagger:step??.13, transformOrigin:"50% 85%"}, at);
      const drawIn = (sel, at, step) => tl.fromTo($(sel + " .ic svg *"), {strokeDashoffset:100},
        {strokeDashoffset:0, duration:.6, ease:"power2.inOut", stagger:step??.05}, at);
      const sheens = (sel, at, step) => tl.fromTo($(sel + " .sheen"), {xPercent:-160},
        {xPercent:560, duration:.55, ease:"power2.inOut", stagger:step??.13, immediateRender:false}, at);
      const markPop = (sel, at) => tl.fromTo($(sel), {autoAlpha:0, scale:.6, filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1, scale:1, filter:"blur(0px) brightness(1)", duration:.8, ease:"back.out(1.5)", transformOrigin:"50% 50%"}, at);
      function countUp(sel, at, target, d, suffix, prefix){
        var p = prefix || "", o = { v: 0 };
        tl.call(function(){ var el = $1(sel); if (el) el.textContent = p + "0" + (suffix || ""); }, null, at - 0.001);
        tl.to(o, { v: target, duration: d, ease: "power2.out", onUpdate: function(){
          var el = $1(sel); if (el) el.textContent = p + Math.round(o.v) + (suffix || ""); } }, at);
      }

      /* AMBIENT — camera rides the BACKGROUND ONLY; text layer never moves. */
      tl.to($(".bg"), { scale:1.06, y:-14, duration:DUR, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to($(".grid-floor"),   { backgroundPositionY:"+=330px", duration:DUR, ease:"none" }, 0);
      tl.to($(".grid-ceiling"), { backgroundPositionY:"-=330px", duration:DUR, ease:"none" }, 0);
      tl.to($(".beam"), { rotation:8, duration:DUR, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to($(".beam"), { opacity:.4, duration:DUR/6, yoyo:true, repeat:5, ease:"sine.inOut" }, 0);
      tl.to($(".glow.blue"),  { x:44, y:-24, duration:DUR, ease:"sine.inOut" }, 0);
      tl.to($(".glow.coral"), { x:-36, y:22, duration:DUR, ease:"sine.inOut" }, 0);
      /* GSAP repeats the WHOLE staggered group: 12 sparks x .21 = 2.31 spread + 1.3 = a 3.61s cycle.
         round(DUR/1.3)-1 = 7 repeats made this 28.88s, ~3x the card — the source of every
         "black tail past the video" and of the Studio scrubber overrunning the media. */
      tl.to($(".spark"), { opacity:.55, duration:1.3, yoyo:true, repeat:Math.max(0, Math.floor(DUR/3.61) - 1), ease:"sine.inOut", stagger:{each:.21, from:"random", seed:7} }, 0);
      tl.to($(".vignette"), { opacity:.9, duration:DUR/6, yoyo:true, repeat:5, ease:"sine.inOut" }, 0);
      tl.to($(".dot"), { scale:1.1, duration:.8, yoyo:true, repeat:Math.max(1, Math.round(DUR/0.8) - 1), ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo($(".ring"), { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:Math.max(1, Math.round(DUR/1.6) - 1), ease:"none" }, 0);
`;

/* bare shell for the tier2 overlay card: no bg, no mark, transparent root */
const bareHelpers = (cid, dur) => `
      window.__timelines = window.__timelines || {};
      const ROOT = document.getElementById("${cid}");
      const $  = (s) => ROOT.querySelectorAll(s);
      const $1 = (s) => ROOT.querySelector(s);
      const DUR = ${dur};
      const tl = gsap.timeline({ paused: true });
      ${ICONS_JS}
      $("[data-icon]").forEach(el => {
        const n = el.getAttribute("data-icon");
        if (!n || !ICONS[n]) { el.style.display = "none"; return; }
        el.innerHTML = "<svg viewBox='0 0 24 24'>" + ICONS[n] + "</svg>";
        el.querySelectorAll("path,circle,rect,line,polyline").forEach(p => p.setAttribute("pathLength", "100"));
      });
      [".popwrap"].forEach(sel => $(sel).forEach(r => { if (!r.textContent.trim()) r.remove(); }));
`;

function emit({ file, cid, dur, comment, css, dom, scene, bare }) {
  const html = `<!doctype html>
<!--
  AIS LIVE v2 · ${comment}
-->
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="../../tokens.css" />
    <style>
${bare ? `      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:transparent;color:var(--text);font-family:var(--font-body);}
      #${cid}{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;background:none;}
      #${cid} .chip{position:relative;display:flex;align-items:center;justify-content:center;flex:0 0 auto;
        background:var(--chip-overlay-bg);border:1px solid var(--chip-overlay-border);border-radius:var(--radius-chip);
        box-shadow:var(--chip-highlight),var(--chip-shadow),var(--chip-glow);overflow:hidden;will-change:transform,opacity;
        backdrop-filter:blur(10px) saturate(1.1);}
      #${cid} .chip .sheen{position:absolute;top:-30%;bottom:-30%;left:0;width:34%;pointer-events:none;
        background:linear-gradient(105deg,transparent,rgba(255,255,255,.16),transparent);transform:translateX(-160%) rotate(8deg);}
      #${cid} .ic{display:block;}
      #${cid} .ic svg{width:100%;height:100%;display:block;color:var(--icon-color);filter:var(--icon-halo);
        fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;}
      #${cid} .ic svg *{stroke-dasharray:100 100;}` : shellCss(cid)}
${css}
    </style>
  </head>
  <body>
    <div id="${cid}" data-composition-id="${cid}" data-start="0" data-width="1920" data-height="1080">
${bare ? "" : shellBg}
${dom}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
${bare ? bareHelpers(cid, dur) : helpersJs(cid, dur)}
      /* ---- scene ---- */
${scene}
      tl.set({}, {}, DUR);
      window.__timelines["${cid}"] = tl;
      if (location.hash.indexOf("#t=") === 0) { tl.progress(0); tl.seek(parseFloat(location.hash.slice(3)) || 0); }
    </script>
  </body>
</html>
`;
  writeFileSync(join(OUT, file), html);
  console.log("wrote", file);
}

/* =========================== CARD DEFINITIONS ============================= */
const cards = [];

/* --- 1 · thesis HERO — lockup with controlled breaks + accent underbeam --- */
cards.push({
  file: "cards/tier1/t1-thesis-hero.html", cid: "aisv2-t1-hero", dur: 10,
  comment: "tier1 · thesis · HERO — 2-line lockup; <br> controls the break; <em>phrase</em> stays on one line (nowrap) and takes the blue gradient. Optional sub.",
  css: `
      #aisv2-t1-hero .inner{gap:30px;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">START AND SCALE WITH AI</div>
        <div class="ln hero" data-split data-slot="headline">BUILD YOUR <em>AI OS</em></div>
        <div class="sub" data-slot="sub"></div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      words(".ln .wd", 0.30);
      rise(".sub", 1.15);`,
});

/* --- 2 · thesis CHROME — eyebrow/headline/sub + optional watermark icon --- */
cards.push({
  file: "cards/tier1/t1-thesis-chrome.html", cid: "aisv2-t1-chrome", dur: 10,
  comment: "tier1 · thesis · CHROME — standard takeover statement. Set data-watermark=\"<icon>\" on the root for a giant faint drawn-on icon behind the type.",
  css: `
      #aisv2-t1-chrome .watermark{position:absolute;right:6%;top:50%;width:560px;height:560px;margin-top:-280px;opacity:.14;z-index:0;will-change:transform,opacity;}
      #aisv2-t1-chrome .watermark svg{filter:drop-shadow(0 0 26px rgba(var(--blue-rgb),.5));}
      #aisv2-t1-chrome .inner{gap:32px;z-index:2;}
`,
  dom: `      <div class="watermark ic" data-icon=""></div>
        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">THE NEW ECONOMICS</div>
        <div class="ln" data-split data-slot="headline">REVENUE GROWS FASTER THAN THE <em>TEAM</em></div>
        <div class="sub" data-slot="sub">Not payroll. Not headcount.</div>
        </div>`,
  scene: `      const wm = ROOT.getAttribute("data-watermark") || "";
      const wmEl = $1(".watermark");
      if (wm && ICONS[wm]) {
        wmEl.innerHTML = "<svg viewBox='0 0 24 24'>" + ICONS[wm] + "</svg>";
        wmEl.querySelectorAll("path,circle,rect,line,polyline").forEach(p => p.setAttribute("pathLength", "100"));
        wmEl.style.display = "block";
        tl.fromTo(wmEl.querySelectorAll("svg *"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:1.4, ease:"power2.inOut", stagger:.1}, 0.35);
        tl.fromTo(wmEl, {autoAlpha:0, scale:.9, rotation:-4}, {autoAlpha:.14, scale:1, rotation:0, duration:1.1, ease:"power2.out"}, 0.3);
        tl.to(wmEl, {y:-16, duration:DUR-1.4, ease:"sine.inOut"}, 1.4);
      } else { wmEl.style.display = "none"; }
      drop(".eyebrow", 0.15);
      words(".ln .wd", 0.30);
      rise(".sub", 1.0);`,
});

/* --- 3 · STAT count-up + charge meter --------------------------------- */
cards.push({
  file: "cards/tier1/t1-stat-countup.html", cid: "aisv2-t1-stat", dur: 10,
  comment: "tier1 · stat · COUNTUP — blue-gradient count-up + charging tick meter. Post-build retargets countUp(...) from the plan's stat slot.",
  css: `
      #aisv2-t1-stat .inner{gap:26px;}
      #aisv2-t1-stat .numrow{display:flex;align-items:baseline;gap:10px;will-change:transform,opacity;}
      #aisv2-t1-stat .num{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:var(--size-mega);
        letter-spacing:var(--track-num);line-height:1;padding:.02em .1em .12em;
        background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:var(--glow-num);}
      #aisv2-t1-stat .unit{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:64px;color:var(--text-dim);letter-spacing:.04em;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="kicker">OVER THE PAST 12 MONTHS</div>
        <div class="numrow"><span class="num" id="num">$420K</span><span class="unit" data-slot="unit">/MO</span></div>
        <div class="sub" data-slot="sub">FEWER THAN 10 EMPLOYEES</div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      pop(".numrow", 0.35, .7);
      countUp("#num", 0.45, 420, 1.5, "K", "$");
      rise(".sub", 1.1);`,
});

/* --- 4 · overview AGENDA-ICONS — icon chip rows ------------------------ */
cards.push({
  file: "cards/tier1/t1-agenda-icons.html", cid: "aisv2-t1-agenda", dur: 10,
  comment: "tier1 · overview · AGENDA-ICONS — rows of [glass icon chip | mono label | description]. Bakes 5 rows; post-build fills labels + data-icon and strips leftover empties.",
  css: `
      #aisv2-t1-agenda .inner{gap:30px;}
      #aisv2-t1-agenda .agenda{display:flex;flex-direction:column;gap:24px;width:max-content;max-width:1420px;}
      #aisv2-t1-agenda .agrow{display:flex;align-items:center;gap:30px;text-align:left;will-change:transform,opacity;}
      #aisv2-t1-agenda .agrow .chip{width:86px;height:86px;}
      #aisv2-t1-agenda .agrow .ic{width:52px;height:52px;}
      #aisv2-t1-agenda .agt{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:26px;color:var(--blue);
        min-width:250px;letter-spacing:.10em;text-shadow:var(--glow-eyebrow);}
      #aisv2-t1-agenda .agl{font-family:var(--font-body);font-weight:var(--wt-med);font-size:38px;color:var(--text);line-height:1.2;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">INSIDE OUR COMPANY</div>
        <div class="agenda">
          <div class="agrow"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="doc"></span></span><span class="agt">CONTENT</span><span class="agl">Ideas and expertise into finished assets</span></div>
          <div class="agrow"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="megaphone"></span></span><span class="agt">MARKETING</span><span class="agl">Research, build, test, analyze campaigns</span></div>
          <div class="agrow"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="target"></span></span><span class="agt">SALES</span><span class="agl">Prep, prospect context, momentum</span></div>
          <div class="agrow"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="gear"></span></span><span class="agt">OPS</span><span class="agl">Decisions, processes, meetings</span></div>
          <div class="agrow"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="userplus"></span></span><span class="agt">RECRUITING</span><span class="agl">Roles defined, candidates evaluated</span></div>
        </div>
        <div class="sub" data-slot="caption">Every department runs on its own AI OS</div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      /* rows honor data-at (word-synced entrances); without it, fixed stagger */
      const agrows = Array.from($(".agrow"));
      if (agrows.some(r => r.hasAttribute("data-at"))) {
        let lastAt = 0.35;
        agrows.forEach((r, i) => {
          const at = parseFloat(r.getAttribute("data-at") || (0.35 + i * 0.16));
          lastAt = Math.max(lastAt, at);
          tl.fromTo(r, {autoAlpha:0, x:-46, filter:"blur(6px)"}, {autoAlpha:1, x:0, filter:"blur(0px)", duration:.5, ease:"power2.out"}, at);
          tl.fromTo(r.querySelectorAll(".ic svg *"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.6, ease:"power2.inOut", stagger:.05}, at + 0.1);
          tl.fromTo(r.querySelectorAll(".sheen"), {xPercent:-160}, {xPercent:560, duration:.55, ease:"power2.inOut", immediateRender:false}, at + 0.55);
        });
        rise(".sub", lastAt + 1.2);
      } else {
        slideX(".agrow", 0.35, 0.16);
        drawIn(".agrow", 0.45, 0.06);
        sheens(".agrow", 0.9, 0.16);
        rise(".sub", 1.35);
      }`,
});

/* --- 5 · ICON-ROW — headline + horizontal chip row --------------------- */
cards.push({
  file: "cards/tier1/t1-icon-row.html", cid: "aisv2-t1-iconrow", dur: 10,
  comment: "tier1 · icons · ICON-ROW — statement + a row of icon chips with mono labels (wraps 2-up in side panels). Bakes 5 chips; strip empties via post-build.",
  css: `
      #aisv2-t1-iconrow .inner{gap:40px;}
      #aisv2-t1-iconrow .chips{display:flex;gap:34px;justify-content:center;flex-wrap:wrap;max-width:1500px;}
      #aisv2-t1-iconrow .chipwrap{display:flex;flex-direction:column;align-items:center;gap:16px;will-change:transform,opacity;}
      #aisv2-t1-iconrow .chipwrap .chip{width:172px;height:172px;}
      #aisv2-t1-iconrow .chipwrap .ic{width:88px;height:88px;}
      #aisv2-t1-iconrow .cl{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:var(--size-chiplabel);color:var(--text-dim);
        letter-spacing:.16em;text-transform:uppercase;text-align:center;max-width:200px;line-height:1.3;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">NO AI COMPANY REQUIRED</div>
        <div class="ln panel" data-split data-slot="headline">THE TEAM BEHIND WHAT YOU <em>SELL</em></div>
        <div class="chips">
          <div class="chipwrap"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="briefcase"></span></span><span class="cl">CONSULTING</span></div>
          <div class="chipwrap"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="building"></span></span><span class="cl">AGENCY</span></div>
          <div class="chipwrap"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="gradcap"></span></span><span class="cl">TRAINING</span></div>
          <div class="chipwrap"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="code"></span></span><span class="cl">SOFTWARE</span></div>
          <div class="chipwrap"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="spark"></span></span><span class="cl">ALMOST ANYTHING</span></div>
        </div>
        <div class="sub" data-slot="sub"></div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      words(".ln .wd", 0.28);
      chipPop(".chipwrap", 0.85, 0.14);
      drawIn(".chipwrap", 0.95, 0.05);
      sheens(".chipwrap", 1.5, 0.14);
      rise(".sub", 1.7);`,
});

/* --- 6 · VERSUS — split comparison with drawn divider ------------------ */
cards.push({
  file: "cards/tier1/t1-versus.html", cid: "aisv2-t1-versus", dur: 10,
  comment: "tier1 · diagram · VERSUS — two columns of icon rows facing off across a drawn divider + VS badge; optional verdict banner. Bakes 4 rows per side; strip empties.",
  css: `
      #aisv2-t1-versus .inner{gap:36px;}
      #aisv2-t1-versus .duel{display:flex;align-items:stretch;justify-content:center;gap:64px;}
      #aisv2-t1-versus .col{display:flex;flex-direction:column;gap:26px;align-items:center;text-align:left;}
      #aisv2-t1-versus .vlist{display:flex;flex-direction:column;gap:22px;align-items:flex-start;}
      #aisv2-t1-versus .vh{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:56px;letter-spacing:var(--track-tight);
        padding:.04em .1em .18em;background:var(--grad-chrome);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-chrome);will-change:transform,opacity;}
      #aisv2-t1-versus .col.right .vh{background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;text-shadow:var(--glow-blue);}
      #aisv2-t1-versus .vrow{display:flex;align-items:center;gap:22px;will-change:transform,opacity;}
      #aisv2-t1-versus .vrow .chip{width:66px;height:66px;border-radius:18px;}
      #aisv2-t1-versus .vrow .ic{width:38px;height:38px;}
      #aisv2-t1-versus .col.left .vrow .ic svg{color:var(--text-dim);filter:none;}
      #aisv2-t1-versus .vlabel{font-family:var(--font-body);font-weight:var(--wt-med);font-size:33px;color:var(--text);line-height:1.25;}
      #aisv2-t1-versus .col.left .vlabel{color:var(--text-dim);}
      #aisv2-t1-versus .divider{position:relative;width:92px;display:flex;align-items:center;justify-content:center;}
      #aisv2-t1-versus .vline{position:absolute;top:0;bottom:0;left:50%;margin-left:-1px;width:2px;
        background:linear-gradient(180deg,transparent,var(--line-blue) 30%,var(--line-blue) 70%,transparent);
        box-shadow:0 0 18px rgba(var(--blue-rgb),.5);transform:scaleY(0);transform-origin:50% 0%;will-change:transform;}
      #aisv2-t1-versus .vs{position:relative;z-index:2;flex:0 0 auto;font-family:var(--font-mono);font-weight:var(--wt-black);font-size:30px;color:var(--blue);
        background:var(--onyx-deep);border:1px solid var(--chip-border);border-radius:50%;width:92px;height:92px;
        display:flex;align-items:center;justify-content:center;letter-spacing:.1em;text-shadow:var(--glow-eyebrow);
        box-shadow:var(--chip-highlight),0 0 34px rgba(var(--blue-rgb),.3);will-change:transform,opacity;}
      #aisv2-t1-versus .verdict{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:var(--size-label);letter-spacing:var(--track-wide);
        text-transform:uppercase;color:var(--blue);text-shadow:var(--glow-eyebrow);will-change:transform,opacity;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">THE DIFFERENCE</div>
        <div class="duel">
          <div class="col left">
            <div class="vh" data-slot="leftTitle">AI TOOLS</div>
            <div class="vlist">
            <div class="vrow"><span class="chip"><span class="ic" data-icon="mail"></span></span><span class="vlabel">Faster emails</span></div>
            <div class="vrow"><span class="chip"><span class="ic" data-icon="doc"></span></span><span class="vlabel">Summaries</span></div>
            <div class="vrow"><span class="chip"><span class="ic" data-icon="clock"></span></span><span class="vlabel">Minutes saved</span></div>
            <div class="vrow"><span class="chip"><span class="ic" data-icon=""></span></span><span class="vlabel"></span></div>
            </div>
          </div>
          <div class="divider"><span class="vline"></span><span class="vs">VS</span></div>
          <div class="col right">
            <div class="vh" data-slot="rightTitle">AN AI OS</div>
            <div class="vlist">
            <div class="vrow"><span class="chip"><span class="ic" data-icon="layers"></span></span><span class="vlabel">All the context</span></div>
            <div class="vrow"><span class="chip"><span class="ic" data-icon="chip"></span></span><span class="vlabel">All the memory</span></div>
            <div class="vrow"><span class="chip"><span class="ic" data-icon="workflow"></span></span><span class="vlabel">Agents + workflows</span></div>
            <div class="vrow"><span class="chip"><span class="ic" data-icon=""></span></span><span class="vlabel"></span></div>
            </div>
          </div>
        </div>
        <div class="verdict" data-slot="verdict">ONE SYSTEM THAT ACTUALLY OPERATES</div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      slideX(".col.left .vh", 0.30, 0, -60);
      slideX(".col.left .vrow", 0.42, 0.12, -60);
      tl.to($(".vline"), {scaleY:1, duration:.55, ease:"power2.inOut"}, 0.5);
      pop(".vs", 0.85, .5);
      slideX(".col.right .vh", 1.0, 0, 60);
      slideX(".col.right .vrow", 1.12, 0.12, 60);
      drawIn(".col.left", 0.5, 0.05);
      drawIn(".col.right", 1.2, 0.05);
      rise(".verdict", 1.9);`,
});

/* --- 7 · LADDER — 3 ascending steps ------------------------------------ */
cards.push({
  file: "cards/tier1/t1-ladder.html", cid: "aisv2-t1-ladder", dur: 10,
  comment: "tier1 · diagram · LADDER — three uniform glass steps read top-down (prompt -> automation -> AI OS). Final step blooms blue.",
  css: `
      #aisv2-t1-ladder .inner{gap:34px;}
      #aisv2-t1-ladder .ladder{position:relative;display:flex;flex-direction:column;gap:26px;width:1140px;max-width:1300px;}
      #aisv2-t1-ladder .step{display:flex;align-items:center;gap:26px;padding:24px 34px;text-align:left;width:100%;
        background:var(--chip-glass);border:1px solid var(--chip-border);border-radius:var(--radius);
        box-shadow:var(--chip-highlight),var(--chip-shadow);will-change:transform,opacity;position:relative;}
      #aisv2-t1-ladder .step:nth-child(3){border-color:rgba(var(--blue-rgb),.55);
        box-shadow:var(--chip-highlight),var(--chip-shadow),0 0 54px rgba(var(--blue-rgb),.30);}
      #aisv2-t1-ladder .step .chip{width:78px;height:78px;border-radius:20px;}
      #aisv2-t1-ladder .step .ic{width:46px;height:46px;}
      #aisv2-t1-ladder .stx{display:flex;flex-direction:column;gap:6px;}
      #aisv2-t1-ladder .st{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:27px;color:var(--blue);letter-spacing:.14em;text-shadow:var(--glow-eyebrow);}
      #aisv2-t1-ladder .sd{font-family:var(--font-body);font-weight:var(--wt-reg);font-size:29px;color:var(--text-dim);line-height:1.25;max-width:860px;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">TOOLS VS SYSTEMS</div>
        <div class="ladder">
          <div class="step"><span class="chip"><span class="ic" data-icon="pen"></span></span><span class="stx"><span class="st">PROMPT</span><span class="sd">Completes one task</span></span></div>
          <div class="step"><span class="chip"><span class="ic" data-icon="repeat"></span></span><span class="stx"><span class="st">AUTOMATION</span><span class="sd">Connects a few steps</span></span></div>
          <div class="step"><span class="chip"><span class="ic" data-icon="bot"></span></span><span class="stx"><span class="st">AI OS</span><span class="sd">Context, memory, agents, workflows in one system</span></span></div>
        </div>
        <div class="sub" data-slot="caption">One system that actually operates</div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      /* steps honor data-at (word-synced entrances); without it, fixed stagger */
      const steps = Array.from($(".step"));
      let stepEnd = 1.75;
      if (steps.some(r => r.hasAttribute("data-at"))) {
        steps.forEach((r, i) => {
          const at = parseFloat(r.getAttribute("data-at") || (0.35 + i * 0.38));
          stepEnd = Math.max(stepEnd, at + 0.6);
          tl.fromTo(r, {autoAlpha:0, y:34, scale:.94}, {autoAlpha:1, y:0, scale:1, duration:.55, ease:"back.out(1.3)", transformOrigin:"50% 60%"}, at);
          tl.fromTo(r.querySelectorAll(".ic svg *"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.6, ease:"power2.inOut", stagger:.05}, at + 0.15);
        });
      } else {
        tl.fromTo($(".step"), {autoAlpha:0, y:34, scale:.94}, {autoAlpha:1, y:0, scale:1, duration:.55, ease:"back.out(1.3)", stagger:.38, transformOrigin:"50% 60%"}, 0.35);
        drawIn(".step", 0.5, 0.26);
      }
      tl.fromTo($(".step:nth-child(3)"), {filter:"brightness(1)"}, {filter:"brightness(1.35)", duration:.4, yoyo:true, repeat:1, ease:"sine.inOut"}, stepEnd);
      rise(".sub", stepEnd + 0.35);`,
});

/* --- 8 · GROWTH-LINES — revenue vs team chart --------------------------- */
cards.push({
  file: "cards/tier1/t1-growth-lines.html", cid: "aisv2-t1-growth", dur: 10,
  comment: "tier1 · diagram · GROWTH-LINES — two drawn lines: steep blue REVENUE vs flat dim TEAM. The story is the gap.",
  css: `
      #aisv2-t1-growth .inner{gap:26px;}
      #aisv2-t1-growth .chart{position:relative;width:1160px;height:520px;}
      #aisv2-t1-growth .chart svg{width:100%;height:100%;display:block;overflow:visible;}
      #aisv2-t1-growth .axis{stroke:rgba(209,220,232,.30);stroke-width:2;fill:none;stroke-dasharray:100 100;}
      #aisv2-t1-growth .lineA{stroke:url(#aisv2-t1-growth-grad);stroke-width:7;fill:none;stroke-linecap:round;
        filter:drop-shadow(0 0 14px rgba(var(--blue-rgb),.75));stroke-dasharray:100 100;}
      #aisv2-t1-growth .lineB{stroke:rgba(209,220,232,.55);stroke-width:5;fill:none;stroke-linecap:round;stroke-dasharray:100 100;}
      #aisv2-t1-growth .enddot{fill:var(--pulse);filter:drop-shadow(0 0 12px rgba(var(--blue-rgb),.9));}
      #aisv2-t1-growth .enddotB{fill:rgba(209,220,232,.8);}
      #aisv2-t1-growth .tagA,#aisv2-t1-growth .tagB{position:absolute;font-family:var(--font-mono);font-weight:var(--wt-black);
        font-size:34px;letter-spacing:.14em;will-change:transform,opacity;}
      #aisv2-t1-growth .tagA{right:-28px;top:0;color:var(--blue);text-shadow:var(--glow-eyebrow);}
      #aisv2-t1-growth .tagB{right:-28px;bottom:64px;color:var(--text-dim);}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">THE NEW ECONOMICS</div>
        <div class="chart">
          <svg viewBox="0 0 1160 520">
            <defs><linearGradient id="aisv2-t1-growth-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stop-color="#1487c9"/><stop offset=".6" stop-color="#37bdf8"/><stop offset="1" stop-color="#b3ecff"/>
            </linearGradient></defs>
            <path class="axis" d="M40 20V470H1120" pathLength="100" />
            <path class="lineB" d="M40 440 C 340 432, 700 420, 1060 396" pathLength="100" />
            <path class="lineA" d="M40 440 C 420 430, 760 330, 1060 60" pathLength="100" />
            <circle class="enddotB" cx="1060" cy="396" r="9"/>
            <circle class="enddot" cx="1060" cy="60" r="12"/>
          </svg>
          <div class="tagA" data-slot="lineA">REVENUE</div>
          <div class="tagB" data-slot="lineB">TEAM SIZE</div>
        </div>
        <div class="sub" data-slot="sub">Revenue grows much faster than the size of the team</div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      tl.fromTo($(".axis"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.7, ease:"power2.inOut"}, 0.3);
      tl.fromTo($(".lineB"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:1.1, ease:"power2.inOut"}, 0.75);
      tl.fromTo($(".enddotB"), {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, duration:.3, ease:"back.out(2)", transformOrigin:"50% 50%"}, 1.8);
      slideX(".tagB", 1.85, 0, 30);
      tl.fromTo($(".lineA"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:1.35, ease:"power2.in"}, 1.0);
      tl.fromTo($(".enddot"), {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, duration:.35, ease:"back.out(2.2)", transformOrigin:"50% 50%"}, 2.32);
      tl.fromTo($(".enddot"), {}, {scale:1.6, duration:.4, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 50%"}, 2.7);
      slideX(".tagA", 2.4, 0, 30);
      rise(".sub", 2.7);`,
});

/* --- 8b · DECOUPLE — revenue breaks away from payroll + headcount -------- */
cards.push({
  file: "cards/tier1/t1-decouple.html", cid: "aisv2-t1-decouple", dur: 16,
  comment: "tier1 · diagram · DECOUPLE — three linked chips (REVENUE / PAYROLL / HEADCOUNT) pop in word-synced (data-at per .riser), then at data-break (on .risers) the revenue chip breaks away upward while the other two stay put and dim. No chart.",
  css: `
      #aisv2-t1-decouple .inner{gap:40px;}
      #aisv2-t1-decouple .risers{position:relative;display:flex;gap:96px;margin-top:200px;}
      #aisv2-t1-decouple .riser{position:relative;display:flex;flex-direction:column;align-items:center;gap:20px;will-change:transform,opacity;}
      #aisv2-t1-decouple .riser .chip{width:196px;height:196px;}
      #aisv2-t1-decouple .riser .ic{width:100px;height:100px;}
      #aisv2-t1-decouple .rl{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:27px;color:var(--text-dim);letter-spacing:.16em;}
      #aisv2-t1-decouple .riser.rev .rl{color:var(--text);}
      #aisv2-t1-decouple .riser .uparrow{position:absolute;top:-96px;left:50%;width:64px;height:64px;margin-left:-32px;opacity:0;will-change:transform,opacity;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">THE NEW ECONOMICS</div>
        <div class="ln panel" data-split data-slot="headline">MORE REVENUE, <em>SAME TEAM</em></div>
        <div class="risers" data-break="9.7">
          <div class="riser rev" data-at="5.3"><span class="uparrow ic" data-icon="up"></span><span class="chip"><i class="sheen"></i><span class="ic" data-icon="chartup"></span></span><span class="rl">REVENUE</span></div>
          <div class="riser" data-at="5.9"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="dollar"></span></span><span class="rl">PAYROLL</span></div>
          <div class="riser" data-at="6.4"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="users"></span></span><span class="rl">HEADCOUNT</span></div>
        </div>
        <div class="sub" data-slot="sub">Revenue grows much faster than the team</div>
        </div>`,
  scene: `      const B = parseFloat($1(".risers").getAttribute("data-break") || "9.7");
      drop(".eyebrow", 0.15);
      words(".ln .wd", 0.30);
      let lastAt = 1.0;
      $(".riser").forEach((r, i) => {
        const at = parseFloat(r.getAttribute("data-at") || (1.0 + i * 0.6));
        lastAt = Math.max(lastAt, at);
        tl.fromTo(r, {autoAlpha:0, y:30, scale:.55}, {autoAlpha:1, y:0, scale:1, duration:.58, ease:"back.out(1.7)", transformOrigin:"50% 85%"}, at);
        tl.fromTo(r.querySelectorAll(".chip .ic svg *"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.5, ease:"power2.inOut", stagger:.05}, at + 0.1);
        tl.fromTo(r.querySelector(".sheen"), {xPercent:-160}, {xPercent:560, duration:.5, ease:"power2.inOut", immediateRender:false}, at + 0.45);
      });
      /* the break: revenue lifts away (clear of the headline), the others hold */
      tl.to($(".riser.rev"), {y:-118, duration:.9, ease:"power3.inOut"}, B);
      tl.fromTo($(".riser.rev .chip"), {filter:"brightness(1)"}, {filter:"brightness(1.45)", scale:1.06, duration:.9, ease:"power3.inOut", transformOrigin:"50% 50%", immediateRender:false}, B);
      tl.to($(".riser.rev .rl"), {color:"#37BDF8", duration:.6}, B + 0.1);
      tl.to($(".riser:not(.rev)"), {opacity:.5, duration:.7, ease:"power2.inOut"}, B);
      tl.fromTo($(".uparrow"), {autoAlpha:0, y:16}, {autoAlpha:1, y:0, duration:.45, ease:"power2.out"}, B + 0.3);
      tl.fromTo($(".uparrow svg *"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.5, ease:"power2.inOut"}, B + 0.35);
      tl.to($(".uparrow"), {y:-8, duration:1.1, yoyo:true, repeat:3, ease:"sine.inOut"}, B + 0.9);
      rise(".sub", B + 1.1);`,
});

/* --- 9 · CHECKLIST — drawn checks / numbered questions ------------------ */
cards.push({
  file: "cards/tier1/t1-checklist.html", cid: "aisv2-t1-checklist", dur: 10,
  comment: "tier1 · overview · CHECKLIST — rows with drawn check marks (or mono numbers via .cnum fill). Bakes 5 rows; strip empties.",
  css: `
      #aisv2-t1-checklist .inner{gap:30px;}
      #aisv2-t1-checklist .list{display:flex;flex-direction:column;gap:26px;width:max-content;max-width:1420px;}
      #aisv2-t1-checklist .crow{display:flex;align-items:center;gap:28px;text-align:left;will-change:transform,opacity;}
      #aisv2-t1-checklist .cbox{width:72px;height:72px;flex:0 0 auto;border-radius:18px;display:flex;align-items:center;justify-content:center;
        background:var(--chip-glass);border:1px solid rgba(var(--blue-rgb),.4);box-shadow:var(--chip-highlight),0 0 26px rgba(var(--blue-rgb),.18);}
      #aisv2-t1-checklist .cbox svg{width:40px;height:40px;display:block;fill:none;stroke:var(--blue);stroke-width:3;
        stroke-linecap:round;stroke-linejoin:round;filter:var(--icon-halo);}
      #aisv2-t1-checklist .cbox svg path{stroke-dasharray:100 100;}
      #aisv2-t1-checklist .cnum{font-family:var(--font-mono);font-weight:var(--wt-black);font-size:30px;color:var(--blue);text-shadow:var(--glow-eyebrow);}
      #aisv2-t1-checklist .clabel{font-family:var(--font-body);font-weight:var(--wt-med);font-size:40px;color:var(--text);line-height:1.25;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">YOU LEAVE KNOWING</div>
        <div class="list">
          <div class="crow"><span class="cbox"><svg viewBox="0 0 24 24"><path d="M4 12.5l5.5 5.5L20 6.5" pathLength="100"/></svg></span><span class="clabel">What to build</span></div>
          <div class="crow"><span class="cbox"><svg viewBox="0 0 24 24"><path d="M4 12.5l5.5 5.5L20 6.5" pathLength="100"/></svg></span><span class="clabel">Why it matters</span></div>
          <div class="crow"><span class="cbox"><svg viewBox="0 0 24 24"><path d="M4 12.5l5.5 5.5L20 6.5" pathLength="100"/></svg></span><span class="clabel">What comes first</span></div>
          <div class="crow"><span class="cbox"><svg viewBox="0 0 24 24"><path d="M4 12.5l5.5 5.5L20 6.5" pathLength="100"/></svg></span><span class="clabel"></span></div>
          <div class="crow"><span class="cbox"><svg viewBox="0 0 24 24"><path d="M4 12.5l5.5 5.5L20 6.5" pathLength="100"/></svg></span><span class="clabel"></span></div>
        </div>
        <div class="sub" data-slot="caption"></div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      slideX(".crow", 0.35, 0.22);
      tl.fromTo($(".cbox svg path"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.45, ease:"power2.out", stagger:.22}, 0.6);
      tl.fromTo($(".cbox"), {}, {scale:1.12, duration:.18, yoyo:true, repeat:1, ease:"sine.inOut", stagger:.22, transformOrigin:"50% 50%"}, 0.62);
      rise(".sub", 1.6);`,
});

/* --- 10 · TIMELINE — 3 nodes, line draws through ------------------------ */
cards.push({
  file: "cards/tier1/t1-timeline.html", cid: "aisv2-t1-timeline", dur: 10,
  comment: "tier1 · diagram · TIMELINE — horizontal 3-node journey; the track draws left->right and each node blooms as it arrives. Bakes 3 nodes.",
  css: `
      #aisv2-t1-timeline .inner{gap:44px;}
      #aisv2-t1-timeline .tline{position:relative;display:flex;justify-content:space-between;width:1360px;padding-top:8px;}
      #aisv2-t1-timeline .node{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:18px;width:400px;will-change:transform,opacity;}
      #aisv2-t1-timeline .node .chip{width:144px;height:144px;}
      #aisv2-t1-timeline .node .ic{width:72px;height:72px;}
      #aisv2-t1-timeline .tt{font-family:var(--font-mono);font-weight:var(--wt-black);font-size:30px;color:var(--blue);letter-spacing:.16em;text-shadow:var(--glow-eyebrow);}
      #aisv2-t1-timeline .td{font-family:var(--font-body);font-weight:var(--wt-reg);font-size:28px;color:var(--text-dim);line-height:1.3;text-align:center;max-width:360px;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">HOW THE GUARANTEE WORKS</div>
        <div class="tline">
          <div class="node"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="calendar"></span></span><span class="tt">ATTEND</span><span class="td">Day one plus most of day two</span></div>
          <div class="node"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="mail"></span></span><span class="tt">DECIDE</span><span class="td">Email before the last session on day two</span></div>
          <div class="node"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="undo"></span></span><span class="tt">REFUND</span><span class="td">Full ticket price, no questions asked</span></div>
        </div>
        <div class="sub" data-slot="caption">Almost the entire event to decide</div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      chipPop(".node", 0.45, 0.55);
      drawIn(".node", 0.55, 0.12);
      sheens(".node", 1.1, 0.55);
      rise(".sub", 2.3);`,
});

/* --- 11 · HUB — AI OS core + 4 orbit nodes ------------------------------ */
cards.push({
  file: "cards/tier1/t1-hub.html", cid: "aisv2-t1-hub", dur: 10,
  comment: "tier1 · diagram · HUB — the AI OS core with agents/memory/workflows/context orbiting; connectors draw outward, nodes bloom, core ring breathes.",
  css: `
      #aisv2-t1-hub .inner{gap:0;}
      #aisv2-t1-hub .hub{position:relative;width:1400px;height:760px;}
      #aisv2-t1-hub .hub svg.wires{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
      #aisv2-t1-hub .wire{stroke:rgba(var(--blue-rgb),.55);stroke-width:2.5;fill:none;stroke-dasharray:100 100;
        filter:drop-shadow(0 0 8px rgba(var(--blue-rgb),.5));}
      #aisv2-t1-hub .core{position:absolute;left:50%;top:50%;width:340px;height:340px;margin:-170px 0 0 -170px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border-radius:50%;
        background:radial-gradient(circle at 50% 34%,#0D2334,#040A11 72%);
        border:1.5px solid rgba(var(--blue-rgb),.5);box-shadow:var(--chip-highlight),0 0 90px rgba(var(--blue-rgb),.35);will-change:transform,opacity;}
      #aisv2-t1-hub .corering{position:absolute;left:50%;top:50%;width:340px;height:340px;margin:-170px 0 0 -170px;border-radius:50%;
        border:1.5px solid rgba(var(--blue-rgb),.55);will-change:transform,opacity;pointer-events:none;}
      #aisv2-t1-hub .corelabel{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:84px;letter-spacing:var(--track-tight);
        padding:.02em .12em .14em;background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-blue);}
      #aisv2-t1-hub .coresub{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:20px;color:var(--text-dim);letter-spacing:.26em;}
      #aisv2-t1-hub .onode{position:absolute;display:flex;flex-direction:column;align-items:center;gap:14px;width:260px;margin-left:-130px;will-change:transform,opacity;}
      #aisv2-t1-hub .onode .chip{width:126px;height:126px;}
      #aisv2-t1-hub .onode .ic{width:64px;height:64px;}
      #aisv2-t1-hub .ol{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:24px;color:var(--text);letter-spacing:.18em;}
      #aisv2-t1-hub .onode.n1{left:17%;top:6%;}
      #aisv2-t1-hub .onode.n2{left:83%;top:6%;}
      #aisv2-t1-hub .onode.n3{left:17%;top:66%;}
      #aisv2-t1-hub .onode.n4{left:83%;top:66%;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" style="position:absolute;top:70px;left:0;right:0;" data-slot="eyebrow">HOW IT FITS TOGETHER</div>
        <div class="hub">
          <svg class="wires" viewBox="0 0 1400 760">
            <path class="wire w1" d="M548 292 L240 115" pathLength="100"/>
            <path class="wire w2" d="M852 292 L1160 115" pathLength="100"/>
            <path class="wire w3" d="M537 444 L240 560" pathLength="100"/>
            <path class="wire w4" d="M863 444 L1160 560" pathLength="100"/>
          </svg>
          <div class="corering"></div>
          <div class="core"><span class="corelabel" data-slot="core">AI OS</span><span class="coresub" data-slot="coresub">ONE SYSTEM</span></div>
          <div class="onode n1"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="bot"></span></span><span class="ol">AGENTS</span></div>
          <div class="onode n2"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="chip"></span></span><span class="ol">MEMORY</span></div>
          <div class="onode n3"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="workflow"></span></span><span class="ol">WORKFLOWS</span></div>
          <div class="onode n4"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="layers"></span></span><span class="ol">CONTEXT</span></div>
        </div>
        <div class="sub" style="position:absolute;bottom:64px;left:0;right:0;margin:0 auto;" data-slot="sub">Business context, without becoming a programmer</div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      markPop(".core", 0.3);
      tl.fromTo($(".corering"), {scale:1, autoAlpha:.7}, {scale:1.35, autoAlpha:0, duration:1.2, ease:"power2.out", repeat:Math.max(1, Math.round((DUR-1)/1.6)-1), repeatDelay:.4}, 0.9);
      tl.fromTo($(".wire"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.5, ease:"power2.inOut", stagger:.18}, 0.85);
      chipPop(".onode", 1.15, 0.18);
      drawIn(".onode", 1.25, 0.04);
      sheens(".onode", 1.8, 0.18);
      rise(".sub", 2.2);`,
});

/* --- 12 · SECTION markflash --------------------------------------------- */
cards.push({
  file: "cards/tier1/t1-section-markflash.html", cid: "aisv2-t1-markflash", dur: 6,
  comment: "tier1 · section · MARKFLASH — the AIS/LIVE mark blooms with a shockwave ring; mono section label under.",
  css: `
      #aisv2-t1-markflash .inner{gap:44px;}
      #aisv2-t1-markflash .flashmark{position:relative;will-change:transform,opacity;}
      #aisv2-t1-markflash .shock{position:absolute;left:50%;top:50%;width:520px;height:520px;margin:-260px 0 0 -260px;border-radius:50%;
        border:2px solid rgba(var(--blue-rgb),.6);opacity:0;will-change:transform,opacity;pointer-events:none;}
      #aisv2-t1-markflash .seclabel{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:36px;letter-spacing:var(--track-wide);
        text-transform:uppercase;color:var(--blue);text-shadow:var(--glow-eyebrow);will-change:transform,opacity;}
`,
  dom: `        <div class="inner">
        <div class="flashmark"><span class="shock"></span><span class="mark big"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>
        <div class="seclabel" data-slot="sub">STARTING A BUSINESS</div>
        </div>`,
  scene: `      markPop(".flashmark", 0.12);
      tl.fromTo($(".shock"), {scale:.4, autoAlpha:.8}, {scale:2.4, autoAlpha:0, duration:.9, ease:"power2.out"}, 0.35);
      rise(".seclabel", 0.55);`,
});

/* --- 13 · CTA date — outro hold ------------------------------------------ */
cards.push({
  file: "cards/tier1/t1-cta-date.html", cid: "aisv2-t1-cta", dur: 10,
  comment: "tier1 · cta · DATE — outro hold: date lockup + virtual/replay badges + pulsing claim-your-seat pill.",
  css: `
      #aisv2-t1-cta .inner{gap:36px;}
      #aisv2-t1-cta .badges{display:flex;gap:26px;justify-content:center;}
      #aisv2-t1-cta .badge{display:flex;align-items:center;gap:14px;padding:14px 26px;border-radius:16px;
        background:var(--chip-glass);border:1px solid var(--chip-border);box-shadow:var(--chip-highlight);will-change:transform,opacity;}
      #aisv2-t1-cta .badge .ic{width:34px;height:34px;}
      #aisv2-t1-cta .badge span.bl{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:24px;color:var(--text-dim);letter-spacing:.14em;}
      #aisv2-t1-cta .ctapill{position:relative;display:flex;align-items:center;gap:18px;padding:24px 52px;border-radius:60px;
        background:linear-gradient(135deg,rgba(var(--blue-rgb),.22),rgba(var(--blue-rgb),.08));
        border:1.5px solid rgba(var(--blue-rgb),.65);box-shadow:var(--chip-highlight),0 0 44px rgba(var(--blue-rgb),.35);will-change:transform,opacity;}
      #aisv2-t1-cta .ctapill .ct{font-family:var(--font-mono);font-weight:var(--wt-black);font-size:32px;color:var(--white);letter-spacing:.2em;text-shadow:0 0 20px rgba(var(--blue-rgb),.8);}
      #aisv2-t1-cta .ctapill .ic{width:34px;height:34px;will-change:transform;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">AIS LIVE · BUILD YOUR AI OS</div>
        <div class="ln hero" data-split data-slot="headline">OCTOBER <em>17 + 18</em></div>
        <div class="badges">
          <div class="badge"><span class="ic" data-icon="globe"></span><span class="bl" data-slot="badge1">FULLY VIRTUAL</span></div>
          <div class="badge"><span class="ic" data-icon="repeat"></span><span class="bl" data-slot="badge2">REPLAY ACCESS</span></div>
        </div>
        <div class="ctapill"><span class="ct" data-slot="cta">CLAIM YOUR SEAT BELOW</span><span class="ic" data-icon="down"></span></div>
        <div class="sub" data-slot="sub"></div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      words(".ln .wd", 0.30);
      chipPop(".badge", 1.0, 0.16);
      drawIn(".badge", 1.1, 0.16);
      pop(".ctapill", 1.5, .6);
      tl.fromTo($(".ctapill"), {boxShadow:"inset 0 1px 0 rgba(255,255,255,.22), 0 0 24px rgba(55,189,248,.25)"},
        {boxShadow:"inset 0 1px 0 rgba(255,255,255,.22), 0 0 64px rgba(55,189,248,.55)", duration:1.1, yoyo:true, repeat:Math.max(1, Math.round((DUR-2.2)/1.1)-1), ease:"sine.inOut"}, 2.2);
      tl.fromTo($(".ctapill .ic"), {y:-3}, {y:5, duration:.7, yoyo:true, repeat:Math.max(1, Math.round((DUR-2.2)/0.7)-1), ease:"sine.inOut"}, 2.2);
      rise(".sub", 1.9);`,
});

/* --- 13b · EVENT TITLE — the AIS LIVE + Build Your AI OS reveal ---------- */
cards.push({
  file: "cards/tier1/t1-event-title.html", cid: "aisv2-t1-event", dur: 10,
  comment: "tier1 · title · EVENT — big AIS/LIVE mark blooms, one-line event name reveals under it, then date + virtual badges pop (timed for the 0:47 'the event is called' read).",
  css: `
      #aisv2-t1-event .inner{gap:38px;}
      #aisv2-t1-event .backdrop-mark{display:none;}
      #aisv2-t1-event .flashmark{position:relative;will-change:transform,opacity;}
      #aisv2-t1-event .flashmark .mark{font-size:200px;}
      #aisv2-t1-event .shock{position:absolute;left:50%;top:50%;width:520px;height:520px;margin:-260px 0 0 -260px;border-radius:50%;
        border:2px solid rgba(var(--blue-rgb),.6);opacity:0;will-change:transform,opacity;pointer-events:none;}
      #aisv2-t1-event .badges{display:flex;gap:26px;justify-content:center;}
      #aisv2-t1-event .badge{display:flex;align-items:center;gap:14px;padding:14px 26px;border-radius:16px;
        background:var(--chip-glass);border:1px solid var(--chip-border);box-shadow:var(--chip-highlight);will-change:transform,opacity;}
      #aisv2-t1-event .badge .ic{width:34px;height:34px;}
      #aisv2-t1-event .badge span.bl{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:24px;color:var(--text-dim);letter-spacing:.14em;}
`,
  dom: `        <div class="inner">
        <div class="eyebrow" data-slot="eyebrow">THE EVENT</div>
        <div class="flashmark"><span class="shock"></span><span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>
        <div class="ln" data-split data-slot="headline">BUILD YOUR <em>AI OS</em></div>
        <div class="badges">
          <div class="badge"><span class="ic" data-icon="calendar"></span><span class="bl" data-slot="badge1">OCTOBER 17 + 18</span></div>
          <div class="badge"><span class="ic" data-icon="globe"></span><span class="bl" data-slot="badge2">FULLY VIRTUAL</span></div>
        </div>
        </div>`,
  scene: `      drop(".eyebrow", 0.15);
      markPop(".flashmark", 0.3);
      tl.fromTo($(".shock"), {scale:.4, autoAlpha:.8}, {scale:2.4, autoAlpha:0, duration:.9, ease:"power2.out"}, 0.55);
      words(".ln .wd", 1.15);
      /* badges land on the spoken beats: "October seventeenth" ~+3.9, "fully virtual" ~+5.6 */
      chipPop(".badge:nth-child(1)", 3.75, 0);
      drawIn(".badge:nth-child(1)", 3.85, 0.1);
      chipPop(".badge:nth-child(2)", 5.45, 0);
      drawIn(".badge:nth-child(2)", 5.55, 0.1);`,
});

/* --- 14 · tier2 ICONPOP — word-synced overlay chips over live video ------ */
cards.push({
  file: "cards/tier2/t2-iconpop.html", cid: "aisv2-t2-iconpop", dur: 12, bare: true,
  comment: "tier2 · label · ICONPOP — transparent overlay; glass icon chips pop along the bottom third in sync with spoken words (data-at = seconds from beat start). Bakes 5 chips; strip empties. Video stays full-frame.",
  css: `
      #aisv2-t2-iconpop .popsrow{position:absolute;left:50%;bottom:96px;transform:translateX(-50%);display:flex;gap:42px;align-items:flex-start;}
      #aisv2-t2-iconpop .popwrap{display:flex;flex-direction:column;align-items:center;gap:14px;will-change:transform,opacity;}
      #aisv2-t2-iconpop .popwrap .chip{width:142px;height:142px;}
      #aisv2-t2-iconpop .popwrap .ic{width:66px;height:66px;}
      #aisv2-t2-iconpop .cl{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:21px;color:var(--white);
        letter-spacing:.16em;text-transform:uppercase;text-align:center;max-width:180px;line-height:1.3;
        text-shadow:0 2px 12px rgba(0,0,0,.8), 0 0 18px rgba(var(--blue-rgb),.35);}
`,
  dom: `      <div class="popsrow">
        <div class="popwrap" data-at="0.2"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="doc"></span></span><span class="cl">CONTENT</span></div>
        <div class="popwrap" data-at="0.9"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="megaphone"></span></span><span class="cl">MARKETING</span></div>
        <div class="popwrap" data-at="1.6"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="target"></span></span><span class="cl">SALES</span></div>
        <div class="popwrap" data-at="2.3"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="gear"></span></span><span class="cl">OPERATIONS</span></div>
        <div class="popwrap" data-at="3.0"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="userplus"></span></span><span class="cl">RECRUITING</span></div>
      </div>`,
  scene: `      $(".popwrap").forEach((el, i) => {
        const at = parseFloat(el.getAttribute("data-at") || (0.2 + i * 0.6));
        tl.fromTo(el, {autoAlpha:0, y:44, scale:.5}, {autoAlpha:1, y:0, scale:1, duration:.55, ease:"back.out(1.8)", transformOrigin:"50% 90%"}, at);
        tl.fromTo(el.querySelectorAll(".ic svg *"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.5, ease:"power2.inOut", stagger:.05}, at + 0.1);
        tl.fromTo(el.querySelector(".sheen"), {xPercent:-160}, {xPercent:560, duration:.5, ease:"power2.inOut", immediateRender:false}, at + 0.45);
        const floatStart = at + 1.1;
        tl.to(el, {y:"-=7", duration:1.4, yoyo:true, repeat:Math.max(1, Math.floor((DUR - floatStart)/1.4) - 1), ease:"sine.inOut"}, floatStart);
      });`,
});

/* =========================== EMIT ========================================= */
for (const c of cards) emit(c);
console.log(`\n${cards.length} cards → ${OUT}/cards/`);
