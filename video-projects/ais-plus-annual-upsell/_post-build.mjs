// Post-build patch for the ais-live-v2 build of the AIS+ Annual Upsell.
// Run from workspace root AFTER build-beats: node video-projects/ais-plus-annual-upsell/_post-build.mjs
// v2 cards are SELF-SCOPING, so there is NO script rewriting here — only modes,
// fills, transitions, and layout CSS. Beat MODES live in beat-plan.json
// ("mode" per beat); fills below are keyed by anchor so beat renumbering is safe.
import { readFileSync, writeFileSync } from "node:fs";

const DIR = "video-projects/ais-plus-annual-upsell";
const FILE = `${DIR}/index.html`;
const VIDEO_DUR = "384.300"; // 9/2 penny re-cut: +0.6s after 3:33 (ffprobe assets/clean.mp4)
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

// 1b. DECLARE THE ROOT DURATION. Studio computes a "document duration" from every
// [data-start] element's start+duration; untimed wrappers (#video-stage, #sp-scrim)
// get STAMPED with an invented duration at load (397.44 on 9/1), which exceeded the
// 383.7s timeline -> "[useTimelinePlayer] ... falling back to seek-driven playback,
// which never starts media elements or WebAudio" = silent, frame-seeking, choppy
// preview all day. Fce() short-circuits on the root's own data-duration, so pin it.
{
  const root = html.match(/<div id="ais-plus-annual-upsell" data-composition-id="ais-plus-annual-upsell"[^>]*>/);
  if (!root) throw new Error("root composition div not found for data-duration");
  if (/data-duration="/.test(root[0])) html = html.replace(root[0], root[0].replace(/data-duration="[^"]*"/, `data-duration="${VIDEO_DUR}"`));
  else html = html.replace(root[0], root[0].replace(' data-start="0"', ` data-start="0" data-duration="${VIDEO_DUR}"`));
}

// 2. video src (build ran from workspace root) + full-duration pad
html = html.replaceAll(`src="../../assets/clean.mp4"`, `src="assets/clean.mp4"`);
html = html.replace(/(<(?:video|audio)[^>]*data-duration=")[\d.]+(")/g, `$1${VIDEO_DUR}$2`);
html = html.replace(/MT\.set\(\{\}, \{\}, [\d.]+\);/, `MT.set({}, {}, ${VIDEO_DUR});\n    /* cap nested ambient loops at the video end: card sparkle/pulse repeats are sized to the\n       card's standalone DUR, so a short beat near the tail would otherwise stretch the comp\n       past the video (12s of black on the 9/1 render). Trims repeat counts only. */\n    (function capLoops(limit){ const walk=(t,base)=>{ t.getChildren(false,true,true).forEach(c=>{ const st=base+c.startTime(); if(c.getChildren){ walk(c,st); return; } if(st+c.totalDuration()>limit && c.repeat()>0){ const cyc=c.duration()+c.repeatDelay(); c.repeat(Math.max(0,Math.floor((limit-st-c.duration())/cyc))); } }); }; walk(MT,0); })(${VIDEO_DUR});`);

// 3. data-anchor per beat (plan order == beat order)
plan.beats.forEach((b, i) => {
  const id = beatId(i);
  const esc = b.anchor.replace(/"/g, "&quot;");
  // anchorAfter: the phrase also occurs earlier in the video — Gate 0 must search from here
  const attrs = `data-anchor="${esc}"` + (b.anchorAfter ? ` data-anchor-after="${b.anchorAfter}"` : "");
  html = html.replace(`<div id="${id}" class="stage beat-layer clip"`, `<div id="${id}" class="stage beat-layer clip" ${attrs}`);
  html = html.replace(`<div id="${id}" class="beat-layer clip"`, `<div id="${id}" class="beat-layer clip" ${attrs}`);
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
// card scripts are grouped AFTER every beat's DOM, so inBeat never sees them: edit the
// one <script> that registers window.__beatTimelines["<id>"] instead.
function inScript(id, fn) {
  const parts = html.split(/(<script>)/);
  let hit = 0;
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i].includes(`window.__beatTimelines["${id}"] = tl;`)) continue;
    parts[i] = fn(parts[i]); hit++;
  }
  if (hit !== 1) throw new Error(`inScript: expected 1 script for ${id}, found ${hit}`);
  html = parts.join("");
}

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

// 4b. TAIL CLAMP — every card timeline is DUR=10s long (`tl.set({}, {}, DUR)` plus
// the ambient tweens all use DUR) and is added to MT at the beat start, so a beat
// that starts inside the last 10s stretches the composition past the video: the
// 9/1 final.mp4 ran 387.4s for a 383.7s video, 3.7s of pure black at the end
// (capLoops only trims REPEATS, not the DUR pad). Clamp DUR per card to the time
// left in the video. Ambient loops are sized from DUR, so they shrink with it.
{
  const parts = html.split(/(<script>)/);
  let clamped = 0;
  for (let i = 0; i < parts.length; i++) {
    const m = parts[i].match(/document\.getElementById\("(beat\d+)"\)/);
    if (!m) continue;
    const beat = plan.beats[parseInt(m[1].slice(4), 10) - 1];
    if (!beat) continue;
    const left = +(parseFloat(VIDEO_DUR) - beat.start).toFixed(3);
    if (left >= 10) continue;
    if (!parts[i].includes("const DUR = 10;")) throw new Error(`tail clamp: DUR line not found in ${m[1]}`);
    parts[i] = parts[i].replace("const DUR = 10;", `const DUR = ${left}; /* clamped: video ends ${VIDEO_DUR} */`);
    clamped++;
  }
  html = parts.join("");
  console.log(`tail clamp: ${clamped} card timeline(s) shortened to the video end`);
}

