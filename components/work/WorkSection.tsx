'use client'

import { useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { projects, type Project } from '@/content/projects'
import { WorkRow } from './WorkRow'
import { FloatingPreview } from './FloatingPreview'
import { PreviewCard } from './PreviewCard'
import {
  PREVIEW_LERP,
  PREVIEW_OFFSET_X,
  PREVIEW_OFFSET_Y,
  PREVIEW_RIGHT_CLEARANCE,
  PREVIEW_TOP_MIN,
  PREVIEW_BOTTOM_CLEARANCE,
} from '@/lib/motion'

export function WorkSection() {
  const listRef = useRef<HTMLDivElement>(null)
  const pvRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const cardRootRef = useRef<Root | null>(null)

  // Motion coordinates
  const motionRef = useRef({
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    running: false,
  })

  const aim = (clientX: number, clientY: number) => {
    const tx = Math.min(clientX + PREVIEW_OFFSET_X, window.innerWidth - PREVIEW_RIGHT_CLEARANCE)
    const ty = Math.max(
      PREVIEW_TOP_MIN,
      Math.min(clientY + PREVIEW_OFFSET_Y, window.innerHeight - PREVIEW_BOTTOM_CLEARANCE)
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

    // Render PreviewCard inside cardRef using createRoot or simple state
    if (cardRef.current) {
      if (!cardRootRef.current) {
        cardRootRef.current = createRoot(cardRef.current)
      }
      cardRootRef.current.render(<PreviewCard project={project} showArt={true} />)
    }

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
    if (pvRef.current) {
      pvRef.current.classList.remove('is-on')
    }
    motionRef.current.running = false
  }

  return (
    <section id="work" aria-labelledby="work-title" className="relative z-[2] p-[120px_40px_140px] narrow:p-[80px_20px_100px] border-t border-[var(--color-line)]">
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
          2025 &mdash; 2026
          <br />
          hover a row to preview
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
          />
        ))}
      </div>

      <div className="wfoot mono flex justify-between items-center mt-36 text-mut">
        <span>placeholder projects, swap in the real ones</span>
        <a className="cta" href="#">
          all projects on github <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <FloatingPreview ref={pvRef} innerRef={innerRef} cardRef={cardRef} />
    </section>
  )
}
