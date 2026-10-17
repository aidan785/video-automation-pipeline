#!/usr/bin/env node
// YT Intro (pixel serif) — builds a render-ready index.html from intro.beats.json.
//
//   node style-templates/yt-intro-pixel-serif/build-intro.mjs video-projects/<slug>/intro.beats.json
//
// Every beat syncs to the word-level transcript by phrase (Scribe schema), so text can
// never drift off the word. Look + motion rules live in DESIGN.md next to this file.
//
// intro.beats.json
//   { id, fps, duration?, video?, audio?, cutout?, backdrop?, transcript?,
//     bg?: "<css filter>",                          // background plate only (the cutout stays clean on top)
//     cutFilter?: "<css filter>",                   // cutout only
//     plateIn?: { at, blur?, dur? },                // plate racks into focus here (match cut out of the cold open)
//     filmFrame?: [[t0,t1],...],                    // 4:3 cold open gate
//     clips?: [{ src, in, out, mediaStart? }],      // cold open videos, fitted to the gate
//     cam?: [{ at, s, dur?, ox?, oy? }],            // camera: no dur = hard cut (put it on a jump cut), dur = smooth zoom (0.42 to 0.54s).
//                                                   // at = seconds or a cue expression ("onestep-0.2"). Three or four zooms a minute, no more.
//     cues?: { name: "spoken phrase" | "end:phrase" | "phrase#2" },   // -> CUE.name in inject js, {{name}} / {{name+0.2}} in partials
//     inject?: { html?, behind?, css?, js? },       // project partials. behind = between the background and the cutout
//     beats: [
//       { small, big, x, y, align?, scale?, order?, smallStyle?, bigColor?, say?, t?, hold?, until?, tail? }
//       { note: ["line 1","line 2"], x, y, say?, t?, until? }
//       { label: ["LINE", "LINE"], colors?: ["w","y"], x, y, size?, say?: phrase | [phrase per line], hold?, until? }
//       { title: "STEP #1", sub?, x, y, size?, color?, say?, hold?, until? }
//       { caption: "This is *Elena*", say?, t?, dark? }
//     ] }
//   big may be an array: each entry replaces the previous one in the same slot.
//   say:   { small, big } = the spoken phrase when it differs from the on-screen text.
//   t:     { small: [t0,t1], big: t | [t,...], out } = explicit seconds, skips the transcript.
//   until: spoken phrase the beat stays up through (lists that build line by line).

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const cfgPath = resolve(process.argv[2] || "intro.beats.json");
const PROJECT = dirname(cfgPath);
const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));

const ID = cfg.id || "intro";
const FPS = cfg.fps || 30;
const F = 1 / FPS;
const W = 1920, H = 1080;

// measured off the reference (DESIGN.md)
const TYPE_TAIL = 0.35;      // typing finishes this long before the phrase ends
const TYPE_MIN_CPS = 22;     // never type slower than this
const PUNCH_LEAD = 0.2;      // first punch word lands this long before it is spoken
const PUNCH_STAGGER = 0.14;
const PUNCH_DUR = 0.26;
const PUNCH_RISE = 150;
const SWAP_GAP = 0.1;        // old word cuts this long before the new one rises
const HOLD = 1.8;
const FADE = 0.12;           // the reference kills text in about 3 frames
const OVERLAP_NEXT = 0.3;    // a beat may finish fading this long after the next one starts typing

