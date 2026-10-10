'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { ARCADE_CONFIG } from '@/lib/arcade/config'

function subscribeStorage(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getGemSnapshot(): boolean {
  try {
    return localStorage.getItem(ARCADE_CONFIG.STORAGE_GEM_KEY) === 'true'
  } catch {
    return false
  }
}

function getGemServerSnapshot(): boolean {
  return false
}

export function ReadyLink() {
  const hasGem = useSyncExternalStore(subscribeStorage, getGemSnapshot, getGemServerSnapshot)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col items-end narrow:items-center gap-4 text-right narrow:text-center">
      <Link
        href="/play"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={`challenge-link group relative inline-flex items-center mono text-[13px] sm:text-[13.5px] tracking-[0.12em] text-[var(--color-neon)] focus-visible:outline-2 focus-visible:outline-[var(--color-neon)] focus-visible:outline-offset-4 rounded select-none ${
          hasGem ? 'is-complete' : ''
        }`}
        aria-label="Accept the challenge and start the arcade mini-game"
      >
        {hasGem ? (
          <span>
            {isHovered ? (
              <span className="challenge-glitch-text">&#9656; 3 BOSSES. 0 MERCY.</span>
            ) : (
              <span>[ CHALLENGE COMPLETE &#10003; ]</span>
            )}
          </span>
        ) : (
          <span>
            {isHovered ? (
              <span className="challenge-glitch-text">&#9656; 3 BOSSES. 0 MERCY.</span>
            ) : (
              <span>
                [ ACCEPT THE CHALLENGE ]{' '}
                <span className="ready-cursor font-mono inline-block font-normal">▋</span>
              </span>
            )}
          </span>
        )}
      </Link>
      <span className="mono text-[11px] text-[#6e6e6a] tracking-normal select-none leading-none">
        only 1 in 10 makes it to the end
      </span>
    </div>
  )
}
