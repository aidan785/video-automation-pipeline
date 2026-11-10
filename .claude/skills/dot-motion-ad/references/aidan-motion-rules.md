# Aidan's motion rules (each one came from a correction)

## Flow and transitions

1. **"Too choppy, no flow."** (motion proof v1) The causes were CPU metaballs dropping frames and phases starting from rest or teleporting. AE flow means:
   - every move overlaps the next
   - nothing starts from rest
   - motion blur everywhere
   - the camera is always drifting
2. **Each scene has its own easy-ease, and speed hands off across the cut.** "Whether that's a match cut where it starts fast and slows down, or it starts slow and moves up fast and then that next transition is fast and slows down."
3. **Never insert stops or wind-ups he didn't ask for.** Fire→coin→wheel→dot→horse is ONE spin. "It's spinning. It's showing the full circle. It's continued spinning as it's slowing down. It then merges into the steering wheel and then it merges into the dot, which then merges into the horses." I once added a pause and a re-spin and he had to repeat himself.
4. **Spin decel can't brake to a dead stop.** "It slows down to that exact point. It just needs to be a little bit faster, or less dots on the full circle before it transitions … and then it pops open." Use a short decel (0.8s) with a residual spin that never dies.
5. **Continuity.** "Where the end of that scene is, how the dots are, that's how it eases into the next scene. You can't just glitch them or move them." Every morph starts from the exact last-frame dot positions, and per-dot delays must not jump. (Bug I hit: swirl dots with start delays jumped back by `spinA(t0)` when the swirl started.)
6. **Figures are already moving when they form.** "Make sure that they're already moving before the animation plays, because right now it plays and then it just pauses." Particles chase anchors on the LIVE rig (primitive index + parameter), never a frozen pose.
7. **Camera zooms in before the event lands.** "The camera needs to be zooming in as it's about to land. The spear zooms in and those dots that pop up are already moving. Remember, this is match cuts." The dive's zoom carries through the cut, so the stones are already expanding out.
8. **Causal transitions.**
   - The spear lands, then the camera dives into the spearhead dot, which becomes the ground.
   - The fire spins into a spiral, becomes the coin, slows, and opens into the wheel while still turning.
   - The wheel fills into the dot, and the dot shrinks and bursts into the horses.
9. **The dots ARE the material.** On the dust→corn attempt: "the dots picked up is just like an animation. Those dots need to be picked up and turned into the corn, or they need to be dropped." Whatever is on screen must become the next thing.
10. **"CapCut effects on MP4s" is the failure mode.** "It doesn't look great … not acceptable." This was said about corn/sea/ship rigs that looked pasted on. If a scene isn't landing, ask what would help, or propose a different scene ("We can also create a different scene").
11. **Think of the transition first, then generate assets.** "I want to make sure that these transitions are landing correctly before we're generating stuff."

## Motion blur

12. **"Add motion blur on all of these."** Each frame is 5 sub-frames over a 270° shutter, averaged. Use a shorter shutter on very fast zooms or bursts, or they step.
13. **Never blur across a 1-frame ground flip** (invert cut, strobe). Use the `gAt()` ground-state check: if the state changes inside the shutter, the shutter is 0.
14. **Glitch frames render with zero shutter.** Blurred glitches read as ghosts.
15. **Spinning objects use arc/streak smears, not sub-frame ghosts.** Ghost copies looked bad on the 4-ball spin.
16. **Path smears for particle systems.** In the ending, each dot smears along its own path over 1.25 comp frames (270° of an 18fps held frame), capped at about 90px. Stacking smears AND sub-frames makes stepped "ladders".
17. **Smear along the stream, not along lateral waves**, or you get a sawtooth. Keep smears shorter than the dot spacing or the dots read as solid static lines (no sense of motion).
18. **Check that blur is actually on.** One `mk` rule in `draw()` zeroed the shutter for everything after f912. The ending was "choppy" because it had no blur at all.

## Frame rate and time

