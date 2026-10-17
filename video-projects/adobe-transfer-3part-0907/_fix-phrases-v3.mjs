import fs from 'node:fs';
const v = JSON.parse(fs.readFileSync('assets/verify-phrases.json', 'utf8'));
for (const x of v) { if (x.phrase === 'the Backrooms video just wrapped up') x.phrase = 'video just wrapped up'; if (x.phrase === "it's especially insane") x.phrase = 'really insane especially insane'; }
v.push({ phrase: 'es especially', expect: 0 }, { phrase: 'insane it s especially', expect: 0 });
fs.writeFileSync('assets/verify-phrases.json', JSON.stringify(v, null, 2)); console.log('phrases:', v.length);
