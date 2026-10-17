from pathlib import Path
import json, subprocess, shutil
ROOT=Path(__file__).resolve().parent
PROJECT=ROOT.parent.parent
WORK=PROJECT.parent.parent
ASSETS=ROOT/'assets'
ASSETS.mkdir(parents=True,exist_ok=True)
def run(args):
    subprocess.run(args,check=True)
src=PROJECT/'raw/01 AD - First AI Automation Client SOP.mp4'
start,end=56.9,70.9
# Decode original presentation clock, then trim both modalities to the same span.
vf=f'trim=start={start}:end={end},setpts=PTS-STARTPTS,fps=30,scale=1920:1080:in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,setsar=1,format=yuv420p'
af=f'aresample=48000:async=1:first_pts=0,atrim=start={start}:end={end},asetpts=PTS-STARTPTS'
run(['ffmpeg','-v','error','-nostdin','-i',str(src),'-filter_complex',f'[0:v]{vf}[v];[0:a]{af}[a]','-map','[v]','-map','[a]','-t','14','-c:v','libx264','-preset','fast','-crf','18','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','pcm_s16le','-y',str(ASSETS/'source-excerpt.mkv')])
run(['ffmpeg','-v','error','-nostdin','-i',str(ASSETS/'source-excerpt.mkv'),'-vn','-c:a','pcm_s16le','-y',str(ASSETS/'voice-original.wav')])
# Measure the short excerpt, then normalize in two passes with true-peak control.
measurement=subprocess.run(['ffmpeg','-hide_banner','-nostdin','-i',str(ASSETS/'voice-original.wav'),'-af','loudnorm=I=-16:TP=-1:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
stats=json.JSONDecoder().raw_decode(measurement[measurement.rfind('{'):])[0]
(ASSETS/'loudness-measurement.json').write_text(json.dumps(stats,indent=2))
norm=f"loudnorm=I=-16:TP=-1:LRA=11:measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true:print_format=json"
run(['ffmpeg','-v','error','-nostdin','-i',str(ASSETS/'voice-original.wav'),'-af',norm,'-ar','48000','-c:a','pcm_s16le','-y',str(ASSETS/'voice.wav')])
run(['ffmpeg','-v','error','-nostdin','-i',str(ASSETS/'source-excerpt.mkv'),'-i',str(ASSETS/'voice.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','14','-movflags','+faststart','-y',str(ASSETS/'speaker.mp4')])
run(['ffmpeg','-v','error','-nostdin','-ss','1.0','-i',str(ASSETS/'speaker.mp4'),'-frames:v','1','-q:v','2','-y',str(ASSETS/'speaker-poster.jpg')])
run(['ffmpeg','-v','error','-nostdin','-ss','333.5','-i',str(PROJECT/'raw/08 VSL CORE BODY.mp4'),'-frames:v','1','-vf','scale=1920:1080:in_range=full:out_range=full:in_color_matrix=bt601:out_color_matrix=bt709','-q:v','2','-y',str(ASSETS/'vsl-offer-speaker.jpg')])
for source,name in [(WORK/'video-projects/ais-live-ai-os-ads/assets/fonts/Inter-Variable.ttf','Inter-Variable.ttf'),(WORK/'video-projects/ais-plus-live-promo/assets/gsap.min.js','gsap.min.js')]:
    shutil.copyfile(source,ASSETS/name)
words=json.loads((PROJECT/'transcripts/01.review.json').read_text())['words']
words=[dict(w,source_start=w['start'],source_end=w['end'],start=round(w['start']-start,3),end=round(w['end']-start,3)) for w in words if start<=w['start'] and w['end']<=end]
(ASSETS/'transcript.json').write_text(json.dumps({'source':'01 SOP ad','source_start':start,'source_end':end,'duration':14,'words':words},indent=2))
(ROOT/'sample-selection.json').write_text(json.dumps({'clip':'01','source_interval':[start,end],'sample_duration':14,'fps':30,'take':'Final complete SOP benefits take, 57.08–70.24 source seconds','internal_speech_cuts':0,'audio':'Source-clock aligned; normalized separately, then remuxed from the verified speaker MP4 after visual rendering.'},indent=2))
print('Prepared 14-second final-take excerpt, normalized audio and source-clock word data.',flush=True)
