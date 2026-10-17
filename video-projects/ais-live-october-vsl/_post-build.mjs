// Post-build patch for the v2 (ais-live-v2) build of the October VSL.
// Run from workspace root AFTER build-beats: node video-projects/ais-live-october-vsl/_post-build.mjs
// v2 cards are SELF-SCOPING, so there is NO script rewriting here — only modes,
// fills, transitions, and layout CSS. Beat MODES live in beat-plan.json
// ("mode" per beat); fills below are keyed by anchor so beat renumbering is safe.
import { readFileSync, writeFileSync } from "node:fs";

const DIR = "video-projects/ais-live-october-vsl";
const FILE = `${DIR}/index.html`;
const VIDEO_DUR = "508.474";
const plan = JSON.parse(readFileSync(`${DIR}/assets/beat-plan.json`, "utf8"));
let html = readFileSync(FILE, "utf8");

const beatId = (i) => `beat${String(i + 1).padStart(3, "0")}`;
const modeOfIdx = (i) => plan.beats[i]?.mode || "takeover";
const modeOfId = (id) => modeOfIdx(parseInt(id.slice(4), 10) - 1);
const idByAnchor = (a) => {
  const i = plan.beats.findIndex((b) => b.anchor === a);
  if (i === -1) throw new Error(`no beat with anchor: ${a}`);
  return beatId(i);
};

// 1. merge duplicate class attributes on beat wrappers
html = html.replaceAll(
  `class="stage" data-width="1920" data-height="1080" class="beat-layer clip"`,
  `class="stage beat-layer clip" data-width="1920" data-height="1080"`
);
html = html.replaceAll(
  `data-width="1920" data-height="1080" class="beat-layer clip"`,
  `class="beat-layer clip" data-width="1920" data-height="1080"`
);

// 2. video src (build ran from workspace root) + full-duration pad
html = html.replaceAll(`src="../../assets/clean.mp4"`, `src="assets/clean.mp4"`);
html = html.replace(/(<(?:video|audio)[^>]*data-duration=")[\d.]+(")/g, `$1${VIDEO_DUR}$2`);
html = html.replace(/MT\.set\(\{\}, \{\}, [\d.]+\);/, `MT.set({}, {}, ${VIDEO_DUR});\n    /* cap nested ambient loops at the video end: card sparkle/pulse repeats are sized to the\n       card's standalone DUR, so a short beat near the tail would otherwise stretch the comp\n       past the video (12s of black on the 9/1 render). Trims repeat counts only. */\n    (function capLoops(limit){ const walk=(t,base)=>{ t.getChildren(false,true,true).forEach(c=>{ const st=base+c.startTime(); if(c.getChildren){ walk(c,st); return; } if(st+c.totalDuration()>limit && c.repeat()>0){ const cyc=c.duration()+c.repeatDelay(); c.repeat(Math.max(0,Math.floor((limit-st-c.duration())/cyc))); } }); }; walk(MT,0); })(${VIDEO_DUR});`);

// 3. data-anchor per beat (plan order == beat order)
plan.beats.forEach((b, i) => {
  const id = beatId(i);
  const esc = b.anchor.replace(/"/g, "&quot;");
  html = html.replace(`<div id="${id}" class="stage beat-layer clip"`, `<div id="${id}" class="stage beat-layer clip" data-anchor="${esc}"`);
  html = html.replace(`<div id="${id}" class="beat-layer clip"`, `<div id="${id}" class="beat-layer clip" data-anchor="${esc}"`);
});

// ---- scoped beat-block editing --------------------------------------------
function inBeat(id, fn) {
  const start = html.indexOf(`<div id="${id}" `);
  if (start === -1) return;
  const next = html.indexOf(`<div id="${beatId(parseInt(id.slice(4), 10))}" `);
  const end = next === -1 ? html.length : next;
  html = html.slice(0, start) + fn(html.slice(start, end)) + html.slice(end);
}
const inAnchor = (a, fn) => inBeat(idByAnchor(a), fn);

// 4. stat cards: retarget the baked countUp + static num text from the plan
{
  const parts = html.split(/(<script>)/);
  for (let i = 0; i < parts.length; i++) {
    const m = parts[i].match(/window\.__beatTimelines\["(beat\d+)"\] = tl;/);
    if (!m) continue;
    const beat = plan.beats[parseInt(m[1].slice(4), 10) - 1];
    if (!beat?.slots?.stat) continue;
    const val = beat.slots.stat.replaceAll("$$", "$");
    const mm = val.match(/^\$?([\d.]+)(\D*)$/);
    if (!mm) continue;
    const prefix = val.startsWith("$") ? "$" : "";
    parts[i] = parts[i].replace(
      /countUp\("#num",\s*([\d.]+),\s*[\d.]+,\s*([\d.]+),\s*"[^"]*"(?:,\s*"[^"]*")?\);/,
      `countUp("#num", $1, ${mm[1]}, $2, "${mm[2]}", "${prefix}");`
    );
  }
  html = parts.join("");
}
plan.beats.forEach((b, i) => {
  if (!b?.slots?.stat) return;
  inBeat(beatId(i), (s) => s.replace(/(<span class="num" id="num">)[^<]*(<\/span>)/, (_, a, c) => a + b.slots.stat.replaceAll("$$", "$") + c));
});

