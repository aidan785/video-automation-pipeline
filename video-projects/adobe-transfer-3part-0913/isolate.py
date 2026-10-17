import json,wave,subprocess,concurrent.futures
from pathlib import Path
b=Path('video-projects/adobe-transfer-3part-0913/assets')
windows=[(122,130),(170,180),(289,296),(346,354),(391,398),(563,569),(594,613),(628,650),(713,724),(889,899),(1000,1009)]
def run(pair):
 s,e=pair;p=b/f'isolate-{s}.wav'
 with wave.open(str(b/'source.wav'),'rb') as f:
  f.setpos(s*48000);data=f.readframes((e-s)*48000)
 with wave.open(str(p),'wb') as f:f.setparams((2,2,48000,0,'NONE','not compressed'));f.writeframes(data)
 r=subprocess.run(['node','scripts/transcribe-elevenlabs.mjs',str(p)],capture_output=True,text=True)
 return s,r.returncode,r.stdout,r.stderr
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for x in pool.map(run,windows):print(x,flush=True)
