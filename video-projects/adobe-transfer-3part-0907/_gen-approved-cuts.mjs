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

const SPECS = [
  // ---- intro showcase (1.mov) ----
  { cut: "is a full character animation,", before: "is a full character animation by GPT 6 Astra", reason: "retake: restarted phrase" },
  { cut: "I also,", before: "I also animated a pickup", reason: "false start (raw Scribe had the 'I' as a 52s phantom token)" },
  { cut: "You can animate a character pi-- You can,", before: "you can animate a character to pick up objects", reason: "false start + stutter" },
  { cut: "And if you notice,", before: "and if you notice, he has eye movement", reason: "stutter: doubled phrase" },
  { cut: "he has eye movement and fa--", before: "He has some eye movement and some facial movement", reason: "retake: restarted line" },
  { cut: "We can animate him walking in certain sc--", before: "We can animate the character walking all with GPT 6 Astra", reason: "retake: restarted line" },
  { cut: "And then can, and then we can actually create scenes with GPT", before: "And then we can actually create scenes with GPT 6 Astra and then add", reason: "retake: restarted line (trailing '...')" },
  { cut: "3D building software,", before: "3D modeling software", reason: "self-correction" },
  { cut: "as,", before: "as assets", reason: "stutter (c001)" },
  { cut: "and then everything else--", before: "and then everything in the scene is actually editable", reason: "false start" },
  { cut: "And then again,", before: "and then again, creating different scenes", reason: "stutter: doubled phrase" },
  { cut: "So it's, it's getting better and--", before: "So it's definitely getting better and better", reason: "retake: restarted line (incl c002)" },
  { cut: "using, like,", before: "using keyframing", reason: "stutter: doubled 'using'" },
  { cut: "or we can go back into GPC--", before: "or we can go back into our GPT-6 Astra chat", reason: "retake: misspoke 'GPC'" },
  { cut: "one prompt, one single, one single prompt for this", before: "One single prompt for this animation right here", reason: "retake x3: keep the clean 'one single prompt for this animation right here'" },
  // ---- GPT-6 Astra overview ----
  { cut: "Um,", before: "and it's especially insane inside of 3D modeling softwares", reason: "filler" },
  { cut: "with actually rigged c-", before: "with rigged characters you can find online", reason: "stutter" },
  { cut: "This is,", before: "this has to be super expensive", reason: "stutter inside the quote" },
  { cut: "on, like, the Pro model,", before: "on the Pro subscription", reason: "self-correction (model -> subscription)" },
  { cut: "if,", before: "if you are running this with", reason: "stutter (c003)" },
  { cut: "You-- Your credits", before: "For simple animations like this, your credits", reason: "false start x2" },
  { cut: "in co--", before: "in tokens and in credits", reason: "false start" },
  { cut: "So you can see we have So we can see So we can see that at, like, high effort on GPT-6 Astra, if we look at the high effort on", before: "If we look at the high effort on Fable 5.1, it's about a forty percent", reason: "retake x4 while scrolling the stats (c008); keep the clean Fable-then-GPT comparison" },
  { cut: "sixty-two,", before: "sixty-one percent resolution rate", reason: "corrected number" },
  { cut: "and then threw that model into the Unreal Engine,", before: "and threw that model into Unreal Engine and then created", reason: "stutter: doubled phrase" },
  { cut: "It's And it's a-", before: "And having access to Blender and Unreal Engine", reason: "false start x2 (raw '...' token dropped in prep)" },
  { cut: "gives it that,", before: "gives it that almost superpower", reason: "stutter: doubled phrase" },
  { cut: "so if you, like, look", before: "And they're even building, like, these crazy games", reason: "abandoned tail before the 36s browse" },
  { cut: "uh,", before: "just, like, an HTML website", reason: "filler" },
  { cut: "Um,", before: "and I've seen a bunch of videos", reason: "filler" },
  { cut: "three,", before: "3D environments", reason: "stutter" },
  { cut: "But that, but that kinda", before: "But that got me super curious", reason: "false start x2" },
  // ---- tutorial: Codex + Blender MCP setup ----
  { cut: "So make sure that you have the--", before: "So make sure you have the Codex app downloaded", reason: "retake: restarted line" },
  { cut: "It looks just like this. It says...", before: "It looks just like this, and if we open it up", reason: "retake: restarted line" },
  { cut: "And if we open it up,", before: "you can see this is what our Codex looks like", reason: "stutter: doubled phrase after the app-open pause" },
  { cut: "and then connect that to your,", before: "and then connect that to your LLM", reason: "stutter: doubled phrase" },
  { cut: "which is like ChatGPT--", before: "which is like GPT-6 Astra or Fable five point one", reason: "self-correction" },
  { cut: "It's very simple downloading the MCP.", before: "It's very simple downloading the MCP into your session", reason: "retake: restarted line" },
  { cut: "All you need to do is drag and,", before: "all you need to do is drag and drop this blue box", reason: "stutter: doubled phrase" },
  { cut: "that's going to activate and authori- au- that's going to activi-", before: "that's going to activate and authorize the actual MCP connection", reason: "stutter x3" },
  { cut: "And that's important because,", before: "and that's important because when you are trying to connect", reason: "stutter: doubled phrase" },
  { cut: "where you can search up Where you can,", before: "where you can search up Blender", reason: "retake x2 while hunting the plugins menu" },
  { cut: "this exact,", before: "this exact file path", reason: "stutter: doubled phrase" },
  { cut: "and you can create,", before: "and then you can start creating your scenes", reason: "false start" },
  { cut: "And then,", before: "and then you wanna make sure that you have a Blender session open", reason: "false start after the 2.9s pause" },
  { cut: "rigged,", before: "rigged character models", reason: "stutter (c004)" },
  { cut: "This is where you can find,", before: "this is where you can find a bunch of different characters", reason: "stutter: doubled phrase" },
  { cut: "Now, something that I always love to do--", before: "Now, something that I always make sure to do is", reason: "retake: restarted line" },
  { cut: "As you can see, Blender right here.", before: "As you can see, Blender right here is authorized", reason: "retake: restarted line" },
  // ---- wave + facial expressions ----
  { cut: "With this nice prompt--", before: "With this very simple prompt, we can get", reason: "retake: restarted line" },
  { cut: "But you can also see that it added this nice like--", before: "But you can also see it added this nice like facial expression", reason: "retake: restarted line" },
  { cut: "and waves it looks like,", before: "and waves that right hand right here", reason: "stutter: doubled phrase" },
  { cut: "Um,", before: "and it can pick up and build out some", reason: "filler" },
  { cut: "build out some co-", before: "build out some context around the Pixar", reason: "stutter" },
  // ---- Backrooms prompt ----
  { cut: "eyes,", before: "eyes on the darkness", reason: "stutter (c005)" },
  { cut: "So there's a, a--", before: "there is a full story inside of this prompt", reason: "false start (incl c006)" },
  { cut: "just how to--", before: "just giving some context to Codex", reason: "false start" },
  // ---- THE PHONE CALL (2.mov tail): everything after "come back when that scene is done." ----
  { from: "Yo, can you hear me?", to: "But for some reason, it still will not...", before: "Okay, so the Backrooms video just wrapped up", reason: "PRIVATE: phone/video call captured during the Backrooms wait (36:22-38:34 source) + the rest of the wait; jump to 3.mov 'the Backrooms video just wrapped up' (incl c007)" },
  // ---- Backrooms review + outro (3.mov) ----
  { cut: "it created a bunch of different-- It created a bunch of different--", before: "It created separate scenes, so there's camera jumps", reason: "false start x2" },
  { cut: "Um,", before: "and essentially, we can say this is like a character", reason: "filler" },
  { cut: "Um,", before: "but like in this scene, you can see he like turns his head", reason: "filler" },
  { cut: "as it,", before: "as he looks", reason: "stutter" },
  { cut: "Um,", before: "but it did add some really cool things", reason: "filler (1.1s pause both sides)" },
  { cut: "it did add a,", before: "it added music for us", reason: "stutter: doubled phrase" },
  { cut: "So it's, it added these different sc--", before: "So it added different scenes", reason: "retake: restarted line" },
  { cut: "I will unmute my,", before: "I will unmute my computer so you guys can hear", reason: "stutter: doubled phrase" },
  { cut: "uh,", before: "Eevee", reason: "filler" },
  { cut: "Um,", before: "so we definitely would need to fix all of this glitching", reason: "filler" },
  { cut: "um,", before: "and the realism of the actual scene", reason: "filler" },
  { cut: "But that's,", before: "that wasn't really the point of this generation", reason: "stutter" },
  { cut: "Now I'm really curious,", before: "now I'm really curious to what you guys will build", reason: "stutter: doubled phrase" },
  { cut: "with JPT--", before: "with GPT-6 Astra, so drop some of those ideas", reason: "misspoke" },
  { cut: "I'm gonna leave you guy--", before: "I also recommend that you join my free school community", reason: "false start" },
  { cut: "And I'm gonna leave you guys with--", before: "And I'm going to leave it at that", reason: "false start" },
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
