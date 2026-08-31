#!/usr/bin/env node
// AIS LIVE (style 03) — card generator.
// Emits every card in the AIS LIVE "command-deck" style as a STANDALONE
// HyperFrames composition (one paused GSAP timeline on window.__timelines,
// tokens.css for theming, data-slots for fill) + regenerates style.json.
//
// The look is lifted from the Doors-Open Loop (video-projects/ais-live-loops):
// onyx canvas, perspective-grid tunnel, conic beam, blue+coral glow wells,
// breathing vignette + grain, persistent AIS/LIVE corner mark w/ live-dot,
// chrome-gradient italic-900 headlines revealed word-by-word, motion-blur whip
// on every cut. Each card is one "beat" of that system.
//
//   node scripts/style-library/gen-ais-live-style.mjs        -> writes cards/*.html + style.json
//   node scripts/style-library/build-registry.mjs            -> reindex the library

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const STYLE_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../style-library/03-ais-live");
const CARDS = join(STYLE_DIR, "cards");
mkdirSync(join(CARDS, "tier1"), { recursive: true });
mkdirSync(join(CARDS, "custom"), { recursive: true });

// ---------------------------------------------------------------------------
// shared CSS — ambient command-deck + typography, tokens-driven. Baked into
// every card (they are standalone). Card-specific CSS is appended per card.
// ---------------------------------------------------------------------------
const SHARED_CSS = `
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#000;color:var(--text);font-family:var(--font-body);}
      .stage{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;background:var(--onyx);
        isolation:isolate;perspective:1600px;perspective-origin:50% 44%;}
      .camera{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;}

      /* ---------- depth background ---------- */
      .bg{position:absolute;inset:0;overflow:hidden;}
      .depth{position:absolute;left:-40%;right:-40%;height:78%;background-color:transparent;
        background-image:var(--grid-lines);will-change:background-position;}
      .grid-floor{bottom:-14%;transform:perspective(680px) rotateX(66deg);transform-origin:50% 100%;
        -webkit-mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);
        mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);}
      .grid-ceiling{top:-14%;transform:perspective(680px) rotateX(-66deg);transform-origin:50% 0%;opacity:.6;
        -webkit-mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);
        mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);}
      .beam{position:absolute;top:-20%;left:50%;width:1400px;height:1200px;margin-left:-700px;
        background:var(--beam);filter:blur(30px);opacity:.7;will-change:transform,opacity;}
      .glow{position:absolute;border-radius:50%;will-change:transform;}
      .glow.blue{top:-160px;left:50%;width:760px;height:760px;margin-left:-380px;background:var(--blue);filter:blur(155px);opacity:.18;}
      .glow.coral{bottom:-220px;right:-140px;width:620px;height:620px;background:var(--coral);filter:blur(165px);opacity:.11;}
      .vignette{position:absolute;inset:0;pointer-events:none;background:var(--vignette);will-change:opacity;}
      .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:screen;background-image:var(--tex-grain);}
      .whip{position:absolute;top:50%;left:0;width:46%;height:10px;margin-top:-5px;opacity:0;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,.95),rgba(var(--blue-rgb),.8),transparent);
        filter:blur(7px);will-change:transform,opacity;}

      /* ---------- scene / content ---------- */
      .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:34px;padding:var(--pad-y) var(--pad-x);text-align:center;transform-style:preserve-3d;will-change:transform,opacity;}

      .eyebrow{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:var(--size-label);letter-spacing:var(--track-eyebrow);
        text-transform:uppercase;color:var(--blue);display:inline-flex;align-items:center;gap:13px;text-shadow:var(--glow-eyebrow);}
      .eyebrow::before{content:"";width:9px;height:9px;border-radius:2px;background:currentColor;box-shadow:0 0 12px currentColor;}
      .eyebrow.coral{color:var(--coral);text-shadow:var(--glow-eyebrow-coral);}

      .ln{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:var(--size-display);
        line-height:1.16;letter-spacing:var(--track-tight);max-width:1600px;}
      .ln.hero{font-size:var(--size-hero);}
      /* background-clip:text only paints inside each word's box; italic-900 glyphs
         overhang a tight box and render transparent (looks cut). Generous padding
         grows the paint box + supplies the inter-word gap. */
      .ln .wd{display:inline-block;padding:.08em .13em .24em;will-change:transform,opacity;
        background:var(--grad-chrome);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-chrome);}
      .ln .wd.ac{background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-blue);}
      .ln .wd.aco{background:var(--grad-coral);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-coral);}

      .sub{font-family:var(--font-body);font-weight:var(--wt-light);font-style:italic;font-size:var(--size-sub);
        line-height:1.25;color:var(--text-dim);max-width:1440px;will-change:transform,opacity;}

      /* persistent corner mark */
      .backdrop-mark{position:absolute;right:72px;bottom:60px;display:inline-flex;z-index:6;}
      .mark{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);letter-spacing:var(--track-tight);
        line-height:.9;font-size:92px;display:inline-flex;align-items:baseline;position:relative;}
      .mark.big{font-size:262px;}
      .mark .ais{color:var(--white);}
      .mark .gap{display:inline-block;width:.08em;}
      .live{position:relative;color:var(--blue);text-shadow:0 0 60px rgba(var(--blue-rgb),.55);padding-right:.28em;}
      .dot{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:var(--red-live);box-shadow:0 0 .7em var(--red-live),0 0 .25em var(--red-live);}
      .ring{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:rgba(var(--red-rgb),.55);opacity:0;transform-origin:50% 50%;pointer-events:none;}

      /* Official AIS+ PRODUCT mark (distinct from the AIS/LIVE event mark above):
         ALL WHITE, italic-900 Montserrat, the + included. Inline it in copy with
         <span class="plus">AIS<span class="p">+</span></span>. Never tint the +. */
      .plus{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);letter-spacing:var(--track-tight);
        display:inline-block;color:var(--white);text-shadow:0 0 34px rgba(255,255,255,.28);}
      .plus .p{color:var(--white);text-shadow:0 0 34px rgba(255,255,255,.28);}`;

