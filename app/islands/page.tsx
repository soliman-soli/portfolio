/**
 * Islands preview page — /islands
 *
 * Shows all 4 island variants at all 3 sizes in both themes.
 * Only used during development. Can be deleted before production.
 */
import FloatingIsland from '@/components/islands/FloatingIsland'

const VARIANTS = ['server', 'automation', 'blueprint', 'desktop'] as const
const SIZES = ['sm', 'md', 'lg'] as const

export default function IslandsPreview() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3rem' }}>
      <h1 style={{ fontFamily: 'var(--font-fraunces)', color: 'var(--text-primary)', marginBottom: '2rem' }}>
        Island System Preview
      </h1>

      {VARIANTS.map((variant) => (
        <section key={variant} style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '1.5rem' }}>
            {variant}
          </h2>
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {SIZES.map((size, i) => (
              <div key={size} style={{ textAlign: 'center' }}>
                <FloatingIsland variant={variant} size={size} alt={i % 2 === 1} />
                <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {size}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
