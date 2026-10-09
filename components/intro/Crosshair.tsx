'use client'

import { useEffect, useRef } from 'react'
import { CROSSHAIR_DIGITS, CROSSHAIR_READOUT_OFFSET } from '@/lib/motion'

interface CrosshairProps {
  heroRef: React.RefObject<HTMLElement | null>
}

export function Crosshair({ heroRef }: CrosshairProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const hxRef = useRef<HTMLDivElement>(null)
  const vxRef = useRef<HTMLDivElement>(null)
  const rdRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    let lastClientX = -1
    let lastClientY = -1
    let relX = 0
    let relY = 0
    let isActive = false

    const setActive = (active: boolean) => {
      if (isActive !== active) {
        isActive = active
        wrapRef.current?.classList.toggle('is-active', active)
      }
    }

    const scheduleRaf = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0
          if (hxRef.current) {
            hxRef.current.style.transform = `translateY(${relY}px)`
          }
          if (vxRef.current) {
            vxRef.current.style.transform = `translateX(${relX}px)`
          }
          if (rdRef.current) {
            rdRef.current.style.transform = `translate(${relX + CROSSHAIR_READOUT_OFFSET}px, ${relY + CROSSHAIR_READOUT_OFFSET}px)`
            const padX = String(Math.max(0, relX)).padStart(CROSSHAIR_DIGITS, '0')
            const padY = String(Math.max(0, relY)).padStart(CROSSHAIR_DIGITS, '0')
            rdRef.current.textContent = `x ${padX}  y ${padY}`
          }
        })
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      document.documentElement.setAttribute('data-mouse', '')

      lastClientX = e.clientX
      lastClientY = e.clientY

      const hero = heroRef.current
      if (!hero) {
        setActive(false)
        return
      }

      const rect = hero.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!inside) {
        setActive(false)
        return
      }

      relX = Math.round(e.clientX - rect.left)
      relY = Math.round(e.clientY - rect.top)
      setActive(true)
      scheduleRaf()
    }

    const onScroll = () => {
      const hero = heroRef.current
      if (!hero) {
        setActive(false)
        return
      }

      const rect = hero.getBoundingClientRect()
      const inside =
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        lastClientX >= rect.left &&
        lastClientX <= rect.right &&
        lastClientY >= rect.top &&
        lastClientY <= rect.bottom

      if (!inside) {
        setActive(false)
        return
      }

      relX = Math.round(lastClientX - rect.left)
      relY = Math.round(lastClientY - rect.top)
      setActive(true)
      scheduleRaf()
    }

    const onMouseLeave = () => {
      document.documentElement.removeAttribute('data-mouse')
      setActive(false)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('blur', onMouseLeave)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('blur', onMouseLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [heroRef])

  return (
    <div ref={wrapRef} className="crosshair-wrap" aria-hidden="true">
      <div ref={hxRef} className="crosshair-h" />
      <div ref={vxRef} className="crosshair-v" />
      <div ref={rdRef} className="crosshair-readout mono" />
    </div>
  )
}
