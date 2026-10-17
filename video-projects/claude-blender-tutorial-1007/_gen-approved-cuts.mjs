// Locate editorial cut phrases in the silenced transcript and emit approved-cuts.json.
// Spec forms:
//   { cut: "words to remove", before: "words that must follow", reason }
//   { from: "first words of span", to: "last words of span", before: "...", reason }   (long spans)
//   add fromStart: true to extend the cut back to t=0 (drop the video head)
// Boundaries: start = prev kept word end + 0.02 (onset-sliver rule), end = next kept word start - 0.06.
import fs from 'node:fs';

const tPath = process.argv[2] ?? 'assets/source.silence-transcript.json';
const outPath = process.argv[3] ?? 'assets/approved-cuts.json';
const t = JSON.parse(fs.readFileSync(tPath, 'utf8'));
const words = t.words.filter(w => w.type !== 'spacing' && /\S/.test(w.text));
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim();
const toks = words.map(w => norm(w.text)).map(x => x === '' ? null : x);


// ---- source-audio RMS (10ms frames, 16k mono wav) + edited->source mapping, for quietest-frame join placement ----
const edl = JSON.parse(fs.readFileSync('assets/source.silence-edl.json', 'utf8'));
let _acc = 0;
const segs = edl.keep_ranges.map(k => { const s = { srcStart: k.start, srcEnd: k.end, edStart: _acc, edEnd: _acc + (k.end - k.start) }; _acc = s.edEnd; return s; });
const segOf = t => segs.find(s => t >= s.edStart - 1e-6 && t <= s.edEnd + 1e-6);
const wav = fs.readFileSync('assets/source.wav');
const dataAt = wav.indexOf(Buffer.from('data')) + 8;
const pcm = new Int16Array(wav.buffer, wav.byteOffset + dataAt, Math.floor((wav.length - dataAt) / 2));
const SR = 16000, HOP = 160;
const rmsDb = f => { let s = 0; const a = f * HOP; for (let i = a; i < a + HOP && i < pcm.length; i++) s += pcm[i] * pcm[i]; return 10 * Math.log10(s / HOP / (32768 * 32768) + 1e-12); };
function quietRun(aEd, bEd, side) {
  // centre of the contiguous quiet run (within 6 dB of the minimum) around the quietest 10ms frame in [aEd, bEd]
  // a window that straddles a silence-pass join is clamped to the keep segment on `side` ('start' = the earlier one, 'end' = the later one)
  let sa = segOf(aEd), sb = segOf(bEd);
  if (!sa || !sb || !(bEd > aEd)) return null;
  if (sa !== sb) { if (side === 'end') { sa = sb; aEd = sb.edStart + 0.01; } else { bEd = sa.edEnd - 0.01; } if (!(bEd > aEd)) return null; }
  const a = sa.srcStart + (aEd - sa.edStart), b = sa.srcStart + (bEd - sa.edStart);
  const f0 = Math.ceil(a * 100), f1 = Math.floor(b * 100);
  if (f1 < f0) return null;
  const v = []; for (let f = f0; f <= f1; f++) v.push((rmsDb(f - 1) + 2 * rmsDb(f) + rmsDb(f + 1)) / 4);
  let m = 0; for (let i = 1; i < v.length; i++) if (v[i] < v[m]) m = i;
  let lo = m, hi = m; while (lo > 0 && v[lo - 1] <= v[m] + 6) lo--; while (hi < v.length - 1 && v[hi + 1] <= v[m] + 6) hi++;
  return { t: sa.edStart + ((f0 + (lo + hi) / 2 + 0.5) / 100 - sa.srcStart), db: v[m], f: f0 + (lo + hi) / 2 };
}
// narrow window first; a wider one only wins when it holds a clearly deeper dip (>= 8 dB), i.e. Scribe's boundary is off
function quietest(side, aEd, bEd, aWide = aEd, bWide = bEd) {
  const n = quietRun(aEd, bEd, side), w = (aWide < aEd || bWide > bEd) ? quietRun(aWide, bWide, side) : null;
  if (n && w && w.db <= n.db - 6) {
    // ...and only when nothing sounds between the two candidates: a hump there is a word (or part of one) that the wider cut would leave in or chop off
    let hump = -Infinity; for (let f = Math.ceil(Math.min(n.f, w.f)) + 1; f < Math.floor(Math.max(n.f, w.f)); f++) hump = Math.max(hump, rmsDb(f));
    if (hump <= Math.max(n.db, w.db) + 6) return w.t;
  }
  return (n ?? w)?.t ?? null;
}

