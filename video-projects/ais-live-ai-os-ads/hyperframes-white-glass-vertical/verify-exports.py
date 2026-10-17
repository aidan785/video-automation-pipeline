from pathlib import Path
import json, subprocess, math
import numpy as np
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parent
specs=json.loads((ROOT/'scenes.json').read_text())
report=[]
def pcm(path):
    return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-vn','-ac','1','-ar','16000','-f','f32le','-']),dtype=np.float32)
for spec in specs:
    d=ROOT/spec['dir']; vid=d/'renders/white-glass.mp4'; q=d/'qc';q.mkdir(exist_ok=True)
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(vid)]))
    video=next(s for s in probe['streams'] if s['codec_type']=='video')
    audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
    decode=subprocess.run(['ffmpeg','-v','warning','-i',str(vid),'-f','null','-'],capture_output=True,text=True)
    a=pcm(d/'assets/speaker.mp4');b=pcm(vid);n=min(len(a),len(b));corr=float(np.corrcoef(a[:n],b[:n])[0,1])
    items=[]
    for i,s in enumerate(spec['scenes']):
        t=min(s[1]-.5,s[0]+2);out=q/f'scene-{i+1}.jpg'
        subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',str(vid),'-frames:v','1','-q:v','2','-y',str(out)],check=True)
        items.append((Image.open(out).resize((405,720)),f'Scene {i+1} / {t:.2f}s'))
    sheet=Image.new('RGB',(1215,750*math.ceil(len(items)/3)),'#e7ecf0');dr=ImageDraw.Draw(sheet)
    for i,(im,label) in enumerate(items):
        x=(i%3)*405;y=(i//3)*750;sheet.paste(im,(x,y));dr.text((x+15,y+727),label,fill='#182431')
    sheet.save(q/'contact.jpg',quality=93)
    for label,t in [('opening',0),('closing',float(video.get('duration',probe['format']['duration']))-.07)]:
        subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',str(vid),'-frames:v','1','-q:v','2','-y',str(q/f'{label}.jpg')],check=True)
    info={'ad':spec['name'],'dimensions':[video['width'],video['height']],'fps':video['avg_frame_rate'],'duration':probe['format']['duration'],'audio_codec':audio['codec_name'],'audio_correlation_to_verified_edit':round(corr,6),'audio_duration_difference_seconds':round(abs(len(a)-len(b))/16000,6),'full_decode_exit_code':decode.returncode,'decode_warnings':decode.stderr.strip(),'hero_frames_reviewed':len(spec['scenes'])}
    assert video['width']==1080 and video['height']==1920 and corr>.99 and decode.returncode==0 and not decode.stderr.strip(), info
    report.append(info);print(json.dumps(info),flush=True)
(ROOT/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
