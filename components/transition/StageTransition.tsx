'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  STAGE_COVER_MS,
  STAGE_HOLD_MIN_MS,
  STAGE_FAILSAFE_MS,
  STAGE_REVEAL_MS,
  STAGE_DOT_DESKTOP,
  STAGE_DOT_NARROW,
  STAGE_BAND_WIDTH,
  STAGE_BAR_SEGMENTS,
  easeOutCubic,
} from '@/lib/motion'
import { BAYER_8 } from '@/lib/dither'

export interface TransitionData {
  href: string
  index: string
  total: number
  title: string
  boss: string
  x: number
  y: number
}

interface StageTransitionContextValue {
  isTransitioning: boolean
  start: (data: TransitionData) => void
}

const StageTransitionContext = createContext<StageTransitionContextValue>({
  isTransitioning: false,
  start: () => {},
})

export function useStageTransition() {
  return useContext(StageTransitionContext)
}

type Phase = 'idle' | 'cover' | 'hold' | 'reveal'

export function StageTransitionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [phase, setPhase] = useState<Phase>('idle')
  const [data, setData] = useState<TransitionData | null>(null)
  const [filledSegments, setFilledSegments] = useState<number>(0)

  const phaseRef = useRef<Phase>('idle')
  const dataRef = useRef<TransitionData | null>(null)
  const pathnameRef = useRef<string>(pathname)

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    dataRef.current = data
  }, [data])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const failsafeTimerRef = useRef<number | null>(null)

  // Track timing
  const startTimeRef = useRef<number>(0)
  const holdStartTimeRef = useRef<number>(0)
  const revealStartTimeRef = useRef<number>(0)
  const targetMountedRef = useRef<boolean>(false)

  // Canvas state
  const stateRef = useRef<{
    rafId: number
    cols: number
    rows: number
    dot: number
    cx: number
    cy: number
    maxRadius: number
    bandInDots: number
    imageData: ImageData | null
    nightR: number
    nightG: number
    nightB: number
    neonR: number
    neonG: number
    neonB: number
    dimAlpha: number
  }>({
    rafId: 0,
    cols: 0,
    rows: 0,
    dot: STAGE_DOT_DESKTOP,
    cx: 0,
    cy: 0,
    maxRadius: 0,
    bandInDots: 0,
    imageData: null,
    nightR: 7,
    nightG: 7,
    nightB: 8,
    neonR: 204,
    neonG: 255,
    neonB: 46,
    dimAlpha: Math.round(255 * 0.35),
  })

  // Restore scroll
  const restoreScroll = useCallback(() => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }, [])

  // Lock scroll
  const lockScroll = useCallback(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  }, [])

  const finish = useCallback(() => {
    if (failsafeTimerRef.current) {
      window.clearTimeout(failsafeTimerRef.current)
      failsafeTimerRef.current = null
    }

    if (stateRef.current.rafId) {
      cancelAnimationFrame(stateRef.current.rafId)
      stateRef.current.rafId = 0
    }

    restoreScroll()
    phaseRef.current = 'idle'
    dataRef.current = null
    setPhase('idle')
    setData(null)
    setFilledSegments(0)
    targetMountedRef.current = false

    // Accessibility: Move focus to the new page's <h1> after transition ends
    requestAnimationFrame(() => {
      const h1 = document.querySelector('h1')
      if (h1 instanceof HTMLElement) {
        h1.focus({ preventScroll: true })
      }
    })
  }, [restoreScroll])

  // Watch route mount whenever pathname changes
  useEffect(() => {
    if (dataRef.current && pathname === dataRef.current.href) {
      targetMountedRef.current = true
    }
  }, [pathname])

  // Recursive rAF tick handler ref
  const tickRef = useRef<(now: number) => void>(() => {})

  const handleTick = useCallback(
    (now: number) => {
      const currentPhase = phaseRef.current
      const currentData = dataRef.current
      const canvas = canvasRef.current
      if (!canvas || !currentData || currentPhase === 'idle') {
        return
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: false })
      const state = stateRef.current
      const {
        cols,
        rows,
        cx,
        cy,
        maxRadius,
        bandInDots,
        imageData,
        nightR,
        nightG,
        nightB,
        neonR,
        neonG,
        neonB,
        dimAlpha,
      } = state

      if (!ctx || !imageData) {
        state.rafId = requestAnimationFrame((t) => tickRef.current(t))
        return
      }

      const rawData = imageData.data

      if (currentPhase === 'cover') {
        const elapsed = now - startTimeRef.current
        const t = Math.min(1, elapsed / STAGE_COVER_MS)
        const p = easeOutCubic(t)
        const r = p * maxRadius

        let pIdx = 0
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
          const cellY = rowIdx + 0.5
          for (let colIdx = 0; colIdx < cols; colIdx++) {
            const cellX = colIdx + 0.5
            const dx = cellX - cx
            const dy = cellY - cy
            const d = Math.sqrt(dx * dx + dy * dy)
            const diff = r - d

            if (diff < 0) {
              // Beyond leading edge: transparent
              rawData[pIdx + 3] = 0
            } else if (diff >= bandInDots) {
              // Inside solid night
              rawData[pIdx] = nightR
              rawData[pIdx + 1] = nightG
              rawData[pIdx + 2] = nightB
              rawData[pIdx + 3] = 255
            } else {
              // Within Bayer-dithered band
              const norm = diff / bandInDots
              const bayer = BAYER_8[(rowIdx & 7) * 8 + (colIdx & 7)]

              if (norm >= bayer) {
                rawData[pIdx] = nightR
                rawData[pIdx + 1] = nightG
                rawData[pIdx + 2] = nightB
                rawData[pIdx + 3] = 255
              } else if (norm >= bayer * 0.5) {
                rawData[pIdx] = neonR
                rawData[pIdx + 1] = neonG
                rawData[pIdx + 2] = neonB
                rawData[pIdx + 3] = 255
              } else if (norm >= bayer * 0.25) {
                rawData[pIdx] = neonR
                rawData[pIdx + 1] = neonG
                rawData[pIdx + 2] = neonB
                rawData[pIdx + 3] = dimAlpha
              } else {
                rawData[pIdx + 3] = 0
              }
            }
            pIdx += 4
          }
        }

        ctx.putImageData(imageData, 0, 0)

        if (elapsed >= STAGE_COVER_MS) {
          phaseRef.current = 'hold'
          setPhase('hold')
          holdStartTimeRef.current = now
        }
      } else if (currentPhase === 'hold') {
        const elapsedHold = now - holdStartTimeRef.current
        const holdProgress = Math.min(1, elapsedHold / STAGE_HOLD_MIN_MS)

        // Fill up to 9 segments during hold; fill 10th segment when route is mounted
        const isRouteReady =
          targetMountedRef.current ||
          (dataRef.current !== null && pathnameRef.current === dataRef.current.href)
        const isReady = isRouteReady && elapsedHold >= STAGE_HOLD_MIN_MS

        if (isReady) {
          setFilledSegments(STAGE_BAR_SEGMENTS)
          phaseRef.current = 'reveal'
          setPhase('reveal')
          revealStartTimeRef.current = now
        } else {
          const filled = Math.min(9, Math.floor(holdProgress * 9))
          setFilledSegments(filled)
        }
      } else if (currentPhase === 'reveal') {
        const elapsedReveal = now - revealStartTimeRef.current
        const t = Math.min(1, elapsedReveal / STAGE_REVEAL_MS)
        const p = 1 - easeOutCubic(t)
        const r = p * maxRadius

        let pIdx = 0
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
          const cellY = rowIdx + 0.5
          for (let colIdx = 0; colIdx < cols; colIdx++) {
            const cellX = colIdx + 0.5
            const dx = cellX - cx
            const dy = cellY - cy
            const d = Math.sqrt(dx * dx + dy * dy)
            const diff = r - d

            if (diff < 0) {
              // Outside contracting disk: reveal new page underneath
              rawData[pIdx + 3] = 0
            } else if (diff >= bandInDots) {
              // Still inside solid night
              rawData[pIdx] = nightR
              rawData[pIdx + 1] = nightG
              rawData[pIdx + 2] = nightB
              rawData[pIdx + 3] = 255
            } else {
              // Within contracting dither edge
              const norm = diff / bandInDots
              const bayer = BAYER_8[(rowIdx & 7) * 8 + (colIdx & 7)]

              if (norm >= bayer) {
                rawData[pIdx] = nightR
                rawData[pIdx + 1] = nightG
                rawData[pIdx + 2] = nightB
                rawData[pIdx + 3] = 255
              } else if (norm >= bayer * 0.5) {
                rawData[pIdx] = neonR
                rawData[pIdx + 1] = neonG
                rawData[pIdx + 2] = neonB
                rawData[pIdx + 3] = 255
              } else if (norm >= bayer * 0.25) {
                rawData[pIdx] = neonR
                rawData[pIdx + 1] = neonG
                rawData[pIdx + 2] = neonB
                rawData[pIdx + 3] = dimAlpha
              } else {
                rawData[pIdx + 3] = 0
              }
            }
            pIdx += 4
          }
        }

        ctx.putImageData(imageData, 0, 0)

        if (elapsedReveal >= STAGE_REVEAL_MS) {
          finish()
          return
        }
      }

      state.rafId = requestAnimationFrame((t) => tickRef.current(t))
    },
    [finish]
  )

  useEffect(() => {
    tickRef.current = handleTick
  }, [handleTick])

  const start = useCallback(
    (transitionData: TransitionData) => {
      if (phaseRef.current !== 'idle') {
        return // Block double-triggers
      }

      // Check reduced motion
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        router.push(transitionData.href)
        return
      }

      lockScroll()

      dataRef.current = transitionData
      setData(transitionData)
      setFilledSegments(0)
      targetMountedRef.current = false
      phaseRef.current = 'cover'
      setPhase('cover')

      // Set up canvas dimensions & dot sizing
      const isNarrow = window.matchMedia('(max-width: 760px)').matches
      let dot = isNarrow ? STAGE_DOT_NARROW : STAGE_DOT_DESKTOP

      const vw = window.innerWidth
      const vh = window.innerHeight

      // Cap total cells to ~250x150
      const maxCols = 250
      const maxRows = 150
      if (vw / dot > maxCols || vh / dot > maxRows) {
        dot = Math.ceil(Math.max(vw / maxCols, vh / maxRows))
      }

      const cols = Math.ceil(vw / dot)
      const rows = Math.ceil(vh / dot)

      const originX = transitionData.x
      const originY = transitionData.y

      const cx = originX / dot
      const cy = originY / dot

      // Maximum radius to cover entire viewport from click origin
      const maxDistPx = Math.max(
        Math.hypot(originX, originY),
        Math.hypot(vw - originX, originY),
        Math.hypot(originX, vh - originY),
        Math.hypot(vw - originX, vh - originY)
      )
      const maxRadius = maxDistPx / dot + (STAGE_BAND_WIDTH / dot) + 2
      const bandInDots = STAGE_BAND_WIDTH / dot

      // Read root tokens once
      const rootStyle = getComputedStyle(document.documentElement)
      const neonStr = rootStyle.getPropertyValue('--color-neon').trim() || '#CCFF2E'
      let neonR = 204
      let neonG = 255
      let neonB = 46
      if (neonStr.startsWith('#')) {
        const hex = neonStr.replace('#', '')
        if (hex.length === 6) {
          neonR = parseInt(hex.slice(0, 2), 16)
          neonG = parseInt(hex.slice(2, 4), 16)
          neonB = parseInt(hex.slice(4, 6), 16)
        }
      }

      const nightStr = rootStyle.getPropertyValue('--color-night').trim() || '#070708'
      let nightR = 7
      let nightG = 7
      let nightB = 8
      if (nightStr.startsWith('#')) {
        const hex = nightStr.replace('#', '')
        if (hex.length === 6) {
          nightR = parseInt(hex.slice(0, 2), 16)
          nightG = parseInt(hex.slice(2, 4), 16)
          nightB = parseInt(hex.slice(4, 6), 16)
        }
      }

      const state = stateRef.current
      state.dot = dot
      state.cols = cols
      state.rows = rows
      state.cx = cx
      state.cy = cy
      state.maxRadius = maxRadius
      state.bandInDots = bandInDots
      state.neonR = neonR
      state.neonG = neonG
      state.neonB = neonB
      state.nightR = nightR
      state.nightG = nightG
      state.nightB = nightB
      state.dimAlpha = Math.round(255 * 0.35)

      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = cols
        canvas.height = rows
        const ctx = canvas.getContext('2d', { willReadFrequently: false })
        if (ctx) {
          state.imageData = ctx.createImageData(cols, rows)
        }
      }

      const now = performance.now()
      startTimeRef.current = now

      // Call router.push immediately so compilation/fetch overlaps animation
      try {
        router.push(transitionData.href)
      } catch {
        // Fallback on router push error
        finish()
        window.location.assign(transitionData.href)
        return
      }

      // Hard fail-safe: remove overlay after 4000ms no matter what
      failsafeTimerRef.current = window.setTimeout(() => {
        finish()
        window.location.assign(transitionData.href)
      }, STAGE_FAILSAFE_MS)

      // Start rAF loop
      if (state.rafId) {
        cancelAnimationFrame(state.rafId)
      }
      state.rafId = requestAnimationFrame((t) => tickRef.current(t))
    },
    [router, lockScroll, finish]
  )

  // Cleanup on unmount
  useEffect(() => {
    const timer = failsafeTimerRef.current
    const state = stateRef.current
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
      if (state.rafId) {
        cancelAnimationFrame(state.rafId)
      }
      restoreScroll()
    }
  }, [restoreScroll])

  const isTransitioning = phase !== 'idle'

  return (
    <StageTransitionContext.Provider value={{ isTransitioning, start }}>
      {children}

      {/* Persistent overlay across route changes */}
      <div
        className={`stage-transition-overlay fixed inset-0 z-[var(--z-stage-transition,9999)] select-none ${
          isTransitioning ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{ display: isTransitioning ? 'block' : 'none' }}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="stage-transition-canvas fixed inset-0 w-full h-full pointer-events-none"
          style={{ imageRendering: 'pixelated' }}
        />

        {data && (phase === 'hold' || phase === 'reveal') && (
          <div className="fixed inset-0 flex items-center justify-center p-20 z-[2] pointer-events-none">
            <div
              className={`stage-loading-card w-full max-w-[640px] bg-[var(--color-card)] border-2 border-[var(--color-neon)] rounded-screen p-24 sm:p-32 flex flex-col gap-18 shadow-[0_24px_60px_rgba(0,0,0,0.9)] ${
                phase === 'reveal' ? 'is-exit' : ''
              }`}
            >
              {/* Header: STAGE 01 / 04 */}
              <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-12">
                <span className="font-pixel text-[10px] text-[var(--color-neon)] tracking-wider">
                  STAGE {data.index} / {String(data.total).padStart(2, '0')}
                </span>
                <span className="mono text-[12px] text-mut uppercase">
                  mission load
                </span>
              </div>

              {/* Title */}
              <h2 className="font-disp font-[800] text-[32px] sm:text-[40px] tracking-tight leading-[1.05] text-ink m-0 font-stretch-125">
                {data.title}
              </h2>

              {/* BOSS Line */}
              <div className="flex items-center gap-8 mono text-[14px] leading-none overflow-hidden">
                <span className="boss-marker shrink-0" aria-hidden="true" />
                <span className="font-bold text-[var(--color-neon)] tracking-wider shrink-0">
                  BOSS
                </span>
                <span className="text-ink truncate">{data.boss}</span>
              </div>

              {/* Segmented Loading Bar (.xp look) */}
              <div className="flex flex-col gap-8 pt-6">
                <div className="stage-xp-bar" aria-hidden="true">
                  {Array.from({ length: STAGE_BAR_SEGMENTS }).map((_, i) => (
                    <span
                      key={i}
                      className={`stage-xp-seg ${
                        i < filledSegments ? 'is-filled' : ''
                      }`}
                    />
                  ))}
                </div>
                <p className="mono text-mut text-[12px] m-0 text-center">
                  loading mission...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visually hidden screen reader status */}
      {data && isTransitioning && (
        <div className="sr-only" role="status" aria-live="polite">
          Loading {data.title}
        </div>
      )}
    </StageTransitionContext.Provider>
  )
}
