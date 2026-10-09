import type { ProjectSprite } from '@/content/projects'

interface PixelSpriteProps {
  sprite: ProjectSprite
  className?: string
}

export function PixelSprite({ sprite, className = '' }: PixelSpriteProps) {
  return (
    <div
      className={`pixel-sprite pixel-sprite--${sprite} ${className}`}
      aria-hidden="true"
    >
      {sprite === 'repos' && (
        <div className="sprite-repos">
          {/* 3x3 grid of file squares */}
          <div className="repos-grid">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="repo-sq" />
            ))}
          </div>
          {/* Funnel connector */}
          <div className="repos-funnel">
            <span className="fn-bar" />
            <span className="fn-arrow" />
          </div>
          {/* Output report card */}
          <div className="repos-report">
            <span className="rep-line rep-head" />
            <span className="rep-line" />
            <span className="rep-line" />
          </div>
        </div>
      )}

      {sprite === 'vectors' && (
        <div className="sprite-vectors">
          {/* Coordinate plane dots */}
          <span className="vec-dot dot-bg d1" />
          <span className="vec-dot dot-bg d2" />
          <span className="vec-dot dot-bg d3" />
          <span className="vec-dot dot-bg d4" />
          <span className="vec-dot dot-bg d5" />
          {/* Target cluster */}
          <div className="vec-cluster">
            <span className="vec-dot dot-target" />
            <span className="vec-dot dot-nn n1" />
            <span className="vec-dot dot-nn n2" />
            <span className="vec-dot dot-nn n3" />
            <span className="cluster-radius" />
          </div>
        </div>
      )}

      {sprite === 'tenants' && (
        <div className="sprite-tenants">
          {/* 3 isolated tenant blocks */}
          <div className="tenant-box">
            <div className="padlock">
              <span className="shackle" />
              <span className="body" />
            </div>
          </div>
          <div className="tenant-box active">
            <div className="padlock">
              <span className="shackle neon" />
              <span className="body neon" />
            </div>
          </div>
          <div className="tenant-box">
            <div className="padlock">
              <span className="shackle" />
              <span className="body" />
            </div>
          </div>
        </div>
      )}

      {sprite === 'bars' && (
        <div className="sprite-bars">
          {/* 5-bar chart with visibly shorter neon deficit bar */}
          <div className="chart-bars">
            <span className="chart-bar b1" />
            <span className="chart-bar b2" />
            <span className="chart-bar b3 deficit" />
            <span className="chart-bar b4" />
            <span className="chart-bar b5" />
          </div>
          <div className="chart-axis" />
        </div>
      )}
    </div>
  )
}
