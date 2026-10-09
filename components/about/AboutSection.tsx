import { skillGroups, perks, quest } from '@/content/skills'
import { XpBar } from '@/components/ui/XpBar'

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative z-[2] p-[120px_40px_140px] narrow:p-[80px_20px_100px] border-t border-[var(--color-line)]"
    >
      <div className="whead flex justify-between items-end gap-20 mb-56 narrow:flex-col narrow:items-start">
        <h2
          id="about-title"
          className="m-0 font-[800] text-section font-disp font-stretch-125 text-ink"
        >
          About
        </h2>
        <p className="mono text-mut text-right narrow:text-left m-0">
          character &middot; stats &middot; quest log
        </p>
      </div>

      {/* Two columns: Player card left, Skill tree right */}
      <div className="grid grid-cols-[1fr_1.2fr] narrow:grid-cols-1 gap-40 items-start mb-64">
        {/* Left: Player card */}
        <div className="border border-[var(--color-line)] rounded-card bg-[var(--color-card)] p-28 flex flex-col gap-20">
          <div className="flex justify-between items-baseline border-b border-[var(--color-line)] pb-14">
            <span className="font-disp font-[800] text-[20px] text-ink font-stretch-125">
              PLAYER CARD
            </span>
            <span className="mono text-[var(--color-neon)]">lv.03</span>
          </div>

          <div className="flex flex-col gap-10 mono text-[13px]">
            <div className="flex justify-between items-baseline gap-12">
              <span className="text-mut">class</span>
              <b className="font-normal text-ink text-right">Backend Engineer</b>
            </div>
            <div className="flex justify-between items-baseline gap-12">
              <span className="text-mut">subclass</span>
              <b className="font-normal text-ink text-right">AI Systems &amp; RAG</b>
            </div>
            <div className="flex justify-between items-baseline gap-12">
              <span className="text-mut">base</span>
              <b className="font-normal text-ink text-right">Cairo, Egypt</b>
            </div>
            <div className="flex justify-between items-start gap-12 border-t border-[var(--color-line)] pt-10">
              <span className="text-mut shrink-0">education</span>
              <b className="font-normal text-ink text-right leading-snug">
                B.Sc. Computer Engineering, Misr University for Science and Technology (MUST), expected July 2028, GPA 3.1
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
            {skillGroups.map((group) => (
              <div
                key={group.name}
                className="flex flex-col gap-8 pb-16 border-b border-[var(--color-line)] last:border-b-0"
              >
                <div className="flex justify-between items-center gap-12">
                  <span className="mono text-ink text-[13px] font-medium">
                    {group.name}
                  </span>
                  <div className="flex items-center gap-12">
                    <div className="w-[88px]">
                      <XpBar xp={group.xp} />
                    </div>
                    <span className="mono text-[var(--color-neon)] text-[12px]">
                      lv.0{group.level}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 pt-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="mono text-[11px] px-8 py-3 rounded-block bg-[var(--color-art)] border border-[var(--color-line)] text-mut"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Perks */}
          <div className="flex items-center gap-12 pt-12 border-t border-[var(--color-line)] flex-wrap">
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

      {/* Quest log */}
      <div className="quest-log border border-[var(--color-line)] rounded-card bg-[var(--color-card)] p-28">
        <div className="flex justify-between items-baseline border-b border-[var(--color-line)] pb-14 mb-18 flex-wrap gap-12">
          <div className="flex items-baseline gap-12 flex-wrap">
            <span className="mono text-[var(--color-neon)] text-[12px] uppercase tracking-wider">
              QUEST LOG
            </span>
            <h3 className="m-0 font-disp font-[800] text-[22px] text-ink font-stretch-125">
              {quest.title}
            </h3>
            <span className="mono text-mut text-[13px]">@ {quest.where}</span>
          </div>
          <span className="mono text-mut text-[12px]">{quest.when}</span>
        </div>
        <p className="mono text-mut text-[12px] mb-24 m-0">{quest.context}</p>
        <div className="grid grid-cols-4 narrow:grid-cols-2 gap-20">
          {quest.results.map((r) => (
            <div key={r.value} className="flex flex-col gap-6">
              <span className="font-disp font-[800] text-[32px] text-[var(--color-neon)] leading-none font-stretch-125">
                {r.value}
              </span>
              <span className="mono text-mut text-[12px] leading-snug">
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
