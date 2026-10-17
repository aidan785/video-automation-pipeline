#!/usr/bin/env node
// Render the clean (unstyled) edit of one clip from its approved plan, in ONE ffmpeg pass.
//   4K source -> 1920x1080, full-range yuvj420p -> tv-range bt709, VFR -> CFR 30, 10ms audio fades at every join.
// Writes to 04-edit-plan/clean/:
//   <slug>.mp4              clean edit (source level audio; loudness is applied at finishing)
//   <slug>.union-edl.json   source-coord EDL (same schema verify-cuts consumes)
//   <slug>.filter.txt       the exact filtergraph used
//   <slug>.words.json       raw transcript words mapped onto the edit timeline (caption source)
//   <slug>.phrases.json     verify phrase checks (abandoned takes gone, kept takes present once)
// Usage: node tools/cut-clean.mjs <slug> [--dry]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
const dry = process.argv.includes("--dry");
const part = process.argv.includes("--part") ? process.argv[process.argv.indexOf("--part") + 1] : null; // core only: A = opening, B = proof bridge onward
const SOURCES = {
  "01-ad-sop": "01 AD - First AI Automation Client SOP.mp4",
  "02-ad-aios": "02 AD - AI OS Template.mp4",
  "03-ad-scrollcraft": "03 AD - Scrollcraft.mp4",
  "04-vsl-intro-sop": "04 VSL INTRO - First AI Client SOP.mp4",
  "05-vsl-intro-aios": "05 VSL INTRO - AI OS Template.mp4",
  "06-vsl-intro-scrollcraft": "06 VSL INTRO - Scrollcraft.mp4",
  "07-vsl-intro-generic": "07 VSL INTRO - Generic (free Skool join emails).mp4",
  "08-vsl-core": "08 VSL CORE BODY.mp4",
};
// Verify phrase checks: abandoned takes must be gone (0), kept takes present exactly once (1).
const PHRASES = {
  "01-ad-sop": [["so this sop right here", 1], ["the exact outreach messages that land projects", 1], ["it shows you the one sentence pitch", 0]],
  "02-ad-aios": [["jarvis works so well", 0], ["jarvis worked so well", 1]],
  "05-vsl-intro-aios": [["provides support", 1], ["with support", 0]],
  "08-vsl-core": [
    ["one of our members went from a regular", 1], ["closing a three hundred", 0],
    ["other members are regularly closing deals", 1], ["i was looking at", 0], ["and as i said", 1],
    ["and your rate is locked in for life", 1], ["so even when we raise", 0],
    ["several thousand", 1], ["do the math", 1], ["the annual plan makes it", 0],
    ["so the version of you", 1], ["valuable and durable", 1],
    ["experts expert", 0], ["team of expert humans", 1],
  ],
};
if (!SOURCES[slug]) { console.error(`unknown slug ${slug}`); process.exit(2); }

const plan = JSON.parse(readFileSync(join(ROOT, "04-edit-plan", `${slug}.plan.json`), "utf8"));
const raw = JSON.parse(readFileSync(join(ROOT, "03-transcripts/raw", `${slug}.json`), "utf8"));
const src = join(ROOT, "sources", SOURCES[slug]);
const outDir = join(ROOT, "04-edit-plan/clean");
mkdirSync(outDir, { recursive: true });

const srcDur = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], { encoding: "utf8" }));
let keeps = plan.keepSegments.map((s) => ({ start: s.srcIn, end: s.srcOut }));
if (part) {
  const bridge = plan.markers.find((m) => m.id === "PROOF_BRIDGE").rawWordStart;
  const bi = keeps.findIndex((k) => k.end > bridge);
  if (bi <= 0) throw new Error("bridge not at a segment boundary");
  keeps = part === "A" ? keeps.slice(0, bi) : keeps.slice(bi);
}
const tag = part ? `${slug}-${part}` : slug;
const editedDur = keeps.reduce((a, k) => a + (k.end - k.start), 0);
const deletes = [];
let cur = 0;
for (const k of keeps) { if (k.start > cur + 0.001) deletes.push({ start: +cur.toFixed(3), end: k.start }); cur = k.end; }
if (cur < srcDur - 0.001) deletes.push({ start: cur, end: +srcDur.toFixed(3) });
const removed = deletes.reduce((a, d) => a + (d.end - d.start), 0);
writeFileSync(join(outDir, `${tag}.union-edl.json`), JSON.stringify({
  source: SOURCES[slug], source_duration: +srcDur.toFixed(3), edited_duration: +editedDur.toFixed(3), removed: +removed.toFixed(3),
  keep_ranges: keeps, delete_ranges: deletes,
}, null, 2) + "\n");

