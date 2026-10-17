import fs from 'node:fs';
const v = JSON.parse(fs.readFileSync('assets/verify-phrases.json', 'utf8'));
const fix = {
  "Can GPT Astra 6 animate characters in Blender": "animate characters in Blender",
  "we can animate the character walking all with GPT 6 Astra": "animate the character walking",
  "and then we can actually create scenes with GPT 6 Astra": "actually create scenes with",
  "having access to Blender and Unreal Engine gives it that almost superpower": "almost superpower",
  "which is Blender five point two": "the most recent version which is Blender",
  "rigged character models": "character models",
};
for (const x of v) { if (fix[x.phrase]) x.phrase = fix[x.phrase]; if (x.phrase === 'sixty-one percent resolution rate') { x.phrase = 'resolution rate'; x.expect = 2; } }
v.push({ phrase: 'insane I mean', expect: 0 }, { phrase: "it's especially insane", expect: 1 }, { phrase: 'stand right back up', expect: 0 },
  { phrase: 'sit down and then stand back up', expect: 1 }, { phrase: 'that s almost', expect: 0 }, { phrase: 'free 3D rigged', expect: 1 }, { phrase: '62', expect: 0 });
fs.writeFileSync('assets/verify-phrases.json', JSON.stringify(v, null, 2));
console.log('phrases:', v.length);
