#!/usr/bin/env node
// Merge builder metadata (style-library/13-humanly-possible/_meta/*.json) into style.json.
// Keeps hand-entered cards (gold), replaces any card with the same id, skips files that don't exist.
// Usage: node scripts/style-library/merge-hp-meta.mjs && node scripts/style-library/build-registry.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../style-library/13-humanly-possible");
const stylePath = join(DIR, "style.json");
const style = JSON.parse(readFileSync(stylePath, "utf8"));
const byId = new Map(style.cards.map((c) => [c.id, c]));
const report = { added: [], replaced: [], missingFile: [], bad: [] };

for (const f of readdirSync(join(DIR, "_meta")).filter((f) => f.endsWith(".json")).sort()) {
  let arr;
  try { arr = JSON.parse(readFileSync(join(DIR, "_meta", f), "utf8")); } catch (e) { report.bad.push(`${f}: ${e.message}`); continue; }
  for (const c of arr) {
    if (!c.id || !c.file) { report.bad.push(`${f}: card without id/file`); continue; }
    if (!existsSync(join(DIR, c.file))) { report.missingFile.push(`${c.id} -> ${c.file}`); continue; }
    if (byId.get(c.id)?.gold) continue;
    (byId.has(c.id) ? report.replaced : report.added).push(c.id);
    byId.set(c.id, { ...c, group: f.replace(".json", "") });
  }
}
const order = ["tier1", "tier2", "layout", "transition", "sting"];
style.cards = [...byId.values()].sort((a, b) => (order.indexOf(a.tier) - order.indexOf(b.tier)) || a.id.localeCompare(b.id));
writeFileSync(stylePath, JSON.stringify(style, null, 2) + "\n");
console.log(JSON.stringify({ total: style.cards.length, ...report }, null, 2));
