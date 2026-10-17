import fs from 'node:fs';
const v = JSON.parse(fs.readFileSync('assets/verify-phrases.json', 'utf8'));
const fix = { "I connected Fable 5.1 to Blender rigged characters": "I connected Fable 5.1 to", "now let's wait for the back flip": "now let's wait for the", "we get a back flip": "and boom we get a" };
for (const x of v) if (fix[x.phrase]) x.phrase = fix[x.phrase];
fs.writeFileSync('assets/verify-phrases.json', JSON.stringify(v, null, 2)); console.log('phrases:', v.length);
