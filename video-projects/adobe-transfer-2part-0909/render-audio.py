import json, subprocess, wave
from pathlib import Path
import numpy as np
import sys
b=Path('video-projects/adobe-transfer-2part-0909/assets');stem=Path(sys.argv[1])
e=json.load(open(str(stem)+'.union-edl.json')); sr=48000
chunks=[]
for name,d in [('part1.mov',3805.6333333333333),('part2.mov',76.56666666666667)]:
 p=subprocess.run(['ffmpeg','-v','error','-i',str(b/name),'-vn','-ac','2','-ar',str(sr),'-f','s16le','pipe:1'],stdout=subprocess.PIPE,check=True)
 a=np.frombuffer(p.stdout,dtype='<i2').reshape(-1,2);n=round(d*sr)
 if len(a)<n:a=np.pad(a,((0,n-len(a)),(0,0)))
 else:a=a[:n]
 chunks.append(a)
source=np.concatenate(chunks)
with wave.open(str(stem)+'.wav','wb') as f:
 f.setparams((2,2,sr,0,'NONE','not compressed'))
 for k in e['keep_ranges']:
  a=source[round(k['start']*sr):round(k['end']*sr)].copy();n=min(round(.004*sr),len(a)//2)
  a[:n]=(a[:n].astype(float)*np.linspace(0,1,n)[:,None]).astype('<i2');a[-n:]=(a[-n:].astype(float)*np.linspace(1,0,n)[:,None]).astype('<i2');f.writeframesraw(a.tobytes())
print('Audio samples',round(e['edited_duration']*sr),'seconds',e['edited_duration'],flush=True)
