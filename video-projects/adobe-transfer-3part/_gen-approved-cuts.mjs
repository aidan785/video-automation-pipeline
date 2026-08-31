#!/usr/bin/env node
// Editorial retake/false-start cuts for the geometry-nodes tutorial (adobe-transfer-3part).
// Matches verbatim phrases against the silence-timeline transcript tokens and emits
// approved-cuts.json (start/end on the silence timeline) for build-combined-cut.mjs.
// Each spec: { cut: "<words to remove>", before: "<words that must immediately follow>" }

import fs from 'node:fs';

const T = JSON.parse(fs.readFileSync(new URL('./assets/combined-raw.silence-transcript.json', import.meta.url), 'utf8'));

const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const toks = s => norm(s).split(' ').filter(Boolean);

const words = T.words
  .filter(w => w.type !== 'spacing')
  .map(w => ({ ...w, n: norm(w.text) }))
  .filter(w => w.n.length);
// a single transcript token may hold several spoken words ("the g--"): explode norm
const seq = [];
words.forEach((w, wi) => { for (const t of w.n.split(' ')) seq.push({ t, wi }); });

const SPECS = [
  { cut: "Claude is really good at geometry nodes, and today-- Claude is really good at geometry nodes. I had Claude build this little gumdrop for me, and it's really good at...", before: "Claude is really good at geometry nodes. For example", why: "double false-start opening, keep 3rd take" },
  { cut: "every--", before: "the gumdrop, the transparency", why: "flub" },
  { cut: "And today, I'm gonna show you exactly...", before: "And today, I'm gonna show you exactly how", why: "abandoned start" },
  { cut: "the entire, the entire,", before: "the entire education", why: "stutter" },
  { cut: "with a bunch of little sugar cubes on,", before: "with a bunch of little sugar cubes on it", why: "restart" },
  { cut: "If you are,", before: "if you are interested", why: "stutter" },
  { cut: "in... Now, if you're wondering how geometry nodes--", before: "Now, I'm not gonna be teaching", why: "trailing word + false start" },
  { cut: "in this,", before: "in this video", why: "stutter" },
  { cut: "If you,", before: "if you're a 3D artist", why: "stutter" },
  { cut: "or an instruct--", before: "or an extra person", why: "abandoned word" },
  { cut: "with building, with building,", before: "with building inside of Blender", why: "triple stutter" },
  { cut: "So, so it's still--", before: "So again", why: "false start (c001)" },
  { cut: "so", before: "it's still important to understand", why: "stray so after 'again,'" },
  { cut: "Don't jump into, don't jump into it, don't jump into it just l--", before: "Don't jump into it blindly", why: "triple restart" },
  { cut: "all of your,", before: "all of your animations", why: "stutter" },
  { cut: "So, so I highly recommend you watch,", before: "so I highly recommend you watch Blender", why: "restart (c002)" },
  { cut: "It is super inform--", before: "It's super informative", why: "restart" },
  { cut: "So how do we teach-- So before we get started... So very quick, how-- so very quick, the workflow of how this--", before: "So very quick, the workflow of this process", why: "multi false-start, keep final take" },
  { cut: "essentially becomes,", before: "it becomes part", why: "restart" },
  { cut: "it won't--", before: "it's going to turn out terrible", why: "restart" },
  { cut: "this actual geometry node skill and--", before: "this geometry node skill inside of Blender", why: "restart, keep corrected" },
  { cut: "So it's gonna use Python.", before: "Claude is going to use Python", why: "restart, keep fuller take" },
  { cut: "it's easily manipulated--", before: "it can be easily manipulated", why: "restart" },
  { cut: "Inside of-- So, so you're going to need a-- So you're going to need-- You're going...", before: "So you're going to need access", why: "quad false start (c003)" },
  { cut: "In the description below, you will find a link to--", before: "In the description below, you will find a link to a file", why: "restart" },
  { cut: "Some references that it can pull to start actually--", before: "some references that Claude can pull", why: "restart" },
  { cut: "And then the actual-- And then the most important file, which is, uh, the--", before: "And then the most important file, which is the", why: "double restart" },
  { cut: "And each one of these--", before: "And it takes it through", why: "false start" },
  { cut: "And what I did is I actually-- And to create something, uh-- And to create something like this inside of Blender with Claude, and to create that skill, and to create that skill that I--", before: "And to create this geometry node", why: "5x restart, keep final take" },
  { cut: "and fed it into Claude--", before: "and fed it into a skill", why: "restart" },
  { cut: "So what you're gonna ne-", before: "so what you're gonna need to do,", why: "stutter" },
  { cut: "you're gonna find that g--", before: "you're going to find that zip", why: "restart" },
  { cut: "And then you're going to open up a Claude session.", before: "And then you're going to open up a Claude session. I'm working", why: "doubled sentence, keep 2nd" },
  { cut: "And then I'm going to be stick--", before: "And then I'm going to be sticking", why: "restart" },
  { cut: "So what you need to do next is you're going to need to upload, if it's going to let me.", before: "So what you're gonna need to do next is upload", why: "abandoned attempt, retaken" },
  { cut: "Now what we--", before: "Now, for Claude to actually analyze", why: "false start" },
  { cut: "This will help--", before: "This will prompt Claude", why: "restart" },
  { cut: "So then eventually,", before: "so then eventually in the future", why: "stutter" },
  { cut: "and it will--", before: "and we can run that process", why: "abandoned clause" },
  { cut: "Okay, now that we have the-- Okay, now that we have the /init ran--", before: "Now that we have the /init ran on", why: "double restart" },
  { cut: "it,", before: "it knows what it is", why: "stutter (c004)" },
  { cut: "and then the conversations that must survive,", before: "and then the conversions that must survive", why: "keep corrected take" },
  { cut: "So again, if we go into our Blender session, go into Files, just search up geometry nodes. You can see we have... Delete that last part.", before: "Now next we need to make sure that Blender is connected", why: "spoken edit instruction: 'Delete that last part' — aborted demo" },
  { cut: "If you are ha-", before: "If you are having", why: "stutter" },
  { cut: "So next, so next we need to open up a blank--", before: "So next we need to open up a blank Blender", why: "restart" },
  { cut: "And now,", before: "and now we have a completely blank", why: "stutter" },
  { cut: "Now I'm just gonna go with the same exact format that--", before: "Now I'm just gonna go with the exact same way", why: "restart" },
  { cut: "This is a framework by Nate Herk. If you ever--", before: "This is a framework by Nate Herk on how", why: "keep fuller take" },
  { cut: "on how to set up con--", before: "on how to set up efficient", why: "restart" },
  { cut: "as--", before: "and have Fable be the director", why: "abandoned word" },
  { cut: "and I will come back t-", before: "and I will come back to you", why: "stutter" },
  { cut: "and then we'll, and then we'll get a final outlook--", before: "and then we'll get a final output", why: "restart + wrong word" },
  { cut: "If we just zoom in here,", before: "if we just zoom in here, you can see", why: "stutter" },
  { cut: "So this is how we can make the d...", before: "This is how-- where we can multiply", why: "abandoned" },
  { cut: "how--", before: "where we can multiply the density", why: "correction mid-word" },
  { cut: "Also, one thing I want to--", before: "also one thing I want to note", why: "restart" },
  { cut: "g--", before: "actual geometry nodes", why: "flub" },
  { cut: "Because we don't need Fable to render out, if we want--", before: "Because we don't need Fable to render out one image", why: "restart" },
  { cut: "which is a much less--", before: "which uses much less tokens", why: "restart" },
  { cut: "Okay, my screen is doing the--", before: "Okay, my screen is doing the wheel", why: "restart" },
  { cut: "adding more,", before: "adding more variety", why: "stutter" },
  { cut: "So now if I wanted to add--", before: "So now if I wanted to add more sugar", why: "restart" },
  { cut: "and I can just scale this up, uh,", before: "and I can just scale this up to as many", why: "restart" },
  { cut: "And now we've got like an insane amount of--", before: "And now we have an insane amount", why: "restart" },
  { cut: "And if, and if I wanted to change the colors of-- uh,", before: "if I wanted to change the colors of anything", why: "double restart" },
  { cut: "And now it's going to be--", before: "And now it's a green gumdrop", why: "restart" },
  { cut: "in the evergreen space--", before: "in the constantly changing space", why: "correction" },
];

