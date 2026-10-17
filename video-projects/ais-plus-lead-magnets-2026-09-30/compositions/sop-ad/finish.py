from pathlib import Path
import json,subprocess,re,hashlib,shutil
from PIL import Image,ImageDraw

R=Path(__file__).resolve().parent
P=R.parent.parent
Q=R/'qc'
D=1631/30
PRE=P/'previews'
DEST=Path('/Volumes/Extreme SSD/Uppit AI/AIS Live/October /Ads/2026-09-30 - Lead Magnets and AIS Plus/_checkpoints/03-complete-sop-ad')
def run(args):return subprocess.run(args,capture_output=True,check=True)
def pcm(file):return run(['ffmpeg','-v','error','-i',str(file),'-vn','-ac','1','-ar','16000','-f','f32le','-']).stdout
master=R/'assets/speaker.mp4'
source_audio=pcm(master)
source_hash=hashlib.sha256(source_audio).hexdigest()
captions=json.loads((R/'captions.json').read_text())
scenes=json.loads((R/'scene-plan.json').read_text())
beats=json.loads((R/'beat-sync.json').read_text())
words=json.loads((R/'assets/transcript.json').read_text())['words']
fresh=json.loads((Q/'clean-fresh.json').read_text())
normalize=lambda s:re.sub(r'[^a-z0-9]+',' ',s.lower()).strip()
assert normalize(' '.join(w['text'] for w in words))==normalize(fresh['text'])
assert sum(len(c['words']) for c in captions)==len(words)
assert all(a['end']<=b['start'] for a,b in zip(captions,captions[1:]))
hero_times=[1.8,9.9,13.0,22.4,27.5,33.2,42.2,49.0,53.3]
reports=[]
for folder,shape,w,h in [('landscape','16x9',1920,1080),('portrait','9x16',1080,1920)]:
    out=PRE/f'CHECKPOINT-3_First-AI-Client-SOP_{shape}.mp4'
    run(['ffmpeg','-v','error','-i',str(R/folder/'renders/sop-render.mp4'),'-i',str(master),'-map','0:v:0','-map','1:a:0','-c','copy','-t',str(D),'-movflags','+faststart','-y',str(out)])
    probe=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(out)]).stdout)
    v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
    assert (v['width'],v['height'])==(w,h)
    assert int(v['nb_frames'])==1631,(shape,v['nb_frames'])
    assert v['avg_frame_rate']=='30/1'
    assert abs(float(v['duration'])-D)<.002
    assert abs(float(a['duration'])-D)<.002
    decode=run(['ffmpeg','-v','warning','-i',str(out),'-f','null','-'])
    assert not decode.stderr.strip(),decode.stderr
    assert pcm(out)==source_audio,'Rendered audio differs from verified master'
    measure=run(['ffmpeg','-hide_banner','-i',str(out),'-af','ebur128=peak=true','-f','null','-']).stderr.decode()
    loud=float(re.findall(r'I:\s+(-?[\d.]+) LUFS',measure)[-1]);peak=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS',measure)[-1])
    assert -17<loud<-15 and peak<=-1,(loud,peak)
    check=run(['ffmpeg','-hide_banner','-i',str(out),'-vf','blackdetect=d=0.08:pix_th=0.04:pic_th=0.98,freezedetect=n=0.002:d=1.5','-an','-f','null','-']).stderr.decode()
    assert 'black_start:' not in check
    (Q/f'{shape}-freeze-check.txt').write_text('\n'.join(x for x in check.splitlines() if 'freeze_' in x)+'\n')
    thumbs=[]
    for i,t in enumerate(hero_times):
        framefile=Q/f'{shape}-scene-{i+1:02d}.jpg'
        run(['ffmpeg','-v','error','-ss',str(t),'-i',str(out),'-frames:v','1','-q:v','2','-y',str(framefile)])
        im=Image.open(framefile);im.thumbnail((640,360) if w>h else (300,534));thumbs.append((im.copy(),f'{scenes[i]["id"]}  {t:.1f}s'))
    cw,ch,cols=(640,393,3) if w>h else (300,566,3)
    sheet=Image.new('RGB',(cw*cols,ch*3),'#172333');draw=ImageDraw.Draw(sheet)
    for i,(im,label) in enumerate(thumbs):
        x=(i%cols)*cw;y=(i//cols)*ch;sheet.paste(im,(x,y));draw.text((x+9,y+ch-23),label,fill='#f3f6fa')
    sheet.save(Q/f'{shape}-scenes.jpg',quality=93)
    shutil.copy2(Q/f'{shape}-scene-07.jpg',PRE/f'CHECKPOINT-3_SOP_{shape}-Poster.jpg')
    # One contact row per seam. Inspect outgoing, crossing and settled incoming states.
    cells=[]
    for i,s in enumerate(scenes[1:]):
        for dt in [-.1,.17,.7]:
            t=max(0,s['start']+dt);f=Q/f'{shape}-seam-{i}-{dt}.jpg'
            run(['ffmpeg','-v','error','-ss',str(t),'-i',str(out),'-frames:v','1','-vf','scale=480:-1' if w>h else 'scale=180:-1','-q:v','3','-y',str(f)])
            cells.append((Image.open(f).copy(),f'{t:.2f}s'))
    cw,ch=(480,298) if w>h else (180,346)
    contact=Image.new('RGB',(cw*3,ch*8),'#172333');draw=ImageDraw.Draw(contact)
    for i,(im,label) in enumerate(cells):
        x=i%3*cw;y=i//3*ch;contact.paste(im,(x,y));draw.text((x+6,y+ch-21),label,fill='#f3f6fa')
    contact.save(Q/f'{shape}-transitions.jpg',quality=92)
    reports.append({'file':str(out),'dimensions':[w,h],'fps':30,'frames':1631,'duration':float(v['duration']),'audio_duration':float(a['duration']),'loudness_lufs':loud,'true_peak_dbfs':peak,'decode':'PASS','unintended_black_frames':'none','freeze_detector':(Q/f'{shape}-freeze-check.txt').read_text().strip() or 'No freezes lasting 1.5 seconds detected.','audio_identical_to_verified_master':True,'audio_pcm_sha256':source_hash,'hero_contact':str(Q/f'{shape}-scenes.jpg'),'transition_contact':str(Q/f'{shape}-transitions.jpg')})
qa={'checkpoint':3,'scope':'First AI Client SOP ad, both formats; review exports','status':'Automated QA passed; visual review pending','duration':D,'exports':reports,'cut_verification':{'status':'PASS','fresh_transcript_words':len(words),'phrase_checks':'8/8','repeated_takes':0,'longest_fresh_gap_seconds':.82,'edl':'edit-decisions/01.final-edl.json','report':'compositions/sop-ad/qc/verify-report.md','editorial_read':'compositions/sop-ad/qc/editorial-review.txt','container_duration_difference_seconds':.000667},'captions':{'groups':len(captions),'all_selected_words_covered':True,'overlapping_groups':0,'editable_json':'compositions/sop-ad/captions.json','srt_sidecars':True},'motion':{'beat_sync':beats['status'],'cta_hold_seconds':beats['cta_hold'],'scene_count':len(scenes),'animation_map':'The optional helper is unavailable because this CLI bundle does not expose @hyperframes/producer. Explicit anchor checks, live Studio checks and rendered seam review are used.'},'audio':'Original selected speech, normalized; no music. Final MP4 audio is byte-identical after decoding to the master checked with fresh transcription.','brand':'Actual AIS PNG sourced from official website; no typeset substitute.'}
(P/'CHECKPOINT-3-QA.json').write_text(json.dumps(qa,indent=2)+'\n')
# Review page shares the established dark review styling.
old=(P/'CHECKPOINT-2.html').read_text();style=old.split('<style>',1)[1].split('</style>',1)[0]
def player(shape,label,dims):
    return f'<article class="panel {"portrait" if shape=="9x16" else ""}"><div class="panel-head"><h2>{label}</h2><small>{dims} · 30 fps</small></div><video controls playsinline preload="metadata" poster="previews/CHECKPOINT-3_SOP_{shape}-Poster.jpg" aria-label="{label} SOP ad"><source src="previews/CHECKPOINT-3_First-AI-Client-SOP_{shape}.mp4" type="video/mp4"></video><div class="panel-body"><div class="links"><a href="previews/CHECKPOINT-3_First-AI-Client-SOP_{shape}.mp4">Open MP4</a><a href="captions/CHECKPOINT-3_First-AI-Client-SOP_{shape}.srt">Caption sidecar</a></div></div></article>'
chapters=''.join(f'<button data-seek="{s["start"]}">{int(s["start"])//60}:{int(s["start"])%60:02d} · {label}</button>' for s,label in zip(scenes,['Opening','The question','Skills to income','Learning loop','Fear of rejection','The SOP','Three benefits','First-client outcomes','Download CTA']))
html=f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIS · Complete SOP ad · Checkpoint 3</title><style>{style}.chapter-buttons{{display:flex;flex-wrap:wrap;gap:9px;margin:20px 0}}button{{font:inherit;font-size:13px;background:#192a3d;color:#d4e5f4;border:1px solid #344b62;border-radius:9px;padding:9px 12px;cursor:pointer}}button:hover{{background:#26415b}}.review{{align-items:start}}.note{{padding:22px 24px}}.note p{{color:#b5c3d4}}.note h2{{margin-bottom:14px}}</style><main><div class="kicker">AIS · Checkpoint 3 · September 30, 2026</div><h1>The complete SOP ad.<br>Ready for your review.</h1><div class="status">54.37 seconds · Landscape + portrait · Approved dark style</div><p class="lede">The final takes, tightened pauses, synchronized captions, official AIS logo and complete graphics sequence—from the opening through the download CTA.</p><div class="review"><div class="stack">{player('16x9','Landscape','1920 × 1080')}<article class="panel note"><h2>Jump to a section</h2><p>These buttons seek both previews so you can compare the same moment.</p><div class="chapter-buttons">{chapters}</div><p>Review the joins around 0:03, 0:14, 0:30 and 0:43, then the closing CTA at 0:50.</p></article></div>{player('9x16','Portrait','1080 × 1920')}</div><div class="decisions"><h2>Review cuts, captions and the CTA</h2><p>Check the delivery and pacing, speech joins, graphics, caption readability, and the final download instruction—especially on your phone.</p><p>Your brief calls for review after this first complete ad. Once approved, the next checkpoint is AI OS and Scrollcraft in both formats.</p></div><div class="checks"><span>Final retake verified</span><span>All spoken words captioned</span><span>Both MP4s fully decoded</span><span>Identical verified audio</span></div><footer><p>Source: clip 01. Five retained source ranges; 33.96 seconds of abandoned material and unnecessary pauses removed. Speech runs at its original speed. No music added.</p><p><a href="CHECKPOINT-3-QA.json">QA notes</a> · <a href="edit-decisions/01.final-edl.json">Source-to-edit map</a> · <a href="STATUS.txt">Current handoff</a> · <a href="CHECKPOINT-2.html">Approved style proof</a></p></footer></main><script>document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{{if(other!==v)other.pause();}})));document.querySelectorAll('[data-seek]').forEach(b=>b.addEventListener('click',()=>document.querySelectorAll('video').forEach(v=>{{v.currentTime=Number(b.dataset.seek)+.8;}})));</script></html>'''
(P/'CHECKPOINT-3.html').write_text(html)
print(json.dumps({'status':'Render and automated QA complete','exports':reports,'review':str(P/'CHECKPOINT-3.html')},indent=2))