// ---------------------------------------------------------------------------
// shared JS — reveal/transition helpers + ambient loop, tokens-driven eases.
// `at` offsets are relative to card start (0). DUR is substituted per card.
// ---------------------------------------------------------------------------
const SHARED_JS = dur => `
      window.__timelines = window.__timelines || {};
      const DUR = ${dur};
      const tl = gsap.timeline({ paused: true });

      /* split any [data-slot] headline into chrome/accent word spans so the
         word-by-word reveal works. <em> = blue accent, <em class="co"> = coral. */
      function splitWords(el){
        const frag = document.createDocumentFragment();
        el.childNodes.forEach(node => {
          const em = node.nodeType === 1 && node.tagName === "EM";
          const coral = em && node.classList.contains("co");
          (node.textContent || "").trim().split(/\\s+/).forEach(w => {
            if (!w) return;
            const s = document.createElement("span");
            s.className = "wd" + (em ? (coral ? " ac aco" : " ac") : "");
            s.textContent = w;
            frag.appendChild(s);
          });
        });
        el.textContent = "";
        el.appendChild(frag);
      }
      document.querySelectorAll(".ln[data-split]").forEach(splitWords);

      /* reveal / transition helpers (all fromTo — nothing left invisible) */
      function drop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:d||.5,ease:"power2.out"},at); }
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.55,ease:"${'expo.out'}",stagger:.075,transformOrigin:"50% 100%"},at); }
      function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%"},at); }
      function flip3d(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,rotationY:78,z:-140,transformOrigin:"50% 50%"},
        {autoAlpha:1,rotationY:0,z:0,duration:.72,ease:"power3.out",stagger:step||.1},at); }
      function glowIn(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,scale:.7,filter:"brightness(2.4) blur(6px)"},
        {autoAlpha:1,scale:1,filter:"brightness(1) blur(0px)",duration:.7,ease:"back.out(1.4)",stagger:step||.12},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      function drift(sel, at){ tl.to(sel,{y:"-=14",duration:2.4,yoyo:true,repeat:1,ease:"sine.inOut",stagger:{each:.25,from:"center"}},at); }
      function streak(at){
        tl.fromTo(".whip",{xPercent:-130,scaleX:.5,autoAlpha:0},{autoAlpha:.95,duration:.1,ease:"none",immediateRender:false,overwrite:"auto"},at-0.05);
        tl.to(".whip",{xPercent:270,scaleX:1.7,autoAlpha:0,duration:.34,ease:"power3.in",overwrite:"auto"},at+0.02);
      }
      function countUp(sel, at, target, d, suffix, prefix){
        var p=prefix||"", o={v:0};
        tl.call(function(){var el=document.querySelector(sel); if(el) el.textContent=p+"0"+(suffix||"");}, null, at-0.001);
        tl.to(o,{v:target,duration:d,ease:"power2.out",onUpdate:function(){
          var el=document.querySelector(sel); if(el) el.textContent=p+Math.round(o.v)+(suffix||"");}},at);
      }

      /* AMBIENT — the camera never sleeps, but it rides the BACKGROUND ONLY.
         Scaling/translating the text layer (.camera/.inner) rasterizes it once
         then interpolates, which SOFTENS the type as it moves. Move .bg instead
         so the depth tunnel/glow push in for camera-feel while text stays sharp. */
      tl.to(".bg", { scale:1.06, y:-14, duration:DUR, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=330px", duration:DUR, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=330px", duration:DUR, ease:"none" }, 0);
      tl.to(".beam", { rotation:8, duration:DUR, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam", { opacity:.4, duration:DUR/6, yoyo:true, repeat:5, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",  { x:44, y:-24, duration:DUR, ease:"sine.inOut" }, 0);
      tl.to(".glow.coral", { x:-36, y:22, duration:DUR, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:DUR/6, yoyo:true, repeat:5, ease:"sine.inOut" }, 0);
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:Math.max(1, Math.round(DUR/0.8)-1), ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:Math.max(1, Math.round(DUR/1.6)-1), ease:"none" }, 0);
      streak(0.05);
`;

