#!/usr/bin/env node
// Round-3 editorial pass: piece together the best take of every repeated /
// restarted sentence. Cuts are specified as normalized token phrases on the
// CURRENT render's fresh transcript (assets/clean.json), each with a `before`
// keep-anchor (the words that must immediately follow) so duplicate phrases
// resolve to the right occurrence. Fresh words are aligned token-by-token to
// the raw source transcript to get SOURCE coords (never the rendered timeline
// — concat drift). Deletions subtract from final-union-edl keeps, MIN_KEEP
// bridge, one re-render from source.
//
// usage: node _retake-pass.mjs [--apply]

import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const SRC = '/Users/aidanstanik/Projects/Adobe Transfer Folder/2026-07-24 16-53-41.mov';
const apply = process.argv.includes('--apply');

const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const toks = words => words.map(w => ({ ...w, n: norm(w.text) })).filter(w => w.n);

const fresh = toks(JSON.parse(fs.readFileSync('assets/clean.json', 'utf8')).words.filter(w => w.type === 'word'));
const raw = toks(JSON.parse(fs.readFileSync('assets/raw-transcript.json', 'utf8')).words.filter(w => w.type === 'word'));

// ---- align fresh -> raw (two-pointer with bigram-confirmed resync) ----
const map = new Array(fresh.length).fill(null);
let r = 0, unmatched = 0;
for (let f = 0; f < fresh.length; f++) {
  if (r < raw.length && raw[r].n === fresh[f].n) { map[f] = r++; continue; }
  let found = -1;
  for (let j = r; j < Math.min(raw.length, r + 80); j++) {
    if (raw[j].n === fresh[f].n &&
        (f + 1 >= fresh.length || j + 1 >= raw.length ||
         raw[j + 1].n === fresh[f + 1].n ||
         (j + 2 < raw.length && raw[j + 2].n === fresh[f + 1].n))) { found = j; break; }
  }
  if (found >= 0) { map[f] = found; r = found + 1; }
  else unmatched++;
}
console.log(`aligned ${fresh.length - unmatched}/${fresh.length} fresh words (${unmatched} unmatched)`);

