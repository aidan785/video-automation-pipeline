// AIS Live — Brand & Partnership Sheet
// Print-optimized US-letter pages. Self-contained: components are inline.

// ───────── Shared bits ─────────
function Eyebrow({ children, color = '#37bdf8' }) {
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: color }} />
      {children}
    </div>);

}

function CmdBg({ op = 0.06 }) {
  return <div data-cmdbg style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(55,189,248,${op}) 1px, transparent 1px), linear-gradient(90deg, rgba(55,189,248,${op}) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />;
}

// ── Shift mark — auto-recolors for any surface, with live-dot in top-right corner ──
function ShiftMark({ theme = 'dark', size = 18, glow = true, italic = true }) {
  const m = {
    dark: { ais: '#fff', live: '#37bdf8', glow: 'rgba(55,189,248,0.55)' },
    blue: { ais: '#fff', live: '#07121c', glow: 'transparent' },
    yellow: { ais: '#07121c', live: '#fff', glow: 'transparent' },
    orange: { ais: '#07121c', live: '#fff', glow: 'transparent' },
    coral: { ais: '#07121c', live: '#fff', glow: 'transparent' },
    white: { ais: '#07121c', live: '#37bdf8', glow: 'rgba(55,189,248,0.25)' },
    cream: { ais: '#07121c', live: '#37bdf8', glow: 'transparent' },
    allblack: { ais: '#07121c', live: '#07121c', glow: 'transparent' },
    allwhite: { ais: '#fff', live: '#fff', glow: 'transparent' },
    blueblack: { ais: '#37bdf8', live: '#07121c', glow: 'transparent' }
  }[theme] || { ais: '#fff', live: '#37bdf8', glow: 'rgba(55,189,248,0.55)' };
  const dotRed = '#ff3b30';
  const dotSize = Math.max(3, size * 0.16);
  return (
    <span style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: italic ? 'italic' : 'normal', fontWeight: 900, fontSize: size, letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'baseline', lineHeight: 0.9, position: 'relative', paddingRight: size * 0.62 }}>
      <span style={{ color: m.ais }}>AIS</span>
      <span style={{ display: 'inline-block', width: Math.max(2, size * 0.08) }} />
      <span style={{ color: m.live, textShadow: glow && m.glow !== 'transparent' ? `0 0 ${size * 0.7}px ${m.glow}` : 'none', position: 'relative' }}>
        LIVE
        <span style={{ position: 'absolute', top: size * 0.05, left: '100%', marginLeft: size * 0.36, width: dotSize, height: dotSize, borderRadius: '50%', background: dotRed, boxShadow: `0 0 ${dotSize * 1.6}px ${dotRed}, 0 0 ${dotSize * 0.6}px ${dotRed}` }}/>
      </span>
    </span>);

}

// ── Page chrome — runs across every sheet ──
function Chrome({ pageNo, total, kind = 'cream', sectionLabel = 'Brand & Partnership Sheet' }) {
  return (
    <>
      <div className="chrome-top">
        <span className="mark-mini">AIS<b>LIVE</b></span>
        <span>{sectionLabel}</span>
      </div>
      <div className="chrome-bot">
        <span>AIS Live · Brand & Partnership Sheet · 2026</span>
        <span>{String(pageNo).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>
    </>);

}

function Sheet({ kind = 'cream', pageNo, total, label, children, padding = 'pad' }) {
  const cls = ['sheet'];
  if (kind === 'dark') cls.push('dark');
  if (kind === 'charcoal') cls.push('charcoal');
  return (
    <div className={cls.join(' ')}>
      <Chrome pageNo={pageNo} total={total} kind={kind} sectionLabel={label} />
      <div className={padding} style={{ paddingTop: '0.85in', paddingBottom: '0.7in', minHeight: '11in', position: 'relative' }}>
        {children}
      </div>
    </div>);

}

// ───────── Sheet 01 — Cover ─────────
function CoverSheet({ pageNo, total }) {
  return (
    <Sheet kind="dark" pageNo={pageNo} total={total} label="Cover">
      <CmdBg op={0.07} />
      <div data-print-hide style={{ position: 'absolute', top: '-1.5in', right: '-1in', width: '5in', height: '5in', background: '#37bdf8', filter: 'blur(120px)', opacity: 0.22, borderRadius: '50%' }} />
      <div data-print-hide style={{ position: 'absolute', bottom: '-1.5in', left: '-1in', width: '4in', height: '4in', background: '#FF8A5C', filter: 'blur(140px)', opacity: 0.16, borderRadius: '50%' }} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '9.4in' }}>
        <div>
          <Eyebrow color="#FF8A5C">Brand & Partnership Sheet · 2026</Eyebrow>
          <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(209,220,232,0.5)', fontWeight: 700 }}>Confidential — for media + partnership review</div>
        </div>

        <div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 150, letterSpacing: '-0.04em', lineHeight: 0.9, display: 'flex', alignItems: 'baseline', position: 'relative', paddingRight: 95 }}>
            <span style={{ color: '#fff' }}>AIS</span>
            <span style={{ display: 'inline-block', width: 18 }} />
            <span style={{ color: '#37bdf8', textShadow: '0 0 60px rgba(55,189,248,0.6)', position: 'relative' }}>
              LIVE
              <span style={{ position: 'absolute', top: 8, left: '100%', marginLeft: 54, width: 24, height: 24, borderRadius: '50%', background: '#ff3b30', boxShadow: '0 0 38px #ff3b30, 0 0 14px #ff3b30' }}/>
            </span>
          </div>
          <div style={{ marginTop: 18, fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1, color: '#fff' }}>
            Real Projects.&nbsp; <span style={{ fontStyle: 'italic', color: '#37bdf8' }}>Real Revenue.</span>
          </div>
          <div style={{ marginTop: 16, fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: 'rgba(209,220,232,0.78)', maxWidth: '5.4in' }}>
            The brand sheet for media partners, sponsors, and press. Logo, colorways, type, surfaces, and partnership tiers — everything you need to bring AIS Live to your audience.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingTop: 24, borderTop: '1px solid rgba(55,189,248,0.2)' }}>
          {[
          { k: 'Audience', v: 'Operators, builders, AI-automation pros' },
          { k: 'Format', v: '2-day virtual event + cohort programming' },
          { k: 'Contact', v: 'Operators, builders, AI-automation pros' }].
          map((c, i) =>
          <div key={i}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: '#37bdf8' }}>{c.k}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(209,220,232,0.85)', marginTop: 6, lineHeight: 1.4 }}>{c.v}</div>
            </div>
          )}
        </div>
      </div>
    </Sheet>);

}

