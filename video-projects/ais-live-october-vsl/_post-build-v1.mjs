// Post-build patch for build-beats.mjs output (see build-beats-inline-gotchas memory).
// Run from workspace root AFTER build-beats: node video-projects/ais-live-october-vsl/_post-build.mjs
import { readFileSync, writeFileSync } from "node:fs";

const DIR = "video-projects/ais-live-october-vsl";
const FILE = `${DIR}/index.html`;
const VIDEO_DUR = "508.474";
const plan = JSON.parse(readFileSync(`${DIR}/assets/beat-plan.json`, "utf8"));
let html = readFileSync(FILE, "utf8");

// Beat modes (1-based index): how each graphic interacts with the shot (CAIC kit).
// takeover = video whips off, card owns frame. sidepanel = video shifts right,
// scrim panel slides in from the left, speaker stays visible. pip = video drops
// into a rounded bottom-left corner over the card. flash = zoom-through.
const MODES = {
  1: "takeover", 2: "takeover", 3: "pip",
  4: "sidepanel",  // departments agenda
  5: "sidepanel",  // new economics
  6: "sidepanel",  // tools vs AI OS
  7: "sidepanel",  // prompt/automation/AI OS ladder
  8: "flash",      // STARTING A BUSINESS mark
  9: "sidepanel",  // team behind what you sell
  10: "flash",     // SCALING mark
  11: "sidepanel", // 2x revenue 2x headaches
  12: "sidepanel", // find the real constraint
  13: "sidepanel", // division of labor agenda
  14: "sidepanel", // every session must answer
  15: "sidepanel", // two paths tracks
  16: "sidepanel", // you leave knowing tracks
  17: "pip", 18: "pip", 19: "takeover",
  20: "sidepanel", // how the guarantee works agenda
  21: "sidepanel", // save minutes or redesign
  22: "takeover",
};
const modeOf = (id) => MODES[parseInt(id.slice(4), 10)] || "takeover";

// 1. merge duplicate class attributes on beat wrappers
html = html.replaceAll(
  `class="stage" data-width="1920" data-height="1080" class="beat-layer clip"`,
  `class="stage beat-layer clip" data-width="1920" data-height="1080"`
);

// 2. video src (build ran from workspace root) + full-duration pad
html = html.replaceAll(`src="../../assets/clean.mp4"`, `src="assets/clean.mp4"`);
html = html.replace(/(<(?:video|audio)[^>]*data-duration=")[\d.]+(")/g, `$1${VIDEO_DUR}$2`);
html = html.replace(/MT\.set\(\{\}, \{\}, [\d.]+\);/, `MT.set({}, {}, ${VIDEO_DUR});`);

// 3. data-anchor per beat (plan order == beat order)
plan.beats.forEach((b, i) => {
  const id = `beat${String(i + 1).padStart(3, "0")}`;
  const esc = b.anchor.replace(/"/g, "&quot;");
  html = html.replace(`<div id="${id}" class="stage beat-layer clip"`, `<div id="${id}" class="stage beat-layer clip" data-anchor="${esc}"`);
});

// 4. per-beat script scoping + streak removal + countUp targets
const parts = html.split(/(<script>)/);
let scoped = 0;
for (let i = 0; i < parts.length; i++) {
  const m = parts[i].match(/window\.__beatTimelines\["(beat\d+)"\] = tl;/);
  if (!m) continue;
  const beatId = m[1];
  const idx = parseInt(beatId.slice(4), 10) - 1;
  const beat = plan.beats[idx];
  let s = parts[i];

  s = s.replace(
    "const tl = gsap.timeline();",
    `const tl = gsap.timeline();\n      const ROOT = document.getElementById("${beatId}");\n      const $ = sel => ROOT.querySelectorAll(sel);`
  );
  s = s.replaceAll('document.querySelectorAll(".ln[data-split]")', 'ROOT.querySelectorAll(".ln[data-split]")');
  s = s.replaceAll("document.querySelector(sel)", "ROOT.querySelector(sel)");
  s = s.replace(/\btl\.(to|from|fromTo)\("((?:[^"\\]|\\.)+)"/g, (_, fn, sel) => `tl.${fn}($("${sel}")`);
  s = s.replaceAll("tl.fromTo(sel,", "tl.fromTo($(sel),");
  s = s.replaceAll("tl.to(sel,", "tl.to($(sel),");

  // no light-streak lines (Aidan 8/31): drop every streak() scene call
  s = s.replace(/^\s*streak\([^)]*\);\s*$/gm, "");

  // stat cards: retarget the baked countUp from the plan's stat slot ($$420K -> 420/K/$)
  if (beat?.slots?.stat) {
    const val = beat.slots.stat.replaceAll("$$", "$");
    const mm = val.match(/^\$?([\d.]+)(\D*)$/);
    if (mm) {
      const prefix = val.startsWith("$") ? "$" : "";
      s = s.replace(/countUp\("#num",\s*([\d.]+),\s*[\d.]+,\s*([\d.]+),\s*"[^"]*"(?:,\s*"[^"]*")?\);/,
        `countUp("#num", $1, ${mm[1]}, $2, "${mm[2]}", "${prefix}");`);
    }
  }
  parts[i] = s;
  scoped++;
}
html = parts.join("");