const snap = (t) => Math.round(t * FPS) / FPS;
const esc = (s) => s.replace(/'/g, "’").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const norm = (s) => s.toLowerCase().replace(/[’`]/g, "'").replace(/-/g, "").replace(/[^a-z0-9' ]+/g, " ").trim().split(/\s+/).filter(Boolean);
const read = (rel) => readFileSync(join(PROJECT, rel), "utf8");
function fail(msg) { console.error("build-intro: " + msg); process.exit(1); }

// ---------- transcript phrase lookup ----------
let words = [];
if (cfg.transcript) {
  const tr = JSON.parse(read(cfg.transcript));
  words = tr.words.filter((w) => w.type === "word").map((w) => ({ n: norm(w.text).join(""), start: w.start, end: w.end }));
}
const scan = (want, from) => {
  for (let i = from; i <= words.length - want.length; i++) {
    if (want.every((w, k) => words[i + k].n === w)) return i;
  }
  return -1;
};
let cursor = 0;
function find(phrase, label) {
  const m = /^(.*)#(\d+)$/.exec(phrase);
  if (m) return findNth(m[1], +m[2], label);
  const want = norm(phrase);
  if (!words.length) fail(`${label}: no transcript loaded and no explicit "t" for "${phrase}"`);
  let i = scan(want, cursor);
  if (i < 0) i = scan(want, 0);
  if (i < 0) fail(`${label}: "${phrase}" is not in the transcript. Set "say" to the words actually spoken.`);
  cursor = i + want.length;
  return { start: words[i].start, end: words[i + want.length - 1].end };
}
function findNth(phrase, n, label) {
  const want = norm(phrase);
  let i = -1;
  for (let k = 0; k < n; k++) {
    i = scan(want, i + 1);
    if (i < 0) fail(`${label}: occurrence ${n} of "${phrase}" is not in the transcript.`);
  }
  return { start: words[i].start, end: words[i + want.length - 1].end };
}

// ---------- cues: named word times for the project partials ----------
const CUE = {};
for (const [name, spec] of Object.entries(cfg.cues || {})) {
  if (typeof spec === "number") { CUE[name] = spec; continue; }
  const end = spec.startsWith("end:");
  const phrase = end ? spec.slice(4) : spec;
  const hit = /#\d+$/.test(phrase) ? find(phrase, `cue ${name}`) : findNth(phrase, 1, `cue ${name}`);
  CUE[name] = snap(end ? hit.end : hit.start);
}
cursor = 0;
// camera times may be cue expressions
const cueTime = (v, label) => {
  if (typeof v === "number") return v;
  const m = /^\s*([a-zA-Z0-9_]+)\s*(?:([+-])\s*([0-9.]+))?\s*$/.exec(v);
  if (!m || !(m[1] in CUE)) fail(`${label}: "${v}" is not seconds or a known cue (+/- offset)`);
  return CUE[m[1]] + (m[2] ? (m[2] === "+" ? 1 : -1) * +m[3] : 0);
};
const CAM = (cfg.cam || []).map((c, i) => ({ ...c, at: snap(cueTime(c.at, `cam ${i + 1}`)) }));
const fill = (text) => text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*(?:([+-])\s*([0-9.]+))?\s*\}\}/g, (_, name, sign, num) => {
  if (!(name in CUE)) fail(`partial uses {{${name}}} but there is no cue with that name`);
  const v = CUE[name] + (sign ? (sign === "+" ? 1 : -1) * +num : 0);
  return String(Math.round(v * 1000) / 1000);
});