// ───────── Sheet 02 — Intro / what AIS Live is ─────────
function IntroSheet({ pageNo, total }) {
  return (
    <Sheet pageNo={pageNo} total={total} label="What AIS Live is">
      <Eyebrow>About</Eyebrow>
      <h1 className="page-title">What <em>AIS Live</em> is.</h1>

      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <p className="deck">
            <b>AIS Live</b> is the live, in-person extension of the AI Automation Society — three days where operators, builders, and AI-automation professionals gather to do the work in one room. Real projects shipped on stage. Real revenue figures shared on the record. No keynote-circuit fluff; no vendor-hall noise.
          </p>
          <p className="deck" style={{ marginTop: 14 }}>
            The brand reads the way the room feels: <b>direct, technical, optimistic, and deeply unglamorous about the work.</b> That voice carries from the lockup down to the smallest piece of micro-copy on a press pass. Use this sheet as the source of truth.
          </p>
        </div>
        <div>
          <div style={{ background: 'rgba(7,18,28,0.04)', border: '1px solid var(--rule)', borderRadius: 6, padding: 18 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: '#c96442', marginBottom: 10 }}>● Voice in one breath</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink)' }}>
              <li>· Builder, not influencer.</li>
              <li>· Specific, not vague.</li>
              <li>· Outcomes, not hours.</li>
              <li>· One room, no broadcast.</li>
              <li>· Show the work, name the number.</li>
            </ul>
          </div>
          <div style={{ marginTop: 14, background: '#07121c', borderRadius: 6, padding: 18, color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <CmdBg op={0.08} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: '#37bdf8', marginBottom: 8 }}>● Tagline (separate from the mark)</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                Real Projects.&nbsp; <span style={{ fontStyle: 'italic', color: '#37bdf8' }}>Real Revenue.</span>
              </div>
              <div style={{ marginTop: 10, fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: 'rgba(209,220,232,0.7)', lineHeight: 1.5 }}>
                The tagline lives <i>outside</i> the lockup — never inside, never as a baseline. Swappable per surface ("One room. One voice." / "Three days. One room.") but always conjugated in two short sentences.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(60,50,40,0.55)', marginBottom: 12 }}>Sheet contents</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: 'var(--ink)' }}>
          {[
          ['01', 'Cover'],
          ['02', 'What AIS Live is — voice + tagline'],
          ['03', 'The mark — Shift lockup + spec'],
          ['04', 'Clear space + minimum sizes'],
          ['05', 'Do / Don\'t'],
          ['06', 'Type system + palette'],
          ['07', 'Approved colorway grid'],
          ['08', 'Surfaces in use — 6 examples'],
          ['09', 'Contacts']].
          map(([n, t]) =>
          <div key={n} style={{ display: 'flex', gap: 14, alignItems: 'baseline', borderBottom: '1px dashed var(--rule)', paddingBottom: 6 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#37bdf8', letterSpacing: '0.15em' }}>{n}</span>
              <span>{t}</span>
            </div>
          )}
        </div>
      </div>
    </Sheet>);

}

// ───────── Sheet 03 — The mark ─────────
function MarkSheet({ pageNo, total }) {
  return (
    <Sheet pageNo={pageNo} total={total} label="The Mark">
      <Eyebrow>The mark</Eyebrow>
      <h1 className="page-title">The <em>Shift</em> lockup.</h1>
      <p className="deck" style={{ marginTop: 12 }}>
        One approved AIS Live mark. Single-line lockup, <b>AIS</b> in white italic beside <b>LIVE</b> in electric blue italic. Always set in <b>Montserrat Black (900) Italic</b>, ALL CAPS, on one baseline. The slight gap between the words ensures AIS and LIVE read as two words — never a compressed slab.
      </p>

      {/* Hero frame — full italicized all-caps Shift lockup */}
      <div style={{ marginTop: 22, position: 'relative', height: '3.2in', background: '#07121c', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CmdBg op={0.08} />
        <div data-print-hide style={{ position: 'absolute', top: '-1in', right: '-0.5in', width: '4in', height: '4in', background: '#37bdf8', filter: 'blur(110px)', opacity: 0.22, borderRadius: '50%' }} />
        <div style={{ position: 'relative', fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 130, letterSpacing: '-0.04em', lineHeight: 0.9, display: 'flex', alignItems: 'baseline', textTransform: 'uppercase', paddingRight: 80 }}>
          <span style={{ color: '#fff' }}>AIS</span>
          <span style={{ display: 'inline-block', width: 14 }} />
          <span style={{ color: '#37bdf8', textShadow: '0 0 50px rgba(55,189,248,0.6)', position: 'relative' }}>
            LIVE
            <span style={{ position: 'absolute', top: 7, left: '100%', marginLeft: 47, width: 21, height: 21, borderRadius: '50%', background: '#ff3b30', boxShadow: '0 0 32px #ff3b30, 0 0 12px #ff3b30' }}/>
          </span>
        </div>
      </div>

      {/* Spec table */}
      <div style={{ marginTop: 18 }}>
        <div className="spec">
          <div className="k">Typeface</div><div className="v"><b>Montserrat</b> — Black (900), Italic</div>
          <div className="k">Case</div><div className="v">ALL CAPS</div>
          <div className="k">Letter-spacing</div><div className="v">−0.02em (relaxed — gives AIS + LIVE breathing room)</div>
          <div className="k">Line-height</div><div className="v">0.9</div>
          <div className="k">"AIS" color</div><div className="v"><span className="sw" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.2)' }} /><b>#FFFFFF</b> · White</div>
          <div className="k">"LIVE" color</div><div className="v"><span className="sw" style={{ background: '#37bdf8' }} /><b>#37BDF8</b> · Electric Blue (AIS accent)</div>
          <div className="k">LIVE glow</div><div className="v">text-shadow: 0 0 28px rgba(55,189,248,0.55) — dark grounds only</div>
          <div className="k">Background</div><div className="v"><span className="sw" style={{ background: '#07121c' }} /><b>#07121C</b> · Deep Onyx (or AIS command-deck radial)</div>
          <div className="k">Min width</div><div className="v">120px (favicon lockup) · cap-height of "AIS" clear-space on every side</div>
          <div className="k">Tagline</div><div className="v">Lives outside the mark — above, below, or beside. Never inside.</div>
          <div className="k">File formats</div><div className="v">SVG (preferred) · PNG @1×/2×/3× · monochrome PDF for print</div>
        </div>
      </div>

    </Sheet>);

}

// ───────── Sheet 04 — Clear space + minimums ─────────
function ClearSpaceSheet({ pageNo, total }) {
  return (
    <Sheet pageNo={pageNo} total={total} label="Clear Space + Minimum Sizes">
      <Eyebrow>Construction</Eyebrow>
      <h1 className="page-title">Clear space, <em>minimum sizes.</em></h1>
      <p className="deck" style={{ marginTop: 12 }}>
        The lockup needs room to breathe. Use the cap-height of "AIS" as the universal unit — <b>1× X</b> on all four sides at minimum, <b>1.5× X</b> on crowded surfaces (posters, sponsor walls, kit covers).
      </p>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* Clear-space diagram */}
        <div style={{ background: '#07121c', borderRadius: 6, padding: 22, position: 'relative', overflow: 'hidden' }}>
          <CmdBg op={0.06} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#37bdf8', fontWeight: 700, marginBottom: 14 }}>● CLEAR SPACE</div>
            <div style={{ position: 'relative', height: '2.6in', border: '1px dashed rgba(55,189,248,0.4)', borderRadius: 4, padding: 'calc(0.5em + 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[
              { l: 12, t: 12 }, { r: 12, t: 12 },
              { l: 12, b: 12 }, { r: 12, b: 12 }].
              map((p, i) =>
              <div key={i} style={{ position: 'absolute', left: p.l, right: p.r, top: p.t, bottom: p.b, width: 22, height: 22, border: '1px solid rgba(55,189,248,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#37bdf8', letterSpacing: '0.1em' }}>X</div>
              )}
              <div style={{ position: 'absolute', inset: 50, border: '1px solid rgba(55,189,248,0.15)' }} />
              <ShiftMark theme="dark" size={42} />
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: '#d1dce8', lineHeight: 1.5, marginTop: 12 }}>
              No element — type, image, edge, sponsor logo, UI chrome — may enter this zone. <b style={{ color: '#fff' }}>X = cap-height of "AIS"</b>.
            </div>
          </div>
        </div>

        {/* Minimum sizes */}
        <div style={{ background: '#07121c', borderRadius: 6, padding: 22, position: 'relative' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#37bdf8', fontWeight: 700, marginBottom: 14 }}>● MINIMUM SIZES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
            { label: 'Digital · screen', size: 16, min: '120 px wide' },
            { label: 'Print · offset', size: 13, min: '24 mm wide (≈ 1")' },
            { label: 'Embroidery · merch', size: 20, min: '60 mm wide (≈ 2.4")' },
            { label: 'Favicon / app icon', size: 11, min: '32 px square (mark only)' }].
            map((m, i, arr) =>
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 12, borderBottom: i < arr.length - 1 ? '1px solid rgba(55,189,248,0.12)' : 'none' }}>
                <div style={{ width: 110, display: 'flex', justifyContent: 'flex-start' }}>
                  <ShiftMark theme="dark" size={m.size} glow={false} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: '#fff', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(209,220,232,0.6)', marginTop: 3 }}>≥ {m.min}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </Sheet>);

}

