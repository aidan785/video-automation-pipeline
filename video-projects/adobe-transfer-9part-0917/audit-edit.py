import json,wave
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent;a=p/'assets';e=json.loads((a/'clean-v2.union-edl.json').read_text());m=json.loads((p/'run-manifest.json').read_text());cuts=json.loads((a/'approved-cuts.json').read_text())['cuts'];w=json.loads((a/'source.json').read_text())['words']
def overlap(lo,hi):return sum(max(0,min(hi,k['end'])-max(lo,k['start'])) for k in e['keep_ranges'])
rows=[]
for c in cuts:
 # Exact word centers must be absent; edge audio padding can be rounded by one frame.
 survives=[x['text'] for x in w[c['first']:c['last']+1] if overlap((x['start']+x['end'])/2-.001,(x['start']+x['end'])/2+.001)>.001]
 rows.append(dict(first=c['first'],last=c['last'],removed=c['removes'],surviving_centers=survives,pass_check=not survives))
assert all(x['pass_check'] for x in rows),[x for x in rows if not x['pass_check']]
order=[];t=0;chapters=[]
for s in m['source_order']:
 duration=overlap(s['offset'],s['offset']+s['duration']);order.append(s['name']);chapters.append(dict(source=s['name'],start=t,duration=duration));t+=duration
assert order==['intro.mov']+[f'{i}.mov' for i in range(1,9)]
with wave.open(str(a/'clean-v2.wav'),'rb') as f:x=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2')
report=dict(result='PASS',approved_cut_count=len(cuts),manual_syllable_cuts=1,source_order=order,chapters=chapters,cut_audit=rows,audio_peak_dbfs=float(20*np.log10(np.max(np.abs(x.astype(float)))/32768)),full_scale_samples=int(np.count_nonzero(np.abs(x.astype(float))>=32767)))
(a/'editorial-audit.json').write_text(json.dumps(report,indent=2));(a/'chapters.json').write_text(json.dumps(chapters,indent=2));print('PASS: all',len(cuts),'editorial cuts removed, source order verified, audio peak',round(report['audio_peak_dbfs'],2),'dBFS')
