'use client'

import { forwardRef } from 'react'
import type { Project } from '@/content/projects'
import { ArcadeCabinet } from './ArcadeCabinet'
import { DitherFrame } from '@/components/ui/DitherFrame'

interface FloatingPreviewProps {
  innerRef: React.RefObject<HTMLDivElement | null>
  activeProject: Project | null
  bootId: number
  isGlitchHop: boolean
}

export const FloatingPreview = forwardRef<HTMLDivElement, FloatingPreviewProps>(
  function FloatingPreview(
    { innerRef, activeProject, bootId, isGlitchHop },
    ref
  ) {
    const isVisible = Boolean(activeProject)

    return (
      <div ref={ref} id="pv" className="preview" aria-hidden="true">
        <div ref={innerRef} className="preview-inner relative" id="pvin">
          <DitherFrame
            isActive={isVisible}
            isGlitchHop={isGlitchHop}
            resetKey={activeProject?.slug ?? null}
          >
            {activeProject && (
              <ArcadeCabinet
                key={`${activeProject.slug}:${bootId}`}
                project={activeProject}
                isGlitchHop={isGlitchHop}
              />
            )}
          </DitherFrame>
        </div>
      </div>
    )
  }
)