// ---------------------------------------------------------------------------
// the ambient DOM shared by every card
// ---------------------------------------------------------------------------
const AMBIENT_DOM = `
      <div class="bg">
        <div class="depth grid-ceiling"></div>
        <div class="depth grid-floor"></div>
        <div class="beam"></div>
        <div class="glow blue"></div>
        <div class="glow coral"></div>
        <div class="vignette"></div>
        <div class="grain"></div>
      </div>
      <div class="whip"></div>
      <div class="backdrop-mark"><span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>`;

function shell({ id, comment, extraCss = "", body, timeline, dur }) {
  return `<!doctype html>
<!--
  ${comment}
-->
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="../../tokens.css" />
    <style>${SHARED_CSS}
${extraCss}
    </style>
  </head>
  <body>
    <div id="${id}" class="stage" data-composition-id="${id}" data-start="0" data-width="1920" data-height="1080">
      <div class="camera">
${AMBIENT_DOM}
        <div class="inner">
${body}
        </div>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>${SHARED_JS(dur)}
      /* ---- scene ---- */
${timeline}
      tl.set({}, {}, DUR);
      window.__timelines["${id}"] = tl;
    </script>
  </body>
</html>
`;
}

// ---------------------------------------------------------------------------
// CARD DEFINITIONS
// ---------------------------------------------------------------------------
const cards = [];
function card(def, html) { cards.push({ ...def }); writeFileSync(join(CARDS, def.file), html); }

// 1) tier1 · thesis · chrome — the signature headline takeover -------------
card({
  id: "ais-live.t1.thesis.chrome", tier: "tier1", purpose: "thesis", treatment: "chrome",
  file: "tier1/t1-thesis-chrome.html",
  slots: [
    { name: "eyebrow", type: "text", maxChars: 34 },
    { name: "headline", type: "richtext", maxChars: 70 },
    { name: "sub", type: "text", maxChars: 90 },
  ],
  duration: { min: 5, max: 7 },
}, shell({
  id: "ais-live.t1.thesis.chrome", dur: 6,
  comment: `AIS LIVE · tier1 · thesis · CHROME\n  The signature takeover: chrome-gradient italic-900 headline revealed word-by-word\n  over the command-deck. Wrap accent words in <em> (blue) or <em class="co"> (coral).`,
  body: `        <div class="eyebrow" data-slot="eyebrow">REAL PROJECTS · REAL REVENUE</div>
        <div class="ln" data-split data-slot="headline">Build Day <em class="co">-&gt; Earn Day.</em></div>
        <div class="sub" data-slot="sub">Day 1 you build it. Day 2 you get paid.</div>`,
  timeline: `      drop(".eyebrow", 0.15);
      words(".ln .wd", 0.30);
      drop(".sub", 0.95);`,
}));

