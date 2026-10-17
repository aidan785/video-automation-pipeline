#!/usr/bin/env python3
"""Find audible sound that the word transcript does not cover (off-mic chatter, noises, hidden speech).

silencedetect gives the non-silent spans; any non-silent span >= MIN_LEN that sits more than PAD
seconds away from every transcribed word is reported. Usage:
  python3 tools/untranscribed-audio.py <source.mp4> <transcript.json> [--db -45]
"""
import json, re, subprocess, sys

src, tjson = sys.argv[1], sys.argv[2]
DB = sys.argv[sys.argv.index("--db") + 1] if "--db" in sys.argv else "-45"
PAD, MIN_LEN = 0.25, 0.15

words = [w for w in json.load(open(tjson))["words"] if w["type"] in ("word", "audio_event")]
log = subprocess.run(
    ["ffmpeg", "-nostats", "-hide_banner", "-i", src, "-vn", "-map", "0:a:0",
     "-af", f"silencedetect=noise={DB}dB:d=0.2", "-f", "null", "-"],
    capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
dur = float(re.findall(r"Duration: (\d+):(\d+):([\d.]+)", log)[0][2]) + 60 * float(re.findall(r"Duration: (\d+):(\d+):([\d.]+)", log)[0][1])

# non-silent spans = complement of silences
spans, t = [], 0.0
for s, e in zip(starts, ends + [dur] * (len(starts) - len(ends))):
    if s - t >= MIN_LEN:
        spans.append((t, s))
    t = e
if dur - t >= MIN_LEN:
    spans.append((t, dur))

def covered(a, b):
    return any(w["start"] - PAD < b and w["end"] + PAD > a for w in words)

hits = [(a, b) for a, b in spans if not covered(a, b)]
print(f"{src.split('/')[-1]}: {len(spans)} non-silent spans at {DB}dB, {len(hits)} not covered by transcript")
for a, b in hits:
    print(f"  {int(a//60)}:{a%60:05.2f} to {int(b//60)}:{b%60:05.2f}  ({b-a:.2f}s)")