// 5. row-card fills (icons + labels + word-synced pop times)
const popRow = ([icon, label, at]) =>
  `<div class="popwrap" data-at="${at ?? 0}"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="${icon}"></span></span><span class="cl">${label}</span></div>`;
const fillPops = (rows) => (s) => {
  let n = 0;
  return s.replace(/<div class="popwrap"[^>]*>.*?<\/div>/g, () => popRow(rows[n++] || ["", "", 0]));
};
// data-at = wordStart - beatStart - 0.15 (enter just before the word)
inAnchor("plan what to do next", fillPops([
  ["compass", "PLAN", 0.27], ["doc", "CONTENT", 1.45], ["megaphone", "MARKET OFFERS", 2.39],
  ["mail", "FOLLOW-UPS", 3.27], ["gear", "DAY-TO-DAY", 4.67],
]));
inAnchor("our own content", fillPops([
  ["doc", "CONTENT", 0.25], ["megaphone", "MARKETING", 0.99], ["target", "SALES", 1.55],
  ["gear", "OPERATIONS", 1.95], ["userplus", "RECRUITING", 3.23],
]));
inAnchor("an email faster", fillPops([
  ["mail", "EMAILS", 0.23], ["doc", "SUMMARIES", 1.13], ["bulb", "IDEAS", 2.21],
  ["clock", "SPARE MINUTES", 3.61], ["", "", 0],
]));
inAnchor("knows what matters", fillPops([
  ["layers", "WHAT MATTERS", 0.15], ["target", "GOALS", 2.09], ["flag", "PRIORITIES", 2.61],
  ["briefcase", "ITS ROLE", 4.01], ["repeat", "PROCESSES", 6.29],
]));
inAnchor("capabilities in content", fillPops([
  ["doc", "CONTENT", 0.65], ["megaphone", "MARKETING", 1.37], ["target", "SALES", 1.97],
  ["briefcase", "ADMIN", 2.39], ["gear", "OPERATIONS", 3.49],
]));
inAnchor("marketing", fillPops([
  ["megaphone", "MARKETING", 0.15], ["doc", "CONTENT", 0.67], ["target", "SALES", 1.33],
  ["gear", "OPERATIONS", 1.71], ["userplus", "RECRUITING", 2.75],
]));
inAnchor("time on judgment", fillPops([
  ["scales", "JUDGMENT", 0.82], ["heart", "RELATIONSHIPS", 1.54], ["spark", "CREATIVITY", 2.2],
  ["flag", "LEADERSHIP", 2.86], ["", "", 0],
]));
inAnchor("both days", fillPops([
  ["calendar", "BOTH DAYS", 0.15], ["flag", "START + SCALE", 1.59], ["bot", "LIVE DEMOS", 3.71],
  ["users", "GUIDANCE", 5.77], ["repeat", "7-DAY REPLAY", 6.71],
]));
inAnchor("permanent access", fillPops([
  ["key", "PERMANENT RECORDINGS", 0.15], ["users", "PRIVATE Q&AS", 2.47], ["building", "EVERY DEPARTMENT", 4.61],
  ["", "", 0], ["", "", 0],
]));
inAnchor("content or marketing or sales", fillPops([
  ["doc", "CONTENT", 0.1], ["megaphone", "MARKETING", 0.75], ["target", "SALES", 1.25],
  ["userplus", "RECRUITING", 1.95], ["gear", "OPERATIONS", 2.45],
]));
inAnchor("current ticket price", fillPops([
  ["ticket", "CURRENT PRICE", 0.1], ["clock", "PRICE DEADLINE", 1.05], ["doc", "FULL BENEFITS", 2.85],
  ["down", "BELOW THIS VIDEO", 4.15], ["", "", 0],
]));
inAnchor("no questionnaire", fillPops([
  ["doc", "NO QUESTIONNAIRE", 0.1], ["repeat", "NO HOOPS", 0.75], ["shield", "NO QUESTIONS ASKED", 1.95],
  ["", "", 0], ["", "", 0],
]));

