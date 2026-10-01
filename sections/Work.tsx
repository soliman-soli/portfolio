import Reveal from '@/components/Reveal'
import ProjectCard from '@/components/ProjectCard'
import FloatingIsland from '@/components/islands/FloatingIsland'
import { projects } from '@/data/projects'

export default function Work() {
  const featured = projects.filter((p) => p.featured)

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="section-padding relative overflow-hidden"
    >
      {/* Decorative island */}
      <div
        className="absolute top-[60px] right-[4%] hidden xl:block z-0 pointer-events-none"
        aria-hidden="true"
      >
        <FloatingIsland variant="blueprint" size="md" alt />
      </div>

      <div className="container-main relative z-10">
        <Reveal className="mb-12">
          <p className="mono-label mb-3">{'01 \u2014 Selected Work'}</p>
          <h2
            id="work-heading"
            className="
              font-serif
              text-[clamp(2rem,4vw,3.5rem)]
              font-semibold leading-tight tracking-tight
              text-[var(--text-primary)]
            "
          >
            Projects I&apos;m proud of.
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.1}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
