'use client'

import { useEffect, useRef } from 'react'
import {
  DITHER_FPS,
  DITHER_SPEED,
  DITHER_HOP_BOOST_MS,
  DITHER_HOP_BOOST,
} from '@/lib/motion'

interface DitherFrameProps {
  band?: number
  dot?: number
  isActive?: boolean
  isGlitchHop?: boolean
  className?: string
  children?: React.ReactNode
}

// 8x8 Bayer matrix normalized to [0, 1]
const BAYER_8 = new Float32Array([
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64))

export function DitherFrame({
  band: bandProp,
  dot: dotProp,
  isActive = true,
  isGlitchHop = false,
  className = '',
  children,
}: DitherFrameProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hopTimeRef = useRef<number>(0)

  const stateRef = useRef<{
    rafId: number
    lastTime: number
    cols: number
    rows: number
    cardW: number
    cardH: number
    band: number
    dot: number
    imageData: ImageData | null
    neonR: number
    neonG: number
    neonB: number
    isIntersecting: boolean
    isDocVisible: boolean
  }>({
    rafId: 0,
    lastTime: 0,
    cols: 0,
    rows: 0,
    cardW: 0,
    cardH: 0,
    band: bandProp ?? 32,
    dot: dotProp ?? 4,
    imageData: null,
    neonR: 204,
    neonG: 255,
    neonB: 46,
    isIntersecting: true,
    isDocVisible: true,
  })

  // Track glitch hop for momentary brightness boost
  useEffect(() => {
    if (isGlitchHop) {
      hopTimeRef.current = performance.now()
    }
  }, [isGlitchHop])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    if (!ctx) return

    const state = stateRef.current

    // Extract neon color token from CSS variables
    const rootStyle = getComputedStyle(document.documentElement)
    const neonStr = rootStyle.getPropertyValue('--color-neon').trim() || '#CCFF2E'
    if (neonStr.startsWith('#')) {
      const hex = neonStr.replace('#', '')
      if (hex.length === 6) {
        state.neonR = parseInt(hex.slice(0, 2), 16)
        state.neonG = parseInt(hex.slice(2, 4), 16)
        state.neonB = parseInt(hex.slice(4, 6), 16)
      }
    }

    const updateSize = () => {
      const isNarrow = window.matchMedia('(max-width: 760px)').matches
      const effectiveBand = bandProp ?? (isNarrow ? 14 : 32)
      state.band = effectiveBand

      const rect = wrapper.getBoundingClientRect()
      const cardW = Math.max(280, rect.width)
      const cardH = Math.max(200, rect.height)
      state.cardW = cardW
      state.cardH = cardH

      const totalW = Math.round(cardW + 2 * effectiveBand)
      const totalH = Math.round(cardH + 2 * effectiveBand)

      // Cap canvas resolution: max 200 cols x 260 rows
      let effectiveDot = dotProp ?? 4
      const maxCols = 200
      const maxRows = 260

      if (totalW / effectiveDot > maxCols || totalH / effectiveDot > maxRows) {
        const neededDot = Math.max(totalW / maxCols, totalH / maxRows)
        effectiveDot = Math.min(6, Math.max(effectiveDot, neededDot))
      }
      state.dot = effectiveDot

      const cols = Math.ceil(totalW / effectiveDot)
      const rows = Math.ceil(totalH / effectiveDot)

      if (canvas.width !== cols || canvas.height !== rows) {
        canvas.width = cols
        canvas.height = rows
        state.cols = cols
        state.rows = rows
        state.imageData = ctx.createImageData(cols, rows)
      }

      canvas.style.width = `${totalW}px`
      canvas.style.height = `${totalH}px`
      canvas.style.top = `-${effectiveBand}px`
      canvas.style.left = `-${effectiveBand}px`
    }

    updateSize()

    const renderFrame = (now: number) => {
      const { cols, rows, cardW, cardH, band, dot, imageData, neonR, neonG, neonB } = state
      if (!imageData || cols <= 0 || rows <= 0) return

      const data = imageData.data
      const t = now * DITHER_SPEED
      const elapsedHop = now - hopTimeRef.current
      const boost =
        elapsedHop < DITHER_HOP_BOOST_MS && elapsedHop >= 0
          ? DITHER_HOP_BOOST * (1 - elapsedHop / DITHER_HOP_BOOST_MS)
          : 0

      const dimAlpha = Math.round(255 * 0.35)

      let pIdx = 0
      for (let r = 0; r < rows; r++) {
        const y = (r + 0.5) * dot
        const dy = Math.max(0, band - y, y - (band + cardH))

        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * dot
          const dx = Math.max(0, band - x, x - (band + cardW))

          const dist = Math.sqrt(dx * dx + dy * dy)

          // Beyond the outer edge of the frame band: completely transparent
          if (dist >= band) {
            data[pIdx + 3] = 0
            pIdx += 4
            continue
          }

          // Inside the card body itself: transparent
          if (dx === 0 && dy === 0) {
            data[pIdx + 3] = 0
            pIdx += 4
            continue
          }

          // Falloff: 1 at card boundary down to 0 at outer band edge
          const falloff = 1 - dist / band

          // Animated organic noise: sum of sines + time
          const noise =
            0.5 +
            0.26 * Math.sin(c * 0.06 + t) +
            0.24 * Math.sin(r * 0.08 - t * 1.3) +
            0.16 * Math.sin((c + r) * 0.045 + t * 0.7) +
            boost

          const v = Math.min(1, Math.max(0, noise * falloff))
          const bayer = BAYER_8[(r & 7) * 8 + (c & 7)]

          // Three tones: solid neon, dim green, transparent
          if (v > bayer * 0.6 + 0.38) {
            data[pIdx] = neonR
            data[pIdx + 1] = neonG
            data[pIdx + 2] = neonB
            data[pIdx + 3] = 255
          } else if (v > bayer * 0.62) {
            data[pIdx] = neonR
            data[pIdx + 1] = neonG
            data[pIdx + 2] = neonB
            data[pIdx + 3] = dimAlpha
          } else {
            data[pIdx + 3] = 0
          }

          pIdx += 4
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (isReducedMotion) {
      renderFrame(0)
      return
    }

    const interval = 1000 / DITHER_FPS

    const tick = (now: number) => {
      const shouldRun =
        isActive &&
        state.isIntersecting &&
        state.isDocVisible &&
        !isReducedMotion

      if (!shouldRun) {
        state.rafId = 0
        return
      }

      if (now - state.lastTime >= interval) {
        state.lastTime = now
        renderFrame(now)
      }

      state.rafId = requestAnimationFrame(tick)
    }

    const updateLoop = () => {
      const shouldRun =
        isActive &&
        state.isIntersecting &&
        state.isDocVisible &&
        !isReducedMotion

      if (shouldRun && !state.rafId) {
        state.lastTime = performance.now()
        state.rafId = requestAnimationFrame(tick)
      } else if (!shouldRun && state.rafId) {
        cancelAnimationFrame(state.rafId)
        state.rafId = 0
      }
    }

    // Observer: only run loop when card is on screen
    const io = new IntersectionObserver(([entry]) => {
      state.isIntersecting = entry?.isIntersecting ?? false
      updateLoop()
    })
    io.observe(wrapper)

    // VisibilityChange: pause when tab is inactive
    const onVisibility = () => {
      state.isDocVisible = !document.hidden
      updateLoop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ResizeObserver: recompute size on resize
    const ro = new ResizeObserver(() => {
      updateSize()
      if (!isActive) {
        renderFrame(0)
      }
    })
    ro.observe(wrapper)

    updateLoop()

    return () => {
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      if (state.rafId) {
        cancelAnimationFrame(state.rafId)
        state.rafId = 0
      }
    }
  }, [isActive, bandProp, dotProp])

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="dither-frame-canvas"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          zIndex: 0,
          imageRendering: 'pixelated',
        }}
      />
      {children && <div className="relative z-[1]">{children}</div>}
    </div>
  )
}
