import json,subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import numpy as np
b=Path(__file__).resolve().parent;a=b/'assets';f=b/'frames';f.mkdir(exist_ok=True);e=json.loads((a/'clean-v2.union-edl.json').read_text());m=json.loads((b/'run-manifest.json').read_text());segments=[];cur=0
for k in e['keep_ranges']:
 n=round((k['end']-k['start'])*30);segments.append(dict(output_start=cur,output_end=cur+n,source_start=round(k['start']*30)));cur+=n
points=sorted(set([0,30,cur-1]+[max(0,segments[i]['output_start']+delta) for i in [10,25,40,55,70,85,100,115,130,145,160,175,190] for delta in [-1,0]]))
# Always cover both sides of each source-file boundary and verification repair.
for part in m['source_order'][1:]:
 seg=next(s for s in segments if s['source_start']>=part['frame_offset'])
 points.extend([seg['output_start']-1,seg['output_start']])
for repair in json.loads((a/'refinements-v2.json').read_text()):
 following=next((s for s in segments if s['source_start']/30>=repair['end']-.02),None)
 if following:points.extend([following['output_start']-1,following['output_start']])
points=sorted(set(n for n in points if 0<=n<cur))
def grab(path,n):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',f'{max(0,n/30-.001):.6f}','-i',str(path),'-frames:v','1','-vf','scale=384:108:flags=area,format=gray','-f','rawvideo','-']),dtype=np.uint8).astype(float)
def check(n):
 s=next(s for s in segments if s['output_start']<=n<s['output_end']);src=s['source_start']+n-s['output_start'];part=next(p for p in m['source_order'] if p['frame_offset']<=src<p['frame_offset']+p['frames']);x=grab(a/part['name'],src-part['frame_offset']);y=grab(a/'clean-v2.mp4',n);mse=float(np.mean((x-y)**2));psnr=99 if mse==0 else float(10*np.log10(255**2/mse));return dict(output_frame=n,source_file=part['name'],source_frame=src-part['frame_offset'],psnr=psnr,pass_check=psnr>32)
with ThreadPoolExecutor(max_workers=3) as pool:rows=list(pool.map(check,points))
report=dict(result='PASS' if all(r['pass_check'] for r in rows) else 'FAIL',samples=len(rows),details=rows);(a/'frame-checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
# Full-size visual spot checks: beginning, typical middle, both sides of the file join, ending.
for n in [30,round(cur*.25),round(cur*.5),round(cur*.75),cur-2]:subprocess.run(['ffmpeg','-y','-v','error','-ss',f'{max(0,n/30-.001):.6f}','-i',str(a/'clean-v2.mp4'),'-frames:v','1','-vf','scale=1920:-1',str(f/f'final-{n}.jpg')],check=True)
