// Locate editorial cut phrases in the silenced transcript and emit approved-cuts.json (silenced-timeline coords).
// Spec forms: { cut, before, reason } | { from, to, before, reason } (long spans) | fromStart: true
// Boundaries: start = prev kept word end + 0.02 (onset-sliver rule), end = next kept word start - 0.06.
import fs from 'node:fs';

const tPath = process.argv[2] ?? 'assets/source.silence-transcript.json';
const outPath = process.argv[3] ?? 'assets/approved-cuts.json';
const t = JSON.parse(fs.readFileSync(tPath, 'utf8'));
const words = t.words.filter(w => w.type !== 'spacing' && /\S/.test(w.text));
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim();
const toks = words.map(w => norm(w.text)).map(x => x === '' ? null : x);

const SPECS = [
  // ---- intro showcase ----
  { cut: "Gave him, gave him some walking movements--", before: "gave the character some walking movements.", reason: "retake: restarted line ('him' -> 'the character'), keep clean second take" },
  { cut: "And then even animated him...", before: "And then even animated the character in a real environment", reason: "retake: abandoned first take" },
  // ---- Fable 5.1 explainer ----
  { cut: "which is the newest in--", before: "which is the newest model from Anthropic.", reason: "retake: restarted phrase" },
  { cut: "of...", before: "and how this connects,", reason: "abandoned tail ('...videos in Blender and Unreal Engine of...')" },
  { cut: "and is--", before: "and costs a lot less", reason: "false start" },
  { cut: "And then again, computer use is--", before: "And then again, there is a bump in computer use,", reason: "retake: restarted line" },
  { cut: "Now, the animations are not--", before: "Now, the animations from the characters are far from perfect.", reason: "retake: restarted line" },
  { cut: "The whole purpose of this test was to see how well Claude can get the g- get an under--", before: "The whole purpose of this test was to see how well Claude understands", reason: "retake: whole restarted sentence (incl. 'get the g- get an under--' stutters)" },
  { cut: "I didn't upload any--", before: "I didn't upload anything", reason: "false start" },
  { cut: "from a mocab lib--", before: "From a mocab library or a template style.", reason: "retake: restarted phrase" },
  { cut: "how the,", before: "how the rig can work.", reason: "stutter: doubled 'how the'" },
  { cut: "he turns,", before: "the eyes fade away.", reason: "stutter: doubled 'he turns'" },
  // ---- Opus 4.8 comparison ----
  { cut: "For example, here is for example, here is", before: "for example, here's Opus 4.8", reason: "retake x2: restarted phrase, keep third take" },
  { cut: "So the point", before: "so the models are definitely getting better", reason: "false start" },
  { cut: "has a much better understanding I think", before: "Has a much better understanding of animation", reason: "retake: restarted phrase" },
  // ---- setup ----
  { cut: "i'm going to just walk you through the two tools that I used obviously we", before: "I'm gonna walk you through the two tools that I use", reason: "retake: restarted line" },
  { cut: "inside of our", before: "Inside of Blender", reason: "stutter: doubled 'inside of'" },
  { cut: "So,", before: "so On the left here", reason: "stutter: doubled 'So' (was hidden in an 80s stretched Scribe token)" },
  { cut: "clock", before: "Cladcode inside Of Vs Code", reason: "stutter: 'Claude-- Claude Code'" },
  { cut: "or maybe eleven dollar-- it's about fifteen dollars a month", before: "But do remember that Blender is a free platform", reason: "self-correction loop: keep the first 'about fifteen dollars a month'" },
  { cut: "If you're having trouble f-", before: "if you're having trouble finding this exact rig", reason: "retake: restart hidden inside a stretched 'finding' token (isolate-transcribed)" },
  { cut: "d-and then you can", before: "download it in this section", reason: "stutter: 'And then you can d-and then you can download'" },
  { cut: "our actual claude", before: "Our Actual Blender Session Is Connected", reason: "self-correction ('our actual Claude' -> 'our actual Blender session')" },
  // ---- wave result ----
  { cut: "And just like th--", before: "And then boom, you get an output", reason: "false start" },
  { cut: "Obviously, we would need to fix...", before: "His hand is going through his hair", reason: "abandoned sentence" },
  { cut: "which w- is just a few models ol-", before: "which is just a few months old.", reason: "retake: restarted phrase ('models' -> 'months')" },
  { cut: "It's,", before: "it's getting much, much better.", reason: "stutter" },
  { cut: "Okay.", before: "Okay, so this is not done officially,", reason: "stutter: doubled 'Okay'" },
  { cut: "it's,", before: "it's pretty much gotten to the point", reason: "stutter" },
  { cut: "we can open up, we can open up", before: "We can open up our dope sheet", reason: "stutter x2 (fumbling to find the dope sheet)" },
  // ---- backflip result / outro ----
  { cut: "Um,", before: "it's a little choppy,", reason: "filler" },
  { cut: "uh,", before: "with the gravity and stuff.", reason: "filler" },
  { cut: "with it--", before: "with this new Claude Fable 5.1 connection,", reason: "self-correction" },
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
  let start = prev ? Math.min(prev.end + 0.02, first.start) : Math.max(0, first.start - 0.02);
  if (first.start - start > 0.35) start = first.start - 0.35; // big gap before = kept pause / protected clip: don't eat it
  if (spec.fromStart) start = 0;
  let end = next ? Math.max(last.end + 0.01, next.start - 0.06) : last.end + 0.05;
  if (end - last.end > 0.5) end = last.end + 0.5; // same guard on the far side
  if (spec.fromStart && next) end = Math.max(last.end + 0.01, next.start - 0.15); // leave a little pre-roll at the new head
  const label = spec.cut ?? `${spec.from} ... ${spec.to}`;
  cuts.push({
    start: +start.toFixed(3), end: +end.toFixed(3), reason: spec.reason,
    removes: label, keepsNext: spec.before,
    _ctx: words.slice(Math.max(0, h.start - 6), Math.min(words.length, h.end + 6)).map(w => w.text).join(' '),
  });
  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`;
  console.log(`OK ${fmt(start)}-${fmt(end)} (${(end - start).toFixed(2)}s) [${(first.start - start).toFixed(2)}/${(end - last.end).toFixed(2)}] ${label.slice(0, 70)}`);
}
if (fail) { console.error(`${fail} specs failed to locate — nothing written`); process.exit(1); }
cuts.sort((a, b) => a.start - b.start);
for (let i = 1; i < cuts.length; i++) if (cuts[i].start < cuts[i - 1].end) console.error(`OVERLAP: ${cuts[i - 1].removes.slice(0, 40)} / ${cuts[i].removes.slice(0, 40)}`);
fs.writeFileSync(outPath, JSON.stringify({ cuts }, null, 2));
console.log(`\n${cuts.length} cuts -> ${outPath} (total ${cuts.reduce((t, c) => t + c.end - c.start, 0).toFixed(1)}s)`);
