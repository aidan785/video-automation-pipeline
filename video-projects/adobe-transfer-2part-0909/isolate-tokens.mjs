import fs from 'node:fs';
import {spawn} from 'node:child_process';
const base='video-projects/adobe-transfer-2part-0909/assets';
fs.mkdirSync(base+'/iso',{recursive:true});
const raw=JSON.parse(fs.readFileSync(base+'/source.orig.json'));
const cur=JSON.parse(fs.readFileSync(base+'/source.json'));
const jobs=raw.words.map((w,i)=>({w,i,c:cur.words[i]})).filter(x=>x.w.type==='word' && x.w.end-x.w.start>1.2);
function run(cmd,args){return new Promise((res,rej)=>{const p=spawn(cmd,args,{stdio:['ignore','pipe','pipe']});let out='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>out+=d);p.on('exit',c=>c?rej(new Error(out)):res(out));});}
let next=0;
await Promise.all(Array.from({length:3},async()=>{while(next<jobs.length){const j=jobs[next++];let a=Math.max(0,j.c.start-2),b=j.c.end+2;if(b-a>15){a=Math.max(0,j.w.start-2);b=a+8;}j.offset=a;j.end=b;const stem=base+'/iso/tok-'+j.i;await run('ffmpeg',['-v','error','-y','-ss',String(a),'-i',base+'/source.ffconcat','-t',String(b-a),'-vn','-ar','16000','-ac','1',stem+'.wav']);await run('node',['scripts/transcribe-elevenlabs.mjs',stem+'.wav','--output',stem+'.json']);console.log(j.i,j.w.text,j.w.start,j.w.end,'=>',j.c.start,j.c.end,JSON.parse(fs.readFileSync(stem+'.json')).text);}}));
fs.writeFileSync(base+'/iso/manifest.json',JSON.stringify(jobs,null,2));
