/**
 * BlueprintIsland.tsx
 *
 * "The Architect's Study" — Clean, Minimal, Polished Architectural Island.
 *
 * Designed to strictly match the visual weight and elegance of ServerIsland
 * and DesktopIsland (one central iconic isometric subject, no clutter).
 *
 * SVG LAYER ORDER:
 *   1. Rocky underside (3 narrowing emerald polygon tiers)
 *   2. Slab faces (left shaded emerald, right lit paper with brass trim)
 *   3. Top slab face (emerald gradient)
 *   4. Cast ground shadow under desk
 *   5. Architectural drafting desk (trestle legs + 3D isometric drawing board)
 *   6. Blueprint sheet (deep architectural cyan with 2:1 isometric floor plan)
 *   7. Brass T-Square along desk edge
 *   8. Extras (minimalist topiary plant, two pebbles, rotating brass sparkle)
 */
export default function BlueprintIsland() {
  return (
    <svg
      className="island-svg"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Top slab surface gradient */}
        <linearGradient id="bp-top" x1="120" y1="50" x2="120" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#226e55" />
          <stop offset="100%" stopColor="#0F4C3A" />
        </linearGradient>

        {/* Vibrant architectural blueprint sheet */}
        <linearGradient id="bp-cyan" x1="90" y1="65" x2="150" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e517b" />
          <stop offset="100%" stopColor="#133654" />
        </linearGradient>
      </defs>

      {/* ── 1. Rocky underside ───────────────────────────────────── */}
      <polygon points="50,148 120,180 190,148 120,134" fill="var(--emerald-deep)" opacity="0.9" />
      <polygon points="65,163 120,190 175,163 120,150" fill="var(--emerald-deep)" opacity="0.75" />
      <polygon points="84,177 120,197 156,177 120,165" fill="var(--emerald-deep)" opacity="0.55" />

      {/* ── 2. Slab faces ────────────────────────────────────────── */}
      {/* Left face */}
      <polygon points="40,90 120,130 120,152 40,112" fill="var(--emerald-deep)" />
      {/* Right face */}
      <polygon points="200,90 120,130 120,152 200,112" fill="var(--paper)" opacity="0.85" />
      <line x1="200" y1="90" x2="200" y2="112" stroke="var(--brass)" strokeWidth="1" opacity="0.7" />
      <line x1="200" y1="112" x2="120" y2="152" stroke="var(--brass)" strokeWidth="0.5" opacity="0.4" />

      {/* ── 3. Top slab face ────────────────────────────────────── */}
      <polygon points="120,50 200,90 120,130 40,90" fill="url(#bp-top)" />
      <polygon points="120,50 200,90 120,130 40,90" fill="none" stroke="var(--brass)" strokeWidth="0.5" opacity="0.3" />

      {/* ── 4. Cast ground shadow under desk ────────────────────── */}
      <polygon
        points="120,84 156,102 120,118 84,102"
        fill="var(--emerald-deep)"
        opacity="0.4"
      />

      {/* ── 5. Architectural Drafting Desk ──────────────────────── */}
      {/* Left Trestle Leg & Base */}
      <line x1="92" y1="84" x2="92" y2="105" stroke="var(--brass)" strokeWidth="2" strokeLinecap="round" />
      <line x1="86" y1="108" x2="98" y2="102" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

      {/* Right Trestle Leg & Base */}
      <line x1="148" y1="84" x2="148" y2="105" stroke="var(--brass)" strokeWidth="2" strokeLinecap="round" />
      <line x1="142" y1="108" x2="154" y2="102" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

      {/* Trestle Stretcher Crossbar */}
      <line x1="92" y1="98" x2="148" y2="98" stroke="var(--brass)" strokeWidth="1.2" opacity="0.7" />

      {/* Drawing Board 3D Faces */}
      {/* Left edge (shaded) */}
      <polygon points="84,80 120,98 120,105 84,87" fill="var(--emerald-deep)" />
      {/* Right edge (lit) */}
      <polygon points="156,80 120,98 120,105 156,87" fill="var(--brass)" opacity="0.7" />
      {/* Top drawing board surface */}
      <polygon
        points="120,62 156,80 120,98 84,80"
        fill="#12251e"
        stroke="var(--brass)"
        strokeWidth="0.75"
      />

      {/* ── 6. Blueprint Sheet ──────────────────────────────────── */}
      {/* Crisp 2:1 isometric blueprint sheet lying on the board */}
      <polygon
        points="120,65 150,80 120,95 90,80"
        fill="url(#bp-cyan)"
        stroke="#38bdf8"
        strokeWidth="0.75"
      />

      {/* 4 Corner brass drafting pins */}
      <circle cx="120" cy="67" r="1.2" fill="var(--brass)" />
      <circle cx="147" cy="80" r="1.2" fill="var(--brass)" />
      <circle cx="120" cy="93" r="1.2" fill="var(--brass)" />
      <circle cx="93" cy="80" r="1.2" fill="var(--brass)" />

      {/* Subtle blueprint grid coordinates */}
      <line x1="98" y1="76" x2="128" y2="91" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3" />
      <line x1="106" y1="72" x2="136" y2="87" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3" />
      <line x1="114" y1="68" x2="144" y2="83" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3" />

      <line x1="104" y1="87" x2="134" y2="72" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3" />
      <line x1="112" y1="91" x2="142" y2="76" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3" />

      {/* Architectural Floor Plan / Structure */}
      <polygon
        points="120,72 138,81 120,90 102,81"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="0.8"
      />
      {/* Interior wall core */}
      <line x1="120" y1="72" x2="120" y2="90" stroke="#7dd3fc" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="111" y1="76.5" x2="129" y2="85.5" stroke="#7dd3fc" strokeWidth="0.5" />

      {/* Dimension Line (animates on hover) */}
      <line
        className="blueprint-line"
        x1="97" y1="83"
        x2="143" y2="83"
        stroke="var(--brass)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="46"
        strokeDashoffset="46"
        opacity="0.9"
      />
      <line x1="97" y1="81" x2="97" y2="85" stroke="var(--brass)" strokeWidth="0.8" opacity="0.8" />
      <line x1="143" y1="81" x2="143" y2="85" stroke="var(--brass)" strokeWidth="0.8" opacity="0.8" />

      {/* ── 7. Brass T-Square ───────────────────────────────────── */}
      {/* Ruler blade */}
      <polygon
        points="114,64 150,82 147,84 111,66"
        fill="var(--brass)"
        opacity="0.9"
      />
      {/* Ruler head */}
      <polygon
        points="108,61 118,66 115,70 105,65"
        fill="var(--brass-soft)"
      />

      {/* ── 8. Extras: Plant, Pebbles, Sparkle ──────────────────── */}
      {/* Minimal architectural topiary (left) */}
      <ellipse cx="62" cy="94" rx="7" ry="4.5" fill="var(--emerald)" opacity="0.85" />
      <ellipse cx="62" cy="91" rx="5" ry="3.5" fill="var(--emerald-surface)" opacity="0.8" />
      <line x1="62" y1="98" x2="62" y2="103" stroke="var(--emerald-deep)" strokeWidth="1.5" />

      {/* Floating brass pebbles */}
      <ellipse cx="174" cy="106" rx="4" ry="2.5" fill="var(--brass-soft)" opacity="0.4" />
      <ellipse cx="58" cy="114" rx="3" ry="2" fill="var(--brass-soft)" opacity="0.35" />

      {/* Brass sparkle (top right) */}
      <g className="sparkle" style={{ transformOrigin: '172px 70px' }}>
        <line x1="172" y1="65" x2="172" y2="75" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="167" y1="70" x2="177" y2="70" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="169" y1="67" x2="175" y2="73" stroke="var(--brass)" strokeWidth="0.75" strokeLinecap="round" opacity="0.5" />
        <line x1="175" y1="67" x2="169" y2="73" stroke="var(--brass)" strokeWidth="0.75" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  )
}
