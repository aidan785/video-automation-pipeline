import json,subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
b=Path(__file__).resolve().parent;a=b/'assets'
parts=[];words=[];off=0
for i in [1,2]:
 p=a/f'part{i}.mov'; probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(p)]));(a/f'part{i}.probe.json').write_text(json.dumps(probe,indent=2));d=float(probe['format']['duration']);t=json.loads((a/f'part{i}.json').read_text());words += [dict(w,start=w['start']+off,end=w['end']+off) for w in t['words']];parts.append(dict(name=p.name,duration=d,offset=off));off+=d
(a/'source.json').write_text(json.dumps(dict(words=words,text=' '.join(w['text'] for w in words if w['type']=='word'),audio_duration_secs=off,language_code='en'),indent=2));(b/'run-manifest.json').write_text(json.dumps(dict(source_order=parts,source_duration=off),indent=2));(b/'meta.json').write_text(json.dumps(dict(title='GPT-6 Astra Blender Architecture Tutorial',sourceOrder=['1.mov','2.mov'],width=3840,height=1080,fps=30,pipeline=['cut-silences','cut-mistakes','verify-cuts']),indent=2));(a/'source.ffconcat').write_text('ffconcat version 1.0\nfile part1.mov\nfile part2.mov\n')
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(a/'source.ffconcat'),'-map','0','-c','copy',str(a/'source.mov')],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(a/'source.mov'),'-vn','-c:a','pcm_s16le',str(a/'source.wav')],check=True)
isos=[]
for i,part in enumerate(parts,1):
 orig=json.loads((a/f'part{i}.orig.json').read_text())['words'];new=json.loads((a/f'part{i}.json').read_text())['words']
 for old,w in zip(orig,new):
  if w['type']=='word' and (w['start']!=old['start'] or w['end']!=old['end']):
   start=max(0,old['start']+part['offset']-2);end=min(off,old['end']+part['offset']+2);p=a/f'isolate-{round(start*100)}.wav';subprocess.run(['ffmpeg','-y','-v','error','-ss',str(start),'-i',str(a/'source.wav'),'-t',str(end-start),str(p)],check=True);isos.append(dict(path=str(p),offset=start,old=old,new=w,part=i))
(a/'isolates.json').write_text(json.dumps(isos,indent=2))
def run(x):
 r=subprocess.run(['node','scripts/transcribe-elevenlabs.mjs',x['path']],capture_output=True,text=True);return dict(path=x['path'],code=r.returncode,output=r.stdout+r.stderr)
with ThreadPoolExecutor(max_workers=4) as pool:
 for r in pool.map(run,isos):print(json.dumps(r),flush=True)
