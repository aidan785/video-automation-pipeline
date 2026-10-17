from pathlib import Path
import subprocess,json,shutil,re
ROOT=Path(__file__).resolve().parent
P=ROOT.parent.parent
DEST=Path('/Volumes/Extreme SSD/Uppit AI/AIS Live/October /Ads/2026-09-30 - Lead Magnets and AIS Plus/_checkpoints/02-dark-style-proof')
for folder,shape in [('landscape','16x9'),('portrait','9x16')]:
    subprocess.run(['ffmpeg','-v','error','-nostdin','-i',str(ROOT/folder/'renders/style-proof-render.mp4'),'-i',str(ROOT/'assets/speaker.mp4'),'-map','0:v:0','-map','1:a:0','-c','copy','-t','14','-movflags','+faststart','-y',str(P/'previews'/f'CHECKPOINT-2_SOP_Style-Proof_{shape}.mp4')],check=True)
# Refresh review posters and the offer still from the actual corrected renders.
for shape,label in [('16x9','Landscape'),('9x16','Portrait')]:
    subprocess.run(['ffmpeg','-v','error','-ss','11.8','-i',str(P/'previews'/f'CHECKPOINT-2_SOP_Style-Proof_{shape}.mp4'),'-frames:v','1','-q:v','2','-y',str(P/'previews'/f'CHECKPOINT-2_SOP_{label}-Hero.jpg')],check=True)
subprocess.run(['ffmpeg','-v','error','-ss','0.5','-i',str(ROOT/'vsl-offer/renders/style-proof-render.mp4'),'-frames:v','1','-y',str(P/'previews/CHECKPOINT-2_VSL_Offer-Frame.png')],check=True)
subprocess.run(['python3',str(ROOT/'verify-proof.py')],check=True)
# The rendered speech must still match the selected source and caption wording.
fresh=json.loads((ROOT/'qc/rendered-transcript.json').read_text())['text']
expected=' '.join(w['text'] for w in json.loads((ROOT/'assets/transcript.json').read_text())['words'])
norm=lambda s:re.sub(r'[^a-z0-9]+',' ',s.lower()).strip()
assert norm(fresh)==norm(expected),(fresh,expected)
q=json.loads((ROOT/'verification.json').read_text())
q['rendered_speech_check']='Fresh Scribe transcript matches selected source words, ignoring punctuation.'
q['visual_review']='Logo revision: automated render checks complete; inspect refreshed hero/contact frames and offer still before final review handoff.'
q['brand_asset']=json.loads((P/'visual-assets/brand-source.json').read_text())
q['motion_design_review']={'palette':'User-approved dark direction; one restrained blue accent','timeline':'14s, registered paused timeline, no black gaps','rhythm':'Calm reference pacing; deliberate reading holds; benefit entrances lead speech by 0.04–0.247s','callback':'The SOP concept resolves into its three benefits','user_overrides':'White Glass and Inter supersede broadcast grid/chrome/1.5s scene defaults. This is a middle passage style sample, so no separate CTA/outro hold.'}
(ROOT/'verification.json').write_text(json.dumps(q,indent=2)+'\n')
shutil.copyfile(ROOT/'verification.json',P/'CHECKPOINT-2-QA.json')
if not (P/'APPROVALS.json').exists():
    (P/'APPROVALS.json').write_text(json.dumps({'date':'2026-09-30','checkpoint_1':{'status':'approved to continue','user_message':'you can continue','scope':'Proceed to Checkpoint 2 dark style proof, then stop.'},'visual_assets':{'decision':'Use the script to create explanatory graphics as in the original ads. Additional product documents/demo links are optional, not prerequisites.'},'captions':'Styled V2 / White Glass, adapted to dark mode; preserve editable data and SRT sidecars.','annual_display':'$749/year + approximately $62.42/month','checkpoint_2':{'status':'awaiting review','deliverables':['14-second landscape sample','14-second portrait sample','VSL offer frame']},'event_frequency':'Unresolved; user unsure. Resolve before VSL final offer/copy sign-off.'},indent=2)+'\n')
