// Dark Glass composition generator (AIS lead magnet ads + AIS+ VSL).
// Forked from ais-live-ai-os-ads/hyperframes-white-glass/build.mjs; see DESIGN.md.
// Usage: node 06-compositions/build.mjs [compId ...]   (no args = every spec in SPECS)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url)); // 06-compositions
const PROJ = path.dirname(ROOT);
const WG = path.resolve(PROJ, "../ais-live-ai-os-ads");
const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const r3 = (n) => +n.toFixed(3);

// ---------------------------------------------------------------- icons (48x48 stroke)
const icons = {
  play: '<rect x="5" y="10" width="38" height="28" rx="8"/><path d="m21 18 9 6-9 6Z"/>',
  grid: '<rect x="7" y="7" width="14" height="14" rx="3"/><rect x="27" y="7" width="14" height="14" rx="3"/><rect x="7" y="27" width="14" height="14" rx="3"/><rect x="27" y="27" width="14" height="14" rx="3"/>',
  dollar: '<circle cx="24" cy="24" r="18"/><path d="M29.5 17.5c-1.3-1.6-3.2-2.4-5.5-2.4-3.2 0-5.4 1.6-5.4 4.1 0 5.9 11.4 3.2 11.4 9.3 0 2.6-2.4 4.3-5.9 4.3-2.6 0-4.8-1-6.1-2.8M24 11v4M24 33v4"/>',
  wrench: '<path d="M30 7a9 9 0 0 0-8.5 12L8 32.5a3.5 3.5 0 0 0 5 5L26.5 24A9 9 0 0 0 38 14.5l-5.5 5.5-5-1.5-1.5-5 5.5-5A9 9 0 0 0 30 7Z"/>',
  flow: '<rect x="17" y="4" width="14" height="10" rx="3"/><rect x="4" y="33" width="14" height="10" rx="3"/><rect x="30" y="33" width="14" height="10" rx="3"/><path d="M24 14v10M11 33v-9h26v9"/>',
  check: '<path d="m12 24 8 8 17-19"/>',
  spark: '<path d="m24 5 5 14 14 5-14 5-5 14-5-14-14-5 14-5Z"/>',
  ticket: '<path d="M6 15a4 4 0 0 0 4-4h28a4 4 0 0 0 4 4v4a5 5 0 0 0 0 10v4a4 4 0 0 0-4 4H10a4 4 0 0 0-4-4v-4a5 5 0 0 0 0-10Z"/><path d="M30 12v24" stroke-dasharray="3 4"/>',
  lock: '<rect x="10" y="21" width="28" height="21" rx="6"/><path d="M16 21v-6a8 8 0 0 1 16 0v6M24 29v5"/>',
  unlock: '<rect x="10" y="21" width="28" height="21" rx="6"/><path d="M16 21v-6a8 8 0 0 1 15.5-2.8M24 29v5"/>',
  person: '<circle cx="24" cy="15" r="7"/><path d="M10 40v-5c0-8 28-8 28 0v5"/>',
  book: '<path d="M8 9h13a5 5 0 0 1 5 5v26a4 4 0 0 0-4-4H8Z"/><path d="M40 9H29a5 5 0 0 0-5 5v26a4 4 0 0 1 4-4h12Z"/>',
  send: '<path d="M42 6 20 28M42 6 29 42l-9-14-14-9Z"/>',
  message: '<path d="M10 9h28a5 5 0 0 1 5 5v17a5 5 0 0 1-5 5H22L11 43v-7a6 6 0 0 1-6-6V14a5 5 0 0 1 5-5Z"/><path d="M14 19h20M14 26h14"/>',
  shield: '<path d="M24 5 39 11v11c0 10-6.5 17-15 21-8.5-4-15-11-15-21V11Z"/><path d="m17 24 5 5 9-10"/>',
  // Lucide "handshake" (ISC), drawn on a 24 grid: scaled x2 into the 48 box, stroke halved to match the set
  handshake: '<g transform="scale(2)" stroke-width="1.2"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></g>',
  cursor: '<path d="m10 6 26 14-11 3-5 11Z"/>',
  mail: '<rect x="5" y="10" width="38" height="28" rx="6"/><path d="m7 13 17 13 17-13"/>',
  download: '<path d="M24 6v24m-9-9 9 9 9-9M8 34v4a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-4"/>',
  x: '<path d="M14 14 34 34M34 14 14 34"/>',
  clock: '<circle cx="24" cy="24" r="17"/><path d="M24 13v12l8 5"/>',
  gear: '<circle cx="24" cy="24" r="7"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M10.6 37.4l4.2-4.2M33.2 14.8l4.2-4.2"/>',
  cpu: '<g transform="scale(2)" stroke-width="1.2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/></g>',
  target: '<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="2"/>',
  briefcase: '<rect x="5" y="15" width="38" height="27" rx="7"/><path d="M16 15V9a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6M5 26q19 9 38 0"/>',
  loop: '<path d="M36 18a13 13 0 1 0 1 10"/><path d="M37 8v10H27"/>',
};
const icon = (k) => `<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${icons[k]}</svg>`;
const at = (t) => (t == null ? "" : ` data-at="${t}"`);

// ---------------------------------------------------------------- glass illustrations
const UI = {
  channel: () => `<div class="reflection"></div>
    <div class="stat-stack">
      <div class="glass stat-panel reveal"><div class="stat-row"><span class="tile">${icon("play")}</span><div><small>Subscribers</small><strong class="num">1M+</strong></div></div><div class="sheen" data-layout-allow-overflow></div></div>
      <div class="glass stat-panel reveal"${at(5.6)}><div class="stat-row"><span class="tile">${icon("grid")}</span><div><small>Videos on the channel</small><strong class="num num-2">526</strong></div></div></div>
    </div>`,
  notTech: () => `<div class="reflection"></div>
    <div class="chip-row">
      <div class="glass chip muted-chip reveal"><span class="tile dim">${icon("wrench")}</span><span>Which tools?</span><i class="strike"${at(9.28)}></i></div>
      <div class="glass chip muted-chip reveal"><span class="tile dim">${icon("flow")}</span><span>Which workflows?</span><i class="strike"${at(9.88)}></i></div>
    </div>
    <div class="note reveal">Not the questions people ask most.</div>`,
  money: () => `<div class="reflection"></div>
    <div class="glass money-card reveal"${at(12.45)}>
      <span class="tile big">${icon("dollar")}</span>
      <div><strong>Making money with AI skills</strong><small>What people ask about most</small></div>
      <span class="status">Most asked</span>
      <div class="sheen" data-layout-allow-overflow></div>
    </div>`,
  offer: () => `<div class="reflection offer-light"></div>
    <div class="glass offer-card reveal"${at(0.6)}>
      <div class="offer-head"><span class="plan">Annual</span><span class="status">Best value</span></div>
      <div class="price-row">
        <div class="price light"${at(2.95)}><b class="num">$749</b><span>/year</span></div>
        <div class="per-mo light"${at(4.9)}>About <b class="num">$62</b>/mo</div>
      </div>
      <div class="perks">
        <div class="perk light"${at(7.1)}><span class="tile sm">${icon("unlock")}</span>Everything unlocks on day one</div>
        <div class="perk light"${at(10.05)}><span class="tile sm">${icon("ticket")}</span>VIP tickets to every virtual event</div>
        <div class="perk light"${at(15.05)}><span class="tile sm">${icon("ticket")}</span>Discounted in-person event ticket</div>
        <div class="perk light"${at(16.4)}><span class="tile sm">${icon("lock")}</span>Rate locked in for life</div>
      </div>
      <div class="sheen" data-layout-allow-overflow></div>
    </div>
    <div class="glass monthly-card reveal"${at(0.75)}><span class="plan">Monthly</span><b class="num">$129</b><span class="mo">/month</span><small>Upgrade to annual anytime</small></div>`,
};

// SOP ad components (CP3). Comment cards reproduce REAL public comments verbatim (source screenshots +
// URLs in 05-visual-assets/captures/captures.json); names and avatars are hidden, never invented.
const comment = (text, t) => `<div class="glass comment reveal"${at(t)}><span class="c-avatar"></span><div class="c-body"><span class="c-name"></span><p>${esc(text)}</p></div></div>`;
const row3 = (n, k, a, t, extra = "") => `<div class="glass irow light${extra}"${at(t)}><span class="inum">${n}</span><span class="tile">${icon(k)}</span><strong>${a}</strong></div>`;
Object.assign(UI, {
  channelShot: () => `<div class="reflection"></div>
    <div class="glass shot-frame reveal"><img class="shot" src="assets/yt-channel.png" alt="Nate Herk YouTube channel header"><i class="hl pop"${at(2.12)}></i><div class="sheen" data-layout-allow-overflow></div></div>
    <div class="shot-note reveal">youtube.com/@nateherk</div>`,
  sopNotTech: () => `<div class="reflection"></div>
    <div class="chip-row">
      <div class="glass chip muted-chip reveal"${at(7.72)}><span class="tile dim">${icon("wrench")}</span><span>Which tools?</span><i class="strike"${at(9.28)}></i></div>
      <div class="glass chip muted-chip reveal"${at(7.86)}><span class="tile dim">${icon("flow")}</span><span>Which workflows?</span><i class="strike"${at(9.88)}></i></div>
    </div>
    <div class="note reveal"${at(8.3)}>Not the technical questions.</div>`,
  comments: () => `<div class="reflection"></div>
    <div class="comment-stack">
      ${comment("Cant I partner with someone that already make money with this as I tried and failed to get a paying client.", 11.3)}
      ${comment("I hope I'll find clients asap and can't wait to Join the Community…", 12.25)}
      <div class="note small reveal"${at(12.9)}>Real comments on Nate's YouTube videos. Names hidden.</div>
    </div>`,
  loop: () => `<div class="reflection"></div>
    <div class="loop-wrap">
      <div class="ring-box reveal"><div class="ring"></div><div class="orbit"><i class="dot"></i></div><div class="ring-label">${icon("loop")}<span>Learn more</span></div></div>
      <div class="loop-list">
        <div class="glass lrow light"${at(16.98)}><span class="tile sm">${icon("book")}</span>Learn something new</div>
        <div class="glass lrow light"${at(18.34)}><span class="tile sm">${icon("wrench")}</span>Try the latest tool</div>
        <div class="glass lrow light"${at(19.12)}><span class="tile sm">${icon("spark")}</span>Test the newest model</div>
        <div class="glass way-out reveal"${at(20.15)}><span class="tile">${icon("dollar")}</span><div><strong>Use what you already know</strong><small class="light"${at(23.35)}>and actually make money with it</small></div></div>
      </div>
    </div>`,
  safer: () => `<div class="reflection"></div>
    <div class="vs-row">
      <div class="glass vs-card reveal"><span class="tile">${icon("book")}</span><strong>Learning</strong><small>Feels easier</small><span class="tag calm reveal"${at(25.15)}>Comfortable</span></div>
      <div class="glass vs-card reveal"><span class="tile dim">${icon("send")}</span><strong>Selling</strong><small>Feels risky</small><div class="tags"><span class="tag risk pop"${at(27.33)}>Ignored</span><span class="tag risk pop"${at(27.9)}>Rejected</span></div></div>
    </div>`,
  sopCover: () => `<div class="reflection"></div>
    <div class="sop-row">
      <div class="paper-wrap reveal"${at(29.78)}><div class="paper">
        <div class="p-head"><span>AI AUTOMATION SOCIETY</span><b>PDF</b></div>
        <div class="p-eyebrow">STANDARD OPERATING PROCEDURE</div>
        <div class="p-title">The First Client SOP</div>
        <div class="p-sub">Getting your first AI automation client</div>
        <div class="p-lines"><i><em>01</em><u></u></i><i><em>02</em><u></u></i><i><em>03</em><u></u></i></div>
        <div class="p-foot"><span>AI Automation Society</span><b></b></div>
        <div class="sheen" data-layout-allow-overflow></div>
      </div></div>
      <div class="sop-tag reveal"${at(32.7)}>Selling that feels as good as <span>learning.</span></div>
    </div>`,
  inside: () => `<div class="reflection"></div>
    <div class="irows">
      ${row3("01", "message", "The one-sentence pitch that works today", 35.84)}
      ${row3("02", "shield", "How to build credibility with zero case studies", 38.1)}
      ${row3("03", "send", "The exact outreach messages that land projects", 40.5)}
    </div>`,
  proof: () => `<div class="reflection"></div>
    <div class="glass proof-card reveal">
      <div class="proof-row light"${at(45.82)}><span class="tile big">${icon("handshake")}</span><div><strong>Their first client deal</strong><small>Closed by hundreds of builders using the SOP</small></div></div>
      <div class="proof-row divided pop"${at(47.88)}><svg class="ring30" viewBox="0 0 80 80"><circle cx="40" cy="40" r="32" class="track"/><circle cx="40" cy="40" r="32" class="prog"${at(47.95)}/></svg><div><strong>Most within 30 days</strong><small>of getting the SOP</small></div></div>
      <div class="sheen" data-layout-allow-overflow></div>
    </div>`,
  cta: () => `<div class="reflection"></div>
    <div class="steps">
      <div class="glass step light"${at(50.26)}><span class="tile sm">${icon("cursor")}</span>Click the link</div>
      <div class="glass step light"${at(51.01)}><span class="tile sm">${icon("mail")}</span>Enter your email</div>
      <div class="glass step light"${at(51.87)}><span class="tile sm">${icon("download")}</span>Download the SOP</div>
      <div class="glass step final light"${at(52.97)}><span class="tile sm">${icon("handshake")}</span>Get your first client</div>
    </div>`,
});

