import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np

base = Path(__file__).resolve().parent
assets = base / 'assets'
version = next((arg for arg in sys.argv[1:] if not arg.startswith('--')), 'v1')
manifest = json.loads((base / 'run-manifest.json').read_text())
fps = 30
parts = manifest['source_order']
for index, part in enumerate(parts, 1):
    probe = json.loads((assets / f'part{index}.probe.json').read_text())
    video = next(stream for stream in probe['streams'] if stream['codec_type'] == 'video')
    # Input seeking uses the container start. Part 1's first video frame is
    # 2/30 seconds after that start; its normalized edit timeline starts at 0.
    part['seek_bias'] = float(video.get('start_time', 0)) - float(probe['format'].get('start_time', 0))


def grab(path, frame, bias=0):
    data = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-ss', f'{max(0, frame / fps + bias - .001):.6f}',
        '-i', str(path), '-frames:v', '1', '-vf', 'scale=384:108:flags=area,format=gray',
        '-f', 'rawvideo', '-',
    ])
    assert len(data) == 384 * 108, (str(path), frame, len(data))
    return np.frombuffer(data, dtype=np.uint8).astype(float)


def selected_frame(path, frame):
    data = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', str(path), '-frames:v', '1',
        '-vf', f'select=eq(n\\,{frame}),scale=384:108:flags=area,format=gray',
        '-f', 'rawvideo', '-',
    ])
    return np.frombuffer(data, dtype=np.uint8).astype(float)


# Prove seek timing against exact decoded indices before trusting comparisons.
seek_checks = []
for part in parts:
    for frame in ([0, 1, 2, 30] if part['seek_bias'] else [1]):
        same = bool(np.array_equal(selected_frame(assets / part['name'], frame),
                                   grab(assets / part['name'], frame, part['seek_bias'])))
        seek_checks.append(dict(source_file=part['name'], source_frame=frame,
                                seek_bias_seconds=part['seek_bias'], pass_check=same))
if not all(row['pass_check'] for row in seek_checks):
    print(json.dumps(dict(result='FAIL', source_seek_checks=seek_checks), indent=2))
    sys.exit(1)
if '--source-seeks-only' in sys.argv:
    print(json.dumps(dict(result='PASS', source_seek_checks=seek_checks), indent=2))
    sys.exit(0)

edl = json.loads((assets / f'clean-{version}.union-edl.json').read_text())
segments, cursor = [], 0
for keep in edl['keep_ranges']:
    count = round((keep['end'] - keep['start']) * fps)
    segments.append(dict(output_start=cursor, output_end=cursor + count,
                         source_start=round(keep['start'] * fps)))
    cursor += count
assert cursor > 0, 'No retained frames'
points = [0, min(30, cursor - 1), cursor - 1]
if len(segments) > 1:
    for index in set(round(float(x)) for x in np.linspace(1, len(segments) - 1, min(15, len(segments) - 1))):
        points.extend([segments[index]['output_start'] - 1, segments[index]['output_start']])
for part in parts[1:]:
    segment = next((segment for segment in segments
                    if part['frame_offset'] <= segment['source_start'] < part['frame_offset'] + part['frames']), None)
    if segment:
        points.extend([segment['output_start'] - 1, segment['output_start']])
points = sorted(set(frame for frame in points if 0 <= frame < cursor))


def check(frame):
    segment = next(segment for segment in segments
                   if segment['output_start'] <= frame < segment['output_end'])
    source_frame = segment['source_start'] + frame - segment['output_start']
    part = next(part for part in parts
                if part['frame_offset'] <= source_frame < part['frame_offset'] + part['frames'])
    local_frame = source_frame - part['frame_offset']
    original = grab(assets / part['name'], local_frame, part['seek_bias'])
    rendered = grab(assets / f'clean-{version}.mp4', frame)
    # Exclude the deliberate credential cover from source-preservation PSNR.
    # Its opacity and exact coverage are verified independently.
    if part['name'] == 'part1.mov' and 1635 <= local_frame / fps <= 1755:
        original = original.reshape(108,384)[:,192:].ravel()
        rendered = rendered.reshape(108,384)[:,192:].ravel()
    mse = float(np.mean((original - rendered) ** 2))
    psnr = 99.0 if mse == 0 else float(10 * np.log10(255 ** 2 / mse))
    return dict(output_frame=frame, source_file=part['name'], source_frame=local_frame,
                source_seek_bias_seconds=part['seek_bias'], psnr=psnr, pass_check=psnr > 32)


with ThreadPoolExecutor(max_workers=3) as pool:
    rows = list(pool.map(check, points))
report = dict(result='PASS' if all(row['pass_check'] for row in rows) else 'FAIL',
              version=version, samples=len(rows), source_seek_checks=seek_checks, details=rows)
(assets / 'frame-checks.json').write_text(json.dumps(report, indent=2))
(assets / f'frame-checks-{version}.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
frames = base / 'frames'
frames.mkdir(exist_ok=True)
for frame in sorted(set([min(30, cursor - 1), round(cursor * .25), round(cursor * .5), round(cursor * .75), max(0, cursor - 2)])):
    subprocess.run([
        'ffmpeg', '-y', '-v', 'error', '-ss', f'{max(0, frame / fps - .001):.6f}',
        '-i', str(assets / f'clean-{version}.mp4'), '-frames:v', '1', '-vf', 'scale=1920:-1',
        str(frames / f'final-{version}-{frame}.jpg'),
    ], check=True)
sys.exit(0 if report['result'] == 'PASS' else 1)
