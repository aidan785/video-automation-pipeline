import json,shutil
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';shutil.copy2(a/'source.json',a/'source.pre-verification.json');shutil.copy2(a/'source.silence-edl.json',a/'source.silence-edl-v1.json');t=json.loads((a/'source.json').read_text())
repairs=[(2709,2709.1,2712.9,.1,3.9),(3608,3612.2,3613.6,4.2,5.6),(3686,3687.89,3689.87,1.89,3.87),(3686,3694.25,3695.17,8.25,9.17)]
for off,lo,hi,ilo,ihi in repairs:
 iso=json.loads((a/f'isolate-{off}.json').read_text());t['words']=[w for w in t['words'] if not(lo<=w['start']<=hi)]+[dict(w,start=round(w['start']+off,3),end=round(w['end']+off,3)) for w in iso['words'] if w['type']=='word' and ilo<=w['start']<=ihi]
t['words'].sort(key=lambda w:(w['start'],w['end']));t['text']=' '.join(w['text'] for w in t['words'] if w['type']=='word');(a/'source.json').write_text(json.dumps(t,indent=2))
r=[dict(start=2708.92,end=2709.62,reason='Residual abandoned and I am gonna within approved cut 55; retain completed and I am gonna create a tab.',evidence='isolate-2709.json'),dict(start=3612.18,end=3613.24,reason='Hidden is more restart; retain second is more vanilla buildings.',evidence='isolate-3608.json'),dict(start=3687.86,end=3689.04,reason='Hidden it helps me out a to restart; retain complete it helps me out a ton.',evidence='isolate-3686.json'),dict(start=3694.22,end=3694.98,reason='Doubled Thanks; retain thanks for sticking to the end.',evidence='isolate-3686.json')]
(a/'refinements-v2.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