// AI OS + Scrollcraft ad components (CP4)
const schip = (t, at_, cls = "pop") => `<span class="schip ${cls}"${at(at_)}>${esc(t)}</span>`;
Object.assign(UI, {
  media: () => ``, // footage lives in a top-level media window (see spec.media), scene carries only the text
  jarvis: () => `<div class="reflection"></div><div class="glass jarvis-frame reveal"><img class="jv" src="assets/jarvis.png" alt="Nate with a Jarvis-style HUD"></div>`,
  reexplain: () => `<div class="reflection"></div>
    <div class="chat">
      <div class="glass bubble reveal"${at(8.7)}>Here's my business, again…</div>
      <div class="glass bubble reveal"${at(9.6)}>As I said, my priorities are…</div>
      <div class="glass bubble reveal"${at(10.35)}>Let me re-explain the context…</div>
    </div>`,
  fourCs: () => `<div class="reflection"></div>
    <div class="cgrid">
      <div class="glass ctile light"${at(21.95)}><span class="cn">01</span><strong>Context</strong><small>Knows your business</small></div>
      <div class="glass ctile light"${at(25.85)}><span class="cn">02</span><strong>Connections</strong><small>Reaches your stuff</small></div>
      <div class="glass ctile light"${at(27.25)}><span class="cn">03</span><strong>Capabilities</strong><small>Knows how to do the work</small></div>
      <div class="glass ctile light"${at(34.05)}><span class="cn">04</span><strong>Cadence</strong><small>Runs without being asked</small></div>
    </div>`,
  box: () => `<div class="reflection"></div>
    <div class="box-row">
      <img class="box-img reveal" src="assets/aios-box.png" alt="AI OS starter template box"${at(37.3)}>
      <div class="c-list">${["Context", "Connections", "Capabilities", "Cadence"].map((c, i) => `<span class="cchip pop"${at(37.85 + i * 0.14)}>${c}</span>`).join("")}</div>
    </div>`,
  kit: () => `<div class="reflection"></div>
    <div class="kit">
      <div class="glass krow light"${at(47.25)}><span class="tile">${icon("check")}</span><div><strong>Simple guided setup</strong><small>Gives it the context it needs</small></div></div>
      <div class="glass krow light"${at(50.55)}><span class="tile">${icon("spark")}</span><div><strong>Six skills</strong><small>Organize knowledge, plan, keep improving</small></div></div>
      <div class="skill-chips">${["/onboard", "/grill-me", "/audit", "/link", "/level-up", "/3d-brain"].map((c, i) => schip(c, 50.85 + i * 0.16)).join("")}</div>
    </div>`,
  aiosCta: () => `<div class="reflection"></div>
    <div class="cta-row">
      <img class="box-sm reveal" src="assets/aios-box-cta.png" alt="AI OS starter template box">
      <div class="cta-col">
        <div class="works reveal">Works with</div>
        <div class="chips2">${schip("Claude Code", 63.65, "light")}${schip("Codex", 64.35, "light")}</div>
        <div class="glass step final light"${at(66.8)}><span class="tile sm">${icon("download")}</span>Free template, link below</div>
      </div>
    </div>`,
  scCta: () => `<div class="reflection"></div>
    <div class="glass sc-card reveal"><span class="tile big">${icon("spark")}</span><div><strong>Scrollcraft</strong><small>The free AI design skill</small></div><span class="status">Free</span></div>
    <div class="chips2 reveal">${schip("Claude Code", null, "")}${schip("Codex", null, "")}</div>
    <div class="glass step final light"${at(50.4)}><span class="tile sm">${icon("download")}</span>Get it free, link below</div>`,
});
// ---------------------------------------------------------------- VSL components (CP5)
// Each takes T(phrase, after?) -> seconds (word start in this part), so reveals land on Nate's words.
const lrow = (k, a, t, sub = "") => `<div class="glass vrow light"${at(t)}><span class="tile">${icon(k)}</span><div><strong>${a}</strong>${sub ? `<small>${sub}</small>` : ""}</div></div>`;
Object.assign(UI, {
  sopInbox: (T) => `<div class="reflection"></div>
    <div class="sop-row">
      <div class="paper-wrap flush reveal"${at(T("first AI") - 0.1)}><div class="paper">
        <div class="p-head"><span>AI AUTOMATION SOCIETY</span><b>PDF</b></div>
        <div class="p-eyebrow">STANDARD OPERATING PROCEDURE</div>
        <div class="p-title">The First Client SOP</div>
        <div class="p-sub">Getting your first AI automation client</div>
        <div class="p-lines"><i><em>01</em><u></u></i><i><em>02</em><u></u></i><i><em>03</em><u></u></i></div>
        <div class="p-foot"><span>AI Automation Society</span><b></b></div>
      </div></div>
      <div class="glass inbox pop"${at(T("sent to your email") - 0.1)}><span class="tile">${icon("mail")}</span><div><strong>On its way</strong><small>to your email inbox</small></div></div>
    </div>`,
  faster: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("target", "Cut the learning curve", T("cut the learning curve") - 0.1)}
    ${lrow("person", "Get more clients", T("more clients") - 0.1)}
    ${lrow("dollar", "Land higher-paying clients", T("higher paying") - 0.1)}</div>`,
  passive: (T) => `<div class="reflection"></div><div class="vs-row">
    <div class="glass vs-card reveal"${at(T("passive learning") - 0.15)}><span class="tile dim">${icon("book")}</span><strong>Passive learning</strong>
      <div class="plist"><span class="pop"${at(T("watching videos") - 0.1)}>Watching videos</span><span class="pop"${at(T("bookmarking") - 0.1)}>Bookmarking tutorials</span><span class="pop"${at(T("getting ready") - 0.1)}>"Getting ready"</span></div></div>
    <div class="glass vs-card act pop"${at(T("real action") - 0.15)}><span class="tile">${icon("check")}</span><strong>Real action</strong><small>Turning AI knowledge into actual income</small></div></div>`,
  agency: (T) => `<div class="reflection"></div>
    <div class="glass stat-card pop"${at(T("$100,000") - 0.25)}><small>My AI automation agency, before I sold it</small><strong class="num">$100K+<span>/month</span></strong></div>
    <div class="deal-row">${[["$5K", T("5K")], ["$10K", T("10K")], ["$25K per client", T("$25,000")]].map(([t, a]) => `<span class="schip pop"${at(a - 0.1)}>${t}</span>`).join("")}</div>
    <div class="note reveal"${at(T("thousands") - 0.1)}>What thousands of AIS+ members now use to sell</div>`,
  realProblem: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("flow", "Scattered sources", T("scattered") - 0.1)}
    ${lrow("clock", "Outdated within weeks", T("outdated") - 0.1)}
    ${lrow("x", "No real support when things break", T("no real support") - 0.1)}</div>`,
  hours: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("play", "Watched the videos", T("watched videos") - 0.1)}
    ${lrow("book", "Followed the tutorials", T("followed tutorials") - 0.1)}
    <div class="glass vrow light"${at(T("haven't shipped") - 0.1)}><span class="tile dim">${icon("x")}</span><div><strong>Shipped less than you thought</strong></div></div>
    <div class="glass vrow light"${at(T("haven't earned") - 0.1)}><span class="tile dim">${icon("dollar")}</span><div><strong>Earned less than you hoped</strong></div></div></div>`,
  notAlone: (T) => `<div class="reflection"></div>
    <div class="deal-row big">${[["The smarts", T("the smarts")], ["The will", T("the will")], ["The work ethic", T("the work ethic")]].map(([t, a]) => `<span class="schip pop"${at(a - 0.1)}>${t}</span>`).join("")}</div>
    <div class="note reveal"${at(T("to succeed") - 0.1)}>Everything it takes to succeed.</div>`,
  trap: (T) => `<div class="reflection"></div>
    <div class="glass plus-card pop"${at(T("AIS+") - 0.2)}><img class="plus-mark" src="assets/ais-plus.png" alt="AIS+"><small>Built to help you escape that trap</small></div>`,
  unstuck: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("flow", "Pre-built systems", T("pre-built") - 0.1, "Proven to sell")}
    ${lrow("person", "24/7 support from expert humans", T("24/7") - 0.1, "Technical side or business side")}</div>`,
  member: (T) => `<div class="reflection"></div>
    <div class="glass stat-card pop"${at(T("$385,000") - 0.3)}><small>One member, from a regular 9-to-5 job</small><strong class="num">$385,000</strong><em>in AI contracts, in less than a year</em></div>
    <div class="deal-row">${[["$5,000", T("$5,000")], ["$10,000", T("$10,000")], ["$25,000+", T("$25,000")]].map(([t, a]) => `<span class="schip pop"${at(a - 0.1)}>${t}</span>`).join("")}<span class="schip ghost pop"${at(T("no code solutions") - 0.1)}>No-code tools</span></div>`,
  freedom: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("person", "Scaling without hiring more team", T("scaling") - 0.1)}
    ${lrow("cpu", "AI services that largely run on their own", T("selling AI services") - 0.1)}
    ${lrow("clock", "Out of the hours-for-dollars trap", T("hours for dollars") - 0.1)}</div>`,
  pillars: (T) => `<div class="reflection"></div><div class="pgrid">
    ${[["01", "The system"], ["02", "The support"], ["03", "The environment"]].map(([n, a], i) => `<div class="glass ptile pop"${at(T("three things") + i * 0.18)}><span class="cn">${n}</span><strong>${a}</strong></div>`).join("")}</div>
    <div class="join-row pop"${at(T("join AIS+") - 0.1)}><span>All three when you join</span><img src="assets/ais-plus.png" alt="AIS+"></div>`,
  system: (T) => `<div class="reflection"></div>
    <div class="glass stat-card slim pop"${at(T("exact playbook") - 0.2)}><small>The exact playbook behind my agency</small><strong class="num">$100K+<span>/month</span></strong></div>
    <div class="mgrid">${["start-here", "the-ai-partner-model", "build-your-portfolio", "claude-code", "get-your-first-clients", "scale"].map((m, i) => `<img class="pop" src="assets/sk-mod-${m}.png" alt=""${at(T("client acquisition") - 0.15 + i * 0.3)}>`).join("")}</div>
    <div class="shot-label reveal"${at(T("all of it") - 0.1)}>The AIS+ classroom, from Skool</div>`,
  courses: (T) => `<div class="reflection"></div>
    <div class="cgrid2">${[["agent-zero-foundations", T("agent zero")], ["10-hours-to-10-seconds", T("10 Hours")], ["one-person-ai-automation-agency", T("One Person")], ["n8n-templates", T("100 plug-and-play") - 0.1]].map(([c, a]) => `<img class="pop" src="assets/sk-course-${c}.png" alt=""${at(a - 0.15)}>`).join("")}</div>
    <div class="shot-label reveal"${at(T("100 plug-and-play"))}>100+ plug-and-play templates, ready from day one</div>`,
  support: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("wrench", "Real engineers", T("real engineers") - 0.1, "Every support request answered within 12 hours")}
    ${lrow("person", "A real human, not a docs link", T("actual person") - 0.1, "Personally debugging the problem with you")}
    ${lrow("clock", "Build breaks at 11 PM?", T("11 PM") - 0.2, "You're not alone")}</div>`,
  environment: (T) => `<div class="reflection"></div>
    <div class="glass stat-card slim pop"${at(T("3,500") - 0.2)}><strong class="num">3,500+</strong><em>builders shipping real systems and closing deals daily</em></div>
    <div class="deal-row">${[["Business owners", T("business owners")], ["Agency operators", T("agency operators")], ["Freelancers", T("freelancers")], ["Career pivoters", T("career pivoters")]].map(([t, a]) => `<span class="schip pop"${at(a - 0.1)}>${t}</span>`).join("")}</div>`,
  training: (T) => `<div class="reflection"></div>
    <div class="glass srow light"${at(T("Claude Code") - 0.15)}><img src="assets/sk-mod-claude-code.png" alt=""><div><strong>Training on Claude Code, Codex</strong><small>and the latest AI tools and models as they drop</small></div></div>
    <img class="cal-shot pop" src="assets/sk-calendar.png" alt=""${at(T("real time") - 0.15)}>
    <div class="shot-label reveal"${at(T("never feeling behind") - 0.1)}>Live Q&amp;As every week on the AIS+ calendar</div>`,
  events: (T) => `<div class="reflection"></div><div class="vrows">
    <div class="glass srow light"${at(T("virtual events") - 0.1)}><img src="assets/sk-mod-ais-event-recordings.png" alt=""><div><strong>Virtual events</strong><small>Build working systems alongside Nate</small></div></div>
    ${lrow("person", "One in-person event per year", T("in-person event") - 0.1, "Meet, collaborate, level up together")}
    ${lrow("ticket", "Annual members: free VIP tickets", T("free VIP") - 0.1, "To all virtual events, plus discounted in-person tickets")}</div>
    <div class="note reveal"${at(T("worth more") - 0.1)}>Worth more than the entire annual membership</div>`,
  noCode: (T) => `<div class="reflection"></div><div class="vrows">
    <div class="glass vrow light"${at(T("non-technical") - 0.1)}><span class="tile dim">${icon("book")}</span><div><strong>Non-technical degree</strong><small>Business analytics and marketing</small></div></div>
    <div class="glass vrow light"${at(T("zero coding") - 0.1)}><span class="tile dim">${icon("x")}</span><div><strong>Zero coding skills</strong></div></div>
    ${lrow("check", "Built and sold my agency anyway", T("build and sell") - 0.1)}</div>`,
  results: (T) => `<div class="reflection"></div>
    <div class="glass quote pop"${at(T("clients don't pay") - 0.1)}>Clients don't pay for code.<span class="light"${at(T("results") - 0.1)}>They pay for the results you deliver.</span></div>
    <div class="join-row pop"${at(T("exactly what we equip") - 0.1)}><span>That's what we equip you to do inside</span><img src="assets/ais-plus.png" alt="AIS+"></div>`,
  figures: (T) => `<div class="reflection"></div>
    <div class="deal-row big">${[["4-figure", T("four-figure")], ["5-figure", T("five-figure")], ["6-figure", T("six-figure")]].map(([t, a]) => `<span class="schip pop"${at(a - 0.1)}>${t}</span>`).join("")}</div>
    <div class="note reveal"${at(T("thousands of builders") - 0.1)}>Proven by thousands of builders from all over the world</div>`,
  offerFull: (T) => `<div class="reflection offer-light"></div>
    <div class="glass offer-card reveal"${at(T("annual is") - 0.3)}>
      <div class="offer-head"><span class="plan">Annual</span><span class="status">Best value</span></div>
      <div class="price-row"><div class="price light"${at(T("$749") - 0.1)}><b class="num">$749</b><span>/year</span></div><div class="per-mo light"${at(T("$62") - 0.1)}>About <b class="num">$62</b>/mo</div></div>
      <div class="perks">
        <div class="perk light"${at(T("everything unlocks") - 0.1)}><span class="tile sm">${icon("unlock")}</span>Everything unlocks on day one</div>
        <div class="perk light"${at(T("free VIP tickets", 190) - 0.1)}><span class="tile sm">${icon("ticket")}</span>Free VIP tickets to every virtual event</div>
        <div class="perk light"${at(T("discounted ticket") - 0.1)}><span class="tile sm">${icon("ticket")}</span>Discounted in-person event ticket</div>
      </div>
      <div class="sheen" data-layout-allow-overflow></div>
    </div>
    <div class="glass monthly-card reveal"${at(T("two ways") - 0.1)}><span class="plan">Monthly</span><b class="num">$129</b><span class="mo">/month</span><small>Upgrade to annual anytime</small></div>`,
  savings: (T) => `<div class="reflection"></div><div class="calc">
    <div class="glass crow light"${at(T("$199") - 0.3)}><span>VIP tickets</span><b class="num">$199 each</b></div>
    <div class="glass crow light"${at(T("$500") - 0.2)}><span>In-person discount</span><b class="num">$500</b></div>
    <div class="glass crow total light"${at(T("$1,097") - 0.3)}><span>Event savings per year</span><b class="num">$1,097</b></div>
    <div class="note reveal"${at(T("more than the entire cost") - 0.1)}>More than the entire cost of annual AIS+ ($749)</div></div>`,
  locked: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("lock", "Annual: rate locked in for life", T("locked in for life") - 0.1, "Even when the price goes up for newcomers")}
    ${lrow("unlock", "Monthly: $129/month", T("$129") - 0.3, "Upgrade to annual anytime")}</div>`,
  data: (T) => `<div class="reflection"></div>
    <div class="glass stat-card pop"${at(T("50%") - 0.3)}><small>Of AIS+ members</small><strong class="num">50%+</strong><em>are on the annual plan</em></div>
    <div class="note reveal"${at(T("several thousand") - 0.1)}>Several thousand people committed to the full year upfront</div>`,
  math: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("handshake", "One client project", T("one client project") - 0.1, "More than pays for the entire year")}
    ${lrow("ticket", "Free event tickets", T("free event tickets") - 0.1, "Included with annual")}
    ${lrow("dollar", "About $62/mo vs $129/mo", T("lower effective cost") - 0.1, "Over 50% less per month")}</div>`,
  identity: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("flow", "Building valuable, durable systems", T("valuable and durable") - 0.1)}
    ${lrow("dollar", "Closing $5K to $25K deals", T("$5,000 to") - 0.1)}
    ${lrow("person", "Running like a full team, even solo", T("full team") - 0.1)}</div>
    <div class="deal-row"><span class="schip pop"${at(T("annual or monthly") - 0.1)}>Annual or monthly</span><span class="schip ghost pop"${at(T("start wherever") - 0.1)}>Start wherever makes sense</span></div>`,
  guarantee: (T) => `<div class="reflection"></div>
    <div class="glass guard pop"${at(T("full 30 days") - 0.3)}><span class="tile big">${icon("shield")}</span><div><strong>30 days to try everything</strong><small>Not the right fit, for any reason? Send us a quick email.</small></div></div>
    <div class="glass vrow light"${at(T("cancel your annual") - 0.1)}><span class="tile">${icon("check")}</span><div><strong>Full refund on annual</strong><small>We cancel your annual membership. No questions asked.</small></div></div>`,
  endscreen: (T) => `<div class="reflection offer-light"></div>
    <div class="glass endcta pop"${at(T("link is below") - 0.3)}><div class="e-top"><span class="plan">Commit for a year</span><span class="status">Best value</span></div><div class="e-price"><b class="num">$749</b><span>/year · about $62/mo</span></div><small>Everything unlocked · rate locked for life</small></div>
    <div class="glass endcta alt pop"${at(T("link is below") - 0.05)}><div class="e-top"><span class="plan">Start monthly</span></div><div class="e-price"><b class="num">$129</b><span>/month</span></div><small>Upgrade to annual or cancel anytime</small></div>
    <div class="note reveal"${at(T("link is below") + 0.2)}>The link is below.</div>`,
});

// ---------------------------------------------------------------- VSL intro components (CP6)
const lrowDim = (k, a, t, sub = "") => `<div class="glass vrow light"${at(t)}><span class="tile dim">${icon(k)}</span><div><strong>${a}</strong>${sub ? `<small>${sub}</small>` : ""}</div></div>`;
Object.assign(UI, {
  aiosInbox: (T) => `<div class="reflection"></div>
    <div class="sop-row">
      <img class="box-v reveal" src="assets/aios-box.png" alt="AI OS starter template"${at(T("AI OS template") - 0.15)}>
      <div class="glass inbox pop"${at(T("sent over") - 0.1)}><span class="tile">${icon("send")}</span><div><strong>On its way</strong><small>Your AI OS starter template</small></div></div>
    </div>`,
  osFast: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("spark", "Your ideal OS, built fast", T("ideal OS") - 0.1)}
    ${lrow("flow", "A repeatable build process", T("systematize") - 0.1)}
    ${lrow("dollar", "Sell custom OS builds", T("sell custom OS") - 0.1, "For thousands, even tens of thousands each")}</div>`,
  osFast2: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("spark", "Better website builds, faster", T("better website builds") - 0.1)}
    ${lrow("flow", "A repeatable process", T("systematize") - 0.1)}
    ${lrow("dollar", "Sell Scrollcraft builds", T("sell Scrollcraft output") - 0.1, "Thousands of dollars per project")}</div>`,
  osMost: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrowDim("person", "Hear about AI operating systems", T("hear about") - 0.1)}
    ${lrowDim("spark", "Think it sounds cool", T("sounds cool") - 0.1)}
    ${lrowDim("x", "Never actually build one", T("never actually build") - 0.1)}</div>`,
  framework: (T) => `<div class="reflection"></div>
    <div class="glass stat-card pop"${at(T("$420,000") - 0.25)}><small>The business I run on this framework</small><strong class="num">$420K+<span>/month</span></strong><em class="light"${at(T("fewer than") - 0.1)}>with fewer than 10 full-time employees</em></div>
    <div class="note small reveal"${at(T("$420,000") + 0.6)}>Results shown reflect the founder's company and are not typical. Individual results vary.</div>`,
  fourCsV: (T) => `<div class="reflection"></div>
    <div class="cgrid">
      <div class="glass ctile light"${at(T("context") - 0.1)}><span class="cn">01</span><strong>Context</strong><small>Knows your business</small></div>
      <div class="glass ctile light"${at(T("connections") - 0.1)}><span class="cn">02</span><strong>Connections</strong><small>Reaches your stuff</small></div>
      <div class="glass ctile light"${at(T("capabilities") - 0.1)}><span class="cn">03</span><strong>Capabilities</strong><small>Knows how to do the work</small></div>
      <div class="glass ctile light"${at(T("cadence") - 0.1)}><span class="cn">04</span><strong>Cadence</strong><small>Runs without being asked</small></div>
    </div>`,
  jarvisV: (T) => `<div class="reflection"></div>
    <div class="glass jarvis-frame reveal"${at(T("Jarvis-style") - 0.2)}><img class="jv" src="assets/jarvis.png" alt="Nate with a Jarvis-style HUD"></div>
    <div class="shot-label reveal"${at(T("time savings") - 0.3)}>Support and time savings, not more frustration.</div>`,
  plusLib: (T) => `<div class="reflection"></div>
    <div class="glass plus-card pop"${at(T("AIS+") - 0.2)}><img class="plus-mark" src="assets/ais-plus.png" alt="AIS+"><small>One of the most downloaded resources in the library</small></div>
    <div class="note reveal"${at(T("solves a problem") - 0.1)}>It solves a problem everyone runs into.</div>`,
  cheap: (T) => `<div class="reflection"></div>
    <div class="vs-row">
      <div class="glass vs-card reveal"${at(T("legitimately valuable") - 0.15)}><span class="tile">${icon("check")}</span><strong>What you built</strong><small>Legitimately valuable</small></div>
      <div class="glass vs-card reveal"${at(T("looks cheap") - 0.15)}><span class="tile dim">${icon("x")}</span><strong>How it looked</strong><small>Cheap. AI can't design.</small></div>
    </div>
    <div class="glass way-out pop"${at(T("until now") - 0.1)}><span class="tile">${icon("spark")}</span><div><strong>Until now: Scrollcraft</strong><small>Gives your AI an eye for design</small></div></div>`,
  freeGroup: (T) => `<div class="reflection"></div>
    <div class="glass plus-card pop"${at(T("free AI Automation Society") - 0.15)}><img class="ais-mark" src="assets/ais-logo.png" alt="AIS"><strong class="grp">AI Automation Society</strong><small>You joined the free community</small></div>`,
  hoursG: (T) => `<div class="reflection"></div><div class="vrows">
    ${lrow("play", "Watched hours of videos", T("watched hours") - 0.1)}
    ${lrow("spark", "Seen what's possible", T("seen what's possible") - 0.1)}
    ${lrowDim("x", "Shipped less than you thought", T("haven't shipped") - 0.1)}
    ${lrowDim("dollar", "Earned less than you hoped", T("haven't earned") - 0.1)}</div>`,
});

