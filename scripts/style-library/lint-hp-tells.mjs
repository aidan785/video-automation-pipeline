#!/usr/bin/env node
// Fails Humanly Possible v2 + v3 cards that contain the "AI tells" Aidan rejected.
// Usage: node scripts/style-library/lint-hp-tells.mjs [card.html ...]   (default: every card in 14-humanly-possible-v2 and 15-humanly-possible-v3)
// v3 (Field Glass) profile: liquid/frosted glass is ALLOWED (Aidan's direction overrides the brand no-glass rule),
// and box-shadow is allowed only as an inset light catch or a soft ambient pool (blur >= 40px and >= 2x the offset).
// Everything else (text-shadow, drop-shadow(), outline boxes, edge bars, bounce eases, em dashes) stays banned.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const LIB = resolve(dirname(fileURLToPath(import.meta.url)), "../../style-library");
const ROOT = LIB;
const LIBS = ["14-humanly-possible-v2", "15-humanly-possible-v3"];
const V3 = "15-humanly-possible-v3";
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") && !f.startsWith("_") ? [p] : []; });
const files = process.argv.length > 2 ? process.argv.slice(2).map((f) => resolve(f)) : LIBS.flatMap((l) => walk(join(LIB, l, "cards")));

const RULES = [
  { id: "drop-shadow", re: /box-shadow\s*:|drop-shadow\(|feDropShadow|text-shadow\s*:/i, msg: "shadows are banned (box-shadow, text-shadow, drop-shadow, feDropShadow)", skip: V3 },
  { id: "drop-shadow", re: /drop-shadow\(|feDropShadow|text-shadow\s*:/i, msg: "text-shadow / drop-shadow() are banned (depth comes from glass, light, parallax)", only: V3 },
  { id: "outline-box", re: /(?:^|[;{\s])(?:border(?:-(?:top|right|bottom|left))?|outline)\s*:\s*[^;]*\d+(?:\.\d+)?px[^;]*(?:solid|dashed|double)/im, msg: "outline/keyline/border boxes are banned (stroke-box exception needs data-tell-ok=\"stroke-box\")", allow: /data-tell-ok="stroke-box"/ },
  { id: "edge-bar", re: /border-(?:left|right)\s*:\s*\d/i, msg: "edge accent bars are banned" },
  { id: "glass", re: /backdrop-filter/i, msg: "glass/backdrop-filter is banned", skip: V3 },
  { id: "bounce", re: /back\.(?:out|in|inOut)|elastic|bounce/i, msg: "bounce/overshoot/elastic eases are banned" },
  { id: "random", re: /Math\.random\(|Date\.now\(/, msg: "nondeterministic calls" },
  { id: "em-dash", re: /—|&mdash;/, msg: "em dashes in copy" },
];
// accent-bar heuristic: a thin, tall, colored element (e.g. width:6px;height:90px;background:var(--orange))
const BAR = (t) => (t.match(/\{[^}]*\}/g) || []).some((rule) => {
  const w = rule.match(/\bwidth\s*:\s*(\d+(?:\.\d+)?)px/i), h = rule.match(/\bheight\s*:\s*(\d+)px/i);
  const tall = (h && +h[1] >= 40) || (/\btop\s*:\s*-?\d/.test(rule) && /\bbottom\s*:\s*-?\d/.test(rule));
  const wide = rule.match(/\bheight\s*:\s*(\d+(?:\.\d+)?)px/i), long = (w && +w[1] >= 40) || (/\bleft\s*:\s*-?\d/.test(rule) && /\bright\s*:\s*-?\d/.test(rule));
  const colored = /background(?:-color)?\s*:/i.test(rule);
  return colored && ((w && +w[1] <= 12 && tall));
});

let fails = 0;
for (const f of files) {
  const t = readFileSync(f, "utf8"), rel = relative(ROOT, f), parts = rel.split("/"), fam = parts[parts.indexOf("cards") + 1] || "";
  const hits = [];
  for (const r of RULES) {
    if (r.family && fam === r.family) continue;
    if (r.skip && rel.startsWith(r.skip)) continue;
    if (r.only && !rel.startsWith(r.only)) continue;
    if (r.re.test(t) && !(r.allow && r.allow.test(t))) hits.push(`${r.id}: ${r.msg}`);
  }
  if (rel.startsWith(V3)) for (const m of t.matchAll(/box-shadow\s*:\s*([^;}"]+)/gi)) {
    // split the shadow list on commas outside rgba()
    for (const sh of m[1].split(/,(?![^(]*\))/)) {
      if (/\binset\b/.test(sh) || /^\s*(none|var\()/.test(sh)) continue;
      const n = (sh.replace(/rgba?\([^)]*\)|#[0-9a-f]+/gi, "").match(/-?\d+(?:\.\d+)?(?=px|\b)/g) || []).map(Number);
      const [x = 0, y = 0, blur = 0] = n;
      if (blur < 40 || blur < 2 * Math.max(Math.abs(x), Math.abs(y))) { hits.push(`flat-shadow: "${sh.trim()}" reads as an offset drop shadow (v3 allows inset or soft ambient: blur >= 40px and >= 2x offset)`); break; }
    }
  }
  if (BAR(t) && !/data-tell-ok="caret"/.test(t)) hits.push("edge-bar: thin tall colored element looks like an accent stripe (mark a text caret with data-tell-ok=\"caret\")");
  if (hits.length) { fails++; console.log(`FAIL ${rel}\n  - ${hits.join("\n  - ")}`); } else console.log(`ok   ${rel}`);
}
console.log(`\n${files.length - fails}/${files.length} clean`);
process.exit(fails ? 1 : 0);
