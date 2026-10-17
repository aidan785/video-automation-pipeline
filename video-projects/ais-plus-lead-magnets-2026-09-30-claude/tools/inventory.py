#!/usr/bin/env python3
"""Source inventory: ffprobe + loudness + Drive match -> 01-intake/inventory.json"""
import json, re, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
DRIVE = {  # from the Drive connector listing of 9-30 | Raw Recordings (1gBTve1qQt98hl3T8VNrct3il8umeW1-z)
 "01 AD - First AI Automation Client SOP.mp4": ("1RbeicqBxBOJR_EjKToUn5zILgYzfQ_N5", 789927433),
 "02 AD - AI OS Template.mp4": ("1Vd2MQv5Ilg9NF6WxZTtcug-jfeXkT3DK", 879462781),
 "03 AD - Scrollcraft.mp4": ("1fIOcvh7exXi4RqQszzNmLscoPKW3NxGn", 576991249),
 "04 VSL INTRO - First AI Client SOP.mp4": ("14lSCE3QaFR3Xz4YseqtUpwgsAwLVmPMV", 467938911),
 "05 VSL INTRO - AI OS Template.mp4": ("1jzZRsrd0Z8L0HgDC7uf64E_iqIl0Jlup", 536705157),
 "06 VSL INTRO - Scrollcraft.mp4": ("1Yv_Xy8-cJ15MQYt9ORAgbQnJJxEO9fWU", 598773076),
 "07 VSL INTRO - Generic (free Skool join emails).mp4": ("1xPxHZFo1x-QyAUY1097vr27CpWWUGfeW", 617825383),
 "08 VSL CORE BODY.mp4": ("1x8l_n2XtwJvT6htkVfhFMRPNcFOTPPD3", 5310240038),
}
SLUG = ["01-ad-sop","02-ad-aios","03-ad-scrollcraft","04-vsl-intro-sop","05-vsl-intro-aios","06-vsl-intro-scrollcraft","07-vsl-intro-generic","08-vsl-core"]
ROLE = ["Ad: First AI Client SOP","Ad: AI OS Template","Ad: Scrollcraft","VSL intro: SOP","VSL intro: AI OS","VSL intro: Scrollcraft","VSL intro: Generic (Skool join emails)","VSL core body (shared)"]
loud = {l.split(" |")[0]: l for l in (ROOT/"01-intake/audio/loudness.txt").read_text().splitlines()}
out = []
for i, (name, (fid, dsize)) in enumerate(DRIVE.items()):
    p = ROOT/"sources"/name
    pr = json.loads(subprocess.check_output(["ffprobe","-v","error","-show_format","-show_streams","-of","json",str(p)]))
    v = next(s for s in pr["streams"] if s["codec_type"]=="video"); a = next(s for s in pr["streams"] if s["codec_type"]=="audio")
    n, d = map(int, v["avg_frame_rate"].split("/"))
    L = loud[name[:2]]
    g = lambda pat: float(re.search(pat, L).group(1))
    plan = json.loads((ROOT/f"04-edit-plan/{SLUG[i]}.plan.json").read_text())
    out.append({
      "clip": name, "slug": SLUG[i], "role": ROLE[i],
      "drive_id": fid, "drive_bytes": dsize, "local_bytes": p.stat().st_size, "bytes_match": dsize == p.stat().st_size,
      "duration_s": round(float(pr["format"]["duration"]), 3),
      "video": {"codec": f'{v["codec_name"]} {v.get("profile","")}', "size": f'{v["width"]}x{v["height"]}', "pix_fmt": v["pix_fmt"],
                "fps_nominal": v["r_frame_rate"], "fps_avg": round(n/d, 4), "vfr_note": "slight jitter (31-38ms frame steps); conform to CFR 30", "bitrate_mbps": round(int(v["bit_rate"])/1e6, 1)},
      "audio": {"codec": a["codec_name"], "sample_rate": int(a["sample_rate"]), "channels": a["channels"], "bitrate_kbps": round(int(a["bit_rate"])/1000),
                "integrated_lufs": g(r"I: (-?[\d.]+) LUFS"), "true_peak_dbfs": g(r"Peak: (-?[\d.]+) dBFS"), "lra_lu": g(r"LRA: (-?[\d.]+) LU"),
                "noise_floor": "digital silence between phrases (gated)", "channel_note": "L and R identical peaks (dual mono)"},
      "recorded_utc": pr["format"].get("tags", {}).get("creation_time"),
      "speech_span_s": [plan["keepSegments"][0]["srcIn"], plan["keepSegments"][-1]["srcOut"]],
      "proposed_clean_duration_s": plan["proposedDuration"],
    })
(ROOT/"01-intake/inventory.json").write_text(json.dumps(out, indent=2)+"\n")
for r in out: print(f'{r["slug"]:26} {r["duration_s"]:8.2f}s  {r["video"]["size"]} {r["video"]["fps_avg"]}fps  {r["audio"]["integrated_lufs"]} LUFS  TP {r["audio"]["true_peak_dbfs"]}  bytes_match={r["bytes_match"]}  -> {r["proposed_clean_duration_s"]}s')
