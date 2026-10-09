import { projects } from '@/content/projects'
import { WorkRow } from './WorkRow'

export function WorkSection() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative z-[2] p-[120px_40px_140px] narrow:p-[80px_20px_100px] border-t border-[var(--color-line)]"
    >
      <div className="whead flex justify-between items-end gap-20 mb-56 narrow:flex-col narrow:items-start">
        <h2
          id="work-title"
          className="m-0 font-[800] text-section font-disp font-stretch-125"
        >
          Selected work
          <sup className="font-mono text-[0.22em] text-[var(--color-neon)] tracking-normal align-top ml-[0.4em]">
            (04)
          </sup>
        </h2>
        <p className="mono text-mut text-right narrow:text-left m-0">
          2023 &mdash; 2024
          <br />
          <span className="work-hint-hover">click a project to start the game</span>
          <span className="work-hint-touch">tap a project to start the game</span>
        </p>
      </div>

      <div
        id="list"
        className="work-list border-t border-[var(--color-line)]"
      >
        {projects.map((p, i) => (
          <WorkRow
            key={p.slug}
            project={p}
            index={i}
            total={projects.length}
          />
        ))}
      </div>

      <div className="wfoot mono flex justify-between items-center mt-36 text-mut">
        <span>every number on this page is a real result from my projects</span>
        <a
          className="cta"
          href="https://github.com/soliman-ahmed"
          target="_blank"
          rel="noopener noreferrer"
        >
          all projects on github <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  )
}
