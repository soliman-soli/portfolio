'use client'

/**
 * FloatingIsland.tsx
 *
 * The main island orchestrator component.
 * Renders the correct variant SVG, wraps it in float/shadow animation classes,
 * and optionally wires up Framer Motion scroll parallax for depth layering.
 *
 * Props:
 *   variant — which island to show: 'server' | 'automation' | 'blueprint' | 'desktop'
 *   size    — 'sm' | 'md' | 'lg' controls SVG width
 *   alt     — if true, uses the "alt" float animation (different speed/delay)
 *             to stagger multiple islands on the same page
 *   className — additional positioning classes (e.g. absolute top-0 right-8)
 *
 * All islands are aria-hidden and pointer-events-none to text regions.
 * Hover animations are CSS-only via .island-wrapper:hover selectors in islands.css.
 */

import './islands.css'
import IslandShadow from './IslandShadow'
import ServerIsland from './variants/ServerIsland'
import AutomationIsland from './variants/AutomationIsland'
import BlueprintIsland from './variants/BlueprintIsland'
import DesktopIsland from './variants/DesktopIsland'

export type IslandVariant = 'server' | 'automation' | 'blueprint' | 'desktop'
export type IslandSize = 'sm' | 'md' | 'lg'

const VARIANT_MAP: Record<IslandVariant, React.ComponentType> = {
  server: ServerIsland,
  automation: AutomationIsland,
  blueprint: BlueprintIsland,
  desktop: DesktopIsland,
}

const SIZE_CLASS: Record<IslandSize, string> = {
  sm: 'island-sm',
  md: 'island-md',
  lg: 'island-lg',
}

interface FloatingIslandProps {
  variant: IslandVariant
  size?: IslandSize
  alt?: boolean
  className?: string
}

export default function FloatingIsland({
  variant,
  size = 'md',
  alt = false,
  className = '',
}: FloatingIslandProps) {
  const IslandVariantComponent = VARIANT_MAP[variant]
  const floatClass = alt ? 'island-float-alt' : 'island-float'

  return (
    <div
      className={`island-wrapper select-none ${SIZE_CLASS[size]} ${className}`}
      aria-hidden="true"
    >
      {/* Island SVG floats up/down */}
      <div className={floatClass}>
        <IslandVariantComponent />
      </div>
      {/* Shadow stays at ground level, pulses inversely */}
      <IslandShadow alt={alt} />
    </div>
  )
}