// 4c. SPARKLE LOOP BOUND. Every card twinkles 12 .spark elements: duration 1.3, stagger
// .21 (spread 2.31), repeat round(DUR/1.3)-1 = 7. GSAP repeats the whole staggered group,
// so the tween is (1.3+2.31)*8 = 28.88s — three times the card. capLoops trims it at load,
// but inside the Studio shell that trim does not survive (MT read 397.44 = beat 38 start +
// 28.88 while the bare preview read 383.7), which stretched the scrubber ~14s past the video.
// Size the loop to the card instead: cycles = floor(DUR / (1.3 + 2.31)).
{
  const from = 'repeat:Math.max(1, Math.round(DUR/1.3) - 1), ease:"sine.inOut", stagger:{each:.21, from:"random", seed:7}';
  const to = 'repeat:Math.max(0, Math.floor(DUR/3.61) - 1), ease:"sine.inOut", stagger:{each:.21, from:"random", seed:7}';
  const n = html.split(from).length - 1;
  const already = html.split(to).length - 1; // library regenerated with the bound built in
  if (n === 0 && already === 0) throw new Error("sparkle loop pattern not found (card library changed?)");
  html = html.split(from).join(to);
  console.log(`sparkle loop bounded in ${n} card(s)` + (already ? ` (${already} already bounded by the library)` : ""));
}

// 5. row-card fills (icons + labels + word-synced pop times)
const popRow = ([icon, label, at]) =>
  `<div class="popwrap" data-at="${at ?? 0}"><span class="chip"><i class="sheen"></i><span class="ic" data-icon="${icon}"></span></span><span class="cl">${label}</span></div>`;
const fillPops = (rows) => (s) => {
  let n = 0;
  return s.replace(/<div class="popwrap"[^>]*>.*?<\/div>/g, () => popRow(rows[n++] || ["", "", 0]));
};
// ---- word-synced entrance times ------------------------------------------
// Rows enter just before the word they name. Give each row a verbatim PHRASE
// from the transcript instead of a hand-computed offset: at = wordStart -
// beatStart - 0.15, resolved here so a re-cut can never desync the chips.
const TR = JSON.parse(readFileSync(`${DIR}/assets/transcript.json`, "utf8"));
const TW = TR.words.filter((w) => (w.type || "word") === "word");
const nrm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
const TT = TW.map((w) => nrm(w.text));
function wordStart(phrase, after = 0) {
  const p = nrm(phrase).split(" ");
  for (let i = 0; i < TT.length - p.length + 1; i++) {
    if (TW[i].start < after) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (TT[i + j] !== p[j]) { ok = false; break; }
    if (ok) return TW[i].start;
  }
  throw new Error(`fill phrase not found in transcript: ${phrase}`);
}
// rows: [icon, LABEL, "cue phrase"] -> [icon, LABEL, at] relative to the beat
const sync = (anchor, rows) => {
  const b = plan.beats.find((x) => x.anchor === anchor);
  if (!b) throw new Error(`no beat with anchor: ${anchor}`);
  return rows.map((r) => {
    if (!r[0] && !r[1]) return ["", "", 0];
    const at = +(wordStart(r[2], b.start - 3) - b.start - 0.15).toFixed(2);
    return [r[0], r[1], Math.max(0.1, at)];
  });
};

