#!/usr/bin/env node
// Turn text-anchored cut specs into approved-cuts.json ranges on the silence timeline.
// Spec forms:
//  { cut: "words to remove", before: "words that must immediately follow" }
//  { cutFromAfter: "anchor phrase kept", keep: "next kept phrase" }  -> cuts everything between
import fs from 'fs';

const trPath = process.argv[2];
const outPath = process.argv[3];
const tr = JSON.parse(fs.readFileSync(trPath, 'utf8'));
const norm = t => t.toLowerCase().replace(/[^a-z0-9]/g, '');
const words = tr.words.filter(w => w.type !== 'spacing');
const toks = words.map((w, i) => ({ i, n: norm(w.text), start: w.start, end: w.end }));
const seq = toks.filter(t => t.n.length > 0);

function findSeq(phrase, fromIdx = 0) {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = fromIdx; i <= seq.length - p.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) if (seq[i + j].n !== p[j]) { ok = false; break; }
    if (ok) return { at: i, len: p.length };
  }
  return null;
}

const specs = JSON.parse(fs.readFileSync(process.argv[4] || 'cut-specs.json', 'utf8'));
const cuts = [];
let fail = 0;
for (const s of specs) {
  if (s.cut) {
    // find cut phrase immediately followed by before-anchor
    const p = s.cut.split(/\s+/).map(norm).filter(Boolean);
    const b = s.before.split(/\s+/).map(norm).filter(Boolean);
    let found = null;
    for (let i = 0; i <= seq.length - p.length - b.length; i++) {
      let ok = true;
      for (let j = 0; j < p.length; j++) if (seq[i + j].n !== p[j]) { ok = false; break; }
      if (ok) for (let j = 0; j < b.length; j++) if (seq[i + p.length + j].n !== b[j]) { ok = false; break; }
      if (ok) { found = i; break; }
    }
    if (found == null) { console.error(`FAIL cut: "${s.cut}" before "${s.before}"`); fail++; continue; }
    const firstRm = seq[found], lastRm = seq[found + p.length - 1], firstKeep = seq[found + p.length];
    const prevKeep = found > 0 ? seq[found - 1] : null;
    const start = prevKeep ? Math.max(prevKeep.end + 0.02, firstRm.start - 0.15) : Math.max(0, firstRm.start - 0.15);
    const end = firstKeep.start - 0.06;
    if (end <= start) { console.error(`FAIL degenerate range for "${s.cut}"`); fail++; continue; }
    cuts.push({ start: +start.toFixed(3), end: +end.toFixed(3), reason: s.reason || `cut "${s.cut}"` });
    console.log(`ok  ${start.toFixed(2)}-${end.toFixed(2)} (${(end-start).toFixed(2)}s) rm:"${s.cut.slice(0,60)}" keep:"${s.before.slice(0,40)}"`);
  } else if (s.trimGapAfter) {
    const a = findSeq(s.trimGapAfter);
    if (!a) { console.error(`FAIL trim anchor: "${s.trimGapAfter}"`); fail++; continue; }
    const last = seq[a.at + a.len - 1], next = seq[a.at + a.len];
    const keep = s.keep ?? 0.25;
    const gap = next.start - last.end;
    if (gap <= keep + 0.15) { console.log(`skip trimGap "${s.trimGapAfter}" gap only ${gap.toFixed(2)}s`); continue; }
    const start = last.end + keep * 0.6, end = next.start - keep * 0.4;
    cuts.push({ start: +start.toFixed(3), end: +end.toFixed(3), reason: s.reason || `trim gap after "${s.trimGapAfter.slice(0,40)}"` });
    console.log(`ok  ${start.toFixed(2)}-${end.toFixed(2)} (${(end-start).toFixed(2)}s) trimGap after:"${s.trimGapAfter.slice(0,40)}"`);
  } else {
    const a = findSeq(s.cutFromAfter);
    if (!a) { console.error(`FAIL anchor: "${s.cutFromAfter}"`); fail++; continue; }
    const anchorEndTok = seq[a.at + a.len - 1];
    const k = findSeq(s.keep, a.at + a.len);
    if (!k) { console.error(`FAIL keep: "${s.keep}"`); fail++; continue; }
    const keepTok = seq[k.at];
    const start = anchorEndTok.end + 0.02;
    const end = keepTok.start - 0.06;
    if (end <= start) { console.error(`FAIL degenerate region after "${s.cutFromAfter}"`); fail++; continue; }
    cuts.push({ start: +start.toFixed(3), end: +end.toFixed(3), reason: s.reason || `region cut after "${s.cutFromAfter.slice(0,40)}"` });
    console.log(`ok  ${start.toFixed(2)}-${end.toFixed(2)} (${(end-start).toFixed(2)}s) region after:"${s.cutFromAfter.slice(0,50)}"`);
  }
}
if (fail) { console.error(`${fail} spec(s) failed — nothing written`); process.exit(1); }
cuts.sort((x, y) => x.start - y.start);
// overlap check
for (let i = 1; i < cuts.length; i++) if (cuts[i].start < cuts[i-1].end) { console.error(`OVERLAP ${cuts[i-1].reason} / ${cuts[i].reason}`); process.exit(1); }
fs.writeFileSync(outPath, JSON.stringify({ cuts }, null, 2));
console.log(`\n${cuts.length} cuts -> ${outPath}, total ${cuts.reduce((a,c)=>a+c.end-c.start,0).toFixed(1)}s`);
