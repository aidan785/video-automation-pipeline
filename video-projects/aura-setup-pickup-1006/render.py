import json, subprocess, wave
from pathlib import Path
import numpy as np

base = Path(__file__).resolve().parent
assets = base / 'assets'
source = Path('/Users/aidanstanik/Projects/Adobe Transfer Folder/2026-10-06 21-54-32.mov')
sil = json.loads((assets / 'source.silence-edl.json').read_text())
cuts = json.loads((assets / 'approved-cuts.json').read_text())['cuts']
duration = 7666 / 30
deletes = [(d['start'], d['end']) for d in sil['delete_ranges']]
deletes += [(d['source_start'], d['source_end']) for d in cuts]
merged = []
for start, end in sorted(deletes):
    if merged and start <= merged[-1][1]:
        merged[-1][1] = max(end, merged[-1][1])
    else:
        merged.append([start, end])
keep = []
cursor = 0
words = [w for w in json.loads((assets / 'source.json').read_text())['words'] if w['type'] == 'word']
for start, end in merged + [[duration, duration]]:
    lo, hi = round(cursor * 30), round(start * 30)
    if hi > lo and (hi - lo >= 9 or any(lo / 30 < (w['start'] + w['end']) / 2 < hi / 30 for w in words)):
        keep.append((lo, hi))
    cursor = max(cursor, end)
frames = sum(hi - lo for lo, hi in keep)
union_deletes = []
cursor = 0
for lo, hi in keep:
    if lo / 30 > cursor:
        union_deletes.append(dict(start=cursor, end=lo / 30))
    cursor = hi / 30
if cursor < duration:
    union_deletes.append(dict(start=cursor, end=duration))
edl = dict(source_duration=duration, edited_duration=frames / 30,
           keep_ranges=[dict(start=lo / 30, end=hi / 30) for lo, hi in keep],
           delete_ranges=union_deletes, expected_frames=frames, fps=30)
(assets / 'clean.union-edl.json').write_text(json.dumps(edl, indent=2))
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(source), '-vn', '-af',
                'aresample=48000:async=1:first_pts=0,apad,atrim=end_sample=12265600',
                '-ac', '2', '-c:a', 'pcm_s16le', str(assets / 'source.wav')], check=True)
with wave.open(str(assets / 'source.wav'), 'rb') as f:
    samples = np.frombuffer(f.readframes(f.getnframes()), dtype='<i2').reshape(-1, 2)
with wave.open(str(assets / 'clean.wav'), 'wb') as f:
    f.setparams((2, 2, 48000, 0, 'NONE', 'not compressed'))
    for lo, hi in keep:
        chunk = samples[lo * 1600:hi * 1600].copy()
        n = 192
        chunk[:n] = (chunk[:n] * np.linspace(0, 1, n)[:, None]).astype('<i2')
        chunk[-n:] = (chunk[-n:] * np.linspace(1, 0, n)[:, None]).astype('<i2')
        f.writeframesraw(chunk.tobytes())
expr = '+'.join(f'between(n,{lo},{hi-1})' for lo, hi in keep)
(assets / 'clean.filter.txt').write_text(f"[0:v]select='{expr}',setpts=N/(30*TB)[v]")
print(f'Rendering {frames / 30:.3f}s, {frames} frames, {len(keep)} segments', flush=True)
with open(assets / 'render.log', 'w') as log:
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-i', str(source), '-i', str(assets / 'clean.wav'),
        '-/filter_complex', str(assets / 'clean.filter.txt'), '-map', '[v]', '-map', '1:a',
        '-c:v', 'libx264', '-threads', '8', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p',
        '-r', '30', '-g', '30', '-keyint_min', '30', '-sc_threshold', '0',
        '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
        '-progress', str(assets / 'progress.txt'), str(assets / 'clean.mp4')], stdout=log, stderr=log, check=True)
print('Render complete', flush=True)
