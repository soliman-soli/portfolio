'use client'

import { useEffect, useState, type RefObject } from 'react'

/**
 * Becomes true the first time `ref` scrolls into view, then stops observing
 * (same as the prototype's observe-once IntersectionObserver).
 * Falls back to `true` when IntersectionObserver is unavailable.
 */
export function useInView(ref: RefObject<Element | null>, threshold: number): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fallback for old browsers
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])

  return inView
}