// ---- tier-2 iconpop chips -------------------------------------------------
const POPS = {
  "they watch tutorials": [
    ["gradcap", "WATCH TUTORIALS", "they watch tutorials"],
    ["code", "FOLLOW ALONG", "they follow along"],
    ["doc", "BOOKMARK 50 VIDEOS", "they bookmark"],
    ["", "", ""], ["", "", ""],
  ],
  "automate content, marketing, sales": [
    ["doc", "CONTENT", "automate content"],
    ["megaphone", "MARKETING", "marketing"],
    ["target", "SALES", "sales"],
    ["userplus", "RECRUITING", "recruiting"],
    ["layers", "YOUR FIRST AI OS", "first working draft"],
  ],
  "New tools appear": [
    ["bolt", "NEW TOOLS", "new tools appear"],
    ["spark", "NEW CAPABILITIES", "new capabilities"],
    ["gear", "NEW SYSTEMS", "new systems"],
    ["compass", "NEW STRATEGIES", "and strategies"],
    ["", "", ""],
  ],
  "unlimited tech support": [
    ["shield", "UNLIMITED SUPPORT", "unlimited tech support"],
    ["doc", "POST A QUESTION", "post a question"],
    ["users", "OUR TEAM SOLVES IT", "our team helps"],
    ["clock", "NO WAITING AROUND", "wait around"],
    ["search", "NO GOOGLING FOR HOURS", "google for hours"],
  ],
  "every future AIS Live event is yours": [
    ["calendar", "EVERY FUTURE EVENT", "every future ais live event"],
    ["key", "WHILE YOU ARE A MEMBER", "as long as you stay"],
    ["ticket", "NEVER BUY A TICKET", "you never buy another ticket"],
    ["", "", ""], ["", "", ""],
  ],
};
for (const [anchor, rows] of Object.entries(POPS)) inAnchor(anchor, fillPops(sync(anchor, rows)));
// versus rows: 4 left then 4 right in DOM order — [icon, label]
const fillVersus = (rows) => (s) => {
  let n = 0;
  return s.replace(/(<div class="vrow"><span class="chip"><span class="ic" data-icon=")[^"]*("><\/span><\/span><span class="vlabel">)[^<]*(<\/span><\/div>)/g,
    (_, a, b, c) => { const r = rows[n++] || ["", ""]; return a + r[0] + b + r[1] + c; });
};

// checklist rows — fill labels; optionally swap the check for a mono number
const CHECK_SVG = `<svg viewBox="0 0 24 24"><path d="M4 12.5l5.5 5.5L20 6.5" pathLength="100"/></svg>`;
const fillChecklist = (rows, numbered) => (s) => {
  let n = 0;
  return s.replace(/(<div class="crow"><span class="cbox">)[\s\S]*?(<\/span><span class="clabel">)[^<]*(<\/span><\/div>)/g,
    (_, a, b, c) => {
      const row = rows[n++];
      if (!row) return a + CHECK_SVG + b + c; // blank -> pruned at runtime
      const [label, at] = Array.isArray(row) ? row : [row, null];
      const box = numbered ? `<span class="cnum">${String(n).padStart(2, "0")}</span>` : CHECK_SVG;
      const open = at != null ? a.replace('<div class="crow">', `<div class="crow" data-at="${at}">`) : a;
      return open + box + b + label + c;
    });
};

// ladder steps — [icon, LABEL, desc, at?], 3 baked; at -> data-at (word-synced entrance)
const stepRow = ([icon, label, desc, at]) =>
  `<div class="step"${at != null ? ` data-at="${at}"` : ""}><span class="chip"><span class="ic" data-icon="${icon}"></span></span><span class="stx"><span class="st">${label}</span><span class="sd">${desc}</span></span></div>`;
const fillLadder = (rows) => (s) => {
  let n = 0;
  return s.replace(/<div class="step"[^>]*><span class="chip">.*?<\/span><\/span><\/div>/g, () => stepRow(rows[n++] || ["", "", ""]));
};

// icon-row chips — [icon, LABEL]
const fillChips = (rows) => (s) => {
  let n = 0;
  return s.replace(/<div class="chipwrap">.*?<\/div>/g, () => {
    const r = rows[n++] || ["", ""];
    return `<div class="chipwrap"${r[2] != null ? ` data-at="${r[2]}"` : ""}><span class="chip"><i class="sheen"></i><span class="ic" data-icon="${r[0]}"></span></span><span class="cl">${r[1]}</span></div>`;
  });
};

// icon-row chips honor data-at: swap the library's fixed-stagger chip tweens for a per-chip loop
function syncChips(id) {
  inScript(id, (sc) => {
    const re = /chipPop\("\.chipwrap", 0\.85, 0\.14\);\s*drawIn\("\.chipwrap", 0\.95, 0\.05\);\s*sheens\("\.chipwrap", 1\.5, 0\.14\);/;
    if (!re.test(sc)) throw new Error(`syncChips: chip tweens not found in ${id}`);
    return sc.replace(re, () => `Array.from($(".chipwrap")).forEach((c, i) => {
        const at = parseFloat(c.getAttribute("data-at") || (0.85 + i * 0.14));
        tl.fromTo(c, {autoAlpha:0, y:30, scale:.55}, {autoAlpha:1, y:0, scale:1, duration:.58, ease:"back.out(1.7)", transformOrigin:"50% 85%"}, at);
        tl.fromTo(c.querySelectorAll(".ic svg *"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.6, ease:"power2.inOut", stagger:.05}, at + 0.1);
        tl.fromTo(c.querySelector(".sheen"), {xPercent:-160}, {xPercent:560, duration:.55, ease:"power2.inOut", immediateRender:false}, at + 0.65);
      });`);
  });
}
// checklist rows honor data-at the same way (row slide + check draw + box pulse per row)
function syncChecklist(id) {
  inScript(id, (sc) => {
    const re = /slideX\("\.crow", 0\.35, 0\.22\);\s*tl\.fromTo\(\$\("\.cbox svg path"\)[^\n]*\n\s*tl\.fromTo\(\$\("\.cbox"\)[^\n]*/;
    if (!re.test(sc)) throw new Error(`syncChecklist: row tweens not found in ${id}`);
    return sc.replace(re, () => `Array.from($(".crow")).forEach((r, i) => {
        const at = parseFloat(r.getAttribute("data-at") || (0.35 + i * 0.22));
        tl.fromTo(r, {autoAlpha:0, x:-46, filter:"blur(6px)"}, {autoAlpha:1, x:0, filter:"blur(0px)", duration:.5, ease:"power2.out"}, at);
        tl.fromTo(r.querySelectorAll(".cbox svg path"), {strokeDashoffset:100}, {strokeDashoffset:0, duration:.45, ease:"power2.out"}, at + 0.25);
        tl.fromTo(r.querySelector(".cbox"), {}, {scale:1.12, duration:.18, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 50%"}, at + 0.27);
      });`);
  });
}

// agenda-icon rows — [icon, LABEL, desc, at?], 5 baked; at -> data-at (word-synced entrance)
const agRow = ([icon, label, desc, at]) =>
  `<div class="agrow"${at != null ? ` data-at="${at}"` : ""}><span class="chip"><i class="sheen"></i><span class="ic" data-icon="${icon}"></span></span><span class="agt">${label}</span><span class="agl">${desc}</span></div>`;
const fillAgendaRows = (rows) => (s) => {
  let n = 0;
  return s.replace(/<div class="agrow"[^>]*><span class="chip">.*?<span class="agl">[^<]*<\/span><\/div>/g, () => agRow(rows[n++] || ["", "", ""]));
};

// ---- checklist rows -------------------------------------------------------
inAnchor("how far can you actually take it", fillChecklist([
  "How far can you actually take it?",
  "How do you extend its capabilities?",
  "How do you automate more of the business?",
  "How do you stay at the forefront?",
], true));
// ---- module tiles: the REAL dashboard card art (assets/modules/m1-6.png) ------
// Aidan's 9/1 member-dashboard screenshot, six tiles cut at 2x (cursor on tile 1
// and the loading spinner on tile 4 patched out). The six-module checklist
// becomes a 2x3 grid of those tiles. Rows keep the .crow wrapper so the card's
// own slideX stagger (0.22s) cascades them in; the zero-height .mlabel keeps the
// card's prune pass (no text -> row removed) from deleting image-only rows.
const MODULES = [
  ["m1", "Start Here"], ["m2", "The AI Partner Model"], ["m3", "Build Your Portfolio"],
  ["m4", "Claude Code"], ["m5", "Get Your First Clients"], ["m6", "Scale"],
];
const GRID_ANCHOR = "You get the Claude Code builds";
// 9/2: the INSIDE THE BUILD MODULES ladder shows the Claude Code course tile above its
// three steps (Aidan: "use the claude code course image, keep the bullet points under it").
const HERO_TILES = [["Get Your First Client", "m5-hero"], ["the AI partner model", "m2-hero"], ["four Claude Code build courses", "m4-hero"]];
const tileRow = ([f, name]) =>
  `<div class="crow mrow"><img class="mtile" src="assets/modules/${f}.png" alt=""><span class="mlabel">${name}</span></div>`;
inAnchor(GRID_ANCHOR, (sec) => {
  const re = /<div class="list">[\s\S]*?<\/div>(\s*<div class="sub")/;
  if (!re.test(sec)) throw new Error("module grid: .list block not found");
  return sec.replace(re, (_, tail) => `<div class="list">\n          ${MODULES.map(tileRow).join("\n          ")}\n        </div>${tail}`);
});
// single-module hero tile above the MODULE 05 / MODULE 02 headlines
HERO_TILES.forEach(([anchor, f]) => inAnchor(anchor, (sec) => {
  const re = /(<div class="inner">\s*)(<div class="eyebrow")/;
  if (!re.test(sec)) throw new Error(`hero tile: .inner/.eyebrow not found for ${anchor}`);
  return sec.replace(re, `$1<img class="mtile hero" src="assets/modules/${f}.png" alt="">$2`);
}));

// ---- AIS+ title card: the thumbnail art replaces the two-line headline (Aidan 9/2,
// "change the text that says AI Automation Society Plus to this image, rounded corners").
// assets/ais-plus-thumb.png = his 720x383 paste at 2x Lanczos + light unsharp, shown at 960.
const THUMB_ANCHOR = "AI Automation Society Plus";
{
  const id = idByAnchor(THUMB_ANCHOR);
  inBeat(id, (sec) => {
    const re = /<div class="ln" data-split(?:="")? data-slot="headline">[\s\S]*?<\/div>/;
    if (!re.test(sec)) throw new Error("title thumb: headline block not found");
    return sec.replace(re, () => `<div class="thumbwrap"><img class="thumb" src="assets/ais-plus-thumb.png" alt=""></div>`);
  });
  inScript(id, (s) => {
    const from = 'words(".ln .wd", 1.15);';
    if (!s.includes(from)) throw new Error("title thumb: words tween not found");
    return s.replace(from, () => 'tl.fromTo($(".thumb"), {autoAlpha:0, y:34, scale:.94, filter:"blur(12px)"}, {autoAlpha:1, y:0, scale:1, filter:"blur(0px)", duration:.75, ease:"power3.out", transformOrigin:"50% 50%"}, 1.15);');
  });
}
// ---- MODULE 02: the $100K/mo agency stat is a bullet under the headline, word-synced to
// "from zero to over" (Aidan 9/2: "just put the 100k a month under, that's a bullet point").
const BULLET_ANCHOR = "the AI partner model";
{
  const b = plan.beats.find((x) => x.anchor === BULLET_ANCHOR);
  const at = +(wordStart("from zero to over", b.start) - b.start - 0.15).toFixed(2);
  const id = idByAnchor(BULLET_ANCHOR);
  inBeat(id, (sec) => {
    const re = /<div class="ln" data-split(?:="")? data-slot="headline">[\s\S]*?<\/div>/;
    if (!re.test(sec)) throw new Error("partner bullet: headline block not found");
    return sec.replace(re, (m) => m + `\n        <div class="bullet"><span class="bdot"></span><span class="btx">$100K a month in recurring revenue, in just eight months</span></div>`);
  });
  inScript(id, (s) => s.replace(`window.__beatTimelines["${id}"] = tl;`, () =>
    `tl.fromTo($(".bullet"), {autoAlpha:0, x:-30, filter:"blur(6px)"}, {autoAlpha:1, x:0, filter:"blur(0px)", duration:.55, ease:"power3.out"}, ${at});\n      window.__beatTimelines["${id}"] = tl;`));
  console.log(`partner-model bullet enters at +${at}s (${(b.start + at).toFixed(2)})`);
}
// ---- INSIDE AIS+: "37,000+ MEMBERS", never a dollar sign (Aidan 9/2). The card's countUp
// has no digit grouping, so add it for this one card and fix the static fallback text.
{
  const id = idByAnchor("over 3,000 builders");
  inBeat(id, (sec) => {
    const re = /(<span class="num" id="num">)3700\+(<\/span>)/;
    if (!re.test(sec)) throw new Error("member stat: static 3700+ not found (section 4 must run first)");
    return sec.replace(re, (_, a, c) => a + "3,700+" + c);
  });
  inScript(id, (s) => {
    const from = 'el.textContent = p + Math.round(o.v) + (suffix || "");';
    if (!s.includes(from)) throw new Error("member stat: countUp body not found");
    return s.replace(from, () => 'el.textContent = p + Math.round(o.v).toLocaleString("en-US") + (suffix || "");');
  });
}

// ---- ladder steps ---------------------------------------------------------
{
  const b = plan.beats.find((x) => x.anchor === "four Claude Code build courses");
  const at = (p) => +(wordStart(p, b.start - 0.5) - b.start - 0.15).toFixed(2);
  inAnchor("four Claude Code build courses", fillLadder([
    ["code", "CLAUDE CODE", "Turn ideas into working AI systems", at("not watching someone else")],
    ["gear", "REAL AUTOMATIONS", "You build them, not watch someone else", at("building real automations")],
    ["briefcase", "BUILD YOUR PORTFOLIO", "Work you can show before you ever pitch", at("portfolio of work")],
  ]));
}
{
  const b = plan.beats.find((x) => x.anchor === "the how is the step-by-step training");
  const at = (p) => +(wordStart(p, b.start - 0.5) - b.start - 0.15).toFixed(2);
  inAnchor("the how is the step-by-step training", fillLadder([
    ["flag", "START HERE", "Onboarded into the community", at("the claude code builds")],
    ["code", "CLAUDE CODE", "Build faster, turn ideas into systems", at("get your first client playbook")],
    ["chartup", "SCALE", "Take the agency to seven figures", at("the ai partner model the structured")],
  ]));
}

// ---- icon-row chips -------------------------------------------------------
inAnchor("live Q&As", fillChips([
  ["users", "SHOW UP LIVE"], ["search", "ASK ANYTHING"], ["bolt", "GET UNSTUCK"], ["", ""], ["", ""],
]));
{
  // 3:11 community (sidepanel icon row): chips pop on "ahead of you / beside you / 11 PM"
  const A = "community of over 3,000 builders";
  const b = plan.beats.find((x) => x.anchor === A);
  const at = (p) => +(wordStart(p, b.start) - b.start - 0.15).toFixed(2);
  inAnchor(A, fillChips([
    ["up", "AHEAD OF YOU", at("ahead of you")], ["users", "BESIDE YOU", at("beside you")], ["clock", "ANSWERING AT 11 PM", at("answer your questions at")], ["", ""], ["", ""],
  ]));
  syncChips(idByAnchor(A));
}
// ---- agenda rows (word-synced) ----------------------------------------------
{
  // 5:00 THE WHO: the community, one row per thing he names
  const A = "over 3,000 builders, business owners";
  const b = plan.beats.find((x) => x.anchor === A);
  const at = (p) => +(wordStart(p, b.start - 0.5) - b.start - 0.15).toFixed(2);
  inAnchor(A, fillAgendaRows([
    ["users", "3,700+ BUILDERS", "Business owners and AI engineers at the forefront", at("over 3,000 builders business")],
    ["bolt", "WEEKLY LIVE ACCESS TO NATE", "Every single week", at("weekly live access")],
    ["shield", "UNLIMITED TECH SUPPORT", "From real AI engineers", at("unlimited tech support from real")],
    ["search", "THEY REVIEW YOUR WORK", "Answer questions, show you new capabilities", at("review your work")],
    ["", "", ""],
  ]));
}
{
  // 5:34 START TONIGHT: what you can do the moment you join
  const A = "going through the courses";
  const b = plan.beats.find((x) => x.anchor === A);
  const at = (p) => +(wordStart(p, b.start - 0.5) - b.start - 0.15).toFixed(2);
  inAnchor(A, fillAgendaRows([
    ["gradcap", "GO THROUGH THE COURSES", "", at("going through the courses")],
    ["users", "POST IN THE COMMUNITY", "", at("posting in the community")],
    ["userplus", "MEET PEOPLE", "", at("meeting people")],
    ["shield", "GET ANSWERS FROM SUPPORT", "", at("getting answers from my support")],
    ["", "", ""],
  ]));
}
{
  // 5:54 SO YOU JOIN TODAY: checklist rows tick on their words
  const A = "you explore everything";
  const b = plan.beats.find((x) => x.anchor === A);
  const at = (p) => +(wordStart(p, b.start - 0.5) - b.start - 0.15).toFixed(2);
  inAnchor(A, fillChecklist([
    ["Explore everything", at("you explore everything")],
    ["Go through the courses", at("go through the courses")],
    ["Post in the community", at("post in the community")],
    ["Show up to a live Q&amp;A", at("show up to a live")],
  ]));
  syncChecklist(idByAnchor(A));
}
// 6. card transitions, per mode. overlay keeps build-beats' gentle fade;
// takeover/pip/flash get the alternating motion-blur whip; sidepanel TEXT
// slides in over the ONE global scrim (#sp-scrim — sections 7/8 own the
// scrim + video motion). Covering cards chained (gap < 0.8s, both non-overlay)
// hold until the next card enters so no bare frame shows between them.
const CHAIN_GAP = 0.8;
// COVER HOLD (Aidan 9/2: "in between those two motion graphics it goes to Nate's face
// really quick"). A chained cover card used to whip OUT over [X-0.26, X] while the next
// whipped IN over [X, X+0.3]: at X both were at alpha 0 and the bare (blurred) video
// showed for ~0.3s at every takeover->takeover handoff. Now the outgoing card stays
// fully opaque UNDER the incoming whip and is hard-hidden once the incoming is solid.
// It needs its own track (the clip windows overlap by COVER_HOLD) — DOM order already
// stacks the later beat on top.
const COVER = new Set(["takeover", "flash"]);
const COVER_HOLD = 0.34;
const coverHold = {};
const underCover = {}; // sidepanel -> cover: panel held under the incoming whip, zoom reset unseen (section 7)
const chainExit = {};
const chainNextMode = {};
const beatEnd = (id) => { const b = plan.beats[parseInt(id.slice(4), 10) - 1]; return b.start + b.duration; };
// sidepanel content-panel scale (two-paths has only 2 chips — let them breathe)
const WIDE_PANEL_ANCHORS = new Set(["live Q&As", "community of over 3,000 builders"]);
const panelScale = (id) => WIDE_PANEL_ANCHORS.has(plan.beats[parseInt(id.slice(4), 10) - 1].anchor) ? ".78" : ".62";
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
    const hold = COVER.has(b.mode || "takeover") && COVER.has(next.mode || "takeover");
    // r2: a sidepanel followed by a cover card used to slide its text out and zoom the
    // video back over [X-0.95, X-0.05] on bare frame, THEN the cover whipped in. Now the
    // panel stays put under the incoming whip and everything resets once the cover is
    // solid (section 7) — no visible zoom-out at those handoffs.
    const under = b.mode === "sidepanel" && COVER.has(next.mode || "takeover");
    if (hold) coverHold[id] = true;
    if (under) underCover[id] = true;
    if (hold || under) {
      // alternate 3/4 so two held cards in a row (e.g. $799 -> YOU SAVE -> LOCKED IN) never share a track
      html = html.replace(new RegExp(`(id="${id}"[^>]*data-track-index=")\\d+(")`), (_, a, c) => a + String(3 + (i % 2)) + c);
    }
    const dur = next.start - b.start + ((hold || under) ? COVER_HOLD : 0);
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
    if (mode === "overlay") {
      // hard kill on the beat end: without it a seek can land past the fade and
      // leave the chip layer visible (lint: gsap_exit_missing_hard_kill)
      const e = +beatEnd(id).toFixed(2);
      return `MT.to("#${id}", { autoAlpha: 0, y: -26, duration: 0.4, ease: "power2.in" }, ${at}); MT.set("#${id}", { autoAlpha: 0 }, ${e});`;
    }
    if (mode === "sidepanel") {
      const X = chainExit[id] != null ? chainExit[id] : beatEnd(id);
      // held under an incoming cover: no slide-out, hard-hide once the cover is solid
      if (underCover[id]) return `MT.set("#${id} .inner", { autoAlpha: 0 }, ${+(X + COVER_HOLD - 0.02).toFixed(2)});`;
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
    // held cover card: no whip out — it vanishes under the incoming card once that is solid
    if (coverHold[id]) return `MT.set("#${id}", { autoAlpha: 0 }, ${+(chainExit[id] + COVER_HOLD - 0.02).toFixed(2)});`;
    const dir = parseInt(id.slice(4), 10) % 2 === 0 ? 1 : -1;
    const t = chainExit[id] != null ? (chainExit[id] - 0.26).toFixed(2) : at;
    let out = `MT.to("#${id}", { autoAlpha: 0, xPercent: ${dir * 55}, filter: "blur(26px)", duration: 0.26, ease: "power3.in" }, ${t});`;
    if (chainExit[id] != null) out += ` MT.set("#${id}", { autoAlpha: 0 }, ${chainExit[id]});`;
    return out;
  }
);

// 6b. PERFORMANCE — the two things that made the Studio unplayable.
//
// Every beat inlines the style's full ambient stack: a 1400x1200 beam at
// blur(30px), two radial glows at blur(155px)/blur(165px), a grid layer, a
// grain layer. With 39 beats that is 32 copies of each, and GSAP's autoAlpha
// only sets visibility:hidden — the layers stay in layout, paint and the
// compositor the whole time. Headless SwiftShader flattens them so a headless
// measurement reads 0 dropped frames; a real GPU Chrome promotes all of them
// and thrashes. So: keep each beat display:none except while it is on screen.
//
// The cards also ship 400 `will-change` declarations. will-change is a hint to
// pre-promote a layer; at this volume it forces ~900 permanent compositing
// layers and is strictly harmful. GSAP animates fine without it, and stripping
// it also avoids the background-clip:text descender clipping in renders.
{
  const before = (html.match(/will-change/g) || []).length;
  html = html.replace(/\s*will-change\s*:[^;}]*;/g, "").replace(/\s*will-change\s*:[^;}]*(?=\})/g, "");
  const after = (html.match(/will-change/g) || []).length;
  console.log(`will-change: stripped ${before - after} of ${before}`);
}
{
  // The clip root itself must NOT be display-gated (the framework owns a clip's
  // display — lint: gsap_animates_clip_element). Gate the expensive CHILDREN
  // instead: .bg carries the beam + both wide-radius glows + grid + sparks,
  // and .grain / .vignette are full-screen composited overlays.
  const HEAVY = [".bg", ".grain", ".vignette"];
  let gate = "\n  /* keep off-screen ambient stacks out of paint + the compositor */\n";
  let gated = 0;
  plan.beats.forEach((b, i) => {
    const id = beatId(i);
    // sidepanel/overlay cards already hide these in section 9's mode CSS
    if (b.mode === "sidepanel" || b.mode === "overlay") return;
    const show = Math.max(0, +(b.start - 0.6).toFixed(2));
    const hide = Math.min(parseFloat(VIDEO_DUR), +((chainExit[id] != null ? chainExit[id] + (coverHold[id] ? COVER_HOLD : 0) : b.start + b.duration) + 0.15).toFixed(2));
    for (const c of HEAVY) {
      gate += `  MT.set("#${id} ${c}", { display: "block" }, ${show});\n`;
      gate += `  MT.set("#${id} ${c}", { display: "none" }, ${hide});\n`;
    }
    gated++;
  });
  const m = html.match(/\n\s*MT\.set\(\{\}, \{\}, [\d.]+\);/);
  if (!m) throw new Error("timeline pad anchor not found for the display gate");
  html = html.replace(m[0], gate + m[0]);
  // start them hidden so the first paint never builds every ambient stack at once
  const sel = plan.beats
    .map((b, i) => (b.mode === "sidepanel" || b.mode === "overlay") ? null : HEAVY.map((c) => `#${beatId(i)} ${c}`).join(","))
    .filter(Boolean).join(",");
  html = html.replace("</head>", `<style>\n${sel}{display:none;}\n</style>\n</head>`);
  console.log(`ambient gate: ${gated} covering beats x ${HEAVY.length} layers`);
}

