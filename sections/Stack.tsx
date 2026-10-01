import Reveal from '@/components/Reveal'
import Chip from '@/components/Chip'
import { stack } from '@/data/stack'

export default function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      className="section-padding"
    >
      <div className="container-main">
        <Reveal className="mb-12">
          <p className="mono-label mb-3">{'03 \u2014 Stack'}</p>
          <h2
            id="stack-heading"
            className="
              font-serif
              text-[clamp(2rem,4vw,3.5rem)]
              font-semibold leading-tight tracking-tight
              text-[var(--text-primary)]
            "
          >
            Tools of the trade.
          </h2>
        </Reveal>

        <div className="space-y-8">
          {stack.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.08}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Group label */}
                <div className="sm:w-36 shrink-0">
                  <span className="mono-label text-[var(--brass)]">{group.label}</span>
                </div>
                {/* Chips */}
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Chip key={item} label={item} />
                  ))}
                </div>
              </div>
              {/* Hairline */}
              <hr className="hairline mt-8" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
