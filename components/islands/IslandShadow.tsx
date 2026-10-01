/**
 * IslandShadow.tsx
 *
 * Renders the elliptical drop shadow beneath a floating island.
 * Kept as a separate component so it can be positioned independently
 * from the island group, allowing the shadow to stay at ground level
 * while the island floats upward.
 *
 * The shadow element carries the inverse animation of the island float:
 * when the island is at its highest point, the shadow is smallest and most faded.
 */

interface IslandShadowProps {
  alt?: boolean
}

export default function IslandShadow({ alt = false }: IslandShadowProps) {
  return (
    <div
      className={`${alt ? 'island-shadow-el-alt' : 'island-shadow-el'}`}
      aria-hidden="true"
      style={{
        width: '70%',
        height: '12px',
        margin: '0 auto',
        background: 'radial-gradient(ellipse at center, rgba(10, 51, 39, 0.35) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }}
    />
  )
}