// media window: browser-style glass frame, top-level (never inside a timed scene), with overlay label/chips
const mchip = (t, a) => `<span class="mchip pop"${at(a)}>${esc(t)}</span>`;

// ---------------------------------------------------------------- captions
const TERMS = [
  [/^cloudcode$/i, "Claude Code"], [/^codecs$/i, "Codex"], [/^ai's$/i, "AIS+"], [/^herc$/i, "Herk"],
];
const PHRASES = [ // lowercase token sequences (punctuation stripped) -> caption text
  [["five", "hundred", "and", "twenty-six"], "526"],
  [["seven", "hundred", "and", "forty-nine", "bucks"], "$749"],
  [["sixty-two", "dollars"], "$62"],
  [["thirty", "days"], "30 days"],
  [["ai's", "plus"], "AIS+"],
  [["twenty-four", "seven"], "24/7"], [["nine-to-five"], "9-to-5"],
  [["three", "hundred", "and", "eighty-five", "thousand", "dollars"], "$385,000"],
  [["a", "three", "hundred", "and", "eighty-five", "thousand", "dollars"], "$385,000"],
  [["a", "hundred", "thousand", "dollars"], "$100,000"],
  [["twenty-five", "thousand", "dollars"], "$25,000"], [["five", "thousand", "dollars"], "$5,000"], [["ten", "thousand", "dollars"], "$10,000"],
  [["twenty-five", "thousand", "dollar"], "$25,000"], [["five", "thousand", "dollar"], "$5,000"],
  [["twelve", "hours"], "12 hours"], [["eleven", "pm"], "11 PM"], [["thirty-five", "hundred"], "3,500"],
  [["a", "hundred", "and", "ninety-nine", "dollars"], "$199"], [["five", "hundred", "dollar"], "$500"],
  [["a", "thousand", "and", "ninety-seven", "dollars"], "$1,097"], [["a", "hundred", "and", "twenty-nine", "dollars"], "$129"],
  [["fifty", "percent"], "50%"], [["a", "hundred", "plug-and-play"], "100 plug-and-play"],
  [["ten", "hours", "to", "ten", "seconds"], "10 Hours to 10 Seconds"], [["one", "person", "ai", "agency"], "One Person AI Agency"], [["agent", "zero"], "Agent Zero"],
  [["cloud", "code"], "Claude Code"], [["ais", "plus"], "AIS+"],
  [["four", "hundred", "and", "twenty", "thousand", "dollars"], "$420,000"], [["four", "cs"], "4Cs"], [["ten", "full-time"], "10 full-time"],
];
const bare = (t) => t.toLowerCase().replace(/[.,!?;:"]+$/g, "").replace(/^["]+/, "");
function normalizeWords(words) {
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const hit = PHRASES.find(([seq]) => seq.every((s, k) => words[i + k] && bare(words[i + k].text) === s));
    if (hit) {
      const last = words[i + hit[0].length - 1];
      const punct = (last.text.match(/[.,!?;:]+$/) || [""])[0];
      out.push({ text: hit[1] + punct, start: words[i].start, end: last.end });
      i += hit[0].length - 1;
      continue;
    }
    let t = words[i].text;
    for (const [re, rep] of TERMS) if (re.test(bare(t))) t = rep + (t.match(/[.,!?;:]+$/) || [""])[0];
    out.push({ ...words[i], text: t });
  }
  return out;
}
// Phrase groups, two steps:
// 1. Clauses: split at sentence ends, commas and pauses >= 0.3s. A 1-word clause (e.g. a leading "So")
//    joins the next clause when the pause is short and the result still fits.
// 2. Each clause over the limit is split into the FEWEST chunks that fit, choosing the most balanced
//    partition and never ending a chunk on a weak word (articles, prepositions, "which", "all"...).
const WEAK = new Set("to of the a an and or on in at for with about our your my their that this is are but so which what how all we they you it into within onto from by as than like".split(" "));
const STARTERS = new Set("about across after and at because but by for from if in into like on or so than that to when where which while who with without".split(" "));
function groupCaptions(words, dur, { maxWords = 7, maxChars = 38 } = {}) {
  const len = (arr) => arr.map((x) => x.text).join(" ").length;
  let clauses = [];
  let c = [];
  words.forEach((w, i) => {
    c.push(w);
    const next = words[i + 1];
    const gap = next ? next.start - w.end : 99;
    if (/[.!?]$/.test(w.text) || /[,;:]$/.test(w.text) || gap >= 0.3) { clauses.push(c); c = []; }
  });
  if (c.length) clauses.push(c);
  for (let i = 0; i < clauses.length - 1; i++) {
    const a = clauses[i], b = clauses[i + 1];
    const gap = b[0].start - a[a.length - 1].end;
    if (a.length === 1 && !/[.!?]$/.test(a[0].text) && gap < 0.6 && len([...a, ...b]) <= maxChars) { clauses[i + 1] = [...a, ...b]; clauses.splice(i, 1); i--; }
  }
  const groups = [];
  for (const cl of clauses) {
    const n = cl.length, total = len(cl);
    const fits = (i, j) => j - i <= maxWords && len(cl.slice(i, j)) <= maxChars;
    let best = null, bestScore = Infinity;
    const kMin = Math.max(1, Math.ceil(total / maxChars));
    for (let k = kMin; k <= Math.min(n, kMin + 2); k++) {
      const target = total / k;
      const dp = Array.from({ length: k + 1 }, () => Array(n + 1).fill(Infinity));
      const from = Array.from({ length: k + 1 }, () => Array(n + 1).fill(-1));
      dp[0][0] = 0;
      for (let p = 1; p <= k; p++) for (let j = 1; j <= n; j++) for (let i = p - 1; i < j; i++) {
        if (!isFinite(dp[p - 1][i]) || !fits(i, j)) continue;
        const L = len(cl.slice(i, j));
        const weakEnd = j < n && (WEAK.has(bare(cl[j - 1].text)) || /^\$?\d[\d,.]*$/.test(bare(cl[j - 1].text))) ? 900 : 0; // weak word or bare number
        const phraseBreak = j < n && STARTERS.has(bare(cl[j].text)) ? -250 : 0;
        const tooShort = cl[j - 1].end - cl[i].start < 0.75 ? 600 : 0; // flicker guard
        const pauseBreak = j < n ? -Math.min(Math.max(cl[j].start - cl[j - 1].end - 0.04, 0), 0.3) * 500 : 0; // speaker's own micro-pauses
        const cost = dp[p - 1][i] + (L - target) ** 2 + weakEnd + phraseBreak + pauseBreak + tooShort;
        if (cost < dp[p][j]) { dp[p][j] = cost; from[p][j] = i; }
      }
      const score = dp[k][n] + 520 * k; // each extra line must earn its place
      if (isFinite(dp[k][n]) && score < bestScore) {
        const cuts = [];
        for (let p = k, j = n; p > 0; j = from[p][j], p--) cuts.unshift([from[p][j], j]);
        best = cuts.map(([i, j]) => cl.slice(i, j)); bestScore = score;
      }
    }
    groups.push(...(best || [cl]));
  }
  return groups.map((ws, i) => {
    const start = Math.max(0, ws[0].start - 0.06);
    const nextStart = groups[i + 1] ? groups[i + 1][0].start - 0.06 : null;
    const naturalEnd = ws[ws.length - 1].end + 0.3;
    const end = nextStart != null && nextStart - ws[ws.length - 1].end < 0.7 ? nextStart : Math.min(naturalEnd, nextStart ?? dur);
    return { start: r3(start), end: r3(Math.min(end, dur)), words: ws.map((w) => w.text) };
  });
}
// VSL captions (CP5 review: "not cut right"): phrase-level chunks instead of splitting at every comma.
// Units break only at sentence ends and real pauses (>= 0.5s). Inside a unit a DP picks the fewest,
// most natural chunks: commas and the speaker's micro-pauses are preferred break points, not forced ones;
// never end on a weak word or split a bound pair ("no | code", "one | client"); no 1-2 word flicker chunks.
const BIND = new Set(["no code", "one client", "more than", "less than", "four-figure five-figure", "and more", "per month", "per client", "a year", "for life", "for you", "a hundred", "of hours", "higher paying", "telling themselves", "piece everything", "paying clients", "bookmarking tutorials", "many more", "right alongside"]);
const WEAK2 = new Set("just wanna gonna these those worth where when because who while if whose even very they're you're we're it's i'm you've they've we've i've".split(" "));
const ADJ = new Set("regular other monthly real higher lower first full stable free annual entire best latest static living big quick whole several actual new own every each extensive custom technical business recurring effective true exact pre-built discounted heavily".split(" "));
function groupCaptionsV2(words, dur, { maxWords = 8, maxChars = 40 } = {}) {
  const len = (arr) => arr.map((x) => x.text).join(" ").length;
  const units = [];
  let u = [];
  words.forEach((w, i) => {
    u.push(w);
    const next = words[i + 1];
    const gap = next ? next.start - w.end : 99;
    if (/[.!?]$/.test(w.text) || gap >= 0.5) { units.push(u); u = []; }
  });
  if (u.length) units.push(u);
  for (let i = 0; i < units.length - 1; i++) { // a lone lead-in word ("So", "Plus,") rides with what follows
    const a = units[i], b = units[i + 1];
    if (a.length === 1 && !/[.!?]$/.test(a[0].text) && b[0].start - a[0].end < 0.8) { units[i + 1] = [...a, ...b]; units.splice(i, 1); i--; }
  }
  const groups = [];
  for (const cl of units) {
    const n = cl.length;
    const dp = Array(n + 1).fill(Infinity), from = Array(n + 1).fill(-1);
    dp[0] = 0;
    for (let j = 1; j <= n; j++) for (let i = Math.max(0, j - maxWords); i < j; i++) {
      if (!isFinite(dp[i])) continue;
      const chunk = cl.slice(i, j), L = len(chunk);
      if (L > maxChars && j - i > 1) continue;
      let cost = 400; // every extra line must earn its place
      if (L < 16 && n > 3) cost += (16 - L) * 55;
      if (j - i < 3 && n > 3) cost += 350;
      if (chunk[chunk.length - 1].end - chunk[0].start < 0.9 && n > 3) cost += 450;
      if (j < n) {
        const last = cl[j - 1], nx = cl[j];
        const b = bare(last.text), pause = nx.start - last.end;
        if (/[,;:]$/.test(last.text)) cost -= 260;
        cost -= Math.min(Math.max(pause - 0.04, 0), 0.4) * 650;
        if (STARTERS.has(bare(nx.text))) cost -= 110;
        if (WEAK.has(b) || /^\$?\d[\d,.]*$/.test(b)) cost += 700;
        if (BIND.has(`${b} ${bare(nx.text)}`)) cost += 900;
        if (ADJ.has(b) && !/[,;:]$/.test(last.text)) cost += 600; // "the real | reason"
        if ((b === "ai" || WEAK2.has(b)) && !/[,;:]$/.test(last.text)) cost += 650; // "AI | automation", "where | they're"
      }
      if (i > 0 && j - i > 1 && /[,;:]$/.test(chunk[0].text)) cost += 600; // "into, | and AIS+" orphaned clause tail
      if (i > 0 && bare(chunk[0].text) === "of") cost += 500;
      const lastComma = chunk.slice(0, -1).map((w) => /[,;:]$/.test(w.text)).lastIndexOf(true);
      if (j < n && lastComma >= 0 && chunk.length - 1 - lastComma <= 2) cost += 450; // "durable, closing |" dangling clause head
      if (dp[i] + cost < dp[j]) { dp[j] = dp[i] + cost; from[j] = i; }
    }
    const cuts = [];
    for (let j = n; j > 0; j = from[j]) cuts.unshift([from[j], j]);
    groups.push(...cuts.map(([i, j]) => cl.slice(i, j)));
  }
  return groups.map((ws, i) => {
    const start = Math.max(0, ws[0].start - 0.06);
    const nextStart = groups[i + 1] ? groups[i + 1][0].start - 0.06 : null;
    const naturalEnd = ws[ws.length - 1].end + 0.3;
    const end = nextStart != null && nextStart - ws[ws.length - 1].end < 0.7 ? nextStart : Math.min(naturalEnd, nextStart ?? dur);
    return { start: r3(start), end: r3(Math.min(end, dur)), words: ws.map((w) => w.text) };
  });
}
const EMPH = /(\d|\$|^sop|^aos|^ais\+)/i;
const capHtml = (g) => g.words.map((w) => (EMPH.test(w) || /^million/i.test(w) ? `<b>${esc(w)}</b>` : esc(w))).join(" ");
const srtTime = (t) => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
const toSrt = (groups) => groups.map((g, i) => `${i + 1}\n${srtTime(g.start)} --> ${srtTime(g.end)}\n${g.words.join(" ")}\n`).join("\n");

