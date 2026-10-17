#!/usr/bin/env python3
"""Checkpoint 1 proposals only. Does not edit or render any video."""
from pathlib import Path
import json, html, shutil

P = Path(__file__).resolve().parent
def save(path, data):
    (P/path).write_text(json.dumps(data, indent=2, ensure_ascii=False)+'\n')
def tc(t):
    return f'{int(t)//60}:{t%60:05.2f}'
def esc(x): return html.escape(str(x))

inventory = json.loads((P/'inventory.json').read_text())
roles = ['SOP ad','AI OS ad','Scrollcraft ad','SOP intro','AI OS intro','Scrollcraft intro','Generic intro','Shared VSL core']
retakes = {
 '01': [(38.22,56.90,'Replace first SOP / benefits passage with the final complete take.',57.08,'So this SOP right here…', 'User landmark 0:52; the full final restart is at 0:57.08. Preserve the unique opening.')],
 '02': [(34.56,40.12,'Remove abandoned “Jarvis works so well—”.',40.30,'Jarvis worked so well because…','User landmark 0:38; final restart at 0:40.30.')],
 '08': [
  (89.26,98.00,'Remove first $385,000 take.',98.24,'One of our members went from a regular nine-to-five…','Keep the last complete claim.'),
  (105.00,108.96,'Remove first “Other members” take.',109.20,'Other members are regularly closing deals…','Keep the last complete take.'),
  (283.74,299.12,'Remove abandoned no-code / degree paragraph.',299.36,'And as I said, the tools that we teach…','Keep the final take, including “business analytics and marketing”.'),
  (362.90,370.05,'Remove first rate-lock take and abandoned monthly transition.',370.29,'And your rate is locked in for life…','Preserve the complete monthly offer that follows.'),
  (388.05,390.17,'Remove abandoned “Several thousand—”.',390.41,'So that means we have several thousand people…','Keep the final complete sentence.'),
  (414.83,511.46,'Remove first two “do the math” takes and the long wait.',511.70,'And once they actually do the math…','Last take at 8:31.70. Local re-transcription corrected a stretched ASR token during the wait.'),
  (526.77,536.37,'Remove first “version of you” take.',536.61,'So the version of you who’s building systems…','Keep the final complete close.')
 ]
}
plans, reviewed = {}, {}
for item,role in zip(inventory,roles):
    clip=item['clip']; d=json.loads((P/'transcripts'/f'{clip}.source.json').read_text())
    words=[dict(w) for w in d['words'] if w.get('type')=='word']
    correction=[]
    if clip=='08':
        local=json.loads((P/'transcripts/08-math-507-530.json').read_text())
        replacement=[dict(w,start=round(w['start']+507,3),end=round(w['end']+507,3)) for w in local['words'] if w.get('type')=='word']
        words=[w for w in words if not (479 <= w['start'] < 527)] + replacement
        words.sort(key=lambda w:w['start'])
        correction=[{'range_source':[479,527],'reason':'Source ASR placed “And” at 479.43 and stretched “once” across silence. Replace passage from isolated source-clock PCM 507–530 s transcription. Final take begins 511.70 s. Original ASR is preserved.','evidence':'08-math-507-530.json'}]
    duration=item['duration']
    review={'clip':clip,'timeline_basis':d['timeline_basis'],'status':'Checkpoint 1 review transcript; spelling normalization and final audio verification pending','audio_duration_secs':duration,'corrections':correction,'words':words}
    save(f'transcripts/{clip}.review.json',review);reviewed[clip]=review
    semantic=[]
    for a,b,why,restart,anchor,note in retakes.get(clip,[]):
        semantic.append({'start':a,'end':b,'kind':'retake','reason':why,'last_take_start':restart,'kept_anchor':anchor,'note':note})
    selected=[w for w in words if not any(c['start']<=w['start'] and w['end']<=c['end'] for c in semantic)]
    ad=int(clip)<=3
    threshold=1.0 if ad else 1.2
    before,after=(.20,.18) if ad else (.28,.24)
    head,tail=(.24,.34) if ad else (.28,.40)
    pauses=[{'start':0,'end':round(selected[0]['start']-head,3),'kind':'head','reason':'Head trim; retain lead-in before first word.'},
            {'start':round(selected[-1]['end']+tail,3),'end':duration,'kind':'tail','reason':'Tail trim; retain natural release after last word.'}]
    for prev,nxt in zip(selected,selected[1:]):
        gap=nxt['start']-prev['end']
        if gap >= threshold:
            pauses.append({'start':round(prev['end']+before,3),'end':round(nxt['start']-after,3),'kind':'pause','reason':f'Gap {gap:.2f}s → {before+after:.2f}s; preserve shorter natural pauses.'})
    merged=[]
    for c in sorted(semantic+pauses,key=lambda x:x['start']):
        if c['end']<=c['start']:continue
        if merged and c['start']<=merged[-1]['end']+.001:
            merged[-1]['end']=max(c['end'],merged[-1]['end']);merged[-1]['reasons'].append(c['reason'])
        else: merged.append({'start':c['start'],'end':c['end'],'reasons':[c['reason']]})
    keep=[];cursor=0;edited=0
    for c in merged+[{'start':duration,'end':duration}]:
        if c['start']>cursor:
            length=c['start']-cursor
            keep.append({'source_start':round(cursor,3),'source_end':round(c['start'],3),'edit_start':round(edited,3),'edit_end':round(edited+length,3)})
            edited+=length
        cursor=c['end']
    plan={'clip':clip,'role':role,'source_file':item['name'],'source_duration':duration,'status':'PROPOSED — not approved, not rendered; millisecond boundaries require frame/audio checks','edited_duration_estimate':round(edited,3),'pacing':{'gap_threshold':threshold,'retained_gap':before+after,'head_pad':head,'tail_pad':tail},'retakes':semantic,'delete':merged,'keep':keep}
    def mapped(t):
        for k in keep:
            if k['source_start']-.001<=t<=k['source_end']+.001:return round(k['edit_start']+t-k['source_start'],3)
        return None
    retimed=[]
    for w in selected:
        a,b=mapped(w['start']),mapped(w['end'])
        assert a is not None and b is not None, (clip,w)
        assert not any(c['start']<w['end']-.001 and c['end']>w['start']+.001 for c in merged),(clip,w)
        retimed.append(dict(w,source_start=w['start'],source_end=w['end'],start=a,end=b))
    assert abs(duration - sum(c['end']-c['start'] for c in merged) - edited)<.003
    assert all(k['source_end']-k['source_start']>.3 for k in keep)
    save(f'edit-decisions/{clip}.proposed-edl.json',plan)
    save(f'transcripts/{clip}.proposed-edit.json',{'status':plan['status'],'duration':round(edited,3),'words':retimed})
    item.update(role=role,transcript=f'transcripts/{clip}.review.json',word_count_source=len(words),word_count_proposed_edit=len(retimed),first_source_word=words[0]['start'],last_source_word=words[-1]['end'])
    plans[clip]=plan
