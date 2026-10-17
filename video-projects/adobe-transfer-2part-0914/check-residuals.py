import json,subprocess,re
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
b=Path(__file__).resolve().parent;a=b/'assets';rows=[]
for m in re.finditer(r'del ([\d.]+)-([\d.]+)',(a/'residual-silences-dry-run.txt').read_text()):
 s,e=map(float,m.groups());start=max(0,s-2);end=min(1372.133,e+2);p=a/f'residual-{round(s*100)}.mp3';subprocess.run(['ffmpeg','-y','-v','error','-ss',str(start),'-i',str(a/'source.wav'),'-t',str(end-start),'-ac','1','-ar','16000','-b:a','64k',str(p)],check=True);rows.append(dict(path=str(p),offset=start,proposed_start=s,proposed_end=e))
(a/'residual-isolates.json').write_text(json.dumps(rows,indent=2))
def run(x):
 r=subprocess.run(['node','scripts/transcribe-elevenlabs.mjs',x['path']],capture_output=True,text=True);return dict(path=x['path'],code=r.returncode,output=r.stdout+r.stderr)
with ThreadPoolExecutor(max_workers=4) as pool:
 for r in pool.map(run,rows):print(json.dumps(r),flush=True)
