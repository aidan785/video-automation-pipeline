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
 if n==27:c['reason']='Honor the spoken delete-that instruction; remove abandoned connection explanation and editing instruction.'
 if n==57:c['reason']='Remove isolated unrelated line between walkthrough sections.'
 cuts.append(c)
if errors:
 print('UNRESOLVED',json.dumps(errors,indent=2));raise SystemExit(1)
cuts.sort(key=lambda c:c['source_start'])
for i,c in enumerate(cuts):
 c['id']=i+1
 if i:assert c['source_start']>=cuts[i-1]['source_end'],('overlap',i)
(a/'proposed-cuts.json').write_text(json.dumps(dict(timeline='silence-edited seconds; source coordinates also supplied',status='proposed-awaiting-user-approval',cuts=cuts),indent=2))
removed=sum(c['end']-c['start'] for c in cuts);final=sil['edited_duration']-removed
md=['# Unreal Engine / Aura tutorial — cut review','',f'**Order: 1.mov → 2.mov → 3.mov.** Original: {fmt(m["source_duration"])}. Silence-only plan: {fmt(sil["edited_duration"])}.','',f'**Recommendation: apply all {len(cuts)} cuts below.** Estimated finished length: **{fmt(final)}**. These remove {removed:.1f} seconds of restarts, duplicate takes, and editing chatter after silence trimming. Final timing is subject to render verification.','', 'The source layout is 3840×1080 at 30 fps, with the desktop on the left and camera on the right. All three game examples, Aura setup and pricing discussion, city-building walkthrough, custom building demonstration, final city-block reveal, and outro remain.','', 'Natural phrasing and filler are preserved unless they form an abandoned take. “This. This is Minecraft” is a valid sentence transition, so the detector’s suggestion to remove it was rejected. The broad automatic retake suggestion that would remove the Aura introduction was also rejected in favor of the specific restarts below.','', 'Two words stretched across pauses (“custom” and “modern”) concealed restarts. Both were re-transcribed from isolated original audio and repaired before cut planning.','', '| # | Original clip / time | Remove | Keep immediately after |','|---|---|---|---|']
rows=[]
for c in cuts:
 md.append(f'| {c["id"]} | {c["source_file"].replace("part","")} · {fmt(c["local_start"])} | {c["removes"]} | {c["keeps"]} |')
 rows.append(f'<tr><td>{c["id"]}</td><td><button data-src="assets/{c["source_file"]}" data-t="{max(0,c["local_start"]-1.5)}">{c["source_file"].replace("part","")} · {fmt(c["local_start"])}</button></td><td>{html.escape(c["removes"])}</td><td>{html.escape(c["keeps"])}</td></tr>')
md+=['','## Status','','Transcription, source read, stretched-token audio checks, silence planning and editorial cut review are complete. Mistake cuts are proposed, not applied. After approval: render from original footage, freshly transcribe the render, read it for residual retakes, and complete silence, cuts and ledger verification.']
(b/'CUT-REVIEW.md').write_text('\n'.join(md)+'\n')
(b/'review.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unreal Engine tutorial — cut review</title><style>body{background:#10151d;color:#e6edf7;font:16px/1.5 system-ui;max-width:1320px;margin:28px auto;padding:0 24px}video{width:100%;position:sticky;top:0;max-height:42vh;background:#000}table{border-collapse:collapse;width:100%}td,th{padding:12px;border-bottom:1px solid #344050;text-align:left;vertical-align:top}td:nth-child(2){min-width:150px}button,a{color:#99cfff}button{background:#223349;border:1px solid #527093;border-radius:5px;padding:6px;cursor:pointer}h1{font-size:28px}.sub{color:#abbacd}</style><h1>Unreal Engine / Aura tutorial — cut review</h1>'''+f'<p class="sub">1.mov → 2.mov → 3.mov · {len(cuts)} proposed cuts · {fmt(m["source_duration"])} original → approximately {fmt(final)} edited</p>'+'''<p>Click a timestamp to play the original clip with context. <a href="CUT-REVIEW.md">Written cut list</a></p><video id="v" src="assets/part1.mov" controls preload="metadata"></video><table><thead><tr><th>#</th><th>Original clip / time</th><th>Remove</th><th>Keep following</th></tr></thead><tbody>'''+''.join(rows)+'''</tbody></table><script>const v=document.getElementById('v');document.querySelectorAll('button').forEach(b=>b.onclick=()=>{const go=()=>{v.currentTime=Number(b.dataset.t);v.play().catch(()=>{})};if(v.getAttribute('src')!==b.dataset.src){v.src=b.dataset.src;v.addEventListener('loadedmetadata',go,{once:true})}else go()})</script></html>''')
(b/'meta.json').write_text(json.dumps(dict(title='GPT-6 Astra Unreal Engine and Aura Tutorial',status='awaiting-cut-approval',width=3840,height=1080,fps=30,pipeline=['cut-silences','cut-mistakes','verify-cuts'],proposed_cuts=len(cuts),source_seconds=m['source_duration'],estimated_final_seconds=final),indent=2))
(b/'NOTES.md').write_text(f'# Awaiting cut approval\n\nSources: 1.mov → 2.mov → 3.mov, untouched.\nReview: CUT-REVIEW.md and review.html.\n{len(cuts)} proposed cuts. Estimated final: {fmt(final)}.\nNo mistake cuts have been applied or approved.\n')
print('\n'.join(md[:7]));print('\n'.join(f'{c["id"]:02} {fmt(c["source_start"])} {c["removes"]} → {c["keeps"]}' for c in cuts))
