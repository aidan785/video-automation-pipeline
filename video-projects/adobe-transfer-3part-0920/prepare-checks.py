import json,re
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';e=json.loads((a/'expected-final-transcript.json').read_text());cuts=json.loads((a/'approved-cuts.json').read_text())['cuts']
def tokens(s):return [re.sub(r'[^\w\']','',x.lower()) for x in s.split() if re.sub(r'[^\w\']','',x.lower())]
t=tokens(' '.join(w['text'] for w in e['words']))
def count(p):
 p=tokens(p);return sum(t[i:i+len(p)]==p for i in range(len(t)-len(p)+1))
checks=[]
for c in cuts:
 for role in ['removes','keeps']:
  p=c[role]
  if role=='keeps' and c['id']==10:p='Creating your assets and your'
  if role=='keeps' and c['id']==55:p='create a tab inside of the original game' 
  if len(tokens(p))>=4:checks.append({"phrase":p,"expect":count(p),"from":f'cut {c["id"]} {role}'})
checks.extend([{'phrase':'it helps me out a ton','expect':1},{'phrase':'thanks for sticking to the end','expect':1},{'phrase':'is more is more','expect':0}])
checks.append({'phrase':'delete that','expect':0,'from':'spoken editing instruction'})
(a/'verify-phrases.json').write_text(json.dumps(checks,indent=2));print(len(checks),'phrase checks')