// ---------------------------------------------------------------- CSS
const cssBase = `
@font-face{font-family:Inter;src:url('assets/Inter-Variable.ttf');font-weight:100 900}
*{box-sizing:border-box}
html,body{margin:0;overflow:hidden;background:#070B12;font-family:Inter,sans-serif;color:#F2F6FA}
#main{position:relative;overflow:hidden;background:#070B12}
.pool{position:absolute;border-radius:50%;pointer-events:none}
.pool-a{background:radial-gradient(ellipse,rgba(38,120,190,.22),rgba(38,120,190,0) 68%);filter:blur(30px)}
.pool-b{background:radial-gradient(ellipse,rgba(55,189,248,.12),rgba(55,189,248,0) 66%);filter:blur(40px)}
.vignette{position:absolute;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at 50% 45%,rgba(7,11,18,0) 55%,rgba(3,5,9,.55) 100%)}
.brand{position:absolute;display:flex;align-items:center;gap:6px;z-index:6}
.brand .logo{width:72px;height:72px;display:block;margin:-12px 0 -12px -14px}
.brand .word{font-size:20px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#C9D6E2}
.header-note{position:absolute;color:#A6B6C6;letter-spacing:-.3px;z-index:6}
.speaker-window{position:absolute;overflow:hidden;background:#0d1520;z-index:2;border:1.5px solid rgba(255,255,255,.14);box-shadow:0 34px 90px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.35)}
.speaker-window video{width:100%;height:100%;object-fit:cover;object-position:50% 50%}
.speaker-edge{position:absolute;z-index:3;pointer-events:none;box-shadow:inset 0 1px 1px rgba(255,255,255,.28),inset 0 0 0 1px rgba(255,255,255,.04)}
.scene{position:absolute;inset:0;pointer-events:none;z-index:4}
.scene-inner{width:100%;height:100%;display:flex;flex-direction:column;gap:23px}
.eyebrow{font-size:25px;font-weight:520;color:#37BDF8;letter-spacing:-.3px}
h1{font-size:88px;line-height:1.06;font-weight:630;letter-spacing:-4.6px;margin:0;color:#F2F6FA}
h1 span{display:block;white-space:nowrap}
h1.long{font-size:78px;letter-spacing:-4px}
h1.compact{font-size:64px;letter-spacing:-3.2px}
.ui{position:relative;flex-shrink:0;margin-top:30px;isolation:isolate}
.reflection{position:absolute;z-index:-1;width:540px;height:300px;left:80px;top:40px;filter:blur(46px);border-radius:50%;background:radial-gradient(ellipse at 35% 30%,rgba(55,189,248,.30),rgba(40,110,190,.16) 45%,rgba(40,110,190,0) 72%)}
.glass{position:relative;background:linear-gradient(135deg,rgba(255,255,255,.11),rgba(255,255,255,.04) 55%,rgba(110,190,240,.07));border:1px solid rgba(255,255,255,.13);border-radius:26px;backdrop-filter:blur(26px) saturate(1.4);-webkit-backdrop-filter:blur(26px) saturate(1.4);box-shadow:inset 0 1px 1px rgba(255,255,255,.22),inset 0 -1px 2px rgba(0,0,0,.25),0 26px 60px rgba(0,0,0,.42),0 2px 6px rgba(0,0,0,.25);overflow:hidden}
.sheen{position:absolute;top:0;bottom:0;left:-70%;width:60%;pointer-events:none;background:linear-gradient(105deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.10) 50%,rgba(255,255,255,0) 70%)}
.tile{width:60px;height:60px;border-radius:18px;display:grid;place-items:center;flex-shrink:0;background:rgba(55,189,248,.13);color:#37BDF8;box-shadow:inset 0 1px 1px rgba(255,255,255,.14)}
.tile svg{width:32px;height:32px}.tile.big{width:78px;height:78px;border-radius:22px}.tile.big svg{width:42px;height:42px}
.tile.sm{width:40px;height:40px;border-radius:12px}.tile.sm svg{width:22px;height:22px}
.tile.dim{background:rgba(255,255,255,.06);color:#8397AA}
.num{font-variant-numeric:tabular-nums}
.status{margin-left:auto;font-size:18px;font-weight:520;color:#37BDF8;background:rgba(55,189,248,.13);padding:8px 14px;border-radius:20px;white-space:nowrap}
/* channel stat panel */
.stat-stack{display:flex;flex-direction:column;gap:16px}
.stat-panel{width:560px;padding:4px 30px}
.stat-row{display:flex;align-items:center;gap:22px;padding:20px 0}
.stat-row small{display:block;font-size:19px;color:#A6B6C6;letter-spacing:-.2px}
.stat-row strong{display:block;font-size:64px;line-height:1.05;font-weight:620;letter-spacing:-3px;color:#F2F6FA}.stat-row .num-2{font-size:52px}
/* not-technical chips */
.chip-row{display:flex;gap:22px}
.chip{display:flex;align-items:center;gap:18px;padding:22px 26px 22px 22px;font-size:28px;font-weight:500;letter-spacing:-.8px;height:104px}
.muted-chip{color:#A6B6C6}
.strike{position:absolute;left:92px;right:22px;top:51px;height:2px;border-radius:2px;background:#37BDF8;transform-origin:0 50%;display:block}
.note{font-size:24px;color:#8397AA;margin:30px 4px 0;letter-spacing:-.4px}
/* money card */
.money-card{display:flex;align-items:center;gap:24px;padding:26px 28px;width:790px}
.money-card strong{display:block;font-size:30px;font-weight:580;letter-spacing:-1px}
.money-card small{display:block;font-size:20px;color:#A6B6C6;margin-top:6px}
/* offer card (VSL) */
.offer-card{width:820px;padding:26px 34px 26px}
.offer-head{display:flex;align-items:center}.plan{font-size:30px;font-weight:600;letter-spacing:-.8px}
.price-row{display:flex;align-items:flex-end;gap:28px;margin:8px 0 18px}
.price b{font-size:96px;line-height:.95;font-weight:640;letter-spacing:-5px}.price span{font-size:28px;color:#A6B6C6;margin-left:6px}
.per-mo{font-size:30px;color:#A6B6C6;padding-bottom:12px;letter-spacing:-.6px}.per-mo b{color:#37BDF8;font-weight:620}
.perks{display:flex;flex-direction:column;gap:12px;border-top:1px solid rgba(255,255,255,.09);padding-top:20px}
.perk{display:flex;align-items:center;gap:16px;font-size:23px;line-height:1.2;color:#E4ECF3;letter-spacing:-.4px}
.monthly-card{width:820px;margin-top:16px;display:flex;align-items:baseline;gap:14px;padding:22px 34px}
.monthly-card .plan{font-size:26px;color:#C9D6E2;margin-right:10px}.monthly-card b{font-size:40px;font-weight:620;letter-spacing:-1.5px}
.monthly-card .mo{font-size:22px;color:#A6B6C6}.monthly-card small{margin-left:auto;font-size:20px;color:#A6B6C6}
.offer-light{left:40px;top:120px;width:640px;height:360px}
/* SOP ad */
.shot-frame{width:800px;padding:0;border-radius:22px;background:#0f0f0f}
.shot{display:block;width:100%;height:auto;border-radius:22px}
.hl{position:absolute;left:33.2%;top:27%;width:15.6%;height:15%;border-radius:12px;border:2px solid #37BDF8;box-shadow:0 0 0 4px rgba(55,189,248,.16),0 0 26px rgba(55,189,248,.45);display:block}
.shot-note{font-size:20px;color:#8397AA;margin:16px 4px 0;letter-spacing:-.2px}
.comment-stack{display:flex;flex-direction:column;gap:14px;width:800px}
.comment{display:flex;gap:18px;align-items:flex-start;padding:20px 26px 20px 20px}
.c-avatar{width:46px;height:46px;border-radius:50%;flex-shrink:0;background:radial-gradient(circle at 40% 35%,#6d8aa3,#2b3b4c);filter:blur(5px)}
.c-body{min-width:0}.c-name{display:block;width:150px;height:14px;border-radius:7px;background:rgba(200,215,230,.35);filter:blur(4px);margin:4px 0 12px}
.comment p{margin:0;font-size:26px;line-height:1.3;color:#E4ECF3;letter-spacing:-.4px}
.note.small{font-size:19px;margin-top:6px}
.loop-wrap{display:flex;gap:34px;align-items:center}
.ring-box{position:relative;width:270px;height:270px;flex-shrink:0}
.ring{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(255,255,255,.12);box-shadow:inset 0 0 40px rgba(55,189,248,.10),0 0 50px rgba(55,189,248,.08)}
.orbit{position:absolute;inset:0}.dot{position:absolute;left:50%;top:-7px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#37BDF8;box-shadow:0 0 18px #37BDF8;display:block}
.ring-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#A6B6C6;font-size:22px;font-weight:520}.ring-label svg{width:44px;height:44px;color:#37BDF8}
.loop-list{display:flex;flex-direction:column;gap:12px;width:520px}
.lrow{display:flex;align-items:center;gap:14px;padding:12px 18px;font-size:23px;color:#E4ECF3;border-radius:18px}
.way-out{display:flex;align-items:center;gap:16px;padding:16px 20px;margin-top:6px;border-color:rgba(55,189,248,.45);background:linear-gradient(135deg,rgba(55,189,248,.20),rgba(55,189,248,.06) 60%,rgba(255,255,255,.04))}
.way-out strong{display:block;font-size:26px;font-weight:600;letter-spacing:-.6px}.way-out small{display:block;font-size:20px;color:#9FDDF9;margin-top:4px}
.vs-row{display:flex;gap:24px}
.vs-card{width:390px;padding:26px 28px;display:flex;flex-direction:column;align-items:flex-start;gap:8px}
.vs-card strong{font-size:32px;font-weight:600;letter-spacing:-1px;margin-top:10px}.vs-card small{font-size:21px;color:#A6B6C6}
.tags{display:flex;gap:10px;margin-top:10px}.tag{font-size:19px;font-weight:540;padding:7px 14px;border-radius:18px;margin-top:10px;display:inline-block}
.tags .tag{margin-top:0}.tag.calm{color:#A6B6C6;background:rgba(255,255,255,.07)}.tag.risk{color:#FFD9A0;background:rgba(255,190,110,.12);border:1px solid rgba(255,190,110,.28)}
.sop-row{display:flex;align-items:center;gap:40px}
.paper-wrap{perspective:1400px;flex-shrink:0}
.paper{position:relative;overflow:hidden;width:340px;height:430px;border-radius:18px;padding:26px 26px 22px;background:linear-gradient(160deg,#FFFFFF,#EEF3F8);color:#1B2330;transform:rotateY(-10deg) rotateX(4deg);box-shadow:0 40px 80px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.6),0 0 60px rgba(55,189,248,.18);font-family:Inter,sans-serif}
.p-head{display:flex;justify-content:space-between;align-items:center;font-size:11px;letter-spacing:.16em;color:#6B7A8C;font-weight:600}.p-head b{font-size:11px;color:#1B6FA0;background:#E3F2FB;padding:4px 8px;border-radius:6px}
.p-eyebrow{margin-top:42px;font-size:12px;letter-spacing:.14em;color:#1E9BD8;font-weight:600}
.p-title{margin-top:12px;font-size:46px;line-height:1.02;font-weight:620;letter-spacing:-2.2px}
.p-sub{margin-top:14px;font-size:17px;color:#5B6878}
.p-lines{margin-top:30px;display:flex;flex-direction:column;gap:14px}.p-lines i{display:flex;align-items:center;gap:12px;font-style:normal}.p-lines em{font-style:normal;font-size:13px;color:#7B8898;font-weight:600;width:22px}.p-lines u{display:block;height:8px;border-radius:4px;background:#E2E8EF;flex:1}
.p-lines i:nth-child(2) u{flex:.8}.p-lines i:nth-child(3) u{flex:.9}
.p-foot{position:absolute;left:26px;right:26px;bottom:20px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#7B8898}.p-foot b{width:10px;height:10px;border-radius:50%;background:#37BDF8;display:block}
.sop-tag{font-size:36px;line-height:1.2;font-weight:560;letter-spacing:-1.2px;color:#F2F6FA;max-width:400px}.sop-tag span{color:#37BDF8}
.irows{display:flex;flex-direction:column;gap:14px;width:800px}
.irow{display:flex;align-items:center;gap:18px;padding:16px 22px;border-radius:20px}
.inum{font-size:20px;font-weight:600;color:#37BDF8;width:30px;font-variant-numeric:tabular-nums}
.irow strong{font-size:26px;font-weight:560;letter-spacing:-.6px;color:#EEF3F8}
.proof-card{width:780px;padding:8px 30px}
.proof-row{display:flex;align-items:center;gap:22px;padding:22px 0}.proof-row.divided{border-top:1px solid rgba(255,255,255,.09)}
.proof-row strong{display:block;font-size:30px;font-weight:600;letter-spacing:-.9px}.proof-row small{display:block;font-size:20px;color:#A6B6C6;margin-top:6px}
.ring30{width:78px;height:78px;flex-shrink:0}.ring30 circle{fill:none;stroke-width:6}.ring30 .track{stroke:rgba(255,255,255,.10)}.ring30 .prog{stroke:#37BDF8;stroke-linecap:round;stroke-dasharray:201.1;stroke-dashoffset:0}
.steps{display:flex;flex-direction:column;gap:12px;width:620px}
.step{display:flex;align-items:center;gap:16px;padding:14px 20px;font-size:26px;font-weight:540;letter-spacing:-.6px;border-radius:18px}
.step.final{border-color:rgba(55,189,248,.5);background:linear-gradient(135deg,rgba(55,189,248,.24),rgba(55,189,248,.07) 60%,rgba(255,255,255,.04));color:#fff}
/* media windows (CP4) */
.mwrap{position:absolute;z-index:3;border-radius:22px;overflow:hidden;background:#0b111a;border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 70px rgba(0,0,0,.5),inset 0 1px 1px rgba(255,255,255,.18)}
.mwrap .bar{height:34px;display:flex;align-items:center;gap:8px;padding:0 16px;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.08)}
.mwrap .bar i{width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.22);display:block}
.mwrap video{display:block;width:100%;height:auto}
.mwrap.accent{border-color:rgba(55,189,248,.7);box-shadow:0 0 0 3px rgba(55,189,248,.18),0 30px 70px rgba(0,0,0,.5)}
.mwrap.dim video{filter:saturate(.75) brightness(.9)}
.mlabel{position:absolute;left:16px;top:48px;font-size:18px;font-weight:560;color:#fff;background:rgba(8,13,21,.74);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:7px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14)}
.mchips{position:absolute;left:16px;bottom:16px;display:flex;gap:10px;flex-wrap:wrap}
.mchip{font-size:21px;font-weight:560;padding:9px 15px;border-radius:14px;background:rgba(8,13,21,.8);border:1px solid rgba(55,189,248,.5);color:#EAF6FD;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.jarvis-frame{width:800px;padding:0;border-radius:22px}.jv{display:block;width:100%;height:auto}
.chat{display:flex;flex-direction:column;gap:14px;align-items:flex-start;width:760px}
.bubble{font-size:27px;padding:16px 24px;border-radius:24px 24px 6px 24px;color:#E4ECF3;letter-spacing:-.4px}
.cgrid{display:grid;grid-template-columns:392px 392px;gap:16px}
.ctile{padding:20px 24px;display:flex;flex-direction:column;gap:6px;min-height:138px}
.cn{font-size:18px;font-weight:600;color:#37BDF8;font-variant-numeric:tabular-nums}.ctile strong{font-size:32px;font-weight:600;letter-spacing:-1px}.ctile small{font-size:20px;color:#A6B6C6}
.box-row{display:flex;align-items:center;gap:34px}
.box-img{height:420px;width:auto;display:block;filter:drop-shadow(0 30px 50px rgba(0,0,0,.55)) drop-shadow(0 0 40px rgba(55,189,248,.18))}
.c-list{display:flex;flex-direction:column;gap:12px}
.cchip,.schip{display:inline-block;font-size:22px;font-weight:560;padding:10px 16px;border-radius:14px;background:rgba(55,189,248,.12);border:1px solid rgba(55,189,248,.35);color:#EAF6FD}
.kit{display:flex;flex-direction:column;gap:14px;width:800px}
.krow{display:flex;align-items:center;gap:20px;padding:18px 22px}
.krow strong{display:block;font-size:30px;font-weight:600;letter-spacing:-.8px}.krow small{display:block;font-size:20px;color:#A6B6C6;margin-top:4px}
.skill-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.cta-row{display:flex;align-items:center;gap:36px}
.box-sm{height:330px;width:auto;display:block;filter:drop-shadow(0 26px 44px rgba(0,0,0,.55)) drop-shadow(0 0 34px rgba(55,189,248,.16))}
.cta-col{display:flex;flex-direction:column;gap:14px;width:420px}.works{font-size:20px;color:#A6B6C6}.chips2{display:flex;gap:10px}
.sc-card{display:flex;align-items:center;gap:22px;padding:22px 26px;width:760px}
.sc-card strong{display:block;font-size:34px;font-weight:620;letter-spacing:-1px}.sc-card small{display:block;font-size:21px;color:#A6B6C6;margin-top:4px}
.ui .chips2{margin:18px 0}
/* VSL (CP5) */
.paper-wrap.flush{margin-left:-27px} /* the 3D tilt insets the paper's visible edge; pull it back onto the headline edge */
.speaker-window .edge{position:absolute;inset:0;border-radius:inherit;pointer-events:none;box-shadow:inset 0 1px 1px rgba(255,255,255,.28),inset 0 0 0 1px rgba(255,255,255,.04)}
.vrows{display:flex;flex-direction:column;gap:14px;width:800px}
.vrow{display:flex;align-items:center;gap:20px;padding:16px 22px}
.vrow strong{display:block;font-size:28px;font-weight:600;letter-spacing:-.7px}.vrow small{display:block;font-size:20px;color:#A6B6C6;margin-top:4px}
.inbox{display:flex;align-items:center;gap:18px;padding:18px 22px}.inbox strong{display:block;font-size:28px;font-weight:600}.inbox small{display:block;font-size:20px;color:#A6B6C6}
.plist{display:flex;flex-direction:column;gap:6px;margin-top:10px}.plist span{font-size:21px;color:#8397AA;text-decoration:line-through;text-decoration-color:rgba(55,189,248,.7)}
.vs-card.act{border-color:rgba(55,189,248,.5);background:linear-gradient(135deg,rgba(55,189,248,.2),rgba(55,189,248,.06) 60%,rgba(255,255,255,.04))}
.stat-card{width:780px;padding:24px 30px}.stat-card small{display:block;font-size:21px;color:#A6B6C6}.stat-card strong{display:block;font-size:92px;line-height:1;font-weight:640;letter-spacing:-4px;margin-top:8px}.stat-card strong span{font-size:30px;color:#A6B6C6;letter-spacing:-.5px;margin-left:8px}.stat-card em{display:block;font-style:normal;font-size:24px;color:#37BDF8;margin-top:10px}
.stat-card.slim strong{font-size:80px}
.deal-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;width:800px}.deal-row.big .schip{font-size:34px;padding:14px 22px}
.schip.ghost{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16);color:#C9D6E2}
.plus-card{display:flex;align-items:center;gap:22px;padding:24px 30px}.plus-card img{width:96px;height:96px}.plus-card strong{display:block;font-size:64px;font-weight:720;letter-spacing:-2px;line-height:1}.plus-card strong b{color:#37BDF8}.plus-card small{display:block;font-size:22px;color:#A6B6C6;margin-top:8px}
.pgrid{display:grid;grid-template-columns:repeat(3,256px);gap:16px}.ptile{padding:22px 24px;min-height:150px;display:flex;flex-direction:column;gap:10px}.ptile strong{font-size:30px;font-weight:600;letter-spacing:-.8px}
.quote{margin-top:16px;padding:26px 30px;font-size:40px;font-weight:600;letter-spacing:-1.2px;line-height:1.15;width:800px}.quote span{display:block;font-size:30px;color:#37BDF8;font-weight:560;margin-top:10px;letter-spacing:-.6px}
.calc{display:flex;flex-direction:column;gap:12px;width:720px}.crow{display:flex;align-items:center;justify-content:space-between;padding:18px 26px;font-size:26px;color:#DCE5EE}.crow b{font-size:34px;font-weight:620;color:#F2F6FA}
.crow.total{border-color:rgba(55,189,248,.5);background:linear-gradient(135deg,rgba(55,189,248,.2),rgba(55,189,248,.06) 60%,rgba(255,255,255,.04))}.crow.total b{font-size:44px;color:#fff}
.guard{display:flex;align-items:center;gap:22px;padding:24px 28px;width:800px;margin-bottom:14px}.guard strong{display:block;font-size:32px;font-weight:620;letter-spacing:-.8px}.guard small{display:block;font-size:21px;color:#A6B6C6;margin-top:6px}
.endcta{width:800px;padding:22px 30px;margin-bottom:14px}.endcta .e-top{display:flex;align-items:center}.endcta .e-price b{font-size:64px;font-weight:640;letter-spacing:-2.5px}.endcta .e-price span{font-size:26px;color:#A6B6C6;margin-left:8px}.endcta small{display:block;font-size:21px;color:#C9D6E2;margin-top:4px}
.endcta:not(.alt){border-color:rgba(55,189,248,.5);background:linear-gradient(135deg,rgba(55,189,248,.18),rgba(55,189,248,.05) 60%,rgba(255,255,255,.04))}
.mgrid{display:grid;grid-template-columns:repeat(3,256px);gap:12px;margin-top:18px}.mgrid img{width:256px;height:auto;display:block;border-radius:12px;border:1px solid rgba(255,255,255,.14);box-shadow:0 14px 34px rgba(0,0,0,.45)}
.cgrid2{display:grid;grid-template-columns:392px 392px;gap:16px}.cgrid2 img{width:392px;height:auto;display:block;border-radius:14px;border:1px solid rgba(255,255,255,.14);box-shadow:0 16px 38px rgba(0,0,0,.45)}
.shot-label{font-size:21px;color:#8397AA;margin-top:14px;letter-spacing:-.2px}
.srow{display:flex;align-items:center;gap:20px;padding:12px 22px 12px 12px}.srow img{width:150px;height:auto;border-radius:12px;flex-shrink:0;display:block}.srow strong{display:block;font-size:28px;font-weight:600;letter-spacing:-.7px}.srow small{display:block;font-size:20px;color:#A6B6C6;margin-top:4px}
.cal-shot{display:block;width:800px;height:auto;margin-top:16px;border-radius:18px;border:1px solid rgba(255,255,255,.14);filter:brightness(.9);box-shadow:0 26px 60px rgba(0,0,0,.45)}
.box-v{height:360px;width:auto;display:block;filter:drop-shadow(0 30px 50px rgba(0,0,0,.55)) drop-shadow(0 0 40px rgba(55,189,248,.18))}
.plus-card .ais-mark{width:96px;height:96px;margin:-10px 0 -6px -14px}.plus-card .grp{font-size:44px;font-weight:640;letter-spacing:-1.6px;line-height:1}
.hdr-plus{position:absolute;right:96px;top:56px;height:40px;width:auto;z-index:6}
.plus-card{flex-direction:column;align-items:flex-start;gap:14px;padding:30px 40px 28px;width:max-content}.plus-card .plus-mark{width:auto;height:118px}
.join-row{display:flex;align-items:center;gap:16px;margin-top:24px;font-size:26px;color:#C9D6E2;letter-spacing:-.4px}.join-row img{height:40px;width:auto}
.seeyou{position:absolute;z-index:3;left:1080px;top:151px;width:744px;height:773px;border-radius:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}.seeyou img{height:110px;width:auto;margin-bottom:10px}.seeyou strong{font-size:56px;font-weight:640;letter-spacing:-2px}.seeyou small{font-size:24px;color:#A6B6C6}
/* captions */
.caption{position:absolute;left:0;text-align:center;z-index:10}
.caption span{display:inline-block;padding:10px 24px 12px;border-radius:20px;border:1px solid rgba(255,255,255,.12);background:rgba(9,14,22,.70);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 10px 30px rgba(0,0,0,.35),inset 0 1px 1px rgba(255,255,255,.10);font-size:35px;font-weight:500;letter-spacing:-.5px;white-space:nowrap;color:#F2F6FA}
.caption b{color:#37BDF8;font-weight:600}
`;
const cssFormat = {
  "16x9": `
html,body,#main{width:1920px;height:1080px}
.pool-a{left:-120px;top:420px;width:1100px;height:700px}.pool-b{left:1000px;top:120px;width:960px;height:900px}
.brand{left:96px;top:50px}.header-note{right:98px;top:66px;font-size:23px}
.speaker-window,.speaker-edge{left:1080px;top:151px;width:744px;height:773px;border-radius:40px}
.scene-inner{padding:177px 900px 155px 96px}
.ui{width:830px}
.caption{top:962px;width:1920px}.caption span{max-width:1700px;font-size:38px}
.slot-main{left:96px;top:330px;width:800px}.slot-cmpL{left:96px;top:356px;width:392px}.slot-cmpR{left:504px;top:356px;width:392px}
`,
  "9x16": `
html,body,#main{width:1080px;height:1920px}
.pool-a{left:-160px;top:380px;width:1200px;height:900px}.pool-b{left:60px;top:1000px;width:960px;height:900px}
.brand{left:64px;top:76px}.header-note{right:64px;top:94px;font-size:24px}
.speaker-window,.speaker-edge{left:64px;top:1080px;width:952px;height:720px;border-radius:44px}
.scene-inner{padding:250px 64px 0;align-items:center;gap:22px}
.eyebrow{text-align:center;font-size:28px}
h1{text-align:center;width:952px}
.ui{width:830px;margin-top:26px;display:flex;flex-direction:column;align-items:center}
.stat-panel{width:700px}.money-card{width:830px}.chip-row{justify-content:center}.note{text-align:center}
.caption{top:932px;left:64px;width:952px}
.caption span{max-width:930px;white-space:normal;text-wrap:balance;font-size:42px;line-height:1.22;padding:12px 24px 14px;border-radius:23px}
/* phone readability: every UI text >= 24px, card titles >= 30px */
.shot-frame{width:900px}.shot-note{font-size:24px;text-align:center}
.comment-stack{width:920px}.comment p{font-size:31px}.note,.note.small{font-size:24px;text-align:center}
.loop-wrap{gap:26px}.ring-box{width:230px;height:230px}.ring-label{font-size:24px}.loop-list{width:600px}.lrow{font-size:28px;padding:10px 16px}.way-out strong{font-size:29px}.way-out small{font-size:24px}
.vs-card{width:440px}.vs-card strong{font-size:36px}.vs-card small{font-size:26px}.tag{font-size:24px}
.sop-row{flex-direction:column;gap:0}.sop-tag{display:none}.paper{width:300px;height:380px;padding:22px}.p-title{font-size:40px}.p-eyebrow{margin-top:30px}
.irows{width:920px}.irow strong{font-size:30px}.inum{font-size:24px}
.proof-card{width:900px}.proof-row strong{font-size:34px}.proof-row small{font-size:24px}
.steps{width:700px}.step{font-size:31px;padding:12px 20px}
.slot-main{left:120px;top:405px;width:840px}.slot-cmpL{left:64px;top:440px;width:466px}.slot-cmpR{left:550px;top:440px;width:466px}
.mlabel{font-size:24px}.mchip{font-size:26px}
.jarvis-frame{width:840px}.chat{width:900px;align-items:center}.bubble{font-size:33px}
.cgrid{grid-template-columns:440px 440px}.ctile strong{font-size:36px}.ctile small{font-size:25px}.cn{font-size:22px}
.box-img{height:380px}.cchip,.schip{font-size:27px}.kit{width:900px}.krow strong{font-size:34px}.krow small{font-size:25px}.skill-chips{justify-content:center}
.cta-row{flex-direction:column;gap:14px}.box-sm{height:180px}.cta-col{width:auto;display:grid;grid-template-columns:auto auto;justify-content:center;align-items:center;gap:14px 14px}.works{font-size:25px}.cta-col .step{grid-column:1 / span 2;justify-self:center}.step{font-size:31px}.sc-card{width:900px}.sc-card strong{font-size:38px}.sc-card small{font-size:26px}.ui .chips2{justify-content:center}
`,
};

