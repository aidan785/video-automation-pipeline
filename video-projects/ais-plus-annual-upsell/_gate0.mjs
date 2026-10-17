// Gate 0: every beat's rendered data-start must sit -0.2..1.8s BEFORE its anchor word.
import { readFileSync } from "node:fs";
import { findAnchor, WORDS } from "./_anchors.mjs";
const idxAfter = (sec) => { let i = 0; while (i < WORDS.length && WORDS[i].start < sec) i++; return i; };
const html = readFileSync("index.html", "utf8");
const re = /<div id="(beat\d+)"[^>]*data-anchor="([^"]*)"(?: data-anchor-after="([\d.]+)")?[^>]*data-start="([\d.]+)"[^>]*data-duration="([\d.]+)"/g;
const alt = /<div id="(beat\d+)"[^>]*data-start="([\d.]+)"[^>]*data-duration="([\d.]+)"[^>]*data-anchor="([^"]*)"/g;
let rows = [];
for (const m of html.matchAll(re)) rows.push({ id: m[1], anchor: m[2], after: m[3] ? +m[3] : 0, start: +m[4], dur: +m[5] });
if (!rows.length) for (const m of html.matchAll(alt)) rows.push({ id: m[1], anchor: m[4], start: +m[2], dur: +m[3] });
let bad = 0;
for (const r of rows) {
  const a = findAnchor(r.anchor.replace(/&quot;/g, '"'), r.after ? idxAfter(r.after) : 0);
  if (!a) { console.log(`MISS  ${r.id}  anchor not in transcript: ${r.anchor}`); bad++; continue; }
  const lead = +(a.start - r.start).toFixed(2);
  const ok = lead >= -0.2 && lead <= 1.8;
  if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${r.id}  start ${r.start.toFixed(2)}  anchor ${a.start.toFixed(2)}  lead ${lead.toFixed(2)}  ${r.anchor.slice(0, 40)}`);
}
console.log(`\n${rows.length} beats · ${bad} out of window`);
process.exit(bad ? 1 : 0);