// 5. row-card content (fills bypass these baked structures) — scope to each beat's block
function inBeat(id, fn) {
  const start = html.indexOf(`<div id="${id}" `);
  const next = html.indexOf(`<div id="beat${String(parseInt(id.slice(4), 10) + 1).padStart(3, "0")}" `);
  const end = next === -1 ? html.length : next;
  html = html.slice(0, start) + fn(html.slice(start, end)) + html.slice(end);
}
// agenda-card row filler (repurposes the label + text columns); strips the
// baked rows the fill leaves empty (the card template bakes more rows than
// most beats use — an empty agrow still renders as a blank staggered row)
const fillAgenda = (rows) => (s) => {
  let n = 0;
  s = s.replace(/(<span[^>]*class="agt"[^>]*>)[^<]*(<\/span>)(<span[^>]*class="agl"[^>]*>)[^<]*(<\/span>)/g,
    (_, a, b, c, d) => { const r = rows[n++] || ["", ""]; return a + r[0] + b + c + r[1] + d; });
  return s.replace(/<div[^>]*class="agrow"[^>]*><span[^>]*class="agt"[^>]*><\/span><span[^>]*class="agl"[^>]*><\/span><\/div>\s*/g, "");
};
// tracks-card row filler + strip baked rows the fill leaves empty (stray ›)
const fillTracks = (rows) => (s) => {
  let n = 0;
  s = s.replace(/(<span[^>]*class="tlabel"[^>]*>)[^<]*(<\/span>)/g, (_, a, b) => a + (rows[n++] || "") + b);
  return s.replace(/<div[^>]*class="trow"[^>]*><span[^>]*class="tarr"[^>]*>[^<]*<\/span><span[^>]*class="tlabel"[^>]*><\/span><\/div>\s*/g, "");
};

// beat004 = departments agenda: card bakes 3 rows, this beat needs 5 —
// clone one row twice (single-line regex: must not swallow sibling rows)
inBeat("beat004", s => {
  const row = s.match(/<div[^>]*class="agrow"[^>]*>.*?<\/div>/)[0];
  s = s.replace(row, row + row + row);
  return fillAgenda([
  ["CONTENT", "Ideas and expertise into finished assets"],
  ["MARKETING", "Research, build, test, analyze campaigns"],
  ["SALES", "Prep, prospect context, momentum"],
  ["OPS", "Decisions, processes, meetings"],
  ["RECRUITING", "Roles defined, candidates evaluated"],
  ])(s);
});
// beat007 = prompt/automation/AI OS ladder
inBeat("beat007", fillAgenda([
  ["PROMPT", "Completes one task"],
  ["AUTOMATION", "Connects a few steps"],
  ["AI OS", "Context, memory, agents, workflows in one system"],
]));
// beat013 = agenda (division of labor)
inBeat("beat013", fillAgenda([
  ["PEOPLE", "Judgment, relationships, creativity, leadership"],
  ["AI OS", "Research, first drafts, follow-ups, reporting"],
  ["RESULT", "Revenue grows faster than headcount"],
]));
// beat014 = every session must answer
inBeat("beat014", fillAgenda([
  ["01", "What does this system accomplish?"],
  ["02", "What work does it remove or accelerate?"],
  ["03", "Where is human judgment still essential?"],
]));
// beat015 = tracks (two paths)
inBeat("beat015", fillTracks([
  "START TRACK · your first AI OS, installed free",
  "SCALE TRACK · capacity across your whole team",
]));
// beat016 = you leave knowing
inBeat("beat016", fillTracks([
  "WHAT TO BUILD",
  "WHY IT MATTERS",
  "WHAT COMES FIRST",
]));
// beat020 = how the guarantee works
inBeat("beat020", fillAgenda([
  ["ATTEND", "Day one plus most of day two"],
  ["DECIDE", "Email before the last session on day two"],
  ["REFUND", "Full ticket price, no questions asked"],
]));
// beat018 = VIP stat: sub is longer than the GA card's and collides with the
// bottom-left speaker PIP — cap width so it wraps to two centered lines
inBeat("beat018", s =>
  s.replace(/class="sub" data-slot="sub"(?![^>]*style=)/,
    'class="sub" data-slot="sub" style="max-width:700px;white-space:normal;margin-left:auto;margin-right:auto"'));

