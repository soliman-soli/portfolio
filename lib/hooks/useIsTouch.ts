'use client'

import { HOVER_NONE, useMediaQuery } from './useMediaQuery'

/**
 * True on touch-first devices (`hover: none`). The prototype used this to
 * switch rows from "hover to preview" to "tap to expand".
 */
export function useIsTouch(): boolean {
  return useMediaQuery(HOVER_NONE)
}