// One side of a cut. When the window straddles a silence-pass join, the breath cut-silences already kept on that side is left whole
// (cut exactly at the join) unless it holds a clearly quieter spot than its edge (a clipped inhale): then cut there instead.
function sideCut(side, lo, hi, loWide, hiWide, fallback) {
  const sa = segOf(lo), sb = segOf(hi);
  if (sa && sb && sa !== sb) {
    const edge = side === 'end' ? sb.edStart : sa.edEnd;
    const seg = side === 'end' ? sb : sa;
    const edgeSrc = seg.srcStart + (edge - seg.edStart) + (side === 'end' ? 0.005 : -0.005);
    const edgeDb = rmsDb(Math.floor(edgeSrc * 100));
    const r = side === 'end' ? quietRun(edge, hi, side) : quietRun(lo, edge, side);
    return r && r.db <= edgeDb - 8 ? r.t : edge;
  }
  return quietest(side, lo, hi, loWide ?? lo, hiWide ?? hi) ?? fallback;
}

const SPECS = [
  // ---- setup: what you need ----
  { cut: "So jumping straight into how, so,", before: "so jumping straight into how this is possible", reason: "false start + stutter (c001)" },
  { cut: "specifically,", before: "specifically Opus 5.5", reason: "stutter (c002)" },
  { cut: "And then naturally off of that, you're going to need Blender.", before: "And then naturally off of that, you are going to need Blender", reason: "retake: line said twice, keep the second" },
  { cut: "So there's a ton of tutorials out there where we, so there's a ton of tutorial,", before: "so there's a ton of tutorials out there right now", reason: "retake x3: keep the full third take" },
  { cut: "But in this video today, I'm going to show you how,", before: "but in this video today, the whole purpose", reason: "retake: restarted line" },
  { cut: "Two, it's just a hassle because you're constantly re... Two, it's just a hassle because if... Two, it's just a annoy...", before: "Two, it's just a hassle because you're constantly re-prompting", reason: "retake x4: keep the last, complete take" },
  { cut: "This is just a sneak peek to what we're going to be creating today, which I will show you, which I will...", before: "And this viewport is just a sneak peek", reason: "retake: abandoned line, keep the clean restart" },
  // ---- outputs showcase ----
  { cut: "So before you", before: "So before you go in the comments", reason: "false start before the 14s navigation pause" },
  { cut: "I'm not, I'm not a super big space...", before: "I don't understand the space terminology", reason: "false start x2" },
  { cut: "Some more different,", before: "some more angles of some action shots", reason: "false start" },
  { cut: "an AI generated,", before: "an AI generated all this inside of Blender", reason: "stutter: doubled phrase" },
  { cut: "Or even in this shot,", before: "or even this shot, what I just showed you", reason: "stutter: doubled phrase" },
  { cut: "if, for the specific tasks that we're trying to,", before: "for the specific tasks that we're trying to achieve", reason: "false start x2" },
  { cut: "Or here's like another one. This one I was the least happy--", before: "Or here's another one. This one I actually was least happy about", reason: "retake: restarted line" },
  { cut: "Um,", before: "it doesn't look like a caterpillar", reason: "filler" },
  { cut: "it goes through these--", before: "It goes through this very smooth head turn", reason: "false start" },
  { cut: "But I just wanted to s--", before: "But this is what we can do with AI now", reason: "false start" },
  // ---- setup walkthrough ----
  { cut: "having,", before: "having Claude connected to Blender", reason: "stutter" },
  { cut: "And so if you're looking to create videos or maybe just still shots, it's honestly--", before: "And so if you're looking to just create still shots", reason: "retake: restarted line" },
  { cut: "id-", before: "antennas", reason: "stutter fragment" },
  { cut: "We're going to want--", before: "If we're creating a video, we wanna add motion", reason: "false start" },
  { cut: "And so just a sneak peek, if I play this, you can see that the fingers move. And so if we-- If-- And so", before: "just a sneak peek, if I play this, you can see that the fingers are moving", reason: "retake: keep the second take; also drops its leading 'And so' so the join lands after the 'Weekly dictation limit reached' pop-up (on screen 524.2-534.3 src) is gone" },
  { cut: "His head moving.", before: "His head moves as this little bug flies by", reason: "retake: restarted line" },
  { cut: "The bug is right here.", before: "You can barely even see it", reason: "doubled line" },
  // ---- the prompt ----
  { cut: "s-", before: "wasting your time giving structured prompts", reason: "stutter fragment" },
  { cut: "because we're skipping that, uh--", before: "because we're skipping that part entirely", reason: "retake: restarted clause + filler" },
  { cut: "it's training its-- it's training.", before: "It's in its training session of", reason: "false start x2" },
  { cut: "which is in seven-twenty P,", before: "which is in four-eighty P, so it's very low quality", reason: "corrected fact (720p -> 480p)" },
  { cut: "but it's in the depth of the camera.", before: "It's out of the depth of the camera", reason: "self-correction (in -> out of the depth)" },
  { cut: "Hopefully my head is not in the way. I'll have to edit that out when I am editing this video.", before: "His fingers are merging through this vine", reason: "meta: note to self about the webcam overlay covering the bottom-right corner" },
  // ---- manual fix + 1080 output ----
  { cut: "So because it's rigged, we can now-- bec- So because it's rigged that--", before: "So because Claude rigged it for us", reason: "retake x3: keep the last take" },
  { cut: "And then again, like I was mentioning with this little bug character, this caterpillar Scratch that.", before: "And so here's the ten-eighty output", reason: "spoken editing instruction: 'Scratch that.'" },
  // ---- caterpillar + outro ----
  { cut: "And so what that animation looks like s-- w--", before: "And so what that animation looks like within Eevee", reason: "retake: restarted line" },
  { cut: "So I highly s-", before: "so I highly recommend that you stick around", reason: "false start" },
  { cut: "If you guys, if you guys enjoyed this video, please for-- If you guys enjoyed this video, please feel free...", before: "If you guys enjoyed this video, please feel free to give this video a like", reason: "retake x3: keep the last, complete take" },
];

