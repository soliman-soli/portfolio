'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ARCADE_CONFIG } from '@/lib/arcade/config'
import { sound } from '@/lib/arcade/audio'
import { links } from '@/content/links'

interface RewardProps {
  score: number
  onRestart: () => void
}

const HEX_CHARS = '0123456789ABCDEF!#$*~'
const TARGET_FLAG = ARCADE_CONFIG.FLAG_CODE

export function Reward({ score, onRestart }: RewardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayedFlag, setDisplayedFlag] = useState('')
  const [isDecrypted, setIsDecrypted] = useState(false)
  const [copied, setCopied] = useState(false)

  // Save to localStorage once reward unlocks
  useEffect(() => {
    try {
      localStorage.setItem(ARCADE_CONFIG.STORAGE_GEM_KEY, 'true')
    } catch {
      // Ignore private browsing quota errors
    }
  }, [])

  const handleOpenGem = useCallback(() => {
    if (isOpen) return
    setIsOpen(true)
    sound.playClear()

    // Scrambled hex decryption animation
    const len = TARGET_FLAG.length
    let step = 0
    const totalSteps = 24

    const interval = setInterval(() => {
      step++
      sound.playTyping()

      // Calculate how many characters are resolved
      const resolvedCount = Math.floor((step / totalSteps) * len)
      let scramble = TARGET_FLAG.slice(0, resolvedCount)

      for (let i = resolvedCount; i < len; i++) {
        scramble += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
      }

      setDisplayedFlag(scramble)

      if (step >= totalSteps) {
        clearInterval(interval)
        setDisplayedFlag(TARGET_FLAG)
        setIsDecrypted(true)
        sound.playClear()
      }
    }, 70)
  }, [isOpen])

  // Listen for Enter / Space key to trigger decryption
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        handleOpenGem()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleOpenGem])

  const handleCopyFlag = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(TARGET_FLAG).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-16 sm:p-24 bg-[#070708]/95 backdrop-blur-sm text-center mono">
      {!isOpen ? (
        /* The Floating Glowing Gem / Private Key Container */
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpenGem}
          className="group flex flex-col items-center gap-16 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-neon)] rounded-xl p-16 transition-transform hover:scale-105"
          aria-label="Decrypt the captured private key CTF gem"
        >
          {/* Pixel Gem Graphic */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-bounce">
            <svg
              viewBox="0 0 32 32"
              className="w-full h-full drop-shadow-[0_0_18px_rgba(204,255,46,0.85)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Gem Facets */}
              <polygon points="16,2 30,12 16,30 2,12" fill="#070708" stroke="#CCFF2E" strokeWidth="2" />
              {/* Core Facets */}
              <polygon points="16,6 26,13 16,26 6,13" fill="rgba(204,255,46,0.25)" stroke="#CCFF2E" strokeWidth="1" />
              <polygon points="16,6 16,26" stroke="#CCFF2E" strokeWidth="1" />
              <line x1="6" y1="13" x2="26" y2="13" stroke="#CCFF2E" strokeWidth="1" />
              {/* Keyhole / Cyber Accent */}
              <circle cx="16" cy="14" r="2" fill="#EDEDE8" />
              <rect x="15" y="14" width="2" height="4" fill="#EDEDE8" />
            </svg>
          </div>

          <div className="flex flex-col gap-4 text-center">
            <span className="text-[var(--color-neon)] font-medium text-[13px] sm:text-[14px] tracking-wider uppercase">
              [ PRIVKEY_FLAG.ENC CAPTURED ]
            </span>
            <span className="text-mut text-[11px] group-hover:text-ink transition-colors">
              CLICK OR PRESS [ENTER] TO DECRYPT
            </span>
          </div>
        </div>
      ) : (
        /* Decrypted Flag & Punchline Screen */
        <div className="w-full max-w-[560px] flex flex-col items-center gap-14 sm:gap-18 animate-fadeIn">
          {/* Status Badge */}
          <span className="text-[var(--color-neon)] text-[11px] tracking-widest uppercase">
            {isDecrypted ? '✓ DECRYPTION COMPLETE' : '⚡ DECRYPTING SEED MATRIX...'}
          </span>

          {/* CTF Flag Box */}
          <div className="w-full flex items-center justify-between gap-12 bg-[#0d0d0f] border border-[var(--color-line)] p-12 sm:p-14 rounded-md">
            <span className="text-ink text-[12px] sm:text-[14px] font-mono tracking-wider break-all select-all">
              {displayedFlag}
            </span>
            {isDecrypted && (
              <button
                type="button"
                onClick={handleCopyFlag}
                className="shrink-0 px-8 py-4 text-[10px] sm:text-[11px] bg-[var(--color-card)] hover:bg-[var(--color-art)] border border-[var(--color-line)] hover:border-[var(--color-neon)] text-[var(--color-neon)] rounded cursor-pointer transition-colors"
                title="Copy flag to clipboard"
              >
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            )}
          </div>

          {/* Congratulations Punchlines */}
          {isDecrypted && (
            <div className="flex flex-col gap-8 text-center mt-4">
              <p className="m-0 text-ink text-[12px] sm:text-[13px] leading-relaxed max-w-[44ch] font-medium">
                THANK YOU, PLAYER! BUT THE NEXT INTERVIEW IS IN ANOTHER CASTLE.
              </p>
              <p className="m-0 text-mut text-[11px] uppercase tracking-widest">
                A WINNER IS YOU. (FINAL SCORE: {score})
              </p>
            </div>
          )}

          {/* Real Subtle CTAs */}
          {isDecrypted && (
            <div className="flex flex-wrap items-center justify-center gap-16 sm:gap-24 pt-10 border-t border-[var(--color-line)] w-full text-[12px]">
              <a
                href={links.mailto}
                className="text-[var(--color-neon)] hover:underline flex items-center gap-4"
              >
                hire me &rarr;
              </a>
              <a
                href={links.cv}
                download
                className="text-ink hover:text-[var(--color-neon)] transition-colors"
              >
                download CV
              </a>
              <Link
                href="/"
                className="text-mut hover:text-ink transition-colors"
              >
                back to site
              </Link>
              <button
                type="button"
                onClick={onRestart}
                className="text-mut hover:text-[var(--color-neon)] transition-colors cursor-pointer"
              >
                play again &#8635;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