// ---------------------------------------------------------------- specs
const CLEAN = path.join(PROJ, "04-edit-plan/clean");
const SOP_SCENES = [
  [0, 7.62, "AI Automation on YouTube", ["Over a million", "subscribers."], "channel"],
  [7.62, 11.05, "The most frequent comments", ["Not a technical", "question."], "notTech"],
  [11.05, 14.4, "What people actually ask", ["How to make money", "with AI skills."], "money"],
];
const SOP_AD_SCENES = [
  [0, 3.55, "AI Automation on YouTube", ["Over a million", "subscribers."], "channelShot"],
  [3.55, 11.05, "On the channel", ["The most", "frequent comments."], "sopNotTech"],
  [11.05, 14.4, "What they actually ask", ["How to make money", "with AI skills."], "comments"],
  [14.4, 24.45, "The learning loop", ["Stuck in a", "learning loop."], "loop"],
  [24.45, 29.75, "Why it happens", ["Learning feels", "safer than selling."], "safer"],
  [29.75, 34.95, "The First Client SOP", ["Cuts through", "the overthinking."], "sopCover"],
  [34.95, 43.35, "Inside the SOP", ["Three things", "it shows you."], "inside"],
  [43.35, 50.1, "Proven", ["Used by hundreds", "of builders."], "proof"],
  [50.1, 54.833, "Free download", ["Get the", "free SOP."], "cta"],
];
const SOP_AD_ASSETS = [[path.join(PROJ, "05-visual-assets/captures/yt-channel-header-crop.png"), "yt-channel.png"]];
const VA = path.join(PROJ, "05-visual-assets");
const BRAIN = path.join(VA, "repos/AIS-OS/docs/media/3d-brain-demo.mp4");
const AIOS_SCENES = [
  [0, 6.25, "Like Jarvis from Iron Man", ["Ask it anything."], "jarvis", "compact"],
  [6.25, 11.95, "The problem", ["Hours spent", "re-explaining."], "reexplain"],
  [11.95, 19.85, "So I built an AI OS", ["It remembers everything."], "media", "compact"],
  [19.85, 37.05, "The 4Cs", ["What made", "Jarvis work."], "fourCs"],
  [37.05, 43.2, "Your AI OS", ["Think Jarvis.", "Without the suit."], "box"],
  [43.2, 57.15, "Yours, free", ["Everything you", "need to build it."], "kit"],
  [57.15, 62.3, "Interactive 3D brain", ["Find anything you need."], "media", "compact"],
  [62.3, 69.867, "Free template", ["Build your", "own Jarvis."], "aiosCta"],
];
const AIOS_MEDIA = [
  { id: "brain1", from: BRAIN, ms: 1.0, slot: "main", start: 11.95, end: 19.85, label: "Nate's AI OS, 3D brain", chips: [["Every past decision", 13.3], ["Your priorities", 15.75], ["All your knowledge", 17.65]] },
  { id: "brain2", from: BRAIN, ms: 25.0, slot: "main", start: 57.15, end: 62.3, label: "Interactive 3D brain", chips: [["Find anything", 60.9]] },
];
const AIOS_ASSETS = [[path.join(VA, "drive/Nate JARVIS Overlay.png"), "jarvis.png"], [path.join(VA, "captures/aios-box.png"), "aios-box.png"], [path.join(VA, "captures/aios-box.png"), "aios-box-cta.png"]];
const SC = (f) => path.join(VA, "scrollcraft-demo", f);
const SCROLL_SCENES = [
  [0, 7.5, "Generic AI websites", ["Look familiar?"], "media", "compact"],
  [7.5, 15.9, "Spotted in two seconds", ["Flat. Lifeless. Gone."], "media", "compact"],
  [15.9, 30.3, "With Scrollcraft", ["Bring your pages to life."], "media", "compact"],
  [30.3, 34.35, "Before and after", ["Feel the difference."], "media", "compact"],
  [34.35, 47.55, "Free skill", ["Download Scrollcraft."], "media", "compact"],
  [47.55, 51.833, "The link's below", ["Give your AI an", "eye for design."], "scCta"],
];
const SCROLL_MEDIA = [
  { id: "gen", from: SC("generic-ai-page.mp4"), ms: 0, slot: "main", start: 0, end: 15.9, label: "Generic AI-built page", cls: "dim", chips: [["Bounced", 11.2], ["Flat", 14.4], ["Lifeless", 15.0]] },
  { id: "perk", from: SC("example-perkform.mp4"), ms: 0, slot: "main", start: 15.95, end: 22.7, label: "Built with Scrollcraft" },
  { id: "nate", from: SC("example-nateherk.mp4"), ms: 8.0, slot: "main", start: 22.7, end: 30.3, label: "Built with Scrollcraft", chips: [["Depth", 24.95], ["Movement", 25.55], ["Finishing touches", 26.15]] },
  { id: "cmpgen", from: SC("generic-ai-page.mp4"), ms: 0.2, slot: "cmpL", start: 30.35, end: 34.35, label: "Generic AI", cls: "dim" },
  { id: "cmpsc", from: SC("example-nateherk.mp4"), ms: 9.0, slot: "cmpR", start: 30.35, end: 34.35, label: "Scrollcraft", cls: "accent" },
  { id: "ais", from: SC("example-ais.mp4"), ms: 3.0, slot: "main", start: 34.4, end: 47.55, label: "Built with Scrollcraft", chips: [["Free", 38.45], ["Claude Code", 40.65], ["Codex", 41.35]] },
];
// CP5 r2: every graphic builds in on Nate's words (no dimmed placeholders waiting), scenes start on the
// sentence they illustrate, and each opening "Hey"/"So" line plays solo before the first graphic.
const VSL_SOP_INTRO = [
  { s0: 0, s1: 1.3, layout: "solo" },
  { s0: 1.3, s1: 5.2, eyebrow: "Your First Client SOP", h1: ["It's on its way", "to your inbox."], ui: "sopInbox" },
  { s0: 5.2, s1: 10.55, eyebrow: "Before you dive in", h1: ["More clients.", "Higher-paying ones."], ui: "faster" },
  { s0: 10.55, s1: 13.55, layout: "solo" },
  { s0: 13.55, s1: 26.15, eyebrow: "First off", h1: ["Congratulations."], ui: "passive" },
  { s0: 26.15, s1: 42.0, eyebrow: "Inside the SOP", h1: ["What I did to", "grow my agency."], ui: "agency" },
  { s0: 42.0, s1: 43.12, layout: "solo" },
];
const VSL_CORE_A = [
  { s0: 0, s1: 1.4, layout: "solo" },
  { s0: 1.4, s1: 13.2, eyebrow: "If you're like most builders", h1: ["Hundreds of hours", "learning AI."], ui: "hours" },
  { s0: 13.2, s1: 19.3, eyebrow: "If that sounds familiar", h1: ["You're not alone."], ui: "notAlone" },
  { s0: 19.3, s1: 29.35, eyebrow: "The real problem", h1: ["Piecing it", "all together."], ui: "realProblem" },
  { s0: 29.35, s1: 42.45, layout: "solo" },
  { s0: 42.45, s1: 50.0, eyebrow: "The true trap", h1: ["Smart people", "keep falling in."], ui: "trap" },
];
// core B timeline after the R8 micro-cut ("experts, expert humans"): everything after 9.9s moved up 0.94s
const VSL_CORE_B = [
  { s0: 0, s1: 16.06, eyebrow: "Proof", h1: ["They got", "unstuck."], ui: "unstuck" },
  { s0: 16.06, s1: 33.01, eyebrow: "One member", h1: ["From a 9-to-5", "to AI contracts."], ui: "member" },
  { s0: 33.01, s1: 43.66, eyebrow: "Other members", h1: ["Businesses that", "run on their own."], ui: "freedom" },
  { s0: 43.66, s1: 50.36, eyebrow: "What they share", h1: ["Three core", "pillars."], ui: "pillars" },
  { s0: 50.36, s1: 61.86, eyebrow: "Pillar 01", h1: ["The system."], ui: "system", h1cls: "compact" },
  { s0: 61.86, s1: 83.36, eyebrow: "Pillar 01, inside", h1: ["What's inside."], ui: "courses", h1cls: "compact" },
  { s0: 83.36, s1: 102.26, eyebrow: "Pillar 02", h1: ["The support."], ui: "support", h1cls: "compact" },
  { s0: 102.26, s1: 116.9, eyebrow: "Pillar 03", h1: ["The environment."], ui: "environment", h1cls: "compact" },
  { s0: 116.9, s1: 129.66, eyebrow: "Pillar 03, always current", h1: ["Never behind."], ui: "training", h1cls: "compact" },
  { s0: 129.66, s1: 156.06, eyebrow: "Pillar 03, events", h1: ["Build live,", "together."], ui: "events" },
  { s0: 156.06, s1: 167.56, layout: "solo" },
  { s0: 167.56, s1: 177.95, eyebrow: "No code", h1: ["The tools are", "all no code."], ui: "noCode" },
  { s0: 177.95, s1: 186.26, eyebrow: "Here's what I learned", h1: ["What clients", "actually pay for."], ui: "results" },
  { s0: 186.26, s1: 193.36, eyebrow: "Proven", h1: ["4, 5, even", "6-figure contracts."], ui: "figures" },
  { s0: 193.36, s1: 210.86, eyebrow: "AIS+ membership", h1: ["Two ways to start."], ui: "offerFull", h1cls: "compact" },
  { s0: 210.86, s1: 226.16, eyebrow: "The math", h1: ["What the tickets", "are worth."], ui: "savings" },
  { s0: 226.16, s1: 237.06, eyebrow: "Annual or monthly", h1: ["Locked in", "for life."], ui: "locked" },
  { s0: 237.06, s1: 245.86, eyebrow: "The data", h1: ["Most members", "choose annual."], ui: "data" },
  { s0: 245.86, s1: 265.66, layout: "solo" },
  { s0: 265.66, s1: 280.76, eyebrow: "Do the math", h1: ["One client pays", "for the year."], ui: "math" },
  { s0: 280.76, s1: 295.76, eyebrow: "The version of you", h1: ["Durable systems.", "Bigger deals."], ui: "identity" },
  { s0: 295.76, s1: 305.06, layout: "solo" },
  { s0: 305.06, s1: 315.56, eyebrow: "Our guarantee", h1: ["30 days.", "Full refund."], ui: "guarantee" },
  { s0: 315.56, s1: 328.36, layout: "solo" },
  { s0: 328.36, s1: 335.367, eyebrow: "Join AIS+", h1: ["Pick your plan."], ui: "endscreen", h1cls: "compact" },
];
const SK = path.join(PROJ, "05-visual-assets/skool/derived");
const SKOOL_ASSETS = fs.existsSync(SK) ? fs.readdirSync(SK).filter((f) => f.endsWith(".png")).map((f) => [path.join(SK, f), `sk-${f.replace("calendar-weeks", "calendar")}`]) : [];
// CP6 intros. Same rules as the core: open solo on "Hey", every graphic on its word, 05/06 end solo into core A,
// 07 ends split into core B (core B opens split).
const VSL_AIOS_INTRO = [
  { s0: 0, s1: 1.35, layout: "solo" },
  { s0: 1.35, s1: 4.3, eyebrow: "Your AI OS template", h1: ["It's on", "its way."], ui: "aiosInbox" },
  { s0: 4.3, s1: 15.2, eyebrow: "Before you dive in", h1: ["Build it fast.", "Then sell it."], ui: "osFast" },
  { s0: 15.2, s1: 18.5, layout: "solo" },
  { s0: 18.5, s1: 25.45, eyebrow: "First off", h1: ["Congratulations."], ui: "osMost" },
  { s0: 25.45, s1: 33.0, eyebrow: "You just downloaded", h1: ["The framework", "I run on."], ui: "framework" },
  { s0: 33.0, s1: 39.7, eyebrow: "The Herk Loop", h1: ["The 4Cs."], ui: "fourCsV" },
  { s0: 39.7, s1: 48.4, eyebrow: "Your own Jarvis", h1: ["An AI chief", "of staff."], ui: "jarvisV" },
  { s0: 48.4, s1: 50.133, layout: "solo" },
];
const SCV = (f) => path.join(VA, "scrollcraft-demo", f);
const VSL_SCROLL_INTRO = [
  { s0: 0, s1: 1.25, layout: "solo" },
  { s0: 1.25, s1: 7.6, eyebrow: "Scrollcraft, the AI design skill", h1: ["It's on its way."], ui: "media", h1cls: "compact" },
  { s0: 7.6, s1: 18.0, eyebrow: "Before you dive in", h1: ["Better builds.", "Faster."], ui: "osFast2" },
  { s0: 18.0, s1: 21.1, layout: "solo" },
  { s0: 21.1, s1: 28.2, eyebrow: "First off, congratulations", h1: ["Most AI pages look like this."], ui: "media", h1cls: "compact" },
  { s0: 28.2, s1: 35.1, eyebrow: "With Scrollcraft", h1: ["An eye for design."], ui: "media", h1cls: "compact" },
  { s0: 35.1, s1: 41.2, eyebrow: "Before and after", h1: ["Feel the difference."], ui: "media", h1cls: "compact" },
  { s0: 41.2, s1: 47.8, eyebrow: "Inside AIS+", h1: ["Most downloaded."], ui: "plusLib" },
  { s0: 47.8, s1: 54.3, eyebrow: "The problem", h1: ["Valuable, but", "it looked cheap."], ui: "cheap" },
  { s0: 54.3, s1: 59.033, layout: "solo" },
];
const SCROLL_INTRO_MEDIA = [
  { id: "perk", from: SCV("example-perkform.mp4"), ms: 0.2, slot: "main", start: 1.7, end: 7.6, label: "Built with Scrollcraft", chips: [["On its way to your inbox", "email inbox"]] },
  { id: "gen", from: SCV("generic-ai-page.mp4"), ms: 0, slot: "main", start: 21.55, end: 28.2, label: "Generic AI-built page", cls: "dim", chips: [["\"A robot designed this.\"", "robot designed"]] },
  { id: "nate", from: SCV("example-nateherk.mp4"), ms: 8.0, slot: "main", start: 28.2, end: 35.1, label: "Built with Scrollcraft", chips: [["Depth", "depth"], ["Movement", "movement"], ["Layers", "layers"], ["Animations", "animations"]] },
  { id: "cmpgen", from: SCV("generic-ai-page.mp4"), ms: 3.0, slot: "cmpL", start: 35.15, end: 41.2, label: "Generic AI", cls: "dim", chips: [["Bounced in seconds", "bounce"]] },
  { id: "cmpsc", from: SCV("example-ais.mp4"), ms: 3.0, slot: "cmpR", start: 35.15, end: 41.2, label: "Scrollcraft", cls: "accent", chips: [["Read every word", "read every single"]] },
];
const VSL_GENERIC_INTRO = [
  { s0: 0, s1: 1.4, layout: "solo" },
  { s0: 1.4, s1: 7.3, eyebrow: "You joined the free group", h1: ["The opportunity", "of this decade."], ui: "freeGroup" },
  { s0: 7.3, s1: 19.9, eyebrow: "If you're like most builders", h1: ["Hundreds of hours", "learning AI."], ui: "hoursG" },
  { s0: 19.9, s1: 27.6, eyebrow: "If that sounds familiar", h1: ["You're not alone."], ui: "notAlone" },
  { s0: 27.6, s1: 39.2, eyebrow: "The real problem", h1: ["Piecing it", "all together."], ui: "realProblem" },
  { s0: 39.2, s1: 52.9, layout: "solo" },
  { s0: 52.9, s1: 58.933, eyebrow: "The true trap", h1: ["Smart people", "keep falling in."], ui: "trap" },
];
const VSL = (id, clean, dur, vsl, hold = 0, extra = {}) => ({ id, format: "16x9", brand: "ais", note: "AIS+ Membership", dur, hold, vsl, windows: extra.windows,
  assets: [[path.join(PROJ, "05-visual-assets/brand/ais-plus-logo-white.png"), "ais-plus.png"], ...SKOOL_ASSETS, ...(extra.assets || [])],
  media: { from: path.join(CLEAN, `${clean}.mp4`), start: 0, copy: true }, words: { file: path.join(CLEAN, `${clean}.aligned.json`), offset: 0 } });
