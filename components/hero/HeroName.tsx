import { cssVars } from '@/lib/css'

const NAME = 'SOLIMAN'

export function HeroName() {
  return (
    <h1
      className="m-0 font-[800] text-hero font-disp font-stretch-125 whitespace-nowrap"
      aria-label="Soliman"
    >
      {NAME.split('').map((ch, i) => (
        <span key={i} className="mask" aria-hidden="true">
          <span style={cssVars({ '--i': i })}>{ch}</span>
        </span>
      ))}
      <span className="mask text-[var(--color-neon)]" aria-hidden="true">
        <span style={cssVars({ '--i': 7 })}>.</span>
      </span>
    </h1>
  )
}
