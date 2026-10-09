export const skillGroups = [
  { name: 'Backend & APIs', level: 4, xp: 9, skills: ['Python','FastAPI','Node.js','REST API Design','Asynchronous Programming','Pydantic','JWT Authentication'] },
  { name: 'AI & RAG', level: 4, xp: 8, skills: ['LangChain','OpenAI Embeddings','CodeBERT','Gemini API','Qdrant','BM25','Hybrid Retrieval Search','Retrieval-Augmented Generation'] },
  { name: 'Databases', level: 3, xp: 7, skills: ['MySQL','Qdrant Vector Database','Query Optimization','ORM','Indexing Strategies'] },
  { name: 'Programming', level: 3, xp: 8, skills: ['Python','JavaScript','C++','PHP'] },
  { name: 'DevOps & Tooling', level: 3, xp: 6, skills: ['Docker','Git','GitHub API','OpenAPI','Swagger','Linux'] },
  { name: 'Frontend', level: 2, xp: 6, skills: ['React','JavaScript ES6+','HTML5','CSS3','AJAX'] },
  { name: 'Data & Analysis', level: 2, xp: 6, skills: ['Pandas','NumPy','Seaborn','Power BI','Matplotlib'] },
] as const

export const perks = ['Cross-functional Collaboration','Technical Documentation','Agile Teamwork','Problem Solving','Mentorship'] as const

export const quest = {
  title: 'Backend Engineering Intern',
  where: 'In Time Dev',
  when: 'Jul 2024 - Sep 2024',
  context: 'B2B SaaS platform · 4-person engineering team · 3 enterprise clients',
  results: [
    { value: '-35%', label: 'API latency across 3 client-facing services (MySQL query-plan profiling, indexed lookups)' },
    { value: '-25%', label: 'slow-query frequency (ORM refactor + composite indexes on 3 high-traffic tables)' },
    { value: '2,000+', label: 'users covered by hardened auth: session-based RBAC, email verification, 4 endpoint vulnerabilities fixed' },
    { value: '8 / 8', label: 'planned features shipped on schedule in 3 months, with no post-launch rollback' },
  ],
} as const