// ───────── Sheet 05 — Do / Don't ─────────
function DoDontSheet({ pageNo, total }) {
  // Each tile renders the lockup in a specific (correct or incorrect) state.
  function Tile({ ok, label, children, bg = '#07121c' }) {
    const isLight = bg === '#ffffff' || bg === '#fff';
    const labelColor = ok ? isLight ? '#07121c' : '#37bdf8' : '#FF8A5C';
    return (
      <div style={{ background: bg, borderRadius: 6, padding: 14, border: `2px solid ${ok ? '#37bdf8' : '#FF8A5C'}`, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ position: 'absolute', top: 8, right: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 900, color: ok ? '#37bdf8' : '#FF8A5C' }}>{ok ? '✓' : '✕'}</div>
        <div style={{ position: 'relative', height: '0.95in', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: labelColor, textAlign: 'center', lineHeight: 1.4 }}>{label}</div>
      </div>);

  }
  return (
    <Sheet pageNo={pageNo} total={total} label="Do / Don't">
      <Eyebrow>Usage rules</Eyebrow>
      <h1 className="page-title">Do, and <em>don't.</em></h1>
      <p className="deck" style={{ marginTop: 12 }}>
        Visual examples of the rules. If a mark on a partner surface drifts toward any tile on the right column, replace it with the Shift lockup as shipped.
      </p>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* DO column */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#37bdf8', fontWeight: 700, marginBottom: 12 }}>● DO</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <Tile ok label="Italic primary on dark"><ShiftMark theme="dark" size={28} /></Tile>
            <Tile ok label="Single line, ALL CAPS"><ShiftMark theme="dark" size={28} glow={false} /></Tile>
            <Tile ok label="All black on white" bg="#ffffff">
              <ShiftMark theme="allblack" size={28} glow={false} />
            </Tile>
            <Tile ok label="All white on black" bg="#000000">
              <ShiftMark theme="allwhite" size={28} glow={false} />
            </Tile>
          </div>
          <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: 'var(--ink)', lineHeight: 1.5 }}>
            <li>· Use the approved colorway grid — every pair is contrast-tested.</li>
            <li>· Apply LIVE glow only on dark grounds (Onyx, Charcoal, Black).</li>
            <li>· Pair the lockup with a separate tagline — above, below, or beside.</li>
            <li>· Use italic primary on event surfaces, upright on press / institutional.</li>
          </ul>
        </div>

        {/* DON'T column */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FF8A5C', fontWeight: 700, marginBottom: 12 }}>● DON'T</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <Tile label="Don't change typeface">
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 30, color: '#fff', letterSpacing: '-0.02em' }}>AIS <span style={{ color: '#37bdf8' }}>LIVE</span></span>
            </Tile>
            <Tile label="Don't stack the lockup">
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: 22, letterSpacing: '-0.02em', display: 'flex', flexDirection: 'column', lineHeight: 0.9, alignItems: 'flex-start' }}>
                <span style={{ color: '#fff' }}>AIS</span><span style={{ color: '#37bdf8' }}>LIVE</span>
              </span>
            </Tile>
            <Tile label="Don't insert punctuation">
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em' }}>
                <span style={{ color: '#fff' }}>AIS</span><span style={{ color: '#37bdf8' }}>.LIVE</span>
              </span>
            </Tile>
            <Tile label="Don't tilt or skew">
              <span style={{ display: 'inline-block', transform: 'skewX(-12deg) rotate(-4deg)' }}>
                <ShiftMark theme="dark" size={28} glow={false} />
              </span>
            </Tile>
            <Tile label="Don't gradient or 3-D">
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em', backgroundImage: 'linear-gradient(135deg, #ff5cf0, #f5d82a, #37bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AIS LIVE</span>
            </Tile>
            <Tile label="Don't use unapproved pairs">
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em' }}>
                <span style={{ color: '#ff5cf0' }}>AIS</span><span style={{ color: '#39ff88' }}> LIVE</span>
              </span>
            </Tile>
          </div>
          <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: 'var(--ink)', lineHeight: 1.5 }}>
            <li>· Don't change the typeface — Montserrat 900 only.</li>
            <li>· Don't reflow, stack, or insert punctuation between AIS and LIVE.</li>
            <li>· Don't tilt, skew, outline, drop-shadow, gradient, or 3-D extrude.</li>
            <li>· Don't use the deprecated AIS.LIVE or $ais.live wordmarks.</li>
          </ul>
        </div>
      </div>
    </Sheet>);

}

