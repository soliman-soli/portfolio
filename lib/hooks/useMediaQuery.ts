'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Subscribes to a CSS media query. Returns `serverValue` during SSR and
 * hydration, then the real value, so server and client markup always match.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

/** One-off check, for event handlers that should read the current value. */
export function matchesMedia(query: string): boolean {
  return typeof window !== 'undefined' && window.matchMedia(query).matches
}

export const HOVER_NONE = '(hover: none)'
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
