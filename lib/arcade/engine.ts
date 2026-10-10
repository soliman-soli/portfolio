import { ARCADE_CONFIG } from './config'
import { sound } from './audio'
import { LEVELS, type LevelDef, type ObstacleType } from './levels'
import {
  Player,
  Obstacle,
  Boss,
  Projectile,
  Particle,
  Star,
} from './entities'

export type GameState =
  | 'boot'
  | 'title'
  | 'playing'
  | 'boss'
  | 'stage_clear'
  | 'game_over'
  | 'reward'

export interface ArcadeEngineCallbacks {
  onStateChange?: (state: GameState) => void
  onReward?: (score: number) => void
  onExit?: () => void
}

export class ArcadeEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private callbacks: ArcadeEngineCallbacks

  // State
  public state: GameState = 'boot'
  private currentLevelIndex: number = 0
  private levelTimer: number = 0
  private spawnTimer: number = 0
  private continueTimer: number = ARCADE_CONFIG.CONTINUE_COUNTDOWN_SECONDS
  private bootTimer: number = 0

  // Shake
  private shakeTimer: number = 0
  private shakeOffsetX: number = 0
  private shakeOffsetY: number = 0
  private prefersReducedMotion: boolean = false

  // Entities
  private player: Player = new Player()
  private obstacles: Obstacle[] = []
  private projectiles: Projectile[] = []
  private particles: Particle[] = []
  private stars: Star[] = []
  private boss: Boss | null = null

  // Input states
  private keys: Record<string, boolean> = {}
  private isAutoFiring: boolean = false
  private touchActive: boolean = false
  private touchTargetX: number = 0
  private touchTargetY: number = 0

  // Loop
  private animId: number | null = null
  private lastTime: number = 0
  private isPaused: boolean = false

  constructor(canvas: HTMLCanvasElement, callbacks: ArcadeEngineCallbacks = {}) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not get 2D canvas context')
    this.ctx = context
    this.callbacks = callbacks

    // Configure canvas
    this.canvas.width = ARCADE_CONFIG.CANVAS_WIDTH
    this.canvas.height = ARCADE_CONFIG.CANVAS_HEIGHT
    this.ctx.imageSmoothingEnabled = false

    // Stars
    for (let i = 0; i < 45; i++) {
      this.stars.push(new Star(ARCADE_CONFIG.CANVAS_WIDTH, ARCADE_CONFIG.CANVAS_HEIGHT))
    }

    // Check reduced motion
    if (typeof window !== 'undefined') {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    this.bindEvents()
    this.start()
  }

  public get currentLevel(): LevelDef {
    return LEVELS[this.currentLevelIndex] || LEVELS[0]
  }

  private setState(newState: GameState) {
    this.state = newState
    this.callbacks.onStateChange?.(newState)

    if (newState === 'reward') {
      this.callbacks.onReward?.(this.player.score)
    }
  }

  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('blur', this.handleBlur)
    window.addEventListener('focus', this.handleFocus)

    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false })
  }

  public destroy() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId)
      this.animId = null
    }

    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('blur', this.handleBlur)
    window.removeEventListener('focus', this.handleFocus)

    this.canvas.removeEventListener('touchstart', this.handleTouchStart)
    this.canvas.removeEventListener('touchmove', this.handleTouchMove)
    this.canvas.removeEventListener('touchend', this.handleTouchEnd)
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = true

    if (e.key === 'Escape') {
      this.callbacks.onExit?.()
      return
    }

    // Space / Enter / Action keys for state progression
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (this.state === 'boot') {
        this.setState('title')
      } else if (this.state === 'title') {
        this.startLevel(0)
      } else if (this.state === 'game_over') {
        // Continue game
        sound.playClear()
        this.startLevel(this.currentLevelIndex, true)
      }
    }
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = false
  }

  private handleBlur = () => {
    this.isPaused = true
  }

  private handleFocus = () => {
    this.isPaused = false
    this.lastTime = performance.now()
  }

  private getTouchCanvasCoords(touch: Touch): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = ARCADE_CONFIG.CANVAS_WIDTH / rect.width
    const scaleY = ARCADE_CONFIG.CANVAS_HEIGHT / rect.height
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    }
  }

  private handleTouchStart = (e: TouchEvent) => {
    e.preventDefault()
    if (e.touches.length > 0) {
      const coords = this.getTouchCanvasCoords(e.touches[0])
      this.touchActive = true
      this.touchTargetX = coords.x
      this.touchTargetY = coords.y
      this.isAutoFiring = true

      if (this.state === 'boot') {
        this.setState('title')
      } else if (this.state === 'title') {
        this.startLevel(0)
      } else if (this.state === 'game_over') {
        sound.playClear()
        this.startLevel(this.currentLevelIndex, true)
      }
    }
  }

  private handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    if (e.touches.length > 0) {
      const coords = this.getTouchCanvasCoords(e.touches[0])
      this.touchTargetX = coords.x
      this.touchTargetY = coords.y
    }
  }

  private handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 0) {
      this.touchActive = false
    }
  }

  public startLevel(levelIndex: number, keepScore = false) {
    this.currentLevelIndex = levelIndex
    this.levelTimer = 0
    this.spawnTimer = 0
    this.continueTimer = ARCADE_CONFIG.CONTINUE_COUNTDOWN_SECONDS
    this.obstacles = []
    this.projectiles = []
    this.boss = null
    this.player.reset(keepScore)
    this.setState('playing')
  }

  private triggerShake() {
    if (!this.prefersReducedMotion) {
      this.shakeTimer = ARCADE_CONFIG.SHAKE_DURATION
    }
  }

  private spawnExplosion(x: number, y: number, color: string, count = 12) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color))
    }
  }

  private spawnWaveObstacle() {
    const allowed = this.currentLevel.allowedObstacles
    const type = allowed[Math.floor(Math.random() * allowed.length)] as ObstacleType
    const y = 20 + Math.random() * (ARCADE_CONFIG.CANVAS_HEIGHT - 45)
    this.obstacles.push(new Obstacle(type, ARCADE_CONFIG.CANVAS_WIDTH + 15, y))
  }

  private start() {
    this.lastTime = performance.now()
    const loop = (now: number) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.1)
      this.lastTime = now

      if (!this.isPaused) {
        this.update(dt)
        this.render()
      }

      this.animId = requestAnimationFrame(loop)
    }

    this.animId = requestAnimationFrame(loop)
  }

  private update(dt: number) {
    // Background stars update
    const speedBoost = this.state === 'playing' ? this.currentLevel.bgSpeed : 20
    this.stars.forEach((s) => s.update(dt, ARCADE_CONFIG.CANVAS_WIDTH, speedBoost))

    // Particles update
    this.particles = this.particles.filter((p) => p.update(dt))

    // Shake update
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt
      this.shakeOffsetX = (Math.random() * 2 - 1) * ARCADE_CONFIG.SHAKE_INTENSITY
      this.shakeOffsetY = (Math.random() * 2 - 1) * ARCADE_CONFIG.SHAKE_INTENSITY
    } else {
      this.shakeOffsetX = 0
      this.shakeOffsetY = 0
    }

    // State Machine Updates
    switch (this.state) {
      case 'boot': {
        this.bootTimer += dt
        if (this.bootTimer >= 2.5) {
          this.setState('title')
        }
        break
      }

      case 'title': {
        // Idle screen
        break
      }

      case 'playing': {
        this.updatePlaying(dt)
        break
      }

      case 'boss': {
        this.updateBoss(dt)
        break
      }

      case 'stage_clear': {
        this.levelTimer += dt
        if (this.levelTimer >= 2.2) {
          if (this.currentLevelIndex + 1 < LEVELS.length) {
            this.startLevel(this.currentLevelIndex + 1, true)
          } else {
            this.setState('reward')
          }
        }
        break
      }

      case 'game_over': {
        this.continueTimer -= dt
        if (this.continueTimer <= 0) {
          this.setState('title')
        }
        break
      }

      case 'reward': {
        // Reward state handled by React component
        break
      }
    }
  }

  private updatePlayerMovement(dt: number) {
    let moveX = 0
    let moveY = 0

    if (this.touchActive) {
      // Smoothly steer toward touch position
      const dx = this.touchTargetX - this.player.x
      const dy = this.touchTargetY - this.player.y
      if (Math.abs(dx) > 3) moveX = Math.sign(dx)
      if (Math.abs(dy) > 3) moveY = Math.sign(dy)
    } else {
      if (this.keys['arrowleft'] || this.keys['a']) moveX -= 1
      if (this.keys['arrowright'] || this.keys['d']) moveX += 1
      if (this.keys['arrowup'] || this.keys['w']) moveY -= 1
      if (this.keys['arrowdown'] || this.keys['s']) moveY += 1
    }

    this.player.update(dt, moveX, moveY)

    // Firing logic (Space or Touch Auto-Fire)
    const isFiring = this.keys[' '] || this.touchActive || this.isAutoFiring
    if (isFiring && this.player.canShoot()) {
      const shots = this.player.shoot()
      this.projectiles.push(...shots)
      sound.playLaser()
    }
  }

  private updatePlaying(dt: number) {
    this.levelTimer += dt
    this.spawnTimer += dt

    this.updatePlayerMovement(dt)

    // Spawn obstacles during wave duration
    if (this.levelTimer < this.currentLevel.waveDuration) {
      if (this.spawnTimer >= this.currentLevel.spawnInterval) {
        this.spawnTimer = 0
        this.spawnWaveObstacle()
      }
    } else if (this.obstacles.length === 0 && !this.boss) {
      // Transition to Boss fight!
      sound.playBossWarning()
      this.triggerShake()
      this.boss = new Boss(this.currentLevel.boss, this.currentLevel.id)
      this.setState('boss')
      return
    }

    // Update projectiles
    this.projectiles = this.projectiles.filter((p) => p.update(dt))

    // Update obstacles
    this.obstacles = this.obstacles.filter((o) => o.update(dt))

    // Projectile collisions with obstacles
    for (let pIdx = this.projectiles.length - 1; pIdx >= 0; pIdx--) {
      const p = this.projectiles[pIdx]
      if (!p.isPlayer) continue

      for (let oIdx = this.obstacles.length - 1; oIdx >= 0; oIdx--) {
        const o = this.obstacles[oIdx]
        // Bounding box hit check
        if (
          p.x >= o.x &&
          p.x <= o.x + o.width &&
          p.y >= o.y &&
          p.y <= o.y + o.height
        ) {
          this.projectiles.splice(pIdx, 1)
          const killed = o.hit(p.damage)
          sound.playHit()

          if (killed) {
            this.obstacles.splice(oIdx, 1)
            this.player.score += o.points
            this.spawnExplosion(o.x + o.width / 2, o.y + o.height / 2, o.color)
            sound.playExplosion()
          }
          break
        }
      }
    }

    // Obstacle collisions with Player
    for (let oIdx = this.obstacles.length - 1; oIdx >= 0; oIdx--) {
      const o = this.obstacles[oIdx]
      if (
        this.player.x + 6 >= o.x &&
        this.player.x - 6 <= o.x + o.width &&
        this.player.y + 4 >= o.y &&
        this.player.y - 4 <= o.y + o.height
      ) {
        if (this.player.hit()) {
          sound.playExplosion()
          this.triggerShake()
          this.spawnExplosion(this.player.x, this.player.y, ARCADE_CONFIG.COLORS.danger, 18)

          if (this.player.lives <= 0) {
            this.setState('game_over')
            return
          }
        }
      }
    }
  }

  private updateBoss(dt: number) {
    if (!this.boss) return

    this.updatePlayerMovement(dt)

    // Boss AI update
    this.boss.update(dt, this.player.y, (p) => {
      this.projectiles.push(p)
    })

    // Check boss beam hit (Boss 1)
    if (this.boss.checkBeamHit(this.player.x, this.player.y)) {
      if (this.player.hit()) {
        sound.playExplosion()
        this.triggerShake()
        this.spawnExplosion(this.player.x, this.player.y, ARCADE_CONFIG.COLORS.danger, 18)
        if (this.player.lives <= 0) {
          this.setState('game_over')
          return
        }
      }
    }

    // Update projectiles
    this.projectiles = this.projectiles.filter((p) => p.update(dt))

    // Player projectiles vs Boss
    for (let pIdx = this.projectiles.length - 1; pIdx >= 0; pIdx--) {
      const p = this.projectiles[pIdx]
      if (!p.isPlayer) continue

      if (
        p.x >= this.boss.x &&
        p.x <= this.boss.x + this.boss.width &&
        p.y >= this.boss.y &&
        p.y <= this.boss.y + this.boss.height
      ) {
        this.projectiles.splice(pIdx, 1)
        const bossDefeated = this.boss.hit(p.damage)
        sound.playHit()

        if (bossDefeated) {
          sound.playClear()
          sound.playExplosion()
          this.triggerShake()
          this.player.score += 2000
          this.spawnExplosion(
            this.boss.x + this.boss.width / 2,
            this.boss.y + this.boss.height / 2,
            this.boss.color,
            36,
          )

          this.boss = null
          this.projectiles = []
          this.levelTimer = 0
          this.setState('stage_clear')
          return
        }
      }
    }

    // Enemy projectiles vs Player
    for (let pIdx = this.projectiles.length - 1; pIdx >= 0; pIdx--) {
      const p = this.projectiles[pIdx]
      if (p.isPlayer) continue

      // Decoy projectiles in Level 2 pass through harmlessly!
      if (p.isDecoy) {
        continue
      }

      const dist = Math.hypot(p.x - this.player.x, p.y - this.player.y)
      if (dist < ARCADE_CONFIG.PLAYER_HITBOX_RADIUS + p.radius) {
        this.projectiles.splice(pIdx, 1)
        if (this.player.hit()) {
          sound.playExplosion()
          this.triggerShake()
          this.spawnExplosion(this.player.x, this.player.y, ARCADE_CONFIG.COLORS.danger, 18)

          if (this.player.lives <= 0) {
            this.setState('game_over')
            return
          }
        }
      }
    }
  }

  private render() {
    this.ctx.save()
    this.ctx.translate(Math.floor(this.shakeOffsetX), Math.floor(this.shakeOffsetY))

    // Clear background
    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.night
    this.ctx.fillRect(0, 0, ARCADE_CONFIG.CANVAS_WIDTH, ARCADE_CONFIG.CANVAS_HEIGHT)

    // Render stars
    this.stars.forEach((s) => s.render(this.ctx))

    // Render particles
    this.particles.forEach((p) => p.render(this.ctx))

    // Render based on state
    switch (this.state) {
      case 'boot':
        this.renderBoot()
        break
      case 'title':
        this.renderTitle()
        break
      case 'playing':
      case 'boss':
      case 'stage_clear':
        this.renderGameWorld()
        this.renderHUD()
        if (this.state === 'stage_clear') {
          this.renderStageClear()
        }
        break
      case 'game_over':
        this.renderGameWorld()
        this.renderGameOver()
        break
    }

    this.ctx.restore()
  }

  private renderBoot() {
    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.neon
    this.ctx.font = '8px monospace'
    this.ctx.textAlign = 'left'

    const lines = [
      'SOLIMAN-OS ARCADE // v1.0',
      'MEMORY: 640KB OK',
      'VIDEO: 320x180 MATRIX INIT',
      'RAG SUBSYSTEM: READY',
      'STATUS: ALL SYSTEMS NOMINAL.',
    ]

    const visibleLines = Math.min(lines.length, Math.floor(this.bootTimer * 3) + 1)
    lines.slice(0, visibleLines).forEach((line, i) => {
      this.ctx.fillText(line, 24, 40 + i * 16)
    })
  }

  private renderTitle() {
    this.ctx.textAlign = 'center'

    // Title
    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.neon
    this.ctx.font = '14px monospace'
    this.ctx.fillText('SOLIMAN-OS ARCADE', ARCADE_CONFIG.CANVAS_WIDTH / 2, 45)

    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.mut
    this.ctx.font = '8px monospace'
    this.ctx.fillText('SIDE-SCROLLING SYSTEM COMPILER', ARCADE_CONFIG.CANVAS_WIDTH / 2, 60)

    // Blinking prompt
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      this.ctx.fillStyle = '#FFFFFF'
      this.ctx.font = '9px monospace'
      this.ctx.fillText('▸ PRESS START / SPACE / TAP', ARCADE_CONFIG.CANVAS_WIDTH / 2, 105)
    }

    // Control hint
    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.mut
    this.ctx.font = '7px monospace'
    this.ctx.fillText('ARROWS/WASD: MOVE  ·  SPACE: FIRE  ·  ESC: EXIT', ARCADE_CONFIG.CANVAS_WIDTH / 2, 145)
  }

  private renderGameWorld() {
    // Obstacles
    this.obstacles.forEach((o) => o.render(this.ctx))

    // Boss
    if (this.boss) {
      this.boss.render(this.ctx)
    }

    // Projectiles
    this.projectiles.forEach((p) => p.render(this.ctx))

    // Player
    if (this.state !== 'game_over') {
      this.player.render(this.ctx)
    }
  }

  private renderHUD() {
    this.ctx.save()

    // Top HUD bar
    this.ctx.fillStyle = 'rgba(7, 7, 8, 0.75)'
    this.ctx.fillRect(0, 0, ARCADE_CONFIG.CANVAS_WIDTH, 14)
    this.ctx.strokeStyle = ARCADE_CONFIG.COLORS.line
    this.ctx.beginPath()
    this.ctx.moveTo(0, 14)
    this.ctx.lineTo(ARCADE_CONFIG.CANVAS_WIDTH, 14)
    this.ctx.stroke()

    // Score
    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.ink
    this.ctx.font = '7px monospace'
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`SCORE: ${String(this.player.score).padStart(6, '0')}`, 8, 10)

    // Level Title
    this.ctx.textAlign = 'center'
    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.neon
    this.ctx.fillText(`LVL 0${this.currentLevel.id}: ${this.currentLevel.title}`, ARCADE_CONFIG.CANVAS_WIDTH / 2, 10)

    // Lives
    this.ctx.textAlign = 'right'
    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.danger
    const livesStr = '♥ '.repeat(Math.max(0, this.player.lives)).trim()
    this.ctx.fillText(livesStr || 'EMPTY', ARCADE_CONFIG.CANVAS_WIDTH - 8, 10)

    // Boss Health Bar (if active)
    if (this.boss && !this.boss.isEntering) {
      const barWidth = 140
      const barHeight = 4
      const barX = (ARCADE_CONFIG.CANVAS_WIDTH - barWidth) / 2
      const barY = 18

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      this.ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2)

      const hpPercent = Math.max(0, this.boss.hp / this.boss.maxHp)
      this.ctx.fillStyle = this.boss.color
      this.ctx.fillRect(barX, barY, Math.floor(barWidth * hpPercent), barHeight)

      this.ctx.fillStyle = ARCADE_CONFIG.COLORS.ink
      this.ctx.font = '6px monospace'
      this.ctx.textAlign = 'center'
      this.ctx.fillText(this.boss.name, ARCADE_CONFIG.CANVAS_WIDTH / 2, barY + 11)
    }

    this.ctx.restore()
  }

  private renderStageClear() {
    this.ctx.save()
    this.ctx.fillStyle = 'rgba(7, 7, 8, 0.8)'
    this.ctx.fillRect(30, 60, ARCADE_CONFIG.CANVAS_WIDTH - 60, 50)
    this.ctx.strokeStyle = ARCADE_CONFIG.COLORS.neon
    this.ctx.strokeRect(30, 60, ARCADE_CONFIG.CANVAS_WIDTH - 60, 50)

    this.ctx.textAlign = 'center'
    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.neon
    this.ctx.font = '10px monospace'
    this.ctx.fillText(`STAGE 0${this.currentLevel.id} COMPLETE!`, ARCADE_CONFIG.CANVAS_WIDTH / 2, 82)

    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.ink
    this.ctx.font = '7px monospace'
    this.ctx.fillText('+2000 CLEAR BONUS', ARCADE_CONFIG.CANVAS_WIDTH / 2, 96)
    this.ctx.restore()
  }

  private renderGameOver() {
    this.ctx.save()
    this.ctx.fillStyle = 'rgba(7, 7, 8, 0.85)'
    this.ctx.fillRect(40, 45, ARCADE_CONFIG.CANVAS_WIDTH - 80, 80)
    this.ctx.strokeStyle = ARCADE_CONFIG.COLORS.danger
    this.ctx.strokeRect(40, 45, ARCADE_CONFIG.CANVAS_WIDTH - 80, 80)

    this.ctx.textAlign = 'center'
    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.danger
    this.ctx.font = '11px monospace'
    this.ctx.fillText('SYSTEM FAILURE', ARCADE_CONFIG.CANVAS_WIDTH / 2, 65)

    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.warning
    this.ctx.font = '12px monospace'
    const countdown = Math.ceil(this.continueTimer)
    this.ctx.fillText(`CONTINUE? ${countdown}`, ARCADE_CONFIG.CANVAS_WIDTH / 2, 85)

    this.ctx.fillStyle = ARCADE_CONFIG.COLORS.ink
    this.ctx.font = '7px monospace'
    this.ctx.fillText('PRESS SPACE / TAP TO INSERT COIN', ARCADE_CONFIG.CANVAS_WIDTH / 2, 105)
    this.ctx.restore()
  }
}
