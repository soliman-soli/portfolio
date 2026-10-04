import type { ReactNode } from 'react'
import Link from 'next/link'

interface CtaProps {
  href: string
  children: ReactNode
  className?: string
}

export function Cta({ href, children, className = '' }: CtaProps) {
  return (
    <Link href={href} className={`cta ${className}`}>
      {children}
    </Link>
  )
}
