import type { Project } from '@/content/projects'
import { StageScreen } from './StageScreen'

interface ArcadeCabinetProps {
  project: Project
  isGlitchHop?: boolean
  isTouch?: boolean
}

export function ArcadeCabinet({
  project,
  isGlitchHop = false,
  isTouch = false,
}: ArcadeCabinetProps) {
  return (
    <div
      className={`arcade-cabinet relative bg-[var(--color-card)] ${
        isGlitchHop ? 'is-glitch' : 'is-boot'
      } ${isTouch ? 'is-touch' : ''}`}
      aria-hidden={!isTouch}
    >
      {/* 150ms CRT power-on shutter on cold boot */}
      {!isGlitchHop && <div className="crt-power-on" aria-hidden="true" />}

      {/* Stage screen content */}
      <div className={`arcade-stage-content ${isGlitchHop ? 'skip-delay' : ''}`}>
        <StageScreen project={project} isTouch={isTouch} />
      </div>
    </div>
  )
}
