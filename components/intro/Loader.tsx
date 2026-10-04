'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  LOADER_COUNT_MS,
  LOADER_HOLD_MS,
  LOADER_REVEAL_DELAY_MS,
  LOADER_STEPS,
  LOADER_DIGITS,
  easeInOutCubic,
} from '@/lib/motion'

interface LoaderProps {
  onReplayRegister?: (replayFn: () => void) => void
}

export function Loader({ onReplayRegister }: LoaderProps) {
  const [done, setDone] = useState(false)
  const countRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const logMsgRef = useRef<HTMLSpanElement>(null)

  const run = useCallback(() => {
    document.documentElement.removeAttribute('data-intro')
    setDone(false)

    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.setAttribute('data-intro', 'ready')
      setDone(true)
      return
    }

    const t0 = performance.now()
    const dur = LOADER_COUNT_MS

    function tick(now: number) {
      const p = Math.min((now - t0) / dur, 1)
      const v = Math.round(easeInOutCubic(p) * 100)

      if (countRef.current) {
        // update firstChild or text
        const textNode = countRef.current.childNodes[0]
        if (textNode) {
          textNode.nodeValue = String(v).padStart(LOADER_DIGITS, '0')
        }
      }
      if (barRef.current) {
        barRef.current.style.width = `${v}%`
      }

      let msg: string = LOADER_STEPS[0].msg
      for (const s of LOADER_STEPS) {
        if (v >= s.at) msg = s.msg
      }
      if (logMsgRef.current) {
        logMsgRef.current.textContent = msg
      }

      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setDone(true)
          setTimeout(() => {
            document.documentElement.setAttribute('data-intro', 'ready')
          }, LOADER_REVEAL_DELAY_MS)
        }, LOADER_HOLD_MS)
      }
    }

    requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (onReplayRegister) {
      onReplayRegister(run)
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial boot sequence run
    run()
  }, [run, onReplayRegister])

  return (
    <div
      className="loader"
      data-state={done ? 'done' : 'active'}
      aria-hidden="true"
    >
      <div className="mono text-mut leading-[1.8]">
        <b className="text-ink font-normal">soliman.portfolio</b> v2026.1
        <br />
        <span ref={logMsgRef}>booting interface...</span>
      </div>
      <div>
        <div
          ref={countRef}
          className="font-[800] text-count font-disp font-stretch-125 tabular-nums text-ink"
        >
          000
          <small className="text-[0.25em] text-[var(--color-neon)] ml-[0.1em] tracking-normal">
            %
          </small>
        </div>
        <div className="h-2 bg-[var(--color-line)] mt-20">
          <div ref={barRef} className="h-full w-0 bg-[var(--color-neon)]" />
        </div>
      </div>
    </div>
  )
}
