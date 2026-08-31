# AIS LIVE Day 1 → Day 2 Clip Candidates

Running shortlist of high-value moments pulled from Day 1 session recordings, for use in
**Block 5 (Day 2 opening fill)** and the **Day 2 closing sizzle**. More Day 1 footage is
still coming — add new sections per source video as it lands.

**Source folder:** `/Volumes/Extreme SSD/AIS LIVE Assets/`
**Transcripts:** `transcripts/*.json` (ElevenLabs Scribe word-level) + `*.txt` (readable, timestamped)
**Regenerate readable text:** `node _to-text.mjs transcripts/<name>.json > transcripts/<name>.txt`

Timestamps are transcript word times — pad ~0.5s on each side and trim to breath/sentence
boundaries when actually cutting. All three recordings are livestream captures (speaker cam +
screen share), so every clip needs a visual check before use: some moments are slide-share
with a small face cam.

Fit legend: **B5** = Block 5 opening (energy / tease what Day 2 holds / "look what you learned"),
**CS** = closing sizzle (inspiration, payoff, send-off), **Either**.

---

## ⭐ Top picks across all sources so far

| # | Source | Time | Clip | Fit |
|---|--------|------|------|-----|
| 1 | Advanced | 58:34–58:56 | "I haven't written a single line of code in over six months. Everything is AI-first now… but I still check every line." | Either |
| 2 | Advanced | 27:25–27:50 | "It took me almost 13 years. What you can do right now with free resources plus AI — it's insane." | CS |
| 3 | Foundation | 24:11–24:37 | "Don't worry about the sexy things that make you think you have a business. A business is your ability to make money." | Either |
| 4 | Foundation | 08:16–08:52 | "Who's your first client? YOU. Is your ecosystem set up to service yourself?" | B5 |
| 5 | VIP | 31:22–32:25 | Value-based pricing: price what it earns them, not your time (landscaping lead example) | B5 |
| 6 | Advanced | 28:39–29:10 | "There has never been a better time to learn how to code." | Either |
| 7 | Foundation | 1:02:24–1:03:09 | "Your audience wants to hear from YOU… your tribe will find you." | CS |
| 8 | Advanced | 1:27:14–1:28:35 | "Hourly billing is pretty broken… fixed-price prototype, 10–20 grand, two weeks." | B5 |

---

## Foundation Workshop: Your First 30 Days in AI Automation (Liberty, ~87 min)

Solo presenter, high energy, interactive. Clean single-speaker audio.

| Time | Duration | Clip | Why | Fit |
|------|----------|------|-----|-----|
| 08:16–08:52 | ~36s | "Before even looking for clients, who's your first client? … You're your first client. Is your infrastructure and ecosystem set up for you to service yourself?" | The session's core hook, framed as a question — works standalone | B5 |
| 18:29–18:44 | ~15s | "Anthropic is moving faster than the speed of light. I think we need to start saying moving at the speed of Anthropic." | Fun, quotable, on-brand for an AI event | Either |
| 19:53–20:30 | ~37s | "Building in public is so underrated. It's scary, but it's underrated… getting $1,000 in under 10 days. That is no small feat — imagine doing that consistently." | Real proof + energy; ties to her Cannes story | CS |
| 22:17–22:44 | ~27s | "Can you solve that problem? That's all they wanna know… Can you help me get more clients? Reduce my inbox clutter? Tell that story over and over and over again." | Punchy, rhythmic, universally useful | Either |
| 24:11–24:37 | ~26s | "In your first 30 days, don't worry about all the sexy things that make you think you have a business. A business is your ability to make money." | Best one-liner of the session | Either |
| 39:03–39:27 | ~24s | "Skills is probably one of the most underrated, under-utilized functions of Claude, in my humble opinion." | Knowledge tease — makes viewers feel they're missing something | B5 |
| 58:05–58:36 | ~31s | "That is three different jobs for your business… that has just taken place that I don't have to stop and think about." (skill demo payoff: summary + action items + email) | The demo's payoff moment — shows the win, not the setup | B5 |
| 1:00:23–1:01:08 | ~45s | "You need to find a decision maker… or the person who influences the person who makes the decision… they will champion us in that workplace." | Concrete sales knowledge | B5 |
| 1:02:24–1:03:09 | ~45s | "Your audience wants to hear from you. While you're busy thinking somebody already said that, people are waiting for YOUR opinion… your tribe, your village will find you." | The most inspirational moment of the session — answer to "everything's already been said" | CS |
| 1:06:15–1:06:36 | ~21s | "Always put your constraints in. I only have two hours, the client needs this — now help me prioritize." | Tight, actionable prompting tip | B5 |

