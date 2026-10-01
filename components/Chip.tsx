interface ChipProps {
  label: string
  className?: string
}

export default function Chip({ label, className = '' }: ChipProps) {
  return (
    <span
      className={`
        inline-flex items-center
        font-mono text-xs tracking-wider uppercase
        px-3 py-1
        rounded-full
        border border-[var(--brass-soft)]
        text-[var(--text-muted)]
        bg-[var(--surface)]
        transition-colors duration-250 ease-arch
        ${className}
      `}
    >
      {label}
    </span>
  )
}
