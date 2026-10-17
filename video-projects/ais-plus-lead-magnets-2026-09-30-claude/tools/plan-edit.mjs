#!/usr/bin/env node
// Proposed edit plan for one clip: retake cuts (anchored on transcript phrases) + pause trims.
// Emits keep segments in SOURCE seconds, the source->edit map, and a cut ledger with reasons.
// Nothing here renders video. Boundaries are proposals; the build step re-checks every join by ear/RMS.
//
// Usage: node tools/plan-edit.mjs            (plans every clip in CLIPS, writes 04-edit-plan/*.plan.json)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Pause policy: any gap > MAX_GAP between kept words is trimmed to a breath of
// TAIL (after the last voiced word) + LEAD (before the next onset). Scribe word ends sit on the
// last voiced sample, so the tail pad is the larger one.
const MAX_GAP = 0.6, TAIL = 0.28, LEAD = 0.17, HEAD_PAD = 0.2, END_PAD = 0.5;

// Retake cuts: remove every word from the `from` phrase occurrence up to (not including) the `to`
// phrase occurrence. `near` = approximate RAW source second of that phrase (disambiguates repeats).
const CLIPS = {
  "01-ad-sop": {
    endPad: 0.85, // Nate holds eye contact ~0.85s after "first client" (raw 86.9); gives the CTA a natural hold
    cuts: [
      { id: "R1", from: ["so this sop right here", 41.3], to: ["so this sop right here", 57.0],
        why: "Abandoned first take of the SOP passage (stops at 'the exact...'). Keep the complete last take. Steven: restart at 0:52." },
    ],
  },
  "02-ad-aios": {
    endPad: 0.9, // Nate holds eye contact ~0.9s after "The link is below." (raw 96.7)
    cuts: [
      { id: "R1", from: ["jarvis works so well", 38.0], to: ["jarvis worked so well", 40.2],
        why: "False start 'Jarvis works so well--'. Keep the complete restart. Steven: restart at 0:38." },
    ],
  },
  "03-ad-scrollcraft": { endPad: 0.85, cuts: [] }, // Nate holds eye contact ~0.85s after "The link's below." (raw 62.45)
  "04-vsl-intro-sop": { cuts: [] },
  "05-vsl-intro-aios": {
    cuts: [
      { id: "R1", from: ["s-", 54.1], to: ["support", 54.46], bounds: [53.905, 54.465],
        why: "D8 micro-cut (applied with the core's R8 after CP5 review): 'provides s- with support' -> 'provides support' (matches script). RMS: 'provides' decays by 53.90, 'with' ends 54.45, 'support' onset 54.48." },
    ],
  },
  "06-vsl-intro-scrollcraft": { cuts: [] },
  "07-vsl-intro-generic": { cuts: [] },
  "08-vsl-core": {
    endPad: 0.9, // Nate smiles to camera ~0.9s after "I hope to see you guys inside." (raw 593.75), then looks away
    cuts: [
      { id: "R1", from: ["one of our members went", 92.0], to: ["one of our members went", 98.2],
        why: "Flubbed take ('closing a three hundred...'). Steven: 1:32 / 1:38. Keep 1:38." },
      { id: "R2", from: ["other members are regularly", 105.5], to: ["other members are regularly", 109.1],
        why: "Abandoned 'five thou...'. Steven: 1:45 / 1:49. Keep 1:49." },
      { id: "R3", from: ["and as i said", 287.8], to: ["and as i said", 299.3],
        why: "Abandoned take ('I was looking at...'). Steven: 4:47 / 4:59. Keep 4:59." },
      { id: "R4", from: ["and your rate is locked", 363.7], to: ["and your rate is locked", 370.2],
        why: "Abandoned take ('...if you're not'). Steven: 6:04 / 6:10. Keep 6:10." },
      { id: "R5", from: ["several thousand", 387.0], to: ["so that means", 390.3],
        why: "Cut-off 'Several thousand--'; he restarts 'So that means we have several thousand...'. Steven: 6:28." },
      { id: "R6", from: ["and once they do the math", 415.8], to: ["and once they actually do the math", 511.6],
        why: "'Once they do the math' takes at 6:55 and 7:11 plus ~69s dead air (7:22 to 8:31). Steven: use 8:31." },
      { id: "R7", from: ["so the version of you", 529.8], to: ["so the version of you", 536.5],
        why: "Abandoned take ('...that are valuable...'). Steven: 8:49 / 8:56. Keep 8:56." },
      { id: "R8", from: ["experts", 82.06], to: ["expert humans", 83.14], bounds: [82.045, 83.13],
        why: "D8 micro-cut (CP5 review: 'not cut right'): stumble 'a team of experts, expert humans' -> 'a team of expert humans' (matches script). RMS-checked: 'of' decays by 82.04, 'experts' onset 82.09, 'expert' onset 83.16." },
    ],
    optional: [
        { id: "O2", note: "Leading 'So' of the core opening (So 2.60-2.66, if 2.70). Only 40ms before 'if', so not a clean cut. Recommend KEEP. 'But here's the thing... So if you're like most builders' still reads naturally." },
    ],
    markers: [
      { id: "PROOF_BRIDGE", phrase: ["so this page is full of examples", 72.3],
        note: "Generic (07) version enters the core here. Breath onset at raw 1:11.67." },
    ],
  },
};

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/'/g, "").split(/\s+/).filter(Boolean);
const mmss = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, "0")}`;

function findPhrase(words, [phrase, near]) {
  const target = norm(phrase);
  let best = null;
  for (let i = 0; i < words.length; i++) {
    let ok = true;
    for (let k = 0; k < target.length; k++) {
      const w = words[i + k];
      if (!w || norm(w.text).join("") !== target[k]) { ok = false; break; }
    }
    if (ok && (best === null || Math.abs(words[i].start - near) < Math.abs(words[best].start - near))) best = i;
  }
  if (best === null || Math.abs(words[best].start - near) > 4) throw new Error(`phrase not found near ${near}: "${phrase}"`);
  return best;
}

const summary = [];
for (const [slug, spec] of Object.entries(CLIPS)) {
  const data = JSON.parse(readFileSync(join(ROOT, "03-transcripts/raw", `${slug}.json`), "utf8"));
  const words = data.words.filter((w) => w.type === "word");
  const removed = new Set();
  const cutLedger = [];
  const bounds = {}; // explicit [out, in] source seconds for tight micro-cuts, keyed by the kept word after the cut

  for (const c of spec.cuts) {
    const a = findPhrase(words, c.from);
    const b = findPhrase(words, c.to);
    if (b <= a) throw new Error(`${slug} ${c.id}: 'to' precedes 'from'`);
    for (let i = a; i < b; i++) removed.add(i);
    if (c.bounds) bounds[b] = c.bounds;
    cutLedger.push({
      id: c.id, type: "retake", why: c.why,
      removedText: words.slice(a, b).map((w) => w.text).join(" "),
      firstRemovedWord: mmss(words[a].start), keptTakeStarts: mmss(words[b].start),
    });
  }

  // Build keep segments from the surviving words, trimming long gaps.
  const kept = words.map((w, i) => ({ ...w, i })).filter((w) => !removed.has(w.i));
  const segs = [];
  let seg = { in: Math.max(0, kept[0].start - HEAD_PAD), out: null };
  for (let k = 1; k < kept.length; k++) {
    const p = kept[k - 1], n = kept[k];
    const gap = n.start - p.end;
    const jumped = n.i !== p.i + 1; // words removed between them
    if (gap > MAX_GAP || jumped) {
      seg.out = bounds[n.i] ? bounds[n.i][0] : p.end + Math.min(TAIL, gap / 2);
      segs.push(seg);
      seg = { in: bounds[n.i] ? bounds[n.i][1] : n.start - Math.min(LEAD, gap / 2), out: null };
      if (!jumped) cutLedger.push({ type: "pause", at: mmss(p.end), removedSec: +(gap - Math.min(TAIL, gap / 2) - Math.min(LEAD, gap / 2)).toFixed(2), rawGapSec: +gap.toFixed(2) });
    }
  }
  seg.out = Math.min(data.audio_duration_secs, kept[kept.length - 1].end + (spec.endPad ?? END_PAD));
  segs.push(seg);

  // Source -> edit map
  let t = 0;
  const map = segs.map((s, idx) => {
    const row = { seg: idx + 1, srcIn: +s.in.toFixed(3), srcOut: +s.out.toFixed(3), editIn: +t.toFixed(3), editOut: +(t + s.out - s.in).toFixed(3) };
    t += s.out - s.in;
    return row;
  });
  const toEdit = (src) => { const r = map.find((m) => src >= m.srcIn && src <= m.srcOut); return r ? +(r.editIn + src - r.srcIn).toFixed(3) : null; };

  const markers = (spec.markers || []).map((m) => {
    const i = findPhrase(words, m.phrase);
    return { id: m.id, rawWordStart: +words[i].start.toFixed(3), raw: mmss(words[i].start), editTime: toEdit(words[i].start - LEAD) ?? toEdit(words[i].start), note: m.note };
  });

  const out = {
    clip: slug, rawDuration: data.audio_duration_secs, proposedDuration: +t.toFixed(2),
    policy: { maxGap: MAX_GAP, tailPad: TAIL, leadPad: LEAD, headPad: HEAD_PAD, endPad: END_PAD },
    retakeCuts: cutLedger.filter((c) => c.type === "retake"),
    pauseTrims: cutLedger.filter((c) => c.type === "pause"),
    optional: spec.optional || [], markers, keepSegments: map,
  };
  writeFileSync(join(ROOT, "04-edit-plan", `${slug}.plan.json`), JSON.stringify(out, null, 2) + "\n");
  summary.push({ clip: slug, raw: mmss(data.audio_duration_secs), proposed: mmss(t), retakes: out.retakeCuts.length, pauses: out.pauseTrims.length, pauseSecRemoved: +out.pauseTrims.reduce((s, c) => s + c.removedSec, 0).toFixed(1), segments: map.length, markers: markers.map((m) => `${m.id} raw ${m.raw} -> edit ${mmss(m.editTime)}`).join("; ") });
}
writeFileSync(join(ROOT, "04-edit-plan", "_summary.json"), JSON.stringify(summary, null, 2) + "\n");
console.table(summary);