Trim notes: she talks fast with chat asides — most clips need a small internal tighten
(cut-silences pass) but sentences land cleanly at the marked bounds.

---

## Workshop Block 1: Advanced — Low-Code to Full-Code (Dave Ebbelaar, ~97 min)

⚠️ Recording starts with ~20 min of bleed-over audio from a prior segment (garbled).
**Dave's session starts at 19:57.** Ignore everything before it.

| Time | Duration | Clip | Why | Fit |
|------|----------|------|-----|-----|
| 23:36–24:09 | ~33s | "I failed my first Python class. Completely failed it. I had no idea what I was doing." | Vulnerability hook from a 250K-sub AI educator — pairs with clip below | CS |
| 27:00–27:50 | ~50s | "What used to take hours is now literally just one prompt away… It took me almost 13 years. What you can do right now with the right resources — all available for free — plus AI, it's insane." | The strongest inspiration arc in all 3 videos; can trim to the 27:25–27:50 back half | CS |
| 27:50–28:39 | ~49s | "We've literally come full circle — from the terminal in the 1970s, to interfaces, to low-code tools, and boom, we're back at the terminal… I just want my agent to do all of this." | Genuinely intriguing industry insight, well delivered | Either |
| 28:39–29:10 | ~31s | "There has never been a better time to learn how to code, in my opinion." (+ vibe-coding caveat: "you just can't get around understanding what's going on behind the scenes") | Thesis statement, quotable | Either |
| 29:35–30:03 | ~28s | "If you see yourself building a career or company in AI, going code-first is the way to go… that abstraction layer the low-code tools provide is now just getting in the way." | Bold stance — sparks curiosity/debate | B5 |
| 35:47–36:32 | ~45s | The magic prompt: "…schedule an automation that runs every morning at 8AM with Celery. That prompt allows you to literally create your first Python backend in five minutes." | Concrete "whoa, I could do that" moment | B5 |
| 43:07–43:56 | ~49s | "Postgres is all you need… Instagram actually scaled to hundreds of millions of users on a simple PostgreSQL database. You will never outgrow it." | Punchy stat + contrarian simplicity | B5 |
| 45:34–46:01 | ~27s | "If you literally take this slide, screenshot it, and say to any capable AI 'build me a cool dashboard using this stack' — it will take five minutes and it's production-ready." | Instant-value moment | B5 |
| 39:19–40:04 | ~45s | "The most important skill is thinking in atomic building blocks — task decomposition. How can I take a process and break it down?" | The transferable skill under everything; bridges no-code → code audiences | B5 |
| 58:34–58:56 | ~22s | "I haven't written a single line of code in over six months. Literally everything is AI-first now… I still check every line. I do that. But I don't write it anymore." | Best soundbite in all three videos; short, complete, jaw-dropping | Either |
| 1:00:21–1:01:12 | ~51s | "It seems like every week there's something new and it feels like you're falling behind. But skip that abstraction layer and go underneath — things are actually quite peaceful there." | Calms tool-overwhelm anxiety — very shareable wisdom | CS |
| 1:07:19–1:08:16 | ~57s | "Not every project needs all of this… but if you want bigger clients — and bigger clients often mean more money — you want full code. That's how you win." | Motivation + practical framing (can tighten internally) | B5 |
| 1:12:57–1:13:22 | ~25s | Wrap: "There has never been a better time to learn how to code… if you're building with low-code tools, you already think like a developer." | Perfect send-off energy — validates the whole audience | CS |
| 1:27:14–1:28:35 | ~80s | "Hourly billing is pretty broken right now… we quote a fixed-price prototype, 10 to 20 grand depending on complexity, delivered in two weeks, then continued sprints." | Highest-value business knowledge in the video; trim to ~40s core | B5 |
| 1:31:01–1:32:35 | ~90s | First-client story: won a hackathon → paid week → three months → quit the signed job → "I literally never looked back." | Great narrative arc if a longer story clip is wanted | CS |

