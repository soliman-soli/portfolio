'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/content/projects'
import { StatusPill } from '../ui/StatusPill'
import { ArcadeCabinet } from './ArcadeCabinet'
import { DitherFrame } from './DitherFrame'
import { useInView } from '@/lib/hooks/useInView'
import { ROW_REVEAL_THRESHOLD } from '@/lib/motion'
import { cssVars } from '@/lib/css'

interface WorkRowProps {
  project: Project
  index: number
  onPointerEnter?: (e: React.PointerEvent, project: Project) => void
  onPointerMove?: (e: React.PointerEvent) => void
  onRowFocus?: (e: React.FocusEvent<HTMLElement>, project: Project) => void
  onRowBlur?: (e: React.FocusEvent<HTMLElement>) => void
}

export function WorkRow({
  project,
  index,
  onPointerEnter,
  onPointerMove,
  onRowFocus,
  onRowBlur,
}: WorkRowProps) {
  const router = useRouter()
  const rowRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const isIn = useInView(rowRef, ROW_REVEAL_THRESHOLD)

  const handleClick = (e: React.MouseEvent) => {
    if (window.matchMedia('(hover: none)').matches) {
      const target = e.target as HTMLElement
      // If user tapped the PRESS START link, let the link navigate directly
      if (target.closest('.arcade-start-link')) {
        return
      }
      e.preventDefault()
      setIsOpen((prev) => !prev)
    } else {
      router.push(`/work/${project.slug}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (window.matchMedia('(hover: none)').matches) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else {
        e.preventDefault()
        router.push(`/work/${project.slug}`)
      }
    }
  }

  return (
    <div
      ref={rowRef}
      role="link"
      tabIndex={0}
      data-row
      data-i={index}
      style={cssVars({ '--i': index })}
      className={`work-row group cursor-pointer ${isIn ? 'is-in' : ''} ${
        isOpen ? 'is-open' : ''
      }`}
      aria-expanded={isOpen}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={(e) => onPointerEnter?.(e, project)}
      onPointerMove={onPointerMove}
      onFocus={(e) => onRowFocus?.(e, project)}
      onBlur={onRowBlur}
    >
      <span className="mono row-idx">{project.index}</span>
      <span className="row-title font-[800] text-row font-disp font-stretch-125">
        {project.title}
      </span>
      <span className="mono text-mut narrow:hidden">{project.tag}</span>
      <span className="mono text-mut narrow:hidden">{project.year}</span>
      <StatusPill status={project.status} label={project.statusLabel} />

      {/* Inline details for touch devices */}
      <div className="row-more" aria-hidden={!isOpen}>
        {isOpen && (
          <div className="relative mt-16 w-full" key={`${project.slug}:open`}>
            <DitherFrame isActive={true} isGlitchHop={false} isTouch={true} />
            <ArcadeCabinet project={project} isGlitchHop={false} isTouch={true} />
          </div>
        )}
      </div>
    </div>
  )
}