// ---------- resolve timings ----------
const beats = cfg.beats.map((b, i) => {
  const id = `b${String(i + 1).padStart(2, "0")}`;
  const label = `beat ${i + 1}`;
  if (b.caption) {
    const span = b.t ? { start: b.t[0], end: b.t[1] } : find(b.say || b.caption.replace(/\*/g, ""), label);
    return { id, kind: "caption", text: b.caption, dark: !!b.dark, in: span.start, out: span.end, anchor: b.say || b.caption.replace(/\*/g, "") };
  }
  const kind = b.note ? "note" : b.label ? "label" : b.title ? "title" : "stack";
  const out = { id, kind, src: b };
  if (kind === "note") {
    const span = b.t ? { start: b.t.small[0], end: b.t.small[1] } : find(b.say || b.note.join(" "), label);
    out.type = typeSpan(span, b.note.join("").length, b.tail);
    out.landed = out.type[1];
    out.anchor = b.say || b.note.join(" ");
  } else if (kind === "label") {
    // pixel caps lines: one phrase per line, or one phrase spread across the lines
    const says = Array.isArray(b.say) ? b.say : null;
    if (says) out.lines = says.map((p) => find(p, label).start - 0.06);
    else {
      const span = find(b.say || b.label.join(" "), label);
      const step = Math.min(0.24, (span.end - span.start) / b.label.length);
      out.lines = b.label.map((_, k) => span.start - 0.06 + k * step);
    }
    out.landed = out.lines[out.lines.length - 1] + 0.1;
    out.anchor = says ? says[0] : b.say || b.label.join(" ");
  } else if (kind === "title") {
    const span = find(b.say || b.title, label);
    out.pop = span.start - 0.12;
    out.landed = out.pop + 0.22;
    if (b.sub) { out.type = [out.pop + 0.2, out.pop + 0.2 + Math.max(0.35, b.sub.length / 34)]; out.landed = out.type[1]; }
    out.anchor = b.say || b.title;
  } else {
    const bigs = [].concat(b.big);
    const sayBig = [].concat(b.say?.big ?? bigs);
    if (b.small) {
      const span = b.t?.small ? { start: b.t.small[0], end: b.t.small[1] } : find(b.say?.small || b.small, label);
      out.type = b.t?.small ? [span.start, span.end] : typeSpan(span, b.small.length, b.tail);
    }
    const tBig = b.t?.big !== undefined ? [].concat(b.t.big) : sayBig.map((p) => find(p, label).start - PUNCH_LEAD);
    // big-small order: the small line types after the punch has landed, so punch may lead it
    if (out.type && (b.order || "small-big") === "small-big") tBig[0] = Math.max(tBig[0], out.type[1] + 0.08);
    out.big = bigs.map((text, k) => ({ text, at: tBig[k] }));
    const last = out.big[out.big.length - 1];
    out.landed = last.at + PUNCH_STAGGER * (last.text.split(" ").length - 1) + PUNCH_DUR;
    if (out.type) out.landed = Math.max(out.landed, out.type[1]);
    out.anchor = sayBig[0];
  }
  out.in = Math.min(out.type ? out.type[0] : Infinity, out.big ? out.big[0].at : Infinity, out.lines ? out.lines[0] : Infinity, out.pop ?? Infinity);
  if (b.until) {
    const save = cursor;
    out.out = find(b.until, label).end + 0.25;
    out.pinned = true;
    cursor = save;
  } else {
    out.out = b.t?.out ?? out.landed + (b.hold ?? HOLD);
  }
  return out;
});
function typeSpan(span, nChars, tail = TYPE_TAIL) {
  let end = Math.max(span.start + 0.4, span.end - tail);
  end = Math.min(end, span.start + nChars / TYPE_MIN_CPS);
  return [span.start, end];
}
// a beat hands off to the next one: its fade ends just after the next one starts
const timed = beats.filter((b) => b.kind !== "caption").sort((a, b) => a.in - b.in);
timed.forEach((b, i) => {
  if (b.pinned) return;
  const next = timed[i + 1];
  if (next && b.out > next.in + OVERLAP_NEXT) b.out = next.in + OVERLAP_NEXT;
  if (b.out < b.landed + 0.4) console.warn(`build-intro: ${b.id} only holds ${(b.out - b.landed).toFixed(2)}s after landing. Move the next beat or shorten this one.`);
});
// text never survives a hard camera cut, and never pops in a few frames ahead of one
const cutTimes = CAM.filter((c) => !c.dur && c.at > 0).map((c) => c.at);
timed.forEach((b) => {
  const late = cutTimes.find((t) => t > b.in && t <= b.in + 0.35);
  if (late !== undefined) {
    const d = late + F - b.in;
    b.in += d;
    if (b.type && b.type[0] < b.in) b.type = [b.in, Math.max(b.type[1], b.in + 0.3)];
    if (b.big && b.big[0].at < b.in) b.big[0].at = b.in;
    if (b.lines) b.lines = b.lines.map((t) => Math.max(t, b.in));
    if (b.pop !== undefined && b.pop < b.in) b.pop = b.in;
  }
  const hit = cutTimes.find((t) => t > b.in && t < b.out);
  if (hit !== undefined) {
    b.out = hit - F;
    if (b.out < b.landed + 0.3) console.warn(`build-intro: ${b.id} is cut off by the camera cut at ${hit}s only ${(b.out - b.landed).toFixed(2)}s after landing.`);
  }
  if (cfg.duration && b.out > cfg.duration - 0.05) b.out = cfg.duration - 0.05;
});
// cold open captions hold until the next one takes over (they never blink off mid-sentence)
const caps = beats.filter((b) => b.kind === "caption").sort((a, b) => a.in - b.in);
caps.forEach((c, i) => { const next = caps[i + 1]; c.out = next && next.in - c.out < 0.8 ? next.in : c.out + 0.2; });
beats.forEach((b) => { b.in = snap(b.in); b.out = snap(b.out); });