save('inventory.json',inventory)

core=plans['08']
def core_map(t):
    for k in core['keep']:
        if k['source_start']<=t<=k['source_end']:return round(k['edit_start']+t-k['source_start'],3)
    raise ValueError(t)
chapters=[('Opening',2.68),('Proof bridge',72.42),('System',138.64),('Support',188.64),('Environment',210.98),('Non-technical proof',299.36),('Offer',330.08),('Rate lock',370.29),('Annual math — last take',511.70),('Close',536.61),('Annual refund',560.97),('CTA',589.95)]
markers=[{'name':n,'source_time':t,'proposed_core_time':core_map(t)} for n,t in chapters]
proof_entry=72.18
generic_offset=core_map(proof_entry)
save('edit-decisions/core-markers.json',{'status':'PROPOSED','spoken_proof_bridge_source':72.42,'generic_entry_source_with_preroll':proof_entry,'generic_entry_proposed_core':generic_offset,'markers':markers})
exports=[]
for clip,slug in [('01','SOP'),('02','AI-OS'),('03','Scrollcraft')]:
    for fmt,dimensions in [('16x9',[1920,1080]),('9x16',[1080,1920])]:
        exports.append({'filename':f'AIS_{slug}_Ad_{fmt}.mp4','type':'ad','sources':[clip],'dimensions':dimensions,'duration_estimate':plans[clip]['edited_duration_estimate'],'caption_sidecar':f'AIS_{slug}_Ad_{fmt}.srt','status':'PLANNED'})
