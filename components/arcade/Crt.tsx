'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sound } from '@/lib/arcade/audio'

interface CrtProps {
  children: React.ReactNode
  onExit?: () => void
}

export function Crt({ children, onExit }: CrtProps) {
  const [isMuted, setIsMuted] = useState(sound.isMuted())

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute()
    setIsMuted(nextMuted)
  }

  return (
    <div className="arcade-cabinet-wrapper relative flex flex-col items-center justify-center min-h-[100dvh] bg-[#050507] p-12 sm:p-24 overflow-hidden select-none">
      {/* Top Cabinet Header Bar */}
      <div className="w-full max-w-[840px] flex items-center justify-between pb-8 border-b border-[var(--color-line)] text-mut mono text-[12px] z-20">
        <div className="flex items-center gap-10">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-neon)] animate-pulse" />
          <span className="text-ink font-medium tracking-wide">SOLIMAN-OS ARCADE // v1.0</span>
        </div>

        <div className="flex items-center gap-16">
          <button
            type="button"
            onClick={handleToggleSound}
            className="hover:text-[var(--color-neon)] transition-colors cursor-pointer flex items-center gap-6"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            <span>{isMuted ? '✕ MUTE' : '♫ AUDIO'}</span>
          </button>

          {onExit ? (
            <button
              type="button"
              onClick={onExit}
              className="hover:text-[var(--color-neon)] transition-colors cursor-pointer"
            >
              [ESC] EXIT
            </button>
          ) : (
            <Link
              href="/"
              className="hover:text-[var(--color-neon)] transition-colors"
            >
              [ESC] EXIT
            </Link>
          )}
        </div>
      </div>

      {/* Arcade CRT Monitor Bezel */}
      <div className="crt-monitor relative w-full max-w-[840px] mt-12 aspect-[16/9] max-h-[82vh] bg-[#070708] rounded-xl sm:rounded-2xl border-2 sm:border-4 border-[#1b1b22] shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(204,255,46,0.06)] overflow-hidden flex items-center justify-center">
        {/* Phosphor Vignette Glow */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 65%, rgba(0, 0, 0, 0.75) 100%)',
          }}
        />

        {/* Scanlines Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 3px)',
          }}
        />

        {/* CRT Glass Curvature Corner Shadows */}
        <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_35px_rgba(0,0,0,0.85),inset_0_0_15px_rgba(204,255,46,0.05)] rounded-inherit" />

        {/* The Viewport Content (Canvas & overlays) */}
        <div className="relative w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* Cabinet Bottom Coin Readout */}
      <div className="w-full max-w-[840px] flex items-center justify-between pt-8 text-[11px] mono text-mut z-20">
        <span>CREDITS: 01</span>
        <span>FREE PLAY // DRAG OR ARROWS TO FLY</span>
      </div>
    </div>
  )
}
