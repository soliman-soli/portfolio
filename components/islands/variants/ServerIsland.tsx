/**
 * ServerIsland.tsx
 *
 * SVG LAYER ORDER (bottom to top):
 *   1. Rocky underside — 3 stacked narrowing polygons (dark emerald)
 *   2. Left slab face   — dark emerald trapezoid
 *   3. Right slab face  — ivory/paper trapezoid with brass edge line
 *   4. Top slab face    — emerald rhombus (2:1 iso ratio)
 *   5. Server rack units (2-3 stacked boxes with 3-face shading)
 *   6. Cables (curved paths, dark ink)
 *   7. LEDs (small circles in brass)
 *   8. Extras: tiny tree blob, floating pebbles, brass sparkle
 *
 * Isometric geometry notes:
 *   ViewBox: 0 0 240 240
 *   Island top rhombus: 120,50 → 200,90 → 120,130 → 40,90
 *   Slab thickness: 20px vertical
 *   Left face:  40,90 → 120,130 → 120,150 → 40,110
 *   Right face: 200,90 → 120,130 → 120,150 → 200,110
 */
export default function ServerIsland() {
  return (
    <svg
      className="island-svg"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Top face gradient: subtle lighter tint at the centre */}
        <linearGradient id="srv-top" x1="120" y1="50" x2="120" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--emerald-surface)" />
          <stop offset="100%" stopColor="var(--emerald)" />
        </linearGradient>
        {/* Underside: very dark emerald */}
        <linearGradient id="srv-under" x1="120" y1="150" x2="120" y2="195" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--emerald-deep)" />
          <stop offset="100%" stopColor="var(--emerald-deep)" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* ── Rocky underside ────────────────────────────────────── */}
      {/* Layer 1 (widest) */}
      <polygon points="50,148 120,180 190,148 120,134" fill="var(--emerald-deep)" opacity="0.9" />
      {/* Layer 2 */}
      <polygon points="65,163 120,190 175,163 120,150" fill="var(--emerald-deep)" opacity="0.75" />
      {/* Layer 3 (tip) */}
      <polygon points="84,177 120,197 156,177 120,165" fill="var(--emerald-deep)" opacity="0.55" />

      {/* ── Slab left face ─────────────────────────────────────── */}
      <polygon
        points="40,90 120,130 120,152 40,112"
        fill="var(--emerald-deep)"
      />

      {/* ── Slab right face ────────────────────────────────────── */}
      <polygon
        points="200,90 120,130 120,152 200,112"
        fill="var(--paper)"
        opacity="0.85"
      />
      {/* Brass edge line on right face */}
      <line x1="200" y1="90" x2="200" y2="112" stroke="var(--brass)" strokeWidth="1" opacity="0.7" />
      <line x1="200" y1="112" x2="120" y2="152" stroke="var(--brass)" strokeWidth="0.5" opacity="0.4" />

      {/* ── Top slab face ──────────────────────────────────────── */}
      <polygon
        points="120,50 200,90 120,130 40,90"
        fill="url(#srv-top)"
      />
      {/* Hairline edges on top */}
      <polygon points="120,50 200,90 120,130 40,90" fill="none" stroke="var(--brass)" strokeWidth="0.5" opacity="0.3" />

      {/* ── Server rack props ──────────────────────────────────── */}
      {/*
        Each rack unit is an isometric box centred on the top face.
        Rack unit iso geometry: top rhombus + left face + right face.
        Rack unit 1 (bottom rack)
      */}
      {/* Rack 1 — top */}
      <polygon points="120,72 154,88 120,104 86,88" fill="var(--emerald-surface)" />
      {/* Rack 1 — left face */}
      <polygon points="86,88 120,104 120,114 86,98" fill="var(--emerald-deep)" />
      {/* Rack 1 — right face */}
      <polygon points="154,88 120,104 120,114 154,98" fill="var(--paper)" opacity="0.7" />
      {/* Rack 1 — front panel detail (right face): thin horizontal lines */}
      <line x1="122" y1="106" x2="152" y2="92" stroke="var(--brass-soft)" strokeWidth="0.5" opacity="0.5" />
      <line x1="122" y1="109" x2="152" y2="95" stroke="var(--brass-soft)" strokeWidth="0.5" opacity="0.4" />

      {/* Rack 2 — top */}
      <polygon points="120,60 154,76 120,92 86,76" fill="var(--emerald-surface)" opacity="0.95" />
      {/* Rack 2 — left face */}
      <polygon points="86,76 120,92 120,102 86,86" fill="var(--emerald-deep)" />
      {/* Rack 2 — right face */}
      <polygon points="154,76 120,92 120,102 154,86" fill="var(--paper)" opacity="0.7" />
      <line x1="122" y1="94" x2="152" y2="80" stroke="var(--brass-soft)" strokeWidth="0.5" opacity="0.5" />

      {/* Rack 3 (top) */}
      <polygon points="120,50 154,66 120,82 86,66" fill="var(--emerald-surface)" opacity="0.9" />
      <polygon points="86,66 120,82 120,90 86,74" fill="var(--emerald-deep)" />
      <polygon points="154,66 120,82 120,90 154,74" fill="var(--paper)" opacity="0.65" />

      {/* ── LEDs ──────────────────────────────────────────────── */}
      {/* LED on rack 1 right face */}
      <circle className="led-1" cx="148" cy="91" r="2" fill="var(--brass)" />
      {/* LED on rack 2 right face */}
      <circle className="led-2" cx="148" cy="79" r="2" fill="var(--brass)" />
      {/* LED on rack 3 right face */}
      <circle className="led-3" cx="148" cy="68" r="2" fill="var(--brass)" />

      {/* ── Cables ─────────────────────────────────────────────── */}
      {/* Cable 1: curls off left edge of rack 1 */}
      <path
        className="cable"
        d="M86,93 Q70,100 65,115"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
        strokeDasharray="4 4"
      />
      {/* Cable 2: curls off right edge of rack 3 */}
      <path
        className="cable"
        d="M154,71 Q168,80 172,96"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
        strokeDasharray="4 4"
        style={{ animationDelay: '0.4s' }}
      />

      {/* ── Extras ─────────────────────────────────────────────── */}
      {/* Tiny tree blob (left of island) */}
      <ellipse cx="68" cy="85" rx="7" ry="5" fill="var(--emerald)" opacity="0.9" />
      <ellipse cx="68" cy="81" rx="5" ry="4" fill="var(--emerald-surface)" opacity="0.8" />
      <line x1="68" y1="90" x2="68" y2="93" stroke="var(--emerald-deep)" strokeWidth="1.5" />

      {/* Floating pebble 1 */}
      <ellipse cx="172" cy="82" rx="4" ry="2.5" fill="var(--brass-soft)" opacity="0.5" />
      {/* Floating pebble 2 */}
      <ellipse cx="58" cy="112" rx="3" ry="2" fill="var(--brass-soft)" opacity="0.4" />

      {/* Brass sparkle (4-point star) */}
      <g className="sparkle" style={{ transformOrigin: '185px 75px' }}>
        <line x1="185" y1="70" x2="185" y2="80" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="180" y1="75" x2="190" y2="75" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="182" y1="72" x2="188" y2="78" stroke="var(--brass)" strokeWidth="0.75" strokeLinecap="round" opacity="0.5" />
        <line x1="188" y1="72" x2="182" y2="78" stroke="var(--brass)" strokeWidth="0.75" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  )
}
