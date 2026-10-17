import json,sys,subprocess,wave
from pathlib import Path
import numpy as np
b=Path(__file__).resolve().parent;a=b/'assets';version=sys.argv[1] if len(sys.argv)>1 else 'v1';stem=a/f'clean-{version}'
m=json.loads((b/'run-manifest.json').read_text());offset=0
for i,s in enumerate(m['source_order'],1):
 probe=json.loads((a/'source.probe.json').read_text());v=next(v for v in probe['streams'] if v['codec_type']=='video');s.update(offset=offset/30,duration=int(v['nb_frames'])/30,frame_offset=offset,frames=int(v['nb_frames']));offset+=s['frames']
dur=offset/30;m['source_duration']=dur;(b/'run-manifest.json').write_text(json.dumps(m,indent=2))
sil=json.loads((a/'source.silence-edl.json').read_text());cuts=json.loads((a/('silence-only-cuts.json' if version.startswith('silences') else 'approved-cuts.json')).read_text())['cuts']
dels=[dict(start=x['start'],end=x['end']) for x in sil['delete_ranges']]+[dict(start=x['source_start'],end=x['source_end']) for x in cuts]
for name in ['residual-cuts.json',f'refinements-{version}.json']:
 if (a/name).exists():dels+=json.loads((a/name).read_text())
merged=[]
for d in sorted(dels,key=lambda r:r['start']):
 if merged and d['start']<=merged[-1]['end']:merged[-1]['end']=max(merged[-1]['end'],d['end'])
 else:merged.append(dict(start=d['start'],end=d['end']))
keep=[];cursor=0
for d in merged:
 if d['start']>cursor:keep.append(dict(start=cursor,end=d['start']))
 cursor=max(cursor,d['end'])
if cursor<dur:keep.append(dict(start=cursor,end=dur))
words=[w for w in json.loads((a/'source.json').read_text())['words'] if w['type']=='word'];ks=[];slivers=[]
for k in keep:
 for s in m['source_order']:
  lo=max(round(k['start']*30),s['frame_offset']);hi=min(round(k['end']*30),s['frame_offset']+s['frames'])
  if hi<=lo:continue
  if hi-lo<9 and not any(lo/30<(w['start']+w['end'])/2<hi/30 for w in words):slivers.append(dict(start=lo/30,end=hi/30,reason='short silent remnant between approved cuts'));continue
  ks.append(dict(start=lo/30,end=hi/30))
keep=ks;deletes=[];cursor=0
for k in keep:
 if k['start']>cursor:deletes.append(dict(start=cursor,end=k['start']))
 cursor=k['end']
if cursor<dur:deletes.append(dict(start=cursor,end=dur))
outframes=sum(round((k['end']-k['start'])*30) for k in keep);outdur=outframes/30
e=dict(source_duration=dur,edited_duration=outdur,removed=dur-outdur,keep_ranges=keep,delete_ranges=deletes,render=dict(fps=30,audio_fade_ms=4,expected_frames=outframes,selection='integer source frame indices'),dropped_silent_slivers=slivers)
Path(str(stem)+'.union-edl.json').write_text(json.dumps(e,indent=2));print(dict(version=version,keeps=len(keep),seconds=outdur,frames=outframes,slivers=slivers),flush=True)
if '--plan' in sys.argv:sys.exit()
# Decode each source on its own timeline and pad its short AAC tail to its exact video duration.
arrays=[]
for s in m['source_order']:
 p=a/(s['name']+'.aligned.wav')
 if not p.exists():subprocess.run(['ffmpeg','-y','-v','error','-i',str(a/s['name']),'-vn','-af',f'aresample=48000:async=1:first_pts=0,apad,atrim=end_sample={s["frames"]*1600}','-ac','2','-c:a','pcm_s16le',str(p)],check=True)
 with wave.open(str(p),'rb') as f:arr=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').reshape(-1,2)
 assert len(arr)==s['frames']*1600,(s['name'],len(arr));arrays.append(arr)
source=np.concatenate(arrays)
with wave.open(str(stem)+'.wav','wb') as f:
 f.setparams((2,2,48000,0,'NONE','not compressed'))
 for k in keep:
  chunk=source[round(k['start']*30)*1600:round(k['end']*30)*1600].copy();n=min(192,len(chunk)//2)
  chunk[:n]=(chunk[:n].astype(float)*np.linspace(0,1,n)[:,None]).astype('<i2');chunk[-n:]=(chunk[-n:].astype(float)*np.linspace(1,0,n)[:,None]).astype('<i2');f.writeframesraw(chunk.tobytes())
if '--audio-only' in sys.argv:sys.exit()
# Decode each original once. Integer frame selection avoids concat inpoint rounding losses.
def balanced(xs):
 if len(xs)==1:return xs[0]
 mid=len(xs)//2;return '('+balanced(xs[:mid])+'+'+balanced(xs[mid:])+')'
filters=[];inputs=[]
for i,s in enumerate(m['source_order']):
 inputs+=['-i',str(a/s['name'])];ranges=[]
 for k in keep:
  lo=max(round(k['start']*30),s['frame_offset']);hi=min(round(k['end']*30),s['frame_offset']+s['frames'])
  if hi>lo:ranges.append(f'between(n,{lo-s["frame_offset"]},{hi-s["frame_offset"]-1})')
 filters.append(f'[{i}:v]select=\''+balanced(ranges)+f"',setpts=N/(30*TB)[v{i}]")
filters.append(''.join(f'[v{i}]' for i in range(len(m['source_order'])))+f'concat=n={len(m["source_order"])}:v=1:a=0[v]');Path(str(stem)+'.filter.txt').write_text(';\n'.join(filters))
with open(str(stem)+'.render.log','w') as log:
 subprocess.run(['ffmpeg','-y','-hide_banner',*inputs,'-i',str(stem)+'.wav','-/filter_complex',str(stem)+'.filter.txt','-map','[v]','-map',f'{len(m["source_order"])}:a:0','-c:v','libx264','-threads','8','-preset','fast','-crf','18','-pix_fmt','yuv420p','-r','30','-g','30','-keyint_min','30','-sc_threshold','0','-c:a','aac','-b:a','192k','-movflags','+faststart','-progress',str(stem)+'.progress.txt',str(stem)+'.mp4'],stdout=log,stderr=log,check=True)
print('RENDER COMPLETE',str(stem)+'.mp4',flush=True)
