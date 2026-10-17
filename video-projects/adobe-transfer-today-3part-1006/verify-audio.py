import json
import subprocess
import wave
from pathlib import Path
import numpy as np

a = Path(__file__).parent / 'assets'
p = subprocess.Popen(['ffmpeg','-v','error','-i',str(a/'clean-v2.mp4'),
                      '-vn','-ar','48000','-ac','2','-f','s16le','-'],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
rows=[]
pos=0
with wave.open(str(a/'clean-v2.wav'),'rb') as f:
    while True:
        expected=f.readframes(48000*5)
        if not expected:break
        actual=p.stdout.read(len(expected))
        assert len(actual)==len(expected),(pos,len(actual),len(expected))
        x=np.frombuffer(expected,dtype='<i2').astype(float)
        y=np.frombuffer(actual,dtype='<i2').astype(float)
        corr=float(np.dot(x,y)/(np.linalg.norm(x)*np.linalg.norm(y))) if np.linalg.norm(x)>1 else 1.0
        rows.append(dict(start_seconds=pos/48000,correlation=corr,pass_check=corr>.97))
        pos+=len(expected)//4
    tail=p.stdout.read()
stderr=p.stderr.read().decode()
assert p.wait()==0,stderr
report=dict(result='PASS' if all(x['pass_check'] for x in rows) else 'FAIL',
            checked_samples_per_channel=pos,windows=len(rows),
            minimum_correlation=min(x['correlation'] for x in rows),
            decoder_padding_samples=len(tail)//4,checks=rows)
(a/'audio-integrity.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
if report['result']!='PASS':raise SystemExit(1)
