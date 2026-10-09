'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import type { Project } from '@/content/projects'
import { StatusPill } from '../ui/StatusPill'
import { StageScreen } from './StageScreen'
import { useInView } from '@/lib/hooks/useInView'
import { useIsTouch } from '@/lib/hooks/useIsTouch'
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
  const rowRef = useRef<HTMLAnchorElement & HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isIn = useInView(rowRef, ROW_REVEAL_THRESHOLD)
  const isTouchDevice = useIsTouch()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isTouch = mounted && isTouchDevice

  const handleClick = (e: React.MouseEvent) => {
    if (isTouch) {
      e.preventDefault()
      setIsOpen((prev) => !prev)
    }
  }

  const commonProps = {
    ref: rowRef,
    'data-row': true,
    'data-i': index,
    style: cssVars({ '--i': index }),
    className: `work-row group ${isIn ? 'is-in' : ''} ${isOpen ? 'is-open' : ''}`,
    'aria-expanded': isTouch ? isOpen : undefined,
    onClick: handleClick,
    onPointerEnter: (e: React.PointerEvent) => onPointerEnter?.(e, project),
    onPointerMove,
    onFocus: (e: React.FocusEvent<HTMLElement>) => onRowFocus?.(e, project),
    onBlur: onRowBlur,
  }

  const innerContent = (
    <>
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
          <div className="arcade-cabinet is-boot mt-16" key={`${project.slug}:open`}>
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
            <div className="arcade-stage-content">
              <StageScreen project={project} isTouch={true} />
            </div>
          </div>
        )}
      </div>
    </>
  )

  if (isTouch) {
    return (
      <div role="region" aria-label={project.title} {...commonProps}>
        {innerContent}
      </div>
    )
  }

  return (
    <Link href={`/work/${project.slug}`} {...commonProps}>
      {innerContent}
    </Link>
  )
}
