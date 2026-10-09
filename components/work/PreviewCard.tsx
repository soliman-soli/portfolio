import type { Project } from '@/content/projects'
import { StageScreen } from './StageScreen'

interface PreviewCardProps {
  project: Project
  isTouch?: boolean
}

export function PreviewCard({ project, isTouch = false }: PreviewCardProps) {
  return <StageScreen project={project} isTouch={isTouch} />
}
