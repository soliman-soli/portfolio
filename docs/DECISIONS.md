# Architecture & Decisions

Plain-language rationale for every major choice made while rebuilding Soliman's Hero + Selected Work page from the single-file prototype into a clean Next.js + TypeScript codebase.

---

## 1. Ground Truth First

- **Choice:** Saved the original prototype untouched to `reference/original.html` and captured automated baseline screenshots via Playwright before making any architectural decisions.
- **Why:** The goal is identical recreation, not redesign. Having baseline screenshots at desktop (1440x900) and mobile (390x844) prevents subjective drift and ensures exact pixel fidelity for fonts, spacings, and animations.

## 2. Framework & Tooling

- **Choice:** Next.js (App Router, static prerendering), React 19, TypeScript 5.9, Tailwind CSS v4, and pnpm.
- **Why:** 
  - Standard, modern React stack with high performance and zero unnecessary runtime dependencies.
  - No external animation libraries (like Framer Motion or GSAP) were used; native CSS keyframes/transitions combined with `requestAnimationFrame` reproduce the prototype's feel with zero bundle overhead.

## 3. Font Loading Strategy

- **Choice:** `next/font/google` for Archivo and JetBrains Mono with CSS variable injection (`--font-archivo`, `--font-jetbrains`).
- **Why:** 
  - Archivo is configured with `axes: ['wdth']` to enable `font-stretch: 125%` exactly as specified in the original typography.
  - Self-hosted by Next.js automatically at build time, eliminating layout shift (CLS) and external Google Fonts network calls.

## 4. CSS Architecture & Tailwind v4 `@theme`

- **Choice:** Custom tokens declared in `@theme` inside `app/globals.css`, with a 1px spacing unit (`--spacing: 1px`) and custom variants (`@custom-variant narrow (@media (max-width: 760px))`).
- **Why:**
  - Allows utility classes to match the prototype's exact pixel values (e.g. `p-[44px_40px_40px]`, `text-hero`, `text-count`).
  - Preserves exact selectors and class names from the prototype (`.pi`, `.ph`, `.kv`, `.xp`, `.st`, `.art--*`) for 100% visual parity.
  - Avoided Tailwind's default preflight margins/paddings from altering delicate display typography alignments.

## 5. Performance & DOM Updates

- **Choice:** Direct ref mutations via `requestAnimationFrame` for cursor crosshair coordinates and floating preview lerp.
- **Why:**
  - Prevents triggering 60–120Hz React state re-renders on mouse movement.
  - Keeps React's virtual DOM reconciliation completely out of high-frequency render loops.

## 6. Accessibility & Progressive Enhancement

- **Choice:** 
  - Added an off-screen skip link (`skip to work &rarr;`) that becomes visible on keyboard focus.
  - Marked rows with semantic `<a>` tags pointing to real `/work/[slug]` routes.
  - Bound `aria-expanded` dynamically on touch devices (`hover: none`) when rows are tapped.
  - Fallbacks for `prefers-reduced-motion` and `scripting: none` ensuring content is instantly visible and navigable.

## 7. Arcade Moments Only

- **Choice:** Confined retro arcade CRT scanlines, phosphor bloom, and the Press Start 2P pixel font strictly to focused arcade moments (the project hover cabinet screen and the `#contact` Continue terminal).
- **Why:** The primary goal of the portfolio is professional communication for engineering recruiters. Making the whole website CRT-styled would severely harm readability and cause visual fatigue. Scoping arcade elements creates memorable delight without sacrificing clean, legible JetBrains Mono detail typography.

## 8. Cabinet State Model

- **Choice:** Decoupled high-frequency cursor tracking (using `requestAnimationFrame` and direct DOM style mutation) from project selection state (`activeProject`, `bootId`, `isGlitchHop`).
- **Why:** Mouse movement fires up to 120 times per second. By keeping position lerping in direct DOM transforms and only updating React state when the pointer crosses row boundaries (`pointerenter`), the cabinet avoids any per-frame React virtual DOM reconciliation while retriggering boot CSS animations via deterministic keying.

## 9. Content Lives in `content/*.ts`, Components Stay Content-Free

- **Choice:** Extracted all resume data, project statistics, skill trees, perks, and quest logs into `content/skills.ts` and `content/projects.ts`.
- **Why:** Eliminates hardcoded strings within JSX components. Soliman can adjust his metrics, skills, levels, and project details in pure TypeScript data files with full type safety and zero risk of breaking layout or animation code.

## 10. Contact is Never Gated

- **Choice:** Made the arcade coin-drop interaction completely optional: provided an immediate "skip ▸ show contacts" fallback, bypassed all gating in `prefers-reduced-motion` mode or with JavaScript disabled (`<noscript>`), and ensured contact links are standard, accessible semantic anchors.
- **Why:** While the retro `CONTINUE?` countdown and coin mechanism provide immersive arcade flavoring, recruiters on tight deadlines must never be blocked or frustrated when looking for an email or CV download.

## 11. Coordinate Marker Scoped to Hero

- **Choice:** Coordinate marker is scoped to the hero.
- **Why:** Keeps cursor crosshair feedback and real-time HUD waypoint coordinates focused on the opening hero introduction without distracting from project examination in the work section or reading in about/contact sections. The marker transitions off in 150ms upon leaving the hero or scrolling past it.

## 12. Cabinet Readability Floor

- **Choice:** Cabinet readability floor (12px min, pixel font only for 2 labels).
- **Why:** Solves previous miniature font and contrast issues by establishing a strict 12px floor for all informative text (JetBrains Mono / Archivo), reserving Press Start 2P strictly for "STAGE 01 / 04" and "▶ PRESS START". Replaced busy segmented bars with bold, scannable stat tiles.

## 13. Animated Dithered Frame

- **Choice:** Frame is a throttled canvas Bayer-dither, paused when hidden.
- **Why:** Delivers a flowing organic halftone field surrounding the card using a native 8x8 Bayer matrix dither and cheap multi-sine noise rendered at low resolution (3.5px dots) and pixelated up. Throttled to ~14 fps and paused whenever the cabinet is hidden or in prefers-reduced-motion to guarantee <2ms CPU overhead and zero per-frame React reconciliations.

## 14. Work Rows Simplified

- **Choice:** Work rows show only index, title and status pill.
- **Why:** Removes visual clutter and secondary tag/year columns from the table view, maximizing horizontal breathing room for the project title and pinning the status pill to the right edge. Full tag and year context remains in the hover cabinet and project pages.

## 15. Shared DitherFrame Component

- **Choice:** DitherFrame is one shared canvas component used by the cabinet and the project page.
- **Why:** Centralizes the 8x8 Bayer matrix dither rendering, dynamic resolution capping (max 200x260 dots), and intersection/visibility observer management into `@/components/ui/DitherFrame`, ensuring identical aesthetics and zero code duplication across the site.

---

## Proposed Changes (Not Applied)

Per instructions, any potential improvements outside the allowed list are recorded here without being applied:

1. **Canvas/WebGL Grid:** A GPU-rendered grid shader instead of CSS radial-masked gradients could allow interactive light ripples on mouse movement.
2. **Dynamic Work Slugs & Markdown Content:** Integrating MDX files for full project case studies in `/work/[slug]`.
3. **Sound FX on Boot:** Optional subtle synthesized 8-bit audio clicks for the 0-100% counter tick.

