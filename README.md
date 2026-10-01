# Soliman — Portfolio

A premium personal portfolio built with Next.js, TypeScript, and Tailwind CSS. Features a warm editorial design ("The Architect's Study") with hand-built isometric floating islands as ambient decoration.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All copy and project data live in `/data` — no JSX required:

| File | What it controls |
|------|-----------------|
| `data/profile.ts` | Name, bio, email, GitHub, LinkedIn, quick facts |
| `data/projects.ts` | Project cards (title, problem, outcome, stack, diagram) |
| `data/stack.ts` | Tech stack groups and chips |

### Replace placeholder links

In `data/profile.ts`, update:
- `email` → your real email
- `github` → your GitHub URL
- `linkedin` → your LinkedIn URL

## Adding a project

In `data/projects.ts`, add a new entry to the `projects` array:

```ts
{
  id: 'my-project',
  title: 'My Project',
  problem: 'One-line problem statement.',
  outcome: 'What was achieved.',
  stack: ['TypeScript', 'Node.js'],
  featured: true,          // show in Work section
  diagram: [
    { id: 'a', label: 'Input',  x: 10,  y: 40, w: 60, h: 32 },
    { id: 'b', label: 'Output', x: 100, y: 40, w: 60, h: 32 },
  ],
  diagramArrows: [{ from: 'a', to: 'b' }],
}
```

## Adding a new island variant

1. Create `components/islands/variants/MyIsland.tsx` — follow the SVG layering comments in any existing variant (rocky underside → slab faces → top face → props → extras).
2. Register it in `components/islands/FloatingIsland.tsx`:
   ```ts
   // Add to IslandVariant type
   export type IslandVariant = 'server' | 'automation' | 'blueprint' | 'desktop' | 'my-island'
   
   // Add to VARIANT_MAP
   const VARIANT_MAP = {
     ...
     'my-island': MyIsland,
   }
   ```
3. Add hover CSS in `components/islands/islands.css` following the existing pattern.
4. Place it in any section using `<FloatingIsland variant="my-island" size="md" />`.

## Isometric geometry reference

All islands use a 2:1 isometric projection in a `240×240` viewBox:

```
Top rhombus:  120,50 → 200,90 → 120,130 → 40,90
Left face:    40,90  → 120,130 → 120,152 → 40,112
Right face:   200,90 → 120,130 → 120,152 → 200,112
Underside:    3 stacked narrowing polygons below y=130
```

Props are placed on the top face using the same 3-face shading logic.

## Design tokens

All colours are CSS variables in `app/globals.css`. Dark mode is toggled by adding `.dark` to `<html>`. Tokens are mapped into Tailwind in `tailwind.config.ts`.

| Token | Light | Dark |
|-------|-------|------|
| `--ivory` | `#F7F3EA` | `#0A3327` |
| `--paper` | `#FBF8F1` | `#0e3d2f` |
| `--ink` | `#10201B` | `#F7F3EA` |
| `--emerald` | `#0F4C3A` | `#4ebe93` |
| `--emerald-deep` | `#0A3327` | `#061f18` |
| `--brass` | `#B08D57` | `#c9a870` |
| `--brass-soft` | `#D9C7A3` | `#7a6040` |

## Theme

Theme is persisted in `localStorage` under the key `theme`. System preference is respected on first load with no flash of incorrect theme (the init script in `layout.tsx` runs synchronously before React hydration).

## Deploy to Vercel

```bash
npx vercel
```

Zero configuration required. The build output is in `.next/`.

### Recommended next steps after deploy

1. Add a real `NEXT_PUBLIC_SITE_URL` env var and update the Open Graph `url` in `layout.tsx`.
2. Generate a real OG image at `app/opengraph-image.tsx` using `next/og`.
3. Set your custom domain in the Vercel dashboard.

## Customize first checklist

- [ ] Update `data/profile.ts`: bio, email, GitHub, LinkedIn
- [ ] Update `data/projects.ts`: replace placeholder projects with real ones
- [ ] Update `data/stack.ts`: add/remove tech items
- [ ] Replace the monogram favicon in `layout.tsx` with a real logo or refined SVG
- [ ] Add real project screenshots or improved diagrams
- [ ] Set your custom domain in Vercel

## Project structure

```
app/
  layout.tsx         Root layout, fonts, metadata, theme init
  page.tsx           Page — composes all sections
  globals.css        Design tokens, base styles
  islands/page.tsx   Dev-only island preview at /islands
components/
  Nav.tsx            Sticky nav with scroll state + active section
  ThemeToggle.tsx    Dark/light toggle, persisted
  Button.tsx         Primary / outline / ghost variants
  Chip.tsx           Stack tag chip
  Reveal.tsx         Framer Motion fade+rise entrance
  ProjectCard.tsx    Card with inline SVG arch diagram
  islands/
    FloatingIsland.tsx   Orchestrator component
    IslandShadow.tsx     Shadow element (inverse animation)
    islands.css          All keyframe animations
    variants/
      ServerIsland.tsx
      AutomationIsland.tsx
      BlueprintIsland.tsx
      DesktopIsland.tsx
sections/
  Hero.tsx
  About.tsx
  Work.tsx
  Approach.tsx
  Stack.tsx
  Contact.tsx        Includes footer
data/
  profile.ts
  projects.ts
  stack.ts
lib/
  utils.ts
```

## Suggested next upgrades

- **Blog / notes section** — MDX-based, same design system
- **Case-study detail pages** — `/work/[slug]` with full write-ups
- **More island variants** — `cloud`, `database`, `mobile` following the existing layering system
- **OG image generation** — `app/opengraph-image.tsx` using `@vercel/og`
- **Contact form** — Resend or Formspree integration, validated with Zod
- **Analytics** — Vercel Analytics (one import, zero config)
- **Page transitions** — Framer Motion `AnimatePresence` between routes
