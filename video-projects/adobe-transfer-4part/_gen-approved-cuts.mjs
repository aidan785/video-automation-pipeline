// Locate editorial cut phrases in the silenced transcript and emit approved-cuts.json.
// Each spec: { cut: "words to remove", before: "words that must follow", reason }.
// Boundaries: start = prev kept word end + 0.02 (onset-sliver rule), end = next kept word start - 0.06.
import fs from 'node:fs';

const tPath = process.argv[2] ?? 'assets/source.silence-transcript.json';
const outPath = process.argv[3] ?? 'assets/approved-cuts.json';
const t = JSON.parse(fs.readFileSync(tPath, 'utf8'));
const words = t.words.filter(w => w.type !== 'spacing' && /\S/.test(w.text));
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim();
const toks = words.map(w => norm(w.text)).map(x => x === '' ? null : x);

const SPECS = [
  { cut: "And as you can...", before: "And as you can see, if we put", reason: "retake: restarted side-by-side line" },
  { cut: "So today,", before: "so today I'm gonna show you", reason: "stutter: doubled 'so today'" },
  { cut: "and I highly recommend downloading Blender 2.5, the most recent.", before: "Blender 5.2 LTS", reason: "retake: misspoke version (Blender 2.5), corrected next line" },
  { cut: "as well as some-", before: "I highly recommend downloading the most recent", reason: "false start: abandoned 'as well as some-'" },
  { cut: "Also, if you want the free skill...", before: "Also, if you want the free skill, it is linked", reason: "retake: restarted free-skill line" },
  { cut: "You can use the--", before: "You can use Claude to generate", reason: "false start" },
  { cut: "So,", before: "so let's hop into Claude Code", reason: "stutter: doubled 'so' (c002)" },
  { cut: "Now to connect your skill, you're gonna wanna go... Now to connect your skill, you're wanna gonna go-- To now,", before: "now to connect your skill, you're gonna wanna go to the description", reason: "retake x2: connect-skill line, keep final clean take (incl c003)" },
  { cut: "the Previz,", before: "the Previz to CDance skill is right here", reason: "stutter: doubled 'the Previz'" },
  { cut: "So it's like, so inside Claude, make sure that you have /MCP.", before: "So inside Claude, make sure that you type in /MCP", reason: "retake: /MCP line restarted" },
  { cut: "If you do not have B--", before: "if you do not have Blender enabled", reason: "false start" },
  { cut: "ref... th-", before: "referenced in CDance 2.5", reason: "flub: 'ref... th-' before clean 'referenced'" },
  { cut: "I want to create a video of", before: "So what I'm gonna put in this other tab", reason: "false start before typing narration" },
  { cut: "So maybe I go,", before: "so what I can do is I can also go", reason: "false start" },
  { cut: "So I've just rendered this pre-viz out for...", before: "So I've just rendered this pre-viz out, and now", reason: "retake: rendered-previz line restarted" },
  { cut: "and as you can see right now, it's creating my charac-- It's...", before: "So as you can see, it's creating my character sheet prompt", reason: "retake: abandoned mid-word, restarted" },
  { cut: "Then we're gonna upload a photo of myself.", before: "And then we're just going to upload a photo of myself", reason: "retake: upload-photo line, keep second take" },
  { cut: "And so this is my character sheet board, so I can take this. It's going to... Okay.", before: "This is my character sheet board.", reason: "retake: character-sheet-board reveal, keep final take" },
  { cut: "And then I'm gonna go back,", before: "I'm then gonna go back into Claude", reason: "restart" },
  { cut: "of the blender", before: "of the low-poly scene", reason: "flub: 'of the blender' -> 'of the low-poly scene'" },
  { cut: "This will just--", before: "The more references we give", reason: "false start" },
  { cut: "clouds and a,", before: "clouds and a sky", reason: "stutter: doubled 'clouds and a'" },
  { cut: "and multiple houses like,", before: "and multiple houses like this", reason: "stutter: doubled 'multiple houses like'" },
  { cut: "Now all I need to do is... Now all we need to do now that Claude has context on the two reference images that we uploaded and the video is give me the...", before: "All we need to prompt is", reason: "retake x2: abandoned prompt-instruction lines, keep final" },
  { cut: "Make sure you tag", before: "Make sure you tag image one", reason: "retake: tag line restarted" },
  { cut: "So now what we need to do is we need to cop the--", before: "So now what we need to do is copy", reason: "retake: copy-prompt line restarted" },
  { cut: "This will make sure that... Th-", before: "This will make sure that the AI model", reason: "retake: restarted" },
  { cut: "from,", before: "from our reference images", reason: "stutter: doubled 'from' (c005)" },
  { cut: "click, uh,", before: "click on image one", reason: "stutter+filler: doubled 'click'" },
  { cut: "So on my previous-- so on my previous runs, I was having--", before: "so on my previous runs, it was", reason: "retake x2: previous-runs line, keep final take" },
  { cut: "Now this generation...", before: "Again, all of my free", reason: "false start: abandoned before outro" },
  { cut: "Again, all of my free resourcers--", before: "Again, all of my free resources are", reason: "retake: 'resourcers' flub" },
  { cut: "our CDance 2.5 to our Blender,", before: "our Blender renders to CDance 2.5 generations", reason: "flub: inverted phrase, keep clean 'Blender renders to CDance'" },
];

