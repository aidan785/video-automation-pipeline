"""Repair only ASR currency-token endpoints using fresh isolated rendered-audio evidence."""
import json,sys
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';filename=sys.argv[1] if len(sys.argv)>1 else 'clean-v1.json';t=json.loads((a/filename).read_text());repairs=[]
for name,anchor,off,suffix in [('eight',241.64,241.95,'eight'),('forty',262.96,263.25,'forty-tight'),('279',591.38,592.8,'279'),('six',599.06,599.4,'six')]:
 evidence=json.loads((a/f'suffix-{suffix}.json').read_text());sw=next(w for w in evidence['words'] if w['type']=='word');assert sw['text'].lower().strip('.,') in ['dollars','sense','cents']
 candidates=[w for w in t['words'] if w['type']=='word' and '$' in w['text'] and abs(w['start']-anchor)<.4]
 if not candidates:continue # Fresh ASR may expand the number into ordinary words.
 w=min(candidates,key=lambda x:abs(x['start']-anchor));end=round(off+sw['end'],3)
 if end>w['end']+.1:
  repairs.append(dict(text=w['text'],start=w['start'],original_end=w['end'],corrected_end=end,evidence=f'suffix-{suffix}.json',evidence_text=sw['text'],reason='Currency token included spoken suffix in text but excluded it from timing; isolated rendered audio supplies the missing endpoint.'));w['end']=end
out=filename.replace('.json','.verified.json');(a/out).write_text(json.dumps(t,indent=2));(a/'currency-timestamp-repairs.json').write_text(json.dumps(repairs,indent=2));print(json.dumps(repairs,indent=2))
