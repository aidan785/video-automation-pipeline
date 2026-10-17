#!/usr/bin/env python3
"""Resolve editorial phrase decisions to exact post-silence word times."""

import json
import re
from pathlib import Path

ASSETS = Path(__file__).parent / "assets"
transcript = json.loads((ASSETS / "source.silence-transcript.json").read_text())
specs = json.loads((ASSETS / "cut-specs.json").read_text())["specs"]
words = [w for w in transcript["words"] if re.sub(r"[^a-z0-9]", "", w["text"].lower())]


def normalize(text):
    return [re.sub(r"[^a-z0-9]", "", s.lower()) for s in text.split() if re.sub(r"[^a-z0-9]", "", s.lower())]


tokens = [normalize(w["text"])[0] for w in words]
cuts = []
lines = ["# Editorial cut decisions", "", "The source is the post-silence word transcript. All 37 removals below were read in context; repeated emphasis and distinct tutorial steps were kept.", ""]

for i, spec in enumerate(specs, 1):
    pattern = normalize(spec["cut"])
    before = normalize(spec["before"])
    hits = [j for j in range(len(tokens) - len(pattern) + 1) if tokens[j:j + len(pattern)] == pattern]
    hits = [j for j in hits if tokens[j + len(pattern):j + len(pattern) + len(before)] == before]
    if not hits:
        raise SystemExit(f"cut {i:02d} failed exact text/keep anchor: {spec}")
    hit = min(hits, key=lambda j: abs(words[j]["start"] - spec["at"]))
    if abs(words[hit]["start"] - spec["at"]) > 6:
        raise SystemExit(f"cut {i:02d} unexpected time {words[hit]['start']:.2f}: {spec}")
    end_index = hit + len(pattern)
    if end_index >= len(words):
        raise SystemExit(f"cut {i:02d} reaches last word")
    start = max(0, words[hit]["start"] - 0.025)
    end = words[end_index]["start"] - 0.04
    if end <= start:
        raise SystemExit(f"cut {i:02d} invalid range {start:.3f}-{end:.3f}")
    cuts.append({"start": round(start, 3), "end": round(end, 3), "reason": spec["reason"], "removes": spec["cut"], "keeps": spec["before"]})
    lines.append(f"{i:02d}. {start:7.2f}-{end:7.2f}  REMOVE {spec['cut']}  →  KEEP {spec['before']} ({spec['reason']})")

for a, b in zip(cuts, cuts[1:]):
    if b["start"] < a["end"]:
        raise SystemExit(f"overlapping cuts: {a} and {b}")

(ASSETS / "approved-cuts.json").write_text(json.dumps({"cuts": cuts}, indent=2))
(ASSETS / "cut-decisions.md").write_text("\n".join(lines) + "\n")
print(f"wrote {len(cuts)} reviewed cuts, {sum(c['end'] - c['start'] for c in cuts):.2f}s")
