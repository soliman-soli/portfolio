import { ARCADE_CONFIG } from './config'
import { OBSTACLE_DEFS, type ObstacleType, type BossDef } from './levels'

export interface Point {
  x: number
  y: number
}

export class Star {
  public x: number
  public y: number
  public speed: number
  public brightness: number
  public size: number

  constructor(width: number, height: number) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.speed = 15 + Math.random() * 45
    this.brightness = 0.2 + Math.random() * 0.7
    this.size = Math.random() > 0.8 ? 1.5 : 1
  }

  public update(dt: number, width: number, extraSpeed: number) {
    this.x -= (this.speed + extraSpeed) * dt
    if (this.x < 0) {
      this.x = width + Math.random() * 10
      this.y = Math.random() * ARCADE_CONFIG.CANVAS_HEIGHT
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(237, 237, 232, ${this.brightness})`
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size)
  }
}

export class Particle {
  public x: number
  public y: number
  public vx: number
  public vy: number
  public life: number
  public maxLife: number
  public color: string
  public size: number

  constructor(x: number, y: number, color: string, speedMult = 1) {
    this.x = x
    this.y = y
    const angle = Math.random() * Math.PI * 2
    const speed = (20 + Math.random() * 80) * speedMult
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.maxLife = 0.25 + Math.random() * 0.4
    this.life = this.maxLife
    this.color = color
    this.size = Math.random() > 0.5 ? 2 : 1
  }

  public update(dt: number): boolean {
    this.life -= dt
    this.x += this.vx * dt
    this.y += this.vy * dt
    this.vx *= 0.94
    this.vy *= 0.94
    return this.life > 0
  }

  public render(ctx: CanvasRenderingContext2D) {
    const alpha = Math.max(0, this.life / this.maxLife)
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.color
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size)
    ctx.restore()
  }
}

export class Projectile {
  public x: number
  public y: number
  public vx: number
  public vy: number
  public radius: number
  public isPlayer: boolean
  public isDecoy: boolean
  public color: string
  public damage: number

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    isPlayer: boolean,
    color: string = ARCADE_CONFIG.COLORS.neon,
    isDecoy = false,
  ) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.isPlayer = isPlayer
    this.isDecoy = isDecoy
    this.color = color
    this.radius = isPlayer ? 2 : 3
    this.damage = isPlayer ? 1 : 1
  }

  public update(dt: number): boolean {
    this.x += this.vx * dt
    this.y += this.vy * dt
    return (
      this.x >= -10 &&
      this.x <= ARCADE_CONFIG.CANVAS_WIDTH + 15 &&
      this.y >= -10 &&
      this.y <= ARCADE_CONFIG.CANVAS_HEIGHT + 10
    )
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    if (this.isDecoy) {
      // Decoy projectiles flicker and look slightly translucent/glitchy
      ctx.globalAlpha = 0.45 + (Math.sin(Date.now() * 0.03) * 0.2)
      ctx.fillStyle = '#5CE6E6'
      ctx.fillRect(Math.floor(this.x - 3), Math.floor(this.y - 1), 6, 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(Math.floor(this.x - 1), Math.floor(this.y - 1), 2, 2)
    } else if (this.isPlayer) {
      // Player double plasma bolts
      ctx.fillStyle = this.color
      ctx.fillRect(Math.floor(this.x - 3), Math.floor(this.y - 1), 7, 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y - 1), 3, 2)
    } else {
      // Threat projectile (red / amber / purple)
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(Math.floor(this.x), Math.floor(this.y), this.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(Math.floor(this.x - 1), Math.floor(this.y - 1), 2, 2)
    }
    ctx.restore()
  }
}

export class Player {
  public x: number = 28
  public y: number = 90
  public lives: number = ARCADE_CONFIG.PLAYER_LIVES
  public fireCooldown: number = 0
  public invulnTimer: number = 0
  public score: number = 0
  public width: number = 16
  public height: number = 10
  private thrusterFrame: number = 0

  public reset(keepScore = false) {
    this.x = 28
    this.y = 90
    this.lives = ARCADE_CONFIG.PLAYER_LIVES
    this.invulnTimer = ARCADE_CONFIG.PLAYER_INVULN_TIME
    this.fireCooldown = 0
    if (!keepScore) {
      this.score = 0
    }
  }

  public hit(): boolean {
    if (this.invulnTimer > 0) return false
    this.lives -= 1
    this.invulnTimer = ARCADE_CONFIG.PLAYER_INVULN_TIME
    return true
  }

  public update(dt: number, moveX: number, moveY: number) {
    // Movement
    this.x += moveX * ARCADE_CONFIG.PLAYER_SPEED * dt
    this.y += moveY * ARCADE_CONFIG.PLAYER_SPEED * dt

    // Clamp within bounds
    const minX = 8
    const maxX = ARCADE_CONFIG.CANVAS_WIDTH - 20
    const minY = 12
    const maxY = ARCADE_CONFIG.CANVAS_HEIGHT - 14

    this.x = Math.max(minX, Math.min(maxX, this.x))
    this.y = Math.max(minY, Math.min(maxY, this.y))

    if (this.fireCooldown > 0) {
      this.fireCooldown -= dt
    }
    if (this.invulnTimer > 0) {
      this.invulnTimer -= dt
    }

    this.thrusterFrame += dt * 24
  }

  public canShoot(): boolean {
    return this.fireCooldown <= 0
  }

  public shoot(): Projectile[] {
    this.fireCooldown = ARCADE_CONFIG.PLAYER_FIRE_RATE
    // Double gun output
    return [
      new Projectile(this.x + 8, this.y - 3, ARCADE_CONFIG.PLAYER_PROJECTILE_SPEED, 0, true),
      new Projectile(this.x + 8, this.y + 3, ARCADE_CONFIG.PLAYER_PROJECTILE_SPEED, 0, true),
    ]
  }

  public render(ctx: CanvasRenderingContext2D) {
    // Blink if invincible
    if (this.invulnTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      return
    }

    const px = Math.floor(this.x)
    const py = Math.floor(this.y)

    ctx.save()

    // Thruster flame animation behind ship
    const flameLen = 3 + (Math.floor(this.thrusterFrame) % 3) * 2
    ctx.fillStyle = '#FFAA1D'
    ctx.fillRect(px - flameLen - 6, py - 1, flameLen, 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(px - flameLen - 3, py, 2, 1)

    // Player Jet Body (Procedural pixel art)
    // Wings
    ctx.fillStyle = ARCADE_CONFIG.COLORS.neon
    ctx.fillRect(px - 5, py - 4, 4, 8)
    ctx.fillRect(px - 3, py - 3, 5, 6)

    // Fuselage
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(px - 6, py - 2, 12, 4)
    ctx.fillRect(px + 6, py - 1, 3, 2) // Nose tip

    // Cockpit
    ctx.fillStyle = ARCADE_CONFIG.COLORS.night
    ctx.fillRect(px - 1, py - 1, 3, 2)
    ctx.fillStyle = '#38DDF8'
    ctx.fillRect(px, py - 1, 1, 1) // Glass glint

    // Wing cannons
    ctx.fillStyle = ARCADE_CONFIG.COLORS.neon
    ctx.fillRect(px - 2, py - 4, 4, 1)
    ctx.fillRect(px - 2, py + 3, 4, 1)

    ctx.restore()
  }
}

export class Obstacle {
  public x: number
  public y: number
  public hp: number
  public maxHp: number
  public width: number
  public height: number
  public speedX: number
  public points: number
  public type: ObstacleType
  public label: string
  public indestructible: boolean
  public color: string
  public flashTimer: number = 0
  private timeAlive: number = 0
  private initialY: number
  private sineAmp: number
  private sineFreq: number

  constructor(type: ObstacleType, x: number, y: number) {
    const def = OBSTACLE_DEFS[type]
    this.type = type
    this.label = def.label
    this.hp = def.hp
    this.maxHp = def.hp
    this.width = def.width
    this.height = def.height
    this.speedX = def.speedX
    this.points = def.points
    this.indestructible = !!def.indestructible
    this.color = def.color
    this.sineAmp = def.sineAmp || 0
    this.sineFreq = def.sineFreq || 0

    this.x = x
    this.y = y
    this.initialY = y
  }

  public hit(damage = 1): boolean {
    if (this.indestructible) return false
    this.hp -= damage
    this.flashTimer = 0.08
    return this.hp <= 0
  }

  public update(dt: number): boolean {
    this.timeAlive += dt
    this.x -= this.speedX * dt

    if (this.sineAmp > 0) {
      this.y = this.initialY + Math.sin(this.timeAlive * this.sineFreq) * this.sineAmp
    }

    if (this.flashTimer > 0) {
      this.flashTimer -= dt
    }

    return this.x + this.width >= -10
  }

  public render(ctx: CanvasRenderingContext2D) {
    const px = Math.floor(this.x)
    const py = Math.floor(this.y)

    ctx.save()
    if (this.flashTimer > 0) {
      ctx.fillStyle = '#FFFFFF'
    } else {
      ctx.fillStyle = this.color
    }

    if (this.indestructible) {
      // Barrier monolith with hazard stripes
      ctx.strokeStyle = ARCADE_CONFIG.COLORS.warning
      ctx.lineWidth = 1
      ctx.strokeRect(px, py, this.width, this.height)
      ctx.fillStyle = 'rgba(255, 170, 29, 0.15)'
      ctx.fillRect(px, py, this.width, this.height)

      ctx.fillStyle = ARCADE_CONFIG.COLORS.warning
      ctx.font = '6px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(this.label, px + this.width / 2, py + this.height / 2 + 2)
    } else {
      // Destructible block with label
      ctx.strokeStyle = this.flashTimer > 0 ? '#FFFFFF' : this.color
      ctx.strokeRect(px, py, this.width, this.height)
      ctx.fillStyle = 'rgba(7, 7, 8, 0.75)'
      ctx.fillRect(px + 1, py + 1, this.width - 2, this.height - 2)

      ctx.fillStyle = this.flashTimer > 0 ? '#FFFFFF' : this.color
      ctx.font = '7px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(this.label, px + this.width / 2, py + this.height / 2)
    }

    ctx.restore()
  }
}

export class Boss {
  public name: string
  public subtitle: string
  public x: number
  public y: number
  public width: number
  public height: number
  public hp: number
  public maxHp: number
  public color: string
  public levelId: number
  public flashTimer: number = 0
  public active: boolean = false
  public isEntering: boolean = true
  private enterTargetX: number
  private attackTimer: number = 0
  private secondaryTimer: number = 0
  private beamWarningTimer: number = 0
  private beamActiveTimer: number = 0
  private beamY: number = 0

  constructor(def: BossDef, levelId: number) {
    this.name = def.name
    this.subtitle = def.subtitle
    this.width = def.width
    this.height = def.height
    this.hp = def.maxHp
    this.maxHp = def.maxHp
    this.color = def.color
    this.levelId = levelId

    this.enterTargetX = ARCADE_CONFIG.CANVAS_WIDTH - this.width - 16
    this.x = ARCADE_CONFIG.CANVAS_WIDTH + 20
    this.y = (ARCADE_CONFIG.CANVAS_HEIGHT - this.height) / 2
  }

  public hit(damage = 1): boolean {
    if (this.isEntering) return false
    this.hp -= damage
    this.flashTimer = 0.08
    return this.hp <= 0
  }

  public update(
    dt: number,
    playerY: number,
    spawnProjectile: (p: Projectile) => void,
  ) {
    if (this.flashTimer > 0) {
      this.flashTimer -= dt
    }

    // Entrance tween
    if (this.isEntering) {
      this.x -= 45 * dt
      if (this.x <= this.enterTargetX) {
        this.x = this.enterTargetX
        this.isEntering = false
      }
      return
    }

    // Hover movement
    const t = Date.now() * 0.002
    this.y =
      (ARCADE_CONFIG.CANVAS_HEIGHT - this.height) / 2 +
      Math.sin(t) * (ARCADE_CONFIG.CANVAS_HEIGHT / 2 - this.height / 2 - 16)

    this.attackTimer += dt
    this.secondaryTimer += dt

    // Boss 1: THE 500 ERROR (Quad burst & Stack Overflow Beam)
    if (this.levelId === 1) {
      if (this.attackTimer >= 1.7) {
        this.attackTimer = 0
        // Quad spread
        const speeds = [-40, -15, 15, 40]
        speeds.forEach((vy) => {
          spawnProjectile(
            new Projectile(this.x - 2, this.y + this.height / 2, -130, vy, false, ARCADE_CONFIG.COLORS.danger),
          )
        })
      }

      // Beam attack
      if (this.secondaryTimer >= 4.5 && this.beamWarningTimer <= 0 && this.beamActiveTimer <= 0) {
        this.beamWarningTimer = 0.8
        this.beamY = playerY
        this.secondaryTimer = 0
      }
    }

    // Boss 2: THE HALLUCINATION (True vs Decoy Projectiles & Vertical Vector Warp)
    if (this.levelId === 2) {
      if (this.attackTimer >= 1.4) {
        this.attackTimer = 0
        // 5 projectiles: 3 decoys, 2 real
        const pattern = [
          { vy: -35, isDecoy: true },
          { vy: -15, isDecoy: false },
          { vy: 0, isDecoy: true },
          { vy: 15, isDecoy: false },
          { vy: 35, isDecoy: true },
        ]
        pattern.forEach((p) => {
          spawnProjectile(
            new Projectile(
              this.x - 2,
              this.y + this.height / 2,
              -140,
              p.vy,
              false,
              p.isDecoy ? '#5CE6E6' : ARCADE_CONFIG.COLORS.warning,
              p.isDecoy,
            ),
          )
        })
      }
    }

    // Boss 3: THE ZERO-DAY (Payload curtain & homing micro-bursts)
    if (this.levelId === 3) {
      const isEnraged = this.hp <= this.maxHp * 0.35
      const fireInterval = isEnraged ? 0.9 : 1.5

      if (this.attackTimer >= fireInterval) {
        this.attackTimer = 0
        // Fan of 6 projectiles
        for (let i = -2; i <= 2; i++) {
          spawnProjectile(
            new Projectile(
              this.x - 2,
              this.y + this.height / 2,
              -160,
              i * 24,
              false,
              ARCADE_CONFIG.COLORS.danger,
            ),
          )
        }
      }

      // Fast aimed bolt
      if (this.secondaryTimer >= 2.2) {
        this.secondaryTimer = 0
        const dy = playerY - (this.y + this.height / 2)
        spawnProjectile(
          new Projectile(
            this.x - 2,
            this.y + this.height / 2,
            -200,
            dy * 1.5,
            false,
            ARCADE_CONFIG.COLORS.warning,
          ),
        )
      }
    }

    // Handle beam updates
    if (this.beamWarningTimer > 0) {
      this.beamWarningTimer -= dt
      if (this.beamWarningTimer <= 0) {
        this.beamActiveTimer = 0.4
      }
    } else if (this.beamActiveTimer > 0) {
      this.beamActiveTimer -= dt
    }
  }

  public checkBeamHit(px: number, py: number): boolean {
    if (this.beamActiveTimer > 0) {
      return Math.abs(py - this.beamY) < 14
    }
    return false
  }

  public render(ctx: CanvasRenderingContext2D) {
    const px = Math.floor(this.x)
    const py = Math.floor(this.y)

    ctx.save()

    // Beam warning / active beam rendering
    if (this.beamWarningTimer > 0) {
      ctx.strokeStyle = 'rgba(255, 59, 71, 0.4)'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(0, this.beamY)
      ctx.lineTo(px, this.beamY)
      ctx.stroke()
      ctx.setLineDash([])
    } else if (this.beamActiveTimer > 0) {
      ctx.fillStyle = 'rgba(255, 59, 71, 0.85)'
      ctx.fillRect(0, this.beamY - 6, px, 12)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, this.beamY - 2, px, 4)
    }

    // Boss Body
    ctx.fillStyle = this.flashTimer > 0 ? '#FFFFFF' : 'rgba(13, 13, 15, 0.95)'
    ctx.strokeStyle = this.color
    ctx.lineWidth = 1.5
    ctx.strokeRect(px, py, this.width, this.height)
    ctx.fillRect(px, py, this.width, this.height)

    // Boss Inner Graphic
    if (this.levelId === 1) {
      // 500 Error server rack
      ctx.fillStyle = this.color
      ctx.font = '8px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('500', px + this.width / 2, py + 16)
      ctx.fillText('ERROR', px + this.width / 2, py + 28)

      // Blinking server lights
      const blink = Math.floor(Date.now() / 200) % 3
      ctx.fillStyle = blink === 0 ? ARCADE_CONFIG.COLORS.danger : ARCADE_CONFIG.COLORS.line
      ctx.fillRect(px + 6, py + 36, 4, 3)
      ctx.fillStyle = blink === 1 ? ARCADE_CONFIG.COLORS.warning : ARCADE_CONFIG.COLORS.line
      ctx.fillRect(px + 14, py + 36, 4, 3)
      ctx.fillStyle = blink === 2 ? ARCADE_CONFIG.COLORS.neon : ARCADE_CONFIG.COLORS.line
      ctx.fillRect(px + 22, py + 36, 4, 3)
    } else if (this.levelId === 2) {
      // The Hallucination: Neural core with rotating rings
      const angle = (Date.now() * 0.003) % (Math.PI * 2)
      ctx.save()
      ctx.translate(px + this.width / 2, py + this.height / 2)
      ctx.strokeStyle = this.color
      ctx.beginPath()
      ctx.ellipse(0, 0, 16, 7, angle, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = '#5CE6E6'
      ctx.beginPath()
      ctx.arc(0, 0, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    } else {
      // The Zero-Day: Exploit cyber-core with crimson horns
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.moveTo(px + this.width / 2, py + 4)
      ctx.lineTo(px + this.width - 6, py + this.height - 8)
      ctx.lineTo(px + 6, py + this.height - 8)
      ctx.closePath()
      ctx.stroke()

      ctx.fillStyle = ARCADE_CONFIG.COLORS.warning
      ctx.font = '7px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('0-DAY', px + this.width / 2, py + this.height / 2 + 2)
    }

    ctx.restore()
  }
}