// 6. card transitions, per mode. takeover/pip/flash keep the AIS whip;
// sidepanel slides in with the scrim (CAIC clearLeft feel).
// chained beats (gap < 0.8s): hold the outgoing card until the next card's
// entry so the handoff never exposes a bare/black frame between cards
const chainExit = {};
plan.beats.forEach((b, i) => {
  const next = plan.beats[i + 1];
  if (next && next.start - (b.start + b.duration) < 0.8) {
    const id = `beat${String(i + 1).padStart(3, "0")}`;
    chainExit[id] = next.start;
    // stretch the clip window to the handoff point or the framework hides the
    // card before the delayed exit whip plays (same track: touch, not overlap)
    html = html.replace(
      new RegExp(`(id="${id}"[^>]*data-duration=")[\\d.]+(")`),
      `$1${+(next.start - b.start).toFixed(3)}$2`
    );
  }
});
html = html.replace(
  /MT\.fromTo\("#(beat\d+)", \{ opacity: 0 \}, \{ opacity: 1, duration: [\d.]+, ease: "power2\.out" \}, ([\d.]+)\);/g,
  (_, id, at) => {
    if (modeOf(id) === "sidepanel")
      return `MT.fromTo("#${id}", { autoAlpha: 0, xPercent: -70 }, { autoAlpha: 1, xPercent: 0, duration: 0.6, ease: "power3.inOut" }, ${at});`;
    const dir = parseInt(id.slice(4), 10) % 2 === 0 ? 1 : -1;
    return `MT.fromTo("#${id}", { autoAlpha: 0, xPercent: ${dir * -55}, filter: "blur(26px)" }, { autoAlpha: 1, xPercent: 0, filter: "blur(0px)", duration: 0.3, ease: "power3.out" }, ${at});`;
  }
);
html = html.replace(
  /MT\.to\("#(beat\d+)", \{ opacity: 0, duration: [\d.]+, ease: "power2\.in" \}, ([\d.]+)\);/g,
  (_, id, at) => {
    if (modeOf(id) === "sidepanel") {
      const t = chainExit[id] != null ? (chainExit[id] - 0.55).toFixed(2) : at;
      return `MT.to("#${id}", { autoAlpha: 0, xPercent: -70, duration: 0.55, ease: "power3.inOut" }, ${t});`;
    }
    const dir = parseInt(id.slice(4), 10) % 2 === 0 ? 1 : -1;
    const t = chainExit[id] != null ? (chainExit[id] - 0.26).toFixed(2) : at;
    let out = `MT.to("#${id}", { autoAlpha: 0, xPercent: ${dir * 55}, filter: "blur(26px)", duration: 0.26, ease: "power3.in" }, ${t});`;
    if (chainExit[id] != null) out += ` MT.set("#${id}", { autoAlpha: 0 }, ${chainExit[id]});`;
    return out;
  }
);

