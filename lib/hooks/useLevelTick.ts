'use client'

import { useEffect, useState } from 'react'
import { useMediaQuery, REDUCED_MOTION } from './useMediaQuery'
import { LEVEL_TICK_MS } from '@/lib/motion'

/**
 * Ticks a numeric level up one by one from 0 to `target` (e.g. lv.00 -> lv.04),
 * starting after `delay` ms once `active` becomes true.
 *
 * If `prefers-reduced-motion` is active, returns `target` immediately.
 */
export function useLevelTick(
  target: number,
  active: boolean,
  delay: number = 0,
  intervalMs: number = LEVEL_TICK_MS,
): number {
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION)
  const [level, setLevel] = useState(0)

  useEffect(() => {
    if (!active || prefersReducedMotion) {
      return
    }

    let timerId: number | undefined
    let current = 0

    const delayId = window.setTimeout(() => {
      if (target <= 0) return

      current = 1
      setLevel(1)
      if (current >= target) return

      timerId = window.setInterval(() => {
        current += 1
        setLevel(current)
        if (current >= target) {
          window.clearInterval(timerId)
        }
      }, intervalMs)
    }, delay)

    return () => {
      window.clearTimeout(delayId)
      if (timerId !== undefined) {
        window.clearInterval(timerId)
      }
    }
  }, [target, active, delay, intervalMs, prefersReducedMotion])

  if (prefersReducedMotion) {
    return target
  }

  return level
}
