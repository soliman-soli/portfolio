/**
 * Selected work. Every entry here is placeholder content from the prototype.
 * TODO(soliman): replace with real projects (names, stats, status, years).
 */

export type ProjectStatus = 'wip' | 'live' | 'plan' | 'done'

/** Which CSS shape composition the preview card shows. */
export type ProjectArt = 'island' | 'video' | 'api' | 'gantt'

export interface Project {
  slug: string
  /** Display index, already zero-padded. */
  index: string
  title: string
  status: ProjectStatus
  statusLabel: string
  /** Short stack/tag line shown in the row. */
  tag: string
  year: string
  /** Gamified level, rendered as "lv.0N". */
  level: number
  /** Filled XP segments, 0..10. */
  xp: number
  art: ProjectArt
  /** Exactly two key/value stats for the preview card. */
  stats: readonly [Stat, Stat]
}

export interface Stat {
  label: string
  value: string
}

/** The XP bar always has this many segments. */
export const XP_SEGMENTS = 10

export const projects: readonly Project[] = [
  {
    slug: 'island-dashboard',
    index: '01',
    title: 'Island Dashboard',
    status: 'wip',
    statusLabel: 'In progress',
    tag: 'C++ / Qt',
    year: '2026',
    level: 3,
    xp: 6,
    art: 'island',
    stats: [
      { label: 'type', value: 'desktop app' },
      { label: 'focus', value: 'isometric ui' },
    ],
  },
  {
    slug: 'car-page-ad-studio',
    index: '02',
    title: 'Car Page Ad Studio',
    status: 'live',
    statusLabel: 'Live',
    tag: 'AI video / marketing',
    year: '2026',
    level: 2,
    xp: 7,
    art: 'video',
    stats: [
      { label: 'type', value: 'ad workflow' },
      { label: 'channel', value: 'facebook' },
    ],
  },
  {
    slug: 'backend-api',
    index: '03',
    title: 'Backend API',
    status: 'plan',
    statusLabel: 'Planned',
    tag: 'Node / TypeScript',
    year: '2026',
    level: 1,
    xp: 2,
    art: 'api',
    stats: [
      { label: 'type', value: 'rest service' },
      { label: 'focus', value: 'auth + database' },
    ],
  },
  {
    slug: 'scheduler-simulation',
    index: '04',
    title: 'Scheduler Simulation',
    status: 'done',
    statusLabel: 'Shipped',
    tag: 'C++ / OS',
    year: '2025',
    level: 2,
    xp: 10,
    art: 'gantt',
    stats: [
      { label: 'type', value: 'university task' },
      { label: 'output', value: 'pdf report' },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
