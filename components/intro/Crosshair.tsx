'use client'

import { useEffect, useRef } from 'react'
import { CROSSHAIR_DIGITS, CROSSHAIR_READOUT_OFFSET } from '@/lib/motion'

export function Crosshair() {
  const hxRef = useRef<HTMLDivElement>(null)
  const vxRef = useRef<HTMLDivElement>(null)
  const rdRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    let mx = 0
    let my = 0

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      document.documentElement.setAttribute('data-mouse', '')
      mx = e.clientX
      my = e.clientY

      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0
          if (hxRef.current) {
            hxRef.current.style.transform = `translateY(${my}px)`
          }
          if (vxRef.current) {
            vxRef.current.style.transform = `translateX(${mx}px)`
          }
          if (rdRef.current) {
            rdRef.current.style.transform = `translate(${mx + CROSSHAIR_READOUT_OFFSET}px, ${my + CROSSHAIR_READOUT_OFFSET}px)`
            rdRef.current.textContent = `x ${String(mx).padStart(CROSSHAIR_DIGITS, '0')}  y ${String(my).padStart(CROSSHAIR_DIGITS, '0')}`
          }
        })
      }
    }

    const onMouseLeave = () => {
      document.documentElement.removeAttribute('data-mouse')
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={hxRef} className="crosshair-h" aria-hidden="true" />
      <div ref={vxRef} className="crosshair-v" aria-hidden="true" />
      <div ref={rdRef} className="crosshair-readout mono" aria-hidden="true" />
    </>
  )
}
