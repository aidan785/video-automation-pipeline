import json,sys,subprocess,wave,concurrent.futures,os
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent;a=p/'assets';ver=sys.argv[1] if len(sys.argv)>1 else 'v1';stem=a/f'clean-{ver}'
m=json.loads((p/'run-manifest.json').read_text());off=0
for s in m['source_order']:
 v=next(x for x in json.loads((a/(Path(s['name']).stem+'.probe.json')).read_text())['streams'] if x['codec_type']=='video');s.update(frame_offset=off,frames=int(v['nb_frames']),offset=off/30,duration=int(v['nb_frames'])/30);off+=s['frames']
m['source_duration']=off/30;(p/'run-manifest.json').write_text(json.dumps(m,indent=2));dur=off/30
sil=json.loads((a/'source.silence-edl.json').read_text());cuts=json.loads((a/'approved-cuts.json').read_text())['cuts']
dels=[dict(start=x['start'],end=x['end']) for x in sil['delete_ranges']]+[dict(start=x['source_start'],end=x['source_end']) for x in cuts]
dels += [dict(start=578.70,end=579.33)] # isolated transcription: inter- false start before intricate
for name in ['residual-cuts.json',f'refinements-{ver}.json']:
 if (a/name).exists():dels+=json.loads((a/name).read_text())
merged=[]
for d in sorted(dels,key=lambda x:x['start']):
 if merged and d['start']<=merged[-1]['end']:merged[-1]['end']=max(merged[-1]['end'],d['end'])
 else:merged.append(d.copy())
keep=[];cur=0
for d in merged:
 if d['start']>cur:keep.append(dict(start=cur,end=d['start']))
 cur=max(cur,d['end'])
if cur<dur:keep.append(dict(start=cur,end=dur))
w=json.loads((a/'source.json').read_text())['words'];ks=[]
for k in keep:
 for s in m['source_order']:
  lo=max(round(k['start']*30),s['frame_offset']);hi=min(round(k['end']*30),s['frame_offset']+s['frames'])
  if hi>lo and (hi-lo>=9 or any(lo/30<(x['start']+x['end'])/2<hi/30 for x in w)):ks.append(dict(start=lo/30,end=hi/30))
keep=ks;ds=[];cur=0
for k in keep:
 if k['start']>cur:ds.append(dict(start=cur,end=k['start']))
 cur=k['end']
if cur<dur:ds.append(dict(start=cur,end=dur))
frames=sum(round((k['end']-k['start'])*30) for k in keep);e=dict(source_duration=dur,edited_duration=frames/30,removed=dur-frames/30,keep_ranges=keep,delete_ranges=ds,render=dict(fps=30,expected_frames=frames,audio_fade_ms=4))
Path(str(stem)+'.union-edl.json').write_text(json.dumps(e,indent=2));print('PLAN',frames/30,'seconds;',len(keep),'segments',flush=True)
if '--plan' in sys.argv:sys.exit()
with wave.open(str(a/'source.wav'),'rb') as f:source=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').reshape(-1,2)
with wave.open(str(stem)+'.wav','wb') as f:
 f.setparams((2,2,48000,0,'NONE','not compressed'))
 for k in keep:
  chunk=source[round(k['start']*30)*1600:round(k['end']*30)*1600].copy();n=min(192,len(chunk)//2)
  chunk[:n]=(chunk[:n].astype(float)*np.linspace(0,1,n)[:,None]).astype('<i2');chunk[-n:]=(chunk[-n:].astype(float)*np.linspace(1,0,n)[:,None]).astype('<i2');f.writeframesraw(chunk.tobytes())
print('AUDIO READY',flush=True)
if '--audio-only' in sys.argv:sys.exit()
def balanced(xs):
 if len(xs)==1:return xs[0]
 mid=len(xs)//2;return '('+balanced(xs[:mid])+'+'+balanced(xs[mid:])+')'
def render(s):
 name=Path(s['name']).stem;out=a/f'{ver}-{name}-video.mp4';terms=[]
 for k in keep:
  lo=max(round(k['start']*30),s['frame_offset']);hi=min(round(k['end']*30),s['frame_offset']+s['frames'])
  if hi>lo:terms.append(f'between(n,{lo-s["frame_offset"]},{hi-s["frame_offset"]-1})')
 filt="select='"+balanced(terms)+"',setpts=N/(30*TB)";(a/f'{ver}-{name}-filter.txt').write_text(filt)
 previous=a/f'v1-{name}-video.mp4';previous_filter=a/f'v1-{name}-filter.txt'
 if ver!='v1' and previous.exists() and previous_filter.exists() and previous_filter.read_text()==filt:
  if not out.exists():os.link(previous,out)
  print('REUSE VERIFIED FRAME SELECTION',name,flush=True);return
 with (a/f'{ver}-{name}-render.log').open('w') as log:
  subprocess.run(['ffmpeg','-y','-hide_banner','-threads','2','-i',s['path'],'-an','-/filter:v',str(a/f'{ver}-{name}-filter.txt'),'-c:v','libx264','-threads','4','-preset','fast','-crf','18','-pix_fmt','yuv420p','-r','30','-g','30','-keyint_min','30','-sc_threshold','0','-progress',str(a/f'{ver}-{name}-progress.txt'),str(out)],stdout=log,stderr=log,check=True)
 print('VIDEO PART DONE',name,flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(render,m['source_order']))
lst=a/f'{ver}-video-concat.txt';lst.write_text('\n'.join("file '"+ver+'-'+Path(s['name']).stem+"-video.mp4'" for s in m['source_order'])+'\n')
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(lst),'-i',str(stem)+'.wav','-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',str(stem)+'.mp4'],check=True)
print('FINAL RENDER DONE',str(stem)+'.mp4',flush=True)
