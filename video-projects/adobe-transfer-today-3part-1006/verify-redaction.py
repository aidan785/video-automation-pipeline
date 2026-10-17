import json
import subprocess
from pathlib import Path
import numpy as np

b = Path(__file__).parent
a = b / 'assets'
edl = json.loads((a / 'clean-v2.union-edl.json').read_text())
rows = []
out_start = 0
for k in edl['keep_ranges']:
    lo, hi = max(k['start'], 1635), min(k['end'], 1755)
    if hi > lo:
        # Probe every second plus both retained segment edges.
        for source_frame in sorted(set([round(lo*30), round(hi*30)-1] + list(range(round(lo*30), round(hi*30),30)))):
            frame = out_start + source_frame - round(k['start']*30)
            pixels = subprocess.check_output([
                'ffmpeg','-v','error','-ss',f'{max(0,frame/30-.001):.6f}',
                '-i',str(a/'clean-v2.mp4'),'-frames:v','1',
                '-vf','crop=1020:110:890:155,format=gray','-f','rawvideo','-'])
            arr = np.frombuffer(pixels,dtype=np.uint8)
            assert arr.size == 1020*110
            rows.append(dict(source_frame=source_frame,output_frame=frame,
                             mean=float(arr.mean()),std=float(arr.std()),
                             pass_check=bool(arr.std()<1.2 and arr.max()-arr.min()<12)))
    out_start += round((k['end']-k['start'])*30)
report=dict(result='PASS' if rows and all(r['pass_check'] for r in rows) else 'FAIL',
            samples=len(rows),source_interval=[1635,1755],
            opaque_box=dict(x=880,y=145,width=1040,height=130),checks=rows)
(a/'credential-redaction-qa.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
if report['result']!='PASS':raise SystemExit(1)
for source in [1650,1733,1743]:
    acc=0
    for k in edl['keep_ranges']:
        if k['start']<=source<k['end']:
            t=acc+source-k['start']
            subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(a/'clean-v2.mp4'),
                            '-frames:v','1','-vf','scale=1920:-1',str(b/f'frames/final-redaction-{source}.jpg')],check=True)
            break
        acc+=k['end']-k['start']
