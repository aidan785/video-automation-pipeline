// resolve anchor phrases -> word start times on the clean timeline
import { readFileSync } from "node:fs";
const t = JSON.parse(readFileSync("assets/transcript.json", "utf8"));
export const WORDS = t.words.filter((w) => (w.type || "word") === "word");
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
const toks = WORDS.map((w) => norm(w.text));
export function findAnchor(phrase, from = 0) {
  const p = norm(phrase).split(" ");
  for (let i = from; i <= toks.length - p.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) if (toks[i + j] !== p[j]) { ok = false; break; }
    if (ok) return { i, start: WORDS[i].start, end: WORDS[i + p.length - 1].end };
  }
  return null;
}
export function wordAt(i) { return WORDS[i]; }
