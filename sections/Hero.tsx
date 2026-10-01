'use client'

import { motion } from 'framer-motion'
import Button from '@/components/Button'
import FloatingIsland from '@/components/islands/FloatingIsland'
import HeroPortraitCard from '@/components/HeroPortraitCard'
import { profile } from '@/data/profile'

// Cubic bezier as const tuple — required for Framer Motion's strict Easing type
const EASE = [0.22, 1, 0.36, 1] as const

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 pb-16"
    >
      {/* Background Framing Islands */}
      {/* Top right island (desktop) */}
      <div
        className="absolute top-[8%] right-[3%] hidden lg:block z-0 pointer-events-none"
        aria-hidden="true"
      >
        <FloatingIsland variant="server" size="md" />
      </div>

      {/* Bottom left island (desktop) */}
      <div
        className="absolute bottom-[10%] left-[3%] hidden lg:block z-0 pointer-events-none"
        aria-hidden="true"
      >
        <FloatingIsland variant="automation" size="md" alt />
      </div>

      {/* Top left subtle island for symmetrical desktop framing */}
      <div
        className="absolute top-[12%] left-[4%] hidden xl:block z-0 pointer-events-none"
        aria-hidden="true"
      >
        <FloatingIsland variant="blueprint" size="sm" />
      </div>

      {/* Mobile: background island */}
      <div
        className="absolute top-[6%] right-[2%] lg:hidden z-0 pointer-events-none"
        aria-hidden="true"
      >
        <FloatingIsland variant="desktop" size="sm" />
      </div>

      {/* Centered Content */}
      <div className="container-main relative z-10 flex flex-col items-center text-center py-12 md:py-16">
        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="max-w-4xl flex flex-col items-center"
        >
          {/* Mono label */}
          <motion.p variants={ITEM} className="mono-label mb-5">
            {'Portfolio \u2014 '}{new Date().getFullYear()}
          </motion.p>

          {/* 3D Interactive Holographic Portrait Card */}
          <motion.div
            variants={ITEM}
            className="mb-8 flex justify-center w-full"
          >
            <HeroPortraitCard />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            id="hero-heading"
            variants={ITEM}
            style={{
              fontFamily: 'var(--font-fraunces), Georgia, serif',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.75rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
              maxWidth: '52rem',
            }}
          >
            {profile.tagline}
          </motion.h1>

          {/* Supporting sentence */}
          <motion.p
            variants={ITEM}
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-muted)',
              maxWidth: '38rem',
              lineHeight: 1.7,
              marginBottom: '2.25rem',
            }}
          >
            {profile.bio.split('\n')[0]}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={ITEM} className="flex flex-wrap gap-4 items-center justify-center">
            <Button href="#work" variant="primary" size="lg">
              View work
            </Button>
            <Button href="#contact" variant="outline" size="lg">
              Contact
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--bg))',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
