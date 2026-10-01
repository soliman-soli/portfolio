export interface Project {
  id: string
  title: string
  problem: string
  outcome: string
  stack: string[]
  /** SVG diagram definition — simple boxes and arrows */
  diagram: DiagramNode[]
  diagramArrows: DiagramArrow[]
  featured?: boolean
}

export interface DiagramNode {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  style?: 'box' | 'circle' | 'diamond'
}

export interface DiagramArrow {
  from: string
  to: string
  label?: string
}

export const projects: Project[] = [
  {
    id: 'nova-dashboard',
    title: 'Nova Dashboard',
    problem: "Desktop teams needed a modern, data-rich UI for internal tooling -- Qt's default widgets felt dated.",
    outcome: "A polished C++/Qt desktop app with custom widget theming, live data charts, and sub-100ms renders.",
    stack: ['C++', 'Qt 6', 'QML', 'CMake'],
    featured: true,
    diagram: [
      { id: 'ui', label: 'QML UI', x: 10, y: 40, w: 70, h: 32 },
      { id: 'ctrl', label: 'C++ Controller', x: 110, y: 40, w: 90, h: 32 },
      { id: 'data', label: 'Data Layer', x: 230, y: 40, w: 80, h: 32 },
    ],
    diagramArrows: [
      { from: 'ui', to: 'ctrl' },
      { from: 'ctrl', to: 'data' },
    ],
  },
  {
    id: 'adforge',
    title: 'AdForge',
    problem: "A car-sales business spent 8+ hours per week producing video ads manually.",
    outcome: "Fully automated pipeline: AI voiceover to stock footage assembly to rendered MP4, reducing production to under 5 minutes per ad.",
    stack: ['Node.js', 'TypeScript', 'OpenAI TTS', 'FFmpeg', 'n8n'],
    featured: true,
    diagram: [
      { id: 'brief', label: 'Ad Brief', x: 10, y: 40, w: 70, h: 32 },
      { id: 'ai', label: 'AI Voice', x: 110, y: 40, w: 70, h: 32 },
      { id: 'ffmpeg', label: 'FFmpeg', x: 210, y: 40, w: 70, h: 32 },
      { id: 'mp4', label: 'Final MP4', x: 310, y: 40, w: 70, h: 32 },
    ],
    diagramArrows: [
      { from: 'brief', to: 'ai' },
      { from: 'ai', to: 'ffmpeg' },
      { from: 'ffmpeg', to: 'mp4' },
    ],
  },
  {
    id: 'ledger-api',
    title: 'Ledger API',
    problem: "Needed a production-grade REST API with auth, job queues, and clear system-design documentation.",
    outcome: "Fully typed Node.js/TypeScript backend: JWT auth, BullMQ queues, PostgreSQL, Swagger docs, deployed on Railway.",
    stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'BullMQ', 'Docker'],
    featured: true,
    diagram: [
      { id: 'client', label: 'Client', x: 10, y: 40, w: 60, h: 32 },
      { id: 'api', label: 'REST API', x: 100, y: 40, w: 70, h: 32 },
      { id: 'queue', label: 'Queue', x: 200, y: 40, w: 70, h: 32 },
      { id: 'db', label: 'Postgres', x: 300, y: 40, w: 80, h: 32 },
    ],
    diagramArrows: [
      { from: 'client', to: 'api' },
      { from: 'api', to: 'queue' },
      { from: 'api', to: 'db' },
    ],
  },
  {
    id: 'island-engine',
    title: 'Island Engine',
    problem: "Needed a reusable SVG isometric-island component system with per-variant animations for this portfolio.",
    outcome: "Four fully-themed, animated island variants (server, automation, blueprint, desktop) that re-theme with CSS variables and respect prefers-reduced-motion.",
    stack: ['TypeScript', 'React', 'Framer Motion', 'SVG', 'CSS'],
    featured: false,
    diagram: [
      { id: 'comp', label: 'FloatingIsland', x: 10, y: 40, w: 110, h: 32 },
      { id: 'var', label: 'Variant SVG', x: 150, y: 40, w: 100, h: 32 },
      { id: 'css', label: 'islands.css', x: 280, y: 40, w: 90, h: 32 },
    ],
    diagramArrows: [
      { from: 'comp', to: 'var' },
      { from: 'comp', to: 'css' },
    ],
  },
]
