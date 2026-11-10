#!/usr/bin/env node
// Merge HP V3 builder outputs (_meta/<GROUP>.json) into style.json, keeping the gold cards first.
// Validates each entry: file exists, poster exists, id unique. Prints a summary.
//   node scripts/style-library/merge-hp3-meta.mjs [--dry]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const LIB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../style-library/15-humanly-possible-v3");
const style = JSON.parse(fs.readFileSync(path.join(LIB, "style.json"), "utf8"));
const gold = style.cards.filter((c) => c.gold);
const out = [...gold], seen = new Set(gold.map((c) => c.id)), files = new Set(gold.map((c) => c.file));
const problems = [];
for (const f of fs.readdirSync(path.join(LIB, "_meta")).filter((x) => /^[A-Z0-9]+\.json$/.test(x)).sort()) {
  const arr = JSON.parse(fs.readFileSync(path.join(LIB, "_meta", f), "utf8"));
  for (const c of arr) {
    if (!fs.existsSync(path.join(LIB, c.file))) { problems.push(`${f}: missing file ${c.file}`); continue; }
    if (files.has(c.file)) { problems.push(`${f}: duplicate file ${c.file}`); continue; }
    if (!c.poster || !fs.existsSync(path.join(LIB, c.poster))) problems.push(`${f}: missing poster for ${c.file}`);
    if (c.slots && !Array.isArray(c.slots)) c.slots = Object.entries(c.slots).map(([name, v]) => (typeof v === "object" ? { name, ...v } : { name, type: "text", maxChars: v }));
    let id = c.id; for (let n = 2; seen.has(id); n++) id = `${c.id}-${n}`;
    seen.add(id); files.add(c.file); out.push({ ...c, id, group: f.replace(".json", "") });
  }
}
style.cards = out;
if (!process.argv.includes("--dry")) fs.writeFileSync(path.join(LIB, "style.json"), JSON.stringify(style, null, 2) + "\n");
const by = {}; out.forEach((c) => (by[c.category] = (by[c.category] || 0) + 1));
console.log(`${out.length} cards`, by); if (problems.length) console.log("problems:\n  " + problems.join("\n  "));