19. **Held frames at 18fps** (`STEP_FPS = 18`). He tried 12 ("turn the frame rate to 12, I just want to see"), then settled on 18. A 30fps frame number can land on a held frame.
20. **Wagon-wheel effect.** At 18fps, a 4-fold symmetric spin over about 45°/frame strobes and looks frozen or backwards. Keep per-frame rotation under about 35° (omega ≤ ~10.5 rad/s) and sell speed with arc smears.
21. **"Don't delay the sounds."** He noticed a 1s drift instantly. Never add time that pushes later beats; squeeze inside the window (the stone beat used a compression factor `CFIRE` so everything after resyncs at `T_RESYNC`).
22. **Hard frame targets are sacred.** He had to repeat "I said this needs to cut off at 935 … like I said before". Re-read his numbers before every change.

## Look

23. **Slight gradient-noise "boil" on dots**: about ±2.2px drift and ±7% radius, plus 5% animated film grain.
24. **Bigger is better for hero objects** (coin/wheel at R 330, bulb with its base on the bottom edge of frame, plane bigger).
25. **No decorative glyph flecks on objects.** "Little symbols next to them. I don't want that at all." SIGNAL code belongs in the corners and as material (the fire made of our symbols, the plane exhaust, train smoke), never as sprinkles.
26. **"Organic, not these waves."** Rejected the concentric light rings off the bulb. A tap = a quick burst of small dots that pop out and are gone in 0.4s, and the light shines.
27. **Exactly what he says, counted.** "Exactly two taps." Tap 1 flashes on then off, tap 2 turns it on and it stays lit.
28. **No visible tile borders** around footage sprites. Feather the sprite edges (skeleton box).
29. **Masks, not colour flips.** f852: the maroon frame (with the ship inside) shrinks as a rounded rect into a circle = the first ball. Cream is revealed around it, and the ball edge is always maroon. It took three misreads; when he describes a colour state, think "mask".
30. **No little ring.** The spinning balls "merge into the background": metaball chains swirl and merge into a blob that floods the frame.
31. **Readable footage.** "Really hard to see these and determine what they actually are," then "I would like to still see the water." Use a fine grid, continuous tone and local contrast, track and enlarge small subjects, and add texture-based detail for dark areas.
32. **Depth and real anatomy.** DNA: "add depth with different size dots", "big dots on each of the ends and small dots connecting", one strand, close, then a fast zoom-out with motion blur.
33. **Bird's-eye when he says so** (plane). A man when the audio is a man (reporter).
34. **Ending:** "quicker, choppy, easy ease, motion blur, more waves", then "extend those dots out more and blur them so it looks like they are ever going".

## Process

35. **Studio, not my custom player.** "I need the studio open." Restart and open it after every change ("reopen the server" was asked many times). Keep archives OUT of the project folder (about 20 archived comps made Studio hang).
36. **Pay close attention to how detailed his prompts are.** "We have been through this back and forth multiple times. Now try to apply it."
37. **Story over disconnected scenes.** The Coinbase remake was rejected because "it's just a bunch of scenes that have been cut up. There's no actual story."

## People and composition (11/6, the v3 tool scene)

38. **Every person must read as a person at a glance.** "Look at the guy at the light bulb, you can't even tell the person at the computer." A front-facing figure with a bulb on its head read as a lamppost; a standing typist merged into the monitor. Fixes that worked: side-on figures, the head always clear of tools and arms (no arm running up through the head, no spear resting on it, no fist next to the head that reads as a second head), the tool held out at arm's length, a seated typist on a dotted chair left of the desk. Check a 2x crop of every figure before showing him.
39. **Keep the group centred, nothing leaves frame, little horizontal travel.** "Can you not make him move as horizontally as much... the spear is going out of frame, so it needs to all kind of stay centered." Lay the row out by its real extents (spear tail to desk edge) centred on 960 with ~180 px margin; rolling / walking travel about 30 px, not 90.
40. **No ground line under figures.** "Remove the line under it." If the spray can't land on a line, the people form out of their own tool (dots stream off it), so nothing appears from nothing.
41. **Go forward, never back.** "From that scene, don't go back to the four dots, just transition it into the dots with the depth of field for the ending." A scene hands off by exploding into the NEXT scene's dots (paired dot to dot, sharp -> depth of field in flight), not by folding back to an earlier state.
42. **Variations must look different.** 15 variants where switches (stick vs filled, bold dots) were invisible at playback size wasted his review. Vary the idea, not the parameter.
