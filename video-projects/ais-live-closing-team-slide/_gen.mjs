// AIS LIVE — Closing Slide: The AIS Team (animated, 16:9)
// One full-screen command-deck slide: eyebrow -> "THE AIS TEAM" chrome headline ->
// staggered circular profile medallions (3 rows) with names/roles -> thank-you sub ->
// breathing outro hold. Ambient grid tunnel + beam + glows drift the whole time.
//
//   node _gen.mjs        -> writes index.html
//
// Headshots: assets/headshots/<slug>.png
//   kind:"medallion" = baked blue-ring circle PNG (from speaker-announcements)
//   kind:"crop"      = raw square crop (from ClickUp screenshot) -> CSS circle + ring
// Add a person: add a row to TEAM + drop the PNG in assets/headshots/.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));

// ---- Roster (ClickUp members with real photos; no-photo members skipped) ----
// All headshots are now baked blue-ring medallions (crops converted via
// _make-medallions.py). Junaise + Usman removed per Aidan 7/12.
const TEAM = [
  // row 1 — leadership first
  { slug: "nate-herk",        name: "Nate Herk",        role: "Founder & CEO",                         kind: "medallion" },
  { slug: "jon-morrow",       name: "Jon Morrow",       role: "President & COO",                             kind: "medallion" },
  { slug: "ednan-abdullayev", name: "Ednan Abdullayev", role: "Tech Lead",                       kind: "medallion" },
  { slug: "jenn-van-wagner",  name: "Jenn Van Wagner",  role: "Business Operations Specialist",  kind: "medallion" },
  { slug: "yash-chauhan",     name: "Yash Chauhan",     role: "Community & Retention Manager",   kind: "medallion" },
  // row 2
  { slug: "anne-marie-enns",  name: "Anne-Marie Enns",  role: "Conference Program Director",     kind: "medallion" },
  { slug: "kodi",             name: "Kodi Zene",        role: "Sponsorship Integration",         kind: "medallion" },
  { slug: "russ-henneberry",  name: "Russ Henneberry",  role: "Marketing",                       kind: "medallion" },
  { slug: "pat-blakely",      name: "Pat Blakely",      role: "Writer & Product Manager",        kind: "medallion" },
  // row 3
  { slug: "meghan-cox",       name: "Meghan Cox",       role: "Customer Support",                kind: "medallion" },
  { slug: "aidan-stanik",     name: "Aidan Stanik",     role: "Media & Community",               kind: "medallion" },
  { slug: "mustafa-tawfiq",   name: "Mustafa Tawfiq",   role: "Automation Support Specialist",   kind: "medallion" },
  { slug: "dominic-ibarra",   name: "Dominic Ibarra",   role: "Automation Support Specialist",   kind: "medallion" },
];

const ROWS = [TEAM.slice(0, 5), TEAM.slice(5, 9), TEAM.slice(9, 13)];

