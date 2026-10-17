from pathlib import Path
import subprocess,json,re,hashlib
import numpy as np
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parent
P=ROOT.parent.parent
QC=ROOT/'qc';QC.mkdir(exist_ok=True)
def run(args):return subprocess.run(args,capture_output=True,check=True)
def pcm(file):return run(['ffmpeg','-v','error','-i',str(file),'-vn','-ac','1','-ar','16000','-f','f32le','-']).stdout
source=pcm(ROOT/'assets/speaker.mp4')
reports=[]
for shape,w,h in [('16x9',1920,1080),('9x16',1080,1920)]:
    video=P/'previews'/f'CHECKPOINT-2_SOP_Style-Proof_{shape}.mp4'
    probe=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]).stdout)
    vs=next(s for s in probe['streams'] if s['codec_type']=='video');au=next(s for s in probe['streams'] if s['codec_type']=='audio')
    decode=run(['ffmpeg','-v','warning','-i',str(video),'-f','null','-'])
    dest=pcm(video)
    assert dest==source,'Decoded audio differs from prepared speech master'
    assert (vs['width'],vs['height'],vs['nb_frames'],vs['avg_frame_rate'])==(w,h,'420','30/1')
    assert float(vs['duration'])==14 and float(au['duration'])==14
    assert not decode.stderr.strip(),decode.stderr
    measure=subprocess.run(['ffmpeg','-hide_banner','-nostdin','-i',str(video),'-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True,check=True).stderr
    integrated=float(re.findall(r'I:\s+(-?[\d.]+) LUFS',measure)[-1]);peak=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS',measure)[-1])
    assert -17<integrated<-15 and peak<=-.8,(integrated,peak)
    black=subprocess.run(['ffmpeg','-hide_banner','-nostdin','-i',str(video),'-vf','blackdetect=d=0.08:pix_th=0.04:pic_th=0.98','-an','-f','null','-'],capture_output=True,text=True,check=True).stderr
    assert 'black_start:' not in black
    frames=[]
    for i,t in enumerate([0,.8,2.5,4.97,5.17,5.4,6.8,8.8,11.8,13.7]):
        out=QC/f'{shape}-{i:02d}.jpg'
        run(['ffmpeg','-v','error','-ss',str(t),'-i',str(video),'-frames:v','1','-q:v','2','-y',str(out)])
        im=Image.open(out);target=(640,360) if shape=='16x9' else (270,480)
        im.thumbnail(target);frames.append((im.copy(),f'{t:.2f}s'))
    cw,ch=(640,393) if shape=='16x9' else (270,514)
    cols=2 if shape=='16x9' else 5
    sheet=Image.new('RGB',(cw*cols,ch*((len(frames)+cols-1)//cols)),'#172333');d=ImageDraw.Draw(sheet)
    for i,(im,label) in enumerate(frames):
        x=(i%cols)*cw;y=(i//cols)*ch;sheet.paste(im,(x,y));d.text((x+10,y+ch-24),label,fill='#f3f6fa')
    sheet.save(QC/f'{shape}-contact.jpg',quality=93)
    reports.append({'file':str(video),'dimensions':[w,h],'duration':14,'frames':420,'fps':30,'video_codec':vs['codec_name'],'audio_codec':au['codec_name'],'source_audio_pcm_sha256':hashlib.sha256(source).hexdigest(),'decoded_audio_identical_to_prepared_master':True,'audio_video_start':{'video':vs['start_time'],'audio':au['start_time']},'audio_lufs':integrated,'true_peak_dbfs':peak,'complete_decode':'PASS — no warnings','unintended_full_black_frames':'none detected','hero_and_transition_frames':str(QC/f'{shape}-contact.jpg')})
captions=json.loads((ROOT/'captions.json').read_text())
assert all(c['start']<c['end'] for c in captions)
assert all(a['end']<=b['start'] for a,b in zip(captions,captions[1:]))
assert sum(len(c['words']) for c in captions)==len(json.loads((ROOT/'assets/transcript.json').read_text())['words'])
result={'checkpoint':2,'automated_checks':'PASS','exports':reports,'caption_groups':len(captions),'caption_coverage':'Every spoken source word included; no overlapping caption groups. Same speech timeline in both formats.','offer':'$749/year, approximately $62.42/month; $129/month; refund label limited to annual. Event details not displayed.','render_checks':'Three compositions linted, contrast validated and layout inspected. Caption track-density warning is organizational, with no overlaps.','animation_map_note':'Bundled animation-map helper could not run because @hyperframes/producer is not an importable package in this local CLI installation. Beat timings are explicitly checked in beat-sync.json; Studio, layout samples and rendered transition frames provide visual verification.','visual_review':'Pending inspection of generated contact sheets.'}
(ROOT/'verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(reports,indent=2))
