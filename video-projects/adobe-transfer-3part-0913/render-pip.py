from pathlib import Path
import json,subprocess,hashlib
b=Path(__file__).parent.resolve();a=b/'assets';m=json.loads((b/'run-manifest.json').read_text())
for s in m['source_order']:
 assert hashlib.file_digest(open(s['path'],'rb'),'sha256').hexdigest()==s['sha256'], 'Source changed: '+s['path']
out=b/'renders/final/After Effects GPT-6 Astra Tutorial - 1080p Picture in Picture.mp4'
assert not out.exists(),str(out)+' already exists'
filters='[0:v]select=concatdec_select,setpts=N/(30*TB),split=2[screen][camera];[screen]crop=1920:1080:0:0[bg];[camera]crop=1920:1080:1920:0,scale=480:270:flags=lanczos[face];[bg][face]overlay=x=W-w-24:y=H-h-24[out]'
with open(a/'pip-render.log','w') as log:
 subprocess.run(['ffmpeg','-y','-hide_banner','-copyts','-segment_time_metadata','1','-i',str(a/'clean-v2.segments.ffconcat'),'-i',str(a/'clean-v2.mp4'),'-filter_complex',filters,'-map','[out]','-map','1:a:0','-c:v','libx264','-threads','8','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart','-progress',str(a/'pip-progress.txt'),str(out)],stdout=log,stderr=log,check=True)
(a/'pip-layout.json').write_text(json.dumps(dict(output=str(out),width=1920,height=1080,screen_crop=[0,0,1920,1080],camera_crop=[1920,0,1920,1080],camera_size=[480,270],camera_position=[1416,786],audio='stream copy of verified clean-v2.mp4',edit_ledger='clean-v2.union-edl.json'),indent=2))
print('RENDER COMPLETE',out)
