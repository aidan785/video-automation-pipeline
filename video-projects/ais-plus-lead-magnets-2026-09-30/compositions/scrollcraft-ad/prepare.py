from pathlib import Path
import json, subprocess, shutil

ROOT=Path(__file__).resolve().parent
P=ROOT.parent.parent
A=ROOT/'assets'
A.mkdir(exist_ok=True)
FPS=30
SOURCE_DURATION=64.426833
src=P/'raw/03 AD - Scrollcraft.mp4'
plan=json.loads((P/'edit-decisions/03.proposed-edl.json').read_text())
# Quantize the proposed silence boundaries to the 30 fps source clock.
# All four interior joins have at least 170 ms of word clearance on each side.
keeps=[]
cursor=0
for i,k in enumerate(plan['keep']):
    a,b=round(k['source_start']*FPS),round(k['source_end']*FPS)
    n=b-a
    keeps.append({'source_start_frame':a,'source_end_frame':b,'start':a/FPS,'end':b/FPS,'source_start':a/FPS,'source_end':b/FPS,'edit_start':cursor/FPS,'edit_end':(cursor+n)/FPS,'frames':n})
    cursor+=n
D=cursor/FPS
deletes=[]
prev=0
for k in keeps:
    deletes.append({'start':prev,'end':k['start']})
    prev=k['end']
deletes.append({'start':prev,'end':SOURCE_DURATION})
edl={'source':str(src.resolve()),'source_duration':SOURCE_DURATION,'fps':FPS,'frames':cursor,'edited_duration':D,'removed':SOURCE_DURATION-D,'delete_ranges':deletes,'keep_ranges':keeps,'authorization':'User approved complete SOP ad and authorized Checkpoint 4 AI OS and Scrollcraft in both formats, with final takes and tightened pauses.','notes':['Single source-clock render; preserve selected speech and use the final complete take.','Frame boundaries rounded from intake proposal, maximum adjustment 13.34 ms.','10 ms audio fades occur entirely within retained silence padding.']}
(A/'clean.union-edl.json').write_text(json.dumps(edl,indent=2)+'\n')
(P/'edit-decisions/03.final-edl.json').write_text(json.dumps(edl,indent=2)+'\n')
words=json.loads((P/'transcripts/03.review.json').read_text())['words']
selected=[]
for k in keeps:
    for w in words:
        if w.get('type','word')!='word':continue
        if k['start']<=w['start'] and w['end']<=k['end']:
            selected.append(dict(w,source_start=w['start'],source_end=w['end'],start=round(k['edit_start']+w['start']-k['start'],6),end=round(k['edit_start']+w['end']-k['start'],6)))
transcript={'source':'03 Scrollcraft ad, selected final takes','audio_duration_secs':D,'duration':D,'text':' '.join(w['text'] for w in selected),'words':selected}
(A/'transcript.json').write_text(json.dumps(transcript,indent=2)+'\n')
(A/'selected-script.txt').write_text(transcript['text']+'\n')
script=json.loads((P/'scripts/ads-video-script-only.json').read_text())[2]['spoken_reference']
(A/'written-script.txt').write_text(script)
checks=[{'phrase': 'Scrollcraft', 'expect': 2}, {'phrase': 'flat and lifeless', 'expect': 1}, {'phrase': "The link's below", 'expect': 1}]
(A/'verify-phrases.json').write_text(json.dumps(checks,indent=2)+'\n')
N=len(keeps)
filters=[f'[0:v]fps=fps=30:start_time=0,scale=1920:1080:in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,setsar=1,format=yuv420p,split={N}'+''.join(f'[vs{i}]' for i in range(N)),f'[0:a]aresample=48000:async=1:first_pts=0,asplit={N}'+''.join(f'[as{i}]' for i in range(N))]
for i,k in enumerate(keeps):
    dur=k['frames']/FPS
    filters.append(f"[vs{i}]trim=start_frame={k['source_start_frame']}:end_frame={k['source_end_frame']},setpts=N/(30*TB)[v{i}]")
    filters.append(f"[as{i}]atrim=start_sample={k['source_start_frame']*1600}:end_sample={k['source_end_frame']*1600},asetpts=N/SR/TB,afade=t=in:d=0.01,afade=t=out:st={dur-.01:.9f}:d=0.01[a{i}]")
filters.append(''.join(f'[v{i}][a{i}]' for i in range(N))+f'concat=n={N}:v=1:a=1[v][a]')
filterfile=A/'source-cut.ffgraph';filterfile.write_text(';\n'.join(filters))
def run(args):subprocess.run(args,check=True)
run(['ffmpeg','-v','error','-nostdin','-i',str(src),'-filter_complex_script',str(filterfile),'-map','[v]','-map','[a]','-c:v','libx264','-preset','fast','-crf','18','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','pcm_s16le','-t',str(D),'-y',str(A/'clean-original.mkv')])
run(['ffmpeg','-v','error','-i',str(A/'clean-original.mkv'),'-vn','-c:a','pcm_s16le','-y',str(A/'voice-original.wav')])
measure=subprocess.run(['ffmpeg','-hide_banner','-nostdin','-i',str(A/'voice-original.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
stats=json.JSONDecoder().raw_decode(measure[measure.rfind('{'):])[0]
(A/'loudness-measurement.json').write_text(json.dumps(stats,indent=2)+'\n')
norm=f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true"
run(['ffmpeg','-v','error','-i',str(A/'voice-original.wav'),'-af',norm,'-ar','48000','-c:a','pcm_s16le','-y',str(A/'voice.wav')])
run(['ffmpeg','-v','error','-i',str(A/'clean-original.mkv'),'-i',str(A/'voice.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t',str(D),'-movflags','+faststart','-y',str(A/'speaker.mp4')])
run(['ffmpeg','-v','error','-ss','1','-i',str(A/'speaker.mp4'),'-frames:v','1','-q:v','2','-y',str(A/'speaker-poster.jpg')])
for name in ['Inter-Variable.ttf','gsap.min.js','ais-official-mark.png']:
    shutil.copy2(ROOT.parent/'dark-style-proof/assets'/name,A/name)
print(json.dumps({'duration':D,'frames':cursor,'words':len(selected),'joins':[k['edit_start'] for k in keeps[1:]],'clean_video':str(A/'speaker.mp4')},indent=2))