const cuts = [];
const errors = [];
for (const s of SPECS) {
  const c = toks(s.cut), b = toks(s.before || '');
  const matches = [];
  outer: for (let i = 0; i + c.length <= seq.length; i++) {
    for (let j = 0; j < c.length; j++) if (seq[i + j].t !== c[j]) continue outer;
    for (let j = 0; j < b.length; j++) {
      const k = i + c.length + j;
      if (k >= seq.length || seq[k].t !== b[j]) continue outer;
    }
    matches.push(i);
  }
  if (matches.length !== 1) { errors.push(`${matches.length} matches for: "${s.cut.slice(0, 60)}..."`); continue; }
  const i = matches[0];
  const wFirst = words[seq[i].wi];
  const wLast = words[seq[i + c.length - 1].wi];
  if (seq[i].wi !== seq[i + c.length - 1].wi || wFirst.n === toks(s.cut).join(' ')) { /* ok */ }
  // guard: cut must not share a transcript token with kept material
  const prevWi = seq[i].wi > 0 ? seq[i].wi - 1 : null;
  const nextIdx = i + c.length;
  if (nextIdx < seq.length && seq[nextIdx].wi === seq[i + c.length - 1].wi) { errors.push(`cut ends mid-token: "${s.cut.slice(0, 50)}"`); continue; }
  if (i > 0 && seq[i - 1].wi === seq[i].wi) { errors.push(`cut starts mid-token: "${s.cut.slice(0, 50)}"`); continue; }
  let start = wFirst.start - 0.02;
  if (prevWi !== null) start = Math.max(start, words[prevWi].end);
  let end = wLast.end + 0.02;
  if (nextIdx < seq.length) end = Math.min(end, Math.max(words[seq[nextIdx].wi].start - 0.06, wLast.end));
  const rawText = words.slice(seq[i].wi, seq[i + c.length - 1].wi + 1).map(w => w.text).join(' ');
  const follows = nextIdx < seq.length ? words.slice(seq[nextIdx].wi, seq[nextIdx].wi + 6).map(w => w.text).join(' ') : '(end)';
  cuts.push({ start: +start.toFixed(3), end: +end.toFixed(3), reason: s.why, text: rawText, follows });
}

if (errors.length) { console.error('ERRORS:\n' + errors.join('\n')); process.exit(1); }
cuts.sort((a, b) => a.start - b.start);
for (let i = 1; i < cuts.length; i++) if (cuts[i].start < cuts[i - 1].end) { console.error(`OVERLAP at ${cuts[i].start}`); process.exit(1); }

const mm = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
for (const c of cuts) console.log(`${mm(c.start)}-${mm(c.end)}  CUT "${c.text}"  ->  keeps "${c.follows}"`);
console.log(`\n${cuts.length} cuts, ${cuts.reduce((a, c) => a + c.end - c.start, 0).toFixed(1)}s total`);
fs.writeFileSync(new URL('./assets/approved-cuts.json', import.meta.url), JSON.stringify({ cuts: cuts.map(({ start, end, reason }) => ({ start, end, reason })) }, null, 2));
console.log('wrote assets/approved-cuts.json');
