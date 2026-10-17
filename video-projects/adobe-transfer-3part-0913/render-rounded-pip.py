from pathlib import Path
import json,subprocess,hashlib,sys
b=Path(__file__).parent.resolve();a=b/'assets'
out=b/'renders/final/After Effects GPT-6 Astra Tutorial - 1080p Rounded Square.mp4'
# Signed-distance alpha mask with an antialiased 24px corner radius.
alpha="255*clip(24.5-hypot(max(abs(X-179.5)-156\\,0)\\,max(abs(Y-179.5)-156\\,0))\\,0\\,1)"
shape="[camera]crop=1080:1080:2280:0,scale=360:360:flags=lanczos,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='"+alpha+"'[face];[bg][face]overlay=x=W-w-24:y=H-h-24:format=auto,format=yuv420p[out]"
if '--preview' in sys.argv:
 for t in [60,300,590]:
  filters='[0:v]split=2[screen][camera];[screen]crop=1920:1080:0:0[bg];'+shape
  subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(a/'clean-v2.mp4'),'-filter_complex',filters,'-map','[out]','-frames:v','1',str(b/'preview'/f'rounded-layout-{t}.png')],check=True)
 sys.exit()
m=json.loads((b/'run-manifest.json').read_text())
for s in m['source_order']:assert hashlib.file_digest(open(s['path'],'rb'),'sha256').hexdigest()==s['sha256']
assert not out.exists(),str(out)+' already exists'
filters='[0:v]select=concatdec_select,setpts=N/(30*TB),split=2[screen][camera];[screen]crop=1920:1080:0:0[bg];'+shape
with open(a/'rounded-render.log','w') as log:
 subprocess.run(['ffmpeg','-y','-hide_banner','-copyts','-segment_time_metadata','1','-i',str(a/'clean-v2.segments.ffconcat'),'-i',str(a/'clean-v2.mp4'),'-filter_complex',filters,'-map','[out]','-map','1:a:0','-c:v','libx264','-threads','8','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart','-progress',str(a/'rounded-progress.txt'),str(out)],stdout=log,stderr=log,check=True)
(a/'rounded-layout.json').write_text(json.dumps(dict(output=str(out),width=1920,height=1080,screen_crop=[0,0,1920,1080],camera_crop=[2280,0,1080,1080],camera_size=[360,360],camera_position=[1536,696],corner_radius=24,audio='stream copy of verified clean-v2.mp4',edit_ledger='clean-v2.union-edl.json'),indent=2))
print('RENDER COMPLETE',out)
