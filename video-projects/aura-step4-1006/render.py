import json, math, subprocess, wave
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import numpy as np

base = Path(__file__).resolve().parent
a = base / 'assets'
sources = [('aura1', 47239), ('aura2', 2288)]
global_keeps, global_words, windows, source_info = [], [], [], []
source_offset = 0
for name, frame_count in sources:
    source = Path('/Users/aidanstanik/Projects/Adobe Transfer Folder') / (name + '.mov')
    sil = json.loads((a / (name + '.silence-edl.json')).read_text())
    cuts = json.loads((a / (name + '.source-cuts.json')).read_text())
    words = [w for w in json.loads((a / (name + '.json')).read_text())['words'] if w['type'] == 'word']
    global_words += [dict(w, start=w['start']+source_offset/30, end=w['end']+source_offset/30) for w in words]
    merged = []
    for d in sorted(sil['delete_ranges'] + cuts, key=lambda d:d['start']):
        if merged and d['start'] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], d['end'])
        else:
            merged.append([d['start'], d['end']])
    keeps, cursor = [], 0
    for start, end in merged + [[frame_count/30, frame_count/30]]:
        lo, hi = round(cursor*30), round(start*30)
        if hi > lo and (hi-lo >= 9 or any(lo/30 < (w['start']+w['end'])/2 < hi/30 for w in words)):
            keeps.append((lo, hi))
            global_keeps.append(dict(start=(source_offset+lo)/30, end=(source_offset+hi)/30))
        cursor = max(cursor, end)
    groups = []
    for k in keeps:
        if groups and k[0]-groups[-1][-1][1] < 30*30:
            groups[-1].append(k)
        else:
            groups.append([k])
    for group in groups:
        windows.append(dict(name=name, source=source, keeps=group, anchor=group[0][0]//30, end=math.ceil(group[-1][1]/30)))
    source_info.append(dict(name=name, frame_offset=source_offset, frames=frame_count, edited_frames=sum(hi-lo for lo,hi in keeps)))
    source_offset += frame_count

deletes, cursor = [], 0
for k in global_keeps:
    if k['start'] > cursor:
        deletes.append(dict(start=cursor,end=k['start']))
    cursor = k['end']
if cursor < source_offset/30:
    deletes.append(dict(start=cursor,end=source_offset/30))
frames = sum(round((k['end']-k['start'])*30) for k in global_keeps)
edl = dict(source_duration=source_offset/30, edited_duration=frames/30, keep_ranges=global_keeps,
           delete_ranges=deletes, expected_frames=frames, sources=source_info)
(a/'clean.union-edl.json').write_text(json.dumps(edl,indent=2))
(a/'source.json').write_text(json.dumps(dict(words=global_words,audio_duration_secs=source_offset/30),indent=2))
kept_words = [w for w in global_words if any(k['start'] <= (w['start']+w['end'])/2 < k['end'] for k in global_keeps)]
(a/'expected-script.txt').write_text(' '.join(w['text'] for w in kept_words))
print(json.dumps(dict(edited_seconds=frames/30,frames=frames,windows=len(windows),sources=source_info)),flush=True)

def render_window(item):
    i, w = item
    prefix = a/f'window-{i}'
    anchor = w['anchor']
    local = [(lo-anchor*30,hi-anchor*30) for lo,hi in w['keeps']]
    sample_count = (w['end']-anchor)*48000
    subprocess.run(['ffmpeg','-y','-v','error','-ss',str(anchor),'-t',str(w['end']-anchor),'-i',str(w['source']),
        '-vn','-af',f'aresample=48000:async=1:first_pts=0,apad,atrim=end_sample={sample_count}',
        '-ac','2','-c:a','pcm_s16le',str(prefix)+'.wav'],check=True)
    with wave.open(str(prefix)+'.wav','rb') as f:
        samples=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').reshape(-1,2)
    with wave.open(str(prefix)+'.cut.wav','wb') as f:
        f.setparams((2,2,48000,0,'NONE','not compressed'))
        for lo,hi in local:
            chunk=samples[lo*1600:hi*1600].copy()
            assert len(chunk)==(hi-lo)*1600
            n=192
            chunk[:n]=(chunk[:n]*np.linspace(0,1,n)[:,None]).astype('<i2')
            chunk[-n:]=(chunk[-n:]*np.linspace(1,0,n)[:,None]).astype('<i2')
            f.writeframesraw(chunk.tobytes())
    expr='+'.join(f'between(n,{lo},{hi-1})' for lo,hi in local)
    Path(str(prefix)+'.filter.txt').write_text(f"[0:v]select='{expr}',setpts=N/(30*TB)[v]")
    with open(str(prefix)+'.log','w') as log:
        subprocess.run(['ffmpeg','-y','-hide_banner','-ss',str(anchor),'-t',str(w['end']-anchor),'-i',str(w['source']),
            '-/filter_complex',str(prefix)+'.filter.txt','-map','[v]','-an','-c:v','libx264','-threads','4',
            '-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','30','-g','30','-keyint_min','30',
            '-sc_threshold','0','-video_track_timescale','30000',str(prefix)+'.mp4'],stdout=log,stderr=log,check=True)
    print('Rendered window',i,flush=True)

with ThreadPoolExecutor(max_workers=2) as pool:
    list(pool.map(render_window,enumerate(windows)))
with wave.open(str(a/'clean.wav'),'wb') as out:
    out.setparams((2,2,48000,0,'NONE','not compressed'))
    for i in range(len(windows)):
        with wave.open(str(a/f'window-{i}.cut.wav'),'rb') as inp:
            out.writeframesraw(inp.readframes(inp.getnframes()))
(a/'concat.txt').write_text(''.join(f"file 'window-{i}.mp4'\n" for i in range(len(windows))))
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(a/'concat.txt'),'-i',str(a/'clean.wav'),
    '-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',str(a/'clean.mp4')],check=True)
print('Render complete',flush=True)
