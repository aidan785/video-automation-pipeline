import json,sys,subprocess,wave,math
from pathlib import Path
import numpy as np
b=Path(__file__).parent;a=b/'assets';version=sys.argv[1] if len(sys.argv)>1 else 'v1';stem=a/f'clean-{version}'
m=json.loads((b/'run-manifest.json').read_text());dur=m['source_duration']
sil=json.loads((a/'source.silence-edl.json').read_text());cuts=json.loads((a/'approved-cuts.json').read_text())['cuts']
dels=[dict(start=x['start'],end=x['end']) for x in sil['delete_ranges']]+[dict(start=x['source_start'],end=x['source_end']) for x in cuts]
if (a/'residual-cuts.json').exists():dels+=json.loads((a/'residual-cuts.json').read_text())
if (a/f'refinements-{version}.json').exists():dels+=json.loads((a/f'refinements-{version}.json').read_text())
dels=sorted(dels,key=lambda r:r['start']);merged=[]
for d in dels:
 if merged and d['start']<=merged[-1]['end']:merged[-1]['end']=max(merged[-1]['end'],d['end'])
 else:merged.append(dict(start=d['start'],end=d['end']))
keep=[];cursor=0
for d in merged:
 if d['start']>cursor:keep.append(dict(start=cursor,end=d['start']))
 cursor=max(cursor,d['end'])
if cursor<dur:keep.append(dict(start=cursor,end=dur))
# Split at source file boundaries; align the final plan to source frames.
ks=[]
for k in keep:
 for s in m['source_order']:
  lo=max(k['start'],s['offset']);hi=min(k['end'],s['offset']+s['duration'])
  lo=round(lo*30)/30;hi=round(hi*30)/30
  if hi>lo:ks.append(dict(start=lo,end=hi))
keep=ks;deletes=[];cursor=0
for k in keep:
 if k['start']>cursor:deletes.append(dict(start=cursor,end=k['start']))
 cursor=k['end']
if cursor<dur:deletes.append(dict(start=cursor,end=dur))
outdur=sum(k['end']-k['start'] for k in keep)
e=dict(source_duration=dur,edited_duration=outdur,removed=dur-outdur,keep_ranges=keep,delete_ranges=deletes,render=dict(fps=30,audio_fade_ms=4))
Path(str(stem)+'.union-edl.json').write_text(json.dumps(e,indent=2));print(dict(version=version,keeps=len(keep),seconds=outdur),flush=True)
if '--plan' in sys.argv:sys.exit()
with wave.open(str(a/'source.wav'),'rb') as f:source=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').reshape(-1,2)
with wave.open(str(stem)+'.wav','wb') as f:
 f.setparams((2,2,48000,0,'NONE','not compressed'))
 for k in keep:
  chunk=source[round(k['start']*48000):round(k['end']*48000)].copy();n=min(192,len(chunk)//2)
  chunk[:n]=(chunk[:n].astype(float)*np.linspace(0,1,n)[:,None]).astype('<i2');chunk[-n:]=(chunk[-n:].astype(float)*np.linspace(1,0,n)[:,None]).astype('<i2');f.writeframesraw(chunk.tobytes())
if '--audio-only' in sys.argv:sys.exit()
concat=['ffconcat version 1.0']
for k in keep:
 s=next(s for s in m['source_order'] if s['offset']-1e-6<=k['start']<s['offset']+s['duration']-1e-6)
 concat+=['file '+s['name'],'inpoint '+str(k['start']-s['offset']),'outpoint '+str(k['end']-s['offset']),'duration '+str(k['end']-k['start'])]
Path(str(stem)+'.segments.ffconcat').write_text('\n'.join(concat)+'\n')
with open(str(stem)+'.render.log','w') as log:
 subprocess.run(['ffmpeg','-y','-hide_banner','-copyts','-segment_time_metadata','1','-i',str(stem)+'.segments.ffconcat','-i',str(stem)+'.wav','-map','0:v:0','-map','1:a:0','-vf','select=concatdec_select,setpts=N/(30*TB)','-c:v','libx264','-threads','8','-preset','fast','-crf','18','-pix_fmt','yuv420p','-g','30','-keyint_min','30','-sc_threshold','0','-c:a','aac','-b:a','192k','-movflags','+faststart','-progress',str(stem)+'.progress.txt',str(stem)+'.mp4'],stdout=log,stderr=log,check=True)
print('RENDER COMPLETE',str(stem)+'.mp4',flush=True)