// 7. shot motion, per mode. Overlay beats never move the video, so chains are
// computed over the VIDEO-AFFECTING beats only. The corner talking head is a
// rounded SQUARE: clip-path crops 22% off each side (zooms in on Nate) and
// carries the corner radius (shadow dropped — box-shadow ignores clip-path).
const PIP_DEFAULT = { scale: 0.30, marginX: 64, y: -64 };
const PIP_SMALL = { scale: 0.24, marginX: 56, y: -48 }; // versus verdicts + hub orbit label need the corner
const SMALL_PIP_ANCHORS = new Set([]);
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
      if (chainedOut && COVER.has(next.b.mode || "takeover")) {
        // under-cover reset: the incoming whip is solid from X+0.30 — snap the video and
        // scrim back at X+0.32, unseen (the held panel text hides at the same instant)
        const RS = f2(X + COVER_HOLD - 0.02);
        vt += `  MT.set(${V}, { scale: 1, x: 0, y: 0, filter: "blur(0px)" }, ${RS});\n`;
        vt += `  MT.set(${SC}, { x: ${-SCRIM.w} }, ${RS});\n`;
        scrimFree = RS;
      } else {
        const T1 = f2(X - SCRIM.outLead);
        vt += `  MT.to(${V}, { scale: 1, x: 0, y: 0, duration: ${SCRIM.dur}, ease: "${SCRIM.ease}" }, ${T1});\n`;
        vt += `  MT.to(${SC}, { x: ${-SCRIM.w}, duration: ${SCRIM.dur}, ease: "${SCRIM.ease}" }, ${T1});\n`;
        scrimFree = X - SCRIM.outLead + SCRIM.dur;
      }
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
    // the settle must end ON the video end, never past it (last beat: E-0.32+0.45 = E+0.13)
    if (!chainedOut) vt += `  MT.to(${V}, { scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }, ${f2(Math.min(E - 0.32, parseFloat(VIDEO_DUR) - 0.45))});\n`;
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
    // the 3-chip icon row wraps 2+1 inside the default 40% column — widen it
    if (WIDE_PANEL_ANCHORS.has(b.anchor)) modeCss += `#${id} .inner{width:52%;}\n#${id} .chips,#${id} .row{flex-wrap:nowrap;}\n`;
  } else if (b.mode === "pip") {
    modeCss += `#${id} .inner{transform:translateY(-46px) scale(.95);transform-origin:50% 42%;}\n`;
    modeCss += `#${id} .sub{max-width:760px;white-space:normal;margin-left:auto;margin-right:auto;}\n`;
  }
});
{
  const g = idByAnchor(GRID_ANCHOR);
  const heroes = HERO_TILES.map(([a]) => idByAnchor(a));
  // 2 x 540 + 36 = 1116 panel px -> 692 screen px at the .62 panel scale, so the
  // grid ends ~787px: still on the opaque part of the scrim (704 solid, .94 @ 854).
  // Tile sources are 694px wide (2x), so 540 is a 0.78x downsample — crisp.
  modeCss += `#${g} .list{display:grid;grid-template-columns:repeat(2,540px);gap:28px 36px;width:auto;max-width:none;}\n`;
  modeCss += `#${g} .crow.mrow{display:block;}\n`;
  modeCss += `#${g} .mlabel{display:block;height:0;overflow:hidden;font-size:0;line-height:0;}\n`;
  const all = [g, ...heroes].map((id) => `#${id} .mtile`).join(",");
  modeCss += `${all}{display:block;width:540px;height:auto;border-radius:16px;border:1px solid rgba(255,255,255,.10);box-shadow:0 18px 50px rgba(0,0,0,.55);}\n`;
  modeCss += heroes.map((id) => `#${id} .mtile.hero`).join(",") + `{width:640px;border-radius:18px;margin-bottom:6px;}\n`;
}
{
  const t = idByAnchor(THUMB_ANCHOR);
  // 960 wide keeps eyebrow + AIS+ mark + thumb + badges inside 1080 (~915px stack at gap 38)
  modeCss += `#${t} .thumbwrap{display:flex;justify-content:center;}\n`;
  modeCss += `#${t} .thumb{display:block;width:960px;height:auto;border-radius:22px;border:1px solid rgba(255,255,255,.12);box-shadow:0 26px 80px rgba(0,0,0,.6);}\n`;
  const m = idByAnchor(BULLET_ANCHOR);
  modeCss += `#${m} .bullet{display:flex;align-items:flex-start;gap:18px;margin-top:-6px;max-width:700px;}\n`;
  modeCss += `#${m} .bdot{flex:none;width:14px;height:14px;border-radius:50%;background:var(--blue);box-shadow:0 0 16px var(--blue);margin-top:14px;}\n`;
  modeCss += `#${m} .btx{font-family:var(--font-body);font-weight:var(--wt-reg);font-size:34px;line-height:1.3;color:var(--text-dim);}\n`;
}
{
  // THE SURPRISE hero reads "EVERY FUTURE EVENT FREE" on ONE line (Aidan 9/2). At the 176px
  // hero size that is ~2020px wide, so pin nowrap and drop to 144px (~1650px).
  const h = idByAnchor("attend every future AIS Live event for free");
  modeCss += `#${h} .ln.hero{white-space:nowrap;font-size:144px;}\n`;
}
{
  // agenda cards in sidepanel mode: the library row is chip | TITLE | desc on one line
  // (up to 1420px). Inside the 40% panel that overruns the scrim, so stack desc under
  // title next to the chip and cap the block at 720 panel px (~450 on screen at .62).
  const AG = ["over 3,000 builders, business owners", "going through the courses"].map(idByAnchor);
  for (const id of AG) {
    // the block must be wider than the 40% panel (672px content) or 26-char titles wrap; like the
    // module grid it simply overflows the .inner — 900px is ~620px on screen, inside the opaque scrim
    modeCss += `#${id} .agenda{width:900px;max-width:none;gap:20px;}\n`;
    modeCss += `#${id} .agt{white-space:nowrap;}\n`;
    modeCss += `#${id} .agrow{display:grid;grid-template-columns:86px 1fr;grid-template-rows:auto auto;column-gap:26px;row-gap:2px;align-items:center;}\n`;
    modeCss += `#${id} .agrow .chip{grid-row:1/3;}\n`;
    modeCss += `#${id} .agt{grid-column:2;grid-row:1;font-size:30px;}\n`; // 26 -> 30: rows read small at the .62 panel scale
    modeCss += `#${id} .agl{grid-column:2;grid-row:2;font-size:30px;color:var(--text-dim);}\n`;
  }
}
modeCss += "</style>\n";
html = html.includes("</head>")
  ? html.replace("</head>", modeCss + "</head>")
  : html.replace('<div id="ais-plus-annual-upsell"', modeCss + '<div id="ais-plus-annual-upsell"');

