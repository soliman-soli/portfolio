import type { Project } from '@/content/projects'
import { PixelSprite } from './PixelSprite'

interface StageScreenProps {
  project: Project
  isTouch?: boolean
}

export function StageScreen({ project, isTouch = false }: StageScreenProps) {
  return (
    <div className="stage-screen flex flex-col gap-12 p-16">
      {/* STAGE 0N + project title */}
      <div className="arcade-stagger-1 flex flex-col gap-4">
        <span className="font-pixel text-[11px] text-[var(--color-neon)] tracking-wider">
          STAGE {project.index}
        </span>
        <strong className="font-disp font-[800] text-[18px] text-ink leading-tight font-stretch-112">
          {project.title}
        </strong>
      </div>

      {/* Pixel-art sprite */}
      <div className="arcade-stagger-2 flex justify-center py-6 border-y border-[var(--color-line)] bg-black/40">
        <PixelSprite sprite={project.sprite} />
      </div>

      {/* BOSS line */}
      <div className="arcade-stagger-3 arcade-boss flex items-center gap-6 mono text-[11px]">
        <span className="boss-marker" aria-hidden="true" />
        <span className="text-[var(--color-neon)] font-bold">BOSS</span>
        <span className="text-ink truncate">{project.boss}</span>
      </div>

      {/* 3-4 HUD stat rows from highlights */}
      <div className="arcade-stagger-4 hud-stats flex flex-col gap-6">
        {project.highlights.map((h, i) => (
          <div key={h.label} className="hud-stat-row flex flex-col gap-2">
            <div className="flex justify-between items-baseline mono text-[11px] gap-8">
              <span className="text-mut flex-1 leading-tight">{h.label}</span>
              <b className="font-mono text-ink font-bold shrink-0">{h.value}</b>
            </div>
            <div className="xp" aria-hidden="true">
              {Array.from({ length: 10 }, (_, segIdx) => (
                <b
                  key={segIdx}
                  className={
                    segIdx < (i === 0 ? 8 : i === 1 ? 7 : i === 2 ? 9 : 6)
                      ? 'f'
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stack chips */}
      <div className="arcade-stagger-5 flex flex-wrap gap-4 pt-4 border-t border-[var(--color-line)]">
        {project.stack.map((item) => (
          <span
            key={item}
            className="mono text-[10px] px-6 py-2 rounded-block bg-black/50 border border-[var(--color-line)] text-mut"
          >
            {item}
          </span>
        ))}
      </div>

      {/* PRESS START line */}
      <div className="arcade-stagger-6 pt-2">
        {isTouch ? (
          <span
            className="arcade-start-btn font-pixel text-[10px] text-on-neon bg-[var(--color-neon)] py-12 px-16 rounded-block text-center flex items-center justify-center min-h-[44px] tracking-wider cursor-pointer active:scale-[0.98] transition-transform select-none"
            role="button"
            tabIndex={0}
          >
            PRESS START &#9656; open mission
          </span>
        ) : (
          <div className="text-center py-4">
            <span className="font-pixel text-[10px] text-[var(--color-neon)] arcade-blink-start tracking-wider">
              PRESS START &#9656; open mission
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