function findSeq(seqToks, startAt = 0) {
  // returns array of matching start indices in toks
  const hits = [];
  outer: for (let i = startAt; i <= toks.length - seqToks.length; i++) {
    let k = i;
    for (const st of seqToks) {
      // allow a spec token to span multiple transcript tokens or vice versa via simple join matching
      if (toks[k] === st) { k++; continue; }
      // try joining transcript tokens to match st (e.g. "2.5" tokenized apart)
      let joined = toks[k] ?? '';
      let kk = k + 1;
      while (joined.length < st.length && kk < toks.length) { joined += toks[kk] ?? ''; kk++; }
      if (joined === st) { k = kk; continue; }
      // try splitting: spec tokens joined matching one transcript token is handled by caller-side pre-join
      continue outer;
    }
    hits.push({ start: i, end: k }); // end exclusive
  }
  return hits;
}

const cuts = [];
let fail = 0;
for (const spec of SPECS) {
  const cutToks = norm(spec.cut).split(' ').filter(Boolean);
  const befToks = norm(spec.before).split(' ').filter(Boolean).slice(0, 6);
  const cands = findSeq(cutToks).filter(h => {
    // the 'before' anchor must start within the next 2 tokens after the cut
    for (let off = 0; off <= 1; off++) {
      let k = h.end + off, ok = true;
      for (const bt of befToks) { if (toks[k] !== bt) { ok = false; break; } k++; }
      if (ok) return true;
    }
    return false;
  });
  if (cands.length !== 1) {
    console.error(`FAIL (${cands.length} matches): cut="${spec.cut}" before="${spec.before}"`);
    fail++;
    continue;
  }
  const h = cands[0];
  const first = words[h.start], last = words[h.end - 1];
  const prev = words[h.start - 1], next = words[h.end];
  let start = prev ? prev.end + 0.02 : Math.max(0, first.start - 0.02);
  if (start >= first.start + 0.15) start = Math.max(0, first.start - 0.02); // sanity
  let end = next ? Math.max(last.end + 0.01, next.start - 0.06) : last.end + 0.05;
  cuts.push({
    start: +start.toFixed(3), end: +end.toFixed(3), reason: spec.reason,
    removes: spec.cut, keepsNext: spec.before,
    _ctx: words.slice(Math.max(0, h.start - 6), Math.min(words.length, h.end + 6)).map(w => w.text).join(' '),
  });
  console.log(`OK ${start.toFixed(2)}-${end.toFixed(2)} (${(end - start).toFixed(2)}s) ${spec.reason}`);
}
if (fail) { console.error(`${fail} specs failed to locate — nothing written`); process.exit(1); }
cuts.sort((a, b) => a.start - b.start);
fs.writeFileSync(outPath, JSON.stringify({ cuts }, null, 2));
console.log(`\n${cuts.length} cuts -> ${outPath} (total ${cuts.reduce((t, c) => t + c.end - c.start, 0).toFixed(1)}s)`);