// 9a. hero tile entrance: rides the card's own timeline just ahead of the eyebrow drop
HERO_TILES.forEach(([anchor]) => {
  const id = idByAnchor(anchor);
  const key = `window.__beatTimelines["${id}"] = tl;`;
  if (!html.includes(key)) throw new Error(`hero tile tween: timeline hook not found for ${id}`);
  html = html.replace(key, `tl.fromTo($(".mtile.hero"), {autoAlpha:0, y:30, scale:.94, filter:"blur(10px)"}, {autoAlpha:1, y:0, scale:1, filter:"blur(0px)", duration:.7, ease:"power3.out", transformOrigin:"0% 100%"}, 0.10);\n      ${key}`);
});

// 9b. corner mark per beat. This video sells AIS+, so only the beats that are
// literally about the EVENT keep the AIS LIVE mark; from the AIS+ introduction
// onward the mark reads AIS+ (white, per the AIS styling directive). The mark
// is hidden on sidepanel cards, so this only affects takeover / pip / flash.
const MARK_SWITCH_AT = 70; // the "AI Automation Society Plus" beat and later
{
  const AIS_PLUS = '<span class="ais">AIS</span><span class="plus"><span class="p">+</span></span>';
  let swapped = 0;
  plan.beats.forEach((b, i) => {
    if (b.start < MARK_SWITCH_AT || b.mode === "sidepanel" || b.mode === "overlay") return;
    inBeat(beatId(i), (sec) => sec.replace(
      /<span[^>]*class="ais">AIS<\/span><span[^>]*class="gap"><\/span><span[^>]*class="live">LIVE<span[^>]*class="ring"><\/span><span[^>]*class="dot"><\/span><\/span>/g,
      () => { swapped++; return AIS_PLUS; }
    ));
  });
  if (!swapped) throw new Error("no AIS LIVE marks swapped to AIS+");
  console.log(`corner mark: ${swapped} card(s) switched to AIS+`);
}

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