function matchAt(i, seqToks) {
  // try to match seqToks starting at toks[i]; returns end index (exclusive) or -1
  let k = i;
  for (const st of seqToks) {
    if (toks[k] === st) { k++; continue; }
    let joined = toks[k] ?? '';
    let kk = k + 1;
    while (joined.length < st.length && kk < toks.length) { joined += toks[kk] ?? ''; kk++; }
    if (joined === st) { k = kk; continue; }
    return -1;
  }
  return k;
}
function findSeq(seqToks, startAt = 0) {
  const hits = [];
  for (let i = startAt; i <= toks.length - seqToks.length; i++) {
    const e = matchAt(i, seqToks);
    if (e > 0) hits.push({ start: i, end: e });
  }
  return hits;
}
function beforeOk(endIdx, befToks) {
  for (let off = 0; off <= 1; off++) {
    if (matchAt(endIdx + off, befToks) > 0) return true;
  }
  return false;
}

const cuts = [];
let fail = 0;
for (const spec of SPECS) {
  const befToks = norm(spec.before).split(' ').filter(Boolean).slice(0, 6);
  let cands;
  if (spec.from) {
    const fromToks = norm(spec.from).split(' ').filter(Boolean);
    const toToks = norm(spec.to).split(' ').filter(Boolean);
    const starts = findSeq(fromToks);
    cands = [];
    for (const s of starts) {
      const ends = findSeq(toToks, s.end).filter(e => beforeOk(e.end, befToks));
      if (ends.length) cands.push({ start: s.start, end: ends[0].end });
    }
  } else {
    const cutToks = norm(spec.cut).split(' ').filter(Boolean);
    cands = findSeq(cutToks).filter(h => beforeOk(h.end, befToks));
  }
  if (cands.length !== 1) {
    console.error(`FAIL (${cands.length} matches): ${spec.cut ?? spec.from + ' ... ' + spec.to} | before="${spec.before}"`);
    fail++;
    continue;
  }
  const h = cands[0];
  const first = words[h.start], last = words[h.end - 1];
  const prev = words[h.start - 1], next = words[h.end];
  // Join placement (edited-timeline seconds). Scribe word starts can lag the real onset by ~40ms, so:
  //  - real pause on a side (>= 0.15s): start just after the kept word's tail, end 0.11s before the next kept word
  //  - no pause (coarticulated): cut at the quietest 10ms frame between the two words (source-audio RMS)
  let start;
  if (!prev) start = Math.max(0, first.start - 0.02);
  else if (first.start - prev.end >= 0.15) start = sideCut('start', prev.end + 0.02, Math.min(first.start - 0.02, prev.end + 0.10), undefined, undefined, prev.end + 0.03);
  else start = sideCut('start', prev.end - 0.03, first.start + 0.03, prev.end - 0.05, first.start + 0.09, Math.min(prev.end + 0.02, first.start));
  if (first.start - start > 0.35) start = first.start - 0.35; // big gap before = kept pause / protected clip: don't eat it
  if (spec.fromStart) start = 0;
  let end;
  if (!next) end = last.end + 0.05;
  else if (next.start - last.end >= 0.15) end = sideCut('end', Math.max(last.end + 0.03, next.start - (prev ? 0.16 : 0.24)), next.start - (prev ? 0.02 : 0.14), undefined, undefined, Math.max(last.end + 0.03, next.start - (prev ? 0.11 : 0.20)));
  else end = sideCut('end', last.end - 0.03, next.start + 0.02, last.end - 0.05, next.start + 0.06, Math.max(last.end + 0.01, next.start - 0.06));
  if (end - last.end > 0.5) end = last.end + 0.5; // same guard on the far side
  if (spec.fromStart && next) end = Math.max(last.end + 0.01, next.start - 0.15); // leave a little pre-roll at the new head
  { const sS = segOf(start), sE = segOf(end); const srcS = sS.srcStart + (start - sS.edStart), srcE = sE.srcStart + (end - sE.edStart);
    const lv = c => [-3, -2, -1, 0, 1, 2, 3].map(d => Math.round(-rmsDb(Math.round(c * 100) + d))).join(' ');
    spec._dbg = `src ${srcS.toFixed(2)}-${srcE.toFixed(2)} | start lv [${lv(srcS)}] | end lv [${lv(srcE)}]`; }
  const label = spec.cut ?? `${spec.from} ... ${spec.to}`;
  cuts.push({
    start: +start.toFixed(3), end: +end.toFixed(3), reason: spec.reason,
    removes: label, keepsNext: spec.before,
    _ctx: words.slice(Math.max(0, h.start - 6), Math.min(words.length, h.end + 6)).map(w => w.text).join(' '),
  });
  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`;
  console.log(`OK ${fmt(start)}-${fmt(end)} (${(end - start).toFixed(2)}s) [${(first.start - start).toFixed(2)}/${(end - last.end).toFixed(2)}] ${label.slice(0, 34)} | ${spec._dbg}`);
}
if (fail) { console.error(`${fail} specs failed to locate — nothing written`); process.exit(1); }
cuts.sort((a, b) => a.start - b.start);
for (let i = 1; i < cuts.length; i++) if (cuts[i].start < cuts[i - 1].end) console.error(`OVERLAP: ${cuts[i - 1].removes.slice(0, 40)} / ${cuts[i].removes.slice(0, 40)}`);
fs.writeFileSync(outPath, JSON.stringify({ cuts }, null, 2));
console.log(`\n${cuts.length} cuts -> ${outPath} (total ${cuts.reduce((t, c) => t + c.end - c.start, 0).toFixed(1)}s)`);
