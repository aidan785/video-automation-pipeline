import json
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';t=json.loads((a/'source.orig.json').read_text())
for name,offset,lo,hi in [('open',1983,1985,1994),('so',2081,2083,2095.5)]:
 iso=json.loads((a/f'isolate-{name}.json').read_text());new=[dict(w,start=round(w['start']+offset,5),end=round(w['end']+offset,5),source_part=2) for w in iso['words'] if w['type']=='word']
 t['words']=[w for w in t['words'] if not(lo<=w['start']<hi)]+new
for w in t['words']:
 if w['text']=='myself.' and 1681<w['start']<1682:w['end']=1681.58
t['words'].sort(key=lambda w:(w['start'],w['end']));t['text']=' '.join(w['text'] for w in t['words'] if w['type']=='word');(a/'source.json').write_text(json.dumps(t,indent=2))
