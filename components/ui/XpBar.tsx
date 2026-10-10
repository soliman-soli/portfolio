import { XP_SEGMENTS } from '@/content/projects'
import { cssVars } from '@/lib/css'

interface XpBarProps {
  xp: number
  max?: number
  className?: string
}

export function XpBar({ xp, max = XP_SEGMENTS, className = '' }: XpBarProps) {
  return (
    <div className={`xp ${className}`} aria-hidden="true">
      {Array.from({ length: max }, (_, i) => (
        <b
          key={i}
          className={i < xp ? 'f' : undefined}
          style={cssVars({ '--p': i })}
        />
      ))}
    </div>
  )
}

