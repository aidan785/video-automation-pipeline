# Audio

## Music

- **Temp reference first.** While building, the reference ad's own soundtrack plays on track 2 (`assets/chatgpt-ref-music.m4a`) so Aidan's frame numbers line up with the beats. Never ship it as is.
- **Identify the track.** The ChatGPT ad uses **Ratatat "Neck Brace"** (Aidan named it). The rip came from `yt-dlp "ytsearch:Ratatat- Neckbrace"` (246s). It's **temp and uncleared**.
- **Align by mel spectrogram.** Use librosa in `raw-media/hp-sampler-refs/.venv`; convert m4a to wav first. The ad turned out to be an edit of the track:
  - ad 3.5–23.5s = track +12.87s
  - ad 31.5–39s = track +86.0s
  - ad 44.5s+ = track +103.64s
  - The gaps are where they placed archival clips and VO.
- **Final bed** (Aidan: "keep all the original audio, just cut at the VO moment"):
  - ad audio 0–46.9s (f1407, right before their first voiced prompt at 47.4s)
  - then Neck Brace from track 150.54s onward, with a 30–60ms crossfade
- **Loudness match across the join.** The original track is **10.7 dB hotter** than the ad's mix, so drop the track part by 10.7 dB. Measure both sides with `ffmpeg -af ebur128` (it came out -17.4 / -17.3 LUFS).
- **End.** Trim to END and fade out (57.6s, 1.4s fade). Integrated loudness of the final mix was -17.7 LUFS.
- **Earlier experiments:** Feel Good Inc., Escapism and Clint Eastwood (breakdowns measured with librosa) were all temp and uncleared.

## Voiceover (Jillian)

- **Where the takes live.** Shared Drive folder `1pHUKThSOyEvU5h7sH5Q-GFPSHm4yhph_`. **gws needs** `"supportsAllDrives": true, "includeItemsFromAllDrives": true`, or the list comes back empty.
  - Downloaded to `raw-media/hp-jillian-takes/`: 12 mp4s (Teaser_Line 01–10, 06-a/b, 07-a/b).
  - `audio/*.m4a` plus Scribe JSON (`node scripts/transcribe-elevenlabs.mjs`).
  - `picks/*.wav` are the team picks, cut by explicit timestamps. The take splitter miscounted the "Hey guys" intro once.
- **Team picks:**
  - L1 take 3 (used: "With AI, more is now humanly possible.")
  - L2 second-to-last
  - L4 takes 2/3/4 (take 4's second half, 30.22–32.85s, used: "and we'd love to hear where it's taking you.")
  - L5 take 3 + last
  - L6-b first 3
  - L7-a take 3
  - L7-b take 3/4
  - L8 take 2 or the last two
  - L9 take 5
  - L10: the add-on line "I'm Jillian Wolfe, and this is Humanly Possible."
- **Team concern:** lines 1–4 stress "more" and rush "Humanly Possible". Measured: in every take, HP is 2.4–14 dB quieter than "more". The strongest-HP takes are L2t4, L4t4, L4t3 and L1t2/3.
- **Placement:**
  - VO1 at f1420 (47.333s, track 3)
  - end VO at f1666 (55.533s, track 4)

## VO "essential sound" chain (placeholder; Aidan will redo it in Premiere's Essential Sound)

The sources are 63 kbps mono camera AAC. The spectrum is dark: presence (2.5–5k) sits about 29 dB under the body (150–300 Hz), and there's a boxy 300 Hz build-up. That's what reads as muffled / tin can.

```
afade in (skip mouth clicks: L1t3 had a click at 15ms -> fade in from 0.09s),
highpass=f=85:p=2,
equalizer=f=300:t=q:w=1.1:g=-4.5, equalizer=f=160:t=q:w=0.9:g=1.5,
equalizer=f=3200:t=q:w=0.9:g=6, equalizer=f=6000:t=q:w=1.2:g=2.5, highshelf=f=9000:g=1.5,
deesser=i=0.4:m=0.5:f=0.5,
acompressor=threshold=-24dB:ratio=3:attack=10:release=140:knee=6:makeup=3dB,
acompressor=threshold=-14dB:ratio=6:attack=1:release=40:knee=3,
afade out 60ms
-> measure ebur128, volume to -15 LUFS, alimiter limit=0.89 (-1 dBFS)
```

- **No denoiser** (that's what makes voices sound "glitchy").
- **Check limiter load:** pre-limit peak minus the ceiling should be about 3 dB or less. If it's much more, look for a click or transient (print a 10ms peak envelope).
- Script: `scripts/vo_polish.sh`.

**Ducking.** The music drops 7 dB under each VO line with smooth ramps (150ms down, 350ms up), via an ffmpeg `volume='1-0.553*W(t)':eval=frame` envelope on the bed. VO ends up about 9 dB over the music. Back up the originals first (`_hp-teaser-cg-proof-archive/audio-v1/`).

## VO-driven visuals

- `VOENV`: the VO clip's RMS sampled at 30fps, normalised and baked into the HTML as an array.
- The voice dots stretch into capsules by `VOENV[frame - k]` (dot k lags k frames).
- Capsules: `roundRect(x-r, y-r-h, 2r, 2r+2h, r)` with `h = r*1.5*talk`.
