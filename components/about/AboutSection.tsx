'use client'

import { useRef, useState, useEffect } from 'react'
import { skillGroups, perks, playerCard } from '@/content/skills'
import { XpBar } from '@/components/ui/XpBar'
import { useInView } from '@/lib/hooks/useInView'
import { useLevelTick } from '@/lib/hooks/useLevelTick'
import { ABOUT_REVEAL_THRESHOLD } from '@/lib/motion'
import { cssVars } from '@/lib/css'

interface AboutSectionProps {
  onReplayRegister?: (replayFn: () => void) => void
}

function PlayerCardLevel({ isRevealed }: { isRevealed: boolean }) {
  const level = useLevelTick(3, isRevealed, 450)
  return <span className="mono text-[var(--color-neon)]">lv.0{level}</span>
}

function StatRow({
  group,
  index,
  isRevealed,
}: {
  group: (typeof skillGroups)[number]
  index: number
  isRevealed: boolean
}) {
  // Stat row delay: 250ms + index * 90ms. Level tick begins ~350ms after row appears
  const levelTickDelay = 250 + index * 90 + 350
  const level = useLevelTick(group.level, isRevealed, levelTickDelay)

  return (
    <div
      style={cssVars({ '--i': index })}
      className="about-stat-row flex flex-col gap-8 pb-16"
    >
      <div className="about-stat-header flex justify-between items-center gap-12">
        <span className="mono text-ink text-[13px] font-medium">
          {group.name}
        </span>
        <div className="flex items-center gap-12">
          <div className="w-[88px]">
            <XpBar xp={group.xp} />
          </div>
          <span className="mono text-[var(--color-neon)] text-[12px]">
            lv.0{level}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 pt-2">
        {group.skills.map((skill, skillIdx) => (
          <span
            key={skill}
            style={cssVars({ '--t': skillIdx })}
            className="about-skill-tag mono text-[11px] px-8 py-3 rounded-block bg-[var(--color-art)] border border-[var(--color-line)] text-mut"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

function AboutContent() {
  const sectionRef = useRef<HTMLElement>(null)
  const isRevealed = useInView(sectionRef, ABOUT_REVEAL_THRESHOLD)

  return (
    <section
      ref={sectionRef}
      id="about"
      data-reveal={isRevealed ? 'true' : undefined}
      aria-labelledby="about-title"
      className="relative z-[2] p-[120px_40px_140px] narrow:p-[80px_20px_100px] border-t border-[var(--color-line)]"
    >
      <noscript>
        <style>{`
          #about .about-title-inner,
          #about .about-sublabel,
          #about .about-card,
          #about .about-stat-row::before,
          #about .about-stat-header,
          #about .about-skill-tag,
          #about .about-perks {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            letter-spacing: -0.02em !important;
          }
        `}</style>
      </noscript>

      <div className="whead flex justify-between items-end gap-20 mb-56 narrow:flex-col narrow:items-start">
        <h2
          id="about-title"
          className="m-0 font-[800] text-section font-disp font-stretch-125 text-ink"
        >
          <span className="about-title-mask">
            <span className="about-title-inner">About</span>
          </span>
        </h2>
        <p className="about-sublabel mono text-mut text-right narrow:text-left m-0">
          character &middot; stats &middot; perks
        </p>
      </div>

      {/* Two columns: Player card left, Skill tree right */}
      <div className="grid grid-cols-[1fr_1.2fr] narrow:grid-cols-1 gap-40 items-start">
        {/* Left: Player card */}
        <div className="about-card border border-[var(--color-line)] rounded-card bg-[var(--color-card)] p-28 flex flex-col gap-20">
          <div className="flex justify-between items-baseline border-b border-[var(--color-line)] pb-14">
            <span className="font-disp font-[800] text-[20px] text-ink font-stretch-125">
              PLAYER CARD
            </span>
            <PlayerCardLevel isRevealed={isRevealed} />
          </div>

          <div className="flex flex-col gap-10 mono text-[13px]">
            <div className="flex justify-between items-baseline gap-12">
              <span className="text-mut">class</span>
              <b className="font-normal text-ink text-right">{playerCard.class}</b>
            </div>
            <div className="flex justify-between items-baseline gap-12">
              <span className="text-mut">subclass</span>
              <b className="font-normal text-ink text-right">{playerCard.subclass}</b>
            </div>
            <div className="flex justify-between items-baseline gap-12">
              <span className="text-mut">base</span>
              <b className="font-normal text-ink text-right">{playerCard.base}</b>
            </div>
            <div className="flex justify-between items-start gap-12 border-t border-[var(--color-line)] pt-10">
              <span className="text-mut shrink-0">education</span>
              <b className="font-normal text-ink text-right leading-snug">
                {playerCard.education}
              </b>
            </div>
          </div>

          <p className="text-mut text-[14px] leading-relaxed border-t border-[var(--color-line)] pt-16 m-0">
            Backend-focused computer engineering student. I design and ship RAG pipelines, AI-powered evaluation systems and scalable REST APIs. I co-built a full-stack AI candidate assessment platform in a 5-engineer team: it analyzes about 30 GitHub repositories per candidate and produces a structured recruiter report in under 2 minutes. I&apos;m looking for backend and AI engineering roles where retrieval, LLM integration and high-throughput API design are the core of the job.
          </p>
        </div>

        {/* Right: Skill tree */}
        <div className="flex flex-col gap-20">
          <div className="flex flex-col gap-16">
            {skillGroups.map((group, groupIdx) => (
              <StatRow
                key={group.name}
                group={group}
                index={groupIdx}
                isRevealed={isRevealed}
              />
            ))}
          </div>

          {/* Perks */}
          <div className="about-perks flex items-center gap-12 pt-12 border-t border-[var(--color-line)] flex-wrap">
            <span className="mono text-mut text-[12px] uppercase tracking-wider">
              perks
            </span>
            <div className="flex flex-wrap gap-6">
              {perks.map((perk) => (
                <span
                  key={perk}
                  className="mono text-[11px] px-8 py-3 rounded-pill border border-[var(--color-line)] text-ink"
                >
                  {perk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutSection({ onReplayRegister }: AboutSectionProps) {
  const [replayKey, setReplayKey] = useState(0)

  useEffect(() => {
    onReplayRegister?.(() => {
      setReplayKey((k) => k + 1)
    })
  }, [onReplayRegister])

  return <AboutContent key={replayKey} />
}
