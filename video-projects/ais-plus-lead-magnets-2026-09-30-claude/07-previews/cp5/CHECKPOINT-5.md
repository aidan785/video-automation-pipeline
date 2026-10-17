# Checkpoint 5: VSL master (shared core + SOP-intro VSL)

## Files (this folder)
| File | What |
| --- | --- |
| 04 VSL - First AI Client SOP - 16x9.mp4 (+ .srt) | first complete VSL: SOP intro + core A + core B |
| 04 VSL - First AI Client SOP - 16x9 - MAP.md | chapter map, part joins, PROOF BRIDGE marker, retake cut positions |
| 04 VSL - First AI Client SOP - 16x9.map.json | the same data + QA numbers |

## How the core is built once and reused
- The core is cut once from raw (7 retake cuts, 29 pause trims, verify PASS) and split at the proof bridge into two reusable parts:
  - **Core A** (0:50.0, opening, custom intros only), ends "...AIS+ is built to help you escape that trap."
  - **Core B** (5:33.3 + 3.0s end-card hold), starts "So this page is full of examples..." (raw core 1:12.36).
- Each part is its own composition, rendered once. A version = intro + A + B (Generic = intro + B). Video parts are joined without re-encoding; audio is one continuous track from the verified clean audio, loudness-normalized as a whole (-16 LUFS / -1 dBTP), so a fix to the core lands in all four versions.
- Captions are timed to the actual renders (words re-aligned to a fresh transcript of each rendered part: 1,560 of 1,564 matched) and rebased per version into one SRT.

## Long-form treatment
- Same Dark Glass system, calmer pacing, two layouts:
  - **split**: graphic in the left column, Nate in the rounded window on the right, used when a graphic explains the point
  - **solo**: Nate's window glides to a large centered frame for passages he carries on his own
- End: Nate's last line, 0.9s natural hold, then his window hands off to a "See you inside" card while the two CTAs hold for 3s.

## Offer graphics (as approved / as spoken)
- Annual **$749/year, about $62/mo** (D2). Monthly **$129/month, upgrade anytime**.
- Event perks stay count-free ("every virtual event") until D4 is answered; the $1,097 savings shows $199 per VIP ticket + $500 in-person discount = $1,097, as spoken.
- Refund: 30 days, **annual** membership only, as scripted.
- Community: **3,500+** (matches Nate and nateherk.com today).
- Course names as Nate says them: Agent Zero, 10 Hours to 10 Seconds, One Person AI Agency, 100+ templates.

## QA (04 VSL, 7:09.4)
| Check | Result |
| --- | --- |
| Full decode | clean |
| Loudness | -16.1 LUFS, true peak -1.7 dBTP (limiter after normalization) |
| A/V | video 429.433s = audio 429.433s; every frame step 1/30s, including both joins (no dropped or held frames) |
| Joins | intro to core A: 0.62s natural pause, same solo framing; core A to core B: 0.47s pause, split to split |
| Black / frozen | none (only the intended 2.1s static end-card hold) |
| Captions | 1,564 of 1,564 words covered, 0 overlaps, numbers and names normalized (Claude Code, Codex, AIS+, $385,000, 24/7, 3,500, $1,097...) |
| Core cut | verify PASS on both parts (fresh re-transcription, 12 retake phrase checks) |
| Layout | align-audit 0 alignment issues, 0 caption collisions on all 3 parts; every scene frame read |

## Still open (not applied)
- D4 events: "quarterly" (3:58) vs "three per year" (5:36), both spoken.
- D6 $420K disclaimer: affects the AI OS intro (CP6).
- D8 optional micro-cuts: core "experts, expert humans" not applied (would change the core audio in all versions).
- D9 proof: no testimonial clips or AIS+ proof images used yet. Candidates: AIS+ member clips from the September promo, and the aiautomationsociety.ai classroom / Skool Games leaderboard images.

---

# Revision 2 (after Aidan's CP5 review, 9/30)

Feedback: graphics sat in the "off" state before Nate said anything, the transcript felt off / not cut right, the handshake was jumbled lines, use the official AIS+ logo, use the AIS+ Skool community for screenshots.

| Note | Cause found | Fix |
| --- | --- | --- |
| Graphics sit "off" too long | Rows showed at 30% opacity from scene start and lit on the word; in long VSL scenes they waited up to 17s | Every element now builds in on its word (nothing pre-staged). Scenes re-timed so they start on the sentence they illustrate. No element is tied to scene start anymore |
| Graphics early/wrong | 2 anchor bugs: "$500" matched "$5,000" (row lit 3 min early), "discounted ticket" matched the events scene | Anchors are whole-word and scene-scoped (a build error if a word isn't in its own scene) |
| Transcript "not cut right" | Captions split at every comma: 1 to 3 word flicker lines, splits like "no / code", "And here's / what the data" | Phrase-level captions: breaks at sentence ends and real pauses, commas preferred not forced, no weak-word/adjective line ends, no split pairs. SOP intro 31 to 26 lines, core A 39 to 31 |
| Speech stumble | "a team of experts, expert humans" (D8) | Cut to "a team of expert humans" (R8, RMS-checked join). Core B re-cut, verify PASS (fresh Scribe, 14 phrase checks). Lands in all 4 VSLs |
| Handshake jumbled | Hand-drawn SVG | Lucide icon set glyph; gear (read as a sun) swapped for a chip icon; icon sheet checked |
| AIS+ logo | Text "AIS+" with a blue + | Official white AIS+ wordmark (the Skool group icon), cut clean from the AIS+ thumbnail on file: header, "true trap" card, pillars, results, end card |
| Skool screenshots | Needed a logged-in session | Captured at 2x after Aidan logged in (`05-visual-assets/skool/`): "The system" shows the real main-path modules 1 to 6, "What's inside" shows the real course art, new "Never behind" beat shows the Claude Code module + the live weekly Q&A calendar, events row uses the Events module. Flag: the 4 courses Nate names show Draft in the classroom |

New/changed scenes: core A now opens with "Hundreds of hours learning AI" and "You're not alone" (the smarts / the will / the work ethic) instead of 13s solo + a 9s headline-only wait. "No code" split into the no-code story and "What clients actually pay for".

Files: r1 kept in `_r1/`. Old plans in `04-edit-plan/_prev-cp5/`, old core B in `04-edit-plan/clean/_prev-cp5/`.
