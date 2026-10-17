import json,re
from pathlib import Path
b=Path(__file__).parent;a=b/'assets'
t=json.loads((a/'source.orig.json').read_text())
repairs=[('custom',2714,2716.3,2719.43,2.30,5.41),('modern',3622,3624,3628.17,1.99,6.43)]
for name,off,lo,hi,s,e in repairs:
 iso=json.loads((a/f'isolate-{name}.json').read_text())
 t['words']=[w for w in t['words'] if not(lo<=w['start']<=hi)]+[dict(w,start=w['start']+off,end=w['end']+off,source_part=2 if name=='custom' else 3) for w in iso['words'] if w['type']=='word' and s<=w['start']<=e]
t['words'].sort(key=lambda w:(w['start'],w['end']));t['text']=' '.join(w['text'] for w in t['words'] if w['type']=='word');(a/'source.json').write_text(json.dumps(t,indent=2));(a/'transcript-repairs.json').write_text(json.dumps(repairs,indent=2))