const lastOut = Math.max(...beats.map((b) => b.out));
const DURATION = cfg.duration || snap(lastOut + 0.5);

// ---------- markup ----------
const chars = (text) => [...text].map((c) => (c === " " ? `<span class="ch sp"> </span>` : `<span class="ch">${esc(c)}</span>`)).join("");
const punch = (text) => text.split(" ").map((w) => `<span class="pw"><span class="pwi">${esc(w)}</span></span>`).join(" ");

function beatHtml(b, i) {
  const start = snap(Math.max(0, b.in - 0.1));
  const dur = snap(b.out - start + 0.05);
  // every text beat gets its own track: list beats and handoffs overlap by design
  const head = `id="${b.id}" class="clip beat" data-start="${start}" data-duration="${dur}" data-track-index="${20 + i}" data-anchor="${esc(b.anchor)}"`;
  if (b.kind === "caption") {
    const text = esc(b.text).replace(/\*([^*]+)\*/g, "<i>$1</i>");
    return `  <div id="${b.id}" class="clip cap${b.dark ? " dark" : ""}" data-start="${b.in}" data-duration="${snap(b.out - b.in)}" data-track-index="12" data-anchor="${esc(b.anchor)}">${text}</div>`;
  }
  const s = b.src;
  const align = s.align || "center";
  const pos = `left:${s.x}px;top:${s.y}px;--s:${s.scale ?? 1}`;
  if (b.kind === "note") {
    const lines = s.note.map((l, k) => `<div class="nl" style="margin-left:${k * 34}px">${chars(l)}</div>`).join("");
    return `  <div ${head}><div class="stack ${align}" style="${pos}"><div class="notebox">${lines}</div></div></div>`;
  }
  if (b.kind === "label") {
    const lines = s.label.map((l, k) => `<div class="lb ${(s.colors || [])[k] === "y" ? "y" : ""}">${esc(l)}</div>`).join("");
    return `  <div ${head}><div class="stack ${align}" style="${pos};--lb:${s.size ?? 58}px">${lines}</div></div>`;
  }
  if (b.kind === "title") {
    const sub = s.sub ? `<div class="tsub">${chars(s.sub)}</div>` : "";
    return `  <div ${head}><div class="stack ${align}" style="${pos};--tt:${s.size ?? 150}px"><div class="tt ${s.color === "white" ? "w" : ""}">${esc(s.title)}</div>${sub}</div></div>`;
  }
  const smallCls = { white: "sm", yellow: "sm y", note: "sm note" }[s.smallStyle || "white"];
  const small = s.small ? `<div class="${smallCls}">${chars(s.small)}</div>` : "";
  const bigCls = `bg ${s.bigColor === "white" ? "w" : ""} ${align}`;
  const big = `<div class="slot">${b.big.map((x) => `<div class="${bigCls}">${punch(x.text)}</div>`).join("")}</div>`;
  const order = (s.order || "small-big") === "small-big" ? small + big : big + small;
  return `  <div ${head}><div class="stack ${align}" style="${pos}">${order}</div></div>`;
}

const plan = beats.filter((b) => b.kind !== "caption").map((b) => ({
  id: b.id,
  type: b.type ? b.type.map(snap) : null,
  big: b.big ? b.big.map((x) => snap(x.at)) : null,
  lines: b.lines ? b.lines.map(snap) : null,
  pop: b.pop !== undefined ? snap(b.pop) : null,
  out: b.out,
}));
const exits = plan.map((b) =>
  `  tl.to("#${b.id} .stack", { opacity: 0, duration: ${FADE}, ease: "power1.in" }, ${snap(b.out - FADE)});\n  tl.set("#${b.id} .stack", { opacity: 0 }, ${b.out});`).join("\n");

const plate = cfg.video
  ? `<video id="plate-v" src="${cfg.video}" data-start="0" data-duration="${DURATION}" data-track-index="0" muted playsinline></video>`
  : cfg.backdrop
    ? `<img src="${cfg.backdrop}" alt="">`
    : "";
const cutout = cfg.cutout
  ? `<div id="cut"><video id="cut-v" src="${cfg.cutout}" data-start="0" data-duration="${DURATION}" data-track-index="4" muted playsinline></video></div>`
  : "";