// ───────── Sheet 06 — Type system + palette ─────────
function TypePaletteSheet({ pageNo, total }) {
  function Row({ label, meta, example, sample }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.6in 1fr', gap: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: '#37bdf8' }}>{label}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: 'rgba(255,255,255,0.55)', marginTop: 4, lineHeight: 1.4 }}>{meta}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={sample}>{example}</div>
        </div>
      </div>);

  }
  return (
    <Sheet pageNo={pageNo} total={total} label="Type + Palette">
      <Eyebrow>Type & color</Eyebrow>
      <h1 className="page-title">Type system, <em>palette.</em></h1>

      {/* TYPE */}
      <div style={{ marginTop: 18, background: '#0a0e14', borderRadius: 6, padding: 18, color: '#fff', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Row label="H1 Display Italic" meta="Montserrat · 900 Italic · −0.05em" example="Real Revenue."
        sample={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 38, letterSpacing: '-0.05em', lineHeight: 0.9, color: '#37bdf8', textShadow: '0 0 24px rgba(55,121,255,0.5)' }} />
        <Row label="H1 Display Roman" meta="Montserrat · 900 · −0.05em" example="Real Projects."
        sample={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 38, letterSpacing: '-0.05em', lineHeight: 0.9, color: '#fff' }} />
        <Row label="H2 Section" meta="Montserrat · 900 · −0.04em" example="Client Acquisition Lab"
        sample={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 24, letterSpacing: '-0.04em', lineHeight: 0.95, color: '#fff' }} />
        <Row label="Stat" meta="Montserrat · 900 · −0.08em" example="28×"
        sample={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 56, letterSpacing: '-0.08em', lineHeight: 0.85, color: '#f5d82a', textShadow: '0 0 24px rgba(245,216,42,0.4)' }} />
        <Row label="Body" meta="Inter · 400 · 0 · lh 1.45" example="is a skill. Come build it."
        sample={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 15, lineHeight: 1.45, color: '#d1dce8' }} />
        <Row label="Eyebrow Mono" meta="Manifold Extended · 700 · 0.3em · UPPER" example="● SPEAKER DROP / 04"
        sample={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#37bdf8' }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontStyle: 'italic', color: 'rgba(209,220,232,0.55)', borderBottom: 'none', paddingBottom: 0 }}>
          Three fonts: Montserrat (display + UI) · Inter (body) · Manifold Extended (eyebrows / mono — JetBrains Mono is the production stand-in until Manifold ships).
        </div>
      </div>

      {/* PALETTE */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(60,50,40,0.55)', marginBottom: 10 }}>● Palette · exact tokens</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
          { n: 'Deep Onyx', h: '#07121C', r: 'Primary ground' },
          { n: 'Deep Charcoal', h: '#0A0E14', r: 'Raised panel' },
          { n: 'Pure Black', h: '#000000', r: 'Cinematic only' },
          { n: 'Electric Blue', h: '#37BDF8', r: 'Accent / continuity' },
          { n: 'Cyber Yellow', h: '#F5D82A', r: 'Revenue / CTAs' },
          { n: 'Coral', h: '#FF8A5C', r: 'Live / on-air' },
          { n: 'Cream', h: '#F0EEE9', r: 'Print / letterhead' },
          { n: 'Paper White', h: '#FFFFFF', r: 'Sponsor / deck' }].
          map((c, i) => {
            const dark = ['#07121C', '#0A0E14', '#000000'].includes(c.h);
            return (
              <div key={i} style={{ background: c.h, padding: 12, borderRadius: 4, color: dark ? '#fff' : '#07121c', border: '1px solid rgba(0,0,0,0.08)', minHeight: 88, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: '-0.01em' }}>{c.n}</div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', fontWeight: 700 }}>{c.h}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.18em', opacity: 0.7, marginTop: 3, textTransform: 'uppercase' }}>{c.r}</div>
                </div>
              </div>);

          })}
        </div>
      </div>
    </Sheet>);

}

