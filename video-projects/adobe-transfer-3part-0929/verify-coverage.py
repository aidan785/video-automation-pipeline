import json,re,difflib
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';expected=json.loads((a/'expected-final-transcript.json').read_text())['words'];fresh=[w for w in json.loads((a/'final-video.json').read_text())['words'] if w['type']=='word']
def expand(words):
 out=[]
 for w in words:
  for x in re.sub(r'[^a-z0-9\s\']',' ',w['text'].lower()).split():out.append(dict(text=x,start=w['start'],end=w['end']))
 return out
x,y=expand(expected),expand(fresh);sm=difflib.SequenceMatcher(None,[w['text'] for w in x],[w['text'] for w in y],autojunk=False);matches=[];mismatches=[]
for tag,i,j,k,l in sm.get_opcodes():
 if tag=='equal':
  if j-i>=5:matches.append(dict(expected=x[i]['start'],actual=y[k]['start'],offset=round(y[k]['start']-x[i]['start'],3),words=j-i))
 else:mismatches.append(dict(time=round(x[min(i,len(x)-1)]['start'],2),expected=' '.join(w['text'] for w in x[i:j]),actual=' '.join(w['text'] for w in y[k:l])))
r=dict(matched_words=sum(block.size for block in sm.get_matching_blocks()),expected_tokens=len(x),fresh_tokens=len(y),alignment_ratio=sm.ratio(),matched_passages=matches,differences=mismatches);(a/'transcript-coverage.json').write_text(json.dumps(r,indent=2));print(json.dumps({k:v for k,v in r.items() if k!='matched_passages'},indent=2))
