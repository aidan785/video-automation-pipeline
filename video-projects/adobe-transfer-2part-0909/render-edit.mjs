// Task-local renderer: source-frame aligned keeps prevent cumulative concat padding.
import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
const b='video-projects/adobe-transfer-2part-0909/assets';
const edl=JSON.parse(fs.readFileSync(b+'/seed.union-edl.json'));
const dels=[...fs.readFileSync(b+'/residual-40-dry.txt','utf8').matchAll(/del ([\d.]+)-([\d.]+)/g)].map(m=>({start:+m[1],end:+m[2],reason:'Audio-confirmed residual silence at -40 dB'}));
const extra=process.argv[2]?JSON.parse(fs.readFileSync(process.argv[2])):[];dels.push(...extra);
const restore=process.argv[2]?[{start:973.8,end:974.07}]:[];
const inputs=[...edl.keep_ranges,...restore].sort((a,b)=>a.start-b.start);
const merged=[];for(const k of inputs){const last=merged.at(-1);if(last&&k.start<=last.end+.0001)last.end=Math.max(last.end,k.end);else merged.push({...k});}
const ranges=[];for(const k of merged){let parts=[k];for(const d of dels){parts=parts.flatMap(r=>d.end<=r.start||d.start>=r.end?[r]:[{start:r.start,end:Math.max(r.start,d.start)},{start:Math.min(r.end,d.end),end:r.end}].filter(x=>x.end>x.start));}ranges.push(...parts);}
const keep=ranges.map(r=>({start:Math.round(r.start*30)/30,end:Math.round(r.end*30)/30})).filter(r=>r.end>r.start);
const deletes=[];let cursor=0;for(const k of keep){if(k.start>cursor)deletes.push({start:cursor,end:k.start});cursor=k.end;}if(cursor<edl.source_duration)deletes.push({start:cursor,end:edl.source_duration});
const duration=keep.reduce((s,k)=>s+k.end-k.start,0);
const out=process.argv[3]??b+'/clean-v1.mp4';const stem=out.replace(/\.mp4$/,'');
fs.writeFileSync(stem+'.union-edl.json',JSON.stringify({source_duration:edl.source_duration,edited_duration:duration,removed:edl.source_duration-duration,keep_ranges:keep,delete_ranges:deletes,render:{fps:30,alignment:'source frame boundaries',audio_fade_ms:4}},null,2));
console.log(JSON.stringify({output:out,keeps:keep.length,duration,removed:edl.source_duration-duration}));
let log=fs.openSync(stem+'.audio-render.log','w');
let p=spawnSync('python3',['video-projects/adobe-transfer-2part-0909/render-audio.py',stem],{stdio:['ignore',log,log]});if(p.status)process.exit(p.status);
const concat=['ffconcat version 1.0'];
for(const k of keep){const second=k.start>=3805.633333-0.001;const off=second?3805.6333333333333:0;concat.push('file '+(second?'part2.mov':'part1.mov'),'inpoint '+(k.start-off).toFixed(9),'outpoint '+(k.end-off).toFixed(9),'duration '+(k.end-k.start).toFixed(9));}
fs.writeFileSync(stem+'.segments.ffconcat',concat.join('\n')+'\n');
log=fs.openSync(stem+'.render.log','w');
p=spawnSync('ffmpeg',['-y','-hide_banner','-copyts','-segment_time_metadata','1','-i',stem+'.segments.ffconcat','-i',stem+'.wav','-map','0:v:0','-map','1:a:0','-vf','select=concatdec_select,setpts=N/(30*TB)','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-g','30','-keyint_min','30','-sc_threshold','0','-c:a','aac','-b:a','192k','-movflags','+faststart','-progress',stem+'.progress.txt',out],{stdio:['ignore',log,log]});process.exit(p.status??1);