// ---- cut specs: {t: approx fresh seconds, cut, before} ----
const SPECS = [
  { t: 18, cut: "it's definitely nowhere near", before: "it's definitely nowhere near a professional" },
  { t: 44, cut: "it's", before: "opus 5 has 43" },
  { t: 24, cut: "but this new opus update is but this new opus 5 update", before: "but this new opus 5 update is a huge jump" },
  { t: 59, cut: "the biggest thing especially as someone who worked the biggest", before: "the biggest stat in my opinion" },
  { t: 76, cut: "and that's a almost 20", before: "and that's an almost 20 jump" },
  { t: 87, cut: "so this is so this is a huge jump for the actual modeling", before: "so this is a huge jump for the actual claude knowledge" },
  { t: 100, cut: "because it's a better model is because it's a better model because it's technically a better because it's a better mo", before: "because it's a better model on the stats" },
  { t: 110, cut: "then it should be", before: "then it should be giving us better outputs" },
  { t: 126, cut: "but it is really cool to see because it has this physics ability because it has so it's really cool to see that they're like utilizing um creative so it's really cool to see that they're utilizing some 3d examples on physics 3d building", before: "so it's really cool to see that they're utilizing some of these 3d models" },
  { t: 149, cut: "and in th", before: "and in today's video" },
  { t: 152, cut: "so let's jump so let's jump into the actual video how can we start prompting inside of opus 4 point so let's jump into the actual video", before: "so let's jump into blender" },
  { t: 170, cut: "now before we get started", before: "now before we get started i wanna show" },
  { t: 179, cut: "so firstly", before: "so firstly is this kind" },
  { t: 202, cut: "but this is literally", before: "but this is a" },
  { t: 210, cut: "but i mean but i mean", before: "but i mean like look at the materials" },
  { t: 239, cut: "ai being able to implement", before: "ai being able to create scenes" },
  { t: 271, cut: "and so i also gave some", before: "and so i gave some context" },
  { t: 275, cut: "like what are the stresses and", before: "like what are the stresses of this build" },
  { t: 305, cut: "and then i gave it", before: "and then i gave it some context for that" },
  { t: 311, cut: "and then just some lighting stuff the volumetric scatter", before: "and then just some lighting stuff volume scatter" },
  { t: 320, cut: "an output like this and l to get", before: "an output like this and start animating" },
  { t: 338, cut: "like i mean this is and it looks great", before: "i mean this is definitely workable" },
  { t: 368, cut: "to b", before: "to get a real 3d scene" },
  { t: 378, cut: "the next thing i wanted to show you is the next scene that i had built is", before: "the next scene that i had built out with claude" },
  { t: 385, cut: "and i will say", before: "the actual product itself feels fake" },
  { t: 413, cut: "this took a way", before: "this took a way longer time" },
  { t: 420, cut: "but the good thing with opus 5 is it's half as cheap as", before: "but the good thing with opus 5 is it's half as expensive" },
  { t: 449, cut: "and a few", before: "and 40 to 45 minutes" },
  { t: 457, cut: "and so this is", before: "and so this is what that scene" },
  { t: 461, cut: "it ha it created a water simulation and it cached it ca", before: "it created a water simulation for me" },
  { t: 470, cut: "all", before: "it cached the entire simulation" },
  { t: 474, cut: "and i'm honestly like really shocked", before: "and i'm honestly like really shocked with the fact" },
  { t: 482, cut: "and so now if you have a product even if it's", before: "and so now if you have a product whether" },
  { t: 511, cut: "as the very f", before: "as the first prompt" },
  { t: 544, cut: "why is this why does this build why does this build", before: "why is this build stressful" },
  { t: 549, cut: "let alone like a beginner u", before: "let alone like a beginner learning" },
  { t: 584, cut: "redesign it", before: "redesign it inside of blender" },
  { t: 603, cut: "and then this last scene that i had created is this canyon that i wanted to", before: "and then this last scene that i created is this canyon setup" },
  { t: 643, cut: "everything's really dry", before: "there's lots of rocks" },
  { t: 652, cut: "at a low sun", before: "at a low sunset" },
  { t: 683, cut: "and then obviously geometry nodes for the", before: "and then geometry nodes the sky" },
  { t: 740, cut: "you need to have blender five you need to have blender 505", before: "you need to have blender 51 or newer" },
  { t: 763, cut: "and then and then find your addons or", before: "and then find your addons and then search up mcp" },
  { t: 784, cut: "because you've only installed the addon we just need to add so you've already installed the", before: "you just installed the addon into blender" },
  { t: 799, cut: "so it's just easier", before: "it's easier to do this" },
  { t: 808, cut: "go into your account settings and then find the extensions you can see i have blender already set up but we can click browse extensions and then delete that part okay so once you're in the des once you're in the desktop app you just need to", before: "so once you're in the desktop app you need to find the customized tab" },
  { t: 832, cut: "and then", before: "and then install" },
  { t: 839, cut: "you just need to authorize that you have the mcp you just need to authorize that this is", before: "you just need to authorize that claude is available" },
  { t: 850, cut: "you can", before: "you can load it up" },
  { t: 854, cut: "you just need to write slap", before: "you just need to type in mcp" },
  { t: 858, cut: "and that will pull up", before: "and that will pull up all of your mcps" },
  { t: 865, cut: "or if you're in", before: "or if you're inside of an ide" },
  { t: 879, cut: "so no matter what session i'm in", before: "so no matter what session i'm in i can use" },
  { t: 883, cut: "to build up", before: "to build certain things" },
  { t: 895, cut: "this community has over one point six thousand people in", before: "this community has over one point six thousand members" },
  { t: 907, cut: "and i", before: "and i also provide" },
  { t: 911, cut: "so i use", before: "so as you can see" },
  { t: 914, cut: "every", before: "everything from testing" },
  { t: 921, cut: "with the", before: "with the skill file" },
  { t: 924, cut: "but it's a great community and it's a great", before: "but it's a great supportive community" },
];

// ---- locate each spec in fresh tokens ----
function locate(spec) {
  const cut = spec.cut.split(/\s+/).map(norm).filter(Boolean);
  const before = spec.before.split(/\s+/).map(norm).filter(Boolean).slice(0, 5);
  for (let i = 0; i < fresh.length; i++) {
    if (Math.abs(fresh[i].start - spec.t) > 25) continue;
    let ok = true;
    for (let k = 0; k < cut.length; k++) if (!fresh[i + k] || fresh[i + k].n !== cut[k]) { ok = false; break; }
    if (!ok) continue;
    for (let k = 0; k < before.length; k++) if (!fresh[i + cut.length + k] || fresh[i + cut.length + k].n !== before[k]) { ok = false; break; }
    if (ok) return { p: i, q: i + cut.length };
  }
  return null;
}

