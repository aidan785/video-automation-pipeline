#!/usr/bin/env node
// Restamp the Sanji TEXT preset (uppit-reveal) into every Sanji card that carries it.
// Source of truth: style-library/12-sanji/lib/text-preset.js
// Cards hold an inlined copy between /* @text-preset:start */ ... /* @text-preset:end */
// because inline assembly (motion-graphics skill) copies only a card's own <script>.
//   node scripts/style-library/sync-text-preset.mjs [--check]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const STYLE = path.join(ROOT, "style-library/12-sanji");
const engine = fs.readFileSync(path.join(STYLE, "lib/text-preset.js"), "utf8").trim();
const RE = /\/\* @text-preset:start[^*]*\*\/[\s\S]*?\/\* @text-preset:end \*\//;
const check = process.argv.includes("--check");
// optional: only these card files (paths relative to the style folder or absolute)
const only = process.argv.slice(2).filter((a) => !a.startsWith("--")).map((a) => path.resolve(a.startsWith("/") ? a : path.join(STYLE, a)));

let n = 0, stale = 0;
for (const dir of ["cards/tier1", "cards/tier2", "cards/transitions"]) {
  const d = path.join(STYLE, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".html"))) {
    const p = path.join(d, f);
    if (only.length && !only.includes(p)) continue;
    const s = fs.readFileSync(p, "utf8");
    if (!RE.test(s)) continue;
    n++;
    const out = s.replace(RE, () => engine);
    if (out !== s) { stale++; if (!check) fs.writeFileSync(p, out); }
  }
}
console.log(`${n} cards carry the text preset; ${stale} ${check ? "stale" : "restamped"}`);
if (check && stale) process.exit(1);
