'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Project } from '@/content/projects'
import { StatusPill } from '../ui/StatusPill'
import { useInView } from '@/lib/hooks/useInView'
import { ROW_REVEAL_THRESHOLD } from '@/lib/motion'
import { cssVars } from '@/lib/css'
import { useStageTransition } from '@/components/transition/StageTransition'

interface WorkRowProps {
  project: Project
  index: number
  total: number
}

export function WorkRow({ project, index, total }: WorkRowProps) {
  const router = useRouter()
  const rowRef = useRef<HTMLAnchorElement>(null)
  const isIn = useInView(rowRef, ROW_REVEAL_THRESHOLD)
  const { start, isTransitioning } = useStageTransition()

  const href = `/work/${project.slug}`

  const triggerTransition = (clientX?: number, clientY?: number) => {
    let x = clientX
    let y = clientY
    if (x === undefined || y === undefined || (x === 0 && y === 0)) {
      const rect = rowRef.current?.getBoundingClientRect()
      if (rect) {
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      } else {
        x = window.innerWidth / 2
        y = window.innerHeight / 2
      }
    }

    start({
      href,
      index: project.index,
      total,
      title: project.title,
      boss: project.boss,
      x,
      y,
    })
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let browser handle modified clicks, non-left clicks, target="_blank", or download
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      (e.currentTarget.target && e.currentTarget.target !== '_self') ||
      e.currentTarget.hasAttribute('download')
    ) {
      return
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    // Ignore if already transitioning
    if (isTransitioning) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    triggerTransition(e.clientX, e.clientY)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter') {
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return
      }

      if (isTransitioning) {
        e.preventDefault()
        return
      }

      e.preventDefault()
      triggerTransition()
    }
  }

  const handlePrefetch = () => {
    router.prefetch(href)
  }

  return (
    <Link
      ref={rowRef}
      href={href}
      data-row
      data-i={index}
      style={cssVars({ '--i': index })}
      className={`work-row group ${isIn ? 'is-in' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
    >
      <span className="mono row-idx">{project.index}</span>
      <span className="row-title font-[800] text-row font-disp font-stretch-125">
        {project.title}
      </span>
      <StatusPill status={project.status} label={project.statusLabel} />
    </Link>
  )
}
