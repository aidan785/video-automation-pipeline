# CAIC Booth offer (Oct 2026): clean cut + motion graphics

**Final:** `renders/CAIC-Booth-Offer-MG.mp4` (v3 cut, 2026-10-16)
- 59.80 s, 1920×1080 @ 30, H.264 CRF 14. v2 (58.07 s) kept in `versions/v2-cuts/`.
- Audio comes from the clean cut, unchanged.
- Phone preview: `renders/CAIC-Booth-Offer-MG-preview.mp4`.

## Cut (v3, current): only the retake is cut
Aidan heard a jump at ~16 s: v2 spliced "be the | AI person" to match the script line. Nate's real phrasing ("be the person inside your company, the AI person inside your company") is natural emphasis, so v3 restores it, plus the two pause trims (31.50–31.72, 68.82–69.10) that only caused small head jumps. Keep: source 2.89–45.13 and 52.58–70.12 (`assets/clean-v3-nozoom-1080.filter.txt` → `assets/clip.mp4`). One cut at clip frame 1267 (42.23 s), hidden by the in-plate punch-in (1.0 → 1.07 on that frame).
Graphics: `premium.js` keeps the v2-timed beats and maps film time onto them (holds at 17.40, 27.34, 56.99 for the restored 1.27 / 0.22 / 0.28 s); `build-premium.py` shifts the beat clip windows the same way. Track 02 now lights on "the AI person" (18.8 s).

## Cut (v2, superseded): planned from the audio, not the transcript
v1 trusted Scribe word times, which run late on this take. Its silence trims clipped "**You'll** run discovery" (≈0.15 s) and "**Our** first cohort" (≈0.25 s). v1 is kept as `assets/clean-v1.mp4`.

v2 (`assets/clean-v2.union-edl.json`, `clean-v2.filter.txt`) places every cut from a 5 ms RMS speech map of the source:

| Source | Removed | Why |
|---|---|---|
| 0–2.89 | head | dead air |
| 20.46–21.73 | "person inside your company, the" | Kept "be the AI person inside your company." Cut in the p-closure after the first "the", rejoined in the 35 ms silence before "AI". |
| 31.50–31.72 | hesitation | "what it costs … to run" pause cut from 0.44 s to 0.22 s |
| 45.13–52.58 | botched first take of the letter-of-recommendation line, plus a 1.9 s pause | retake |
| 68.82–69.10 | pause | 0.60 s cut to 0.32 s before "Thanks, everyone" |
| 70.12–end | tail | dead air |

Every other pause is a natural ≤0.44 s breath and is kept.

**Punch-in:** 1.08× around the face (2040, 560) on source 21.73–45.13. This hides the head jump at the two content cuts.

**Audio:** 10 ms fades at every join.

**Verify:** re-transcribed `clean.json` + `verify-passes` (gap 0.6): PASS. 9/9 phrase checks, drift 0.03 s, full sentence read clean.

## Motion graphics v2 (current) — aiautomationsociety.ai/certification style
**Files:**
- `build-premium.py` generates `index.html`, including the procedurally drawn ridges and pine treeline.
- `assets/premium.css` and `assets/premium.js` hold the styling and animation.
- `assets/ais-globe-white.png` is the AIS globe, cropped from the white AIS LIVE logo.

**Matched to the live page:**
- Sky: radial-gradient(200% 83% at 50% 0, #0C0E11, #171B1F 42%, #2F78A8).
- Type: Montserrat 400 at −0.045em; Roboto Mono uppercase at 0.14em.
- Pill tags with a cyan dot.
- The tilted dark credential "plate": 160° #111215→#0A0B0D, 1px rgba(255,255,255,.12), radius 22, cyan glow. Its rows are the site's own facts (earned by / result / valid / verifiable).
- The two tracks (agency & freelance / employed & in-house, "Same curriculum, same certification").
- A curriculum-style progress rail, and the white primary "Join the waitlist" pill.
- Letter-by-letter blur-in headlines.

**Nate's plate:**
- Nate sits in a large tilted plate on the right.
- The take is framed tight at the top, so the plate paints his wall colour above the video and fades the video's top 46 px into it (headroom).
- The punch-in happens inside the plate (`#vzoom`, 1.07×, pivot on the top of his hair). It switches exactly on the cut frames 527 and 1223.
- `assets/clip.mp4` is therefore the v2 cut **without** the baked punch-in (`clean-v2-nozoom-1080.filter.txt`).

**Copy note:** the site says Cohort 2 dates are not set yet, so the cohort beat shows "Cohort 2 · Waitlist open" rather than "November". Nate still says November in the audio.

v1 (July navy style) is kept as `versions/index-v1-july.html.txt` and `renders/CAIC-Booth-Offer-MG-v1-july.mp4`.

## Motion graphics v1 (superseded): July CAIC style (`../caic-booth`)
- **Look:** navy command deck, cyan grid, Montserrat + Roboto Mono, blur-and-rise motion, mono type-on eyebrows, seal close.
- **Framing:** Nate at 1.15× pinned right (face ≈ x1330, y320), feathered left edge + navy scrim. The left column carries the beats.

Beats (anchor lead −0.2…+1.8 s, all OK):

| Beat | Start | Content |
|---|---|---|
| B1 | 0.25 | THE PROBLEM · Every Company Wants an AI Person · you already have the skills |
| B2 | 4.85 | The business asks "Why hire you over the next person?" / Most people: no real answer (orange) |
| B3 | 9.65 | OUR PROGRAM · Certified AI Consultant · CAIC wordmark · built to give you that answer |
| B4 | 14.9 | WHETHER YOU WANT TO · 01 work with clients / 02 be the AI person inside your company |
| B5 | 19.45 | THE WORK · 01 run discovery / 02 build the system / 03 prove it with evals / 04 is it worth the cost? |
| B6 | 28.3 | TO GET CERTIFIED · A brand-new client case. On your own. · scope / find what's failing / explain your reasoning |
| B7 | 36.75 | THE FINAL STEP · A live call with our team · walk us through every decision |
| B8 | 40.85 | WHEN YOU CERTIFY · letter of recommendation from Nate / AIS as a reference clients and employers can call |
| B9 | 47.45 | COHORT 001 · filled in under 36 hours · NOV next cohort |
| B10 | 51.6 | JOIN THE WAITLIST pill · hear about it before anyone else |
| B11 | 54.5 | CAIC seal · Hope to See You In There · next cohort · November |

**Render:**
```
node ~/.npm/_npx/daef3f3947ca6baa/node_modules/hyperframes/bin/hyperframes.mjs render . --fps 30 --quality looks --crf 14 --output renders/CAIC-Booth-Offer-MG.mp4
```
