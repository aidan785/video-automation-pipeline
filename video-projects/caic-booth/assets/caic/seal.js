/* =============================================================
   AIS Certified — Seal generator
   A data-driven SVG "chassis" for the credential badge family.
   LOCKED: geometry, double ring, emblem (hexagon + ascent mark),
           top arc text "AIS · CERTIFIED", color system.
   SWAPS : bottom arc designation, abbreviation chip, tier ring
           treatment, specialty suffix pip, org framing.
   ============================================================= */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  let UID = 0;

  // polar helper around a center
  function P(cx, cy, r, deg) {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function hexPath(cx, cy, r) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const [x, y] = P(cx, cy, r, i * 60);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return 'M' + pts.join(' L') + ' Z';
  }

  // build the constant emblem: hexagon + ascent chevron + AIS mark
  // (placeholder lockup until the final logo is supplied)
  function emblem(cx, cy, scale) {
    const r = 30 * scale;
    const hx = hexPath(cx, cy, r);
    const hx2 = hexPath(cx, cy, r - 5 * scale);
    const apexY = cy - 15 * scale;
    const baseY = cy - 6 * scale;
    const w = 8 * scale;
    return `
      <path d="${hx}" fill="none" stroke="var(--accent)" stroke-width="${1.4}" opacity="0.55"/>
      <path d="${hx2}" fill="none" stroke="var(--accent)" stroke-width="${0.8}" opacity="0.3"/>
      <text x="${cx - 18 * scale * 0.06}" y="${cy + 6 * scale}" text-anchor="middle" font-family="var(--font-sans)"
            font-style="italic" font-weight="700" font-size="${18 * scale}"
            letter-spacing="-0.02em" fill="var(--fg)">AIS</text>`;
  }

  // tick bezel between two radii
  function ticks(cx, cy, rIn, rOut, count, weight, op) {
    let s = '';
    for (let i = 0; i < count; i++) {
      const deg = (360 / count) * i;
      const [x1, y1] = P(cx, cy, rIn, deg);
      const [x2, y2] = P(cx, cy, rOut, deg);
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--accent)" stroke-width="${weight}" opacity="${op}"/>`;
    }
    return s;
  }

  function diamond(cx, cy, r) {
    return `<path d="M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z" fill="var(--accent)"/>`;
  }

  /* opts:
     top      (default 'AIS  ·  CERTIFIED')
     bottom   designation text  (swaps)
     abbr     short code chip   (swaps)
     tier     'consultant' | 'operator' | 'company'
     suffix   e.g. '+ EE'  (optional specialty pip)
     state    'active' | 'lapsed'  (default active)
  */
  function build(opts) {
    opts = opts || {};
    const uid = 'sl' + (UID++);
    const cx = 130, cy = 130;
    const top = opts.top || 'AIS \u00B7 CERTIFIED \u00B7 PROFESSIONAL CREDENTIAL';
    const bottom = (opts.bottom || 'CERTIFIED AI CONSULTANT').toUpperCase();
    const abbr = opts.abbr || 'CAIC';
    const tier = opts.tier || 'consultant';
    const lapsed = opts.state === 'lapsed';

    // arc text paths — sit centered in the band between inner ring (~110) and
    // emblem ring (~84). Top glyphs grow outward, bottom glyphs grow inward,
    // so the two baselines differ to keep both bands centered (~r97).
    const arcTop = `M ${cx - 93} ${cy} A 93 93 0 0 1 ${cx + 93} ${cy}`;
    const arcBot = `M ${cx - 101} ${cy} A 101 101 0 0 0 ${cx + 101} ${cy}`;

    let rings = '';
    if (tier === 'operator') {
      // entry tier reads lighter: single ring + fine inner ring
      rings += `<circle cx="${cx}" cy="${cy}" r="116" fill="none" stroke="var(--accent)" stroke-width="1.4" opacity="0.85"/>`;
      rings += `<circle cx="${cx}" cy="${cy}" r="84" fill="none" stroke="var(--accent)" stroke-width="0.8" opacity="0.45"/>`;
      rings += ticks(cx, cy, 108, 113, 36, 1, 0.35);
    } else {
      // consultant + company: full double ring + 60-tick compass bezel
      rings += `<circle cx="${cx}" cy="${cy}" r="120" fill="none" stroke="var(--accent)" stroke-width="1.6" opacity="0.9"/>`;
      rings += `<circle cx="${cx}" cy="${cy}" r="110" fill="none" stroke="var(--accent)" stroke-width="0.8" opacity="0.5"/>`;
      rings += ticks(cx, cy, 110, 119, 60, 0.9, 0.4);
      rings += `<circle cx="${cx}" cy="${cy}" r="84" fill="none" stroke="var(--accent)" stroke-width="1" opacity="0.5"/>`;
      rings += `<circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="var(--accent)" stroke-width="0.6" opacity="0.3"/>`;
    }

    // organizational framing: 4 corner registration brackets
    let corners = '';
    if (tier === 'company') {
      const m = 8, L = 26, F = 252;
      const br = (x, y, dx, dy) =>
        `<path d="M ${x} ${y + dy * L} L ${x} ${y} L ${x + dx * L} ${y}" fill="none" stroke="var(--accent)" stroke-width="1.4" opacity="0.7"/>`;
      corners =
        br(m, m, 1, 1) + br(F - m, m, -1, 1) + br(m, F - m, 1, -1) + br(F - m, F - m, -1, -1);
    }

    // specialty suffix pip (attaches lower-right, reads "leveled up")
    let pip = '';
    if (opts.suffix) {
      const px = cx + 78, py = cy + 78, pr = 34;
      pip = `
        <circle cx="${px}" cy="${py}" r="${pr + 4}" fill="var(--bg)" stroke="var(--bg)" stroke-width="6"/>
        <circle cx="${px}" cy="${py}" r="${pr}" fill="var(--accent-10)" stroke="var(--accent)" stroke-width="1.6"/>
        <circle cx="${px}" cy="${py}" r="${pr - 6}" fill="none" stroke="var(--accent)" stroke-width="0.7" opacity="0.5"/>
        <text x="${px}" y="${py - 4}" text-anchor="middle" font-family="var(--font-mono)" font-weight="700" font-size="20" fill="var(--accent)">${opts.suffix.replace('+', '').trim()}</text>
        <text x="${px}" y="${py + 11}" text-anchor="middle" font-family="var(--font-mono)" font-size="7" letter-spacing="0.15em" fill="var(--fg-quiet)">SPECIALTY</text>`;
    }

    const dim = lapsed ? ' style="opacity:0.4;filter:saturate(0.3)"' : '';

    return `
<svg viewBox="0 0 260 260" width="100%" height="100%" class="seal-svg" role="img" aria-label="${bottom} seal"${dim}>
  <defs>
    <path id="${uid}-t" d="${arcTop}"/>
    <path id="${uid}-b" d="${arcBot}"/>
  </defs>
  ${corners}
  ${rings}
  <!-- arc text -->
  <text font-family="var(--font-mono)" font-size="10" font-weight="500" letter-spacing="0.16em" fill="var(--fg-muted)">
    <textPath href="#${uid}-t" startOffset="50%" text-anchor="middle">${top}</textPath>
  </text>
  <text font-family="var(--font-mono)" font-size="10.5" font-weight="700" letter-spacing="0.12em" fill="var(--accent)">
    <textPath href="#${uid}-b" startOffset="50%" text-anchor="middle">${bottom}</textPath>
  </text>
  <!-- locked emblem -->
  ${emblem(cx, cy - 14, 1)}
  <!-- swap: divider + abbreviation chip -->
  <line x1="${cx - 34}" y1="${cy + 28}" x2="${cx + 34}" y2="${cy + 28}" stroke="var(--accent)" stroke-width="0.8" opacity="0.5"/>
  <text x="${cx}" y="${cy + 50}" text-anchor="middle" font-family="var(--font-sans)" font-weight="700" font-size="22" letter-spacing="0.06em" fill="var(--fg)">${abbr}</text>
  <text x="${cx}" y="${cy + 64}" text-anchor="middle" font-family="var(--font-mono)" font-size="7" letter-spacing="0.28em" fill="var(--fg-quiet)">DESIGNATION</text>
  ${pip}
</svg>`;
  }

  window.AISseal = { build };
})();
