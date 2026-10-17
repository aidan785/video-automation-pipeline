from pathlib import Path
from PIL import Image,ImageDraw
import json,subprocess,sys
import numpy as np
from concurrent.futures import ThreadPoolExecutor
b=Path('video-projects/adobe-transfer-3part-0913');stem=sys.argv[1] if len(sys.argv)>1 else 'clean-v1';v=b/'assets'/f'{stem}.mp4';e=json.load(open(b/'assets'/f'{stem}.union-edl.json'));ks=e['keep_ranges'];jobs=[];t=0
for i,k in enumerate(ks):
 jobs.append({'i':i,'edited':t+min(.067,(k['end']-k['start'])/2),'source':k['start']+min(.067,(k['end']-k['start'])/2),'join':t});t+=k['end']-k['start']
def grab(path,time,out):
 subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{time:.9f}','-i',str(path),'-frames:v','1','-vf','scale=384:108',str(out)],check=True)
def shot(j):
 p=b/'frames'/f"{stem}-join-{j['i']:03}.jpg";grab(v,j['edited'],p)
 if j['i']%10==0 or j['i'] in [len(ks)-1]:
  orig=b/'frames'/f"{stem}-compare-{j['i']:03}.jpg";m=json.load(open(b/'run-manifest.json'));s=next(s for s in m['source_order'] if s['offset']<=j['source']<s['offset']+s['duration']);grab(s['path'],j['source']-s['offset'],orig)
  a=np.asarray(Image.open(p),dtype=float);c=np.asarray(Image.open(orig),dtype=float);j['pixel_mae']=float(np.abs(a-c).mean())
 return p
with ThreadPoolExecutor(max_workers=3) as ex:ps=list(ex.map(shot,jobs))
for k in range(0,len(ps),30):
 sub=ps[k:k+30];im=Image.new('RGB',(1920,132*((len(sub)+4)//5)), '#111');d=ImageDraw.Draw(im)
 for z,p in enumerate(sub):
  x=(z%5)*384;y=(z//5)*132;im.paste(Image.open(p),(x,y));j=jobs[k+z];d.text((x+5,y+111),f"Join {j['i']} edit {j['join']:.2f}s / src {j['source']:.2f}s",fill='white')
 im.save(b/'frames'/f'{stem}-joins-{k//30:02}.jpg')
(b/'assets'/f'{stem}.frame-checks.json').write_text(json.dumps(jobs,indent=2));print('Frames:',len(jobs),'source comparisons:',[(j['i'],round(j['pixel_mae'],2)) for j in jobs if 'pixel_mae'in j])
