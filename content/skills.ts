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

export const playerCard = {
  name: 'Soliman Ahmed',
  class: 'Backend Engineer',
  subclass: 'AI Systems & RAG',
  base: 'Cairo, Egypt',
  education:
    'B.Sc. Computer Engineering, Misr University for Science and Technology (MUST), expected July 2028, GPA 3.1',
  educationShort:
    'B.Sc. Computer Engineering, MUST (expected July 2028), GPA 3.1',
} as const
