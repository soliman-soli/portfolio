import type { ProjectStatus } from '@/content/projects'

interface StatusPillProps {
  status?: ProjectStatus
  label: string
  className?: string
}

export function StatusPill({ status, label, className = '' }: StatusPillProps) {
  return (
    <span className={`st mono ${status ? status : ''} ${className}`}>
      {label}
    </span>
  )
}
