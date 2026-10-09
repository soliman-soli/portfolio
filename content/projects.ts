export type ProjectKind = 'Team · 5 engineers' | 'Personal' | 'Academic'
export type ProjectStatus = 'featured' | 'done' | 'wip' | 'live' | 'plan'
export type ProjectSprite = 'repos' | 'vectors' | 'tenants' | 'bars'

export interface ProjectHighlight {
  value: string
  label: string
}

export interface Project {
  slug: string
  /** Display index, already zero-padded. */
  index: string
  title: string
  status: ProjectStatus
  statusLabel: string
  kind: ProjectKind
  /** Short stack/tag line shown in the row. */
  tag: string
  year: string
  /** Gamified level, rendered as "lv.0N". */
  level: number
  /** Filled XP segments, 0..10. */
  xp: number
  role?: string
  summary: string
  stack: string[]
  highlights: ProjectHighlight[]
  details: string[]
  boss: string
  sprite: ProjectSprite
}

/** The XP bar always has this many segments. */
export const XP_SEGMENTS = 10

export const projects: readonly Project[] = [
  {
    slug: 'ai-candidate-evaluation',
    index: '01',
    title: 'AI Candidate Evaluation System',
    status: 'featured',
    statusLabel: 'Team · 5 engineers',
    kind: 'Team · 5 engineers',
    tag: 'Python / FastAPI / LangChain',
    year: '2024',
    level: 3,
    xp: 9,
    role: 'Sole full-stack engineer on a 5-engineer team',
    summary:
      'Evaluates a software candidate in under 2 minutes by pulling their public GitHub repos (about 30 on average) and turning them into a structured recruiter report.',
    stack: [
      'Python',
      'FastAPI',
      'LangChain',
      'CodeBERT',
      'Gemini API',
      'GitHub API',
      'React',
    ],
    highlights: [
      { value: '<2 min', label: 'per candidate' },
      { value: '~30', label: 'repos analyzed on average' },
      { value: '5', label: 'engineers on the team' },
    ],
    details: [
      'CodeBERT embeddings from repo source code, with analysis routed through the Gemini API.',
      'Reports cover code quality scores, language proficiency and contribution patterns.',
      'Job-description requirements are indexed as retrieval queries against the candidate\'s embedded code, giving evidence-backed skill-gap comparisons.',
      'Built the FastAPI backend, the LangChain orchestration layer and the React recruiter dashboard.',
    ],
    boss: 'manual portfolio review',
    sprite: 'repos',
  },
  {
    slug: 'rag-document-qa-api',
    index: '02',
    title: 'RAG Document Q&A API',
    status: 'done',
    statusLabel: 'Personal',
    kind: 'Personal',
    tag: 'Python / FastAPI / Qdrant',
    year: '2024',
    level: 3,
    xp: 8,
    summary:
      'An end-to-end retrieval-augmented generation API: ingest documents, retrieve the right chunks fast, answer with sources.',
    stack: [
      'Python',
      'FastAPI',
      'LangChain',
      'OpenAI Embeddings',
      'Qdrant',
      'Docker',
    ],
    highlights: [
      { value: '-70%', label: 'search latency vs keyword search' },
      { value: '<2 s', label: 'at 20 concurrent requests' },
      { value: '10,000+', label: 'chunks in Qdrant' },
      { value: '+30%', label: 'retrieval precision (hybrid search)' },
    ],
    details: [
      'Cosine-similarity retrieval over OpenAI text-embedding-3-small vectors in Qdrant.',
      'Chunk size, overlap and HNSW index tuned, then validated with Locust load tests.',
      'Hybrid search: dense embeddings + BM25, with metadata filters on source and date range.',
      'FastAPI with Pydantic v2 validation, async handlers, JWT-secured endpoints, Docker, OpenAPI docs.',
    ],
    boss: 'slow keyword search',
    sprite: 'vectors',
  },
  {
    slug: 'secure-multi-tenant-platform',
    index: '03',
    title: 'Secure Multi-Tenant Web Platform',
    status: 'done',
    statusLabel: 'Academic',
    kind: 'Academic',
    tag: 'Python / MySQL / MVC',
    year: '2023',
    level: 2,
    xp: 7,
    summary:
      'A multi-tenant backend built around access control and isolation, checked against the OWASP Top 10.',
    stack: ['Python', 'MySQL', 'REST API', 'MVC Architecture', 'AJAX'],
    highlights: [
      {
        value: '0',
        label: 'critical vulnerabilities (OWASP Top 10 checklist)',
      },
      { value: '-90%', label: 'form error rate after the AJAX migration' },
      { value: '-50%', label: 'per-controller complexity' },
      { value: '1 day', label: 'for 3 collaborators to onboard' },
    ],
    details: [
      'Granular role-based access control, per-tenant session isolation, CSRF-protected routing.',
      'Synchronous page-reload forms replaced with event-driven AJAX and real-time server-side validation.',
      'Strict MVC separation: business logic, data models and templates decoupled.',
    ],
    boss: 'the OWASP Top 10',
    sprite: 'tenants',
  },
  {
    slug: 'sales-intelligence-dashboard',
    index: '04',
    title: 'Sales Intelligence Dashboard',
    status: 'done',
    statusLabel: 'Personal',
    kind: 'Personal',
    tag: 'Python / Pandas / Power BI',
    year: '2023',
    level: 2,
    xp: 6,
    summary:
      'Turned a raw 50,000-row sales export into a repeatable pipeline and an interactive dashboard that exposed where revenue was leaking.',
    stack: ['Python', 'Pandas', 'NumPy', 'Seaborn', 'Power BI'],
    highlights: [
      {
        value: '$12,000',
        label: 'monthly revenue deficit uncovered',
      },
      { value: '50,000', label: 'rows analyzed' },
      { value: '3 days → 4 h', label: 'reporting cycle' },
    ],
    details: [
      'Pandas/NumPy aggregation surfaced underperforming SKUs hidden in raw spreadsheet exports.',
      'Ingestion, cleansing, aggregation and visualization automated in one reproducible Python script, with an interactive Power BI dashboard on top.',
    ],
    boss: 'the manual Excel report',
    sprite: 'bars',
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