const audio = cfg.video ? `\n  <audio id="plate-a" src="${cfg.audio || cfg.video}" data-start="0" data-duration="${DURATION}" data-track-index="1" data-volume="1"></audio>` : "";
const gates = (cfg.filmFrame || []).map(([a, b], i) =>
  `  <div id="gate${i + 1}" class="clip gate" data-start="${snap(a)}" data-duration="${snap(b - a)}" data-track-index="5"><div class="hole"></div></div>`).join("\n");
const shots = (cfg.clips || []).map((c, i) =>
  `  <div class="shot" id="shotw${i + 1}"><video id="shot${i + 1}" src="${c.src}" data-start="${snap(c.in)}" data-duration="${snap(c.out - c.in)}" data-media-start="${c.mediaStart ?? 0}" data-track-index="3" muted playsinline></video></div>`).join("\n");
const inj = cfg.inject || {};
const injHtml = inj.html ? fill(read(inj.html)) : "";
const injBehind = inj.behind ? fill(read(inj.behind)) : "";
const injCss = inj.css ? read(inj.css) : "";
const injJs = inj.js ? read(inj.js) : "";
const face = (family, weight, file, style = "normal") =>
  `  @font-face { font-family: "${family}"; font-weight: ${weight}; font-style: ${style}; src: url("assets/fonts/${file}") format("woff2"); }`;

