'use client'

import { useRef, useState } from 'react'
import { projects, type Project } from '@/content/projects'
import { WorkRow } from './WorkRow'
import { FloatingPreview } from './FloatingPreview'
import {
  PREVIEW_LERP,
  PREVIEW_OFFSET_X,
  PREVIEW_OFFSET_Y,
  PREVIEW_RIGHT_CLEARANCE,
  PREVIEW_TOP_MIN,
  PREVIEW_BOTTOM_CLEARANCE,
} from '@/lib/motion'
import { useIsTouch } from '@/lib/hooks/useIsTouch'

export function WorkSection() {
  const isTouch = useIsTouch()
  const listRef = useRef<HTMLDivElement>(null)
  const pvRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // Cabinet active state
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [bootId, setBootId] = useState(0)
  const [isGlitchHop, setIsGlitchHop] = useState(false)
  const wasActiveRef = useRef(false)

  // Motion coordinates
  const motionRef = useRef({
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    running: false,
  })

  const aim = (clientX: number, clientY: number) => {
    const tx = Math.min(
      clientX + PREVIEW_OFFSET_X,
      window.innerWidth - PREVIEW_RIGHT_CLEARANCE
    )
    const ty = Math.max(
      PREVIEW_TOP_MIN,
      Math.min(
        clientY + PREVIEW_OFFSET_Y,
        window.innerHeight - PREVIEW_BOTTOM_CLEARANCE
      )
    )
    motionRef.current.tx = tx
    motionRef.current.ty = ty
  }

  const loop = () => {
    const m = motionRef.current
    m.x += (m.tx - m.x) * PREVIEW_LERP
    m.y += (m.ty - m.y) * PREVIEW_LERP

    if (pvRef.current) {
      pvRef.current.style.transform = `translate(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px)`
    }

    if (m.running) {
      requestAnimationFrame(loop)
    }
  }

  const handlePointerEnter = (e: React.PointerEvent, project: Project) => {
    if (e.pointerType !== 'mouse') return

    if (!wasActiveRef.current) {
      wasActiveRef.current = true
      setBootId((b) => b + 1)
      setIsGlitchHop(false)
    } else {
      setIsGlitchHop(true)
    }

    setActiveProject(project)
    aim(e.clientX, e.clientY)

    const pv = pvRef.current
    if (pv) {
      if (!pv.classList.contains('is-on')) {
        motionRef.current.x = motionRef.current.tx
        motionRef.current.y = motionRef.current.ty
      }
      pv.classList.add('is-on')
    }

    if (!motionRef.current.running) {
      motionRef.current.running = true
      requestAnimationFrame(loop)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      aim(e.clientX, e.clientY)
    }
  }

  const handlePointerLeaveList = () => {
    wasActiveRef.current = false
    setActiveProject(null)
    setIsGlitchHop(false)

    if (pvRef.current) {
      pvRef.current.classList.remove('is-on')
    }
    motionRef.current.running = false
  }

  const handleRowFocus = (
    e: React.FocusEvent<HTMLElement>,
    project: Project
  ) => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (!wasActiveRef.current) {
      wasActiveRef.current = true
      setBootId((b) => b + 1)
      setIsGlitchHop(false)
    } else {
      setIsGlitchHop(true)
    }

    setActiveProject(project)

    // Position cabinet next to focused row
    const tx = Math.min(
      rect.left + Math.max(340, rect.width * 0.45),
      window.innerWidth - PREVIEW_RIGHT_CLEARANCE
    )
    const ty = Math.max(
      PREVIEW_TOP_MIN,
      Math.min(
        rect.top - 80,
        window.innerHeight - PREVIEW_BOTTOM_CLEARANCE
      )
    )

    motionRef.current.tx = tx
    motionRef.current.ty = ty
    motionRef.current.x = tx
    motionRef.current.y = ty

    if (pvRef.current) {
      pvRef.current.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`
      pvRef.current.classList.add('is-on')
    }
  }

  const handleRowBlur = (e: React.FocusEvent<HTMLElement>) => {
    // If next focused target is outside list, hide
    if (
      !listRef.current?.contains(e.relatedTarget as Node | null)
    ) {
      handlePointerLeaveList()
    }
  }

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative z-[2] p-[120px_40px_140px] narrow:p-[80px_20px_100px] border-t border-[var(--color-line)]"
    >
      <div className="whead flex justify-between items-end gap-20 mb-56 narrow:flex-col narrow:items-start">
        <h2
          id="work-title"
          className="m-0 font-[800] text-section font-disp font-stretch-125"
        >
          Selected work
          <sup className="font-mono text-[0.22em] text-[var(--color-neon)] tracking-normal align-top ml-[0.4em]">
            (04)
          </sup>
        </h2>
        <p className="mono text-mut text-right narrow:text-left m-0">
          2023 &mdash; 2024
          <br />
          {isTouch ? 'tap a row to start the game' : 'hover a row to start the game'}
        </p>
      </div>

      <div
        ref={listRef}
        id="list"
        className="work-list border-t border-[var(--color-line)]"
        onPointerLeave={handlePointerLeaveList}
      >
        {projects.map((p, i) => (
          <WorkRow
            key={p.slug}
            project={p}
            index={i}
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onRowFocus={handleRowFocus}
            onRowBlur={handleRowBlur}
          />
        ))}
      </div>

      <div className="wfoot mono flex justify-between items-center mt-36 text-mut">
        <span>every number on this page is a real result from my projects and internship</span>
        <a
          className="cta"
          href="https://github.com/soliman-ahmed"
          target="_blank"
          rel="noopener noreferrer"
        >
          all projects on github <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <FloatingPreview
        ref={pvRef}
        innerRef={innerRef}
        activeProject={activeProject}
        bootId={bootId}
        isGlitchHop={isGlitchHop}
      />
    </section>
  )
}
