// AIS LIVE — Members in AIS Gear (animated slideshow, 16:9)
// Quick community slideshow: title beat -> one photo card per member with a
// motion-blur whip between each -> thank-you outro hold. Command-deck ambient
// (grid tunnel, beam, glows, grain) drifts the whole time. All-blue accents,
// no em dashes, no eyebrow dots (AIS LIVE live-asset directives).
//
//   node _gen.mjs        -> writes index.html
//
// Photos: assets/photos-web/<slug>.jpg (EXIF-baked, max 1600px)

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));

// orient: "p" portrait / "l" landscape — sets the photo frame shape
const MEMBERS = [
  { slug: "michael-wacht",      name: "Michael Wacht",     sub: "AIS COMMUNITY MEMBER", orient: "p" },
  { slug: "kacper-rutkiewicz",  name: "Kacper Rutkiewicz", sub: "AIS COMMUNITY MEMBER", orient: "l" },
  { slug: "diane-mccracken",    name: "Diane McCracken",   sub: "AIS COMMUNITY MEMBER", orient: "p" },
  { slug: "jody-murfit",        name: "Jody Murfit",       sub: "AIS COMMUNITY MEMBER", orient: "l" },
  { slug: "josh-holladay",      name: "Josh Holladay",     sub: "AIS COMMUNITY MEMBER", orient: "p" },
  { slug: "mike-ai-consultant", name: "Mike",              sub: "AI CONSULTANT · AIS COMMUNITY", orient: "p" },
];

const INTRO = 2.8;    // title beat
const PER = 2.6;      // seconds per member slide
const OUTRO_AT = INTRO + MEMBERS.length * PER; // outro slide start
const TOTAL = OUTRO_AT + 4.4;                  // breathing outro hold

const slide = (m, i) => `
        <div class="slide member" id="sl-${i}" data-orient="${m.orient}">
          <div class="ph ${m.orient}"><img src="assets/photos-web/${m.slug}.jpg" alt="${m.name}" /></div>
          <div class="cap">
            <div class="cap-sub">${m.sub}</div>
            <div class="cap-nm">${m.name}</div>
          </div>
        </div>`;

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <link rel="stylesheet" href="assets/tokens.css" />
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#000;color:var(--text);font-family:var(--font-body);}
      .stage{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;background:var(--onyx);isolation:isolate;}

      /* ---------- ambient background (shared command-deck) ---------- */
      .bg{position:absolute;inset:0;overflow:hidden;}
      .depth{position:absolute;left:-40%;right:-40%;height:78%;background-image:var(--grid-lines);will-change:background-position;}
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
      .vignette{position:absolute;inset:0;pointer-events:none;background:var(--vignette);}
      .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:screen;background-image:var(--tex-grain);}

      /* ---------- slides ---------- */
      .slide{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:30px;padding:60px 100px;text-align:center;opacity:0;will-change:transform,opacity,filter;}

      /* title + outro */
      .eyebrow{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:var(--size-label);letter-spacing:var(--track-eyebrow);
        text-transform:uppercase;color:var(--blue);text-shadow:var(--glow-eyebrow);}
      .ln{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:132px;
        line-height:1.03;letter-spacing:var(--track-tight);}
      .ln .wd{display:inline-block;padding:.08em .13em .24em;will-change:transform,opacity;
        background:var(--grad-chrome);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-chrome);}
      .ln .wd.ac{background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-blue);}
      .tsub{font-family:var(--font-body);font-weight:var(--wt-light);font-style:italic;font-size:38px;color:var(--text-dim);}

      /* member photo card */
      .ph{border-radius:26px;overflow:hidden;position:relative;flex:none;
        border:2px solid rgba(var(--blue-rgb),.55);
        box-shadow:0 40px 90px rgba(0,0,0,.6), 0 0 80px rgba(var(--blue-rgb),.22);}
      .ph.p{width:560px;height:740px;}
      .ph.l{width:1120px;height:740px;}
      .ph img{width:100%;height:100%;object-fit:cover;display:block;}
      .cap{display:flex;flex-direction:column;gap:10px;}
      .cap-sub{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:17px;letter-spacing:.26em;
        text-transform:uppercase;color:var(--blue);text-shadow:var(--glow-eyebrow);}
      .cap-nm{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:56px;
        letter-spacing:var(--track-tight);color:var(--white);line-height:1;}

      /* persistent corner mark */
      .backdrop-mark{position:absolute;right:72px;bottom:60px;display:inline-flex;z-index:6;}
      .mark{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);letter-spacing:var(--track-tight);
        line-height:.9;font-size:64px;display:inline-flex;align-items:baseline;position:relative;}
      .mark .ais{color:var(--white);}
      .mark .gap{display:inline-block;width:.08em;}
      .live{position:relative;color:var(--blue);text-shadow:0 0 60px rgba(var(--blue-rgb),.55);padding-right:.28em;}
      .dot{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:var(--red-live);box-shadow:0 0 .7em var(--red-live),0 0 .25em var(--red-live);}
    </style>
  </head>
  <body>
    <div id="ais-live-member-shirts" class="stage clip" data-composition-id="ais-live-member-shirts"
      data-start="0" data-duration="${TOTAL}" data-track-index="0" data-width="1920" data-height="1080">
      <div class="bg">
        <div class="depth grid-ceiling"></div>
        <div class="depth grid-floor"></div>
        <div class="beam"></div>
        <div class="glow blue"></div>
        <div class="glow coral"></div>
        <div class="vignette"></div>
        <div class="grain"></div>
      </div>
      <div class="backdrop-mark"><span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="dot"></span></span></span></div>

      <div class="slide title" id="sl-title">
        <div class="eyebrow">AIS LIVE COMMUNITY</div>
        <div class="ln"><span class="wd">REPPING</span><span class="wd">THE</span><span class="wd ac">AIS</span><span class="wd ac">GEAR</span></div>
        <div class="tsub">Our members, wearing it proud</div>
      </div>
