/**
 * Central Configuration for the Soliman-OS Arcade Mini-Game.
 * All difficulty, speed, health, and timing values can be adjusted here.
 */

export const ARCADE_CONFIG = {
  // Canvas resolution (internal 16:9 pixel buffer, upscaled via CSS)
  CANVAS_WIDTH: 320,
  CANVAS_HEIGHT: 180,

  // Player settings
  PLAYER_SPEED: 130, // px per second
  PLAYER_LIVES: 3,
  PLAYER_FIRE_RATE: 0.13, // seconds between shots (~7.7 shots/sec)
  PLAYER_INVULN_TIME: 1.8, // seconds of invincibility after hit
  PLAYER_PROJECTILE_SPEED: 320, // px per second
  PLAYER_HITBOX_RADIUS: 5,

  // Screen shake
  SHAKE_DURATION: 0.22, // seconds
  SHAKE_INTENSITY: 3.5, // pixels

  // Continue countdown
  CONTINUE_COUNTDOWN_SECONDS: 9,

  // Level & Wave pacing
  WAVE_DURATION_SEC: 35, // seconds of obstacles before boss spawns

  // Boss Health & Stats
  BOSS_1_NAME: 'THE 500 ERROR',
  BOSS_1_SUBTITLE: 'Internal Server Catastrophe',
  BOSS_1_HP: 28,

  BOSS_2_NAME: 'THE HALLUCINATION',
  BOSS_2_SUBTITLE: 'Stochastic Divergence',
  BOSS_2_HP: 42,

  BOSS_3_NAME: 'THE ZERO-DAY',
  BOSS_3_SUBTITLE: 'Kernel-Level Exploit Core',
  BOSS_3_HP: 58,

  // Colors (matching soliman-portfolio palette)
  COLORS: {
    night: '#070708',
    card: '#0d0d0f',
    ink: '#EDEDE8',
    mut: '#8b8b86',
    line: 'rgba(237, 237, 232, 0.14)',
    neon: '#CCFF2E', // Lime green accent
    neonDim: 'rgba(204, 255, 46, 0.25)',
    danger: '#FF3B47', // Crimson danger
    warning: '#FFAA1D', // Amber warning
    cyan: '#38DDF8', // Auxiliary tech blue
    shield: '#5CE6E6',
  },

  // Storage key
  STORAGE_GEM_KEY: 'soliman_arcade_gem_collected',
  FLAG_CODE: 'SOLIMAN{y0u_f0und_th3_g3m}',
} as const