const SPECS = [
  VSL("vsl-intro-sop", "04-vsl-intro-sop", 43.12, VSL_SOP_INTRO),
  VSL("vsl-core-a", "08-vsl-core-A", 50.0, VSL_CORE_A),
  VSL("vsl-core-b", "08-vsl-core-B", 335.367, VSL_CORE_B, 3.0),
  VSL("vsl-intro-aios", "05-vsl-intro-aios", 50.133, VSL_AIOS_INTRO, 0, { assets: [[path.join(VA, "drive/Nate JARVIS Overlay.png"), "jarvis.png"], [path.join(VA, "captures/aios-box.png"), "aios-box.png"]] }),
  VSL("vsl-intro-scrollcraft", "06-vsl-intro-scrollcraft", 59.033, VSL_SCROLL_INTRO, 0, { windows: SCROLL_INTRO_MEDIA }),
  VSL("vsl-intro-generic", "07-vsl-intro-generic", 58.933, VSL_GENERIC_INTRO),
  { id: "aios-ad-16x9", format: "16x9", brand: "ais", note: "Free AI OS Template", dur: 69.867, assets: AIOS_ASSETS, windows: AIOS_MEDIA,
    media: { from: path.join(CLEAN, "02-ad-aios.mp4"), start: 0, copy: true }, words: { file: path.join(CLEAN, "02-ad-aios.words.json"), offset: 0 }, scenes: AIOS_SCENES },
  { id: "aios-ad-9x16", format: "9x16", brand: "ais", note: "Free template", dur: 69.867, assets: AIOS_ASSETS, windows: AIOS_MEDIA,
    media: { from: path.join(CLEAN, "02-ad-aios.mp4"), start: 0, copy: true }, words: { file: path.join(CLEAN, "02-ad-aios.words.json"), offset: 0 }, scenes: AIOS_SCENES },
  { id: "scroll-ad-16x9", format: "16x9", brand: "ais", note: "Free Scrollcraft skill", dur: 51.833, windows: SCROLL_MEDIA,
    media: { from: path.join(CLEAN, "03-ad-scrollcraft.mp4"), start: 0, copy: true }, words: { file: path.join(CLEAN, "03-ad-scrollcraft.words.json"), offset: 0 }, scenes: SCROLL_SCENES },
  { id: "scroll-ad-9x16", format: "9x16", brand: "ais", note: "Free skill", dur: 51.833, windows: SCROLL_MEDIA,
    media: { from: path.join(CLEAN, "03-ad-scrollcraft.mp4"), start: 0, copy: true }, words: { file: path.join(CLEAN, "03-ad-scrollcraft.words.json"), offset: 0 }, scenes: SCROLL_SCENES },
  { id: "sop-ad-16x9", format: "16x9", brand: "ais", note: "The First Client SOP", dur: 54.833, assets: SOP_AD_ASSETS,
    media: { from: path.join(CLEAN, "01-ad-sop.mp4"), start: 0, copy: true },
    words: { file: path.join(CLEAN, "01-ad-sop.words.json"), offset: 0 }, scenes: SOP_AD_SCENES },
  { id: "sop-ad-9x16", format: "9x16", brand: "ais", note: "Free SOP", dur: 54.833, assets: SOP_AD_ASSETS,
    media: { from: path.join(CLEAN, "01-ad-sop.mp4"), start: 0, copy: true },
    words: { file: path.join(CLEAN, "01-ad-sop.words.json"), offset: 0 }, scenes: SOP_AD_SCENES },
  { id: "cp2-sop-16x9", format: "16x9", brand: "ais", note: "The First Client SOP", dur: 14.4,
    media: { from: path.join(CLEAN, "01-ad-sop.mp4"), start: 0, copy: true },
    words: { file: path.join(CLEAN, "01-ad-sop.words.json"), offset: 0 }, scenes: SOP_SCENES },
  { id: "cp2-sop-9x16", format: "9x16", brand: "ais", note: "Free SOP", dur: 14.4,
    media: { from: path.join(CLEAN, "01-ad-sop.mp4"), start: 0, copy: true },
    words: { file: path.join(CLEAN, "01-ad-sop.words.json"), offset: 0 }, scenes: SOP_SCENES },
  { id: "cp2-vsl-offer-16x9", format: "16x9", brand: "aisplus", note: "", dur: 17.6,
    media: { from: path.join(PROJ, "sources/08 VSL CORE BODY.mp4"), start: 329.8, copy: false },
    words: { file: path.join(PROJ, "03-transcripts/raw/08-vsl-core.json"), offset: 329.8 },
    scenes: [[0, 17.6, "AIS+ membership", ["Two ways to start."], "offer", "compact"]] },
];