// ───────── Sheet 07 — Variations grid ─────────
function VariationsSheet({ pageNo, total }) {
  const grounds = [
  { name: 'Deep Onyx', bg: '#07121c' },
  { name: 'Pure Black', bg: '#000000' },
  { name: 'Electric Blue', bg: '#37BDF8' },
  { name: 'Cyber Yellow', bg: '#F5D82A' },
  { name: 'Coral', bg: '#FF8A5C' },
  { name: 'Cream', bg: '#F0EEE9' }];

  const pairs = [
  { ais: '#fff', live: '#37BDF8', glow: true, label: 'White · Electric (primary)' },
  { ais: '#fff', live: '#fff', glow: false, label: 'All White' },
  { ais: '#07121C', live: '#07121C', glow: false, label: 'All Black' },
  { ais: '#07121C', live: '#37BDF8', glow: false, label: 'Black · Electric' },
  { ais: '#37BDF8', live: '#07121C', glow: false, label: 'Electric · Black' },
  { ais: '#F5D82A', live: '#07121C', glow: false, label: 'Yellow · Black' },
  { ais: '#07121C', live: '#F5D82A', glow: false, label: 'Black · Yellow' },
  { ais: '#FF8A5C', live: '#07121C', glow: false, label: 'Coral · Black' },
  { ais: '#07121C', live: '#FF8A5C', glow: false, label: 'Black · Coral' }];

  // Per-ground exclusions (specific pair labels not allowed on a given ground)
  const exclude = {
    '#07121c': ['White · Yellow'],
    '#000000': ['White · Yellow'],
    '#f0eee9': ['Coral · Black', 'Black · Coral']
  };
  const contrastOk = (hex, bg) => {
    const h = (c) => parseInt(c.slice(1), 16);
    const lum = (v) => {const r = (v >> 16 & 255) / 255,g = (v >> 8 & 255) / 255,b = (v & 255) / 255;const f = (x) => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);};
    const a = lum(h(hex)),b = lum(h(bg));
    const hi = Math.max(a, b),lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05) >= 2.0;
  };

  return (
    <Sheet pageNo={pageNo} total={total} label="Approved Colorways">
      <Eyebrow>Variations</Eyebrow>
      <h1 className="page-title">Approved <em>colorways.</em></h1>
      <p className="deck" style={{ marginTop: 10 }}>
        Every approved AIS-LIVE colorway against every approved ground. Use this as the picker — <b>if the pair isn't on this sheet, it isn't approved.</b>
      </p>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {grounds.map((g) => {
          const valid = pairs.filter((p) => contrastOk(p.ais, g.bg) && contrastOk(p.live, g.bg) && !(exclude[g.bg.toLowerCase()] || []).includes(p.label));
          const dark = ['#07121c', '#000000', '#0a0e14'].includes(g.bg.toLowerCase());
          return (
            <div key={g.bg}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 11, height: 11, borderRadius: 2, background: g.bg, border: '1px solid rgba(0,0,0,0.15)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 700 }}>{g.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: 'rgba(60,50,40,0.5)' }}>{g.bg}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: 'rgba(60,50,40,0.4)', marginLeft: 'auto' }}>{valid.length} approved pairs</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {valid.slice(0, 5).map((p, i) =>
                <div key={i} style={{ background: g.bg, padding: 10, borderRadius: 3, border: '1px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 64, position: 'relative', overflow: 'hidden' }}>
                    <div data-cmdbg style={{ position: 'absolute', inset: 0, backgroundImage: dark ?
                    'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)' :
                    'linear-gradient(rgba(7,18,28,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(7,18,28,0.04) 1px, transparent 1px)',
                    backgroundSize: '12px 12px', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'baseline', lineHeight: 0.9 }}>
                        <span style={{ color: p.ais }}>AIS</span><span style={{ display: 'inline-block', width: 2 }} />
                        <span style={{ color: p.live, textShadow: p.glow ? `0 0 14px ${p.live}99` : 'none' }}>LIVE</span>
                      </span>
                    </div>
                    <div style={{ position: 'relative', fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(7,18,28,0.55)', lineHeight: 1.3 }}>
                      {p.label}
                    </div>
                  </div>
                )}
              </div>
            </div>);

        })}
      </div>
    </Sheet>);

}

// ───────── Sheet 08 — Surfaces in use ─────────
// 6 curated mocks: poster, billboard, IG square, sponsor slot, press pass, cap embroidery.
function SurfacesSheet({ pageNo, total }) {
  // Poster — 3 days. one room.
  const Poster = () =>
  <div style={{ width: '100%', height: '100%', background: '#FF8A5C', position: 'relative', overflow: 'hidden', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#07121c' }}>
      <div data-cmdbg style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 22px, rgba(7,18,28,0.1) 22px, rgba(7,18,28,0.1) 24px)' }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Eyebrow color="#07121c">AIS presents / 001</Eyebrow>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.2em' }}>№ 001</div>
      </div>
      <div style={{ position: 'relative', fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 44, letterSpacing: '-0.06em', lineHeight: 0.85 }}>THREE<br />DAYS.<br /><span style={{ color: '#fff', textShadow: '1.5px 1.5px 0 #07121c' }}>ONE</span><br />ROOM.</div>
      <div style={{ position: 'relative', borderTop: '1.5px solid #07121c', paddingTop: 6, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <ShiftMark theme="orange" size={14} glow={false} />
      </div>
    </div>;


  // Billboard — austin hero
  const Billboard = () =>
  <div style={{ width: '100%', height: '100%', background: '#07121c', position: 'relative', overflow: 'hidden', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
      <CmdBg op={0.08} />
      <div data-print-hide style={{ position: 'absolute', top: '-1in', right: '-0.4in', width: '3.2in', height: '3.2in', background: '#37bdf8', filter: 'blur(80px)', opacity: 0.28, borderRadius: '50%' }} />
      <div style={{ position: 'relative' }}><Eyebrow color="#FF8A5C">Austin · Sept</Eyebrow></div>
      <div style={{ position: 'relative' }}>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 32, letterSpacing: '-0.05em', lineHeight: 0.88 }}>Real Projects.</div>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 32, letterSpacing: '-0.05em', lineHeight: 0.88, color: '#37bdf8', textShadow: '0 0 24px rgba(55,121,255,0.6)' }}>Real Revenue.</div>
      </div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <ShiftMark theme="dark" size={18} />
        <div style={{ padding: '4px 8px', background: '#f5d82a', color: '#07121c', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 7.5, letterSpacing: '0.2em' }}>AISLIVE.CO</div>
      </div>
    </div>;


  // IG square — countdown
  const IG = () =>
  <div style={{ width: '100%', height: '100%', background: '#07121c', position: 'relative', overflow: 'hidden', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
      <CmdBg />
      <Eyebrow>Countdown</Eyebrow>
      <div style={{ position: 'relative' }}>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 60, letterSpacing: '-0.06em', lineHeight: 0.85 }}>T-28</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 11, color: '#d1dce8', marginTop: 4 }}>days until we're together.</div>
      </div>
      <div style={{ position: 'relative' }}><ShiftMark theme="dark" size={14} /></div>
    </div>;


  // Sponsor slot
  const Sponsor = () =>
  <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', overflow: 'hidden', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#07121c' }}>
      <div data-cmdbg style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(7,18,28,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(7,18,28,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        <Eyebrow color="#37bdf8">Sponsored by</Eyebrow>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, letterSpacing: '0.2em', color: 'rgba(7,18,28,0.5)' }}>PARTNER 01</div>
      </div>
      <div style={{ position: 'relative', fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em', lineHeight: 1.05 }}>The <span style={{ color: '#37bdf8', fontStyle: 'italic' }}>operators'</span> stack, curated.</div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <ShiftMark theme="white" size={14} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, letterSpacing: '0.2em', fontWeight: 700 }}>APPLY &gt;&gt;</div>
      </div>
    </div>;


  // Press pass
  const Press = () =>
  <div style={{ width: '100%', height: '100%', background: '#0a0e14', position: 'relative', overflow: 'hidden', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
      <CmdBg />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        <Eyebrow color="#FF8A5C">Press pass</Eyebrow>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)' }}>#PRS-024</div>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em', lineHeight: 1.05 }}>M. Alvarez</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#d1dce8', marginTop: 2 }}>The Operators Weekly · Press</div>
      </div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ShiftMark theme="dark" size={14} />
        <div style={{ padding: '3px 6px', background: '#FF8A5C', color: '#07121c', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 7, letterSpacing: '0.2em' }}>ALL ACCESS</div>
      </div>
    </div>;


  // Cap / embroidery
  const Cap = () =>
  <div style={{ width: '100%', height: '100%', background: '#07121c', position: 'relative', overflow: 'hidden', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, color: '#fff' }}>
      <CmdBg op={0.05} />
      <div style={{ position: 'relative', width: 70, height: 50, background: '#0a0e14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50% 50% 12px 12px / 100% 100% 12px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', bottom: -6, left: 0, right: 0, height: 8, background: '#0a0e14', borderRadius: '0 0 4px 4px' }} />
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: 11, color: '#FF8A5C', letterSpacing: '-0.02em' }}>AIS LIVE</span>
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: '#FF8A5C' }}>● Embroidery</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600 }}>Coral on charcoal</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.18em', color: 'rgba(209,220,232,0.5)' }}>Min 60mm wide</div>
      </div>
    </div>;


  // Uniform tile heights so the 2×3 grid fits comfortably in one US-letter page.
  // Each row ≈ 2.0in tall × 3 rows = 6.0in, leaving room for header + chrome.
  const items = [
  { name: 'Poster · A3', cap: 'M07 · "Three Days"', C: Poster },
  { name: 'Digital billboard', cap: 'M06 · Hero', C: Billboard },
  { name: 'IG square', cap: 'M01 · Countdown', C: IG },
  { name: 'Sponsor slot', cap: 'M14 · Inverted on white', C: Sponsor },
  { name: 'Press pass', cap: 'PRS-024', C: Press },
  { name: 'Cap · embroidery', cap: 'M32 · Coral on onyx', C: Cap }];


  return (
    <Sheet pageNo={pageNo} total={total} label="Surfaces in Use">
      <Eyebrow>In the wild</Eyebrow>
      <h1 className="page-title">Surfaces, <em>in use.</em></h1>
      <p className="deck" style={{ marginTop: 10 }}>
        Six representative surfaces — the colorway swap is the system's spine. The mark adapts to ground; the type and grid stay constant.
      </p>

      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {items.map((it, i) =>
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: '2in', width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
              <it.C />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink)' }}>{it.name}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.18em', color: 'rgba(60,50,40,0.5)' }}>{it.cap}</div>
            </div>
          </div>
        )}
      </div>
    </Sheet>);

}

