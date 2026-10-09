'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { HeroName } from './HeroName'
import { Crosshair } from '@/components/intro/Crosshair'
import { cssVars } from '@/lib/css'

interface HeroProps {
  onReplay?: () => void
}

export function Hero({ onReplay }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)

  return (
    <header
      ref={heroRef}
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-between p-[44px_40px_40px] narrow:p-[36px_20px_28px] z-[2] overflow-hidden"
    >
      <Crosshair heroRef={heroRef} />

      {/* Nav */}
      <nav
        className="reveal-fade grid grid-cols-[1fr_auto_1fr] items-center gap-16 narrow:flex narrow:justify-between"
        style={cssVars({ '--d': 0.1 })}
        aria-label="Main"
      >
        <Link
          href="/"
          className="font-[800] text-logo font-disp font-stretch-125 justify-self-start"
          aria-label="Soliman home"
        >
          S<i className="text-[var(--color-neon)] not-italic">/</i>
        </Link>
        <div className="links mono flex gap-28 narrow:hidden justify-center">
          <a href="#work" className="nav-link">
            work
          </a>
          <a href="#about" className="nav-link">
            about
          </a>
          <a href="#contact" className="nav-link">
            contact
          </a>
        </div>
        <div className="narrow:hidden" aria-hidden="true" />
      </nav>

      {/* Hero Body */}
      <div>
        <div className="mid mb-18">
          <p
            className="reveal-fade role text-mut max-w-[34ch] m-0"
            style={cssVars({ '--d': 0.25 })}
          >
            Software engineer building{' '}
            <em className="text-ink not-italic">
              backends and AI systems
            </em>
            : RAG pipelines, fast APIs, and tools that feel like finished products.
          </p>
        </div>

        <HeroName />

        <div
          className="reveal-fade foot mono flex justify-between items-center mt-26 pt-16 border-t border-[var(--color-line)] text-mut narrow:flex-col narrow:items-start narrow:gap-12"
          style={cssVars({ '--d': 0.5 })}
        >
          <a className="cta" href="#work">
            view selected work <span aria-hidden="true">&rarr;</span>
          </a>
          <button
            className="replay"
            type="button"
            onClick={onReplay}
          >
            &#8635; replay intro
          </button>
        </div>
      </div>
    </header>
  )
}
