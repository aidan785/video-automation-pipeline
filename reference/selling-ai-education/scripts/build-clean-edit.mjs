#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = dirname(SCRIPT_DIR);
const ASSETS_DIR = join(PROJECT_DIR, "assets");
const ANALYSIS_DIR = join(ASSETS_DIR, "analysis");
mkdirSync(ANALYSIS_DIR, { recursive: true });

const transcript = JSON.parse(readFileSync(join(ASSETS_DIR, "source-transcript-elevenlabs.json"), "utf8"));
const duration = transcript.audio_duration_secs;
const words = transcript.words.filter((w) => w.type === "word").map((w, index) => ({
  ...w,
  index,
  start: Number(w.start),
  end: Number(w.end),
}));

const manualDeletes = [
  { start: 115.76, end: 118.00, reason: "partial community intro retake" },
  { start: 243.22, end: 249.45, reason: "sponsor mention without sponsor insert" },
  { start: 332.98, end: 337.88, reason: "duplicate next-conversation setup" },
  { start: 347.86, end: 388.04, reason: "reason-two false starts; keep final take" },
  { start: 409.72, end: 410.02, reason: "you/you stutter" },
  { start: 524.50, end: 524.94, reason: "more/more stutter" },
  { start: 562.46, end: 562.76, reason: "like/like stutter" },
  { start: 649.22, end: 651.88, reason: "false start: not just like" },
  { start: 714.62, end: 714.84, reason: "it/it stutter" },
  { start: 719.34, end: 721.92, reason: "duplicate transition: so at this point" },
  { start: 753.10, end: 753.61, reason: "it-it-it stutter" },
  { start: 808.34, end: 813.12, reason: "blank screen false start; keep final take" },
  { start: 823.52, end: 825.28, reason: "isolated filler before pitch" },
  { start: 863.50, end: 874.26, reason: "operating-system sentence retake" },
  { start: 1154.16, end: 1157.82, reason: "charge less at/at false start" },
  { start: 1178.02, end: 1189.18, reason: "where-do-you-find-people retake" },
  { start: 1201.36, end: 1205.42, reason: "I've got so... duplicate step one" },
  { start: 1441.68, end: 1443.36, reason: "at that point false start" },
  { start: 1461.12, end: 1461.92, reason: "just- false start" },
  { start: 1639.04, end: 1659.76, reason: "what do you want false start; keep final take" },
  { start: 1752.88, end: 1754.46, reason: "final point duplicate start" },
  { start: 1773.88, end: 1783.90, reason: "no-pressure false starts; keep final take" },
  { start: 1822.10, end: 1825.56, reason: "duplicate partnership sentence" },
  { start: 1904.78, end: 1909.02, reason: "but you g false start" },
  { start: 1918.10, end: 1927.20, reason: "reps/experience false start; keep final take" },
];

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

function mergeRanges(ranges) {
  const sorted = ranges
    .filter((r) => Number.isFinite(r.start) && Number.isFinite(r.end) && r.end > r.start)
    .sort((a, b) => a.start - b.start);
  const merged = [];
  for (const range of sorted) {
    const last = merged.at(-1);
    if (!last || range.start > last.end) {
      merged.push({ ...range, reasons: range.reason ? [range.reason] : range.reasons ?? [] });
    } else {
      last.end = Math.max(last.end, range.end);
      if (range.reason) last.reasons.push(range.reason);
      if (range.reasons) last.reasons.push(...range.reasons);
    }
  }
  return merged;
}

const deleteRanges = [
  { start: 0, end: Math.max(0, words[0].start - 0.22), reason: "head trim before first word" },
  { start: words.at(-1).end + 0.34, end: duration, reason: "tail trim after final word" },
  ...manualDeletes,
];

for (let i = 1; i < words.length; i++) {
  const prev = words[i - 1];
  const next = words[i];
  const gap = next.start - prev.end;
  if (gap < 0.55) continue;

  const sentenceBreak = /[.!?]$/.test(prev.text);
  const keep = gap >= 2 ? 0.24 : sentenceBreak ? 0.20 : 0.14;
  const delStart = prev.end + keep * 0.55;
  const delEnd = next.start - keep * 0.45;
  const range = { start: delStart, end: delEnd, reason: `pause ${gap.toFixed(2)}s -> ${keep.toFixed(2)}s` };
  if (range.end > range.start) deleteRanges.push(range);
}

const mergedDeletes = mergeRanges(deleteRanges);

const keepRanges = [];
let cursor = 0;
for (const del of mergedDeletes) {
  if (del.start > cursor) keepRanges.push({ start: cursor, end: del.start });
  cursor = Math.max(cursor, del.end);
}
if (cursor < duration) keepRanges.push({ start: cursor, end: duration });

