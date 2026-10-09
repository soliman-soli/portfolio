'use client'

import { useEffect } from 'react'

interface FocusHeadingProps {
  targetId?: string
}

/**
 * Tiny client component that focuses the project page's <h1> on mount,
 * ensuring seamless keyboard and screen reader accessibility without
 * turning the route into a client component.
 */
export function FocusHeading({ targetId = 'project-heading' }: FocusHeadingProps) {
  useEffect(() => {
    const el = document.getElementById(targetId)
    if (el) {
      el.focus({ preventScroll: true })
    }
  }, [targetId])

  return null
}