// 2) tier1 · thesis · hero — the big two-word punch ------------------------
card({
  id: "ais-live.t1.thesis.hero", tier: "tier1", purpose: "thesis", treatment: "hero",
  file: "tier1/t1-thesis-hero.html",
  slots: [
    { name: "eyebrow", type: "text", maxChars: 34 },
    { name: "headline", type: "richtext", maxChars: 34 },
  ],
  duration: { min: 4, max: 6 },
}, shell({
  id: "ais-live.t1.thesis.hero", dur: 5,
  comment: `AIS LIVE · tier1 · thesis · HERO\n  A punchy 2-4 word statement at hero scale. Use <em>/<em class="co"> for the accent.\n  For punchline energy the eyebrow is optional.`,
  body: `        <div class="eyebrow" data-slot="eyebrow">WELCOME</div>
        <div class="ln hero" data-split data-slot="headline">Doors are <em>open.</em></div>`,
  timeline: `      drop(".eyebrow", 0.15);
      words(".ln .wd", 0.30);`,
}));

// 3) tier1 · stat · countup — big count-up number -------------------------
card({
  id: "ais-live.t1.stat.countup", tier: "tier1", purpose: "stat", treatment: "countup",
  file: "tier1/t1-stat-countup.html",
  slots: [
    { name: "kicker", type: "text", maxChars: 34 },
    { name: "stat", type: "text", maxChars: 8 },
    { name: "unit", type: "text", maxChars: 30 },
    { name: "sub", type: "text", maxChars: 60 },
  ],
  duration: { min: 5, max: 7 },
}, shell({
  id: "ais-live.t1.stat.countup", dur: 6,
  comment: `AIS LIVE · tier1 · stat · COUNTUP\n  One enormous blue-gradient number that counts up on entry, framed by a mono\n  kicker above and a unit + sub below. Integers and NNK+ count; anything else\n  (25+, $60K) pops static.`,
  extraCss: `      .statwrap{display:flex;flex-direction:column;align-items:center;gap:2px;}
      .kicker{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:var(--size-label);letter-spacing:var(--track-wide);text-transform:uppercase;color:var(--white);}
      .num{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:var(--size-mega);line-height:1.0;
        letter-spacing:var(--track-num);padding:.06em .13em .18em;will-change:transform,opacity;
        background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-num);}
      .unit{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:28px;letter-spacing:var(--track-wide);text-transform:uppercase;color:var(--blue);}`,
  body: `        <div class="eyebrow" data-slot="kicker-eyebrow" style="display:none"></div>
        <div class="statwrap">
          <div class="kicker" data-slot="kicker">BUILDERS SHIPPING TOGETHER</div>
          <div class="num" id="num" data-slot="stat">30</div>
          <div class="unit" data-slot="unit">LIVE SESSIONS</div>
        </div>
        <div class="sub" data-slot="sub">Talks, panels, and hands-on workshops.</div>`,
  timeline: `      drop(".kicker", 0.35);
      pop(".num", 0.50);
      countUp("#num", 0.55, 30, 1.0, "");
      drop(".unit", 0.85);
      drop(".sub", 0.95);`,
}));

// 4) tier1 · quote · member — testimonial pull-quote ----------------------
card({
  id: "ais-live.t1.quote.member", tier: "tier1", purpose: "quote", treatment: "member",
  file: "tier1/t1-quote-member.html",
  slots: [
    { name: "eyebrow", type: "text", maxChars: 30 },
    { name: "quote", type: "text", maxChars: 140 },
    { name: "attrib", type: "text", maxChars: 40 },
  ],
  duration: { min: 6, max: 8 },
}, shell({
  id: "ais-live.t1.quote.member", dur: 7,
  comment: `AIS LIVE · tier1 · quote · MEMBER\n  A member-win pull-quote in blue smart-quotes, revealed word-by-word, with a\n  mono attribution beneath.`,
  extraCss: `      .quoteln{font-size:var(--size-quote);line-height:1.28;max-width:1500px;position:relative;}
      .quoteln::before{content:"\\201C";color:var(--blue);margin-right:.04em;}
      .quoteln::after{content:"\\201D";color:var(--blue);margin-left:.04em;}
      .attrib{font-style:normal;font-family:var(--font-mono);font-weight:var(--wt-med);font-size:var(--size-tiny);letter-spacing:.06em;color:var(--text-faint);}`,
  body: `        <div class="eyebrow" data-slot="eyebrow">MEMBER WIN</div>
        <div class="ln quoteln" data-split data-slot="quote">In six weeks I landed two contracts worth nearly $20,000.</div>
        <div class="sub attrib" data-slot="attrib">Amy Simpson</div>`,
  timeline: `      drop(".eyebrow", 0.15);
      words(".quoteln .wd", 0.30);
      drop(".attrib", 1.05);`,
}));

