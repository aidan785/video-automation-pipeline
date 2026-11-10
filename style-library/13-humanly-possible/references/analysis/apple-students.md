# Apple: "Mac Students: The journey to great ideas in college" (1:34)

Source: `video/apple-students.mp4`, 960x720 (4:3 crop of the film). Bursts in `bursts/apple-students/`, hero frames in `picks/`.

## One-paragraph read

There are almost no overlay graphics in this film, and that is the lesson. The "graphics" are real software photographed in-camera as extreme macro shots: a notification on a laptop screen, a dragged file icon, a filename list, a red error button, a green SUBMIT button. Shallow focus, visible screen texture and the warm, dim grade make the UI feel physical and human instead of like a screen capture. The story is told through a repeated UI motif (each student drags their project file toward the Trash), cut in rhythm as match cuts across five characters, then resolved with a single click on SUBMIT. Real type only appears at the end: one small, white, sentence-case super ("Great ideas start here") cut on in a single frame at the center of the frame, a "Mac" lockup that cuts on at the same spot over the next shot, then a black hold and a slow apple logo fade. The premium feel comes from restraint: tiny type, no boxes, no animation on the text, and every bit of motion living in the camera and the cut.

## Inventory

| Time | Type | Layout | Type treatment | Color | Surface | Enter | Exit | On screen |
|---|---|---|---|---|---|---|---|---|
| 0:01.8 | In-camera notification macro "Time Sensitive / Screenwriting Final Due" | Notification card upper right of the laptop screen, about 35% of frame wide | System sans (SF), small caps label + 2 lines | White on dark translucent card over teal wallpaper | Photographed screen, slight softness | Cut in from a wide dark room shot | Cut to face close-up | 1.7s |
| 0:10.8 | File icon floating over a city photo (wallpaper) | Icon at about 60% x, 30% y, then travels down-right toward the dock | Selected filename in blue system label | Green app icon, blue label | Photographed screen, camera pulls back and racks focus revealing it is the laptop wallpaper | Cut; begins as what reads like a real skyline with a floating icon | Camera reveals dock and Trash, file hovers over Trash | about 3s |
| 0:31.1 to 0:31.8 | Red error banner "Robot is in error: Invalid syntax" | Across the upper middle of an IDE | System sans in red bar | Red bar on near black | Photographed | Bar slides in left to right over about 2 frames | Cut | about 0.8s |
| 0:35.3 to 0:39.0 | Match-cut montage: project files dragged toward Trash | Icon + Trash at varying positions, always macro | Filename labels ("Marketing Class Mumb...v17.key", "shortfilm_v7.fdx", "Lampe_v17.f3d") | Each student's file color | Photographed screens | Hard cuts every 0.4 to 0.9s | Cut | about 8s total |
| 0:39.5 to 0:40.3 | Filename version ticker "final.key / final_v2.key / almost_final_fin / UGGHHH.key / UGGHHH_v3.key" | Full frame macro, text about 18% frame height | System sans, huge from macro distance; selected row in blue bar | Black on pale gray, blue selection | Photographed screen, edges soft | List scrolls upward one row every 2 to 3 frames | Cut | about 1s |
| 0:41.2 | FaceTime incoming call banner | Upper right, system UI | System sans | Dark card, red and green buttons | Photographed | Cut | Cut | 0.6s |
| 1:10.3 | "Reset error" red button + teal tooltip, hand cursor | Button across 0 to 85% width at 30 to 55% height; tooltip below | System sans medium | Red, teal tooltip, black UI | Photographed macro | Cut in, cursor already on target | Click: red bar collapses toward the left in about 3 frames | about 0.4s |
| 1:14.0 | Stat "17%" slide in Keynote with green triangle | Huge "17%" bottom left, cropped by frame | Bold grotesk | Green, black | Photographed | Cut | Cut | about 0.5s |
| 1:22.7 | "SUBMIT" button click | Button center right, 45% wide | Uppercase system sans | Green to gray "SUBMITTED" | Photographed macro on dark green desk texture | Cut; cursor moves in, button darkens on press (1 frame), label changes to SUBMITTED | Cut | 1s |
| 1:24.4 | Super "Great ideas start here" | Dead center, about 30% of frame wide, cap height about 3% of frame | Sans (SF Pro Display medium), sentence case, normal tracking | White | Text only over a dim wide shot | Hard on in one frame, no fade, no movement | Hard cut together with the shot change | 1.8s |
| 1:26.3 | "Mac" lockup | Same center position as the super, sitting on the laptop lid in the shot | Apple logo + "Mac" in the same sans | White | Text only | Cuts on with the new shot | Fades out as the girl moves toward camera | 1.7s |
| 1:30.0 | Apple logo end card + legal line | Logo center, legal at 80% height in tiny gray | Logo mark, legal about 1% frame height | White and dark gray on black | Black | Black hold 1.1s, logo fades in over about 0.5s | End | 3.4s |

## Motion grammar

