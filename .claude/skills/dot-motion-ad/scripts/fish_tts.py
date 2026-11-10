#!/usr/bin/env python3
"""Fish Audio TTS in Jillian's voice by zero-shot cloning (reference clips sent with every request).

The free API tier can't save a voice model (POST /model -> 403 "creation limit 0/0"), so each request carries
reference audio + its exact transcript in msgpack. Key: FISH_AUDIO_API_KEY in the workspace .env.

Usage (venv raw-media/hp-sampler-refs/.venv has msgpack + requests):
  python fish_tts.py --refs refdir --lines lines.tsv --out outdir [--model s2.1-pro-free] [--takes 3]
  refdir: <name>.wav + <name>.json (Scribe output; its "text" is the transcript)
  lines.tsv: <id>\t<text> per line -> outdir/<id>_t<k>.mp3 for k in 1..takes (pick the best take after)
"""
import argparse, json, os, sys, glob
import msgpack, requests

def env_key():
    k = os.environ.get("FISH_AUDIO_API_KEY")
    if k: return k
    p = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", ".env")
    for ln in open(p):
        if ln.startswith("FISH_AUDIO_API_KEY="): return ln.split("=", 1)[1].strip()
    sys.exit("no FISH_AUDIO_API_KEY")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--refs", required=True); ap.add_argument("--lines", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="s2.1-pro-free"); ap.add_argument("--takes", type=int, default=3)
    ap.add_argument("--only", default=""); ap.add_argument("--speed", type=float, default=1.0)
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True); key = env_key()
    refs = []
    for w in sorted(glob.glob(os.path.join(a.refs, "*.wav"))):
        j = os.path.splitext(w)[0] + ".json"
        refs.append({"audio": open(w, "rb").read(), "text": json.load(open(j))["text"].strip()})
    only = set(a.only.split(",")) if a.only else None
    for ln in open(a.lines):
        if not ln.strip(): continue
        lid, text = ln.rstrip("\n").split("\t", 1)
        if only and lid not in only: continue
        for k in range(1, a.takes + 1):
            body = {"text": text, "references": refs, "format": "mp3", "mp3_bitrate": 192, "normalize": True, "latency": "normal"}
            if a.speed != 1.0: body["prosody"] = {"speed": a.speed, "volume": 0}
            r = requests.post("https://api.fish.audio/v1/tts", data=msgpack.packb(body),
                              headers={"Authorization": f"Bearer {key}", "Content-Type": "application/msgpack", "model": a.model}, timeout=300)
            if r.status_code != 200 or len(r.content) < 2000 or r.content[:1] == b"{":
                print(lid, k, "FAILED", r.status_code, r.text[:300]); continue
            fn = os.path.join(a.out, f"{lid}_t{k}.mp3"); open(fn, "wb").write(r.content); print("ok", fn)

if __name__ == "__main__":
    main()
