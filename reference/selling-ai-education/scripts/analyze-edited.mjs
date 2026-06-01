#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = dirname(SCRIPT_DIR);
const ASSETS_DIR = join(PROJECT_DIR, "assets");
const ANALYSIS_DIR = join(ASSETS_DIR, "analysis");
mkdirSync(ANALYSIS_DIR, { recursive: true });

const transcript = JSON.parse(readFileSync(join(ASSETS_DIR, "edited-clean-transcript-elevenlabs.json"), "utf8"));
const words = transcript.words.filter((w) => w.type === "word").map((w, index) => ({
  index,
  text: w.text,
  start: Number(w.start),
  end: Number(w.end),
}));

function displayText(slice) {
  return slice.map((w) => w.text).join(" ").replace(/\s+([,.!?;:])/g, "$1");
}

function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${String(m).padStart(2, "0")}:${s.toFixed(2).padStart(5, "0")}`;
}

const segments = [];
let startIndex = 0;
for (let i = 1; i < words.length; i++) {
  const prev = words[i - 1];
  const current = words[i];
  const gap = current.start - prev.end;
  const elapsed = current.end - words[startIndex].start;
  const sentenceEnd = /[.!?]$/.test(prev.text);
  if (gap > 0.8 || (sentenceEnd && elapsed >= 8) || elapsed >= 18) {
    segments.push({
      id: segments.length + 1,
      start: words[startIndex].start,
      end: prev.end,
      duration: prev.end - words[startIndex].start,
      text: displayText(words.slice(startIndex, i)),
    });
    startIndex = i;
  }
}
segments.push({
  id: segments.length + 1,
  start: words[startIndex].start,
  end: words.at(-1).end,
  duration: words.at(-1).end - words[startIndex].start,
  text: displayText(words.slice(startIndex)),
});

const md = [
  "# Edited Transcript Chunks",
  "",
  `Duration: ${transcript.audio_duration_secs?.toFixed?.(2) ?? "?"}s`,
  `Words: ${words.length}`,
  "",
  ...segments.map((s) => `## ${String(s.id).padStart(3, "0")} ${fmt(s.start)}-${fmt(s.end)} (${s.duration.toFixed(2)}s)\n\n${s.text}\n`),
].join("\n");

writeFileSync(join(ANALYSIS_DIR, "edited-transcript-chunks.md"), md);
writeFileSync(join(ANALYSIS_DIR, "edited-segments.json"), JSON.stringify(segments, null, 2));

console.log(JSON.stringify({
  duration: transcript.audio_duration_secs,
  words: words.length,
  segments: segments.length,
  first: segments[0],
  last: segments.at(-1),
}, null, 2));
