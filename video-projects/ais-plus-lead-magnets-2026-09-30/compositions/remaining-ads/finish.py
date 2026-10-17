from pathlib import Path
import json,subprocess,re,hashlib,shutil,math,sys
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parent;P=R.parent.parent
run=lambda args:subprocess.run(args,capture_output=True,check=True)
def pcm(f):return run(['ffmpeg','-v','error','-i',str(f),'-vn','-ac','1','-ar','16000','-f','f32le','-']).stdout
for slug in sys.argv[1:] or ['ai-os-ad','scrollcraft-ad']:
 root=R.parent/slug;q=root/'qc';c=json.loads((root/'production.json').read_text());D=c['duration'];scenes=json.loads((root/'scene-plan.json').read_text());caps=json.loads((root/'captions.json').read_text());beats=json.loads((root/'beat-sync.json').read_text());tr=json.loads((root/'assets/transcript.json').read_text());fresh=json.loads((q/'clean-fresh.json').read_text());normal=lambda s:re.sub('[^a-z0-9]+',' ',s.lower()).strip();assert normal(tr['text'])==normal(fresh['text']);assert sum(len(x['words']) for x in caps)==len(tr['words']);assert all(a['end']<=b['start'] for a,b in zip(caps,caps[1:]));master=root/'assets/speaker.mp4';audio=pcm(master);reports=[]
 for fmt,shape,w,h in [('landscape','16x9',1920,1080),('portrait','9x16',1080,1920)]:
  out=P/f'previews/CHECKPOINT-4_{c["stem"]}_{shape}.mp4';run(['ffmpeg','-v','error','-i',str(root/fmt/'renders/ad-render.mp4'),'-i',str(master),'-map','0:v:0','-map','1:a:0','-c','copy','-t',str(D),'-movflags','+faststart','-y',str(out)])
  probe=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(out)]).stdout);v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio');assert (v['width'],v['height'])==(w,h);assert int(v['nb_frames'])==c['frames'];assert v['avg_frame_rate']=='30/1';assert abs(float(v['duration'])-D)<.002;assert abs(float(a['duration'])-D)<.003
  decode=run(['ffmpeg','-v','warning','-i',str(out),'-f','null','-']);assert not decode.stderr.strip(),decode.stderr;assert pcm(out)==audio
  measure=run(['ffmpeg','-hide_banner','-i',str(out),'-af','ebur128=peak=true','-f','null','-']).stderr.decode();loud=float(re.findall(r'I:\s+(-?[\d.]+) LUFS',measure)[-1]);peak=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS',measure)[-1]);assert -17<loud<-15 and peak<=-.8,(loud,peak)
  check=run(['ffmpeg','-hide_banner','-i',str(out),'-vf','blackdetect=d=0.08:pix_th=0.04:pic_th=0.98,freezedetect=n=0.002:d=1.5','-an','-f','null','-']).stderr.decode();assert 'black_start:' not in check;freeze='\n'.join(x for x in check.splitlines() if 'freeze_' in x);(q/f'{shape}-freeze-check.txt').write_text(freeze or 'No freezes lasting 1.5 seconds detected.');assert not freeze,freeze
  times=[min(s['end']-.85,s['start']+max(1.3,(s['end']-s['start'])*.8)) for s in scenes];thumbs=[]
  for i,t in enumerate(times):
   f=q/f'{shape}-scene-{i+1:02d}.jpg';run(['ffmpeg','-v','error','-ss',str(t),'-i',str(out),'-frames:v','1','-q:v','2','-y',str(f)]);im=Image.open(f);im.thumbnail((640,360) if w>h else (300,534));thumbs.append((im.copy(),f'{scenes[i]["id"]} {t:.2f}s'))
  cw,ch=(640,393) if w>h else (300,566);sheet=Image.new('RGB',(cw*3,ch*math.ceil(len(scenes)/3)),'#172333');draw=ImageDraw.Draw(sheet)
  for i,(im,label) in enumerate(thumbs):x=i%3*cw;y=i//3*ch;sheet.paste(im,(x,y));draw.text((x+8,y+ch-23),label,fill='#f3f6fa')
  sheet.save(q/f'{shape}-scenes.jpg',quality=93);poster_i=11 if slug=='ai-os-ad' else 2;shutil.copy2(q/f'{shape}-scene-{poster_i+1:02d}.jpg',P/f'previews/CHECKPOINT-4_{c["stem"]}_{shape}-Poster.jpg')
  cells=[]
  for i,s in enumerate(scenes[1:]):
   for dt in [-.1,.17,.7]:
    t=max(0,s['start']+dt);f=q/f'{shape}-seam-{i}-{dt}.jpg';run(['ffmpeg','-v','error','-ss',str(t),'-i',str(out),'-frames:v','1','-vf','scale=480:-1' if w>h else 'scale=180:-1','-q:v','3','-y',str(f)]);cells.append((Image.open(f).copy(),f'{t:.2f}s'))
  cw,ch=(480,298) if w>h else (180,346);sheet=Image.new('RGB',(cw*3,ch*(len(scenes)-1)),'#172333');draw=ImageDraw.Draw(sheet)
  for i,(im,label) in enumerate(cells):x=i%3*cw;y=i//3*ch;sheet.paste(im,(x,y));draw.text((x+6,y+ch-21),label,fill='#f3f6fa')
  sheet.save(q/f'{shape}-transitions.jpg',quality=92)
  # Each inserted recording must visibly advance inside its own picture, independently of Nate.
  motions=[]
  for s in [s for s in scenes if s.get('video')]:
   x,y,vw,vh=(97,374,804,452) if fmt=='landscape' else (126,410,828,465)
   arrays=[]
   for dt in [1.0,2.0]:
    raw=run(['ffmpeg','-v','error','-ss',str(s['start']+dt),'-i',str(out),'-frames:v','1','-vf',f'crop={vw}:{vh}:{x}:{y},scale=160:90,format=gray','-f','rawvideo','-']).stdout;arrays.append(raw)
   mad=sum(abs(a-b) for a,b in zip(*arrays))/len(arrays[0]);assert mad>.2,(shape,s['id'],mad);motions.append({'scene':s['id'],'mean_pixel_change':round(mad,3),'status':'advancing'})
  reports.append({'file':str(out),'dimensions':[w,h],'fps':30,'frames':c['frames'],'duration':float(v['duration']),'audio_duration':float(a['duration']),'loudness_lufs':loud,'true_peak_dbfs':peak,'decode':'PASS','unintended_black_frames':0,'unintended_freezes':0,'audio_identical_to_verified_master':True,'audio_pcm_sha256':hashlib.sha256(audio).hexdigest(),'demo_motion':motions,'hero_contact':str(q/f'{shape}-scenes.jpg'),'transition_contact':str(q/f'{shape}-transitions.jpg')})
  print(slug,shape,'QA passed',flush=True)
 fw=[x for x in fresh['words'] if x.get('type','word')=='word'];qa={'checkpoint':4,'ad':c['title'],'status':'Automated QA passed; visual inspection pending','duration':D,'exports':reports,'cut_verification':{'status':'PASS','selected_words':len(tr['words']),'fresh_transcript_matches':True,'silence_threshold_seconds':1.0,'longest_gap_seconds':round(max(b['start']-a['end'] for a,b in zip(fw,fw[1:])),3),'report':str(q/'verify-report.md'),'editorial_review':str(q/'editorial-review.txt')},'captions':{'groups':len(caps),'all_words_covered':True,'overlaps':0,'spelling_correction':'CloudCode transcription token displayed as Claude Code.','editable':str(root/'captions.json')},'motion':{'beat_sync':beats['status'],'cta_hold_seconds':beats['cta_hold'],'scene_count':len(scenes)},'brand':'Actual AIS PNG; approved dark White Glass design.'}
 (root/'QA.json').write_text(json.dumps(qa,indent=2)+'\n')
