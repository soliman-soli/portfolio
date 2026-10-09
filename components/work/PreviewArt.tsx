import type { ProjectSprite } from '@/content/projects'
import { PixelSprite } from './PixelSprite'

export type ProjectArt = ProjectSprite

interface PreviewArtProps {
  art: ProjectSprite
  className?: string
}

export function PreviewArt({ art, className = '' }: PreviewArtProps) {
  return <PixelSprite sprite={art} className={className} />
}
