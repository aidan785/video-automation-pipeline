#!/usr/bin/env node
// Residual-onset patch: widen six cut starts back to the previous kept word (source coords).
// Emits retake-specs.json with manual entries for retake-pass.mjs.
import fs from 'node:fs';

const T = JSON.parse(fs.readFileSync(new URL('./assets/combined-raw.transcript.json', import.meta.url), 'utf8'));
const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const words = T.words.filter(w => w.type !== 'spacing').map(w => ({ ...w, n: norm(w.text) })).filter(w => w.n.length);
const seq = [];
words.forEach((w, wi) => { for (const t of w.n.split(' ')) seq.push({ t, wi }); });

// window: unique raw token context; prevIdx: index in window of the last KEPT word; cutIdx: first cut word
const FIXES = [
  { window: "Blender. So, so it's still-- So again,", prev: 0, cut: 1, label: 'so-onset sliver after Blender.' },
  { window: "So again, so it's still important", prev: 1, cut: 2, label: 'so-onset sliver after again' },
  { window: "platform, it's easily manipulated", prev: 0, cut: 1, label: 'its-onset sliver after platform' },
  { window: 'updated in the evergreen', prev: 0, cut: 1, label: 'in-onset sliver after updated' },
  { window: 'knows that it it knows', prev: 1, cut: 2, label: 'it-onset sliver after that' },
  { window: 'comes to building in now if', prev: 2, cut: 3, label: 'in-onset sliver after building' },
];

const manual = [];
for (const f of FIXES) {
  const w = norm(f.window).split(' ').filter(Boolean);
  const hits = [];
  outer: for (let i = 0; i + w.length <= seq.length; i++) {
    for (let j = 0; j < w.length; j++) if (seq[i + j].t !== w[j]) continue outer;
    hits.push(i);
  }
  if (hits.length !== 1) { console.error(`${hits.length} hits for "${f.window}"`); process.exit(1); }
  const prevW = words[seq[hits[0] + f.prev].wi];
  const cutW = words[seq[hits[0] + f.cut].wi];
  const start = +(prevW.end + 0.02).toFixed(3);
  const end = +(cutW.start + 0.12).toFixed(3);
  if (end <= start) { console.error(`bad range for "${f.window}": ${start}-${end}`); process.exit(1); }
  manual.push({ start, end, label: f.label });
  console.log(`${f.label}: source ${start}-${end}  (prev "${prevW.text}" ${prevW.start}-${prevW.end}, cut-word "${cutW.text}" starts ${cutW.start})`);
}
fs.writeFileSync(new URL('./assets/retake-specs.json', import.meta.url), JSON.stringify({ specs: [], manual }, null, 2));
console.log('wrote assets/retake-specs.json');
