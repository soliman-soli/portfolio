'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from '@/lib/hooks/useInView'
import { useMediaQuery, REDUCED_MOTION } from '@/lib/hooks/useMediaQuery'

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [coinDropping, setCoinDropping] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const [countdown, setCountdown] = useState(9)
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION)
  const isIn = useInView(sectionRef, 0.15)

  // 9..0 countdown once in view, loops back to 9, stops when unlocked
  useEffect(() => {
    if (!isIn || unlocked || prefersReducedMotion) return

    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 9))
    }, 1000)

    return () => clearInterval(timer)
  }, [isIn, unlocked, prefersReducedMotion])

  const handleInsertCoin = () => {
    if (unlocked || coinDropping) return

    setCoinDropping(true)
    setTimeout(() => {
      setFlashing(true)
      setUnlocked(true)
      setCoinDropping(false)
      setTimeout(() => setFlashing(false), 300)
    }, 450)
  }

  const handleSkip = () => {
    setUnlocked(true)
  }

  const showActiveMenu = unlocked || prefersReducedMotion

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      className="relative z-[2] p-[120px_40px_40px] narrow:p-[80px_20px_32px] border-t border-[var(--color-line)]"
    >
      <div className="max-w-[960px] mx-auto flex flex-col items-center">
        {/* Accessible screen reader heading */}
        <h2 id="contact-title" className="sr-only">
          Contact
        </h2>

        {/* Arcade Screen Frame */}
        <div className="arcade-screen w-full border-2 border-[var(--color-line)] rounded-card bg-[var(--color-art)] p-[56px_40px] narrow:p-[36px_20px] relative overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Flash overlay */}
          {flashing && <div className="screen-flash-overlay" aria-hidden="true" />}

          {/* Heading in pixel font */}
          <div className="mb-20">
            <span
              className="font-pixel text-[clamp(24px,4.5vw,48px)] text-[var(--color-neon)] tracking-wider leading-none"
              aria-hidden="true"
            >
              {showActiveMenu ? "LET'S BUILD SOMETHING." : 'CONTINUE?'}
            </span>
          </div>

          {!showActiveMenu ? (
            /* Countdown and Insert Coin Gate */
            <div className="flex flex-col items-center gap-24 my-16">
              <div
                className="font-pixel text-[clamp(64px,14vw,140px)] text-[var(--color-neon)] leading-none select-none"
                aria-hidden="true"
              >
                {countdown}
              </div>

              <div className="flex flex-col items-center gap-16">
                <button
                  type="button"
                  onClick={handleInsertCoin}
                  className={`arcade-coin-btn font-pixel text-[13px] text-on-neon bg-[var(--color-neon)] px-28 py-16 rounded-block flex items-center gap-12 cursor-pointer transition-transform active:scale-95 ${
                    coinDropping ? 'coin-dropping' : ''
                  }`}
                  aria-label="Insert Coin to unlock contact menu"
                >
                  <span className="arcade-coin-shape" aria-hidden="true" />
                  <span>INSERT COIN</span>
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="mono text-[12px] text-mut hover:text-ink underline transition-colors cursor-pointer"
                >
                  skip &#9656; show contacts
                </button>
              </div>
            </div>
          ) : (
            /* Unlocked Contact Menu */
            <div className="contact-unlocked-container flex flex-col items-center gap-28 w-full max-w-[560px] my-12">
              <div className="mono text-[11px] text-[var(--color-neon)] uppercase tracking-widest border border-[var(--color-neon-dim)] px-12 py-4 rounded-pill">
                CREDIT 01 &middot; PLAYER 1 CONNECTED
              </div>

              {/* Contact menu lines */}
              <div className="contact-menu w-full flex flex-col gap-14 text-left">
                {/* Email */}
                <a
                  href="mailto:soliman.solim22@gmail.com?subject=Hello%20from%20your%20portfolio"
                  className="contact-line group"
                >
                  <span className="contact-cursor mono text-[var(--color-neon)]" aria-hidden="true">
                    &#9654;
                  </span>
                  <span className="contact-key mono text-mut w-[88px]">email</span>
                  <span className="contact-val mono text-ink group-hover:text-[var(--color-neon)] transition-colors">
                    soliman.solim22@gmail.com
                  </span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/soliman-ahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-line group"
                >
                  <span className="contact-cursor mono text-[var(--color-neon)]" aria-hidden="true">
                    &#9654;
                  </span>
                  <span className="contact-key mono text-mut w-[88px]">linkedin</span>
                  <span className="contact-val mono text-ink group-hover:text-[var(--color-neon)] transition-colors">
                    /in/soliman-ahmed
                  </span>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/soliman-ahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-line group"
                >
                  <span className="contact-cursor mono text-[var(--color-neon)]" aria-hidden="true">
                    &#9654;
                  </span>
                  <span className="contact-key mono text-mut w-[88px]">github</span>
                  <span className="contact-val mono text-ink group-hover:text-[var(--color-neon)] transition-colors">
                    /soliman-ahmed
                  </span>
                </a>

                {/* CV PDF */}
                <a
                  href="/Soliman_Ahmed_CV.pdf"
                  download
                  className="contact-line group"
                >
                  <span className="contact-cursor mono text-[var(--color-neon)]" aria-hidden="true">
                    &#9654;
                  </span>
                  <span className="contact-key mono text-mut w-[88px]">cv</span>
                  <span className="contact-val mono text-ink group-hover:text-[var(--color-neon)] transition-colors">
                    download pdf
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* High Scores Row */}
          <div className="w-full border-t border-[var(--color-line)] mt-32 pt-20 flex justify-between items-center flex-wrap gap-16 text-mut mono text-[12px]">
            <span className="text-[var(--color-neon)] font-medium">hi-score</span>
            <div className="flex gap-24 flex-wrap narrow:gap-12">
              <span>-35% API latency</span>
              <span>-70% search latency</span>
              <span>&lt;2 min candidate evaluation</span>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <footer className="w-full border-t border-[var(--color-line)] mt-64 pt-24 flex justify-between items-center text-mut mono text-[12px] narrow:flex-col narrow:gap-12 narrow:text-center">
          <span>&copy; 2026 Soliman Ahmed &middot; Cairo, Egypt</span>
          <span className="text-[var(--color-neon)]">1 credit</span>
          <a href="#" className="hover:text-ink transition-colors">
            &uarr; start over
          </a>
        </footer>
      </div>
    </section>
  )
}
