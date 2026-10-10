import { ARCADE_CONFIG } from './config'

export type ObstacleType =
  | '404'
  | 'memory_leak'
  | 'rate_limit_barrier'
  | 'null_pointer'
  | 'context_blob'
  | 'overflow_monolith'
  | 'race_drone'
  | 'buffer_overflow'
  | 'firewall_gate'

export interface ObstacleDef {
  type: ObstacleType
  label: string
  hp: number
  points: number
  width: number
  height: number
  speedX: number
  speedY?: number
  sineAmp?: number
  sineFreq?: number
  indestructible?: boolean
  color: string
}

export interface BossDef {
  name: string
  subtitle: string
  maxHp: number
  width: number
  height: number
  color: string
}

export interface LevelDef {
  id: number
  title: string
  subtitle: string
  bgSpeed: number
  waveDuration: number // seconds
  spawnInterval: number // seconds between obstacle spawns
  allowedObstacles: ObstacleType[]
  boss: BossDef
}

export const OBSTACLE_DEFS: Record<ObstacleType, ObstacleDef> = {
  // Level 1: Backend & APIs
  '404': {
    type: '404',
    label: '404',
    hp: 1,
    points: 100,
    width: 22,
    height: 12,
    speedX: 95,
    sineAmp: 18,
    sineFreq: 3.5,
    color: ARCADE_CONFIG.COLORS.warning,
  },
  'memory_leak': {
    type: 'memory_leak',
    label: 'LEAK',
    hp: 3,
    points: 200,
    width: 20,
    height: 18,
    speedX: 60,
    color: '#E06C75',
  },
  'rate_limit_barrier': {
    type: 'rate_limit_barrier',
    label: '429',
    hp: 9999,
    points: 0,
    width: 14,
    height: 55,
    speedX: 50,
    indestructible: true,
    color: ARCADE_CONFIG.COLORS.line,
  },

  // Level 2: AI & RAG
  'null_pointer': {
    type: 'null_pointer',
    label: 'NULL',
    hp: 2,
    points: 150,
    width: 24,
    height: 10,
    speedX: 120,
    color: ARCADE_CONFIG.COLORS.cyan,
  },
  'context_blob': {
    type: 'context_blob',
    label: 'TOKENS',
    hp: 5,
    points: 300,
    width: 24,
    height: 22,
    speedX: 55,
    sineAmp: 12,
    sineFreq: 2.0,
    color: '#C678DD',
  },
  'overflow_monolith': {
    type: 'overflow_monolith',
    label: 'OOM',
    hp: 9999,
    points: 0,
    width: 16,
    height: 65,
    speedX: 45,
    indestructible: true,
    color: ARCADE_CONFIG.COLORS.line,
  },

  // Level 3: Security & DevOps
  'race_drone': {
    type: 'race_drone',
    label: 'RACE',
    hp: 2,
    points: 200,
    width: 18,
    height: 14,
    speedX: 110,
    sineAmp: 28,
    sineFreq: 4.5,
    color: ARCADE_CONFIG.COLORS.danger,
  },
  'buffer_overflow': {
    type: 'buffer_overflow',
    label: 'OVERFLOW',
    hp: 6,
    points: 350,
    width: 26,
    height: 20,
    speedX: 55,
    color: '#FF6B6B',
  },
  'firewall_gate': {
    type: 'firewall_gate',
    label: 'DROP',
    hp: 9999,
    points: 0,
    width: 14,
    height: 70,
    speedX: 45,
    indestructible: true,
    color: ARCADE_CONFIG.COLORS.danger,
  },
}

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    title: 'BACKEND & APIs',
    subtitle: 'STAGE 1: HIGH-THROUGHPUT ROUTING',
    bgSpeed: 30,
    waveDuration: ARCADE_CONFIG.WAVE_DURATION_SEC,
    spawnInterval: 1.3,
    allowedObstacles: ['404', 'memory_leak', 'rate_limit_barrier'],
    boss: {
      name: ARCADE_CONFIG.BOSS_1_NAME,
      subtitle: ARCADE_CONFIG.BOSS_1_SUBTITLE,
      maxHp: ARCADE_CONFIG.BOSS_1_HP,
      width: 48,
      height: 48,
      color: ARCADE_CONFIG.COLORS.danger,
    },
  },
  {
    id: 2,
    title: 'AI & RAG',
    subtitle: 'STAGE 2: VECTOR EMBEDDING SPACE',
    bgSpeed: 45,
    waveDuration: ARCADE_CONFIG.WAVE_DURATION_SEC,
    spawnInterval: 1.15,
    allowedObstacles: ['null_pointer', 'context_blob', 'overflow_monolith'],
    boss: {
      name: ARCADE_CONFIG.BOSS_2_NAME,
      subtitle: ARCADE_CONFIG.BOSS_2_SUBTITLE,
      maxHp: ARCADE_CONFIG.BOSS_2_HP,
      width: 44,
      height: 44,
      color: '#C678DD',
    },
  },
  {
    id: 3,
    title: 'SECURITY & DEVOPS',
    subtitle: 'STAGE 3: ZERO-TRUST ENVIRONMENT',
    bgSpeed: 60,
    waveDuration: ARCADE_CONFIG.WAVE_DURATION_SEC,
    spawnInterval: 0.95,
    allowedObstacles: ['race_drone', 'buffer_overflow', 'firewall_gate'],
    boss: {
      name: ARCADE_CONFIG.BOSS_3_NAME,
      subtitle: ARCADE_CONFIG.BOSS_3_SUBTITLE,
      maxHp: ARCADE_CONFIG.BOSS_3_HP,
      width: 52,
      height: 46,
      color: ARCADE_CONFIG.COLORS.danger,
    },
  },
]
