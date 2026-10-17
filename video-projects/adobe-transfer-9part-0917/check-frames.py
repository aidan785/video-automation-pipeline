import json,subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image,ImageDraw
p=Path(__file__).resolve().parent;a=p/'assets';f=p/'frames';f.mkdir(exist_ok=True);e=json.loads((a/'clean-v2.union-edl.json').read_text());m=json.loads((p/'run-manifest.json').read_text());segments=[];cur=0
for k in e['keep_ranges']:
 n=round((k['end']-k['start'])*30);segments.append(dict(output_start=cur,output_end=cur+n,source_start=round(k['start']*30)));cur+=n
points=set([0,cur-1])
for i in range(0,len(segments),10):
 for d in [-1,0]:points.add(max(0,segments[i]['output_start']+d))
chapters=json.loads((a/'chapters.json').read_text())
for c in chapters[1:]:
 for d in [-1,0]:points.add(round(c['start']*30)+d)
def grab(path,n):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-threads','1','-ss',f'{max(0,n/30-.015):.6f}','-i',str(path),'-frames:v','1','-vf','scale=384:108:flags=area,format=gray','-f','rawvideo','-']),dtype=np.uint8).astype(float)
def check(n):
 s=next(s for s in segments if s['output_start']<=n<s['output_end']);src=s['source_start']+n-s['output_start'];part=next(x for x in m['source_order'] if x['frame_offset']<=src<x['frame_offset']+x['frames']);x=grab(part['path'],src-part['frame_offset']);y=grab(a/'clean-v2.mp4',n);mse=float(np.mean((x-y)**2));psnr=99 if mse==0 else float(10*np.log10(255**2/mse));return dict(output_frame=n,source_file=part['name'],source_frame=src-part['frame_offset'],psnr=psnr,pass_check=psnr>32)
with ThreadPoolExecutor(max_workers=3) as pool:rows=list(pool.map(check,sorted(points)))
report=dict(result='PASS' if all(r['pass_check'] for r in rows) else 'FAIL',samples=len(rows),details=rows);(a/'frame-checks.json').write_text(json.dumps(report,indent=2));print(report['result'],len(rows),'frame checks; minimum PSNR',min(x['psnr'] for x in rows),flush=True)
canvas=Image.new('RGB',(1440,9*227),(18,18,18));draw=ImageDraw.Draw(canvas)
for i,c in enumerate(chapters):
 t=c['start']+c['duration']*.4;out=f/f'clip-{i}.jpg';subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(a/'clean-v2.mp4'),'-frames:v','1','-vf','scale=1440:405',str(out)],check=True)
 im=Image.open(out).resize((1440,405));small=im.resize((720,203));canvas.paste(small,((i%2)*720,(i//2)*227+24));draw.text(((i%2)*720+8,(i//2)*227+6),c['source']+f' | final {t:.2f}s',fill='white')
canvas.crop((0,0,1440,5*227)).save(f/'final-contact-sheet.jpg')
assert report['result']=='PASS'
