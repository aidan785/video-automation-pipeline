import fs from 'fs';
const specs = JSON.parse(fs.readFileSync('cut-specs.json','utf8'));
for (const s of specs) { if (s.cut === 'another another') { s.cut = 'we have another another'; s.reason = 'abandoned (We have another, another--)'; } }
specs.push(
 {cut:"and then with that",before:"and then with those assets",reason:"false start restart"},
 {cut:"and the",before:"i also was able to create",reason:"abandoned clause (and the ...)"},
 {cut:"so now so this all-in-one so this all-in-one tool that i'm using",before:"so this all-in-one creative tool that i'm using",reason:"quadruple restart chain"},
 {cut:"which actual websites",before:"and it's all just one click away",reason:"false start (which-- Actual websites)"},
 {cut:"finding mcp",before:"finding mcp and apis",reason:"stutter (finding MCP, finding MCP)"},
 {cut:"and so and so",before:"and so today",reason:"triple and-so stutter"},
 {cut:"or some",before:"of some sort",reason:"false start (or some-- of some sort)"},
 {cut:"and if we o",before:"and then if we open up",reason:"false start (And if we o--)"},
 {cut:"these",before:"the other four look good",reason:"false start (These--)"},
 {cutFromAfter:"i'm just going to say approved let's move on",keep:"and so this next part",reason:"Wait-what mutter + 8.8s dead air"},
 {cut:"so now you know how you can build",before:"so now you know how you can build a product shoot",reason:"retake: incomplete outro build line"},
 {trimGapAfter:"brand color palette is",before:"natural earth tones",keep:0.25,reason:"0.94s thinking pause mid-prompt"}
);
fs.writeFileSync('cut-specs.json', JSON.stringify(specs, null, 1));
console.log('specs now', specs.length);
