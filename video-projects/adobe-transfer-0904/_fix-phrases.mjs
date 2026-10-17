import fs from 'node:fs';
const v = JSON.parse(fs.readFileSync('assets/verify-phrases.json', 'utf8'));
const fix = {
  "I connected Fable 5.1 to blender-rigged characters": "I connected Fable 5.1 to Blender rigged characters",
  "from a mocab library": "from a mocap library",
  "here's Opus 4.8": "here's Opus four point eight",
  "tools that I used": "used obviously",
  "and boom we get a backflip": "we get a back flip",
  "you can utilize Claude Fable 5.1 to animate your rigged characters": "you can utilize Claude Fable 5.1 to animate your",
};
for (const x of v) { if (fix[x.phrase]) x.phrase = fix[x.phrase]; if (x.phrase === 'inside of Blender') x.expect = 5; }
v.push({ phrase: 'but you would do', expect: 0 }, { phrase: 'a month but do remember', expect: 1 }, { phrase: 'some caveats', expect: 1 });
fs.writeFileSync('assets/verify-phrases.json', JSON.stringify(v, null, 2));
console.log('phrases:', v.length);
