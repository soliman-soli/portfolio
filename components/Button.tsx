import React from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  as?: 'button' | 'a'
  href?: string
  children: React.ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--emerald)] text-[var(--paper)] font-medium
    hover:bg-[var(--emerald-deep)] hover:shadow-card-hover
    focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2
  `,
  outline: `
    border border-[var(--brass)] text-[var(--brass)] bg-transparent
    hover:bg-[var(--brass)]/10 hover:border-[var(--brass)]
    focus-visible:ring-2 focus-visible:ring-[var(--brass)] focus-visible:ring-offset-2
  `,
  ghost: `
    text-[var(--text-muted)] bg-transparent
    hover:text-[var(--text-primary)] hover:bg-[var(--surface)]
    focus-visible:ring-2 focus-visible:ring-[var(--brass)] focus-visible:ring-offset-2
  `,
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const classes = `
    inline-flex items-center gap-2
    rounded-[8px] font-sans tracking-wide
    transition-all duration-250 ease-arch
    cursor-pointer
    ${VARIANT_CLASSES[variant]}
    ${SIZE_CLASSES[size]}
    ${className}
  `

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
