import type { CSSProperties } from 'react'

/**
 * Typed helper for inline CSS custom properties, e.g. `style={cssVars({ '--i': 2 })}`.
 * React accepts custom properties in `style`, but TypeScript needs the cast.
 */
export function cssVars(vars: Record<`--${string}`, string | number>): CSSProperties {
  return vars as CSSProperties
}
