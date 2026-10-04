import type { Project } from '@/content/projects'
import { PreviewArt } from './PreviewArt'
import { XpBar } from '../ui/XpBar'

interface PreviewCardProps {
  project: Project
  showArt?: boolean
}

export function PreviewCard({ project, showArt = true }: PreviewCardProps) {
  return (
    <>
      {showArt && <PreviewArt art={project.art} />}
      <div className="pi">
        <div className="ph">
          <strong>{project.title}</strong>
          <span className="mono">lv.0{project.level}</span>
        </div>
        {project.stats.map((s) => (
          <div key={s.label} className="kv mono">
            <span>{s.label}</span>
            <b>{s.value}</b>
          </div>
        ))}
        <XpBar xp={project.xp} />
      </div>
    </>
  )
}
