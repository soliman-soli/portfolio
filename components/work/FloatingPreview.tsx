'use client'

import { forwardRef } from 'react'
import type { Project } from '@/content/projects'
import { ArcadeCabinet } from './ArcadeCabinet'

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
    return (
      <div ref={ref} id="pv" className="preview" aria-hidden="true">
        <div ref={innerRef} className="preview-inner" id="pvin">
          {activeProject && (
            <ArcadeCabinet
              key={`${activeProject.slug}:${bootId}`}
              project={activeProject}
              isGlitchHop={isGlitchHop}
            />
          )}
        </div>
      </div>
    )
  }
)
