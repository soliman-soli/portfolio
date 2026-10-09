'use client'

import { useEffect, useRef } from 'react'
import {
  DITHER_FPS,
  DITHER_SPEED,
  DITHER_DOT_SIZE,
  DITHER_HOP_BOOST_MS,
  DITHER_HOP_BOOST,
  PREVIEW_BAND_DESKTOP,
  PREVIEW_BAND_TOUCH,
} from '@/lib/motion'

interface DitherFrameProps {
  isActive: boolean
  isGlitchHop?: boolean
  isTouch?: boolean
  className?: string
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
  isActive,
  isGlitchHop = false,
  isTouch = false,
  className = '',
}: DitherFrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hopTimeRef = useRef<number>(0)
  const animRef = useRef<{
    rafId: number
    lastTime: number
    cols: number
    rows: number
    cardW: number
    cardH: number
    band: number
    imageData: ImageData | null
    neonR: number
    neonG: number
    neonB: number
  }>({
    rafId: 0,
    lastTime: 0,
    cols: 0,
    rows: 0,
    cardW: 0,
    cardH: 0,
    band: isTouch ? PREVIEW_BAND_TOUCH : PREVIEW_BAND_DESKTOP,
    imageData: null,
    neonR: 204,
    neonG: 255,
    neonB: 46,
  })

  // Track glitch hop triggers to boost field value for ~200ms
  useEffect(() => {
    if (isGlitchHop) {
      hopTimeRef.current = performance.now()
    }
  }, [isGlitchHop])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    if (!ctx) return

    const state = animRef.current
    state.band = isTouch ? PREVIEW_BAND_TOUCH : PREVIEW_BAND_DESKTOP

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
      // Find card dimensions (parent or card sibling)
      const rect = parent.getBoundingClientRect()
      const cardW = Math.max(300, rect.width)
      const cardH = Math.max(300, rect.height)
      state.cardW = cardW
      state.cardH = cardH

      const band = state.band
      const totalW = Math.round(cardW + 2 * band)
      const totalH = Math.round(cardH + 2 * band)

      const cols = Math.ceil(totalW / DITHER_DOT_SIZE)
      const rows = Math.ceil(totalH / DITHER_DOT_SIZE)

      if (canvas.width !== cols || canvas.height !== rows) {
        canvas.width = cols
        canvas.height = rows
        state.cols = cols
        state.rows = rows
        state.imageData = ctx.createImageData(cols, rows)
      }

      canvas.style.width = `${totalW}px`
      canvas.style.height = `${totalH}px`
      canvas.style.top = `-${band}px`
      canvas.style.left = `-${band}px`
    }

    updateSize()

    const ro = new ResizeObserver(() => {
      updateSize()
      if (!isActive) {
        renderFrame(0)
      }
    })
    ro.observe(parent)

    const renderFrame = (now: number) => {
      const { cols, rows, cardW, cardH, band, imageData, neonR, neonG, neonB } = state
      if (!imageData || cols <= 0 || rows <= 0) return

      const data = imageData.data
      const t = now * DITHER_SPEED
      const elapsedHop = now - hopTimeRef.current
      const boost =
        elapsedHop < DITHER_HOP_BOOST_MS && elapsedHop >= 0
          ? DITHER_HOP_BOOST * (1 - elapsedHop / DITHER_HOP_BOOST_MS)
          : 0

      const dimAlpha = Math.round(255 * 0.35) // ~35% dim green

      let pIdx = 0
      for (let r = 0; r < rows; r++) {
        const y = (r + 0.5) * DITHER_DOT_SIZE
        const dy = Math.max(0, band - y, y - (band + cardH))

        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * DITHER_DOT_SIZE
          const dx = Math.max(0, band - x, x - (band + cardW))

          const dist = Math.sqrt(dx * dx + dy * dy)

          // Beyond the outer edge of the frame band: completely transparent
          if (dist >= band) {
            data[pIdx + 3] = 0
            pIdx += 4
            continue
          }

          // Inside the card body itself: transparent so card background is clean
          if (dx === 0 && dy === 0) {
            data[pIdx + 3] = 0
            pIdx += 4
            continue
          }

          // Falloff: 1 at card boundary down to 0 at outer band edge
          const falloff = 1 - dist / band

          // Animated organic noise: sum of slow sines in varied directions + time
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
      return () => ro.disconnect()
    }

    const interval = 1000 / DITHER_FPS

    const tick = (now: number) => {
      if (!isActive) {
        state.rafId = 0
        return
      }

      if (now - state.lastTime >= interval) {
        state.lastTime = now
        renderFrame(now)
      }

      state.rafId = requestAnimationFrame(tick)
    }

    if (isActive) {
      state.rafId = requestAnimationFrame(tick)
    } else {
      // Clear canvas if inactive
      ctx.clearRect(0, 0, state.cols, state.rows)
    }

    return () => {
      ro.disconnect()
      if (state.rafId) {
        cancelAnimationFrame(state.rafId)
        state.rafId = 0
      }
    }
  }, [isActive, isTouch])

  return (
    <canvas
      ref={canvasRef}
      className={`dither-frame-canvas ${className}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 0,
        imageRendering: 'pixelated',
      }}
    />
  )
}
