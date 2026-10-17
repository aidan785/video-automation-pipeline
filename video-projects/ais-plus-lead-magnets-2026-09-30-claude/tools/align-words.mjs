#!/usr/bin/env node
// Caption timing = what's actually in the rendered clean file.
// Takes the plan-mapped words (exact text from the raw transcript) and re-times them with the fresh
// Scribe transcript of the rendered clean mp4 (concat padding makes plan times drift ~5ms per join).
// Greedy sequence alignment on normalized tokens; unmatched words are interpolated between neighbors.
// Usage: node tools/align-words.mjs <slug>   (reads 04-edit-plan/clean/<slug>.words.json + <slug>.fresh.json,
//        writes <slug>.aligned.json with the same shape as words.json)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "../04-edit-plan/clean");
const slug = process.argv[2];
const mapped = JSON.parse(readFileSync(join(DIR, `${slug}.words.json`), "utf8"));
const fresh = JSON.parse(readFileSync(join(DIR, `${slug}.fresh.json`), "utf8")).words.filter((w) => w.type === "word");
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, "");
const A = mapped.words, B = fresh;
const out = A.map((w) => ({ ...w, matched: false }));
let j = 0, matched = 0;
for (let i = 0; i < A.length; i++) {
  const a = norm(A[i].text);
  for (let k = j; k < Math.min(B.length, j + 6); k++) {
    if (norm(B[k].text) === a && a) { out[i].start = +B[k].start.toFixed(3); out[i].end = +B[k].end.toFixed(3); out[i].matched = true; j = k + 1; matched++; break; }
  }
}
// interpolate unmatched words from the nearest matched neighbours (preserve their planned spacing)
for (let i = 0; i < out.length; i++) {
  if (out[i].matched) continue;
  let p = i - 1; while (p >= 0 && !out[p].matched) p--;
  const shift = p >= 0 ? out[p].start - A[p].start : 0;
  out[i].start = +(A[i].start + shift).toFixed(3); out[i].end = +(A[i].end + shift).toFixed(3);
}
const drift = out.filter((w) => w.matched).map((w, i) => w.start - A[out.indexOf(w)].start);
writeFileSync(join(DIR, `${slug}.aligned.json`), JSON.stringify({ clip: mapped.clip, duration: mapped.duration, words: out.map(({ matched, ...w }) => w) }, null, 2) + "\n");
console.log(`${slug}: ${matched}/${A.length} words matched to the render; drift at end ${(drift[drift.length - 1] || 0).toFixed(3)}s`);