// words -> edit timeline: a word belongs to the keep that holds its midpoint (a tight micro-cut can start a keep a few ms
// after a word's Scribe start, e.g. 05 "support" 54.46 vs keep 54.465); times are clamped into that keep
let acc = 0;
const segMap = keeps.map((k) => { const m = { ...k, ed: acc }; acc += k.end - k.start; return m; });
const mapped = [];
for (const w of raw.words.filter((x) => x.type === "word")) {
  const mid = (w.start + w.end) / 2;
  const s = segMap.find((k) => mid >= k.start && mid <= k.end);
  if (!s) continue;
  const a = Math.max(w.start, s.start), b = Math.min(w.end, s.end);
  mapped.push({ text: w.text, start: +(s.ed + a - s.start).toFixed(3), end: +(s.ed + b - s.start).toFixed(3), srcStart: w.start, srcEnd: w.end });
}
writeFileSync(join(outDir, `${tag}.words.json`), JSON.stringify({ clip: tag, duration: +editedDur.toFixed(3), words: mapped }, null, 2) + "\n");
writeFileSync(join(outDir, `${tag}.phrases.json`), JSON.stringify((part === "A" ? [] : PHRASES[slug] || []).map(([phrase, expect]) => ({ phrase, expect, from: "retake plan" })), null, 2) + "\n");

// filtergraph: per-keep trim + 10ms fades, concat, then CFR + scale/range conversion
const F = 0.01;
const lines = [];
keeps.forEach((k, i) => {
  const len = k.end - k.start;
  lines.push(`[0:v]trim=start=${k.start.toFixed(4)}:end=${k.end.toFixed(4)},setpts=PTS-STARTPTS[v${i}];`);
  lines.push(`[0:a]atrim=start=${k.start.toFixed(4)}:end=${k.end.toFixed(4)},asetpts=PTS-STARTPTS,afade=t=in:d=${F},afade=t=out:st=${(len - F).toFixed(4)}:d=${F}[a${i}];`);
});
lines.push(keeps.map((_, i) => `[v${i}][a${i}]`).join("") + `concat=n=${keeps.length}:v=1:a=1[vc][ac];`);
lines.push(`[vc]fps=30,scale=1920:1080:flags=lanczos:in_range=full:out_range=tv,format=yuv420p[v];`);
lines.push(`[ac]aresample=48000[a]`);
const filterPath = join(outDir, `${tag}.filter.txt`);
writeFileSync(filterPath, lines.join("\n"));

const out = join(outDir, `${tag}.mp4`);
const args = ["-v", "error", "-y", "-hwaccel", "videotoolbox", "-i", src, "-/filter_complex", filterPath, "-map", "[v]", "-map", "[a]",
  "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-g", "30", "-keyint_min", "30", "-sc_threshold", "0",
  "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
  "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-movflags", "+faststart", out];
console.log(`${tag}: ${keeps.length} keeps, ${editedDur.toFixed(2)}s (removed ${removed.toFixed(2)}s of ${srcDur.toFixed(2)}s), ${mapped.length} words mapped`);
if (!dry) {
  const t0 = Date.now();
  execFileSync("ffmpeg", args, { stdio: "inherit" });
  const got = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], { encoding: "utf8" }));
  console.log(`${tag}: rendered ${got.toFixed(3)}s (expected ${editedDur.toFixed(3)}s) in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${out}`);
}