// 5) tier1 · section · markflash — the AIS LIVE mark flash -----------------
card({
  id: "ais-live.t1.section.markflash", tier: "tier1", purpose: "section", treatment: "markflash",
  file: "tier1/t1-section-markflash.html",
  slots: [
    { name: "sub", type: "text", maxChars: 40 },
  ],
  duration: { min: 4, max: 6 },
}, shell({
  id: "ais-live.t1.section.markflash", dur: 5,
  comment: `AIS LIVE · tier1 · section · MARKFLASH\n  The giant AIS/LIVE mark blooms in with a blur+brightness pop (the pinging\n  live-dot stays solid, brand rule), over a short tagline. A section/brand stamp.`,
  extraCss: `      .bigmark{display:inline-flex;will-change:transform,opacity,filter;}`,
  body: `        <div class="bigmark"><span class="mark big"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>
        <div class="sub" data-slot="sub">Welcome to the room.</div>`,
  timeline: `      markPop(".bigmark", 0.25);
      drop(".sub", 0.95);`,
}));

// 6) tier1 · overview · agenda — schedule rows ----------------------------
card({
  id: "ais-live.t1.overview.agenda", tier: "tier1", purpose: "overview", treatment: "agenda",
  file: "tier1/t1-overview-agenda.html",
  slots: [
    { name: "eyebrow", type: "text", maxChars: 34 },
    { name: "rows", type: "list", maxItems: 4, maxChars: 44 },
    { name: "caption", type: "text", maxChars: 40 },
  ],
  duration: { min: 6, max: 9 },
}, shell({
  id: "ais-live.t1.overview.agenda", dur: 8,
  comment: `AIS LIVE · tier1 · overview · AGENDA\n  A schedule block: coral mono timestamps + white session titles, sliding in from\n  the left in sequence. Each .agrow = one item; times live in .agt, labels in .agl.`,
  extraCss: `      .agenda{display:flex;flex-direction:column;gap:22px;width:max-content;max-width:1240px;}
      .agrow{display:flex;align-items:center;gap:28px;font-family:var(--font-body);font-weight:var(--wt-bold);font-size:var(--size-agenda);color:var(--white);text-align:left;will-change:transform,opacity;}
      .agt{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:24px;color:var(--coral);min-width:124px;letter-spacing:.06em;}`,
  body: `        <div class="eyebrow" data-slot="eyebrow">BUILD DAY · JULY 11</div>
        <div class="agenda" data-slot="rows">
          <div class="agrow"><span class="agt">10:30</span><span class="agl">Always-On Agent Fleets</span></div>
          <div class="agrow"><span class="agt">11:00</span><span class="agl">Anatomy of Three Real Deals</span></div>
          <div class="agrow"><span class="agt">2:45</span><span class="agl">Run an Agency with Claude Code</span></div>
        </div>
        <div class="sub" data-slot="caption">All times Central</div>`,
  timeline: `      drop(".eyebrow", 0.15);
      slideX(".agrow", 0.40, 0.14);
      drop(".sub", 0.95);`,
}));

// 7) tier1 · overview · tracks — takeaway list ----------------------------
card({
  id: "ais-live.t1.overview.tracks", tier: "tier1", purpose: "overview", treatment: "tracks",
  file: "tier1/t1-overview-tracks.html",
  slots: [
    { name: "eyebrow", type: "text", maxChars: 34 },
    { name: "rows", type: "list", maxItems: 4, maxChars: 44 },
  ],
  duration: { min: 6, max: 9 },
}, shell({
  id: "ais-live.t1.overview.tracks", dur: 8,
  comment: `AIS LIVE · tier1 · overview · TRACKS\n  A "what you'll leave with" list: coral chevrons + italic-900 white lines that\n  slide in. Each .trow = one takeaway.`,
  extraCss: `      .tracks{display:flex;flex-direction:column;gap:26px;width:max-content;max-width:1360px;}
      .trow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:var(--size-track);letter-spacing:-.02em;color:var(--white);text-align:left;will-change:transform,opacity;}
      .tarr{font-style:normal;font-weight:var(--wt-black);color:var(--coral);text-shadow:0 0 22px rgba(var(--coral-rgb),.55);}`,
  body: `        <div class="eyebrow" data-slot="eyebrow">WHAT YOU'LL LEAVE WITH</div>
        <div class="tracks" data-slot="rows">
          <div class="trow"><span class="tarr">&rsaquo;</span><span class="tlabel">Land your first client</span></div>
          <div class="trow"><span class="tarr">&rsaquo;</span><span class="tlabel">Price to sell, not by the hour</span></div>
          <div class="trow"><span class="tarr">&rsaquo;</span><span class="tlabel">Ship a real, working agent</span></div>
        </div>`,
  timeline: `      drop(".eyebrow", 0.15);
      slideX(".trow", 0.40, 0.16);`,
}));

