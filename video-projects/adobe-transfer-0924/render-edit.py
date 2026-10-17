#!/usr/bin/env python3
"""Render one frame-aligned clean edit from the approved union EDL."""

import json
import subprocess
import wave
from pathlib import Path

import numpy as np


PROJECT = Path(__file__).resolve().parent
ASSETS = PROJECT / "assets"
SOURCE = ASSETS / "source.mov"
PLANNED = ASSETS / "clean.union-edl.json"
REFINEMENTS = ASSETS / "source-refinements.json"
FRAME_EDL = ASSETS / "clean.frame-edl.json"
OUTPUT = ASSETS / "clean.mp4"
FPS = 30
SAMPLE_RATE = 48000
SAMPLES_PER_FRAME = SAMPLE_RATE // FPS


def balanced(expressions):
    if len(expressions) == 1:
        return expressions[0]
    middle = len(expressions) // 2
    return f"({balanced(expressions[:middle])}+{balanced(expressions[middle:])})"


planned = json.loads(PLANNED.read_text())
refinements = json.loads(REFINEMENTS.read_text())
probe = json.loads(subprocess.check_output([
    "ffprobe", "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=nb_frames", "-of", "json", str(SOURCE),
]))
source_frames = int(probe["streams"][0]["nb_frames"])
source_duration = source_frames / FPS

# Fold the editorial retake read into the original source timeline. Restoration
# carves speech back out of a silence cut before the new retake cuts are added.
deletes = [(r["start"], r["end"]) for r in planned["delete_ranges"]]
for restore in refinements["restore"]:
    updated = []
    for start, end in deletes:
        if end <= restore["start"] or start >= restore["end"]:
            updated.append((start, end))
        else:
            if start < restore["start"]:
                updated.append((start, restore["start"]))
            if end > restore["end"]:
                updated.append((restore["end"], end))
    deletes = updated
deletes += [(r["start"], r["end"]) for r in refinements["cuts"]]
deletes.sort()
merged = []
for start, end in deletes:
    if merged and start <= merged[-1][1]:
        merged[-1] = (merged[-1][0], max(end, merged[-1][1]))
    else:
        merged.append((start, end))
source_keeps = []
cursor = 0.0
for start, end in merged:
    if start > cursor:
        source_keeps.append({"start": cursor, "end": start})
    cursor = max(cursor, end)
if cursor < source_duration:
    source_keeps.append({"start": cursor, "end": source_duration})
frame_keeps = []
for keep in source_keeps:
    start = max(0, round(keep["start"] * FPS))
    end = min(source_frames, round(keep["end"] * FPS))
    if end > start:
        if frame_keeps and start <= frame_keeps[-1][1]:
            frame_keeps[-1] = (frame_keeps[-1][0], max(end, frame_keeps[-1][1]))
        else:
            frame_keeps.append((start, end))
assert frame_keeps
expected_frames = sum(end - start for start, end in frame_keeps)
keep_ranges = [{"start": start / FPS, "end": end / FPS} for start, end in frame_keeps]
delete_ranges = []
cursor = 0
for start, end in frame_keeps:
    if start > cursor:
        delete_ranges.append({"start": cursor / FPS, "end": start / FPS})
    cursor = end
if cursor < source_frames:
    delete_ranges.append({"start": cursor / FPS, "end": source_duration})
FRAME_EDL.write_text(json.dumps({
    "source_duration": source_duration,
    "edited_duration": expected_frames / FPS,
    "removed": source_duration - expected_frames / FPS,
    "keep_ranges": keep_ranges,
    "delete_ranges": delete_ranges,
    "render": {"fps": FPS, "expected_frames": expected_frames,
               "selection": "integer source frame indices", "audio_fade_ms": 4},
    "source_refinements": str(REFINEMENTS),
}, indent=2) + "\n")
print(f"{len(frame_keeps)} keeps, {expected_frames} frames, {expected_frames/FPS:.3f}s", flush=True)

# Decode the audio once and take the same integer frame spans as the video.
source_wav = ASSETS / "source.aligned.wav"
if not source_wav.exists():
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", str(SOURCE), "-vn",
        "-af", f"aresample={SAMPLE_RATE}:async=1:first_pts=0,apad,atrim=end_sample={source_frames*SAMPLES_PER_FRAME}",
        "-ac", "2", "-c:a", "pcm_s16le", str(source_wav),
    ], check=True)
with wave.open(str(source_wav), "rb") as inp:
    assert inp.getframerate() == SAMPLE_RATE and inp.getnchannels() == 2
    audio = np.frombuffer(inp.readframes(inp.getnframes()), dtype="<i2").reshape(-1, 2)
assert len(audio) == source_frames * SAMPLES_PER_FRAME
clean_wav = ASSETS / "clean.wav"
with wave.open(str(clean_wav), "wb") as out:
    out.setparams((2, 2, SAMPLE_RATE, 0, "NONE", "not compressed"))
    for start, end in frame_keeps:
        chunk = audio[start*SAMPLES_PER_FRAME:end*SAMPLES_PER_FRAME].copy()
        fade = min(round(SAMPLE_RATE * .004), len(chunk) // 2)
        chunk[:fade] = (chunk[:fade].astype(float) * np.linspace(0, 1, fade)[:, None]).astype("<i2")
        chunk[-fade:] = (chunk[-fade:].astype(float) * np.linspace(1, 0, fade)[:, None]).astype("<i2")
        out.writeframesraw(chunk.tobytes())

expressions = [f"between(n,{start},{end-1})" for start, end in frame_keeps]
filter_path = ASSETS / "clean.frame-filter.txt"
filter_path.write_text(f"[0:v]select='{balanced(expressions)}',setpts=N/({FPS}*TB)[v]\n")
log_path = ASSETS / "render.log"
with log_path.open("w") as log:
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-i", str(SOURCE), "-i", str(clean_wav),
        "-/filter_complex", str(filter_path), "-map", "[v]", "-map", "1:a:0",
        "-c:v", "libx264", "-threads", "8", "-preset", "fast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", str(FPS), "-g", str(FPS),
        "-keyint_min", str(FPS), "-sc_threshold", "0", "-frames:v", str(expected_frames),
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
        "-progress", str(ASSETS / "render.progress.txt"), str(OUTPUT),
    ], stdout=log, stderr=log, check=True)
print(f"render complete: {OUTPUT}", flush=True)
