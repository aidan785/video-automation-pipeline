import json
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';e=json.loads((a/'clean-v3.union-edl.json').read_text());cuts=json.loads((a/'approved-cuts.json').read_text())['cuts'];rows=[]
for i,c in enumerate(cuts,1):
 retained=sum(max(0,min(c['source_end'],k['end'])-max(c['source_start'],k['start'])) for k in e['keep_ranges']);rows.append(dict(id=i,removes=c['removes'],keeps=c['keeps'],remaining_overlap_seconds=retained,pass_check=retained<=1/30+1e-6))
expected=[];words=[w for w in json.loads((a/'source.json').read_text())['words'] if w['type']=='word'];offset=0
for k in e['keep_ranges']:
 for w in words:
  if k['start']<=(w['start']+w['end'])/2<k['end']:expected.append(dict(w,start=offset+max(0,w['start']-k['start']),end=offset+min(k['end']-k['start'],w['end']-k['start'])))
 offset+=k['end']-k['start']
(a/'expected-final-transcript.json').write_text(json.dumps(dict(words=expected,audio_duration_secs=e['edited_duration']),indent=2))
report=dict(result='PASS' if all(r['pass_check'] for r in rows) else 'FAIL',approved_cuts=len(rows),cuts_verified=sum(r['pass_check'] for r in rows),rounding_tolerance_seconds=1/30,details=rows);(a/'approved-cuts-audit.json').write_text(json.dumps(report,indent=2));print({k:v for k,v in report.items() if k!='details'})
