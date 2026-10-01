export interface StackGroup {
  label: string
  items: string[]
}

export const stack: StackGroup[] = [
  {
    label: 'Languages',
    items: ['C++', 'TypeScript', 'JavaScript', 'Python'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'REST APIs', 'PostgreSQL', 'BullMQ', 'Redis'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    label: 'Tools & AI',
    items: ['Git', 'Docker', 'AI agents', 'OpenAI APIs', 'FFmpeg', 'n8n'],
  },
]
