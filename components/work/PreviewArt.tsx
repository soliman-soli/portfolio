import type { ProjectArt } from '@/content/projects'

interface PreviewArtProps {
  art: ProjectArt
  className?: string
}

export function PreviewArt({ art, className = '' }: PreviewArtProps) {
  return (
    <div className={`art art--${art} ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  )
}
