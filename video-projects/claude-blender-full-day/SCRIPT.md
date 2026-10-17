# Intro script: I Let Claude Run Blender For A Full Day

Target length: under 60 seconds after silences are cut. 138 words.
Style: `style-templates/yt-intro-pixel-serif` (see its DESIGN.md). Written 7 Oct 2026 from the Blender session.
Read it top to bottom. Pause a full second between lines. If you flub, say the line again; the best take is kept.

---

## Part 1: Cold open (voice only, about 14s)

Not on camera. This plays over the Blender renders inside the 4:3 film frame. Read it slow and flat.

1. This space station has one point four million polygons.
2. This creature has a hundred and fifteen bones. It breathes, it blinks, and it tracks a bug.
3. And this little guy is just happy to be here.
4. I didn't build any of it.

## Part 2: The hook (on camera, about 30s)

| # | Say this | Text on screen |
|---|---|---|
| 5 | I let Claude run Blender for a full day. | small: I let Claude run Blender for / BIG: **a full day** |
| 6 | No modelling. No hand animation. I never touched a single vertex. | small: I never touched / BIG: **a single vertex** |
| 7 | I gave it one reference picture at a time and let it work. | no text. The three reference pictures pile up on the wall behind you, one per beat |
| 8 | It wrote the code, rendered test frames, looked at them, and fixed its own mistakes. | small: it looked at its own renders and / BIG: **fixed its mistakes**. Smooth zoom in as the photos leave |
| 9 | It even threw out its own shots when they weren't good enough. | no text. Plain talking head (hard cut back out of the zoom) |
| 10 | And none of this is AI video. Every frame came straight out of Blender. | inverted: small yellow: none of this is / BIG white: **AI video**, then full-frame montage cutaway of the three clips with the stack: small: every frame / BIG: **straight out of blender** |

## Part 3: Welcome (on camera, about 10s)

| # | Say this | Text on screen |
|---|---|---|
| 11 | I'm Aidan. I'll show you all three builds, how it made them, and how to set it up yourself. | BIG white: **what's up** / small yellow oblique: I'm Aidan ~ ; then the punch word swaps in one slot: **the builds**, **the method**, **the setup** |
| 12 | Let's get into it. | cut straight into the video |

---

## Lines to check before recording

- **Line 5, "a full day."** The Blender session that produced these three builds ran about three and a half hours (18:36 to about 22:00 on 7 Oct), not a full day. If more builds are added before filming and it becomes a day of work, the line stands. Otherwise swap to "for one evening" (on screen: **one evening**).
- **Line 11, "all three builds."** Change the number if more builds are added.
- **Line 1 and 2 numbers** are from the scenes: 1,424,229 faces in the ring ship, 115 bones in the tree creature.
- **Line 10** is true as of 7 Oct: every still and clip is a Blender render, no Higgsfield or Seedance pass was run.

## Cold open clips (all real Blender output, nothing to generate)

Base folder: `/Users/aidanstanik/Projects/Aidan Stanik/Projects/Blender/scenes/`

| Line | Clip | Source |
|---|---|---|
| 1 | Ring ship: slow push on a still, then two quick action stills | `ringship_nebula/render/ringship_hero_1080p.png`, `ringship_nebula/render/shots/a3_wall_run.png`, `ringship_nebula/render/shots/a1_deck_skim.png`, `ringship_nebula/render/shots/c4_top_down.png` |
| 2 | Tree creature: head tracks the insect, then the blink | `tree_creature/render/tree_creature_1080p.mp4` (about 2.7 to 5.3 s, and 6.2 to 6.8 s) |
| 3 | Caterpillar: the happy wiggle, then the turn to the lens | `caterpillar_flower/render/caterpillar_flower_quick_1080p.mp4` (about 6.1 to 7.6 s, and 8.0 to 9.5 s); swap in `caterpillar_flower_1080p.mp4` when the full-quality render finishes |
| 4 | All three side by side, or cut to black | the same files |

The ring ship has stills only (the user chose not to render its animation), so line 1 needs a push or pan made in the edit.

## Recording notes

- 4K if possible, camera locked off, empty wall on one side for the text and the wall card.
- Record Part 1 in the same session and on the same mic as Parts 2 and 3.
- Send the file and the cut is built to this script.
