import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProject, projects } from '@/content/projects'
import { StatusPill } from '@/components/ui/StatusPill'
import { PreviewArt } from '@/components/work/PreviewArt'
import { XpBar } from '@/components/ui/XpBar'

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
    <div className="min-h-screen p-[44px_40px] narrow:p-[36px_20px] max-w-[800px] mx-auto">
      <nav className="mb-48">
        <Link href="/" className="cta mono">
          &larr; back to overview
        </Link>
      </nav>

      <article className="border border-[var(--color-line)] rounded-card overflow-hidden bg-[var(--color-card)]">
        <PreviewArt art={project.art} className="!h-[240px]" />

        <div className="p-32 flex flex-col gap-24">
          <div className="flex justify-between items-baseline flex-wrap gap-12">
            <div>
              <span className="mono text-[var(--color-neon)] text-[14px] mr-12">
                #{project.index}
              </span>
              <h1 className="inline font-[800] text-[36px] font-disp font-stretch-125 text-ink">
                {project.title}
              </h1>
            </div>
            <StatusPill status={project.status} label={project.statusLabel} />
          </div>

          <div className="grid grid-cols-2 gap-16 border-y border-[var(--color-line)] py-16">
            {project.stats.map((s) => (
              <div key={s.label} className="mono flex flex-col gap-4">
                <span className="text-mut text-[12px]">{s.label}</span>
                <b className="font-normal text-ink text-[14px]">{s.value}</b>
              </div>
            ))}
            <div className="mono flex flex-col gap-4">
              <span className="text-mut text-[12px]">stack</span>
              <b className="font-normal text-ink text-[14px]">{project.tag}</b>
            </div>
            <div className="mono flex flex-col gap-4">
              <span className="text-mut text-[12px]">year</span>
              <b className="font-normal text-ink text-[14px]">{project.year}</b>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-8 mono text-mut text-[12px]">
              <span>mastery level</span>
              <span className="text-[var(--color-neon)]">lv.0{project.level}</span>
            </div>
            <XpBar xp={project.xp} />
          </div>

          <div className="text-mut text-[14px] leading-relaxed mt-12">
            <p>
              Detailed case study coming soon. This placeholder page represents
              the real project destination linked from the Selected Work list.
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}
