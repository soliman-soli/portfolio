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
  page.tsx               # Main hero, work, about, and contact sections
  globals.css            # Tokens, reset, keyframes, arcade moments styles
  work/[slug]/page.tsx   # Static mission briefing route for each project
components/
  intro/
    Loader.tsx           # 000% to 100% boot sequence counter overlay
    CornerBrackets.tsx   # HUD corner brackets
    Crosshair.tsx        # Hero-scoped mouse coordinate tracker with live readout
    Backdrop.tsx         # Subtle radial-masked grid
  hero/
    Hero.tsx             # Header nav, role statement, CTA, replay button
    HeroName.tsx         # SOLIMAN. masked letter rise
  work/
    WorkSection.tsx      # Section header, project list, hover coordinator
    WorkRow.tsx          # Interactive project row (hover dim, touch expand)
    FloatingPreview.tsx  # Cursor-following preview container
    ArcadeCabinet.tsx    # CRT power-on, coin blink, ready flash, and glitch hop
    StageScreen.tsx      # STAGE header, sprite, BOSS line, HUD stats, and chips
    PixelSprite.tsx      # Pure CSS pixel sprites (repos, vectors, tenants, bars)
  about/
    AboutSection.tsx     # Player card, skill tree, perks, and quest log
  contact/
    ContactSection.tsx   # CONTINUE countdown, coin drop, contact menu, and footer
  ui/
    XpBar.tsx            # 10-segment XP bar
    StatusPill.tsx       # Live / WIP / Planned / Done / Featured status pills
    Cta.tsx              # Link CTA with hover animation
content/
  projects.ts            # Real project definitions and mission metrics
  skills.ts              # Skill groups, perks, and internship quest log
lib/
  motion.ts              # Timings, easings, lerp constants, and arcade delays
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

## Manual Setup Notes

- **CV PDF:** Place `Soliman_Ahmed_CV.pdf` into the `/public` directory so the download link on the contact screen resolves directly.