const html = `<!DOCTYPE html>
<!-- generated by style-templates/yt-intro-pixel-serif/build-intro.mjs from ${cfgPath.split("/").pop()} — edit the JSON (and its inject partials), not this file -->
<html>
<head>
<meta charset="utf-8">
<style>
${face("Redaction 35", 700, "redaction-35-latin-700-normal.woff2")}
${face("Redaction 50", 700, "redaction-50-latin-700-normal.woff2")}
${face("Redaction 70", 700, "redaction-70-latin-700-normal.woff2")}
${face("Redaction 100", 700, "redaction-100-latin-700-normal.woff2")}
${face("Lexend", 300, "lexend-latin-300-normal.woff2")}
${face("Inter", 500, "inter-latin-500-normal.woff2")}
${face("Inter", 500, "inter-latin-500-italic.woff2", "italic")}
${face("Bangers", 400, "bangers-latin-400-normal.woff2")}
${face("Pixelify Sans", 600, "pixelify-sans-latin-600-normal.woff2")}
${face("Young Serif", 400, "young-serif-latin-400-normal.woff2")}

  html, body { margin: 0; padding: 0; background: #000; }
  #${ID} { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #000; --yellow: #FEFF5E; --white: #FFFBF8; --ink: #141414; }
  /* camera: background plate, things behind the speaker, then the clean cutout of the speaker */
  #cam, #plate-focus, #plate-bg, #behind, #cut { position: absolute; inset: 0; }
  #cam { z-index: 1; transform-origin: 50% 36%; }
  #plate-bg { filter: ${cfg.bg || "none"}; }
  #cut { filter: ${cfg.cutFilter || "none"}; pointer-events: none; }
  #cam video, #plate-bg img { width: 100%; height: 100%; object-fit: cover; display: block; }
  #behind { pointer-events: none; }

  /* 4:3 cold open film frame */
  .shot { opacity: 0; position: absolute; left: 258px; top: 14px; width: 1404px; height: 1052px; z-index: 4; overflow: hidden; border-radius: 44px; pointer-events: none; }
  .shot video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .gate { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
  .gate .hole { position: absolute; left: 258px; top: 14px; width: 1404px; height: 1052px; border-radius: 44px;
    box-shadow: 0 0 0 2000px #000, inset 0 0 46px 20px rgba(0,0,0,.82), inset 0 0 6px 3px #000; }

  .beat { position: absolute; inset: 0; z-index: 10; pointer-events: none; }
  .stack { position: absolute; display: flex; flex-direction: column; }
  .sm + .slot { margin-top: calc(14px * var(--s, 1)); }
  .slot + .sm { margin-top: calc(-4px * var(--s, 1)); }
  .slot + .sm.note { font-size: calc(46px * var(--s, 1)); }
  .stack.center { align-items: center; transform: translateX(-50%); }
  .stack.left { align-items: flex-start; }

  .sm, .nl { font-family: "Lexend", sans-serif; font-weight: 300; font-size: calc(38.5px * max(var(--s, 1), .86)); line-height: 1.25; color: var(--white); white-space: pre; }
  .sm.y { color: var(--yellow); }
  .sm.note, .nl { font-size: calc(35px * var(--s, 1)); color: var(--yellow); transform: skewX(-11deg); transform-origin: 0 100%; }
  .notebox { display: flex; flex-direction: column; align-items: flex-start; }
  .ch { opacity: 0; }

  .slot { display: grid; }
  .slot > .bg { grid-area: 1 / 1; }
  .bg { font-family: "Redaction 35", serif; font-weight: 700; font-size: calc(118px * var(--s, 1)); line-height: 1.12; color: var(--yellow);
    white-space: nowrap; transform: scaleX(.787); transform-origin: 50% 50%; justify-self: center; }
  .bg.left { transform-origin: 0 50%; justify-self: start; }
  .bg.w { color: var(--white); }
  /* words rise from behind the baseline: overflow mask (clip-path here trips the renderer's heavy-overlay limit) */
  .pw { display: inline-block; overflow: hidden; vertical-align: bottom; padding: .32em .07em 0; margin: -.32em -.07em 0; }
  .pwi { display: inline-block; }

  /* pixel caps labels and comic titles: the two extra voices */
  .lb { font-family: "Pixelify Sans", monospace; font-weight: 600; font-size: var(--lb, 58px); line-height: 1.08; letter-spacing: .03em;
    text-transform: uppercase; color: var(--white); white-space: nowrap; opacity: 0; }
  .lb.y { color: var(--yellow); }
  .tt { font-family: "Bangers", sans-serif; font-size: var(--tt, 150px); line-height: 1; letter-spacing: .02em; color: var(--yellow);
    white-space: nowrap; transform: skewX(-6deg) rotate(-3deg); text-shadow: 7px 7px 0 var(--ink); -webkit-text-stroke: 3px var(--ink); paint-order: stroke fill; }
  .tt.w { color: #fff; }
  .tsub { margin-top: 10px; margin-left: 14px; font-family: "Lexend", sans-serif; font-weight: 300; font-size: 40px; line-height: 1.2; color: #fff;
    white-space: pre; transform: skewX(-9deg); text-shadow: 0 2px 10px rgba(0,0,0,.55); }

  .cap { position: absolute; left: 0; right: 0; top: 1010px; z-index: 12; text-align: center;
    font-family: "Inter", sans-serif; font-weight: 500; font-size: 49px; line-height: 1.2; color: #fff; }
  .cap i { font-style: italic; }
  .cap.dark { color: #141414; }
${injCss}
</style>
</head>
<body>
<div id="${ID}" data-composition-id="${ID}" data-start="0" data-duration="${DURATION}" data-width="${W}" data-height="${H}">
  <div id="cam">
    <div id="plate-focus"><div id="plate-bg">${plate}</div></div>
    <div id="behind">
${injBehind}
    </div>
    ${cutout}
  </div>${audio}
${shots}
${gates}
${injHtml}
${beats.map(beatHtml).join("\n")}
</div>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
window.__timelines = window.__timelines || {};
(() => {
  const tl = gsap.timeline({ paused: true });
  const FPS = ${FPS};
  const F = 1 / FPS;
  const snap = (t) => Math.round(t * FPS) / FPS;
  const PLAN = ${JSON.stringify(plan)};
  const CAM = ${JSON.stringify(CAM)};
  const CUE = ${JSON.stringify(CUE)};
  const PLATE_IN = ${JSON.stringify(cfg.plateIn || null)};
  const SHOTS = ${JSON.stringify((cfg.clips || []).map((c) => [snap(c.in), snap(c.out)]))};
  SHOTS.forEach(([a, b], i) => { tl.set("#shotw" + (i + 1), { opacity: 1 }, a); tl.set("#shotw" + (i + 1), { opacity: 0 }, b); });
  const GRADES = ['"Redaction 100"', '"Redaction 70"', '"Redaction 50"', '"Redaction 35"'];

  PLAN.forEach((b) => {
    const root = document.getElementById(b.id);
    // setup line / note / title sub: types on across the spoken phrase
    if (b.type) {
      const chs = root.querySelectorAll(".ch");
      const [t0, t1] = b.type;
      chs.forEach((ch, i) => tl.set(ch, { opacity: 1 }, snap(t0 + ((t1 - t0) * i) / chs.length)));
    }
    // punch line: each word rises with a small overshoot while it resolves from chunky pixels to the final cut
    if (b.big) {
      const lines = root.querySelectorAll(".bg");
      lines.forEach((line, k) => {
        if (k > 0) tl.set(lines[k - 1], { opacity: 0 }, snap(b.big[k] - ${SWAP_GAP}));
        line.querySelectorAll(".pwi").forEach((w, i) => {
          const t = snap(b.big[k] + i * ${PUNCH_STAGGER});
          tl.fromTo(w, { y: ${PUNCH_RISE} }, { y: 0, duration: ${PUNCH_DUR}, ease: "back.out(1.5)" }, t);
          GRADES.forEach((g, n) => tl.set(w, { fontFamily: g + ", serif" }, snap(t + n * 2 * F)));
        });
      });
    }
    // pixel caps label: lines blink on, one per word
    if (b.lines) {
      root.querySelectorAll(".lb").forEach((el, k) => {
        const t = b.lines[k];
        tl.set(el, { opacity: 1 }, t).set(el, { opacity: 0 }, snap(t + F)).set(el, { opacity: 1 }, snap(t + 2 * F));
      });
    }
    // comic title: slams in
    if (b.pop !== null) {
      tl.fromTo(root.querySelector(".tt"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: "back.out(2.4)" }, b.pop);
    }
  });

  // exits: each stack snaps out as the next beat takes over, then is hard-killed for clean seeking
${exits}

  // camera: a few smooth zooms and hard cuts. The zoom curve is measured off the reference: about half a
  // second, quick off the mark with a long soft landing (close to CSS "ease"). Everything in #cam moves
  // together, so the speaker, the background and whatever sits behind the speaker stay locked.
  const bez = (x1, y1, x2, y2) => (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let lo = 0, hi = 1, u = p;
    for (let i = 0; i < 24; i++) {
      const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
      if (x < p) lo = u; else hi = u;
      u = (lo + hi) / 2;
    }
    return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  };
  const camEase = bez(0.25, 0.1, 0.25, 1);
  CAM.forEach((c) => {
    const o = (c.ox ?? 50) + "% " + (c.oy ?? 36) + "%";
    if (c.dur) tl.to("#cam", { scale: c.s, duration: c.dur, ease: camEase }, c.at);
    else tl.set("#cam", { scale: c.s, transformOrigin: o }, c.at);
  });
  // match cut out of the cold open: the plate racks into focus
  if (PLATE_IN) tl.fromTo("#cam", { filter: "blur(" + (PLATE_IN.blur ?? 16) + "px)" },
    { filter: "blur(0px)", duration: PLATE_IN.dur ?? 0.4, ease: "power2.out", immediateRender: false }, snap(PLATE_IN.at));

${injJs}

  tl.set({}, {}, ${DURATION});
  window.__timelines["${ID}"] = tl;
})();
</script>
</body>
</html>
`;

