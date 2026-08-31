#!/usr/bin/env node
// Convert a Scribe word-JSON transcript into timestamped readable text for clip mining.
// Usage: node _to-text.mjs transcripts/foo.json > transcripts/foo.txt
import { readFileSync } from "node:fs";

const path = process.argv[2];
if (!path) { console.error("usage: node _to-text.mjs <transcript.json>"); process.exit(1); }
const j = JSON.parse(readFileSync(path, "utf8"));

const fmt = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return (h ? `${h}:` : "") + `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

let line = "", lineStart = null, lastSpeaker = null;
const out = [];
for (const w of j.words) {
  if (w.type !== "word") { line += w.text === " " ? " " : w.text; continue; }
  const speakerChanged = w.speaker_id && w.speaker_id !== lastSpeaker;
  if (lineStart === null) lineStart = w.start;
  // break line every ~20s or on speaker change
  if (speakerChanged || (w.start - lineStart > 20 && /[.!?]\s*$/.test(line))) {
    if (line.trim()) out.push(`[${fmt(lineStart)}]${lastSpeaker ? ` (${lastSpeaker})` : ""} ${line.trim()}`);
    line = ""; lineStart = w.start;
  }
  if (speakerChanged) lastSpeaker = w.speaker_id;
  line += w.text;
}
if (line.trim()) out.push(`[${fmt(lineStart)}]${lastSpeaker ? ` (${lastSpeaker})` : ""} ${line.trim()}`);
console.log(out.join("\n"));
