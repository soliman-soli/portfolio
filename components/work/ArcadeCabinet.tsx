import type { Project } from '@/content/projects'
import { StageScreen } from './StageScreen'

interface ArcadeCabinetProps {
  project: Project
  isGlitchHop?: boolean
}

export function ArcadeCabinet({
  project,
  isGlitchHop = false,
}: ArcadeCabinetProps) {
  return (
    <div
      className={`arcade-cabinet ${isGlitchHop ? 'is-glitch' : 'is-boot'}`}
      aria-hidden="true"
    >
      {/* Power-on / Intro layers only run on full boot */}
      {!isGlitchHop && (
        <>
          <div className="crt-power-on" />
          <div className="arcade-boot-msg arcade-coin-msg">
            <span className="font-pixel text-[12px] text-[var(--color-neon)]">
              INSERT COIN
            </span>
          </div>
          <div className="arcade-boot-msg arcade-ready-msg">
            <span className="font-pixel text-[12px] text-[var(--color-neon)]">
              PLAYER 1 READY
            </span>
          </div>
        </>
      )}

      {/* Stage screen content */}
      <div className={`arcade-stage-content ${isGlitchHop ? 'skip-delay' : ''}`}>
        <StageScreen project={project} isTouch={false} />
      </div>
    </div>
  )
}
