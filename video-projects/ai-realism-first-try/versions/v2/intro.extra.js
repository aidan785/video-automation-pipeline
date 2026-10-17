  // ================= project scenes (CUE = word times from the transcript) =================
  const pop = (sel, t, o = {}) => tl.fromTo(sel, { scale: o.from ?? 0.4, opacity: 0 },
    { scale: 1, opacity: 1, duration: o.dur ?? 0.2, ease: o.ease ?? "back.out(2)" }, snap(t));
  const spans = (id, text) => { const el = document.getElementById(id); el.innerHTML = [...text].map((c) => "<span>" + c + "</span>").join(""); return [...el.children]; };
  const typeOn = (els, t0, t1) => els.forEach((s, i) => tl.set(s, { opacity: 1 }, snap(t0 + ((t1 - t0) * i) / els.length)));

  // ----- cold open: triptych breaks into pixels, contact sheet, match cut -----
  tl.fromTo("#trip .col img", { scale: 1 }, { scale: 1.06, duration: 3.2, ease: "none" }, snap(10.14));
  [[12.44, "s1"], [12.58, "s2"], [12.72, "s3"]].forEach(([t, c]) => tl.set("#trip .col img." + c, { opacity: 1 }, snap(t)));
  ["#tc1", "#tc2", "#tc3"].forEach((c, i) => tl.set(c, { opacity: 0 }, snap(12.86 + i * 0.1)));
  [13.64, 13.88, 14.26].forEach((t, i) => tl.fromTo("#pr" + (i + 1) + " img, #pr" + (i + 1) + " .nm", { scale: 0.6, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }, snap(t)));
  tl.fromTo("#sheet .tk", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power3.out", stagger: 0.08 }, snap(14.8));
  // match cut: the gate opens, the sheet flies to the wall, then its twin behind Aidan takes over and tucks in behind his head
  tl.to("#gate1", { opacity: 0, duration: 0.16, ease: "power1.out" }, snap(15.56));
  tl.to("#sheet", { x: -128, y: 86, scale: 0.4274, duration: 0.46, ease: "power3.inOut" }, snap(15.56));
  tl.fromTo("#bh-sheet", { x: 0, rotation: 0, scale: 0.4274 }, { x: 60, rotation: -3, scale: 0.46, duration: 0.3, ease: "back.out(1.6)" }, snap(CUE.sheetLand + 0.04));

  // ----- "just luck": the sheet turns into a slot machine that lands on three bad takes -----
  const tSlot = CUE.luck - 0.36;
  tl.set("#bh-sheet .face-b", { opacity: 1 }, snap(tSlot));
  ["#reel1", "#reel2", "#reel3"].forEach((r, i) => tl.fromTo(r, { y: 0 }, { y: -2320, duration: 0.5 + i * 0.16, ease: "power2.out" }, snap(tSlot)));
  tl.set(".slot-lbl", { opacity: 1 }, snap(CUE.luck + 0.5)).set(".slot-lbl", { opacity: 0 }, snap(CUE.luck + 0.5 + F)).set(".slot-lbl", { opacity: 1 }, snap(CUE.luck + 0.5 + 2 * F));

  // ----- "write a prompt, hit Generate, and hope": prompt box over the blurred shot -----
  tl.fromTo(".ui-card", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "back.out(1.8)" }, snap(CUE.most - 0.06));
  typeOn(spans("ui-text", "ultra realistic woman, 8k, masterpiece, best quality, hyper detailed, cinematic lighting, trending on artstation"), CUE.write - 0.12, CUE.hit - 0.12);
  tl.fromTo("#ui-cur", { x: 0, y: 0, opacity: 0 }, { x: 323, y: -223, opacity: 1, duration: 0.3, ease: "power3.out" }, snap(CUE.gen1 - 0.42));
  tl.to("#ui-btn", { scale: 0.88, duration: 0.07, ease: "power2.in" }, snap(CUE.gen1));
  tl.to("#ui-btn", { scale: 1, opacity: 0.55, duration: 0.18, ease: "back.out(3)" }, snap(CUE.gen1 + 0.07));
  tl.fromTo("#ui-fill", { scaleX: 0 }, { scaleX: 0.16, duration: 1.7, ease: "none" }, snap(CUE.gen1 + 0.1));
  typeOn(spans("ui-hope-t", "...and hope"), CUE.hope - 0.06, CUE.hope + 0.3);
  tl.fromTo("#ui-pray", { scale: 0.2, opacity: 0, rotation: -25 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.24, ease: "back.out(2.6)" }, snap(CUE.hope + 0.34));

  // ----- "50 re-rolls later": yellow card fills with bad takes while the counter runs -----
  document.getElementById("rr-strip").innerHTML = Array.from({ length: 50 }, (_, i) => "<span>" + String(i + 1).padStart(2, "0") + "</span>").join("");
  tl.fromTo("#rr-title", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2.2)" }, snap(CUE.then - 0.1));
  document.querySelectorAll("#rr .tile").forEach((el, i) => pop(el, CUE.then + 0.1 + i * 0.075, { from: 0.3, dur: 0.16 }));
  tl.fromTo("#rr-strip", { y: 0 }, { y: -84 * 49, duration: snap(CUE.laterEnd - CUE.then - 0.2), ease: "steps(49)" }, snap(CUE.then + 0.1));

  // ----- "your credits are completely gone": the pill drains, turns red and shakes -----
  pop("#cred", CUE.credits - 0.04);
  tl.fromTo("#cred-strip", { y: 0 }, { y: -84 * 9, duration: snap(CUE.gone - CUE.credits), ease: "steps(9)" }, snap(CUE.credits + 0.04));
  tl.set("#cred", { backgroundColor: "#FF4A4A", color: "#ffffff" }, snap(CUE.gone + 0.06));
  tl.fromTo("#cred", { x: -14 }, { x: 0, duration: 0.45, ease: "elastic.out(1.4, 0.18)", immediateRender: false }, snap(CUE.gone + 0.06));
  // ----- "your bank account is drained" / "plastic garbage": cards behind him -----
  pop("#bh-bank", CUE.bank - 0.06);
  pop("#bh-plastic", CUE.still + 0.02);

  // ----- "every shot you just saw took one generation": the three clips behind him, tagged 1/1 -----
  ["#bh-c1", "#bh-c2", "#bh-c3"].forEach((c, i) => {
    pop(c, CUE.every + 0.33 + i * 0.25);
    tl.fromTo(c + " .one", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "back.out(3)" }, snap(CUE.onegen - 0.08 + i * 0.08));
    tl.set(c, { opacity: 0 }, snap(CUE.every + 3.32));
  });

  // ----- "one step most people skip": a giant 1 rises behind his shoulder -----
  tl.fromTo("#bh-one span", { y: 900 }, { y: 0, duration: 0.3, ease: "back.out(1.3)" }, snap(CUE.onestep - 0.2));
  // ----- "before you even hit Generate": the button sits behind him and the cursor hesitates -----
  pop("#bh-gen .gbtn", CUE.before - 0.04);
  tl.fromTo("#bh-cur", { x: 320, y: 260, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.26, ease: "power3.out" }, snap(CUE.gen2 - 0.56));
  tl.to("#bh-cur", { x: 16, duration: 0.07, repeat: 5, yoyo: true, ease: "sine.inOut" }, snap(CUE.gen2 - 0.2));

  // ----- "done burning your credits": the pill is back, on fire -----
  pop("#cred2", CUE.burning - 0.1);
  tl.fromTo("#cred2 .fire", { scale: 0.7, rotation: -12 }, { scale: 1.15, rotation: 10, duration: 0.14, repeat: 7, yoyo: true, ease: "sine.inOut" }, snap(CUE.burning));

  // ----- "AI creative workflows": idea > image > video builds behind him -----
  pop("#nd1", CUE.teach + 0.25);
  tl.fromTo("#wr1", { scaleY: 0 }, { scaleY: 1, duration: 0.15, ease: "power2.out" }, snap(CUE.workflows - 0.18));
  pop("#nd2", CUE.workflows - 0.04);
  tl.fromTo("#wr2", { scaleY: 0 }, { scaleY: 1, duration: 0.15, ease: "power2.out" }, snap(CUE.systems - 0.18));
  pop("#nd3", CUE.systems - 0.04);

  // ----- "the setup, the prompts, and the one step": yellow card -----
  tl.fromTo("#st-title", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2.2)" }, snap(CUE.sowell - 0.06));
  [["#sc1", "#pl1", CUE.setup], ["#sc2", "#pl2", CUE.prompts], ["#sc3", "#pl3", CUE.theone]].forEach(([card, pill, t], i, all) => {
    tl.fromTo(card, { y: 90, scale: 0.8, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.24, ease: "back.out(1.9)" }, snap(t - 0.1));
    tl.set(pill, { backgroundColor: "#FF8FB1" }, snap(t - 0.1));
    if (i > 0) tl.set(all[i - 1][1], { backgroundColor: "#ffffff" }, snap(t - 0.1));
  });
  tl.fromTo("#sc3", { rotation: -2.5 }, { rotation: 2.5, duration: 0.08, repeat: 5, yoyo: true, ease: "sine.inOut", immediateRender: false }, snap(CUE.theone + 0.2));
  tl.set("#sc3", { rotation: 0 }, snap(CUE.theone + 0.7));
  tl.fromTo("#keeper", { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.14, ease: "expo.out" }, snap(CUE.keeper - 0.06));

  // ----- "over and over and over": bad takes slap down behind him -----
  [["#bh-rr1", CUE.over1], ["#bh-rr2", CUE.over2], ["#bh-rr3", CUE.over3]].forEach(([c, t]) => pop(c, t - 0.06, { from: 1.5, dur: 0.12, ease: "expo.out" }));

  // ----- montage wrappers are only visible inside their own window -----
  [[-0.06, 1.14], [1.14, 2.59], [2.59, 4.19]].forEach(([a, b], i) => {
    tl.set("#montw" + (i + 1), { opacity: 1 }, snap(CUE.whole + a));
    tl.set("#montw" + (i + 1), { opacity: 0 }, snap(CUE.whole + b));
  });