for clip,slug in [('04','SOP'),('05','AI-OS'),('06','Scrollcraft'),('07','Generic')]:
    offset=generic_offset if clip=='07' else 0
    body_keeps=[]
    for k in core['keep']:
        if k['edit_end']<=offset:continue
        trimmed=dict(k)
        if trimmed['edit_start']<offset:
            trimmed['source_start']=round(trimmed['source_start']+offset-trimmed['edit_start'],3)
            trimmed['edit_start']=offset
        trimmed['version_start']=round(plans[clip]['edited_duration_estimate']+trimmed['edit_start']-offset,3)
        trimmed['version_end']=round(plans[clip]['edited_duration_estimate']+trimmed['edit_end']-offset,3)
        body_keeps.append(trimmed)
    version={'filename':f'AIS-Plus_VSL_{slug}_16x9.mp4','type':'vsl','sources':[clip,'08'],'dimensions':[1920,1080],'core_edit_offset':offset,'duration_estimate':round(plans[clip]['edited_duration_estimate']+core['edited_duration_estimate']-offset,3),'caption_sidecar':f'AIS-Plus_VSL_{slug}_16x9.srt','status':'PLANNED'}
    save(f'edit-decisions/VSL-{slug}.assembly.json',dict(version,intro_map=plans[clip]['keep'],core_map=body_keeps,join_note='Retain intro tail and core lead-in; check combined pause, breath and repeated wording after render. Generic uses source 72.18s with first word at 72.42s.'))
    exports.append(version)
assert len(exports)==10
save('export-plan.json',{'status':'CHECKPOINT 1 — planned exports, no renders or final captions exist','fps':30,'captions':'Styled burned-in captions matching V2 reference; editable word data and per-export synchronized SRT; no double captions','estimates_exclude':'New end-card holds, fine cut adjustments and optional clip 05 flub fix','exports':exports})

optional=[{'clip':'05','source_region':[53.32,54.96],'issue':'“provides s- with support”','proposal':'Try removing the false start / “with” to leave “provides support”. No alternate take is present. Inspect waveform and listen before selecting a tight boundary. Not included in the current duration/map.'}]
save('edit-decisions/optional-flubs.json',optional)
save('edit-decisions/caption-terminology.json',{'instructions':'Preserve speech and approved take selection. Correct ASR spelling, not numerical claims or content. Caption words are not yet final. Generate version-specific SRT only after cuts are verified.','terms':{'CloudCode':'Claude Code','cloud code':'Claude Code','codecs':'Codex','HERC loop':'Herk Loop',"AI’s Plus / AI\'s Plus / AIS Plus":'AIS+','four Cs':'4Cs','scrollcraft':'Scrollcraft'},'offer_graphic':'$749/year + approximately $62.42/month; $129/month alternative','offer_caption':'Spoken “about sixty-two dollars a month” stays faithful to speech.','refund':'Annual membership only.','membership_count':'Recording says over 3,500. Script says over 3,600. Preserve recording pending clarification.'})

asset_rows=[
 ['SOP + pitch / credibility / outreach','Needed','Link or PDF of the real SOP; short screen recording optional. Text cards can explain the three benefits while we wait.','Ad 01 + VSL 04'],
 ['YouTube channel / comments','Needed','Current channel link plus real comment screenshots or URLs. Do not fabricate viewer comments or subscriber evidence.','Ad 01'],
 ['AI OS setup / six skills / 3D brain','Needed','Template link or folder, setup screen(s), the six skill names, and a real brain screenshot/recording. Use simple 4Cs diagrams for explanation.','Ad 02 + VSL 05'],
 ['Scrollcraft before / after','Priority asset','Two URLs or an existing recording showing a plain site and the real Scrollcraft result. Spoken “this” / “first example” needs the actual comparison.','Ad 03 + VSL 06'],
 ['AIS+ member wins','Candidates found','16 existing screenshots in ais-plus-live-promo/assets/wins. David Kim supports a $385k contract amount; the image alone does not establish the 9-to-5 backstory. Verify each chosen crop against the spoken claim.','Core proof'],
 ['Current courses / templates / support','Needed or text-led','Current Agent Zero, 10 Hours to 10 Seconds, One Person AI Agency covers; template library and support/community screenshots if available. Older module images have different titles. Plain labeled cards are suitable otherwise.','Core pillars'],
 ['Brand / approved motion source','Available','Existing White Glass code, Inter typography, approved landscape/portrait renders. Replace AIS Live event branding with appropriate AIS / AIS+.','All'],
 ['Offer and event graphics','Partial hold','Annual/monthly prices confirmed. Event count and $1,097 total remain unresolved. Old $799 upsell/event ticket copy must not be reused.','Core offer']
]
save('visual-assets/asset-requests.json',{'search_scope':'Supplied project, prior local AIS projects and targeted connected Drive searches. “Needed” means not located within those searches, not proof of global absence.','assets':[dict(zip(['asset','status','request_or_note','used_in'],r)) for r in asset_rows]})