- Easing feel: there is almost no animated motion in the graphics. Motion lives in the camera (slow push-ins, pull-backs, rack focus) and in UI behavior the actors perform (cursor drags, clicks, scrolling lists).
- Entrance duration: supers are 1 frame on. The only fades are the end logo (about 15 frames) and the Mac lockup exit.
- What moves vs what holds: type never moves. The cursor and the file icon are the only "graphic" things that travel, and they travel because a person is moving them.
- Text reveal: whole line at once. No per-word, no per-letter.
- Relation to cuts: the edit is the animation. Cuts accelerate from 3 to 4s shots at the open to 0.3 to 0.6s shots in the Trash montage, then breathe out to 2s shots for the resolution. The super is placed exactly at frame center and the next lockup lands in the same spot on the next shot, so the eye stays still across the cut. There are a few dark, out-of-focus smear frames between shots around 1:12 to 1:13 that act as soft "dip through darkness" transitions.

## Signature moves

1. **In-camera UI macro instead of a screen-capture card.** Shoot (or fake) the guest's real screen as a tight macro: crop to 25 to 40% of the screen, slight defocus at the edges, a slow 3 to 5% push-in over 1.5s, warm grade and grain on top. In HTML: render the UI element big (filename at 180px, button at 40% of frame width), add a radial blur mask at the edges (CSS mask with blur layer behind), scale 1.0 to 1.04 linearly across the shot, overlay grain.
2. **Recurring UI motif as a match-cut chain.** The same action (file to Trash) repeated across characters in 0.4 to 0.9s cuts, each icon landing roughly where the last one left so the cut feels like one motion. In HTML: a sequence of 5 to 7 short cards where a single icon sits at a shared anchor (for example x 1150, y 620) and each card swaps background and label around it.
3. **Version-name ticker.** A huge vertical list of filenames ("final", "final_v2", "UGGHHH_v3") scrolling up one row every 0.08s with a blue selection bar fixed in the middle. Comedy and struggle told by type alone. In HTML: a 3-row window 1080 tall, rows 360 tall, translateY in steps of one row on a stepped timeline.
4. **Click as the climax.** Cursor travels into the button over about 0.5s with a soft ease-out, 1-frame press state (darken 15%), label swaps to its done state, then a hard cut to the reaction. In HTML: cursor SVG tween, then a set() on the button for press and label change.
5. **Center-locked super, one frame on, handed to the next shot.** Single line of small sentence-case sans (about 56px at 1080p), white, dead center, no box, cut on with no fade, hold 1.8s, then the brand lockup replaces it at the same center point on the next shot. End: 1s of black, then logo fades in over 0.5s and holds 3s.

## Fit for Humanly Possible

1. **In-camera UI macro: fits very well and suits our "real person, real AI use" premise.** When the guest shows the prompt, punch into a macro of the exact line instead of a full screen card. Over the macro, at most one orange #FF8A4C underline or a gold #FFC145 highlight on one word. Keep it flat, no glass panel. The slow push-in breaks our "quick pop-and-settle" rule only in the camera layer, which is fine since it is footage, not a UI graphic.
2. **UI motif match-cut chain: fits as a cold-open device.** For an episode intro, chain 4 to 6 sub-second macros of the guest's real moments (typing the prompt, the AI reply arriving, the result). Cut hard; frame each on a brick #7A1E1E surface if they are screenshots rather than footage.
3. **Version-name ticker: fits.** Bricolage 800 cream rows on oxblood, the selected row on a brick bar, the final row in gold. Stepped motion fits our snappy rule. Great for "I rewrote this prompt 14 times."
4. **Click as climax: fits.** Cursor pop-and-settle into an orange button (our one accent for that frame), 1-frame press, label swap, cut.
5. **Center-locked small super: fits for the episode title and end line,** in cream Inter Tight or Bricolage at modest size on footage with grain, cut on in one frame. The long black hold plus slow logo fade conflicts with our "no long fades" rule; use a 0.2s pop for the Humanly Possible mark on oxblood instead and keep the 1s held beat before it.

Does not fit: the reliance on Apple's dark, warm cinematography to carry the whole piece. We cannot get that from motion graphics alone; on our show the macro treatment only works if the guest's screen footage is shot or graded with the same care.

## Picks

- `picks/apple-students_notif-macro.jpg`: macro of the laptop screen with the "Time Sensitive / Screenwriting Final Due" notification.
- `picks/apple-students_file-over-city.jpg`: dragged .fdx file icon floating over the city wallpaper, before the pull-back reveals the screen.
- `picks/apple-students_icon-to-trash.jpg`: F3D project file hovering over the Trash in the dock, one beat of the match-cut chain.
- `picks/apple-students_filename-ticker.jpg`: extreme macro of the filename list, "final.key" selected in blue.
- `picks/apple-students_reset-error.jpg`: red "Reset error" button with teal tooltip and hand cursor, macro.
- `picks/apple-students_submit-click.jpg`: cursor pressing the green SUBMIT button, the film's climax.
- `picks/apple-students_super-great-ideas.jpg`: centered white sentence-case super "Great ideas start here" over the dim kitchen wide.
- `picks/apple-students_mac-lockup.jpg`: Apple "Mac" lockup at the same center point, sitting on the laptop lid.
- `picks/apple-students_end-logo.jpg`: apple logo end card on black with the tiny legal line.
