'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'

interface HeroPortraitCardProps {
  imageSrc?: string
  altText?: string
  className?: string
}

export default function HeroPortraitCard({
  imageSrc = '/soliman.jpg',
  altText = `${profile.name} — ${profile.title}`,
  className = '',
}: HeroPortraitCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Mouse coordinate values normalized between -0.5 and 0.5
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for buttery-smooth 3D tilt response
  const springConfig = { damping: 22, stiffness: 260, mass: 0.6 }
  const mouseXSpring = useSpring(x, springConfig)
  const mouseYSpring = useSpring(y, springConfig)

  // 3D rotation transforms (max ~14 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [14, -14])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-14, 14])

  // Dynamic glare / specular light tracking
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Normalize between -0.5 and 0.5
    const xPct = mouseX / rect.width - 0.5
    const yPct = mouseY / rect.height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const [cacheBuster, setCacheBuster] = useState('')

  useEffect(() => {
    setCacheBuster(`?v=${Date.now()}`)
  }, [])

  const resolvedSrc = cacheBuster ? `${imageSrc}${cacheBuster}` : imageSrc
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* Background ambient aura / glow */}
      <motion.div
        className="absolute inset-0 -m-6 rounded-full blur-3xl pointer-events-none"
        animate={{
          opacity: isHovered ? 0.45 : 0.25,
          scale: isHovered ? 1.08 : 0.98,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'radial-gradient(circle, rgba(15, 76, 58, 0.35) 0%, rgba(176, 141, 87, 0.22) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Main 3D Tilting Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-56 sm:w-64 md:w-72 aspect-[4/5] rounded-2xl p-2 cursor-pointer select-none"
      >
        {/* Outer glassmorphic frame */}
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
          style={{
            background:
              'linear-gradient(145deg, rgba(251, 248, 241, 0.9) 0%, rgba(247, 243, 234, 0.75) 100%)',
            border: '1px solid rgba(176, 141, 87, 0.4)',
            boxShadow: isHovered
              ? '0 24px 50px -12px rgba(10, 51, 39, 0.28), 0 0 24px rgba(176, 141, 87, 0.2)'
              : '0 16px 36px -10px rgba(10, 51, 39, 0.16)',
          }}
        >
          {/* Subtle architectural grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, var(--ink) 1px, transparent 1px),
                                linear-gradient(to bottom, var(--ink) 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
            }}
            aria-hidden="true"
          />

          {/* Picture Container with 3D translation */}
          <div
            className="relative w-full h-full rounded-xl overflow-hidden"
            style={{
              transform: 'translateZ(25px)',
            }}
          >
            {!imageError ? (
              <Image
                src={resolvedSrc}
                alt={altText}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 240px, 300px"
                onError={() => setImageError(true)}
                className="object-cover object-top transition-transform duration-500 ease-out"
                style={{
                  transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                }}
              />
            ) : (
              /* Fallback aesthetic if photo file is not found */
              <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--surface)] text-[var(--ink)] p-6 text-center">
                <div className="w-16 h-16 rounded-full border border-[var(--brass)] flex items-center justify-center mb-3 text-xl font-bold font-serif text-[var(--emerald)]">
                  {profile.monogram}
                </div>
                <p className="font-serif font-semibold text-lg">{profile.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Place photo at <code className="text-[var(--emerald)]">/public/soliman.jpg</code>
                </p>
              </div>
            )}

            {/* Subtle gradient vignette to blend edges cleanly */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(16, 32, 27, 0.45) 0%, rgba(16, 32, 27, 0) 35%, rgba(16, 32, 27, 0.1) 100%)',
              }}
              aria-hidden="true"
            />

            {/* Specular glare shine overlay */}
            <motion.div
              className="absolute -inset-[100%] pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 0.35 : 0,
                background: `radial-gradient(circle 320px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.75), transparent 70%)`,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Corner Tech/Architectural Brackets */}
          <div
            className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[var(--brass)] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[var(--brass)] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[var(--brass)] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[var(--brass)] pointer-events-none"
            aria-hidden="true"
          />

          {/* Floating Status / Identity Chip in 3D space */}
          <div
            className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none"
            style={{
              transform: 'translateZ(45px)',
            }}
          >
            <div
              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs backdrop-blur-md shadow-md"
              style={{
                background: 'rgba(251, 248, 241, 0.88)',
                border: '1px solid rgba(176, 141, 87, 0.35)',
                color: 'var(--ink)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="font-mono text-[10px] tracking-wider uppercase font-medium text-[var(--emerald-deep)]">
                  Available
                </span>
              </div>
              <span className="font-mono text-[10px] text-[var(--brass)] tracking-wide">
                SYS.ENG
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