// ?v=2 busts stale browser caches from when these files were raw ClickUp crops
const member = (m) => `
          <div class="tm" data-slug="${m.slug}">
            <div class="tm-av ${m.kind}"><img src="assets/headshots/${m.slug}.png?v=2" alt="${m.name}" /></div>
            <div class="tm-nm">${m.name}</div>
            ${m.role ? `<div class="tm-rl">${m.role}</div>` : `<div class="tm-rl tm-rl-empty">&nbsp;</div>`}
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
      .stage{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;background:var(--onyx);
        isolation:isolate;perspective:1600px;perspective-origin:50% 44%;}
      .camera{position:absolute;inset:0;transform-style:preserve-3d;}

      /* ---------- depth background ---------- */
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

      /* ---------- content ---------- */
      .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:20px;padding:44px 100px;text-align:center;}

      .eyebrow{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:var(--size-label);letter-spacing:var(--track-eyebrow);
        text-transform:uppercase;color:var(--blue);text-shadow:var(--glow-eyebrow);will-change:transform,opacity;}

      .ln{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:102px;
        line-height:1.02;letter-spacing:var(--track-tight);}
      .ln .wd{display:inline-block;padding:.08em .13em .24em;will-change:transform,opacity;
        background:var(--grad-chrome);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-chrome);}
      .ln .wd.ac{background:var(--grad-blue);-webkit-background-clip:text;background-clip:text;
        -webkit-text-fill-color:transparent;color:transparent;text-shadow:var(--glow-blue);}

      .rows{display:flex;flex-direction:column;gap:22px;margin-top:4px;}
      .row{display:flex;gap:56px;justify-content:center;}
      .tm{display:flex;flex-direction:column;align-items:center;gap:8px;width:220px;will-change:transform,opacity;}
      .tm-av{width:138px;height:138px;border-radius:50%;position:relative;}
      .tm-av img{width:100%;height:100%;display:block;}
      /* raw square crops get the ring the medallion PNGs already carry baked in */
      .tm-av.crop{overflow:hidden;border:3px solid var(--blue);background:var(--onyx-deep);
        box-shadow:0 0 26px rgba(var(--blue-rgb),.35);}
      .tm-av.crop img{object-fit:cover;border-radius:50%;}
      .tm-av.medallion{filter:drop-shadow(0 0 18px rgba(var(--blue-rgb),.30));}
      .tm-nm{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);font-size:25px;color:var(--white);
        line-height:1.1;}
      .tm-rl{font-family:var(--font-mono);font-weight:var(--wt-bold);font-size:14px;letter-spacing:.16em;
        text-transform:uppercase;color:var(--text-faint);line-height:1.3;max-width:220px;}

      .sub{font-family:var(--font-body);font-weight:var(--wt-light);font-style:italic;font-size:32px;
        color:var(--text-dim);will-change:transform,opacity;margin-top:6px;}

      /* persistent corner mark */
      .backdrop-mark{position:absolute;right:72px;bottom:60px;display:inline-flex;z-index:6;}
      .mark{font-family:var(--font-display);font-style:italic;font-weight:var(--wt-black);letter-spacing:var(--track-tight);
        line-height:.9;font-size:80px;display:inline-flex;align-items:baseline;position:relative;}
      .mark .ais{color:var(--white);}
      .mark .gap{display:inline-block;width:.08em;}
      .live{position:relative;color:var(--blue);text-shadow:0 0 60px rgba(var(--blue-rgb),.55);padding-right:.28em;}
      .dot{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:var(--red-live);box-shadow:0 0 .7em var(--red-live),0 0 .25em var(--red-live);}
    </style>
  </head>
  <body>
    <div id="ais-live-closing-team" class="stage clip" data-composition-id="ais-live-closing-team"
      data-start="0" data-duration="18" data-track-index="0" data-width="1920" data-height="1080">
      <div class="camera">
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
        <div class="inner">
          <div class="eyebrow">THE PEOPLE BEHIND AIS LIVE</div>
          <div class="ln"><span class="wd">THANK</span><span class="wd">YOU,</span><span class="wd ac">AIS</span><span class="wd ac">TEAM</span></div>
          <div class="rows">
${ROWS.map((r) => `            <div class="row">${r.map(member).join("")}
            </div>`).join("\n")}
          </div>
          <div class="sub">The team that made AIS LIVE happen</div>
        </div>
      </div>
    </div>

    <script>
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });

      // ambient (whole duration)
      tl.to(".grid-floor",   { backgroundPosition: "0px 660px", duration: 18, ease: "none" }, 0);
      tl.to(".grid-ceiling", { backgroundPosition: "0px -660px", duration: 18, ease: "none" }, 0);
      tl.fromTo(".beam", { rotate: -4 }, { rotate: 4, duration: 9, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
      tl.fromTo(".glow.blue", { scale: .96 }, { scale: 1.06, duration: 6, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0);
      tl.to(".dot", { opacity: .25, duration: .5, ease: "sine.inOut", yoyo: true, repeat: 17 }, 0);
      // camera drift rides the BACKGROUND only — text layer stays pin-sharp
      tl.fromTo(".bg", { scale: 1.04 }, { scale: 1.0, duration: 18, ease: "none" }, 0);

      // headline in
      tl.fromTo(".eyebrow", { opacity: 0, y: 26, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: .55 }, 0.25);
      tl.fromTo(".ln .wd", { opacity: 0, y: 60, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: .6, stagger: .11 }, 0.45);

      // medallions — staggered 3D pop, row by row
      tl.fromTo(".tm", { opacity: 0, y: 44, scale: .78 },
        { opacity: 1, y: 0, scale: 1, duration: .55, ease: "back.out(1.6)", stagger: { each: .07, from: "start" } }, 1.05);

      // thank-you sub
      tl.fromTo(".sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6 }, 2.4);

      // gentle idle float on the medallions during the hold
      tl.to(".tm-av", { y: -5, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: 4, stagger: { each: .12, yoyo: true } }, 3.2);

      // breathing outro hold to 18s
      tl.set({}, {}, 18);

      window.__timelines = window.__timelines || {};
      window.__timelines["ais-live-closing-team"] = tl;
    </script>
  </body>
</html>
`;

writeFileSync(join(DIR, "index.html"), html);
console.log(`index.html written — ${TEAM.length} members, 3 rows (5/4/4), 18s`);
