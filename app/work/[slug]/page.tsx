import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProject, projects } from '@/content/projects'
import { StatusPill } from '@/components/ui/StatusPill'
import { PixelSprite } from '@/components/work/PixelSprite'
import { DitherFrame } from '@/components/ui/DitherFrame'
import { FocusHeading } from '@/components/transition/FocusHeading'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen p-[48px_48px_80px] narrow:p-[36px_24px_60px] max-w-[840px] mx-auto overflow-x-clip">
      <nav className="mb-56 narrow:mb-40">
        <Link href="/" className="cta mono">
          &larr; back to overview
        </Link>
      </nav>

      <DitherFrame className="w-full">
        <article className="border-2 border-[var(--color-neon)] rounded-card overflow-hidden bg-[var(--color-card)] shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* Pixel Sprite banner at top */}
          <div className="h-[180px] bg-[var(--color-art)] border-b border-[var(--color-line)] flex items-center justify-center p-24">
            <PixelSprite sprite={project.sprite} className="scale-125" />
          </div>

          <div className="p-32 flex flex-col gap-28">
            {/* Header */}
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-baseline flex-wrap gap-12">
                <div>
                  <span className="mono text-[var(--color-neon)] text-[14px] mr-12">
                    #{project.index}
                  </span>
                  <h1
                    id="project-heading"
                    tabIndex={-1}
                    className="inline font-[800] text-[36px] narrow:text-[28px] font-disp font-stretch-125 text-ink outline-none"
                  >
                    {project.title}
                  </h1>
                  <FocusHeading targetId="project-heading" />
                </div>
                <StatusPill status={project.status} label={project.statusLabel} />
              </div>

              {project.role && (
                <span className="mono text-[13px] text-[var(--color-neon)]">
                  {project.role}
                </span>
              )}
            </div>

            {/* Summary */}
            <p className="text-ink text-[16px] leading-relaxed m-0">
              {project.summary}
            </p>

            {/* Highlights as a stat grid */}
            <div className="border-y border-[var(--color-line)] py-20">
              <span className="mono text-mut text-[11px] uppercase tracking-wider block mb-14">
                key metrics &middot; highlights
              </span>
              <div className="grid grid-cols-3 narrow:grid-cols-1 gap-20">
                {project.highlights.map((h) => (
                  <div key={h.label} className="flex flex-col gap-4">
                    <span className="font-disp font-[800] text-[28px] text-[var(--color-neon)] leading-none font-stretch-125">
                      {h.value}
                    </span>
                    <span className="mono text-mut text-[12px] leading-snug">
                      {h.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details list */}
            <div className="flex flex-col gap-12">
              <span className="mono text-mut text-[11px] uppercase tracking-wider">
                mission briefing &middot; details
              </span>
              <ul className="flex flex-col gap-10 m-0 p-0 list-none">
                {project.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-12 text-mut text-[14px] leading-relaxed">
                    <span className="text-[var(--color-neon)] mono shrink-0">&gt;</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stack & Year */}
            <div className="border-t border-[var(--color-line)] pt-20">
              <div className="flex justify-between items-start flex-wrap gap-12">
                <div className="flex flex-col gap-8">
                  <span className="mono text-mut text-[12px]">tech stack</span>
                  <div className="flex flex-wrap gap-6">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="mono text-[12px] px-8 py-4 rounded-block bg-[var(--color-art)] border border-[var(--color-line)] text-ink"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="mono text-mut text-[12px]">year</span>
                  <b className="mono text-ink text-[14px] font-normal">{project.year}</b>
                </div>
              </div>
            </div>
          </div>
        </article>
      </DitherFrame>
    </div>
  )
}