differences=[
 ['Confirmed','Annual price','$749/year and approximately $62.42/month on graphics. Recorded “about $62” can stay. Replace script end-card $66.58.'],
 ['Open','Virtual events','Core says quarterly at 3:58.44, then all three per year at 5:36.52. $199 × 3 + $500 = $1,097 depends on three events. Keep this unresolved; do not silently alter the recording or publish contradictory graphics.'],
 ['Review','Community count','Core 3:30.98 says over 3,500; written script says over 3,600. Proposed captions follow 3,500; any corrected claim needs direction.'],
 ['Review','Tool compatibility','Ads 02 and 03 add “or any other AI agent that you wanna use” beyond the written Claude Code / Codex line. Keep the recorded wording provisionally; show named tools only unless broader compatibility is verified.'],
 ['Preserve','Annual refund scope','Closing refund language explicitly cancels annual membership. Use an annual-only label; do not imply the same promise for monthly.'],
 ['Preserve','Other delivery differences','AI OS intro reverses the Herk Loop / 4Cs explanation and says fewer than ten full-time employees. Scrollcraft intro says “layers and animations”. Core adds the degree subjects. These natural spoken changes can remain.'],
 ['Correct spelling','ASR terms','Claude Code, Codex, Herk Loop, AIS+, Scrollcraft, and course names need script-based spelling cleanup; do not substitute script words for a different spoken claim.']
]
save('script-recording-review.json',[dict(zip(['status','topic','decision'],r)) for r in differences])

shutil.copyfile(P.parent/'ais-live-ai-os-ads/hyperframes-white-glass/01-morning/qc/contact.jpg',P/'references/approved-landscape-contact.jpg')
shutil.copyfile(P.parent/'ais-live-ai-os-ads/hyperframes-white-glass-vertical/03-founder/qc/contact.jpg',P/'references/approved-portrait-contact.jpg')

def table(headers,rows):
    return '<div class="scroll"><table><thead><tr>'+''.join('<th>'+h+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+str(c)+'</td>' for c in r)+'</tr>' for r in rows)+'</tbody></table></div>'
def seek(clip,t,label): return f'<button class="seek" data-clip="{clip}" data-time="{t}">{esc(label)}</button>'
inventory_table=table(['Clip / role','Raw duration','Approx. FPS','Audio LUFS / dBTP','Proposed length'],[
 [f'<b>{x["clip"]} · {esc(x["role"])}</b><br><small>{x["size_bytes"]/1e9:.2f} GB · {x["word_count_source"]} source words</small>',tc(x['duration']),f'{eval(x["video"]["avg_frame_rate"]):.6f}',f'{x["integrated_lufs"]:.1f} / {x["true_peak_dbfs"]:.1f}',tc(plans[x['clip']]['edited_duration_estimate'])] for x in inventory])
retake_table=table(['Clip','Proposed raw deletion','Retained final take','Reason'],[
 [c,tc(r['start'])+'–'+tc(r['end']),seek(c,r['last_take_start']-.8,tc(r['last_take_start'])+' · '+r['kept_anchor']),esc(r['reason'])+'<br><small>'+esc(r['note'])+'</small>'] for c in plans for r in plans[c]['retakes']])
