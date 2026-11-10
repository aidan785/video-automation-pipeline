#!/usr/bin/env python3
"""Pose-track people in a clip -> JSON of 2D joints per frame, to drive dot rigs with real human motion.

Usage (venv raw-media/hp-sampler-refs/.venv has mediapipe + cv2):
  python pose_track.py clip.mp4 out.json [--fps 30] [--people 2] [--start 0] [--dur 0] [--smooth 2] [--preview out.jpg]

Output: { fps, w, h, frames: [ [ person: {j: {name: [x, y, vis]}} ... ] ... ] }
  x, y normalised 0..1 of the source frame. Joints are the 33 BlazePose landmarks, reduced to the ones a stick
  rig needs (nose, shoulders, elbows, wrists, hips, knees, ankles, heels, toes) plus derived neck + pelvis.
  People are kept in a stable order across frames by nearest pelvis. Missing frames are filled by linear
  interpolation; then a centred gaussian smooth of --smooth frames removes tracker jitter.
"""
import argparse, json, math, os, sys
import numpy as np, cv2, mediapipe as mp
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import PoseLandmarker, PoseLandmarkerOptions, RunningMode

NAMES = {0: "nose", 11: "lsh", 12: "rsh", 13: "lel", 14: "rel", 15: "lwr", 16: "rwr", 23: "lhip", 24: "rhip",
         25: "lkn", 26: "rkn", 27: "lan", 28: "ran", 29: "lhe", 30: "rhe", 31: "lto", 32: "rto"}
MODEL = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "raw-media", "hp-pose-src", "models", "pose_landmarker_full.task")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip"); ap.add_argument("out")
    ap.add_argument("--fps", type=float, default=30); ap.add_argument("--people", type=int, default=1)
    ap.add_argument("--start", type=float, default=0); ap.add_argument("--dur", type=float, default=0)
    ap.add_argument("--smooth", type=float, default=2); ap.add_argument("--model", default=MODEL)
    ap.add_argument("--preview", default="")
    a = ap.parse_args()
    cap = cv2.VideoCapture(a.clip); sfps = cap.get(cv2.CAP_PROP_FPS) or 30
    W, H = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    n_src = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); t_end = n_src / sfps if not a.dur else a.start + a.dur
    lm = PoseLandmarker.create_from_options(PoseLandmarkerOptions(base_options=BaseOptions(model_asset_path=os.path.abspath(a.model)),
        running_mode=RunningMode.VIDEO, num_poses=a.people, min_pose_detection_confidence=0.4, min_tracking_confidence=0.4))
    frames, t, prev = [], a.start, None
    while t < t_end - 1e-6:
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); ok, img = cap.read()
        if not ok: break
        res = lm.detect_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)), int(round(t * 1000)))
        ppl = []
        for pose in res.pose_landmarks:
            j = {nm: [pose[i].x, pose[i].y, pose[i].visibility] for i, nm in NAMES.items()}
            j["neck"] = [(j["lsh"][0] + j["rsh"][0]) / 2, (j["lsh"][1] + j["rsh"][1]) / 2, min(j["lsh"][2], j["rsh"][2])]
            j["pelvis"] = [(j["lhip"][0] + j["rhip"][0]) / 2, (j["lhip"][1] + j["rhip"][1]) / 2, min(j["lhip"][2], j["rhip"][2])]
            ppl.append(j)
        if prev and ppl:   # keep identities stable: greedy nearest pelvis
            order = []
            for pj in prev:
                if pj is None: order.append(None); continue
                best = min((p for p in ppl if p not in order), key=lambda p: math.dist(p["pelvis"][:2], pj["pelvis"][:2]), default=None)
                order.append(best)
            order += [p for p in ppl if p not in order]
            ppl = order
        frames.append(ppl[:a.people] + [None] * (a.people - len(ppl[:a.people])))
        prev = [p if p else (prev[k] if prev and k < len(prev) else None) for k, p in enumerate(frames[-1])]
        t += 1 / a.fps
    # fill gaps + smooth per joint
    N = len(frames)
    for k in range(a.people):
        keys = next((list(f[k].keys()) for f in frames if f[k]), [])
        for nm in keys:
            arr = np.array([(f[k] or {}).get(nm) or [np.nan] * 3 for f in frames], float)
            idx = np.arange(N); ok = ~np.isnan(arr[:, 0])
            if ok.sum() < 2: continue
            for c in range(3): arr[:, c] = np.interp(idx, idx[ok], arr[ok, c])
            if a.smooth > 0:
                r = int(math.ceil(a.smooth * 3)); g = np.exp(-0.5 * (np.arange(-r, r + 1) / a.smooth) ** 2); g /= g.sum()
                for c in range(2): arr[:, c] = np.convolve(np.pad(arr[:, c], r, mode="edge"), g, mode="valid")
            for i, f in enumerate(frames):
                if f[k] is None: f[k] = {}
                f[k][nm] = [round(float(v), 4) for v in arr[i]]
    json.dump({"fps": a.fps, "w": W, "h": H, "src": os.path.basename(a.clip), "start": a.start, "frames": frames}, open(a.out, "w"))
    print(f"{N} frames, {a.people} people, detected in {sum(1 for f in frames if f[0])} -> {a.out}")
    if a.preview:   # 8 sampled frames with the skeleton drawn, tiled 4x2
        bones = [("nose", "neck"), ("neck", "pelvis"), ("lsh", "lel"), ("lel", "lwr"), ("rsh", "rel"), ("rel", "rwr"), ("lsh", "rsh"), ("lhip", "rhip"),
                 ("lhip", "lkn"), ("lkn", "lan"), ("rhip", "rkn"), ("rkn", "ran"), ("lan", "lto"), ("ran", "rto")]
        tiles = []
        for s in np.linspace(0, N - 1, 8).astype(int):
            cap.set(cv2.CAP_PROP_POS_MSEC, (a.start + s / a.fps) * 1000); ok, img = cap.read()
            img = cv2.resize(img, (480, int(480 * H / W)))
            for p in frames[s]:
                if not p: continue
                for u, v in bones:
                    if u in p and v in p: cv2.line(img, (int(p[u][0] * 480), int(p[u][1] * img.shape[0])), (int(p[v][0] * 480), int(p[v][1] * img.shape[0])), (0, 255, 255), 2)
            cv2.putText(img, f"f{s}", (6, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2); tiles.append(img)
        cv2.imwrite(a.preview, np.vstack([np.hstack(tiles[:4]), np.hstack(tiles[4:])]), [cv2.IMWRITE_JPEG_QUALITY, 80])

if __name__ == "__main__":
    main()
