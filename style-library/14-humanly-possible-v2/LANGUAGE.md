# The Humanly Possible design language

Draft, 2026-11-03. One system for the show, distilled from frame-by-frame research of real, human-made work (about 25,000 frames read across 14 videos: Burger King / JKR, Spotify Wrapped, Chef's Table, Great Big Story, The North Face, Salomon, Patagonia, Apple, A24, Vox, Aidan's reel) and the 30 cards built from it in this folder.

It is not "five styles to pick from". It is one language with registers: the show speaks calmly most of the time and punches on the moments that earn it.

## The ten laws (each one was found independently in at least three of the studies)

1. **Real first.** Real footage, real photos, real paper scans, real codec damage carry the frame. Graphics are the smallest layer. No generated imagery, no simulated textures. (All five studies.)
2. **No containers.** Type sits in the negative space of the shot or on a full color field. No boxes, plates, accent stripes, outlines or shadows. The only rectangles allowed mean something: a text selection (the words are about to change) or a stroke that is itself the animation. (Kinetic, Netflix, outdoor, Apple, collage: zero containers in about 20,000 frames.)
3. **Timing is tied to something real.** Things change on the picture cut, on the spoken word, or at the pace of a hand typing, never on a preset curve. (Outdoor: 9 of 11 supers exit on the cut. Apple: typing lands on the cut frame.)
4. **One property per move, each with its own curve.** A super only fades, a box only opens, a number only rolls. Each gets the curve measured from its reference: an accelerating ink-in, an ease-out opacity fade, an S-curve count, a 3-frame slam. Never one house ease for everything. (Netflix, outdoor, Apple, kinetic.)
5. **Hold still while people read.** Once something lands it does not drift, float or breathe. Burger King repeats 46% of its frames exactly; Vox 42%; graphic shots in the outdoor films hold 6 to 19 s. Motion is the entrance, then stillness.
6. **Graphics belong to the edit.** They come in after the cut (5 to 18 frames of clean picture first), leave on a cut, and can carry across a cut when the thought continues. (Outdoor, Apple, Netflix.)
7. **Quiet emphasis.** Emphasis is weight, size, an italic, or a field color swap. Never glow, stroke, underline bar or a second accent color. One gold word or number per frame, one orange mark per frame.
8. **Human irregularity.** Durations differ shot to shot (8, 7, 8, 8, 14, 29 frames). Pen marks overshoot and highlighters stop short of the last letter. Typing has uneven gaps. Nothing is perfectly centered, symmetric or evenly spaced unless it is a single title card.
9. **Things grow out of what they belong to.** A title box grows from a line, a panel grows from its own button, an iris grows from the period of the last word. Nothing appears from nowhere.
10. **Two cadences.** The camera, typing and counters run on ones (every frame). Pasted, drawn and flipped things run on twos or on uneven counts. The mix is what reads hand-made.

## Registers: when the show uses what

| Moment in an episode | Register | Built from | Cards |
|---|---|---|---|
| Most of the conversation | **Quiet**: plain cream supers in the shot's negative space, picture first, out on the cut | Outdoor doc, Netflix supers | `cards/outdoor-doc/`, `cards/netflix-doc/name.html` |
| Showing the AI work | **Hands**: real screen and phone footage, typed text with a caret, select-delete, a hairline pinned to the screen | Apple, outdoor (Patagonia hairline), kinetic | `cards/apple-a24/ai-screen.html`, `cards/outdoor-doc/ai-screen.html`, `cards/kinetic/ai-screen.html` |
| The result, the payoff, the open's hook | **Punch**: flat color fields, one word per cut, the slam, glyph crops | Kinetic | `cards/kinetic/` |
| History, receipts, "where this started" | **Paper**: real scans, pen and marker, archival cutouts, paper flicker on twos | Collage | `cards/collage/` |
| The guest's best line | Any register, chosen by its energy: quiet (A24 serif on the cut), paper (Vox callout), punch (word per cut) | | `cards/*/quote.html` |

Rule of thumb: an episode lives in Quiet, uses Hands every time the AI is on screen, and earns Punch two or three times. Paper appears only when there is real history to show.

## The vocabulary (named moves)

| Move | What it is | Measured from | Where |
|---|---|---|---|
| **The Line** | A 3 px line snaps out, opens into the title box, and closes back to a line. | Great Big Story f220-350 | `netflix-doc/name.html` |
| **The Caret** | Text typed one character per frame, an orange caret, gold selection right to left, deleted in one frame. | Apple Mac Students f1152-1244 | `apple-a24/` |
| **The Slam** | A word held small for 3 to 5 frames, then full bleed in about 3 frames, then dead still. | Burger King f112-133 | `kinetic/name.html`, `kinetic/quote.html` |
| **The Field Swap** | The whole background color changes on the payoff word, like a stress mark. | Burger King f6-218 | `kinetic/` |
| **The Breath** | One to three frames of empty field between beats. | Burger King f656-658, f685 | `kinetic/` |
| **The Pen** | One orange hand mark (ellipse, bracket-arrow) that overshoots, with a different tremble each frame, then holds. | Vox OK f1541-1550 | `collage/` |
| **The Marker** | A gold highlighter, 4 frames, low on the letters, stopping short of the last one. | Vox OK f1164-1169 | `collage/` |
| **The Hairline** | A 3 px line traced along something real in the footage, with labels pinned to it. | Patagonia f2033-2485 | `outdoor-doc/ai-screen.html` |
| **The Ink-in** | Text appears on an accelerating curve over about 40 frames, letters never move. | Chef's Table f124-160 | `netflix-doc/ai-screen.html`, `quote.html`, `title.html` |
| **The Carry** | A caption that survives a cut and finishes in the next shot. | Apple f304, Salomon f13174 | `outdoor-doc/transition.html` |

## Color and type (unchanged brand, used by register)
Oxblood, cream, brick, orange, gold, deep; Bricolage Grotesque 800 + Inter Tight. Quiet: cream type only, color lives in the grade (split-tone toward deep and orange). Hands: cream field or real screen, orange caret, gold selection. Punch: whole fields in the palette, swapped on payoff words. Paper: real paper, orange pen, gold marker, brick cut paper.

## Sound
No sound rules yet.

## What is banned
See `DESIGN.md`. Enforced by `scripts/style-library/lint-hp-tells.mjs`.
