import fs from 'fs';
const specs = JSON.parse(fs.readFileSync('cut-specs.json','utf8'));
specs.push({cut:"and then",before:"and then navigate to new chat",reason:"doubled 'and then'"});
fs.writeFileSync('cut-specs.json', JSON.stringify(specs, null, 1));
console.log('specs', specs.length);