status='''CHECKPOINT 2 COMPLETE — AWAITING STYLE REVIEW
Deadline: end of day Friday October 2, 2026, Central Time.

Checkpoint 1 approved: user said “you can continue” after clarification that scripts and footage are sufficient. Additional product/source links are optional. Use script-led explanatory graphics and real existing proof where relevant; do not invent product screenshots or testimonials.

Completed this checkpoint:
- Revision: actual AIS logo from the official website replaces plain text in both samples and the offer frame.
- Scrollcraft repository and YouTube references received. AI OS and SOP use script-led graphics; no further asset requests pending.
- 14-second SOP style proof in 1920×1080 and 1080×1920, 30 fps.
- Dark White Glass adaptation using existing Inter/font/GSAP/layout sources.
- Final SOP take, original source 56.90–70.90 s; no internal speech cuts.
- Styled synchronized captions with editable JSON and two SRT sidecars.
- VSL offer still with $749/year, approximately $62.42/month, $129/month alternative and annual-only refund scope.
- Native portrait reflow; contrast/layout checks; full MP4 decoding; identical decoded audio in both versions; selected speech matched by fresh transcription; hero/transition still inspection.

Review: CHECKPOINT-2.html
Local URL while review server is running: http://127.0.0.1:8766/CHECKPOINT-2.html
Editable source: compositions/dark-style-proof/build.mjs
Render/finish: each composition npm run render, then python3 compositions/dark-style-proof/finalize.py
QA: CHECKPOINT-2-QA.json

Next after style approval: Checkpoint 3 — finish the SOP ad in both formats, review its cuts, captions, graphics, audio and CTA, then stop for approval. Do not render the remaining campaign batch yet.

Unresolved for later VSL production:
- Quarterly vs. three virtual events per year, including dependent $1,097 savings.
- Spoken over 3,500 builders vs. scripted over 3,600; retain speech pending direction.
- Ads 02/03 add “any other AI agent”; preserve spoken version provisionally, without inventing extra compatibility proof.

All eight original files remain on the external SSD via raw/ symlink. Earlier White Glass projects and exports are unchanged. Checkpoint proofs are in previews/, separate from the final exports/. Nothing uploaded externally. Confirm upload destination before final external delivery.
'''
(P/'STATUS.txt').write_text(status)
# Update the earlier review banner so reopening that link does not imply a stale gate.
old=P/'CHECKPOINT-1.html'
s=old.read_text()
s=s.replace('<b>Review gate: no styled videos have been built.</b> Your supplied brief says to stop after Checkpoint 1. The next approved step is a 10–15 second dark style proof in both formats, plus a VSL offer/proof frame.','<b>Checkpoint 1 approved.</b> The dark-style samples are now ready in <a href="CHECKPOINT-2.html">Checkpoint 2</a>. This intake plan is preserved as a reference.')
old.write_text(s)
assets=P/'visual-assets/asset-requests.json';d=json.loads(assets.read_text())
d['current_direction']='User clarified that script-led graphics are sufficient. Product/doc/demo links are optional, not production prerequisites.'
for a in d['assets']:
    if a['status'] in ['Needed','Priority asset','Needed or text-led']:a['status']='Optional reference; script-led graphics authorized'
assets.write_text(json.dumps(d,indent=2)+'\n')
DEST.mkdir(parents=True,exist_ok=True)
for sub in ['previews','captions']:
    (DEST/sub).mkdir(exist_ok=True)
    for f in (P/sub).glob('CHECKPOINT-2*'):
        if f.suffix in ['.mp4','.png','.jpg','.srt']:shutil.copy2(f,DEST/sub/f.name)
for name in ['CHECKPOINT-2.html','CHECKPOINT-2-QA.json','STATUS.txt','APPROVALS.json']:
    shutil.copy2(P/name,DEST/name)
bundle=DEST/'CHECKPOINT-2.html'
bundle.write_text(bundle.read_text().replace(' · <a href="CHECKPOINT-1.html">Intake and edit plan</a>',' · Intake plan preserved in the workspace'))
manifest={'checkpoint':2,'kind':'Review samples, not final campaign exports','workspace':str(P),'delivery_copy':str(DEST),'files':[str(f.relative_to(DEST)) for f in DEST.rglob('*') if f.is_file() and not f.name.startswith('._')],'next':'Review dark palette, Inter typography/captions, framing and motion; approve before the complete SOP ad.'}
(P/'checkpoint-2-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');shutil.copy2(P/'checkpoint-2-manifest.json',DEST/'manifest.json')
print('Checkpoint 2 files and SSD review copies finalized.')
