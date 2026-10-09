'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { DitherFrame } from '@/components/ui/DitherFrame'
import {
  runCommand,
  getAutocomplete,
  type Line,
} from '@/lib/console/commands'
import { projects } from '@/content/projects'
import { links } from '@/content/links'
import {
  CONSOLE_REVEAL_STAGGER_MS,
  CONSOLE_REVEAL_MAX_MS,
  CONSOLE_FLASH_MS,
  CONSOLE_HISTORY_MAX,
} from '@/lib/motion'
import { useMediaQuery, REDUCED_MOTION } from '@/lib/hooks/useMediaQuery'

interface ConsoleItem {
  id: string
  isEcho?: boolean
  echoCommand?: string
  lines?: Line[]
}

const CHIPS = ['help', 'ls', 'cat 01', 'skills', 'whoami', 'contact'] as const
const KONAMI_CODE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
]

export function Console() {
  const [items, setItems] = useState<ConsoleItem[]>([
    {
      id: 'boot',
      lines: [
        { type: 'text', text: 'SOLIMAN-OS v2026.1  ·  type `help` to begin' },
        {
          type: 'muted',
          text: 'tip: Tab autocompletes, ↑ / ↓ browse history, Esc leaves the prompt',
        },
        { type: 'spacer' },
      ],
    },
  ])

  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [tempInput, setTempInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)

  const isReducedMotion = useMediaQuery(REDUCED_MOTION)

  const screenRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const revealTimerRef = useRef<NodeJS.Timeout | null>(null)
  const konamiIndexRef = useRef(0)

  // Auto-scroll output area to bottom on new items
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [items])

  const executeCommand = useCallback(
    (cmdString: string) => {
      const trimmed = cmdString.trim()
      if (!trimmed) return

      // Add to history (max 50)
      setHistory((prev) => {
        const next = [trimmed, ...prev.filter((h) => h !== trimmed)]
        return next.slice(0, CONSOLE_HISTORY_MAX)
      })
      setHistoryIndex(-1)
      setTempInput('')
      setInputVal('')

      const result = runCommand(trimmed, { unlocked })

      if (result.clear) {
        if (revealTimerRef.current) {
          clearInterval(revealTimerRef.current)
          revealTimerRef.current = null
        }
        setItems([])
        return
      }

      const echoItem: ConsoleItem = {
        id: `echo-${Date.now()}-${Math.random()}`,
        isEcho: true,
        echoCommand: trimmed,
      }

      if (result.unlock) {
        setUnlocked(true)
      }

      const lines = result.lines

      if (isReducedMotion || lines.length === 0) {
        setItems((prev) => [
          ...prev,
          echoItem,
          {
            id: `result-${Date.now()}-${Math.random()}`,
            lines,
          },
        ])
      } else {
        // Stepped stagger reveal
        const total = lines.length
        const delay = Math.max(
          10,
          Math.min(
            CONSOLE_REVEAL_STAGGER_MS,
            Math.floor(CONSOLE_REVEAL_MAX_MS / Math.max(1, total))
          )
        )
        const batchSize = Math.max(
          1,
          Math.ceil((total * delay) / CONSOLE_REVEAL_MAX_MS)
        )

        let index = 0
        const resultId = `result-${Date.now()}-${Math.random()}`

        // Add echo and initial empty result item
        setItems((prev) => [
          ...prev,
          echoItem,
          {
            id: resultId,
            lines: [],
          },
        ])

        if (revealTimerRef.current) {
          clearInterval(revealTimerRef.current)
        }

        revealTimerRef.current = setInterval(() => {
          index = Math.min(total, index + batchSize)
          const currentBatch = lines.slice(0, index)

          setItems((prev) =>
            prev.map((item) =>
              item.id === resultId ? { ...item, lines: currentBatch } : item
            )
          )

          if (index >= total) {
            if (revealTimerRef.current) {
              clearInterval(revealTimerRef.current)
              revealTimerRef.current = null
            }
          }
        }, delay)
      }
    },
    [unlocked, isReducedMotion]
  )

  // Konami Code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      if (e.ctrlKey || e.altKey || e.metaKey) {
        return
      }

      const key = e.key.toLowerCase()
      const expectedKey = KONAMI_CODE[konamiIndexRef.current]

      if (key === expectedKey) {
        konamiIndexRef.current += 1

        if (konamiIndexRef.current === KONAMI_CODE.length) {
          konamiIndexRef.current = 0

          // Smooth scroll to #console
          const consoleEl = document.getElementById('console')
          if (consoleEl) {
            consoleEl.scrollIntoView({
              behavior: isReducedMotion ? 'instant' : 'smooth',
            })
          }

          // Screen flash
          if (!isReducedMotion) {
            setIsFlashing(true)
            setTimeout(() => setIsFlashing(false), CONSOLE_FLASH_MS)
          }

          setUnlocked(true)

          setItems((prev) => [
            ...prev,
            {
              id: `cheat-${Date.now()}`,
              lines: [
                {
                  type: 'text',
                  text: 'CHEAT CODE ACCEPTED · +30 LIVES',
                },
                {
                  type: 'runnable',
                  label: 'new command unlocked: hiscores',
                  command: 'hiscores',
                },
                { type: 'spacer' },
              ],
            },
          ])
        }
      } else {
        konamiIndexRef.current = key === KONAMI_CODE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (revealTimerRef.current) {
        clearInterval(revealTimerRef.current)
      }
    }
  }, [isReducedMotion])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      executeCommand(inputVal)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      inputRef.current?.blur()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIdx =
        historyIndex === -1 ? 0 : Math.min(historyIndex + 1, history.length - 1)
      if (historyIndex === -1) {
        setTempInput(inputVal)
      }
      setHistoryIndex(nextIdx)
      setInputVal(history[nextIdx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const nextIdx = historyIndex - 1
      if (nextIdx < 0) {
        setHistoryIndex(-1)
        setInputVal(tempInput)
      } else {
        setHistoryIndex(nextIdx)
        setInputVal(history[nextIdx])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const { text, matches } = getAutocomplete(inputVal, unlocked)
      if (matches && matches.length > 1) {
        setItems((prev) => [
          ...prev,
          {
            id: `tab-${Date.now()}`,
            lines: [{ type: 'text', text: matches.join('   ') }],
          },
        ])
      } else if (text !== inputVal) {
        setInputVal(text)
      }
    }
  }

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid stealing focus if user clicked an anchor, button or selected text
    const target = e.target as HTMLElement
    if (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('input')
    ) {
      return
    }

    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      return
    }

    inputRef.current?.focus({ preventScroll: true })
  }

  const renderLine = (line: Line, idx: number) => {
    switch (line.type) {
      case 'text':
        return (
          <div key={idx} className="text-ink whitespace-pre-wrap">
            {line.text}
          </div>
        )
      case 'heading':
        return (
          <div
            key={idx}
            className="text-[var(--color-neon)] font-bold text-[14px] uppercase tracking-wider glow-neon mt-10 mb-2"
          >
            {line.text}
          </div>
        )
      case 'kv':
        return (
          <div key={idx} className="flex items-baseline gap-16 narrow:gap-8 flex-wrap">
            <span className="text-[var(--color-neon)] font-medium shrink-0 min-w-[110px] narrow:min-w-[90px]">
              {line.label}
            </span>
            <span className="text-ink">{line.value}</span>
          </div>
        )
      case 'link':
        return (
          <div key={idx} className="flex items-baseline gap-16 narrow:gap-8 flex-wrap">
            {line.key && (
              <span className="text-[var(--color-neon)] font-medium shrink-0 min-w-[110px] narrow:min-w-[90px]">
                {line.key}
              </span>
            )}
            {line.external ? (
              <a
                href={line.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-neon)] hover:underline inline-flex items-center gap-4 cursor-pointer"
              >
                {line.label} <span aria-hidden="true">&rarr;</span>
              </a>
            ) : line.download ? (
              <a
                href={line.href}
                download
                className="text-[var(--color-neon)] hover:underline inline-flex items-center gap-4 cursor-pointer"
              >
                {line.label} <span aria-hidden="true">&darr;</span>
              </a>
            ) : (
              <Link
                href={line.href}
                className="text-[var(--color-neon)] hover:underline inline-flex items-center gap-4 cursor-pointer"
              >
                {line.label}
              </Link>
            )}
          </div>
        )
      case 'runnable':
        return (
          <button
            key={idx}
            type="button"
            onClick={() => executeCommand(line.command)}
            className="text-left text-ink hover:text-[var(--color-neon)] transition-colors cursor-pointer mono py-2 block"
          >
            {line.label}
          </button>
        )
      case 'spacer':
        return <div key={idx} className="h-8" aria-hidden="true" />
      case 'muted':
        return (
          <div key={idx} className="text-mut text-[13px]">
            {line.text}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section
      id="console"
      aria-labelledby="console-title"
      className="relative z-[2] p-[120px_40px_140px] narrow:p-[80px_20px_100px] border-t border-[var(--color-line)]"
    >
      <div className="whead flex justify-between items-end gap-20 mb-56 narrow:flex-col narrow:items-start max-w-[1040px] mx-auto">
        <h2
          id="console-title"
          className="m-0 font-[800] text-section font-disp font-stretch-125 text-ink"
        >
          Console
        </h2>
        <p className="mono text-mut text-right narrow:text-left m-0">
          type help, or tap a command
        </p>
      </div>

      <div className="max-w-[1040px] mx-auto">
        <DitherFrame band={24} className="w-full">
          <div
            ref={screenRef}
            onClick={handleScreenClick}
            className={`console-screen flex flex-col ${
              isFlashing ? 'is-flashing' : ''
            }`}
          >
            {/* Title Bar (28px tall, bottom hairline) */}
            <div className="h-[28px] border-b border-[var(--color-line)] flex items-center justify-between px-16 select-none bg-[var(--color-card)] shrink-0">
              {/* Left decorative square pixel buttons */}
              <div className="flex gap-6 items-center" aria-hidden="true">
                <span className="w-[6px] h-[6px] bg-[var(--color-line)] rounded-[1px] inline-block" />
                <span className="w-[6px] h-[6px] bg-[var(--color-line)] rounded-[1px] inline-block" />
                <span className="w-[6px] h-[6px] bg-[var(--color-line)] rounded-[1px] inline-block" />
              </div>

              {/* Centre label (Press Start 2P, >=10px) */}
              <span className="font-pixel text-[10px] text-[var(--color-neon)] tracking-wider glow-neon">
                SOLIMAN-OS v2026.1
              </span>

              {/* Right guest label */}
              <span className="mono text-[11px] text-mut uppercase tracking-wider">
                guest
              </span>
            </div>

            {/* Output area */}
            <div
              ref={outputRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="console-output h-[420px] narrow:h-[360px] overflow-y-auto p-20 flex flex-col gap-6 text-[14px] font-mono leading-relaxed select-text"
            >
              {items.map((item) =>
                item.isEcho ? (
                  <div
                    key={item.id}
                    className="flex items-baseline gap-8 text-[14px] mt-6"
                  >
                    <span className="text-[var(--color-neon)] font-medium glow-neon shrink-0">
                      guest@soliman:~$
                    </span>
                    <span className="text-ink font-semibold">
                      {item.echoCommand}
                    </span>
                  </div>
                ) : (
                  <div key={item.id} className="flex flex-col gap-4">
                    {item.lines?.map((line, lIdx) => renderLine(line, lIdx))}
                  </div>
                )
              )}
            </div>

            {/* Chips row above the prompt */}
            <div className="console-chips flex gap-8 overflow-x-auto p-[10px_16px] border-t border-[var(--color-line)] bg-[var(--color-art)]/70">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => executeCommand(chip)}
                  className="min-h-[40px] px-14 py-8 rounded-pill border border-[var(--color-line)] bg-[var(--color-art)] text-ink hover:border-[var(--color-neon)] hover:text-[var(--color-neon)] transition-colors cursor-pointer shrink-0 mono text-[13px] font-normal"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Prompt row at bottom */}
            <div className="p-[12px_16px] border-t border-[var(--color-line)] flex items-center gap-10 bg-[var(--color-card)] shrink-0">
              <span className="text-[var(--color-neon)] font-semibold shrink-0 select-none glow-neon mono text-[14px]">
                guest@soliman:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="console-input flex-1 text-[14px] narrow:text-[16px] text-ink bg-transparent focus:outline-none"
                aria-label="Console command"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>
        </DitherFrame>
      </div>

      {/* noscript fallback */}
      <noscript>
        <div className="mt-24 p-24 border border-[var(--color-line)] rounded-card bg-[var(--color-card)] mono text-[14px] max-w-[1040px] mx-auto">
          <p className="text-[var(--color-neon)] font-medium mb-12">
            SOLIMAN-OS &middot; static fallback
          </p>
          <div className="mb-20">
            <span className="text-mut block mb-8 uppercase tracking-wider text-[12px]">
              Projects
            </span>
            <ul className="flex flex-col gap-6 m-0 p-0 list-none">
              {projects.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`/work/${p.slug}`}
                    className="text-ink hover:text-[var(--color-neon)]"
                  >
                    #{p.index} {p.title} &rarr;
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-mut block mb-8 uppercase tracking-wider text-[12px]">
              Contact
            </span>
            <ul className="flex flex-col gap-6 m-0 p-0 list-none">
              <li>
                <a
                  href={links.mailto}
                  className="text-ink hover:text-[var(--color-neon)]"
                >
                  {links.email}
                </a>
              </li>
              <li>
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-[var(--color-neon)]"
                >
                  {links.linkedinDisplay}
                </a>
              </li>
              <li>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-[var(--color-neon)]"
                >
                  {links.githubDisplay}
                </a>
              </li>
              <li>
                <a
                  href={links.cv}
                  download
                  className="text-ink hover:text-[var(--color-neon)]"
                >
                  download CV
                </a>
              </li>
            </ul>
          </div>
        </div>
      </noscript>
    </section>
  )
}
