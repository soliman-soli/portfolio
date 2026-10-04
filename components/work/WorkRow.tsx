'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/content/projects'
import { StatusPill } from '../ui/StatusPill'
import { PreviewCard } from './PreviewCard'
import { useInView } from '@/lib/hooks/useInView'
import { useIsTouch } from '@/lib/hooks/useIsTouch'
import { ROW_REVEAL_THRESHOLD } from '@/lib/motion'
import { cssVars } from '@/lib/css'

interface WorkRowProps {
  project: Project
  index: number
  onPointerEnter?: (e: React.PointerEvent, project: Project) => void
  onPointerMove?: (e: React.PointerEvent) => void
}

export function WorkRow({
  project,
  index,
  onPointerEnter,
  onPointerMove,
}: WorkRowProps) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const isIn = useInView(rowRef, ROW_REVEAL_THRESHOLD)
  const isTouch = useIsTouch()

  const handleClick = (e: React.MouseEvent) => {
    // If on touch device, toggle expand inline and prevent immediate navigation
    if (window.matchMedia('(hover: none)').matches) {
      e.preventDefault()
      setIsOpen((prev) => !prev)
    }
  }

  return (
    <Link
      ref={rowRef}
      href={`/work/${project.slug}`}
      data-row
      data-i={index}
      style={cssVars({ '--i': index })}
      className={`work-row group ${isIn ? 'is-in' : ''} ${isOpen ? 'is-open' : ''}`}
      aria-expanded={isTouch ? isOpen : undefined}
      onClick={handleClick}
      onPointerEnter={(e) => onPointerEnter?.(e, project)}
      onPointerMove={onPointerMove}
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
        <PreviewCard project={project} showArt={false} />
      </div>
    </Link>
  )
}
