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
    <Link
      href="/play"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="ready-link group relative inline-flex items-center mono text-[12px] text-[var(--color-neon)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-[var(--color-neon)] focus-visible:outline-offset-4 rounded transition-all select-none"
      aria-label="Start the arcade mini-game"
    >
      {hasGem ? (
        <span>
          {isHovered ? (
            <span className="ready-glitch-text">Ready? &#9656; play again</span>
          ) : (
            <span>Ready? &#10003; gem collected</span>
          )}
        </span>
      ) : (
        <span>
          {isHovered ? (
            <span className="ready-glitch-text">Ready? &#9656; press start</span>
          ) : (
            <span>
              Ready? <span className="ready-cursor font-mono inline-block">▋</span>
            </span>
          )}
        </span>
      )}
    </Link>
  )
}