export_table=table(['Planned file','Dimensions','Assembly','Estimated duration'],[[esc(e['filename']),f'{e["dimensions"][0]} × {e["dimensions"][1]}',' + '.join(e['sources'])+(' from proof bridge' if e.get('core_edit_offset',0)>0 else ''),tc(e['duration_estimate'])] for e in exports])
markers_table=table(['Core section','Raw source','Proposed core'],[[esc(m['name']),seek('08',max(0,m['source_time']-.6),tc(m['source_time'])),tc(m['proposed_core_time'])] for m in markers])
cut_details=''.join('<details><summary>'+c+' · '+esc(plans[c]['role'])+' — complete source → proposed edit map</summary>'+table(['Source in','Source out','Edit in','Edit out'],[[tc(k['source_start']),tc(k['source_end']),tc(k['edit_start']),tc(k['edit_end'])] for k in plans[c]['keep']])+f'<p><a href="edit-decisions/{c}.proposed-edl.json">EDL JSON</a> · <a href="transcripts/{c}.review.json">Source word transcript</a> · <a href="transcripts/{c}.proposed-edit.json">Retimed draft words</a></p></details>' for c in plans)
total_raw=sum(x['duration'] for x in inventory)
report=f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIS campaign · Checkpoint 1</title>
<style>
:root{{--ink:#192536;--muted:#586579;--line:#d9e1eb;--blue:#235fbb;--paper:#f4f7fb}}*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink)}}main{{max-width:1200px;margin:auto;padding:48px 32px 90px}}h1{{font-size:42px;line-height:1.12;letter-spacing:-1.5px;margin:12px 0 16px}}h2{{font-size:25px;letter-spacing:-.5px;line-height:1.25;margin:0 0 20px}}h3{{font-size:18px}}p{{margin:0 0 16px}}a{{color:var(--blue)}}.eyebrow{{font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:var(--blue)}}.lede{{font-size:19px;max-width:820px;color:var(--muted)}}.band{{padding:20px 24px;background:#e5edfa;border-left:4px solid var(--blue);border-radius:4px;margin:24px 0}}.warn{{background:#fff5df;border-color:#a96806}}.cards{{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:28px 0}}.card{{background:white;border:1px solid var(--line);border-radius:12px;padding:18px}}.value{{font-size:27px;font-weight:650}}small,.muted{{color:var(--muted)}}section{{background:white;border:1px solid var(--line);border-radius:16px;padding:30px;margin:22px 0}}nav{{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0}}nav a{{text-decoration:none;padding:6px 12px;border:1px solid var(--line);border-radius:20px;color:var(--ink);font-size:14px}}table{{width:100%;border-collapse:collapse;font-size:14px}}th{{text-align:left;background:#f1f5fa;color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.5px}}th,td{{padding:12px 14px;vertical-align:top;border-bottom:1px solid var(--line)}}tr:last-child td{{border-bottom:0}}.scroll{{overflow:auto}}.seek{{font:inherit;text-align:left;color:var(--blue);background:#eef4fe;border:1px solid #d5e4fc;border-radius:7px;cursor:pointer;padding:6px 9px}}.seek:hover{{background:#dceafe}}video{{width:100%;max-height:540px;background:#142030;border-radius:10px}}#player-note{{min-height:25px;font-size:14px}}.two{{display:grid;grid-template-columns:1fr 1fr;gap:24px}}img{{width:100%;border-radius:9px}}details{{border-top:1px solid var(--line);padding:14px 0}}summary{{font-weight:600;cursor:pointer}}ul,ol{{padding-left:23px}}li{{margin:9px 0}}.badge{{font-size:12px;font-weight:650;background:#e4f1e8;color:#275f3b;padding:4px 9px;border-radius:20px}}footer{{color:var(--muted);font-size:13px}}@media(max-width:750px){{main{{padding:24px 16px}}section{{padding:20px 16px}}h1{{font-size:34px}}.cards{{grid-template-columns:1fr 1fr}}.two{{grid-template-columns:1fr}}th,td{{padding:10px 8px}}}}@media print{{button,video,nav{{display:none}}section{{break-inside:avoid}}main{{padding:0}}}}
</style><main>
<div class="eyebrow">AIS / AIS+ · September 30, 2026</div><h1>Checkpoint 1: intake & edit plan</h1><p class="lede">Eight recordings acquired and transcribed. Proposed cuts, source timing, reusable core structure and ten planned exports are ready for review.</p>
<div class="band"><b>Review gate: no styled videos have been built.</b> Your supplied brief says to stop after Checkpoint 1. The next approved step is a 10–15 second dark style proof in both formats, plus a VSL offer/proof frame.</div>
<div class="cards"><div class="card"><div class="value">8 / 8</div>sources acquired</div><div class="card"><div class="value">{tc(total_raw)}</div>total raw footage</div><div class="card"><div class="value">10</div>planned MP4 + SRT pairs</div><div class="card"><div class="value">Fri, Oct 2</div>EOD · Central Time</div></div>
<nav><a href="#decisions">Decisions</a><a href="#media">Media inventory</a><a href="#cuts">Retakes</a><a href="#core">Core map</a><a href="#assets">Visual assets</a><a href="#style">Style plan</a><a href="#exports">Exports & order</a></nav>
<section id="decisions"><h2>Confirmed choices & open content</h2><p><span class="badge">Confirmed</span> Styled burned-in V2 / White Glass captions, adapted to dark mode. Keep editable captions and synchronized SRTs. Annual display: <b>$749/year + approximately $62.42/month</b>.</p>{table(['Status','Topic','Treatment'],[[esc(c) for c in r] for r in differences])}<div class="band warn"><b>Event frequency remains unanswered.</b> Style proof and ad work can proceed after approval. The VSL’s event-frequency and savings passages must be resolved before final VSL sign-off. Preserve the existing recording in this proposed map so the unresolved copy remains visible.</div></section>
<section id="media"><h2>Media inventory</h2><p>All eight files are 3840 × 2160 H.264, nominal 30 fps, with AAC 48 kHz stereo at approximately 192 kb/s. Measured left/right difference is about −91 dB, consistent with duplicated mono. Sampled frames show consistent studio framing without baked-in captions.</p>{inventory_table}<p class="muted">Proposed durations are planning estimates, excluding new end-card holds and fine cut changes. Source files total {sum(x['size_bytes'] for x in inventory)/1e9:.2f} GB. They remain on the external SSD; internal storage is reserved for project data.</p><details><summary>Technical handling for production</summary><ul><li>Prepare a fixed 30 fps edit timeline from the source presentation timestamps. Average frame rates differ slightly from nominal 30.</li><li>Sources are full-range yuvj420p with mixed color metadata (BT.470BG matrix, BT.709 primaries, unspecified transfer). Verify an explicit color conversion to the delivery format using reference frames; preserve natural exposure.</li><li>Keep audio on the original source clock. Word transcripts use PCM with initial presentation silence retained; MP3-derived first-pass timestamps are kept only for provenance.</li><li>Normalize the edited voice consistently, with a suggested −16 LUFS integrated target and true-peak limiting at −1 dBTP. Do not simply add 6 dB to these raw peaks.</li><li>Reuse the prior clean-audio remux approach with the newly edited audio master and its exact timing. Recheck sync after every assembly and export.</li></ul></details></section>
<section id="source-review"><h2>Raw-source review player</h2><p>Retake and chapter buttons below load the original recording at the named source position. This is an inspection player, not an edited preview.</p><video id="source-player" controls preload="none" poster="references/01-opening.jpg"></video><p id="player-note" class="muted">Select a timestamp below, then press Play. External SSD must be connected.</p></section>
<section id="cuts"><h2>Retake selections</h2><p>Last takes are retained. Timestamps below are on the original MP4 presentation clock. The requested landmarks are approximate; the final word onsets locate the actual restarts.</p>{retake_table}<p><b>Clip 05 optional cleanup:</b> at 0:53.32–0:54.96, “provides s- with support” could be tightened to “provides support”. That tight edit needs a listening/waveform check and is not included in this map.</p><p><b>Pause plan:</b> ads trim gaps of at least 1.0 s to approximately 0.38 s; VSL clips trim gaps of at least 1.2 s to approximately 0.52 s. Shorter pauses remain. Breaths and sentence joins will be adjusted during actual edit verification.</p><p>All eight transcripts received the stretched-token pre-pass. Clip 08 contained one long timing error around the final math restart; an isolated transcription corrected it. No cut was rendered.</p>{cut_details}</section>
<section id="core"><h2>One shared core, four assemblies</h2><div class="band"><b>Generic entry:</b> raw <b>1:12.42</b>, “So this page is full of examples…” Use raw <b>1:12.18</b> with a short lead-in. In the proposed cleaned core this entry is <b>{tc(generic_offset)}</b>, and its first word is <b>{tc(core_map(72.42))}</b>. Never apply raw 1:12 to the edited core.</div>{markers_table}<p>04, 05 and 06 use the full cleaned core. 07 enters at the proof marker so the repeated learning/support trap does not play twice. Each assembly stores its own intro and core source-to-version map. Caption offsets must use those maps after cut verification.</p><p>Join checks: 04/05 “But here’s the thing” → “So if you’re like most builders”; 06 “design is just one piece of the puzzle” → core opening; 07 “escape that trap” → proof bridge. Check sentence completeness, combined breath, mouth movement, loudness, and caption handoff on all four.</p><p><a href="edit-decisions/core-markers.json">Core markers JSON</a></p></section>
<section id="assets"><h2>Visual assets</h2><p>The most useful missing item is a real Scrollcraft before-and-after: two page links or an existing screen recording. For SOP and AI OS, the document/template itself is enough to begin selecting useful shots.</p>{table(['Asset','Status','What is needed / available','Use'],[[esc(c) for c in r] for r in asset_rows])}<p class="muted">Searches covered local AIS projects and targeted Drive queries. Existing proof screenshots are candidates, not blanket validation of all spoken claims. No fabricated comments, testimonials or product screens are planned.</p></section>
<section id="style"><h2>Adapt the approved White Glass system to dark mode</h2><div class="two"><div><h3>Preserve</h3><ul><li>Inter typography, generous spacing and one main idea at a time.</li><li>Rounded Nate window, layered glass cards and restrained AIS blue.</li><li>Smooth eased entrances, gentle stagger, soft blur transitions and subtle depth.</li><li>Consistent styled captions tied to the selected speech.</li></ul></div><div><h3>Adapt</h3><ul><li>Deep charcoal / navy background, dark translucent surfaces, soft highlights and near-white text.</li><li>Landscape: editorial graphics beside Nate. Portrait: centered graphics above, Nate below, separate caption safe area.</li><li>Calmer VSL pacing; keep the speaker visible where a graphic adds little.</li><li>AIS / AIS+ branding and current offer copy throughout.</li></ul></div></div><p>Reference geometry: landscape uses a 744 × 773 speaker window at (1080,151), 96 px outer margins and captions around y=965. Portrait uses a 952 × 720 window at (64,1080), 64 px margins and captions around y=932. These are starting points; the next proof will check actual footage and mobile safe areas.</p><p>Reference code uses roughly 0.58 s entrances, 0.7 s card motion and 0.085 s stagger. Retain the smooth character, without old event bugs, red LIVE dots, ticket dates, giant italic headlines, grids or neon outlines.</p><details><summary>Inspected approved references (existing work)</summary><div class="two"><div><h3>Landscape contact sheet</h3><img loading="lazy" src="references/approved-landscape-contact.jpg" alt="Existing White Glass landscape reference contact sheet"></div><div><h3>Portrait contact sheet</h3><img loading="lazy" src="references/approved-portrait-contact.jpg" alt="Existing White Glass portrait reference contact sheet"></div></div><h3>Existing motion sequence</h3><img loading="lazy" src="references/white-glass-motion-strip.jpg" alt="Sampled frames of the approved White Glass transition"><p>The old event VSL was inspected as a secondary pacing/presentation reference. Facebook displayed an unavailable/template post rather than a usable video. The newer approved V2 system is the controlling style reference.</p></details></section>
<section id="exports"><h2>Ten-export checklist & production order</h2>{export_table}<p>All ten remain <b>planned</b>. Every MP4 gets a matching synchronized SRT, while project caption data remains editable. Landscape and portrait ad layouts are authored separately.</p><ol><li><b>Checkpoint 1 — now:</b> review source inventory, last-take selections, asset needs and unresolved content.</li><li><b>Checkpoint 2 — after approval:</b> 10–15 second dark proof in landscape and portrait using actual new footage, captions, headline, glass graphic and transition; one VSL offer/proof frame. Stop for style review.</li><li><b>Checkpoint 3:</b> finish SOP ad in both formats; review cuts, audio, captions, graphics and mobile readability.</li><li><b>Checkpoint 4:</b> finish AI OS and Scrollcraft ads in both formats; review four previews.</li><li><b>Checkpoint 5:</b> finish the reusable core and SOP-intro VSL; review full long-form pacing, proof and offer.</li><li><b>Checkpoint 6:</b> assemble the other three VSLs, verify joins and caption offsets, QA all ten exports, and create the delivery manifest.</li></ol><p><b>Target sequence:</b> Wednesday: intake review and style proof after approval. Thursday: ad checkpoints and VSL core assembly. Friday: core approval, remaining versions and full export QA. This target depends on review turnaround and required assets/content arriving in time.</p><p>Final QA includes complete decoding, audio/video sync, natural cuts, caption wording and coverage, contrast and safe areas, missing assets, black/frozen frames, correct takes, correct formats and all four VSL joins. Confirm the upload destination before external delivery.</p><p><a href="export-plan.json">Export plan JSON</a> · <a href="STATUS.txt">Handoff / current status</a> · <a href="REQUEST.txt">Original staged brief</a></p></section>
<footer>Checkpoint 1 · Prepared September 30, 2026. Source files and prior White Glass projects are preserved. This report proposes edits; it does not certify finished-video QA. Local inspection player requires the SSD and the local review server (or a browser that permits local media).</footer>
</main><script>
const files={json.dumps({x['clip']:x['name'] for x in inventory})};
const player=document.getElementById('source-player'),note=document.getElementById('player-note');
document.querySelectorAll('.seek').forEach(button=>button.addEventListener('click',()=>{{
  const clip=button.dataset.clip,t=Number(button.dataset.time),path='raw/'+encodeURIComponent(files[clip]);
  player.pause();
  if(player.dataset.clip!==clip){{player.src=path;player.dataset.clip=clip;player.onloadedmetadata=()=>{{player.currentTime=t;}};player.load();}}
  else player.currentTime=t;
  note.textContent=files[clip]+' · raw source '+Math.floor(t/60)+':'+(t%60).toFixed(2).padStart(5,'0')+' · Press Play to inspect.';
  document.getElementById('source-review').scrollIntoView({{behavior:'smooth',block:'start'}});
}}));
player.addEventListener('error',()=>{{note.textContent='Could not load source media. Check that the external SSD is connected and open this report through the local review server.';}});
</script></html>'''
(P/'CHECKPOINT-1.html').write_text(report)

lines=['CHECKPOINT 1 COMPLETE — WAITING FOR USER REVIEW','Deadline: Friday October 2, 2026, end of day Central Time.','',
 'User gate: REQUEST.txt explicitly says Checkpoint 1 only, then stop. No styled videos or final exports have been produced.',
 '', 'Completed: eight raw files downloaded to delivery/_sources; probe/audio inventory; full word transcripts on original source clock; original and corrected ASR preserved; scripts saved; style sources and representative references inspected; proposed cuts/maps and four assembly maps; asset and content review; ten-export plan; interactive CHECKPOINT-1.html.',
 '', 'Confirmed: burned-in V2-style captions adapted to dark mode, plus editable data and SRTs. Annual graphic $749/year + approximately $62.42/month.',
 '', 'Unresolved: quarterly versus three virtual events per year and dependent $1,097 savings. User does not know yet. Recording says 3,500 builders versus script 3,600. Broader any-AI-agent compatibility line added in ads 02 and 03. Actual SOP / AI OS product assets and Scrollcraft before-after still needed; user was told the exact types of source assets requested.',
 '', 'Next after Checkpoint 1 approval: only Checkpoint 2 dark style proof (10–15 s landscape + portrait, and VSL offer/proof frame), then stop for style approval.',
 '', 'Technical notes: raw symlink points to external SSD; keep SSD connected. Use *.review.json for source word data, *.proposed-edl.json for tentative source map. *.source.json preserves original PCM-clock ASR. *.raw.json uses the earlier extracted MP3 clock and is not canonical. Source 08 math passage was re-transcribed locally; final onset 511.70 s. Generic source entry 72.18 s / first word 72.42 s. Millisecond EDL boundaries need audio/frame review before any production render.',
 '', 'Caption sidecars are planned, not generated as final deliverables. No final decode/sync/caption QA has been claimed. External upload destination must be confirmed before delivery.']
(P/'STATUS.txt').write_text('\n'.join(lines)+'\n')
save('checkpoint-validation.json',{'status':'PASS for planning invariants only','source_count':len(inventory),'planned_export_count':len(exports),'checks':['Every proposed retained word is outside delete ranges.','Source duration equals sum of proposed keep and delete durations.','No retained source segment shorter than 0.3 seconds.','All four VSL assemblies share one core map.','Generic entry uses original source proof marker.'],'not_checked_yet':['Rendered cuts and acoustic continuity','Final captions','Full final-video decode and sync','Styled layout and mobile safe areas']})
print(json.dumps({'core_estimate':core['edited_duration_estimate'],'generic_core_entry':generic_offset,'exports':[(x['filename'],tc(x['duration_estimate'])) for x in exports]},indent=2))
