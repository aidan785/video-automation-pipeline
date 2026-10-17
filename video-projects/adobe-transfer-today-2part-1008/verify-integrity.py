import json
import subprocess
import sys
from pathlib import Path

base = Path(__file__).resolve().parent
assets = base / 'assets'
version = sys.argv[1] if len(sys.argv) > 1 else 'v1'
stem = assets / f'clean-{version}'
edl = json.loads(Path(str(stem) + '.union-edl.json').read_text())
probe = json.loads(subprocess.check_output([
    'ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json',
    str(stem) + '.mp4',
]))
video = next(stream for stream in probe['streams'] if stream['codec_type'] == 'video')
audio = next(stream for stream in probe['streams'] if stream['codec_type'] == 'audio')
keeps, deletes = edl['keep_ranges'], edl['delete_ranges']
intervals = sorted([(x['start'], x['end']) for x in keeps + deletes])
fps = edl.get('render', {}).get('fps', 30)
expected_frames = edl.get('render', {}).get('expected_frames', round(edl['edited_duration'] * fps))
checks = {
    'duration_math': abs(sum(x['end'] - x['start'] for x in keeps) - edl['edited_duration']) < 0.00001,
    'complete_partition': bool(intervals) and abs(intervals[0][0]) < 0.00001
        and abs(intervals[-1][1] - edl['source_duration']) < 0.0001
        and all(start < end for start, end in intervals)
        and all(abs(intervals[i][1] - intervals[i + 1][0]) < 0.00001 for i in range(len(intervals) - 1)),
    'frame_count': int(video['nb_frames']) == expected_frames,
    'av_sync': abs(float(video['duration']) - float(audio['duration'])) < 0.05,
    'resolution': video['width'] == 3840 and video['height'] == 1080,
    'fps': video['r_frame_rate'] == f'{fps}/1',
    'audio_sample_rate': int(audio['sample_rate']) == 48000,
}
report = {
    'result': 'PASS' if all(checks.values()) else 'FAIL', 'version': version,
    'checks': checks, 'expected_frames': expected_frames,
    'actual_frames': int(video['nb_frames']), 'video_duration': video['duration'],
    'audio_duration': audio['duration'], 'keep_segments': len(keeps),
}
Path(str(stem) + '.integrity.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
sys.exit(0 if all(checks.values()) else 1)
