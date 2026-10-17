import fs from 'node:fs';
const b='video-projects/adobe-transfer-0916';
const norm=s=>s.toLowerCase().replace(/[^a-z0-9']/g,'');
const w=JSON.parse(fs.readFileSync(b+'/assets/source.json')).words.filter(w=>w.type==='word'&&norm(w.text));
const specs=JSON.parse(fs.readFileSync(b+'/edit-specs.json'));
const sil=JSON.parse(fs.readFileSync(b+'/assets/source.silence-edl.json'));
function ed(t){let a=0;for(const k of sil.keep_ranges){if(t<k.start)return a;if(t<=k.end)return a+t-k.start;a+=k.end-k.start;}return a;}
const cuts=[],failed=[];
for(const [t,cut,before] of specs){const c=cut.split(/\s+/).map(norm).filter(Boolean),a=before.split(/\s+/).map(norm).filter(Boolean);const hits=[];
for(let i=0;i<w.length;i++){if(Math.abs(w[i].start-t)>35)continue;if(c.every((x,j)=>norm(w[i+j]?.text??'')===x)&&a.every((x,j)=>norm(w[i+c.length+j]?.text??'')===x))hits.push(i);}
if(hits.length!==1){failed.push([t,cut,before,hits]);continue;}
const i=hits[0],j=i+c.length;
const start=Math.max(w[i-1]?.end??0,w[i].start-.025),end=Math.max(w[j-1].end,w[j].start-.07);
cuts.push({start:ed(start),end:ed(end),reason:'Remove abandoned/repeated take: '+cut,source_start:start,source_end:end,removes:cut,keeps:before});}
fs.writeFileSync(b+'/assets/proposed-cuts.json',JSON.stringify({status:'Proposed cuts editorially reviewed; awaiting user approval as required by cut-mistakes skill',cuts},null,2));
fs.writeFileSync(b+'/assets/semantic-source-cuts.json',JSON.stringify(cuts,null,2));
console.log('Located',cuts.length,'FAILED',failed.length);console.log(JSON.stringify(failed,null,2));
for(const c of cuts)console.log(c.source_start.toFixed(2)+'-'+c.source_end.toFixed(2)+' | '+c.removes+' → '+c.keeps);
if(failed.length)process.exitCode=1;
