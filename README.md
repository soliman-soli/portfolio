# Soliman — Portfolio (Neon Rebuild)

Personal portfolio opening featuring the dark neon theme (`#070708`, `#EDEDE8`, `#CCFF2E`), boot-sequence counter, masked letter reveal, mouse crosshair, and floating preview cards. Rebuilt identically from the original prototype into Next.js App Router + TypeScript.

## Stack

- **Framework:** Next.js (App Router, static prerendering)
- **Language:** TypeScript 5.9 (Strict)
- **Styling:** Tailwind CSS v4 (Tokens via `@theme` in `app/globals.css`)
- **Fonts:** Archivo (with `axes: ['wdth']`) and JetBrains Mono via `next/font/google`
- **Testing & Verification:** Playwright (screenshot regression testing)
- **Package Manager:** pnpm (managed via corepack)

## Quick Start

```bash
# Install dependencies
corepack pnpm install

# Start local dev server
corepack pnpm dev

# Typecheck and lint
corepack pnpm typecheck
corepack pnpm lint

# Production build and run
corepack pnpm build
corepack pnpm start
```

## Baseline Screenshot Verification

To run automated side-by-side screenshots comparing against the baseline:

```bash
# Capture current app screenshots across desktop (1440x900) and mobile (390x844)
node scripts/screenshots.mjs app
```

Outputs are saved in `reference/current/` and compared against `reference/baseline/`.

## Project Structure

```
app/
  layout.tsx             # Root layout with font configuration and skip link
  page.tsx               # Main hero + selected work page
  globals.css            # Tokens, reset, keyframes, feature styles
  work/[slug]/page.tsx   # Static destination route for each project
components/
  intro/
    Loader.tsx           # 000% to 100% boot sequence counter overlay
    CornerBrackets.tsx   # HUD corner brackets
    Crosshair.tsx        # Mouse coordinate tracker with live readout
    Backdrop.tsx         # Subtle radial-masked grid
  hero/
    Hero.tsx             # Header nav, role statement, stack, CTA, replay button
    HeroName.tsx         # SOLIMAN. masked letter rise
  work/
    WorkSection.tsx      # Section header, project list, hover coordinator
    WorkRow.tsx          # Interactive project row (hover dim, touch expand)
    FloatingPreview.tsx  # Cursor-following preview container
    PreviewCard.tsx      # Preview body (art, level, stats, XP bar)
    PreviewArt.tsx       # Pure CSS shape compositions (island, video, api, gantt)
  ui/
    XpBar.tsx            # 10-segment XP bar
    StatusPill.tsx       # Live / WIP / Planned / Shipped status pills
    Cta.tsx              # Link CTA with hover animation
content/
  projects.ts            # Typed project definitions
lib/
  motion.ts              # Timings, easings, lerp constants
  css.ts                 # CSS variable typed helpers
  hooks/
    useInView.ts         # Scroll intersection hook
    useIsTouch.ts        # Touch device detection
    useMediaQuery.ts     # Hydration-safe media query hook
docs/
  DECISIONS.md           # Rationale behind architectural choices
reference/
  original.html          # Ground-truth single-file prototype (untouched)
  baseline/              # Original prototype Playwright screenshots
  current/               # Current Next.js app Playwright screenshots
scripts/
  screenshots.mjs        # Automated visual regression test harness
```

## Placeholders & TODOs

- `TODO(soliman)`: Replace project titles, stats, tags, and years in `content/projects.ts` with real work.
- `TODO(soliman)`: Expand `/work/[slug]` pages into full write-ups/case studies.
- `TODO(soliman)`: Update nav links (`about`, `contact`) to destination sections or pages.