// ───────── Sheet 09 — Partnership tiers ─────────
function PartnershipSheet({ pageNo, total }) {
  const tiers = [
  {
    name: 'Title Partner',
    slug: 'TITLE / 01',
    pitch: 'The single named partner of AIS Live. Full co-billing on all surfaces, presenting credit on the keynote, and category exclusivity for the year.',
    surfaces: ['Co-lockup with AIS Live on hero, billboard, and step-and-repeat', 'Stage-front recognition on day one', 'Full-page sponsor slot in the printed program', 'Title credit in press releases and earned-media coverage'],
    asks: '[Investment range] · 1 partner · category-exclusive',
    tone: 'coral'
  },
  {
    name: 'Track Partner',
    slug: 'TRACK / 02',
    pitch: 'Power one of the three tracks (Build · Sell · Ship). Your name attached to a body of work — not a logo wall.',
    surfaces: ['Track-card billing — name on schedule, kiosks, wayfinding', 'Workshop slot inside the track', 'Half-page slot in the printed program', 'Newsletter feature pre-event'],
    asks: '[Investment range] · 3 partners · one per track',
    tone: 'yellow'
  },
  {
    name: 'Crew Partner',
    slug: 'CREW / 03',
    pitch: 'Underwrite a moment — the bonfire, the dinner, the studio sessions. Smaller spend, deeper memory.',
    surfaces: ['Named moment ("Bonfire & Grind, presented by …")', 'Logo on the printed schedule', 'Quote / shoutout from stage', 'Crew swag co-branding'],
    asks: '[Investment range] · up to 6 partners',
    tone: 'blue'
  },
  {
    name: 'Media Partner',
    slug: 'MEDIA / 04',
    pitch: 'Press, podcasts, newsletters. Trade reach for access — first-look interviews, on-record numbers, behind-the-scenes.',
    surfaces: ['Press pass + on-stage interview slot', 'First-look on cohort field reports', 'Co-branded recap ("Issue 24") post-event', 'Logo lockup on press surfaces'],
    asks: 'In-kind · approval-based',
    tone: 'cream'
  }];

  const colorOf = (t) => ({ coral: '#FF8A5C', yellow: '#f5d82a', blue: '#37bdf8', cream: '#f0eee9' })[t];

  return (
    <Sheet kind="charcoal" pageNo={pageNo} total={total} label="Partnership · The Ask">
      <Eyebrow color="#FF8A5C">Partnership · the ask</Eyebrow>
      <h1 className="page-title">How to <em>partner.</em></h1>
      <p className="deck" style={{ marginTop: 10 }}>
        Four ways into the room. Investment ranges and exact deliverables are bracketed and finalized per partner — these tiers are the structural starting point. Custom packages welcome; we'd rather build something specific than sell a template.
      </p>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {tiers.map((t) => {
          const col = colorOf(t.tone);
          return (
            <div key={t.slug} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${col}`, borderTop: `3px solid ${col}`, borderRadius: 6, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>{t.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: col }}>{t.slug}</div>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(209,220,232,0.85)', lineHeight: 1.5 }}>{t.pitch}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(209,220,232,0.5)' }}>● Surfaces / value</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(209,220,232,0.78)', lineHeight: 1.5 }}>
                  {t.surfaces.map((s, i) => <li key={i}>· {s}</li>)}
                </ul>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: col }}>{t.asks}</div>
            </div>);

        })}
      </div>

      <div style={{ marginTop: 18, padding: '12px 14px', background: 'rgba(55,189,248,0.08)', borderLeft: '3px solid #37bdf8', borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: 'rgba(209,220,232,0.85)', lineHeight: 1.5 }}>
        <b style={{ color: '#fff' }}>Note for review:</b> bracketed [investment range] copy is placeholder — replace with your final figures before sending. Surface deliverables are starting points; we expect to adjust per partner conversation.
      </div>
    </Sheet>);

}

// ───────── Sheet 09 — Live Dot variations ─────────
function LiveDotSheet({ pageNo, total }) {
  // Each variation renders the AIS LIVE lockup with a different red-dot integration.
  // The dot is steady (no pulse) — just a soft red glow.
  const dotRed = '#ff3b30';
  const baseMark = { fontFamily: "'Montserrat', sans-serif", fontStyle: 'italic', fontWeight: 900, letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'baseline', lineHeight: 0.9 };
  const dotStyle = (size, scale = 0.16) => ({
    width: size * scale,
    height: size * scale,
    borderRadius: '50%',
    background: dotRed,
    boxShadow: `0 0 ${size * scale * 1.6}px ${dotRed}, 0 0 ${size * scale * 0.6}px ${dotRed}`
  });

  // V1 — Tally light: dot well above the "I" of LIVE, like a broadcast tally lamp
  const V1 = ({ size = 60 }) =>
  <span style={{ ...baseMark, fontSize: size, position: 'relative', paddingTop: size * 0.45 }}>
      <span style={{ color: '#fff' }}>AIS</span>
      <span style={{ display: 'inline-block', width: size * 0.07 }} />
      <span style={{ color: '#37bdf8', position: 'relative' }}>
        L
        <span style={{ position: 'relative', display: 'inline-block' }}>
          I
          <span style={{ ...dotStyle(size, 0.16), position: 'absolute', top: -size * 0.4, left: '50%', transform: 'translateX(-50%)' }} />
        </span>
        VE
      </span>
    </span>;


  // V2 — Tittle on the I: small dot sitting just above the I, kissing its top
  const V2 = ({ size = 60 }) =>
  <span style={{ ...baseMark, fontSize: size, position: 'relative', paddingTop: size * 0.22 }}>
      <span style={{ color: '#fff' }}>AIS</span>
      <span style={{ display: 'inline-block', width: size * 0.07 }} />
      <span style={{ color: '#37bdf8', position: 'relative' }}>
        L
        <span style={{ position: 'relative', display: 'inline-block' }}>
          I
          <span style={{ ...dotStyle(size, 0.16), position: 'absolute', top: -size * 0.18, left: '50%', transform: 'translateX(-50%)' }} />
        </span>
        VE
      </span>
    </span>;


  // V3 — Leading bullet, tucked close to AIS
  const V3 = ({ size = 60 }) =>
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.08 }}>
      <span style={dotStyle(size, 0.22)} />
      <span style={{ ...baseMark, fontSize: size }}>
        <span style={{ color: '#fff' }}>AIS</span>
        <span style={{ display: 'inline-block', width: size * 0.07 }} />
        <span style={{ color: '#37bdf8' }}>LIVE</span>
      </span>
    </span>;


  // V4 — Top-right corner: dot sits to the RIGHT of the E with breathing room.
  // Dot's TOP aligns with the top of the E (cap-height) — it lives below that line, not above.
  // Italic compensation: position relative to the E's slanted right edge.
  const V4 = ({ size = 60 }) =>
  <span style={{ ...baseMark, fontSize: size, position: 'relative', paddingRight: size * 0.42 }}>
      <span style={{ color: '#fff' }}>AIS</span>
      <span style={{ display: 'inline-block', width: size * 0.07 }} />
      <span style={{ color: '#37bdf8', position: 'relative' }}>
        LIVE
        <span style={{ ...dotStyle(size, 0.16), position: 'absolute', top: size * 0.05, left: '100%', marginLeft: size * 0.18, margin: "2px 0px 0px 11px" }} />
      </span>
    </span>;


  const variants = [
  { v: V1, name: 'Tally Light', desc: 'Dot floats well above the "I" — a broadcast tally lamp. Reads as on-air at any size.' },
  { v: V2, name: 'Tittle on the I', desc: 'A red tittle sitting just above the "I". Typographic, integrated, quiet.' },
  { v: V3, name: 'Leading Bullet', desc: '"● AIS LIVE" — dot tucked tight against AIS like a chyron indicator.' },
  { v: V4, name: 'Top-Right Corner', desc: 'Dot sits flush to the right of the "E", aligned with its top. Reads as a status pin.' }];


  return (
    <Sheet pageNo={pageNo} total={total} label="Live Dot · Variations">
      <Eyebrow>Virtual event indicator</Eyebrow>
      <h1 className="page-title">Live dot, <em>four ways.</em></h1>
      <p className="deck" style={{ marginTop: 12 }}>
        AIS Live is a 2-day virtual event — the lockup should signal that. Four ways to integrate a steady red live-indicator into the mark. The dot glows softly; it does not pulse.
      </p>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {variants.map((vr, i) =>
        <div key={i} style={{ background: '#07121c', borderRadius: 6, padding: 18, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14, minHeight: '1.7in', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: '#ff3b30' }}>● V{String(i + 1).padStart(2, '0')} · {vr.name}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
              <vr.v size={56} />
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: 'rgba(209,220,232,0.7)', lineHeight: 1.45, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>{vr.desc}</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(255,59,48,0.08)', borderLeft: '3px solid #ff3b30', borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: 'var(--ink)', lineHeight: 1.5 }}>
        <b>Recommendation.</b> V01 (Tally Light) for hero surfaces — broadcast vocabulary at any size. V02 (Tittle on the I) when the lockup needs to feel like a single typographic unit. V03 (Leading Bullet) for streaming chyrons. V04 (Top-Right Corner) for app icons and small status pins.
      </div>
    </Sheet>);

}

// ───────── Sheet 10 — Contacts + back cover ─────────
function ContactSheet({ pageNo, total }) {
  const team = [
  { name: 'Nate Herk', role: 'Founder & CEO', email: 'nate@uppitai.com', tone: '#37bdf8' },
  { name: 'Nate Herk', role: 'Chief Operating Officer', email: 'nate@uppitai.com', tone: '#f5d82a' },
  { name: 'Nate Herk', role: 'Director of Events', email: 'nate@uppitai.com', tone: '#FF8A5C' }];

  return (
    <Sheet kind="dark" pageNo={pageNo} total={total} label="Contact">
      <CmdBg op={0.06} />
      <div data-print-hide style={{ position: 'absolute', bottom: '-1.2in', right: '-1in', width: '4.5in', height: '4.5in', background: '#37bdf8', filter: 'blur(120px)', opacity: 0.18, borderRadius: '50%' }} />

      <div style={{ position: 'relative', minHeight: '9.4in', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Eyebrow color="#FF8A5C">Talk to us</Eyebrow>
          <h1 className="page-title" style={{ color: '#fff' }}>Let's <em>build something.</em></h1>
          <p className="deck" style={{ marginTop: 14, maxWidth: '5.5in' }}>
            Three ways into the conversation. Reply directly — we read every email and answer in days, not weeks. Bring a specific idea if you have one; bring a category if you don't.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 32 }}>
          {team.map((p, i) =>
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${p.tone}`, borderTop: `3px solid ${p.tone}`, borderRadius: 6, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: p.tone }}>● Crew</div>
              <div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.1 }}>{p.name}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(209,220,232,0.75)', marginTop: 4 }}>{p.role}</div>
              </div>
              <div style={{ marginTop: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '0.06em', color: '#fff', fontWeight: 700, wordBreak: 'break-all' }}>{p.email}</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 32, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18 }}>
            <div>
              <ShiftMark theme="dark" size={48} />
              <div style={{ marginTop: 10, fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 16, letterSpacing: '-0.02em', color: '#fff' }}>
                Real Projects.&nbsp; <span style={{ fontStyle: 'italic', color: '#37bdf8' }}>Real Revenue.</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(209,220,232,0.5)' }}>Confidential — partnership review only</div>
            </div>
          </div>
        </div>
      </div>
    </Sheet>);

}

// ───────── App ─────────
function App() {
  const sheets = [
  CoverSheet,
  IntroSheet,
  MarkSheet,
  ClearSpaceSheet,
  DoDontSheet,
  TypePaletteSheet,
  VariationsSheet,
  SurfacesSheet,
  ContactSheet];

  const total = sheets.length;
  return (
    <div>
      {sheets.map((S, i) => <S key={i} pageNo={i + 1} total={total} />)}
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);