${MEMBERS.map(slide).join("")}
      <div class="slide outro" id="sl-outro">
        <div class="eyebrow">THANK YOU FOR REPPING</div>
        <div class="ln"><span class="wd">THIS IS</span><span class="wd ac">OUR</span><span class="wd ac">CREW</span></div>
        <div class="tsub">AI Automation Society</div>
      </div>
    </div>

    <script>
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      const INTRO = ${INTRO}, PER = ${PER}, OUTRO_AT = ${OUTRO_AT}, TOTAL = ${TOTAL};

      // ambient (whole duration)
      tl.to(".grid-floor",   { backgroundPosition: "0px " + Math.round(TOTAL * 36) + "px", duration: TOTAL, ease: "none" }, 0);
      tl.to(".grid-ceiling", { backgroundPosition: "0px -" + Math.round(TOTAL * 36) + "px", duration: TOTAL, ease: "none" }, 0);
      tl.fromTo(".beam", { rotate: -4 }, { rotate: 4, duration: TOTAL / 2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
      tl.fromTo(".glow.blue", { scale: .96 }, { scale: 1.06, duration: 6, ease: "sine.inOut", yoyo: true, repeat: Math.ceil(TOTAL / 6) }, 0);
      tl.to(".dot", { opacity: .25, duration: .5, ease: "sine.inOut", yoyo: true, repeat: Math.floor(TOTAL / .5) - 1 }, 0);

      // ---- title beat ----
      tl.fromTo("#sl-title", { opacity: 0 }, { opacity: 1, duration: .01 }, 0);
      tl.fromTo("#sl-title .eyebrow", { opacity: 0, y: 26, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: .5 }, 0.2);
      tl.fromTo("#sl-title .ln .wd", { opacity: 0, y: 60, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: .55, stagger: .1 }, 0.35);
      tl.fromTo("#sl-title .tsub", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .5 }, 1.0);
      // whip out
      tl.to("#sl-title", { x: -230, opacity: 0, filter: "blur(16px)", duration: .4, ease: "power3.in" }, INTRO - .38);

      // ---- member slides: whip in from the right, gentle drift, whip out left ----
      const N = ${MEMBERS.length};
      for (let i = 0; i < N; i++) {
        const at = INTRO + i * PER;
        const el = "#sl-" + i;
        tl.fromTo(el, { opacity: 0, x: 260, filter: "blur(16px)" },
          { opacity: 1, x: 0, filter: "blur(0px)", duration: .5 }, at - .1);
        tl.fromTo(el + " .ph", { scale: .94 }, { scale: 1.0, duration: PER, ease: "sine.out" }, at - .1);
        tl.fromTo(el + " .cap", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .45 }, at + .22);
        tl.to(el, { x: -260, opacity: 0, filter: "blur(16px)", duration: .38, ease: "power3.in" }, at + PER - .34);
      }

      // ---- outro ----
      tl.fromTo("#sl-outro", { opacity: 0 }, { opacity: 1, duration: .01 }, OUTRO_AT - .05);
      tl.fromTo("#sl-outro .eyebrow", { opacity: 0, y: 26, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: .5 }, OUTRO_AT + .05);
      tl.fromTo("#sl-outro .ln .wd", { opacity: 0, y: 60, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: .55, stagger: .1 }, OUTRO_AT + .2);
      tl.fromTo("#sl-outro .tsub", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .5 }, OUTRO_AT + .85);

      // breathing outro hold
      tl.set({}, {}, TOTAL);

      window.__timelines = window.__timelines || {};
      window.__timelines["ais-live-member-shirts"] = tl;
    </script>
  </body>
</html>
`;

writeFileSync(join(DIR, "index.html"), html);
console.log(`index.html written — ${MEMBERS.length} members, ${TOTAL.toFixed(1)}s total`);
