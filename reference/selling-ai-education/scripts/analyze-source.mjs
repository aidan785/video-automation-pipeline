#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = dirname(SCRIPT_DIR);
const ASSETS_DIR = join(PROJECT_DIR, "assets");
const transcriptPath = join(ASSETS_DIR, "source-transcript-elevenlabs.json");
const outDir = join(ASSETS_DIR, "analysis");
mkdirSync(outDir, { recursive: true });

const transcript = JSON.parse(readFileSync(transcriptPath, "utf8"));
const rawWords = transcript.words.filter((w) => w.type === "word");

function cleanToken(text) {
  return text.toLowerCase().replace(/^[^a-z0-9$%]+|[^a-z0-9$%]+$/g, "");
}

function displayText(words) {
  return words.map((w) => w.text).join(" ").replace(/\s+([,.!?;:])/g, "$1");
}

function fmtTime(seconds) {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const rem = s - m * 60;
  return `${String(m).padStart(2, "0")}:${rem.toFixed(2).padStart(5, "0")}`;
}

const words = rawWords.map((w, index) => ({
  index,
  text: w.text,
  token: cleanToken(w.text),
  start: Number(w.start),
  end: Number(w.end),
}));

const gaps = [];
for (let i = 1; i < words.length; i++) {
  const gap = words[i].start - words[i - 1].end;
  if (gap > 0.35) {
    gaps.push({
      afterIndex: i - 1,
      beforeIndex: i,
      start: words[i - 1].end,
      end: words[i].start,
      duration: gap,
      before: words.slice(Math.max(0, i - 7), i).map((w) => w.text).join(" "),
      after: words.slice(i, Math.min(words.length, i + 7)).map((w) => w.text).join(" "),
    });
  }
}

const segments = [];
let segmentStart = 0;
for (let i = 1; i < words.length; i++) {
  const prev = words[i - 1];
  const current = words[i];
  const gap = current.start - prev.end;
  const elapsed = current.end - words[segmentStart].start;
  const sentenceEnd = /[.!?]$/.test(prev.text);
  if (gap > 0.85 || (sentenceEnd && elapsed >= 7.5) || elapsed >= 16) {
    segments.push({
      id: segments.length + 1,
      start: words[segmentStart].start,
      end: prev.end,
      duration: prev.end - words[segmentStart].start,
      wordStart: segmentStart,
      wordEnd: i - 1,
      text: displayText(words.slice(segmentStart, i)),
    });
    segmentStart = i;
  }
}
segments.push({
  id: segments.length + 1,
  start: words[segmentStart].start,
  end: words.at(-1).end,
  duration: words.at(-1).end - words[segmentStart].start,
  wordStart: segmentStart,
  wordEnd: words.length - 1,
  text: displayText(words.slice(segmentStart)),
});

const stop = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "i",
  "if", "in", "is", "it", "of", "on", "or", "so", "that", "the", "this",
  "to", "was", "we", "with", "you", "your", "they", "their", "there", "what",
  "when", "where", "why", "how", "like", "um", "uh",
]);

function signature(segment) {
  return segment.text
    .toLowerCase()
    .replace(/[^a-z0-9\s$%]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stop.has(t))
    .slice(0, 18);
}

function jaccard(a, b) {
  const as = new Set(a);
  const bs = new Set(b);
  let overlap = 0;
  for (const item of as) if (bs.has(item)) overlap += 1;
  return overlap / Math.max(1, new Set([...as, ...bs]).size);
}

const signatures = segments.map(signature);
const retakeCandidates = [];
for (let i = 0; i < segments.length; i++) {
  for (let j = i + 1; j < Math.min(segments.length, i + 9); j++) {
    const distance = segments[j].start - segments[i].end;
    if (distance > 75) continue;
    const score = jaccard(signatures[i], signatures[j]);
    const sameOpening =
      signatures[i].slice(0, 4).filter((t, idx) => t === signatures[j][idx]).length >= 2;
    if (score >= 0.34 || (score >= 0.24 && sameOpening)) {
      retakeCandidates.push({
        score: Number(score.toFixed(3)),
        first: {
          id: segments[i].id,
          start: segments[i].start,
          end: segments[i].end,
          text: segments[i].text,
        },
        second: {
          id: segments[j].id,
          start: segments[j].start,
          end: segments[j].end,
          text: segments[j].text,
        },
      });
    }
  }
}

const repeatedWords = [];
for (let i = 1; i < words.length; i++) {
  if (!words[i].token || words[i].token.length < 2) continue;
  if (words[i].token === words[i - 1].token && words[i].start - words[i - 1].end < 0.35) {
    repeatedWords.push({
      start: words[i - 1].start,
      end: words[i].end,
      text: `${words[i - 1].text} ${words[i].text}`,
      context: displayText(words.slice(Math.max(0, i - 6), Math.min(words.length, i + 7))),
    });
  }
}

const md = [
  "# Source Transcript Chunks",
  "",
  `Duration: ${transcript.audio_duration_secs?.toFixed?.(2) ?? "?"}s`,
  `Words: ${words.length}`,
  "",
  ...segments.map((s) => `## ${String(s.id).padStart(3, "0")} ${fmtTime(s.start)}-${fmtTime(s.end)} (${s.duration.toFixed(2)}s)\n\n${s.text}\n`),
].join("\n");

writeFileSync(join(outDir, "source-transcript-chunks.md"), md);
writeFileSync(join(outDir, "segments.json"), JSON.stringify(segments, null, 2));
writeFileSync(join(outDir, "word-gaps.json"), JSON.stringify(gaps, null, 2));
writeFileSync(join(outDir, "retake-candidates.json"), JSON.stringify(retakeCandidates, null, 2));
writeFileSync(join(outDir, "repeated-words.json"), JSON.stringify(repeatedWords, null, 2));

console.log(JSON.stringify({
  words: words.length,
  segments: segments.length,
  gapsOver035: gaps.length,
  gapsOver1s: gaps.filter((g) => g.duration >= 1).length,
  retakeCandidates: retakeCandidates.length,
  repeatedWords: repeatedWords.length,
}, null, 2));