// 8) custom · speakers — 4:5 speaker-card grid ----------------------------
card({
  id: "ais-live.custom.speakers", tier: "custom", purpose: "speakers", treatment: "grid",
  file: "custom/custom-speakers.html",
  slots: [
    { name: "eyebrow", type: "text", maxChars: 30 },
    { name: "speakers", type: "imagegrid", maxItems: 4, note: "swap each .spkcard img src for a 4:5 headshot" },
  ],
  duration: { min: 6, max: 9 },
}, shell({
  id: "ais-live.custom.speakers", dur: 8,
  comment: `AIS LIVE · custom · SPEAKERS · GRID\n  A row of four 4:5 speaker cards that 3D-flip in and drift. Swap each .spkcard\n  img src for a real headshot (cover-fit); placeholder tiles shown here.`,
  extraCss: `      .spkrow{display:flex;gap:30px;justify-content:center;transform-style:preserve-3d;}
      .spkcard{width:396px;height:495px;border-radius:var(--radius);overflow:hidden;will-change:transform,opacity;
        transform-style:preserve-3d;box-shadow:var(--card-shadow);border:1px solid rgba(var(--blue-rgb),.22);
        position:relative;background:repeating-linear-gradient(135deg,rgba(var(--blue-rgb),.06) 0 22px,rgba(4,10,17,.4) 22px 44px);}
      .spkcard img{width:100%;height:100%;object-fit:cover;display:block;}
      .spkcard .ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:28px;gap:6px;}
      .spkcard .ph .nm{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:34px;color:var(--white);}
      .spkcard .ph .rl{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:16px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-faint);}`,
  body: `        <div class="eyebrow" data-slot="eyebrow">THE LINEUP</div>
        <div class="spkrow" data-slot="speakers">
          <div class="spkcard"><div class="ph"><div class="nm">Speaker</div><div class="rl">Role / Title</div></div></div>
          <div class="spkcard"><div class="ph"><div class="nm">Speaker</div><div class="rl">Role / Title</div></div></div>
          <div class="spkcard"><div class="ph"><div class="nm">Speaker</div><div class="rl">Role / Title</div></div></div>
          <div class="spkcard"><div class="ph"><div class="nm">Speaker</div><div class="rl">Role / Title</div></div></div>
        </div>`,
  timeline: `      drop(".eyebrow", 0.15);
      flip3d(".spkcard", 0.35, 0.10);
      drift(".spkcard", 1.9);`,
}));

// 9) custom · sponsor — logo row with roles -------------------------------
card({
  id: "ais-live.custom.sponsor", tier: "custom", purpose: "sponsor", treatment: "logos",
  file: "custom/custom-sponsor.html",
  slots: [
    { name: "eyebrow", type: "text", maxChars: 30 },
    { name: "logos", type: "imagerow", maxItems: 3, note: "swap each .logobox img src for a white-on-transparent logo; set the .logorole tier label" },
  ],
  duration: { min: 5, max: 7 },
}, shell({
  id: "ais-live.custom.sponsor", dur: 6,
  comment: `AIS LIVE · custom · SPONSOR · LOGOS\n  Sponsor logos glow in over equal-height slots (so labels align), each with a\n  mono tier role beneath. Use white-on-transparent logos; height-match the marks\n  (cap-height, not pixel-height) so no logo dominates.`,
  extraCss: `      .logorow{display:flex;gap:110px;justify-content:center;align-items:flex-start;}
      .logo{display:flex;flex-direction:column;align-items:center;gap:44px;will-change:transform,opacity;}
      .logobox{height:140px;display:flex;align-items:center;justify-content:center;}
      .logo img{width:auto;height:auto;max-height:140px;object-fit:contain;display:block;filter:drop-shadow(0 0 36px rgba(var(--blue-rgb),.28));}
      /* placeholder chip stands in for a real logo in the poster */
      .logoph{display:flex;align-items:center;justify-content:center;height:110px;min-width:300px;padding:0 44px;border-radius:16px;
        border:2px dashed rgba(var(--blue-rgb),.5);background:repeating-linear-gradient(135deg,rgba(var(--blue-rgb),.05) 0 22px,rgba(4,10,17,.35) 22px 44px);
        font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:44px;color:var(--white);}
      .logorole{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:26px;letter-spacing:.24em;text-transform:uppercase;color:var(--blue);text-shadow:0 0 14px rgba(var(--blue-rgb),.4);}`,
  body: `        <div class="eyebrow" data-slot="eyebrow">OUR SPONSORS</div>
        <div class="logorow" data-slot="logos">
          <div class="logo"><div class="logobox"><div class="logoph">Logo</div></div><div class="logorole">Presenting Sponsor</div></div>
          <div class="logo"><div class="logobox"><div class="logoph">Logo</div></div><div class="logorole">Sponsor</div></div>
        </div>`,
  timeline: `      drop(".eyebrow", 0.15);
      glowIn(".logo", 0.40, 0.16);`,
}));

