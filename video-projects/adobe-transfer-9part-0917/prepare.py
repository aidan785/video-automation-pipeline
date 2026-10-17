import json,subprocess,concurrent.futures,wave
from pathlib import Path
p=Path(__file__).resolve().parent;a=p/'assets';m=json.loads((p/'run-manifest.json').read_text())
def one(s):
 name=Path(s['name']).stem
 subprocess.run(['ffmpeg','-y','-v','error','-i',s['path'],'-vn','-ac','2','-ar','48000',str(a/(name+'.wav'))],check=True)
 subprocess.run(['node','scripts/transcribe-elevenlabs.mjs',str(a/(name+'.wav')),'--output',str(a/(name+'.json')),'--no-diarize'],check=True)
 print('DONE',name,flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:list(pool.map(one,m['source_order']))
words=[]
with wave.open(str(a/'source.wav'),'wb') as dst:
 dst.setparams((2,2,48000,0,'NONE','not compressed'))
 for s in m['source_order']:
  name=Path(s['name']).stem
  with wave.open(str(a/(name+'.wav')),'rb') as src:
   data=src.readframes(src.getnframes());n=round(s['duration']*48000)*4;dst.writeframesraw(data[:n]+b'\0'*max(0,n-len(data)))
  t=json.loads((a/(name+'.json')).read_text())
  for w in t['words']:
   if w['type']=='word':words.append(dict(w,start=round(w['start']+s['offset'],6),end=round(w['end']+s['offset'],6),source=name))
(a/'source.json').write_text(json.dumps(dict(words=words,text=' '.join(w['text'] for w in words),audio_duration_secs=m['source_duration']),indent=2))
print('PREP COMPLETE',flush=True)
