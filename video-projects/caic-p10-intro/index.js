/* =============================================================================
   CAIC P1.0 — Intro: The Process Audit
   Kallaway "Aurora Glass" motion edit. One master timeline drives:
   1) the video layout state machine (FULL / PIP bottom-right / OFF),
   2) every graphics beat, absolutely timed to the clean-cut transcript.
   All times are on the clean-cut timeline (assets/transcript.json).
   ========================================================================== */
(() => {
  const DUR = 335;            // composition duration (video 331.69 + outro hold)
  const tl = gsap.timeline({ paused: true });

  /* ---------- video layout geometry ---------- */
  // PIP: bottom-right, 31% scale. Wrapper origin is 0 0.
  const PIP = { x: 1264, y: 685, scale: 0.31 };
  // border radius is divided by scale so it *reads* as 24px on screen
  const PIP_R = 77;

  const wrap = '#vidwrap', frame = '#vidframe', rim = '#vidrim';

  // Smooth blur-eased layout move. t = start time. 0.7s transform + blur hump.
  function move(t, props, { radius = null, rimOp = null, d = 0.7 } = {}) {
    tl.to(wrap, { ...props, duration: d, ease: 'power3.inOut' }, t);
    // motion blur: ramps in for the first half, resolves in the second
    tl.to(wrap, { filter: 'blur(14px)', duration: d / 2, ease: 'power2.in' }, t);
    tl.to(wrap, { filter: 'blur(0px)',  duration: d / 2, ease: 'power2.out' }, t + d / 2);
    if (radius !== null) tl.to(frame, { borderRadius: radius, duration: d, ease: 'power3.inOut' }, t);
    if (rimOp  !== null) tl.to(rim,   { opacity: rimOp, borderRadius: radius ?? 0, duration: d, ease: 'power2.inOut' }, t);
  }
  const toFULL = (t) => move(t, { x: 0, y: 0, scale: 1, opacity: 1 }, { radius: 0,     rimOp: 0 });
  const toPIP  = (t) => move(t, { x: PIP.x, y: PIP.y, scale: PIP.scale, opacity: 1 }, { radius: PIP_R, rimOp: 1 });
  // OFF: glide down out of PIP / fade with blur (graphics own the frame)
  function toOFF(t, d = 0.6) {
    tl.to(wrap, { opacity: 0, y: '+=90', duration: d, ease: 'power2.in' }, t);
    tl.to(wrap, { filter: 'blur(18px)', duration: d, ease: 'power2.in' }, t);
  }
  // return from OFF to a target state: pre-place, then resolve in
  function fromOFF(t, target, { radius = 0, rimOp = 0, d = 0.8 } = {}) {
    tl.set(wrap, { x: target.x, y: target.y + 90, scale: target.scale, opacity: 0, filter: 'blur(18px)' }, t);
    tl.set(frame, { borderRadius: radius }, t);
    tl.set(rim, { opacity: rimOp, borderRadius: radius }, t);
    tl.to(wrap, { y: target.y, opacity: 1, duration: d, ease: 'power3.out' }, t);
    tl.to(wrap, { filter: 'blur(0px)', duration: d * 0.8, ease: 'power2.out' }, t + d * 0.2);
  }

  /* ---------- layout timeline ---------- */
  // Cold open: video hidden under B1 type
  tl.set(wrap, { opacity: 0, scale: 1.06, x: -57, y: -32, filter: 'blur(22px)' }, 0);
  // 5.0  reveal FULL (B1 dollies through as this resolves)
  tl.to(wrap, { opacity: 1, scale: 1, x: 0, y: 0, duration: 1.0, ease: 'power3.out' }, 5.0);
  tl.to(wrap, { filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }, 5.2);
  toPIP(24.2);            // pillar title + checklist
  toFULL(43.3);           // two tracks
  toPIP(79.1);            // chat bubbles
  toOFF(101.8);           // doctor takeover
  fromOFF(118.2, { x: 0, y: 0, scale: 1 });                      // back to FULL
  toOFF(137.4);           // audit title takeover
  fromOFF(146.5, { x: PIP.x, y: PIP.y, scale: PIP.scale }, { radius: PIP_R, rimOp: 1 }); // rail section
  toOFF(219.5);           // Brightwater takeover
  fromOFF(231.5, { x: PIP.x, y: PIP.y, scale: PIP.scale }, { radius: PIP_R, rimOp: 1 }); // examples
  toFULL(270.3);          // discovery + trust
  // outro: fade out under end card
  tl.to(wrap, { opacity: 0, filter: 'blur(20px)', scale: 1.04, duration: 1.0, ease: 'power2.in' }, 328.8);

  /* ---------- ambient (deterministic, finite repeats) ---------- */
  tl.to('#bg .bloom',  { scale: 1.07, yPercent: -2, duration: 4, ease: 'sine.inOut', repeat: 82, yoyo: true }, 0);
  tl.to('#bg .bloom2', { opacity: 0.36, duration: 5, ease: 'sine.inOut', repeat: 66, yoyo: true }, 0);
  tl.to('#vig',        { opacity: 0.88, duration: 4, ease: 'sine.inOut', repeat: 82, yoyo: true }, 0);

  /* helper: standard entrance / exit */
  const inUp   = (t, sel, d = 0.8, y = 34)  => { tl.fromTo(sel, { y, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: d, ease: 'power4.out' }, t); };
  const inLeft = (t, sel, d = 0.8, x = -46) => { tl.fromTo(sel, { x, opacity: 0, filter: 'blur(8px)' },  { x: 0, opacity: 1, filter: 'blur(0px)', duration: d, ease: 'power4.out' }, t); };
  const spring = (t, sel, d = 0.7)          => { tl.fromTo(sel, { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: d, ease: 'back.out(1.4)' }, t); };
  const outBlur= (t, sel, d = 0.5, y = -60) => { tl.to(sel, { y, opacity: 0, filter: 'blur(16px)', duration: d, ease: 'power2.in' }, t); };
  const litOn  = (t, sel) => {
    tl.to(sel, { borderColor: 'rgba(55,189,248,0.65)', boxShadow: '0 0 22px rgba(55,189,248,0.55), 0 0 56px rgba(55,189,248,0.30), inset 0 1px 0 rgba(255,255,255,0.22)', color: '#FFFFFF', textShadow: '0 0 18px rgba(55,189,248,0.65), 0 0 48px rgba(55,189,248,0.35)', duration: 0.5, ease: 'power2.out' }, t);
  };
  const litOff = (t, sel) => {
    tl.to(sel, { borderColor: 'rgba(255,255,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 24px 70px rgba(0,0,0,0.5)', color: '#F0EEE9', textShadow: 'none', duration: 0.5, ease: 'power2.out' }, t);
  };

  /* =========================================================================
     B1 · cold open (0 – 5.9) — VO: "the most expensive mistake…" 0.3–5.1
  ========================================================================= */
  inUp(0.3, '#b1 .kicker', 0.7, 20);
  tl.fromTo('#b1 .l1 .word', { y: 44, opacity: 0, scale: 0.9, filter: 'blur(8px)' },
    { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.65, ease: 'expo.out', stagger: 0.14 }, 0.55);
  tl.fromTo('#b1 .l2 .word', { y: 26, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.16 }, 2.65);
  tl.fromTo('#b1 .l2 .before', { scale: 1 }, { scale: 1.12, duration: 0.3, ease: 'back.out(2)', yoyo: true, repeat: 1 }, 3.3);
  // dolly-through exit while the video resolves underneath
  tl.to('#b1 .inner', { scale: 3.1, opacity: 0, filter: 'blur(24px)', duration: 1.0, ease: 'power2.in' }, 4.9);

  /* =========================================================================
     B2 · never-the-build chips (8.6 – 23.4, over FULL)
     VO: sideways ~9.4 · under-scoped ~11.3 · unhappy ~13.7 · "never the build" 15.6
  ========================================================================= */
  inLeft(9.2,  '#b2 .ch1', 0.7);
  inLeft(11.1, '#b2 .ch2', 0.7);
  inLeft(13.5, '#b2 .ch3', 0.7);
  spring(15.7, '#b2 .pn', 0.7);
  tl.to('#b2 .chip', { opacity: 0.42, duration: 0.5, ease: 'power2.out' }, 16.0);
  outBlur(22.6, '#b2 .stack');

  /* =========================================================================
     B3 · pillar title + outcomes (24.2 – 43.4, under PIP)
     VO: audit the business 25.9 · walk into 31.2 · flows 33.5 · judge 35.8 · list 39.5
  ========================================================================= */
  inUp(24.9, '#b3 .head', 0.9);
  inLeft(31.0, '#b3 .r1', 0.8);
  inLeft(33.4, '#b3 .r2', 0.8);
  inLeft(35.7, '#b3 .r3', 0.8);
  inLeft(39.2, '#b3 .r4', 0.8);
  outBlur(42.6, '#b3 .head', 0.5);
  outBlur(42.7, '#b3 .list', 0.5);

  /* =========================================================================
     B4 · two tracks (49.5 – 61, over FULL) — agency 50.4 · employee 54.3
  ========================================================================= */
  inUp(49.9, '#b4 .la', 0.8, 44);
  inUp(50.15, '#b4 .lb', 0.8, 44);
  litOn(50.7, '#b4 .la');
  litOff(54.2, '#b4 .la');
  litOn(54.3, '#b4 .lb');
  outBlur(60.2, '#b4 .lanes', 0.5, -40);

  /* B4b · same-audit pill (71.8 – 78.4) — VO 72.0 */
  spring(72.0, '#b5same', 0.7);
  tl.to('#b5same', { opacity: 0, y: -30, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' }, 77.7);

  /* =========================================================================
     B5 · chat bubbles (79.1 – 101.6, under PIP)
     VO: "build me a chatbot" 84.9 · "lead gen" 86.8 · "word AI in it" 91–95
  ========================================================================= */
  spring(84.7, '#b5 .bb1', 0.65);
  spring(86.7, '#b5 .bb2', 0.65);
  spring(91.0, '#b5 .bb3', 0.65);
  tl.fromTo('#b5 .bb3 .ai', { textShadow: '0 0 18px rgba(55,189,248,0.65)' },
    { textShadow: '0 0 30px rgba(55,189,248,0.95), 0 0 70px rgba(55,189,248,0.5)', duration: 0.6, ease: 'sine.inOut', repeat: 3, yoyo: true }, 91.6);
  inUp(95.6, '#b5 .cap1', 0.8, 26);
  outBlur(100.9, '#b5 .thread', 0.5);
  outBlur(100.95, '#b5 .cap1', 0.5);

  /* =========================================================================
     B6 · doctor takeover (101.8 – 118.4, GFX)
     VO: hernia 104–109 · doesn't operate 106.5 · walk through 109.6 · prescribe 114.5
  ========================================================================= */
  spring(102.7, '#b6 .avatar', 0.6);
  spring(103.1, '#b6 .pbub', 0.7);
  inLeft(106.2, '#b6 .no-op', 0.7, 40);
  inUp(109.9, '#b6 .s1', 0.6, 30);
  tl.fromTo('#b6 .c1', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 111.2);
  inUp(111.8, '#b6 .s2', 0.6, 30);
  litOn(112.3, '#b6 .s2');
  tl.fromTo('#b6 .c2', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 113.4);
  inUp(114.1, '#b6 .s3', 0.6, 30);
  litOn(114.6, '#b6 .s3');
  litOn(110.4, '#b6 .s1');
  litOff(112.2, '#b6 .s1');
  litOff(114.5, '#b6 .s2');
  outBlur(117.5, '#b6', 0.6, -80);

  /* =========================================================================
     B7 · diagnose + roles (120.4 – 131.4, over FULL) + wrong-target pill
     VO: your job 118.5 · symptoms/diagnose 120.6 · order taker 126.6 · consultant 125.6
  ========================================================================= */
  inUp(120.6, '#b7 .mirror', 0.8, 40);
  spring(125.3, '#b7 .rg', 0.6);
  spring(126.5, '#b7 .rb', 0.6);
  tl.fromTo('#b7 .rb', { rotation: 0 }, { rotation: -2.5, duration: 0.16, repeat: 3, yoyo: true, ease: 'sine.inOut' }, 128.9); // "get blamed"
  outBlur(130.8, '#b7 .mirror', 0.45, -36);
  outBlur(130.85, '#b7 .vs', 0.45, -36);
  inUp(131.9, '#b7wrong', 0.7, 30);   // VO "aims at the wrong problem" 132.5
  tl.to('#b7wrong', { opacity: 0, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' }, 135.7);

  /* =========================================================================
     B8 · THE AI OPPORTUNITY AUDIT (137.4 – 146.5, GFX)
     VO: "four moves" 138.6 · name on screen 139.9–144.5
  ========================================================================= */
  inUp(138.0, '#b8 .kicker', 0.6, 22);
  tl.fromTo('#b8 .big', { scale: 0.92, opacity: 0, filter: 'blur(14px)' },
    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'power4.out' }, 138.4);
  spring(141.5, '#b8 .p1', 0.55);
  tl.fromTo('#b8 .k1', { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.inOut' }, 142.05);
  spring(142.35, '#b8 .p2', 0.55);
  tl.fromTo('#b8 .k2', { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.inOut' }, 142.9);
  spring(143.2, '#b8 .p3', 0.55);
  tl.fromTo('#b8 .k3', { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.inOut' }, 143.75);
  spring(144.05, '#b8 .p4', 0.55);
  // EXIT — big title dollies up; rail hands off to B9's pinned top rail
  tl.to('#b8 .inner', { y: -140, opacity: 0, filter: 'blur(22px)', duration: 0.7, ease: 'power2.in' }, 145.7);

  /* =========================================================================
     B9 · pinned rail + per-move stage (146.5 – 215.5, under PIP)
  ========================================================================= */
  // ENTRY — rail drops in from the top, matching B8's upward exit
  tl.fromTo('#b9 .toprail', { y: -70, opacity: 0, filter: 'blur(14px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out' }, 146.7);
  tl.set('#b9 .mv', { opacity: 0 }, 146.5);

  // — move 1 · REFRAME (163.5) —
  litOn(163.4, '#b9 .t1');
  tl.to('#b9 .mv1', { opacity: 1, duration: 0.3 }, 164.0);
  spring(164.2, '#b9 .rf-ask', 0.65);
  inUp(169.2, '#b9 .rf-arrow', 0.5, -18);
  spring(169.9, '#b9 .rf-real', 0.75);        // VO "no-shows … thousands a month" 170.3
  tl.to('#b9 .mv1', { opacity: 0, x: -50, filter: 'blur(12px)', duration: 0.5, ease: 'power2.in' }, 176.5);
  tl.set('#b9 .mv1', { x: 0, filter: 'blur(0px)' }, 177.2);

  // — move 2 · MAP (177.3) —
  litOff(177.2, '#b9 .t1');
  litOn(177.3, '#b9 .t2');
  tl.to('#b9 .mv2', { opacity: 1, duration: 0.3 }, 177.9);
  spring(178.1, '#b9 .n1', 0.5);
  tl.fromTo('#b9 .l1', { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, 178.6);
  spring(178.95, '#b9 .n2', 0.5);
  tl.fromTo('#b9 .l2', { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, 179.45);
  spring(179.8, '#b9 .n3', 0.5);
  // the mess (VO voicemail 181.9 · spreadsheet 184.2)
  tl.fromTo('#b9 .l3', { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }, 181.3);
  spring(181.75, '#b9 .n4', 0.55);
  tl.fromTo('#b9 .l4', { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }, 183.6);
  spring(184.05, '#b9 .n5', 0.55);
  tl.fromTo('#b9 .n4', { boxShadow: '0 0 22px rgba(255,59,48,0.3), inset 0 1px 0 rgba(255,255,255,0.22)' },
    { boxShadow: '0 0 34px rgba(255,59,48,0.6), inset 0 1px 0 rgba(255,255,255,0.22)', duration: 0.6, ease: 'sine.inOut', repeat: 3, yoyo: true }, 185.0);
  inUp(186.3, '#b9 .maplabel', 0.7, 24);      // "the mess is where AI helps or breaks" 186.2
  tl.to('#b9 .mv2', { opacity: 0, x: -50, filter: 'blur(12px)', duration: 0.5, ease: 'power2.in' }, 188.5);
  tl.set('#b9 .mv2', { x: 0, filter: 'blur(0px)' }, 189.2);

  // — move 3 · SCORE (189.3) —
  litOff(189.2, '#b9 .t2');
  litOn(189.3, '#b9 .t3');
  tl.to('#b9 .mv3', { opacity: 1, duration: 0.3 }, 189.9);
  inUp(190.2, '#b9 .gauges', 0.7, 30);
  const pv = { v: 0 }, pf = { v: 0 };
  tl.fromTo('#b9 .fv', { scaleX: 0 }, { scaleX: 0.82, duration: 1.4, ease: 'power3.out' }, 193.4); // "how much value" 193.3
  tl.to(pv, { v: 82, duration: 1.4, ease: 'power3.out', onUpdate: () => { document.querySelector('#b9 .pv').textContent = Math.round(pv.v) + '%'; } }, 193.4);
  tl.fromTo('#b9 .ff', { scaleX: 0 }, { scaleX: 0.45, duration: 1.4, ease: 'power3.out' }, 195.3); // "can AI actually do it" 195.2
  tl.to(pf, { v: 45, duration: 1.4, ease: 'power3.out', onUpdate: () => { document.querySelector('#b9 .pf').textContent = Math.round(pf.v) + '%'; } }, 195.3);
  inUp(197.7, '#b9 .scoreline', 0.7, 24);     // "not every valuable thing is automatable" 197.5
  tl.to('#b9 .mv3', { opacity: 0, x: -50, filter: 'blur(12px)', duration: 0.5, ease: 'power2.in' }, 201.5);
  tl.set('#b9 .mv3', { x: 0, filter: 'blur(0px)' }, 202.1);

  // — move 4 · SORT (202.2) —
  litOff(202.1, '#b9 .t3');
  litOn(202.2, '#b9 .t4');
  tl.to('#b9 .mv4', { opacity: 1, duration: 0.3 }, 202.8);
  inLeft(204.1, '#b9 .srow.now', 0.6);
  inLeft(205.3, '#b9 .srow.later', 0.6);
  inLeft(206.5, '#b9 .srow.leave', 0.6);
  // highlight pulse as he names each call (207.3 / 208.1 / 208.9)
  tl.fromTo('#b9 .srow.now',   { scale: 1 }, { scale: 1.035, duration: 0.25, ease: 'back.out(2)', yoyo: true, repeat: 1 }, 207.3);
  tl.fromTo('#b9 .srow.later', { scale: 1 }, { scale: 1.035, duration: 0.25, ease: 'back.out(2)', yoyo: true, repeat: 1 }, 208.1);
  tl.fromTo('#b9 .srow.leave', { scale: 1 }, { scale: 1.035, duration: 0.25, ease: 'back.out(2)', yoyo: true, repeat: 1 }, 208.9);
  inUp(209.9, '#b9 .sortout', 0.7, 24);       // "the product of the whole audit" 209.6
  // EXIT — whole rail + stage out before Brightwater
  tl.to('#b9 .toprail',   { y: -60, opacity: 0, filter: 'blur(14px)', duration: 0.55, ease: 'power2.in' }, 214.7);
  tl.to('#b9 .mv4', { opacity: 0, y: 50, filter: 'blur(12px)', duration: 0.55, ease: 'power2.in' }, 214.7);

  /* =========================================================================
     B10 · Brightwater + phone pickup (219.5 – 231.5, GFX)
     VO: Brightwater Dental 221.9 · "call us asking for a chatbot" 223.6
  ========================================================================= */
  tl.fromTo('#b10 .tile', { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }, 220.0);
  inUp(220.5, '#b10 .wm', 0.8, 30);
  inUp(221.3, '#b10 .tag', 0.6, 18);
  // phone rises — the pick-up
  tl.fromTo('#b10 .phone', { y: 700 }, { y: 0, duration: 1.1, ease: 'power3.out' }, 223.4);
  // ring waves ripple out (finite)
  ['.wv1', '.wv2', '.wv3'].forEach((w, i) => {
    tl.fromTo('#b10 ' + w, { scale: 1, opacity: 0.7 }, { scale: 2.1, opacity: 0, duration: 1.1, ease: 'power1.out', repeat: 2, delay: 0 }, 224.3 + i * 0.35);
  });
  // handset wiggle while ringing
  tl.fromTo('#b10 .pring', { rotation: -5 }, { rotation: 5, duration: 0.12, repeat: 9, yoyo: true, ease: 'sine.inOut' }, 224.3);
  tl.set('#b10 .pring', { rotation: 0 }, 225.6);
  tl.to('#b10 .pstate', { textContent: 'connected', duration: 0.01 }, 226.0);
  spring(226.4, '#b10 .pbubble', 0.7);        // "we want a chatbot"
  outBlur(230.6, '#b10 .logo', 0.55, -70);
  tl.to('#b10 .phone', { y: 220, opacity: 0, filter: 'blur(14px)', duration: 0.55, ease: 'power2.in' }, 230.6);

  /* =========================================================================
     B11 · three real examples (231.5 – 270.1, under PIP)
     VO: exec assistant 233.7 · proposals 236.7 · lead gen 239.3 · funnel 241.5
         got wrong 246.8 · half a million PDFs 252.5 · cost money 257.5 · cheaper 265.9
  ========================================================================= */
  tl.set('#b11 .case', { opacity: 0 }, 231.5);
  tl.to('#b11 .case1', { opacity: 1, duration: 0.3 }, 233.5);
  inUp(233.7, '#b11 .case1 .ck', 0.5, 18);
  inUp(233.9, '#b11 .case1 .askcard', 0.7, 34);
  inLeft(236.4, '#b11 .case1 .realcard', 0.75);
  tl.to('#b11 .case1', { opacity: 0, x: -50, filter: 'blur(12px)', duration: 0.45, ease: 'power2.in' }, 238.6);

  tl.to('#b11 .case2', { opacity: 1, duration: 0.3 }, 239.2);
  inUp(239.35, '#b11 .case2 .ck', 0.5, 18);
  inUp(239.5, '#b11 .case2 .askcard', 0.7, 34);
  inLeft(241.4, '#b11 .case2 .realcard', 0.75);
  tl.to('#b11 .case2', { opacity: 0, x: -50, filter: 'blur(12px)', duration: 0.45, ease: 'power2.in' }, 246.1);

  tl.to('#b11 .case3', { opacity: 1, duration: 0.3 }, 246.8);
  inUp(246.95, '#b11 .case3 .ck', 0.5, 18);
  inUp(247.4, '#b11 .case3 .realcard', 0.8, 40);
  const cnt = { v: 0 };
  tl.to(cnt, { v: 500000, duration: 2.4, ease: 'power3.out', onUpdate: () => {
    document.querySelector('#b11 .cnt').textContent = '~' + Math.round(cnt.v).toLocaleString('en-US');
  } }, 250.9);                                 // "almost half a million PDFs" 251–253
  tl.fromTo('#b11 .cnt', { scale: 1 }, { scale: 1.06, duration: 0.3, ease: 'back.out(2)', yoyo: true, repeat: 1 }, 253.1);
  tl.to('#b11 .case3', { opacity: 0, y: -40, filter: 'blur(12px)', duration: 0.5, ease: 'power2.in' }, 264.6);
  inUp(265.9, '#b11 .cheaper', 0.8, 26);
  tl.to('#b11 .cheaper', { opacity: 0, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' }, 269.4);

  /* =========================================================================
     B12 · discovery call + mindset (over FULL)
  ========================================================================= */
  inUp(271.2, '#b12def', 0.8, 44);            // definition card
  tl.to('#b12def', { opacity: 0, y: -36, filter: 'blur(12px)', duration: 0.5, ease: 'power2.in' }, 287.6);

  inUp(293.1, '#b12mind .not:nth-child(1)', 0.55, 26);   // "not to sound smart" 293.2
  inUp(294.9, '#b12mind .not:nth-child(2)', 0.55, 26);   // "not to pitch" 295.3
  tl.to('#b12mind', { opacity: 0, filter: 'blur(10px)', duration: 0.35, ease: 'power2.in' }, 296.1);

  tl.fromTo('#b12ratio .you',  { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.out' }, 297.0);   // talk ratio 296.7
  tl.fromTo('#b12ratio .them', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.out' }, 297.25);
  inUp(300.2, '#b12ratio .ask', 0.7, 26);     // "ask questions" 300.3
  tl.to('#b12ratio', { opacity: 0, y: -34, filter: 'blur(12px)', duration: 0.5, ease: 'power2.in' }, 308.3);

  /* =========================================================================
     B13 · vendor → consultant + charge line (311.6 – 328.6, over FULL)
     VO: stop seeing you as a vendor ~317.5 · consultant 321.5 · charge 325.5
  ========================================================================= */
  inUp(312.0, '#b13 .morph', 0.7, 30);
  tl.to('#b13 .v', { opacity: 0.4, duration: 0.5, ease: 'power2.out' }, 318.0);   // vendor dims
  tl.fromTo('#b13 .c', { scale: 1 }, { scale: 1.07, duration: 0.4, ease: 'back.out(1.8)', yoyo: true, repeat: 1 }, 321.3);
  tl.to('#b13 .morph', { opacity: 0, y: -30, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' }, 325.0);
  tl.set('#b13 .charge', { opacity: 0 }, 311.6);
  inUp(325.7, '#b13 .charge', 0.7, 28);       // "charge for judgment instead of labor" 326
  tl.to('#b13 .charge', { opacity: 0, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' }, 328.2);

  /* =========================================================================
     B14 · outro (328.8 – 335, GFX) — VO ends 330.9; 4s hold
  ========================================================================= */
  spring(329.4, '#b14 .o1', 0.5);
  tl.fromTo('#b14 .oc1', { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.inOut' }, 329.75);
  spring(329.95, '#b14 .o2', 0.5);
  tl.fromTo('#b14 .oc2', { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.inOut' }, 330.25);
  spring(330.45, '#b14 .o3', 0.5);
  tl.fromTo('#b14 .oc3', { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.inOut' }, 330.75);
  spring(330.95, '#b14 .o4', 0.5);
  tl.fromTo('#b14 .o1', { boxShadow: '0 0 22px rgba(55,189,248,0.55), 0 0 56px rgba(55,189,248,0.3), inset 0 1px 0 rgba(255,255,255,0.22)' },
    { boxShadow: '0 0 40px rgba(55,189,248,0.7), 0 0 110px rgba(55,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.22)', duration: 0.8, ease: 'sine.inOut', repeat: 3, yoyo: true }, 331.3);
  inUp(331.5, '#b14 .nx .kicker', 0.6, 20);
  tl.fromTo('#b14 .nx .t', { scale: 0.94, opacity: 0, filter: 'blur(12px)' },
    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out' }, 331.8);

  /* Law 11 — timeline fills its slot */
  tl.to({}, { duration: DUR }, 0);

  window.__timelines['p10'] = tl;
})();