// 10) custom · testimonial — stat-left + real-clip-right (the split proof card) -
card({
  id: "ais-live.custom.testimonial", tier: "custom", purpose: "testimonial", treatment: "split",
  file: "custom/custom-testimonial.html",
  slots: [
    { name: "eyebrow", type: "text", maxChars: 30 },
    { name: "name", type: "text", maxChars: 34 },
    { name: "stat", type: "text", maxChars: 8, note: "count-up target; use #tnum + countUp('#tnum',at,60,1.1,'K','$')" },
    { name: "unit", type: "text", maxChars: 30 },
    { name: "clip", type: "video", note: "swap .clipph for a root-level <video muted data-has-audio=false> + sibling <audio>; frame is 784x441 @ left1006/top320" },
  ],
  duration: { min: 4, max: 6 },
}, shell({
  id: "ais-live.custom.testimonial", dur: 5,
  comment: `AIS LIVE · custom · TESTIMONIAL · SPLIT\n  The proof card: a mono NAME kicker + big blue COUNT-UP number + unit on the\n  LEFT, the member's talking-head clip framed on the RIGHT. Placeholder clip box\n  shown here — in a real comp, drop a root-level <video muted playsinline\n  data-has-audio="false"> + sibling <audio> over .tframe (784x441 @ left1006/top320).\n  CHAIN several of these with a SIDE-SWIPE MATCH CUT: keep ONE persistent frame,\n  swipe the whole block (blur+scale ~0.24s), swap name/number/clip while blurred,\n  land the next clip SHARP as the swipe ends. NEVER digitally zoom the <video>\n  (frame-seek shake) — the footage's own motion carries it.`,
  extraCss: `      .inner{display:block;padding:0;}
      .t-eyebrow{position:absolute;top:168px;left:50%;transform:translateX(-50%);}
      .tstat{position:absolute;left:110px;top:0;bottom:0;width:830px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;}
      .tstat .kicker{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:var(--size-label);letter-spacing:var(--track-wide);text-transform:uppercase;color:var(--white);}
      .tstat .num{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:250px;line-height:1.0;
        letter-spacing:var(--track-num);padding:.06em .13em .18em;will-change:transform,opacity;
        background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-num);}
      .tstat .unit{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:28px;letter-spacing:var(--track-wide);text-transform:uppercase;color:var(--blue);}
      .tframe{position:absolute;left:1006px;top:320px;width:784px;height:441px;border-radius:var(--radius);overflow:hidden;
        border:1px solid rgba(var(--blue-rgb),.3);box-shadow:var(--card-shadow);background:#04101a;will-change:transform,opacity;}
      .tframe video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
      .clipph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
        background:repeating-linear-gradient(135deg,rgba(var(--blue-rgb),.06) 0 22px,rgba(4,10,17,.4) 22px 44px);}
      .clipph .film{font-size:44px;filter:grayscale(1) opacity(.75);}
      .clipph .badge{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:20px;letter-spacing:.2em;text-transform:uppercase;color:var(--blue);}`,
  body: `        <div class="eyebrow coral t-eyebrow" data-slot="eyebrow">REAL MEMBERS · REAL NUMBERS</div>
        <div class="tstat">
          <div class="kicker" data-slot="name">GLENN MARCUS · AIS MEMBER</div>
          <div class="num" id="tnum" data-slot="stat">$0K</div>
          <div class="unit" data-slot="unit">FIRST CONTRACT · 5 DAYS IN</div>
        </div>
        <div class="tframe" data-slot="clip"><div class="clipph"><div class="film">&#127916;</div><div class="badge">Member clip</div></div></div>`,
  timeline: `      drop(".t-eyebrow", 0.20);
      drop(".kicker", 0.35);
      pop(".num", 0.50);
      countUp("#tnum", 0.55, 60, 1.1, "K", "$");
      drop(".unit", 0.95);
      tl.fromTo(".tframe",{autoAlpha:0,y:18,scale:.975},{autoAlpha:1,y:0,scale:1,duration:1.0,ease:"power3.out"},0.55);`,
}));

