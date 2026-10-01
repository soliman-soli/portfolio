/**
 * DesktopIsland.tsx
 *
 * SVG LAYER ORDER (bottom to top):
 *   1. Rocky underside
 *   2. Left / right slab faces
 *   3. Top slab face
 *   4. Monitor body (isometric box: top rhombus + left + right faces)
 *   5. Screen face (right face of monitor — shows dashboard)
 *   6. Dashboard: 3 bars + line chart squiggle
 *   7. Keyboard (thin flat iso slab in front of monitor)
 *   8. Plant, pebbles, sparkle
 */
export default function DesktopIsland() {
  return (
    <svg
      className="island-svg"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="desk-top" x1="120" y1="50" x2="120" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--emerald-surface)" />
          <stop offset="100%" stopColor="var(--emerald)" />
        </linearGradient>
      </defs>

      {/* ── Rocky underside ─────────────────────────────────────── */}
      <polygon points="50,148 120,180 190,148 120,134" fill="var(--emerald-deep)" opacity="0.9" />
      <polygon points="65,163 120,190 175,163 120,150" fill="var(--emerald-deep)" opacity="0.75" />
      <polygon points="84,177 120,197 156,177 120,165" fill="var(--emerald-deep)" opacity="0.55" />

      {/* ── Slab faces ──────────────────────────────────────────── */}
      <polygon points="40,90 120,130 120,152 40,112" fill="var(--emerald-deep)" />
      <polygon points="200,90 120,130 120,152 200,112" fill="var(--paper)" opacity="0.85" />
      <line x1="200" y1="90" x2="200" y2="112" stroke="var(--brass)" strokeWidth="1" opacity="0.7" />
      <polygon points="120,50 200,90 120,130 40,90" fill="url(#desk-top)" />
      <polygon points="120,50 200,90 120,130 40,90" fill="none" stroke="var(--brass)" strokeWidth="0.5" opacity="0.3" />

      {/* ── Monitor body ─────────────────────────────────────────── */}
      {/*
        The monitor is a tall-ish box positioned centre-right on the island top.
        Isometric box: top rhombus, left face (dark), right/screen face (lit).
        Monitor geometry (smaller, cleaner proportions):
          Top:   90,68  132,88  118,96  76,76
          Left:  76,76  118,96  118,116 76,96
          Screen:132,88 118,96  118,116 132,108
      */}

      {/* Monitor top face */}
      <polygon points="90,68 132,88 118,96 76,76" fill="var(--ink)" opacity="0.55" />

      {/* Monitor left face (dark side) */}
      <polygon points="76,76 118,96 118,118 76,98" fill="var(--emerald-deep)" opacity="0.85" />

      {/* Monitor screen face (right / front face — this is the visible screen) */}
      <polygon points="132,88 118,96 118,118 132,110" fill="#0d1e17" stroke="var(--brass)" strokeWidth="0.75" />

      {/* Screen bezel highlight */}
      <polygon points="132,88 118,96 118,118 132,110" fill="none" stroke="var(--brass-soft)" strokeWidth="0.5" opacity="0.4" />

      {/* ── Dashboard on screen ───────────────────────────────────── */}
      {/* Bar chart — 3 bars */}
      <rect className="bar-1" x="120.5" y="102" width="3" height="12" fill="var(--brass)" opacity="0.95" />
      <rect className="bar-2" x="124.5" y="100" width="3" height="14" fill="var(--emerald-surface)" opacity="0.95" />
      <rect className="bar-3" x="128.5" y="104" width="3" height="10" fill="var(--brass-soft)" opacity="0.9" />

      {/* Bar base line */}
      <line x1="120" y1="114" x2="132" y2="114" stroke="var(--brass-soft)" strokeWidth="0.5" opacity="0.7" />

      {/* Line chart — top portion of screen */}
      <polyline
        className="chart-line"
        points="120,99 122,97 124,98 126,95 128,96 130,94"
        stroke="var(--brass)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="80"
        strokeDashoffset="80"
        opacity="0.9"
      />

      {/* Tiny status dots at bottom of screen */}
      <circle cx="122" cy="116" r="1.2" fill="var(--brass)" opacity="0.7" />
      <circle cx="126" cy="116" r="1.2" fill="var(--emerald-surface)" opacity="0.7" />
      <circle cx="130" cy="116" r="1.2" fill="var(--brass-soft)" opacity="0.7" />

      {/* ── Monitor stand ────────────────────────────────────────── */}
      {/* Thin neck */}
      <line x1="125" y1="118" x2="123" y2="126" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Base slab */}
      <polygon points="118,126 128,131 130,128 120,123" fill="var(--ink)" opacity="0.35" />

      {/* ── Keyboard (flat iso slab) ─────────────────────────────── */}
      {/* Keyboard top */}
      <polygon points="86,114 108,124 102,128 80,118" fill="var(--paper)" opacity="0.82" stroke="var(--brass-soft)" strokeWidth="0.5" />
      {/* Keyboard front edge */}
      <polygon points="80,118 102,128 102,132 80,122" fill="var(--brass-soft)" opacity="0.25" />
      {/* Key rows */}
      <line x1="84" y1="117" x2="106" y2="126" stroke="var(--brass-soft)" strokeWidth="0.5" opacity="0.55" />
      <line x1="83" y1="120" x2="105" y2="129" stroke="var(--brass-soft)" strokeWidth="0.5" opacity="0.4" />

      {/* ── Extras ──────────────────────────────────────────────── */}
      {/* Plant right side */}
      <ellipse cx="162" cy="112" rx="7" ry="4.5" fill="var(--emerald)" opacity="0.85" />
      <ellipse cx="162" cy="109" rx="5" ry="3.5" fill="var(--emerald-surface)" opacity="0.8" />
      <line x1="162" y1="116" x2="162" y2="121" stroke="var(--emerald-deep)" strokeWidth="1.5" />

      {/* Pebbles */}
      <ellipse cx="62" cy="100" rx="4" ry="2.5" fill="var(--brass-soft)" opacity="0.4" />
      <ellipse cx="182" cy="120" rx="3" ry="2" fill="var(--brass-soft)" opacity="0.35" />

      {/* Sparkle */}
      <g className="sparkle" style={{ transformOrigin: '174px 70px' }}>
        <line x1="174" y1="65" x2="174" y2="75" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="169" y1="70" x2="179" y2="70" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="171" y1="67" x2="177" y2="73" stroke="var(--brass)" strokeWidth="0.75" strokeLinecap="round" opacity="0.5" />
        <line x1="177" y1="67" x2="171" y2="73" stroke="var(--brass)" strokeWidth="0.75" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  )
}