// versus rows: 4 left then 4 right in DOM order — [icon, label]
const fillVersus = (rows) => (s) => {
  let n = 0;
  return s.replace(/(<div class="vrow"><span class="chip"><span class="ic" data-icon=")[^"]*("><\/span><\/span><span class="vlabel">)[^<]*(<\/span><\/div>)/g,
    (_, a, b, c) => { const r = rows[n++] || ["", ""]; return a + r[0] + b + r[1] + c; });
};
inAnchor("AI should carry more of the", fillVersus([
  ["scales", "Judgment"], ["heart", "Relationships"], ["spark", "Creativity"], ["flag", "Leadership"],
  ["search", "Research + prep"], ["pen", "First drafts"], ["repeat", "Follow-ups"], ["chartup", "Reporting"],
]));

// checklist rows — fill labels; optionally swap the check for a mono number
const CHECK_SVG = `<svg viewBox="0 0 24 24"><path d="M4 12.5l5.5 5.5L20 6.5" pathLength="100"/></svg>`;
const fillChecklist = (rows, numbered) => (s) => {
  let n = 0;
  return s.replace(/(<div class="crow"><span class="cbox">)[\s\S]*?(<\/span><span class="clabel">)[^<]*(<\/span><\/div>)/g,
    (_, a, b, c) => {
      const r = rows[n++];
      if (!r) return a + CHECK_SVG + b + c; // blank -> pruned at runtime
      const box = numbered ? `<span class="cnum">${String(n).padStart(2, "0")}</span>` : CHECK_SVG;
      return a + box + b + r + c;
    });
};
inAnchor("Every session has to answer", fillChecklist([
  "What does this system accomplish?",
  "What work does it remove or accelerate?",
  "What context does it need?",
  "Where is human judgment still essential?",
  "Start or scale with fewer people?",
], true));
// "knowing what to build" checklist keeps its baked 3 labels; blanks prune

// ladder steps — [icon, LABEL, desc, at?], 3 baked; at -> data-at (word-synced entrance)
const stepRow = ([icon, label, desc, at]) =>
  `<div class="step"${at != null ? ` data-at="${at}"` : ""}><span class="chip"><span class="ic" data-icon="${icon}"></span></span><span class="stx"><span class="st">${label}</span><span class="sd">${desc}</span></span></div>`;
const fillLadder = (rows) => (s) => {
  let n = 0;
  return s.replace(/<div class="step"[^>]*><span class="chip">.*?<\/span><\/span><\/div>/g, () => stepRow(rows[n++] || ["", "", ""]));
};
inAnchor("give you the architecture", fillLadder([
  ["layers", "THE ARCHITECTURE", "The full blueprint of your AI OS"],
  ["target", "WHERE TO START", "The highest-leverage first move"],
  ["bolt", "FIRST SYSTEM, LIVE", "Activated before you leave"],
]));
// tools-vs-systems ladder enters on the spoken words (prompt / automation / AI OS)
inAnchor("A prompt helps", fillLadder([
  ["pen", "PROMPT", "Completes one task", 0.15],
  ["repeat", "AUTOMATION", "Connects a few steps", 1.85],
  ["bot", "AI OS", "Context, memory, agents, workflows in one system", 3.65],
]));

// icon-row chips — [icon, LABEL]
const fillChips = (rows) => (s) => {
  let n = 0;
  return s.replace(/<div class="chipwrap">.*?<\/div>/g, () => {
    const r = rows[n++] || ["", ""];
    return `<div class="chipwrap"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="${r[0]}"></span></span><span class="cl">${r[1]}</span></div>`;
  });
};
inAnchor("follow the start or the scale", fillChips([
  ["flag", "START TRACK"], ["chartup", "SCALE TRACK"], ["", ""], ["", ""], ["", ""],
]));

// agenda-icon rows — [icon, LABEL, desc, at?], 5 baked; at -> data-at (word-synced entrance)
const agRow = ([icon, label, desc, at]) =>
  `<div class="agrow"${at != null ? ` data-at="${at}"` : ""}><span class="chip"><i class="sheen"></i><span class="ic" data-icon="${icon}"></span></span><span class="agt">${label}</span><span class="agl">${desc}</span></div>`;
const fillAgendaRows = (rows) => (s) => {
  let n = 0;
  return s.replace(/<div class="agrow"[^>]*><span class="chip">.*?<span class="agl">[^<]*<\/span><\/div>/g, () => agRow(rows[n++] || ["", "", ""]));
};
// departments agenda rides the 1:14-1:41 read; each row lands on its department
inAnchor("our content systems", fillAgendaRows([
  ["doc", "CONTENT", "Ideas and expertise into finished assets", 0.4],
  ["megaphone", "MARKETING", "Research, build, test, analyze campaigns", 4.05],
  ["target", "SALES", "Prep, prospect context, momentum", 8.45],
  ["gear", "OPS", "Decisions, processes, meetings", 13.35],
  ["userplus", "RECRUITING", "Roles defined, candidates evaluated", 20.25],
]));
inAnchor("active AIS Plus member", fillAgendaRows([
  ["ticket", "MONTHLY", "General admission included"],
  ["key", "ANNUAL", "VIP included"],
  ["", "", ""], ["", "", ""], ["", "", ""],
]));

// 6. card transitions, per mode. overlay keeps build-beats' gentle fade;
// takeover/pip/flash get the alternating motion-blur whip; sidepanel TEXT
// slides in over the ONE global scrim (#sp-scrim — sections 7/8 own the
// scrim + video motion). Covering cards chained (gap < 0.8s, both non-overlay)
// hold until the next card enters so no bare frame shows between them.
const CHAIN_GAP = 0.8;
const chainExit = {};
const chainNextMode = {};
const beatEnd = (id) => { const b = plan.beats[parseInt(id.slice(4), 10) - 1]; return b.start + b.duration; };
// sidepanel content-panel scale (two-paths has only 2 chips — let them breathe)
const panelScale = (id) => plan.beats[parseInt(id.slice(4), 10) - 1].anchor === "follow the start or the scale" ? ".78" : ".62";
// sidepanel text timing: enters SP_TEXT_IN after S (scrim mostly in), leaves
// SP_TEXT_OUT before X (the exit point: next chained card's start, else E).
// Inside a sidepanel -> sidepanel pair the video and scrim never move, so the
// text hands off instantly instead: card 1 finishes leaving exactly as card 2
// starts arriving (a 0.6 lead + 0.1 delay would leave the panel empty ~0.5s).
const SP_TEXT_IN = 0.1, SP_TEXT_DUR_OUT = 0.4;
// The card text used to start leaving 0.35s AFTER the gradient did, so it
// lingered on an emptying panel. It now rides the EXACT scrim exit window.
// These must stay equal to SCRIM.outLead / SCRIM.dur (asserted in section 7).
const SP_OUT_LEAD = 0.95, SP_OUT_DUR = 0.9;
const spPairIn = {}, spPairOut = {};
plan.beats.forEach((b, i) => {
  const next = plan.beats[i + 1];
  if (!next || b.mode === "overlay" || next.mode === "overlay") return;
  // pip cards never chain-hold: the corner video expands OVER the card (z 30)
  // before the hold ends, and the card flashes back once z restores. Let pip
  // cards exit on their own clock; the next beat enters on bare video.
  if (b.mode === "pip") return;
  if (next.start - (b.start + b.duration) < CHAIN_GAP) {
    const id = beatId(i);
    chainExit[id] = next.start;
    chainNextMode[id] = next.mode || "takeover";
    if (b.mode === "sidepanel" && next.mode === "sidepanel") { spPairOut[id] = true; spPairIn[beatId(i + 1)] = true; }
    // sidepanel -> sidepanel pairs share the global scrim: card 1 simply holds
    // until card 2 starts and only the text hands off (section 7 skips the
    // scrim + video tweens inside the pair via inChain/outChain).
    const dur = next.start - b.start;
    html = html.replace(
      new RegExp(`(id="${id}"[^>]*data-duration=")[\\d.]+(")`),
      `$1${+dur.toFixed(3)}$2`
    );
  }
});
html = html.replace(
  /MT\.fromTo\("#(beat\d+)", \{ opacity: 0 \}, \{ opacity: 1, duration: [\d.]+, ease: "power2\.out" \}, ([\d.]+)\);/g,
  (line, id, at) => {
    const mode = modeOfId(id);
    if (mode === "overlay") return line; // chips animate themselves
    if (mode === "sidepanel") {
      // the wrapper itself is transparent (bg/vignette/mark hidden, no scrim of
      // its own): reveal it, then slide only the text panel in over the global
      // scrim. scale is re-asserted so the transform tween can never drop the
      // CSS panel scale.
      const ps = panelScale(id);
      const inAt = +(parseFloat(at) + (spPairIn[id] ? 0 : SP_TEXT_IN)).toFixed(2);
      return `MT.set("#${id}", { autoAlpha: 1 }, ${at}); MT.fromTo("#${id} .inner", { autoAlpha: 0, x: -90, scale: ${ps}, transformOrigin: "12% 50%" }, { autoAlpha: 1, x: 0, scale: ${ps}, duration: 0.55, ease: "power3.out" }, ${inAt});`;
    }
    const dir = parseInt(id.slice(4), 10) % 2 === 0 ? 1 : -1;
    return `MT.fromTo("#${id}", { autoAlpha: 0, xPercent: ${dir * -55}, filter: "blur(26px)" }, { autoAlpha: 1, xPercent: 0, filter: "blur(0px)", duration: 0.3, ease: "power3.out" }, ${at});`;
  }
);
html = html.replace(
  /MT\.to\("#(beat\d+)", \{ opacity: 0, duration: [\d.]+, ease: "power2\.in" \}, ([\d.]+)\);/g,
  (line, id, at) => {
    const mode = modeOfId(id);
    if (mode === "overlay")
      return `MT.to("#${id}", { autoAlpha: 0, y: -26, duration: 0.4, ease: "power2.in" }, ${at});`;
    if (mode === "sidepanel") {
      const X = chainExit[id] != null ? chainExit[id] : beatEnd(id);
      const ps = panelScale(id);
      // pair handoff keeps its own short wipe (the gradient never moves there);
      // otherwise the text leaves on the gradient's own window, start to finish.
      const pair = !!spPairOut[id];
      const outAt = +(X - (pair ? SP_TEXT_DUR_OUT : SP_OUT_LEAD)).toFixed(2);
      const outDur = pair ? SP_TEXT_DUR_OUT : SP_OUT_DUR;
      const outEase = pair ? "power3.in" : "power3.inOut";
      let out = `MT.fromTo("#${id} .inner", { autoAlpha: 1, x: 0, scale: ${ps} }, { autoAlpha: 0, x: -90, scale: ${ps}, duration: ${outDur}, ease: "${outEase}", immediateRender: false }, ${outAt});`;
      // the pair's exit lands exactly on card 2's clip start — hard-kill on the boundary
      if (spPairOut[id]) out += ` MT.set("#${id} .inner", { autoAlpha: 0 }, ${+X.toFixed(2)});`;
      return out;
    }
    const dir = parseInt(id.slice(4), 10) % 2 === 0 ? 1 : -1;
    const t = chainExit[id] != null ? (chainExit[id] - 0.26).toFixed(2) : at;
    let out = `MT.to("#${id}", { autoAlpha: 0, xPercent: ${dir * 55}, filter: "blur(26px)", duration: 0.26, ease: "power3.in" }, ${t});`;
    if (chainExit[id] != null) out += ` MT.set("#${id}", { autoAlpha: 0 }, ${chainExit[id]});`;
    return out;
  }
);

// 7. shot motion, per mode. Overlay beats never move the video, so chains are
// computed over the VIDEO-AFFECTING beats only. The corner talking head is a
// rounded SQUARE: clip-path crops 22% off each side (zooms in on Nate) and
// carries the corner radius (shadow dropped — box-shadow ignores clip-path).
const PIP_DEFAULT = { scale: 0.30, marginX: 64, y: -64 };
const PIP_SMALL = { scale: 0.24, marginX: 56, y: -48 }; // versus verdicts + hub orbit label need the corner
const SMALL_PIP_ANCHORS = new Set(["difference between having AI", "AI should carry more of the", "agents, memory, workflows"]);
const CROP = 0.22, CLIP_R = 80;
const CLIP_ON = `inset(0% ${CROP * 100}% 0% ${CROP * 100}% round ${CLIP_R}px)`;
const CLIP_OFF = `inset(0% 0% 0% 0% round 0px)`;
// full-bleed but still rounded: flights hold the radius so corners never pop
// mid-transition; the radius relaxes to 0 in a short settle tween afterwards.
const CLIP_FULL_ROUND = `inset(0% 0% 0% 0% round ${CLIP_R}px)`;

// ONE global sidepanel scrim (#sp-scrim: sibling right after #video-stage,
// under every card). 1114px (58%) wide, opaque to 768px then fading out by
// 1114px so it ends ~65px left of Nate's face after the 380px push (shoulder
// ~1010, face ~1180 — the old per-card gradient ran to 1420px and veiled his
// face at ~0.35 alpha); text rows end ~805px so they stay on the opaque part.
// Off-frame = x:-1114, so it needs no alpha and no clip window and can LEAD
// the video push.
// r10 (D1) — the ZOOM carries the whole move; nothing translates sideways.
//
// Sliding the video right uncovers its own left edge, and that strip IS the
// black space. Covering it forces the scrim to run ahead, and that lead is the
// "delay". So there is no sideways slide: a zoom anchored to the frame's
// TOP-LEFT keeps the left edge pinned at x=0 for the entire move (nothing to
// hide -> no lead) and sends the whole vertical crop off the BOTTOM, never his
// head. Scrim and zoom then share one start, duration and ease.
//
// Anchoring uses a compensating translate rather than transform-origin, so we
// never touch #video-stage's origin and cannot disturb the flash/pip/takeover
// tweens that share it. With the default 50% 50% origin:
//   x = 960*(zoom-1) pins the left edge at 0,  y = 540*(zoom-1) pins the top at 0.
// At zoom 1.45 that is x:432 y:243 — his face lands at 1363, clear of the
// gradient (which now ends at 1120), and 486px comes off the bottom.
const SCRIM = {
  // 1320, NOT 1200: with a 100deg tilt the projection along the gradient line is
  // proj_top(x) = 0.9848x, so the 0-alpha stop at 1275 needs x = 1295 on the TOP
  // row. At w:1200 the top rows were clipped at alpha 0.23 and stopped dead —
  // that hard cutoff, running diagonally, was the visible line. Widening does not
  // move the gradient: proj depends only on x and y, never on the element width.
  w: 1320, zoom: 1.53,
  lead: 0.45, dur: 0.9, ease: "power3.inOut",  // in  [S-0.45, S+0.45], lockstep
  outLead: 0.95,                                // out [X-0.95, X-0.05], lockstep
};
if (SP_OUT_LEAD !== SCRIM.outLead || SP_OUT_DUR !== SCRIM.dur)
  throw new Error("card text exit window is out of sync with the scrim exit");
// FINAL — pure zoom, on the gradient's EXACT window and ease. Nothing else.
//
// Three constraints together leave exactly one answer:
//   1. the video move must share the gradient's 0.9s / power3.inOut (any other
//      window reads as a hard shift, or as the gradient arriving first),
//   2. no bare strip at any frame,
//   3. his face centred in the right half (1440).
// (1) + (2) force the left edge to stay <= 0 for the whole move, which means
// x can only ever be the zoom's own 960*(zoom-1) — no independent drift. That
// pins his face to 940*zoom, so (3) fixes zoom at 1.53. The 572px that comes
// off the bottom is the unavoidable price of the other three, not a choice.
const ZX = +(960 * (SCRIM.zoom - 1)).toFixed(1);   // 192 — the zoom's own share
const ZY = +(540 * (SCRIM.zoom - 1)).toFixed(1);   // pins the top edge at 0
const f2 = (n) => +n.toFixed(2);

const vids = plan.beats.map((b, i) => ({ b, i })).filter(({ b }) => b.mode !== "overlay");
// the scrim is ONE shared element: its next entry must not start before the
// previous exit has finished, or the two x tweens fight over it.
let scrimFree = -Infinity;
let vt = `\n  /* shot motion (CAIC kit, v2 square pip) */\n  MT.set("#sp-scrim", { x: ${-SCRIM.w} }, 0);\n`;
vids.forEach(({ b, i }, vi) => {
  const mode = b.mode || "takeover";
  const dir = (i + 1) % 2 === 0 ? 1 : -1;
  const S = b.start, E = b.start + b.duration;
  const prev = vids[vi - 1], next = vids[vi + 1];
  const chainedIn = prev && (S - (prev.b.start + prev.b.duration)) < CHAIN_GAP;
  const chainedOut = next && (next.b.start - E) < CHAIN_GAP;
  const V = `"#video-stage"`;
  if (mode === "flash") {
    if (!chainedIn) vt += `  MT.to(${V}, { scale: 1.1, filter: "blur(16px)", duration: 0.3, ease: "power2.inOut" }, ${S - 0.05});\n`;
    if (!chainedOut) vt += `  MT.to(${V}, { scale: 1, filter: "blur(0px)", duration: 0.34, ease: "power2.out" }, ${E - 0.3});\n`;
  } else if (mode === "sidepanel") {
    const inChain = chainedIn && prev.b.mode === "sidepanel";
    const outChain = chainedOut && next.b.mode === "sidepanel";
    // X = the moment everything must be gone: the next chained card's start, else E
    const X = chainedOut ? next.b.start : E;
    const SC = `"#sp-scrim"`;
    if (!inChain) {
      // clamp behind the previous beat's own #video-stage motion AND behind the
      // previous scrim exit (the scrim is one shared element).
      const prevEnd = prev ? prev.b.start + prev.b.duration + 0.02 : -Infinity;
      const T0 = f2(Math.max(S - SCRIM.lead, prevEnd, scrimFree + 0.02));
      vt += `  MT.to(${SC}, { x: 0, duration: ${SCRIM.dur}, ease: "${SCRIM.ease}" }, ${T0});\n`;
      vt += `  MT.to(${V}, { scale: ${SCRIM.zoom}, x: ${ZX}, y: ${ZY}, filter: "blur(0px)", duration: ${SCRIM.dur}, ease: "${SCRIM.ease}" }, ${T0});\n`;
    }
    if (!outChain) {
      const T1 = f2(X - SCRIM.outLead);
      vt += `  MT.to(${V}, { scale: 1, x: 0, y: 0, duration: ${SCRIM.dur}, ease: "${SCRIM.ease}" }, ${T1});\n`;
      vt += `  MT.to(${SC}, { x: ${-SCRIM.w}, duration: ${SCRIM.dur}, ease: "${SCRIM.ease}" }, ${T1});\n`;
      scrimFree = X - SCRIM.outLead + SCRIM.dur;
    }
  } else if (mode === "pip") {
    // The clip NEVER animates (GSAP clip-path morphs glitch in playback).
    // The pip is set to its cropped rounded shape while the card fully covers
    // the frame, then SLIDES IN from the left edge; on exit it slides back out
    // left, resets to full-bleed under the card, and the card's own whip
    // reveals the fullscreen video mid-settle (same push as takeovers).
    const P = SMALL_PIP_ANCHORS.has(b.anchor) ? PIP_SMALL : PIP_DEFAULT;
    const restX = +(P.marginX - 1920 * P.scale * CROP).toFixed(1);
    const OFF_L = -560; // visible box fully off the left edge at any pip scale
    if (chainedIn) {
      // previous card still covers the frame: become the pip under it
      const prevE = prev.b.start + prev.b.duration;
      vt += `  MT.set(${V}, { transformOrigin: "0% 100%", xPercent: 0, x: ${OFF_L}, y: ${P.y}, scale: ${P.scale}, filter: "blur(0px)", clipPath: "${CLIP_ON}" }, ${prevE - 0.45});\n`;
      vt += `  MT.set(${V}, { zIndex: 30 }, ${prevE - 0.44});\n`;
      vt += `  MT.to(${V}, { x: ${restX}, duration: 0.55, ease: "power3.out" }, ${prevE - 0.05});\n`;
    } else {
      // push the fullscreen video back as the card whips over it
      vt += `  MT.to(${V}, { scale: 1.1, filter: "blur(14px)", duration: 0.35, ease: "power2.inOut" }, ${S - 0.12});\n`;
      // card is fully opaque from S+0.3: swap to the pip shape unseen
      vt += `  MT.set(${V}, { transformOrigin: "0% 100%", xPercent: 0, x: ${OFF_L}, y: ${P.y}, scale: ${P.scale}, filter: "blur(0px)", clipPath: "${CLIP_ON}" }, ${+(S + 0.32).toFixed(2)});\n`;
      vt += `  MT.set(${V}, { zIndex: 30 }, ${+(S + 0.33).toFixed(2)});\n`;
      // talking head slides in from the left side of the screen
      vt += `  MT.to(${V}, { x: ${restX}, duration: 0.55, ease: "power3.out" }, ${+(S + 0.38).toFixed(2)});\n`;
    }
    // exit: slide out left, then reset to full-bleed under the card; the card
    // whip (at E-0.4) reveals the fullscreen video settling out of a blur push
    vt += `  MT.to(${V}, { x: ${OFF_L}, duration: 0.45, ease: "power3.in" }, ${+(E - 1.0).toFixed(2)});\n`;
    vt += `  MT.set(${V}, { zIndex: "auto", transformOrigin: "50% 50%", xPercent: 0, x: 0, y: 0, scale: 1.08, clipPath: "${CLIP_OFF}", filter: "blur(14px)" }, ${+(E - 0.5).toFixed(2)});\n`;
    vt += `  MT.to(${V}, { scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }, ${+(E - 0.45).toFixed(2)});\n`;
  } else { // takeover
    // scale+blur push: the video never slides, so its perimeter never crosses
    // the frame (the old xPercent whip read as a harsh edge wipe).
    if (!chainedIn) vt += `  MT.to(${V}, { scale: 1.12, filter: "blur(18px)", duration: 0.4, ease: "power2.inOut" }, ${S - 0.15});\n`;
    if (!chainedOut) vt += `  MT.to(${V}, { scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }, ${E - 0.32});\n`;
  }
});
html = html.replace(/(\n\s*MT\.set\(\{\}, \{\}, [\d.]+\);)/, vt + "$1");

// 8. video-stage plumbing: onyx backfill, clip baseline for the square pip
html = html.replace(
  "#video-stage { position: absolute; inset: 0; }",
  `#video-stage { position: absolute; inset: 0; overflow: hidden; clip-path: ${CLIP_OFF}; } html, body { background: #040A11; }
    #sp-scrim { position: absolute; top: 0; left: 0; height: 100%; width: ${SCRIM.w}px; z-index: 5; pointer-events: none; background: linear-gradient(100deg, rgba(4,10,17,1) 0px, rgba(4,10,17,1) 704px, rgba(4,10,17,.94) 854px, rgba(4,10,17,.72) 1000px, rgba(4,10,17,.40) 1120px, rgba(4,10,17,.18) 1195px, rgba(4,10,17,.06) 1245px, rgba(4,10,17,0) 1275px); }`
);
{
  // the global scrim mounts right after the video stage, before the first card
  const before = html;
  html = html.replace(/(<\/audio>\s*<\/div>)/, `$1\n\n    <!-- global sidepanel scrim: one gradient under every sidepanel card; section 7 slides it -->\n    <div id="sp-scrim"></div>`);
  if (html === before) throw new Error("sp-scrim insert point (</audio></div>) not found");
}

// 9. per-mode layout CSS:
//    sidepanel — transparent card over the shifted video, scrim, content left
//    pip — lift + shrink the content slightly so it clears the corner video
let modeCss = "\n<style>\n";
plan.beats.forEach((b, i) => {
  const id = beatId(i);
  if (b.mode === "sidepanel") {
    // no per-card scrim: the card is transparent over the global #sp-scrim
    modeCss += `#${id}{background:none;}\n`;
    modeCss += `#${id} .bg,#${id} .vignette,#${id} .backdrop-mark,#${id} .grain,#${id} .watermark{display:none;}\n`;
    modeCss += `#${id} .inner{position:absolute;left:0;top:0;height:100%;width:40%;padding-left:5%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;text-align:left;transform:scale(${panelScale(id)});transform-origin:12% 50%;}\n`;
    // left-adjacency: the .wd spans carry .13em side padding — pull the headline
    // back so its first glyph lines up flush with the eyebrow and sub
    modeCss += `#${id} .ln{margin-left:-0.13em;}\n`;
  } else if (b.mode === "pip") {
    modeCss += `#${id} .inner{transform:translateY(-46px) scale(.95);transform-origin:50% 42%;}\n`;
    modeCss += `#${id} .sub{max-width:760px;white-space:normal;margin-left:auto;margin-right:auto;}\n`;
  }
});
modeCss += "</style>\n";
html = html.includes("</head>")
  ? html.replace("</head>", modeCss + "</head>")
  : html.replace('<div id="ais-live-october-vsl"', modeCss + '<div id="ais-live-october-vsl"');

// 10. point <audio> at an audio-only sibling. build-beats defaults the mixer
// track to the same file as <video>, so the 533MB clean.mp4 was fetched and
// H.264-decoded TWICE per playback — the main cause of choppy Studio preview.
// clean-audio.m4a is the same AAC stream copied out (no re-encode), 12MB.
{
  const before = html;
  html = html.replace(
    /(<audio[^>]*id="bg-audio"[^>]*src=")assets\/clean\.mp4(")/,
    "$1assets/clean-audio.m4a$2"
  );
  if (html === before) throw new Error("bg-audio src not rewritten");
}

writeFileSync(FILE, html);
const whips = (html.match(/filter: "blur\(26px\)"/g) || []).length;
const panels = (html.match(/"#sp-scrim", \{ x: /g) || []).length;
const pips = (html.match(/clipPath: "inset\(0% 22%/g) || []).length;
const pops = (html.match(/class="popwrap" data-at/g) || []).length;
console.log(`beats ${plan.beats.length} | whip tweens ${whips} | scrim tweens ${panels} | pip flights ${pips} | iconpop chips ${pops}`);