// hand-placed source-coord cuts (regions where raw/fresh tokenization diverges)
const MANUAL_DELETES = [
  // raw merged "and I wanted," into a stretched "and" before a 3s pause; cut it
  // plus the pause, keeping "I wanted geometry nodes, I wanted lots of rocks."
  { start: 1176.71, end: 1179.77, label: 'dup "and I wanted," + pause' },
];

const deletions = [...MANUAL_DELETES];
let failed = 0;
for (const spec of SPECS) {
  const loc = locate(spec);
  if (!loc) { console.log('NOT FOUND:', JSON.stringify(spec.cut.slice(0, 60)), '@' + spec.t); failed++; continue; }
  // source coords: start of first cut word .. start of first kept word after
  let pi = loc.p, qi = loc.q;
  while (pi < loc.q && map[pi] === null) pi++;
  while (qi < fresh.length && map[qi] === null) qi++;
  if (pi >= loc.q || qi >= fresh.length) { console.log('UNMAPPED:', spec.cut.slice(0, 60)); failed++; continue; }
  const s = raw[map[pi]].start - 0.02;
  const e = raw[map[qi]].start - 0.08;
  if (e <= s) { console.log('BAD RANGE:', spec.cut.slice(0, 60)); failed++; continue; }
  const rawText = raw.slice(map[pi], map[qi]).map(w => w.text).join(' ');
  deletions.push({ start: s, end: e, label: spec.cut.slice(0, 50) });
  console.log(`CUT src ${s.toFixed(2)}-${e.toFixed(2)} (${(e - s).toFixed(2)}s) | raw: "${rawText.slice(0, 110)}"`);
}
console.log(failed ? `\n${failed} SPECS FAILED — fix before applying` : '\nall specs located');

// ---- subtract from current keeps ----
const edl = JSON.parse(fs.readFileSync('assets/final-union-edl.json', 'utf8'));
const MIN_KEEP = 0.3;
const dels = deletions.map(d => ({ start: d.start, end: d.end })).sort((a, b) => a.start - b.start);
let finalKeeps = [];
for (const k of edl.keep_ranges) {
  let cursor = k.start;
  for (const d of dels) {
    if (d.end <= k.start || d.start >= k.end) continue;
    if (d.start > cursor) finalKeeps.push({ start: cursor, end: Math.min(d.start, k.end) });
    cursor = Math.max(cursor, d.end);
  }
  if (cursor < k.end) finalKeeps.push({ start: cursor, end: k.end });
}
finalKeeps = finalKeeps.filter(k => k.end - k.start >= MIN_KEEP);
const outDur = finalKeeps.reduce((a, k) => a + (k.end - k.start), 0);
console.log(JSON.stringify({ cuts: deletions.length, cutSeconds: +dels.reduce((a, d) => a + (d.end - d.start), 0).toFixed(1), finalKeepRanges: finalKeeps.length, finalDuration: +outDur.toFixed(2) }, null, 2));

if (failed) process.exit(1);

const srcDur = edl.source_duration;
const unionDeletes = [];
let cur = 0;
for (const k of finalKeeps) { if (k.start > cur + 0.001) unionDeletes.push({ start: cur, end: k.start }); cur = k.end; }
if (cur < srcDur - 0.001) unionDeletes.push({ start: cur, end: srcDur });
fs.writeFileSync('assets/final-union-edl.json', JSON.stringify({ source_duration: srcDur, edited_duration: +outDur.toFixed(3), keep_ranges: finalKeeps, delete_ranges: unionDeletes }, null, 2));

const lines = [];
finalKeeps.forEach((k, i) => {
  lines.push(`[0:v]trim=start=${k.start.toFixed(4)}:end=${k.end.toFixed(4)},setpts=PTS-STARTPTS[v${i}];`);
  lines.push(`[0:a]atrim=start=${k.start.toFixed(4)}:end=${k.end.toFixed(4)},asetpts=PTS-STARTPTS[a${i}];`);
});
lines.push(finalKeeps.map((_, i) => `[v${i}][a${i}]`).join('') + `concat=n=${finalKeeps.length}:v=1:a=1[v][a]`);
fs.writeFileSync('assets/clean-v3.filter.txt', lines.join('\n'));

const args = ['-y', '-i', SRC, '-/filter_complex', 'assets/clean-v3.filter.txt', '-map', '[v]', '-map', '[a]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', 'assets/clean.mp4'];
console.log('ffmpeg ready');
if (apply) execFileSync('ffmpeg', args, { stdio: 'inherit' });
