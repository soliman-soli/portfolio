/**
 * AutomationIsland.tsx
 *
 * SVG LAYER ORDER (bottom to top):
 *   1. Rocky underside
 *   2. Left slab face
 *   3. Right slab face (paper, brass edge)
 *   4. Top slab face (emerald)
 *   5. Two interlocking gears (main large, secondary small)
 *   6. Conveyor belt / pipeline with arrow chevrons
 *   7. Extras: small bush, pebbles, sparkle
 *
 * Gear rendering: each gear is a polygon approximating teeth,
 * rendered with a filled circle for the body and spokes/teeth
 * as trapezoidal polygon segments around the circumference.
 */
export default function AutomationIsland() {
  // Build gear teeth as small rectangles radiating outward
  const gearTeeth = (cx: number, cy: number, r: number, teethR: number, teeth: number, angle = 0) => {
    const paths: string[] = []
    for (let i = 0; i < teeth; i++) {
      const a = ((Math.PI * 2) / teeth) * i + angle
      const x1 = cx + r * Math.cos(a - 0.2)
      const y1 = cy + r * Math.sin(a - 0.2)
      const x2 = cx + r * Math.cos(a + 0.2)
      const y2 = cy + r * Math.sin(a + 0.2)
      const x3 = cx + teethR * Math.cos(a + 0.2)
      const y3 = cy + teethR * Math.sin(a + 0.2)
      const x4 = cx + teethR * Math.cos(a - 0.2)
      const y4 = cy + teethR * Math.sin(a - 0.2)
      paths.push(`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4}Z`)
    }
    return paths.join(' ')
  }

  return (
    <svg
      className="island-svg"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="auto-top" x1="120" y1="50" x2="120" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--emerald-surface)" />
          <stop offset="100%" stopColor="var(--emerald)" />
        </linearGradient>
        <clipPath id="conveyor-clip">
          <rect x="78" y="100" width="84" height="18" />
        </clipPath>
      </defs>

      {/* ── Rocky underside ─────────────────────────────────────── */}
      <polygon points="50,148 120,180 190,148 120,134" fill="var(--emerald-deep)" opacity="0.9" />
      <polygon points="65,163 120,190 175,163 120,150" fill="var(--emerald-deep)" opacity="0.75" />
      <polygon points="84,177 120,197 156,177 120,165" fill="var(--emerald-deep)" opacity="0.55" />

      {/* ── Slab faces ──────────────────────────────────────────── */}
      <polygon points="40,90 120,130 120,152 40,112" fill="var(--emerald-deep)" />
      <polygon points="200,90 120,130 120,152 200,112" fill="var(--paper)" opacity="0.85" />
      <line x1="200" y1="90" x2="200" y2="112" stroke="var(--brass)" strokeWidth="1" opacity="0.7" />
      <polygon points="120,50 200,90 120,130 40,90" fill="url(#auto-top)" />
      <polygon points="120,50 200,90 120,130 40,90" fill="none" stroke="var(--brass)" strokeWidth="0.5" opacity="0.3" />

      {/* ── Large gear (main) — centre-left of top face ─────────── */}
      <g className="gear-main" style={{ transformOrigin: '102px 88px' }}>
        {/* Gear body */}
        <circle cx="102" cy="88" r="16" fill="var(--emerald-surface)" stroke="var(--brass)" strokeWidth="1" />
        <circle cx="102" cy="88" r="6" fill="var(--emerald-deep)" stroke="var(--brass)" strokeWidth="0.75" />
        {/* Gear teeth */}
        <path d={gearTeeth(102, 88, 16, 22, 8)} fill="var(--emerald-surface)" stroke="var(--brass)" strokeWidth="0.75" />
        {/* Cross spokes */}
        <line x1="102" y1="72" x2="102" y2="104" stroke="var(--brass)" strokeWidth="0.75" opacity="0.4" />
        <line x1="86" y1="88" x2="118" y2="88" stroke="var(--brass)" strokeWidth="0.75" opacity="0.4" />
      </g>

      {/* ── Small gear (secondary) — meshes with main ────────────── */}
      <g className="gear-small" style={{ transformOrigin: '128px 72px' }}>
        <circle cx="128" cy="72" r="10" fill="var(--emerald)" stroke="var(--brass)" strokeWidth="1" />
        <circle cx="128" cy="72" r="4" fill="var(--emerald-deep)" stroke="var(--brass)" strokeWidth="0.75" />
        <path d={gearTeeth(128, 72, 10, 14, 6, 0.3)} fill="var(--emerald)" stroke="var(--brass)" strokeWidth="0.75" />
      </g>

      {/* ── Conveyor pipeline ────────────────────────────────────── */}
      {/* Belt track */}
      <rect x="80" y="102" width="80" height="14" rx="7" fill="var(--emerald-deep)" opacity="0.8" stroke="var(--brass)" strokeWidth="0.75" />
      {/* Chevrons (clipped to belt) */}
      <g className="chevron-track" clipPath="url(#conveyor-clip)">
        {[0, 16, 32, 48, 64, 80].map((offset) => (
          <g key={offset} transform={`translate(${84 + offset}, 109)`}>
            <polyline points="-4,0 0,-4 4,0" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
          </g>
        ))}
      </g>
      {/* Pulleys at each end */}
      <circle cx="87" cy="109" r="7" fill="var(--emerald)" stroke="var(--brass)" strokeWidth="0.75" />
      <circle cx="153" cy="109" r="7" fill="var(--emerald)" stroke="var(--brass)" strokeWidth="0.75" />

      {/* ── Extras ──────────────────────────────────────────────── */}
      {/* Bush left */}
      <ellipse cx="60" cy="100" rx="8" ry="5" fill="var(--emerald)" opacity="0.85" />
      <ellipse cx="60" cy="96" rx="6" ry="4" fill="var(--emerald-surface)" opacity="0.8" />
      <line x1="60" y1="105" x2="60" y2="109" stroke="var(--emerald-deep)" strokeWidth="1.5" />

      {/* Pebbles */}
      <ellipse cx="173" cy="97" rx="4" ry="2.5" fill="var(--brass-soft)" opacity="0.5" />
      <ellipse cx="58" cy="115" rx="3" ry="2" fill="var(--brass-soft)" opacity="0.4" />

      {/* Sparkle */}
      <g className="sparkle" style={{ transformOrigin: '170px 75px' }}>
        <line x1="170" y1="70" x2="170" y2="80" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="165" y1="75" x2="175" y2="75" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="167" y1="72" x2="173" y2="78" stroke="var(--brass)" strokeWidth="0.75" strokeLinecap="round" opacity="0.5" />
        <line x1="173" y1="72" x2="167" y2="78" stroke="var(--brass)" strokeWidth="0.75" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  )
}