---

## VIP Working Session 1: Scope to Ship (~34 min, host + Mustafa panel)

Two-person conversation. Host (speaker_0) audio is clean; Mustafa (speaker_1) has heavier
filler — prefer host-voiced clips or tight Mustafa excerpts.

| Time | Duration | Clip | Why | Fit |
|------|----------|------|-----|-----|
| 09:09–09:58 | ~49s | "You don't ever eat the API or usage cost on anything… it's either pass-through or it's their account drawing on the usage. Nobody make that mistake." | Clean actionable rule everyone selling AI needs | B5 |
| 21:53–22:25 | ~32s | Mustafa: "Imagine yourself during the build… go deep and see how you'll implement each part at a low level. This helped me identify areas that would take so much time that I hadn't thought of." | Real scoping technique; trim to this core (full riff runs to 23:26) | B5 |
| 28:01–29:04 | ~63s | Scope-creep protection: definitive deliverables + a clause for overtime — "if the client is the reason we've gone over those hours, why should we be penalized?" | Directly answers the pain most attendees have | B5 |
| 31:22–32:25 | ~63s | "Don't price your time… what does a lead get that landscape company — $500? $1,000? If your solution is grabbing that for them, that's one lead. And it's running 24/7. That's the lens: the value it's bringing, not your time and overhead." | Best moment of the session; can trim to 31:45–32:25 | B5 |
| 25:00–25:43 | ~43s | Mustafa: "You'd think a company this big has advanced systems — they're running systems from the '90s… AI is a must in the future that you have to face." | Opportunity framing — the market is wide open | CS |
| 32:28–32:33 | ~5s | Host: "Outcome-based selling is the way to go." | Micro-clip / montage beat | Either |

---

## Workshop Block 2: Build Your First AI Content Engine (Sabrina Ramonov, ~83 min)

Session starts ~16:15 (before that is pre-show chatter — don't clip). Slides
share from ~17:48; **full-camera window is only 1:11:52–1:17:40** (she stopped
sharing, then re-shared ~1:17:45). Her slide layouts pair well with audio
(intro slide shows the 3M+/30M+ stats as she says them).

**CUT + IN BLOCK 5** (8 clips, `recap-sabrina-*`): intro/systems-engineering
(16:25), zero-edits viral post (37:52), every-business-needs-marketing
(1:00:20), referral-demand (1:01:31), testimonial-is-content (1:04:29),
done-for-you (1:05:22), niche-research algorithm hack (1:06:31), HyperFrames
iPhone vs Remotion Android (1:12:04, full cam).

| Time | Duration | Clip | Why | Fit |
|------|----------|------|-----|-----|
| 58:11–58:57 | ~46s | Cross-post skill + "when I go on vacation, Claude repurposes my top videos from the past 90 days" | Great workflow flex, slightly rambly | B5 (bench) |
| 38:25–38:48 | ~23s | "This set of skills is better than 99% of people who start making content." | Bold, quotable | B5 (bench) |
| 1:14:39–1:15:28 | ~49s | 12-ways-to-make-money leverage framing: "need cash now? ignore the right side… leverage = $100K/month solo" | Strong knowledge but she's describing a chart the stream can't see (share was off) | CS (audio caveat) |
| 1:16:27–1:16:58 | ~31s | AI automation agencies: "amazing for learning… real-world experiences to back up what you're saying" | Honest take, on-audience | Either (bench) |

## Still to mine (drop in as they land)

- [ ] (awaiting more Day 1 uploads from Aidan)

Workflow per new video:
1. `node ../../scripts/transcribe-elevenlabs.mjs '<video>' --output transcripts/<slug>.json`
2. `node _to-text.mjs transcripts/<slug>.json > transcripts/<slug>.txt`
3. Mine for: standalone knowledge drops, quotable one-liners, proof/results moments,
   inspiration arcs, crowd/energy moments. Tag B5 / CS. Add to tables above.