// 7. shot motion, per mode (chain-aware)
const CHAIN_GAP = 0.8;
const PIP = { scale: 0.26, x: 64, y: -64, r: 20, shadow: "0 24px 80px rgba(0,0,0,.55)" };
let vt = "\n  /* shot motion (CAIC kit) */\n";
plan.beats.forEach((b, i) => {
  const id = `beat${String(i + 1).padStart(3, "0")}`;
  const mode = modeOf(id);
  const dir = (i + 1) % 2 === 0 ? 1 : -1;
  const S = b.start, E = b.start + b.duration;
  const prev = plan.beats[i - 1], next = plan.beats[i + 1];
  const chainedIn = prev && (S - (prev.start + prev.duration)) < CHAIN_GAP;
  const chainedOut = next && (next.start - E) < CHAIN_GAP;
  const V = `"#video-stage"`;
  if (mode === "flash") {
    if (!chainedIn) vt += `  MT.to(${V}, { scale: 1.1, filter: "blur(16px)", duration: 0.3, ease: "power2.inOut" }, ${S - 0.05});\n`;
    if (!chainedOut) vt += `  MT.to(${V}, { scale: 1, filter: "blur(0px)", duration: 0.34, ease: "power2.out" }, ${E - 0.3});\n`;
  } else if (mode === "sidepanel") {
    vt += `  MT.to(${V}, { x: 380, duration: 0.65, ease: "power3.inOut" }, ${S - 0.1});\n`;
    vt += `  MT.to(${V}, { x: 0, duration: 0.65, ease: "power3.inOut" }, ${E - 0.55});\n`;
  } else if (mode === "pip") {
    let flyAt = S - 0.02;
    if (chainedIn) {
      // video is parked off-frame + blurred from the previous takeover: re-seat it
      // off the right edge while the takeover card still covers the frame, then fly
      // it into the corner overlapping that card's exit (no exposed parked frame)
      const prevE = prev.start + prev.duration;
      vt += `  MT.set(${V}, { transformOrigin: "0% 100%", xPercent: 0, x: 1940, y: 0, scale: 0.9, filter: "blur(0px)" }, ${prevE - 0.45});\n`;
      flyAt = prevE - 0.05;
    } else {
      vt += `  MT.set(${V}, { transformOrigin: "0% 100%" }, ${S - 0.06});\n`;
    }
    vt += `  MT.to(${V}, { x: ${PIP.x}, y: ${PIP.y}, scale: ${PIP.scale}, borderRadius: ${PIP.r}, boxShadow: "${PIP.shadow}", filter: "blur(0px)", duration: 0.5, ease: "power3.inOut" }, ${flyAt});\n`;
    vt += `  MT.set(${V}, { zIndex: 30 }, ${flyAt});\n`;
    vt += `  MT.to(${V}, { x: 0, y: 0, scale: 1, borderRadius: 0, boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.5, ease: "power3.inOut" }, ${E - 0.45});\n`;
    vt += `  MT.set(${V}, { zIndex: "auto", transformOrigin: "50% 50%" }, ${E + 0.1});\n`;
  } else { // takeover
    if (!chainedIn) vt += `  MT.to(${V}, { xPercent: ${dir * 58}, scale: 0.93, filter: "blur(20px)", duration: 0.36, ease: "power3.inOut" }, ${S - 0.06});\n`;
    if (!chainedOut) {
      vt += `  MT.set(${V}, { xPercent: ${dir * -58} }, ${E - 0.34});\n`;
      vt += `  MT.to(${V}, { xPercent: 0, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power3.out" }, ${E - 0.32});\n`;
    }
  }
});
html = html.replace(/(\n\s*MT\.set\(\{\}, \{\}, [\d.]+\);)/, vt + "$1");

// 8. video-stage plumbing: onyx backfill, rounded-corner clipping for PIP
html = html.replace(
  "#video-stage { position: absolute; inset: 0; }",
  "#video-stage { position: absolute; inset: 0; overflow: hidden; } html, body { background: #040A11; }"
);

// 9. sidepanel layout: transparent card over the shifted video, scrim gradient,
// content scaled into the left 42%, ambient/mark hidden
let panelCss = "\n<style>\n";
for (const [n, mode] of Object.entries(MODES)) {
  if (mode !== "sidepanel") continue;
  const id = `beat${String(n).padStart(3, "0")}`;
  panelCss += `#${id}{background:none;}\n`;
  panelCss += `#${id} .bg,#${id} .vignette,#${id} .backdrop-mark,#${id} .grain{display:none;}\n`;
  panelCss += `#${id}::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,10,17,1) 0%,rgba(4,10,17,1) 30%,rgba(4,10,17,.85) 46%,rgba(4,10,17,0) 74%);}\n`;
  panelCss += `#${id} .inner{position:absolute;left:0;top:0;height:100%;width:46%;padding-left:5%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;text-align:left;transform:scale(.62);transform-origin:12% 50%;}\n`;
}
panelCss += "</style>\n";
html = html.includes("</head>")
  ? html.replace("</head>", panelCss + "</head>")
  : html.replace('<div id="ais-live-october-vsl"', panelCss + '<div id="ais-live-october-vsl"');

writeFileSync(FILE, html);
const whips = (html.match(/filter: "blur\(26px\)"/g) || []).length;
const panels = (html.match(/xPercent: -70/g) || []).length;
const pips = (html.match(/borderRadius: 20/g) || []).length;
console.log(`scoped ${scoped} beats | whip tweens ${whips} | sidepanel tweens ${panels} | pip flights ${pips}`);
