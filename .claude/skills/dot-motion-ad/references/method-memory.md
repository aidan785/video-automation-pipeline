
The working method for recreating a reference motion ad (ChatGPT "Intelligence Age") shot for shot in HP identity. Aidan plans to turn this into a skill. Built in `video-projects/hp-teaser-cg-proof/index.html`; research and strips in `video-projects/hp-teaser-translated/_research/`.

## Process
1. **Study the reference frame by frame before building.** Sample every frame at 24fps around each transition (labeled strips). Measure the motion: track blob radius and position per frame to get real easing curves, e.g. the opening breath is about cubic-bezier(.5,0,.3,1). Write a shot table and a transition table, then give Aidan a review of motion, design and story before animating.
2. **Show a small motion proof first**, then build scene by scene on their clock.
3. **The PNG is the gate.** Use `scripts/style-library/_hp3-shot.mjs <html> <out> t1,t2..` sheets around every transition.
4. **Run `scripts/style-library/_glitch-scan.mjs <html> <compId>` after every change.** It steps every frame and flags frame-diff spikes. Only intended hard changes may spike (bursts, covers, invert cuts).

## Aidan's motion rules (each one came from a correction)
- **Match cuts: speed crosses every cut.** Each transition has its own easy-ease. Either A exits fast and B enters fast and settles, or A winds up slowly, accelerates into the cut, and B lands fast and settles. Never stop then restart.
- **Never insert stops or wind-ups he didn't ask for.** I once added a pause and a re-spin on the coin and he had to correct me: "it's continued spinning as it's slowing down".
- **Continuity:** "where the end of that scene is, how the dots are, that's how it eases into the next scene. You can't just glitch them or move them." Every morph starts from the exact last-frame dot positions, with per-dot delays that don't jump.
- **No standalone effect particles.** The dots ARE the material: whatever is on screen must itself become the next thing (picked up and reshaped, or dropped away). A separate dust/particle effect that appears from nothing and then forms the next object reads as "just an animation" (Aidan stopped the dust->corn build for this). E.g. horses drive by, the dotted field they ride on waves in their wake, and the corn pops up out of that same field.
- **Figures are already moving when they form.** Particles chase anchors on the live, animating rig (primitive index plus parameter), never a frozen pose.
- **The camera always moves.** It zooms in before the event lands (the spear), and the zoom's momentum carries into the next scene: the next dots arrive already moving.
- **Transitions should be causal.** The spear lands, then the camera dives into the spearhead dot, which becomes the maroon ground. The fire spins up into a spiral, becomes the coin, slows, opens into the wheel while still turning, fills into the dot, then the dot shrinks and bursts into the horses.
- **Motion blur on everything:** 5 sub-frames over a 270-degree shutter, averaged. Use a shorter shutter on very fast zooms or bursts, otherwise they step.
- **No decorative glyph flecks on objects.** Aidan rejected code characters scattered around the rocks during the glitch ("I don't want that at all"). Glitches stay clean: scale/position only. SIGNAL code belongs in the corners and as the fire material, not as sprinkles.
- **Never push later beats off the music.** Absorb new motion inside the existing window; he noticed a 1s drift immediately.
- **Slight gradient-noise "boil" on dots** (about 2px drift and ±7% radius) plus 5% animated grain.
- **Bigger is better for hero objects** (coin and wheel at radius 330).
- **Spins vs. the held frame rate (wagon-wheel):** at STEP_FPS 18 a 4-fold symmetric spin over ~45deg per held frame strobes and looks stuck/backwards (Aidan saw it frozen). Keep per-frame rotation under ~35deg (omega <= ~10.5 rad/s at 18fps) and sell speed with arc smears. Enter spins as a rigid propeller turn of the existing layout that eases into the final ring, so frame 1 of the spin = last frame before it.
- **Dark subjects in footage vanish as dots** (black locomotive on snow): add a gradient/edge term (max(curve(L), edge)) so the silhouette is outlined, and sample the sprite at higher res (360x204) so edges are clean.
- **Frame rate:** currently held at 18fps via the `STEP_FPS` switch. He tried 12.

## Tech recipe
- One continuous scene system (`state(t)`), early and late clocks shifted by SH so added beats don't retime the rest.
- WebGL2 metaball shader for gooey dots.
- Figures are primitive rigs (segments, discs, ellipses) rasterized onto a strict dot grid, with dots at 44% of the grid pitch. Line half-width must be at least about 0.65 of the pitch or diagonals break.
- Particles use bezier arcs with momentum and a cascade delay.
- Spins are one analytic angle function; morph progress rides its deceleration.
- Keyed stock footage looked bad. Aidan rejected the dancer ("it's supposed to be a guy with a spear"), so rigs are preferred.

Related: [[hp-signal-teaser]], [[hp-v3-field-glass]].
