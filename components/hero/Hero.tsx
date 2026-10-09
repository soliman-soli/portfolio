'use client'

import Link from 'next/link'
import { HeroName } from './HeroName'
import { cssVars } from '@/lib/css'

interface HeroProps {
  onReplay?: () => void
}

export function Hero({ onReplay }: HeroProps) {
  return (
    <header className="relative min-h-[100svh] flex flex-col justify-between p-[44px_40px_40px] narrow:p-[36px_20px_28px] z-[2]">
      {/* Nav */}
      <nav
        className="reveal-fade flex justify-between items-center gap-16"
        style={cssVars({ '--d': 0.1 })}
        aria-label="Main"
      >
        <Link
          href="/"
          className="font-[800] text-logo font-disp font-stretch-125"
          aria-label="Soliman home"
        >
          S<i className="text-[var(--color-neon)] not-italic">/</i>
        </Link>
        <div className="links mono flex gap-28 narrow:hidden">
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
        <span className="mono status inline-flex items-center gap-9 border border-[var(--color-line)] rounded-pill px-14 py-6 text-ink pulse-dot">
          open to backend &amp; AI roles
        </span>
      </nav>

      {/* Hero Body */}
      <div>
        <div className="mid grid grid-cols-[1fr_auto] narrow:grid-cols-1 gap-32 items-end mb-18">
          <p
            className="reveal-fade role text-mut max-w-[34ch] m-0"
            style={cssVars({ '--d': 0.25 })}
          >
            Computer engineering student building{' '}
            <em className="text-ink not-italic">
              backends and AI systems
            </em>
            : RAG pipelines, fast APIs, and tools that feel like finished products.
          </p>
          <div
            className="reveal-fade stack mono flex flex-col gap-4 text-mut text-right narrow:text-left"
            style={cssVars({ '--d': 0.35 })}
          >
            <span>
              <b className="text-ink font-normal">Python</b> / FastAPI
            </span>
            <span>
              <b className="text-ink font-normal">LangChain</b> / Qdrant
            </span>
            <span>
              <b className="text-ink font-normal">React</b> / Docker
            </span>
          </div>
        </div>

        <HeroName />

        <div
          className="reveal-fade foot mono flex justify-between items-center mt-26 pt-16 border-t border-[var(--color-line)] text-mut narrow:flex-col narrow:items-start narrow:gap-12"
          style={cssVars({ '--d': 0.5 })}
        >
          <a className="cta" href="#work">
            view selected work <span aria-hidden="true">&rarr;</span>
          </a>
          <span>lv.03 &middot; portfolio 2026</span>
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
