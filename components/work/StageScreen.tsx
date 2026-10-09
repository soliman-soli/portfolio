import Link from 'next/link'
import type { Project } from '@/content/projects'
import { PixelSprite } from './PixelSprite'

interface StageScreenProps {
  project: Project
  isTouch?: boolean
}

export function StageScreen({ project, isTouch = false }: StageScreenProps) {
  return (
    <div className="stage-screen flex flex-col gap-14 p-20 select-none">
      {/* 1. Header strip: STAGE 01 / 04 on left, kind pill on right */}
      <div className="arcade-stagger-1 flex justify-between items-center pb-12 border-b border-[var(--color-line)]">
        <span className="font-pixel text-[10px] text-[var(--color-neon)] tracking-wider">
          STAGE {project.index} / 04
        </span>
        <span className="mono text-[12px] px-8 py-2 rounded-pill border border-[var(--color-line)] bg-white/[0.04] text-ink">
          {project.kind}
        </span>
      </div>

      {/* 2. Key art panel (~16:7): faint pixel grid, scanlines, 3x sprite wobble, tag caption */}
      <div className="arcade-stagger-2 card-key-art w-full">
        <PixelSprite sprite={project.sprite} />
        <span className="absolute bottom-8 left-10 mono text-[12px] text-mut z-[2] bg-black/70 px-6 py-2 rounded-block border border-[var(--color-line)]">
          {project.tag}
        </span>
      </div>

      {/* 3. Title (weight 800, ~28px) + Summary (13px, 2-line clamp) */}
      <div className="arcade-stagger-3 flex flex-col gap-4">
        <h3 className="font-disp font-[800] text-[26px] sm:text-[28px] tracking-tight text-ink leading-[1.1] font-stretch-112 m-0">
          {project.title}
        </h3>
        <p className="mono text-[13px] text-mut leading-normal line-clamp-2 m-0">
          {project.summary}
        </p>
      </div>

      {/* 4. Stat tiles: 3 across if 3 items, 2x2 if 4 items */}
      <div
        className={`arcade-stagger-4 grid gap-8 ${
          project.highlights.length === 4 ? 'grid-cols-2' : 'grid-cols-3'
        }`}
      >
        {project.highlights.map((h) => (
          <div
            key={h.label}
            className="stat-tile border border-[var(--color-line)] bg-black/40 rounded-block p-[10px_12px] flex flex-col justify-center gap-2"
          >
            <span className="font-disp font-[800] text-[22px] sm:text-[24px] text-[var(--color-neon)] leading-none tracking-tight">
              {h.value}
            </span>
            <span className="mono text-[12px] text-mut leading-tight">
              {h.label}
            </span>
          </div>
        ))}
      </div>

      {/* 5. BOSS line: skull marker + BOSS + project boss text (12px) */}
      <div className="arcade-stagger-5 flex items-center gap-8 mono text-[12px] leading-none">
        <span className="boss-marker shrink-0" aria-hidden="true" />
        <span className="font-bold text-[var(--color-neon)] tracking-wider shrink-0">
          BOSS
        </span>
        <span className="text-ink truncate">{project.boss}</span>
      </div>

      {/* 6. Stack chips: 12px, bordered, ink text, wrapping, max 2 rows */}
      <div className="arcade-stagger-6 flex flex-wrap gap-6 max-h-[58px] overflow-hidden">
        {project.stack.map((item) => (
          <span
            key={item}
            className="mono text-[12px] px-8 py-3 rounded-block border border-[var(--color-line)] bg-white/[0.03] text-ink leading-none whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>

      {/* 7. Footer bar */}
      <div className="arcade-stagger-7 pt-12 border-t border-[var(--color-line)]">
        {isTouch ? (
          <Link
            href={`/work/${project.slug}`}
            className="arcade-start-link font-pixel text-[11px] text-on-neon bg-[var(--color-neon)] px-16 rounded-block flex items-center justify-between min-h-[44px] tracking-wider active:scale-[0.98] transition-transform select-none no-underline cursor-pointer"
          >
            <span>&#9654; PRESS START</span>
            <span className="mono text-[12px] text-black font-bold">
              open project ↗
            </span>
          </Link>
        ) : (
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[10px] text-[var(--color-neon)] arcade-blink-start tracking-wider">
              &#9654; PRESS START
            </span>
            <span className="mono text-[12px] text-ink">
              open project ↗
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