const usableKeepRanges = keepRanges.filter((r) => r.end - r.start >= 0.04);

function removedBefore(time) {
  let removed = 0;
  for (const del of mergedDeletes) {
    if (del.end <= time) removed += del.end - del.start;
    else if (del.start < time) removed += time - del.start;
    else break;
  }
  return removed;
}

function inDeleted(word) {
  return mergedDeletes.some((del) => overlaps(word, del));
}

const editedWords = [];
for (const word of words) {
  if (inDeleted(word)) continue;
  editedWords.push({
    ...word,
    source_start: word.start,
    source_end: word.end,
    start: Number((word.start - removedBefore(word.start)).toFixed(3)),
    end: Number((word.end - removedBefore(word.end)).toFixed(3)),
  });
}

const editedDuration = Number((duration - mergedDeletes.reduce((sum, r) => sum + (r.end - r.start), 0)).toFixed(3));

const expression = usableKeepRanges
  .map((r) => `between(t\\,${r.start.toFixed(3)}\\,${r.end.toFixed(3)})`)
  .join("+");

const filter = [
  `[0:v]select='${expression}',setpts=N/60/TB[v];`,
  `[0:a]aselect='${expression}',asetpts=N/SR/TB[a]`,
  "",
].join("\n");

const concatList = [
  "ffconcat version 1.0",
  ...usableKeepRanges.flatMap((r) => [
    "file 'source.mp4'",
    `inpoint ${r.start.toFixed(3)}`,
    `outpoint ${r.end.toFixed(3)}`,
  ]),
  "",
].join("\n");

const trimLines = [];
for (let i = 0; i < usableKeepRanges.length; i++) {
  const r = usableKeepRanges[i];
  trimLines.push(`[0:v]trim=start=${r.start.toFixed(3)}:end=${r.end.toFixed(3)},setpts=PTS-STARTPTS[v${i}]`);
  trimLines.push(`[0:a]atrim=start=${r.start.toFixed(3)}:end=${r.end.toFixed(3)},asetpts=PTS-STARTPTS[a${i}]`);
}
const concatInputs = usableKeepRanges.map((_, i) => `[v${i}][a${i}]`).join("");
const trimConcat = [
  ...trimLines.map((line) => `${line};`),
  `${concatInputs}concat=n=${usableKeepRanges.length}:v=1:a=1[v][a]`,
  "",
].join("\n");

function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${String(m).padStart(2, "0")}:${s.toFixed(2).padStart(5, "0")}`;
}

const edl = {
  source_duration: duration,
  edited_duration: editedDuration,
  manual_deletes: manualDeletes,
  delete_ranges: mergedDeletes,
  keep_ranges: usableKeepRanges,
};

const transcriptOut = {
  language_code: transcript.language_code,
  source_audio_duration_secs: duration,
  audio_duration_secs: editedDuration,
  source_file: "assets/source.mp4",
  edited_file: "assets/edited-clean.mp4",
  words: editedWords,
};

const cutSummary = [
  "# Clean Edit Decisions",
  "",
  `Source duration: ${fmt(duration)} (${duration.toFixed(2)}s)`,
  `Edited duration: ${fmt(editedDuration)} (${editedDuration.toFixed(2)}s)`,
  `Removed: ${(duration - editedDuration).toFixed(2)}s`,
  "",
  "## Manual Retake / False-Start Deletes",
  "",
  ...manualDeletes.map((d) => `- ${fmt(d.start)}-${fmt(d.end)} (${(d.end - d.start).toFixed(2)}s): ${d.reason}`),
].join("\n");

writeFileSync(join(ANALYSIS_DIR, "clean-edit-decisions.md"), cutSummary);
writeFileSync(join(ANALYSIS_DIR, "clean-edit-edl.json"), JSON.stringify(edl, null, 2));
writeFileSync(join(ASSETS_DIR, "edited-transcript.json"), JSON.stringify(transcriptOut, null, 2));
writeFileSync(join(ASSETS_DIR, "edit-filter.txt"), filter);
writeFileSync(join(ASSETS_DIR, "edit-concat.ffconcat"), concatList);
writeFileSync(join(ASSETS_DIR, "edit-trim-concat.txt"), trimConcat);

console.log(JSON.stringify({
  sourceDuration: duration,
  editedDuration,
  removed: Number((duration - editedDuration).toFixed(3)),
  deleteRanges: mergedDeletes.length,
  keepRanges: usableKeepRanges.length,
  editedWords: editedWords.length,
}, null, 2));
