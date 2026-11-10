#!/usr/bin/env node
// Restamp the inlined libs into every Humanly Possible V3 card:
//   lib/text-preset.js  between /* @text-preset:start */ ... /* @text-preset:end */
//   lib/field-glass.js  between /* @field-glass:start */ ... /* @field-glass:end */
//   lib/ascii-engine.js between /* @ascii-engine:start */ ... /* @ascii-engine:end */ (SIGNAL cards only)
// Cards carry inlined copies because inline assembly copies only a card's own <script>.
//   node scripts/style-library/sync-hp3-libs.mjs [--check] [card.html ...]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const STYLE = path.join(ROOT, "style-library/15-humanly-possible-v3");
const LIBS = ["text-preset", "field-glass", "ascii-engine"].map((k) => ({
  k, src: fs.readFileSync(path.join(STYLE, `lib/${k}.js`), "utf8").trim(),
  re: new RegExp(`/\\* @${k}:start[^*]*\\*/[\\s\\S]*?/\\* @${k}:end \\*/`),
}));
const check = process.argv.includes("--check");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--")).map((a) => path.resolve(a));
const walk = (d) => fs.readdirSync(d).flatMap((f) => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p) : f.endsWith(".html") && !f.startsWith("_") ? [p] : []; });

let n = 0, stale = 0;
for (const p of walk(path.join(STYLE, "cards"))) {
  if (only.length && !only.includes(p)) continue;
  const s = fs.readFileSync(p, "utf8");
  let out = s;
  for (const l of LIBS) if (l.re.test(out)) out = out.replace(l.re, () => l.src);
  if (out === s && !LIBS.some((l) => l.re.test(s))) continue;
  n++;
  if (out !== s) { stale++; if (!check) fs.writeFileSync(p, out); }
}
console.log(`${n} v3 cards carry inlined libs; ${stale} ${check ? "stale" : "restamped"}`);
if (check && stale) process.exit(1);
