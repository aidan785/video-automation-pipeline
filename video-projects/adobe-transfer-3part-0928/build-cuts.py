import json,re,html
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';m=json.loads((b/'run-manifest.json').read_text());sil=json.loads((a/'source.silence-edl.json').read_text());w=[w for w in json.loads((a/'source.json').read_text())['words'] if w['type']=='word']
def norm(s):return re.sub(r'[^a-z0-9\s\']','',s.lower().replace('-',' ')).split()
tokens=[];indices=[]
for i,x in enumerate(w):
 for tok in norm(x['text']):tokens.append(tok);indices.append(i)
def fmt(t):return f'{int(t//60):02d}:{t%60:05.2f}'
def mapped(t):return sum(max(0,min(t,k['end'])-k['start']) for k in sil['keep_ranges'])
cuts=[];errors=[]
for n,(near,remove,keep) in enumerate(json.loads((b/'edit-specs.json').read_text()),1):
 r=norm(remove);k=norm(keep);matches=[]
 for j in range(len(tokens)-len(r)-len(k)+1):
  if tokens[j:j+len(r)]==r and tokens[j+len(r):j+len(r)+len(k)]==k:matches.append(j)
 if not matches:errors.append((n,near,remove,keep));continue
 j=min(matches,key=lambda j:abs(w[indices[j]]['start']-near));i=indices[j];last=indices[j+len(r)-1];ki=indices[j+len(r)];kw=w[ki];prev=w[i-1] if i else None
 if abs(w[i]['start']-near)>20:errors.append(('DISTANCE',n,w[i]['start'],near));continue
 # Preserve a short safety margin for neighboring kept speech.
 start=max(prev['end'] if prev else 0,w[i]['start']-.04)
 end=max(w[last]['end'],kw['start']-.06)
 if end>=kw['start']:end=(w[last]['end']+kw['start'])/2
 source=next(s for s in reversed(m['source_order']) if s['offset']<=start)
 c=dict(id=n,source_start=round(start,3),source_end=round(end,3),start=round(mapped(start),3),end=round(mapped(end),3),removes=' '.join(x['text'] for x in w[i:last+1]),keeps=' '.join(x['text'] for x in w[ki:indices[j+len(r)+len(k)-1]+1]),source_file=source['name'],local_start=round(start-source['offset'],3),reason='Remove false start or repeated take; retain the completed wording.')
 cuts.append(c)
if errors:
 print('UNRESOLVED',json.dumps(errors,indent=2));raise SystemExit(1)
cuts.sort(key=lambda c:c['source_start'])
for i,c in enumerate(cuts):
 c['id']=i+1
 if i:assert c['source_start']>=cuts[i-1]['source_end'],('overlap',i)
(a/'proposed-cuts.json').write_text(json.dumps(dict(timeline='silence-edited seconds; source coordinates also supplied',status='proposed-awaiting-user-approval',cuts=cuts),indent=2))
removed=sum(c['end']-c['start'] for c in cuts);final=sil['edited_duration']-removed
print('CUTS',len(cuts),'ESTIMATE',final)
print('\n'.join(f'{c["id"]:02} {fmt(c["source_start"])} {c["removes"]} → {c["keeps"]}' for c in cuts))