// ---------------------------------------------------------------------------
// write style.json
// ---------------------------------------------------------------------------
const styleJson = {
  $schema: "../registry.schema.json",
  id: "ais-live",
  name: "AIS LIVE",
  number: "03",
  status: "draft",
  inspiration:
    "The AIS LIVE event 'command-deck' broadcast look, distilled from the Doors-Open Loop (video-projects/ais-live-loops). Onyx canvas with a receding perspective-grid tunnel (floor + ceiling), a conic light beam, blue + coral glow wells, breathing vignette + film grain, and a persistent AIS/LIVE corner mark with a pulsing red live-dot. Chrome-gradient italic-900 headlines revealed word-by-word; a motion-blur whip + light streak fire on every cut. Reference frames in references/.",
  summary:
    "High-energy live-event / broadcast motion graphics. Use for AIS LIVE (and event-style) content — welcomes, hype taglines, big count-up stats, member-win quotes, speaker line-ups, sponsor slates, agendas. The kinetic, depth-driven stage counterpart to Kallaway's calm glass and Vox's paper.",
  palette: {
    bg: "#07121C",
    fg: "#FFFFFF",
    accent: "#37BDF8",
    accent2: "#FF8A5C",
    alert: "#FF3B30",
    notes:
      "Onyx canvas (#07121C / deep #040A11), white text, AIS blue hero (chrome/blue gradient headlines + big numbers), coral secondary accent ('Earn Day', punchlines), red used ONLY for the LIVE dot. The AIS/LIVE mark stays SOLID; only headlines get the chrome gradient. Mirrored in tokens.css.",
  },
  fonts: {
    display: "Montserrat",
    body: "Inter",
    mono: "JetBrains Mono",
    notes:
      "Montserrat italic-900 is the headline / big-number / mark voice; Inter (300-500, italic sub) is body/captions; JetBrains Mono is eyebrows/kickers/units/timestamps. No serif.",
  },
  motion:
    "Snappy + kinetic + broadcast. Headlines reveal word-by-word (blur+rise, expo.out); stat numbers pop (back.out) and count up; speaker cards 3D-flip and drift; agenda/track rows slide in from the left; the mark blooms with a blur+brightness pop. The camera never sleeps, but it rides the BACKGROUND ONLY (depth tunnel/glow push in + parallax drift) so the text layer never scales/translates and stays pin-sharp. Real member clips sit dead still — NEVER digitally zoom a <video> (frame-seek shake); the footage's own motion carries it. Deterministic (no random / no Date.now).",
  transitions:
    "A fast motion-blur whip (~0.22s) + light streak fires on every cut (never a hard cut). When SEQUENCING beats, OVERLAP them so the incoming beat enters as the outgoing whips out — the screen never fades to black between sections. To swap same-format panels (e.g. a testimonial chain: stat-left + clip-right), use a SIDE-SWIPE MATCH CUT (~0.24s): swipe the whole block with blur+scale, swap content while blurred, land the next SHARP as it ends. Trimmed clips: hide any black head frame under the swipe (start the clip a hair early, move its audio with it).",
  cards: cards.map(c => ({
    id: c.id,
    tier: c.tier,
    purpose: c.purpose,
    treatment: c.treatment,
    file: `cards/${c.file}`,
    slots: c.slots,
    duration: c.duration,
    preview: { mp4: `preview/${c.id}.mp4`, poster: `preview/${c.id}.png` },
  })),
};
writeFileSync(join(STYLE_DIR, "style.json"), JSON.stringify(styleJson, null, 2) + "\n");

console.log(`AIS LIVE style — wrote ${cards.length} cards + style.json`);
cards.forEach(c => console.log(`  ${c.id}  ->  cards/${c.file}`));
