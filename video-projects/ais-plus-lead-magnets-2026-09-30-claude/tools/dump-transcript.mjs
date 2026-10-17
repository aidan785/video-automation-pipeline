#!/usr/bin/env node
// Scribe word JSON -> readable phrase lines for editorial review.
// A new line starts after any pause >= BREAK seconds; pauses >= 0.6s are printed inline.
// Usage: node tools/dump-transcript.mjs 03-transcripts/raw/<slug>.json [--break 0.45] > 03-transcripts/readable/<slug>.txt
import { readFileSync } from "node:fs";

const [, , file, ...rest] = process.argv;
const BREAK = Number(rest[rest.indexOf("--break") + 1]) || 0.45;
const data = JSON.parse(readFileSync(file, "utf8"));
const words = data.words.filter((w) => w.type === "word" || w.type === "audio_event");
const mmss = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, "0")}`;

let line = [];
let lineStart = null;
const out = [];
const flush = () => {
  if (line.length) out.push(`[${mmss(lineStart)}] ${line.join(" ")}`);
  line = [];
};
for (let i = 0; i < words.length; i++) {
  const w = words[i];
  const prev = words[i - 1];
  const gap = prev ? w.start - prev.end : 0;
  if (prev && gap >= BREAK) {
    flush();
    if (gap >= 0.6) out.push(`        ~ pause ${gap.toFixed(2)}s (${mmss(prev.end)} to ${mmss(w.start)})`);
  }
  if (!line.length) lineStart = w.start;
  line.push(w.type === "audio_event" ? `{${w.text}}` : w.text);
}
flush();
const first = words[0];
const last = words[words.length - 1];
console.log(`# ${file.split("/").pop()}  | audio ${data.audio_duration_secs?.toFixed?.(2)}s | ${words.length} tokens | speech ${mmss(first.start)} to ${mmss(last.end)}`);
console.log(out.join("\n"));
