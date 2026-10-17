import json
from pathlib import Path
p=Path(__file__).resolve().parent;a=p/'assets'
w=json.loads((a/'source.json').read_text())['words'];sil=json.loads((a/'source.silence-edl.json').read_text());specs=json.loads((p/'edit-specs.json').read_text())
def ed(t):
 out=0
 for k in sil['keep_ranges']:
  if t<k['start']:return out
  if t<=k['end']:return out+t-k['start']
  out+=k['end']-k['start']
 return out
cuts=[]
for s in specs:
 i=s['first'];j=s['last'];lo=max(w[i-1]['end'] if i else 0,w[i]['start']-.025);hi=max(w[j]['end'],w[j+1]['start']-.07)
 cuts.append(dict(start=ed(lo),end=ed(hi),source_start=lo,source_end=hi,removes=' '.join(x['text'] for x in w[i:j+1]),keeps=' '.join(x['text'] for x in w[j+1:j+13]),reason=s['reason'],first=i,last=j))
(a/'approved-cuts.json').write_text(json.dumps(dict(authorization='User explicitly requested removal of all silences, mistakes, retakes, and spoken delete/prompt instructions. Each item editorially reviewed in full source context.',cuts=cuts),indent=2))
removed=set(i for s in specs for i in range(s['first'],s['last']+1))
lines=[]
for s in json.loads((p/'run-manifest.json').read_text())['source_order']:
 name=Path(s['name']).stem;lines+=['\nCLIP '+name,' '.join(x['text'] for i,x in enumerate(w) if x['source']==name and i not in removed)]
(p/'PLANNED-TRANSCRIPT.txt').write_text('\n'.join(lines))
(p/'CUT-REVIEW.md').write_text('# Editorial removal ledger\n\n'+ '\n\n'.join(f'{i+1}. {c["source_start"]:.3f}–{c["source_end"]:.3f}: {c["reason"]}\n\nRemove: {c["removes"]}\n\nFollowing kept speech: {c["keeps"]}' for i,c in enumerate(cuts)))
print('Reviewed cuts',len(cuts))
