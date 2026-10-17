from pathlib import Path
import json,subprocess,hashlib
b=Path(__file__).parent.resolve();a=b/'assets';out=b/'renders/final/After Effects GPT-6 Astra Tutorial - 1080p Rounded Square.mp4';src=a/'clean-v2.mp4'
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
p=probe(out);original=probe(src);v=next(s for s in p['streams'] if s['codec_type']=='video');av=next(s for s in p['streams'] if s['codec_type']=='audio');ov=next(s for s in original['streams'] if s['codec_type']=='video')
assert (v['width'],v['height'])==(1920,1080)
assert int(v['nb_frames'])==int(ov['nb_frames'])==17945
assert v['avg_frame_rate']=='30/1'
assert abs(float(v['duration'])-float(ov['duration']))<1/30
assert abs(float(v['duration'])-float(av['duration']))<.025
def audiohash(path):return subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map','0:a:0','-c:a','copy','-f','hash','-hash','sha256','-']).decode().strip()
h=audiohash(out);assert h==audiohash(src),'Audio changed'
r=subprocess.run(['ffmpeg','-v','error','-i',str(out),'-f','null','-'],capture_output=True,check=True);assert not r.stderr,r.stderr
report=dict(result='PASS',output=str(out),width=v['width'],height=v['height'],frames=int(v['nb_frames']),duration=float(v['duration']),av_difference=abs(float(v['duration'])-float(av['duration'])),audio_identical_to_passing_agent_verified_edit=True,audio_packet_hash=h,full_decode='PASS',sha256=hashlib.file_digest(open(out,'rb'),'sha256').hexdigest())
(a/'rounded-qa.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
for t in [0,60,300,475,500,590]:
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(out),'-frames:v','1',str(b/'preview'/f'rounded-final-{t}.jpg')],check=True)