// ---------------------------------------------------------------- build
function prepMedia(spec, dir) {
  const out = path.join(dir, "assets/speaker.mp4");
  if (fs.existsSync(out)) return;
  const m = spec.media;
  if (m.copy) {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(m.start), "-i", m.from, "-t", String(spec.dur), "-c", "copy", "-movflags", "+faststart", out]);
  } else {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-hwaccel", "videotoolbox", "-ss", String(m.start), "-i", m.from, "-t", String(spec.dur),
      "-vf", "fps=30,scale=1920:1080:flags=lanczos:in_range=full:out_range=tv,format=yuv420p",
      "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-g", "30", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
      "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out]);
  }
}

function build(spec) {
  const dir = path.join(ROOT, spec.id);
  fs.mkdirSync(path.join(dir, "assets"), { recursive: true });
  for (const [src, dst] of [[path.join(WG, "assets/fonts/Inter-Variable.ttf"), "Inter-Variable.ttf"], [path.join(WG, "hyperframes-white-glass/01-morning/assets/gsap.min.js"), "gsap.min.js"], [path.join(PROJ, "05-visual-assets/brand/ais-logo.png"), "ais-logo.png"]])
    fs.copyFileSync(src, path.join(dir, "assets", dst));
  for (const [src, dst] of spec.assets || []) fs.copyFileSync(src, path.join(dir, "assets", dst));
  for (const m of spec.windows || []) {
    const out = path.join(dir, "assets", `m-${m.id}.mp4`);
    if (fs.existsSync(out)) continue;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(m.ms || 0), "-i", m.from, "-t", String(m.end - m.start + 0.2), "-an",
      "-vf", "fps=30,scale=1280:720:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-g", "30", "-movflags", "+faststart", out]);
  }
  prepMedia(spec, dir);
  fs.writeFileSync(path.join(dir, "hyperframes.json"), JSON.stringify({ paths: { assets: "assets", blocks: "compositions" } }, null, 2));
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify({ id: spec.id, name: `Dark Glass · ${spec.id}` }, null, 2));

  const D = spec.dur;
  const VD = +(spec.dur - (spec.hold || 0)).toFixed(3); // speaker video length (hold = silent end-card tail)
  const [W, H] = spec.format === "16x9" ? [1920, 1080] : [1080, 1920];
  const src = JSON.parse(fs.readFileSync(spec.words.file, "utf8"));
  const words = normalizeWords(src.words.filter((w) => (w.type ?? "word") === "word")
    .map((w) => ({ text: w.text, start: w.start - spec.words.offset, end: w.end - spec.words.offset }))
    .filter((w) => w.start >= -0.01 && w.end <= D + 0.01));
  const groups = spec.vsl ? groupCaptionsV2(words, D, { maxWords: 9, maxChars: 44 }) : groupCaptions(words, D, { maxWords: 8, maxChars: 38 });
  // anchor lookup for word-synced reveals. Matches whole sub-words in sequence (merged caption tokens like
  // "Agent Zero," or "10 Hours to 10 Seconds," are split back into sub-words that share the token's start),
  // so "$500" can never match "$5,000" and "ticket" never matches "tickets". Scenes pass a scoped window.
  const nz = (x) => x.toLowerCase().replace(/[^a-z0-9$+]/g, "");
  const subs = words.flatMap((w) => w.text.split(/\s+/).map((t) => ({ t: nz(t), start: w.start }))).filter((x) => x.t);
  const T = (phrase, after = 0, before = Infinity) => {
    const target = phrase.split(/\s+/).map(nz).filter(Boolean);
    for (let i = 0; i < subs.length; i++) {
      if (subs[i].start < after) continue;
      if (subs[i].start > before) break;
      if (target.every((t, k) => subs[i + k] && subs[i + k].t === t)) return +subs[i].start.toFixed(2);
    }
    throw new Error(`${spec.id}: anchor not found "${phrase}" in ${after.toFixed(2)}..${before}`);
  };
  if (spec.vsl) spec.scenes = spec.vsl.map((v) => [v.s0, v.s1, v.eyebrow || "", v.h1 || [], v.ui || "media", v.h1cls || "", v.layout || "split"]);
  fs.writeFileSync(path.join(dir, "captions.json"), JSON.stringify(groups, null, 2));
  fs.writeFileSync(path.join(dir, `${spec.id}.srt`), toSrt(groups));

  // Official AIS mark (05-visual-assets/brand/ais-logo.png, 192px RGBA, from the opt-in pages). No AIS+ logo on file yet.
  const brand = `<div class="brand"><img class="logo" src="assets/ais-logo.png" alt="AIS"><span class="word">AI Automation Society</span></div>`;
  const scenes = spec.scenes.map(([s0, s1, eyebrow, h1, ui, h1cls, layout], i) => {
    if (layout === "solo") return "";
    const long = h1.some((v) => v.length > 16);
    const cls = h1cls || (long ? "long" : "");
    const st = Math.max(0, s0 - 0.22), en = Math.min(D, s1 + 0.05);
    return `<section id="s${i}" class="scene clip" data-start="${st.toFixed(3)}" data-duration="${(en - st).toFixed(3)}" data-track-index="${i + 3}"><div class="scene-inner"><div class="eyebrow">${esc(eyebrow)}</div><h1 class="${cls}">${h1.map((v) => `<span>${esc(v)}</span>`).join("")}</h1><div class="ui ui-${ui}">${UI[ui]((p, after = 0) => T(p, Math.max(after, s0 - 0.6), s1 + 0.3))}</div></div></section>`;
  }).join("\n");
  for (const m of spec.windows || []) if (m.chips) m.chips = m.chips.map(([t, a]) => [t, typeof a === "string" ? r3(T(a, m.start - 0.3, m.end) - 0.1) : a]);
  const mediaHtml = (spec.windows || []).map((m, i) => `<div id="mw-${m.id}" class="mwrap slot-${m.slot}${m.cls ? " " + m.cls : ""}" data-in="${m.start}" data-out="${m.end}"><div class="bar"><i></i><i></i><i></i></div><video id="mv-${m.id}" src="assets/m-${m.id}.mp4" muted playsinline data-start="${m.start}" data-duration="${(m.end - m.start).toFixed(3)}" data-track-index="${40 + i}"></video>${m.label ? `<span class="mlabel">${esc(m.label)}</span>` : ""}${m.chips ? `<div class="mchips">${m.chips.map(([t, a]) => mchip(t, a)).join("")}</div>` : ""}</div>`).join("\n");
  const caps = groups.map((g, i) => `<div id="cap${i}" class="caption clip" data-start="${g.start.toFixed(3)}" data-duration="${(g.end - g.start).toFixed(3)}" data-track-index="30"><span>${capHtml(g)}</span></div>`).join("\n");

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=${W},height=${H}"><title>${spec.id}</title><script src="assets/gsap.min.js"></script><style>${cssBase}${cssFormat[spec.format]}</style></head><body>
<main id="main" data-composition-id="main" data-start="0" data-duration="${D}" data-width="${W}" data-height="${H}">
<div class="pool pool-a"></div><div class="pool pool-b"></div><div class="vignette"></div>
${brand}${spec.vsl ? `<img class="hdr-plus" src="assets/ais-plus.png" alt="AIS+">` : spec.note ? `<div class="header-note">${esc(spec.note)}</div>` : ""}
<div class="speaker-window" id="sw"><video id="speaker" src="assets/speaker.mp4" muted playsinline data-start="0" data-duration="${VD}" data-track-index="0"></video><div class="edge"></div></div>${spec.hold ? `<div id="seeyou" class="glass seeyou"><img src="assets/ais-plus.png" alt="AIS+"><strong>See you inside.</strong><small>The link is below.</small></div>` : ""}
<audio id="speech" src="assets/speaker.mp4" data-start="0" data-duration="${VD}" data-track-index="1" data-volume="1"></audio>
${mediaHtml}
${scenes}
${caps}
</main><script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
const BUILD_IN = ${spec.vsl ? "true" : "false"}; // VSLs: rows build in on the word (CP5 review), ads keep the approved dim-then-light
const SCENES = ${JSON.stringify(spec.scenes.map((s) => [s[0], s[1], s[6] || "split"]))};
const D = ${D};
const GEO = { split: { left: 1080, top: 151, width: 744, height: 773 }, solo: { left: 300, top: 120, width: 1320, height: 742.5 } };
if (SCENES.some((s) => s[2] === "solo")) {
  tl.set("#sw", GEO[SCENES[0][2]], 0);
  SCENES.forEach((s, i) => { if (i > 0 && s[2] !== SCENES[i - 1][2]) tl.to("#sw", { ...GEO[s[2]], duration: 0.9, ease: "power3.inOut" }, s[0] - (s[2] === "solo" ? 0.1 : 0.35)); });
}
${spec.hold ? `tl.to("#sw", { opacity: 0, scale: 0.97, duration: 0.5, ease: "power2.inOut" }, ${VD} - 0.45);
tl.fromTo("#seeyou", { opacity: 0, scale: 0.96, filter: "blur(8px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, ${VD} - 0.2);` : ""}
SCENES.forEach((s, i) => {
  const root = "#s" + i;
  if (s[2] === "solo") return;
  const afterSolo = i > 0 && SCENES[i - 1][2] === "solo";
  const at = Math.max(0, s[0] - 0.08) + (afterSolo ? 0.43 : 0);
  if (i > 0) {
    tl.fromTo(root, { opacity: 0, x: 26, filter: "blur(11px)" }, { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.58, ease: "power3.out" }, at);
    tl.from(root + " .eyebrow", { y: 12, opacity: 0, duration: 0.5, ease: "power2.out" }, at + 0.05);
    tl.from(root + " h1 span", { y: 22, opacity: 0, filter: "blur(6px)", stagger: 0.1, duration: 0.65, ease: "expo.out" }, at + 0.1);
  }
  const free = [...document.querySelectorAll(root + " .reveal:not([data-at])")];
  if (free.length) tl.from(free, { y: 23, opacity: 0, filter: "blur(6px)", stagger: 0.085, duration: 0.7, ease: "power3.out" }, at + 0.22);
  document.querySelectorAll(root + " .reveal[data-at]").forEach((el) => {
    tl.from(el, { y: 18, opacity: 0, filter: "blur(6px)", duration: 0.6, ease: "power3.out" }, Number(el.dataset.at));
  });
  document.querySelectorAll(root + " .light[data-at]").forEach((el) => {
    if (BUILD_IN) tl.fromTo(el, { opacity: 0, y: 16, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }, Number(el.dataset.at));
    else tl.fromTo(el, { opacity: 0.3 }, { opacity: 1, duration: 0.45, ease: "power2.out" }, Number(el.dataset.at));
    const tile = el.querySelector(".tile");
    if (tile) tl.fromTo(tile, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: "back.out(1.6)" }, Number(el.dataset.at));
  });
  document.querySelectorAll(root + " .pop[data-at]").forEach((el) => {
    tl.fromTo(el, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, Number(el.dataset.at));
  });
  document.querySelectorAll(root + " .orbit").forEach((el) => {
    tl.fromTo(el, { rotation: 0 }, { rotation: 540, duration: s[1] - s[0], ease: "none" }, at);
  });
  document.querySelectorAll(root + " .prog[data-at]").forEach((el) => {
    tl.fromTo(el, { strokeDashoffset: 201.1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" }, Number(el.dataset.at));
  });
  document.querySelectorAll(root + " .strike").forEach((el) => {
    tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, Number(el.dataset.at));
  });
  const sheens = document.querySelectorAll(root + " .sheen");
  if (sheens.length) tl.fromTo(sheens, { x: 0 }, { x: 1400, duration: 1.8, ease: "sine.inOut" }, at + 1.1);
  tl.fromTo(root + " .reflection", { x: -10, opacity: 0.75 }, { x: 18, opacity: 1, duration: Math.max(1, s[1] - s[0] - 0.4), ease: "sine.inOut" }, at);
  if (i < SCENES.length - 1 && document.querySelector(root)) tl.fromTo(root, { opacity: 1, x: 0, filter: "blur(0px)" }, { opacity: 0, x: -22, filter: "blur(10px)", duration: 0.3, ease: "power2.inOut", immediateRender: false }, s[1] - 0.3);
});
${(spec.windows || []).map((m) => [
  m.start > 0 ? `tl.fromTo("#mw-${m.id}", { opacity: 0, y: 18, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, ${r3(Math.max(0, m.start - 0.05))});` : "",
  m.end < D - 0.05 ? `tl.fromTo("#mw-${m.id}", { opacity: 1, filter: "blur(0px)" }, { opacity: 0, filter: "blur(8px)", duration: 0.3, ease: "power2.inOut", immediateRender: false }, ${r3(m.end - 0.3)});` : "",
].join("\n")).join("\n")}
document.querySelectorAll(".mwrap .pop[data-at]").forEach((c) => tl.fromTo(c, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, Number(c.dataset.at)));
document.querySelectorAll(".caption").forEach((el) => {
  tl.from(el.querySelector("span"), { y: 8, opacity: 0, duration: 0.16, ease: "power2.out" }, Number(el.dataset.start));
});
tl.to({}, { duration: D }, 0);
window.__timelines.main = tl;
</script></body></html>`;
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log(`${spec.id}: ${D}s, ${spec.scenes.length} scenes, ${groups.length} captions`);
}

const want = process.argv.slice(2);
for (const spec of SPECS) if (!want.length || want.includes(spec.id)) build(spec);
