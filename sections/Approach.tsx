'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Reveal from '@/components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const


const STEPS = [
  {
    id: '01',
    title: 'Problem',
    description: 'Understand the system, its constraints, and who it serves. No solution until the problem is crisp.',
  },
  {
    id: '02',
    title: 'Architecture',
    description: 'Design the components, data flows, and integration points before writing a line of code.',
  },
  {
    id: '03',
    title: 'Automation',
    description: 'Identify every repetitive step and eliminate it — pipelines, scripts, AI agents, whatever it takes.',
  },
  {
    id: '04',
    title: 'Result',
    description: 'Ship something that runs reliably, documents itself, and can be handed to the next engineer cleanly.',
  },
]

function BlueprintFlow() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 720 120"
      className="w-full overflow-visible"
      style={{ height: 'clamp(80px, 12vw, 120px)' }}
      aria-hidden="true"
    >
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--brass)" strokeWidth="0.3" opacity="0.2" />
        </pattern>
        <marker id="flow-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polyline points="0,0 6,3 0,6" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
        </marker>
      </defs>
      <rect width="720" height="120" fill="url(#grid)" />

      {/* Connecting lines — animated in on scroll */}
      {[0, 1, 2].map((i) => {
        const x1 = 130 + i * 160
        const x2 = x1 + 30
        return (
          <motion.line
            key={i}
            x1={x1}
            y1="60"
            x2={x2 + 100}
            y2="60"
            stroke="var(--brass)"
            strokeWidth="1.5"
            markerEnd="url(#flow-arrow)"
            strokeDasharray="130"
            initial={{ strokeDashoffset: 130 }}
            animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: 130 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.25, ease: EASE }}
            opacity="0.8"
          />
        )
      })}

      {/* Step boxes */}
      {STEPS.map((step, i) => {
        const cx = 65 + i * 160
        return (
          <motion.g
            key={step.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: i * 0.15, ease: EASE }}
          >
            <rect
              x={cx - 50}
              y="30"
              width="100"
              height="60"
              rx="6"
              fill="var(--surface)"
              stroke="var(--brass)"
              strokeWidth="1"
              opacity="0.9"
            />
            <text
              x={cx}
              y="54"
              textAnchor="middle"
              style={{ fontSize: '9px', fill: 'var(--brass)', fontFamily: 'var(--font-jetbrains)', letterSpacing: '0.08em' }}
            >
              {step.id}
            </text>
            <text
              x={cx}
              y="70"
              textAnchor="middle"
              style={{ fontSize: '11px', fill: 'var(--text-primary)', fontFamily: 'var(--font-fraunces)', fontWeight: '600' }}
            >
              {step.title}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}

export default function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="section-padding"
      style={{ background: 'var(--surface)' }}
    >
      <div className="container-main">
        <Reveal className="mb-12">
          <p className="mono-label mb-3">{'02 \u2014 How I think'}</p>
          <h2
            id="approach-heading"
            className="
              font-serif
              text-[clamp(2rem,4vw,3.5rem)]
              font-semibold leading-tight tracking-tight
              text-[var(--text-primary)]
            "
          >
            A process I believe in.
          </h2>
        </Reveal>

        {/* Blueprint flow diagram */}
        <Reveal delay={0.1} className="mb-12 rounded-card border border-[var(--brass-soft)]/40 p-6 overflow-hidden">
          <BlueprintFlow />
        </Reveal>

        {/* Step descriptions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.id} delay={i * 0.08}>
              <div className="flex flex-col gap-2">
                <span className="mono-label">{step.id}</span>
                <h3 className="font-serif text-xl text-[var(--text-primary)]">{step.title}</h3>
                <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