writeFileSync(join(PROJECT, "index.html"), html);

// fonts + project stubs travel with the project
const fontsOut = join(PROJECT, "assets", "fonts");
mkdirSync(fontsOut, { recursive: true });
for (const f of readdirSync(join(HERE, "fonts"))) copyFileSync(join(HERE, "fonts", f), join(fontsOut, f));
for (const f of ["hyperframes.json"]) if (!existsSync(join(PROJECT, f))) copyFileSync(join(HERE, f), join(PROJECT, f));
if (!existsSync(join(PROJECT, "meta.json"))) {
  const slug = PROJECT.split("/").pop();
  writeFileSync(join(PROJECT, "meta.json"), JSON.stringify({ id: slug, name: slug, createdAt: cfg.createdAt || "" }, null, 2) + "\n");
}

// sync table
console.log(`index.html written: ${beats.length} beats, ${DURATION}s @ ${FPS}fps`);
for (const b of beats) {
  if (b.kind === "caption") continue;
  const s = b.src;
  const what = b.kind === "note" ? s.note.join(" / ") : b.kind === "label" ? s.label.join(" / ") : b.kind === "title" ? s.title : `${s.small || ""} / ${[].concat(s.big).join(" > ")}`;
  console.log(`  ${b.id} ${b.kind.padEnd(6)} in ${b.in.toFixed(2)} out ${b.out.toFixed(2)}  ${what}`);
}
