'use client'

import { motion, type Variants } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

const REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
  },
}

/**
 * Reveal — wraps any element in a fade+rise entrance animation.
 * Uses Framer Motion whileInView with viewport once:true so it plays once.
 * Respects prefers-reduced-motion via the CSS global override.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={REVEAL_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
