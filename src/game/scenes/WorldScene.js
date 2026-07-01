import Phaser from 'phaser'
import { bus } from '../eventBus.js'
import { audio } from '../audio.js'

const STAGE_W = 1280
const STAGE_H = 720

// World attack locations [x%, y%] as percentage of stage size
const ATTACK_CITIES = [
  { name: 'London',     x: 0.46, y: 0.30, delay: 0 },
  { name: 'Lagos',      x: 0.47, y: 0.52, delay: 800 },
  { name: 'Jakarta',    x: 0.76, y: 0.58, delay: 1600 },
  { name: 'São Paulo',  x: 0.32, y: 0.68, delay: 2400 },
  { name: 'New York',   x: 0.24, y: 0.36, delay: 3200 },
  { name: 'Mumbai',     x: 0.68, y: 0.44, delay: 4000 },
  { name: 'Berlin',     x: 0.49, y: 0.27, delay: 4800 },
  { name: 'Seoul',      x: 0.80, y: 0.33, delay: 5600 },
  { name: 'Cairo',      x: 0.52, y: 0.40, delay: 2000 },
  { name: 'CyberCity',  x: 0.20, y: 0.22, delay: 1200, isHome: true }
]

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene')
    this.mapNodes = []
    this.attackDots = []
    this.mode = 'title'
    this._villainTimer = null
  }

  create() {
    this.cameras.main.setBackgroundColor('#040710')

    this.buildSky()
    this.grid = this.add
      .tileSprite(STAGE_W / 2, STAGE_H / 2, STAGE_W, STAGE_H, 'bg_tile')
      .setAlpha(0.25)
    this.buildSkyline()
    this.buildWorldMap()

    // ---------------- Echo (AI companion) ----------------
    this.echo = this.add.container(640, 290)
    this.echoRing = this.add
      .circle(0, 0, 26, 0x000000, 0)
      .setStrokeStyle(2, 0x3df6ff, 0.65)
    this.echoRing2 = this.add
      .circle(0, 0, 34, 0x000000, 0)
      .setStrokeStyle(1, 0x3df6ff, 0.3)
    this.echoCore = this.add.image(0, 0, 'echo_core')
    this.echo.add([this.echoRing2, this.echoRing, this.echoCore])

    this.tweens.add({
      targets: this.echoCore,
      scale: { from: 0.9, to: 1.1 },
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    this.tweens.add({ targets: this.echoRing, angle: 360, duration: 6000, repeat: -1 })
    this.tweens.add({ targets: this.echoRing2, angle: -360, duration: 9000, repeat: -1 })
    this.tweens.add({
      targets: this.echo,
      y: '+=10',
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // ---------------- Agent Rookie ----------------
    this.agent = this.add.image(320, 500, 'agent_body').setScale(3.5)
    this.tweens.add({
      targets: this.agent,
      y: '+=8',
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // ---------------- Villain: PHANTOM / The Shoal ----------------
    this.villain = this.add.image(960, 500, 'villain_glitch').setScale(3.5).setAlpha(0)
    this.villainGhostA = this.add.image(960, 500, 'villain_glitch').setScale(3.5).setAlpha(0).setTint(0xff2e6c)
    this.villainGhostB = this.add.image(960, 500, 'villain_glitch').setScale(3.5).setAlpha(0).setTint(0x3df6ff)

    // Villain name label
    this.villainLabel = this.add.text(960, 610, 'PHANTOM', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ff2e6c',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0)
    this.villainSub = this.add.text(960, 630, '[ THE SHOAL ]', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#6b7894',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0)

    // Agent label
    this.agentLabel = this.add.text(320, 600, 'ROOK', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#3df6ff',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0)
    this.agentSub = this.add.text(320, 620, '[ CCDU AGENT ]', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#6b7894',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0)

    // Agent HP bar
    this.agentHpBg = this.add.rectangle(320, 420, 80, 8, 0x1c2740).setAlpha(0)
    this.agentHp = this.add.rectangle(320 - 40, 420, 80, 8, 0x3df6ff).setOrigin(0, 0.5).setAlpha(0)

    // Villain HP bar
    this.villainHpBg = this.add.rectangle(960, 420, 80, 8, 0x1c2740).setAlpha(0)
    this.villainHp = this.add.rectangle(960 - 40, 420, 80, 8, 0xff2e6c).setOrigin(0, 0.5).setAlpha(0)

    // VS divider line (shown in case mode)
    this.vsLine = this.add.graphics()
    this.vsLine.lineStyle(1, 0x1c2740, 0.5)
    this.vsLine.lineBetween(640, 300, 640, 700)
    this.vsLine.setAlpha(0)

    this.vsText = this.add.text(640, 490, 'VS', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '16px',
      color: '#ff2e6c'
    }).setOrigin(0.5).setAlpha(0)

    this.applyMode('title')

    // ---------------- Bus wiring ----------------
    this._offs = [
      bus.on('set-mode', (d) => this.applyMode(d.mode)),
      bus.on('map-nodes', (d) => this.buildMapNodes(d)),
      bus.on('agent-react', (d) => this.agentReact(d.type)),
      bus.on('story-beat', (d) => this.onStoryBeat(d)),
      bus.on('show-villain', () => this.showVillain()),
      bus.on('hide-villain', () => this.hideVillain()),
      bus.on('celebrate', () => this.celebrate()),
      bus.on('update-health', (d) => this.updateHealth(d)),
      bus.on('agent-die', () => this.agentDie()),
      bus.on('villain-die', () => this.villainDie())
    ]
    this.events.on('shutdown', () => this._offs.forEach((off) => off()))

    bus.emit('world-ready', {})
  }

  update(_t, dt) {
    this.grid.tilePositionX += dt * 0.008
    this.grid.tilePositionY += dt * 0.005
  }

  // ---- Background ----
  buildSky() {
    const g = this.add.graphics()
    g.fillGradientStyle(0x040710, 0x040710, 0x0a1428, 0x0a1428, 1)
    g.fillRect(0, 0, STAGE_W, STAGE_H)
  }

  buildSkyline() {
    const g = this.add.graphics()
    g.fillStyle(0x080f1e, 1)
    const buildings = [
      [-20, 110, 380], [110, 160, 340], [260, 110, 460], [360, 190, 310],
      [820, 130, 320], [940, 170, 410], [1100, 150, 360], [1210, 130, 295]
    ]
    buildings.forEach(([bx, bw, bh]) => g.fillRect(bx, STAGE_H - bh, bw, bh))

    // Windows
    for (let i = 0; i < 60; i++) {
      const side = i % 2 === 0 ? Phaser.Math.Between(0, 400) : Phaser.Math.Between(820, 1280)
      const wy = Phaser.Math.Between(STAGE_H - 380, STAGE_H - 20)
      const win = this.add.rectangle(side, wy, 3, 5, 0x3df6ff, Phaser.Math.FloatBetween(0.1, 0.6))
      this.tweens.add({
        targets: win,
        alpha: { from: win.alpha, to: 0.04 },
        duration: Phaser.Math.Between(1500, 5000),
        yoyo: true,
        repeat: -1
      })
    }
  }

  // ---- World map with attack nodes ----
  buildWorldMap() {
    this.worldMapGroup = this.add.group()

    // Map background panel
    const mapBg = this.add.graphics()
    mapBg.fillStyle(0x060c1a, 0.85)
    mapBg.fillRoundedRect(STAGE_W / 2 - 380, STAGE_H / 2 - 210, 760, 420, 16)
    mapBg.lineStyle(1, 0x1c2740, 0.9)
    mapBg.strokeRoundedRect(STAGE_W / 2 - 380, STAGE_H / 2 - 210, 760, 420, 16)

    // SVG-style world continents drawn with graphics (simplified outlines)
    const mapG = this.add.graphics()
    mapG.lineStyle(1, 0x1c3a5e, 0.7)
    mapG.fillStyle(0x0d1e38, 0.9)
    // North America
    this.drawContinent(mapG, [[0.14,0.18],[0.28,0.15],[0.33,0.22],[0.32,0.48],[0.24,0.55],[0.18,0.50],[0.12,0.38],[0.14,0.18]])
    // South America
    this.drawContinent(mapG, [[0.26,0.52],[0.35,0.50],[0.40,0.62],[0.36,0.82],[0.28,0.85],[0.24,0.70],[0.26,0.52]])
    // Europe
    this.drawContinent(mapG, [[0.42,0.18],[0.54,0.16],[0.58,0.24],[0.55,0.35],[0.46,0.38],[0.42,0.30],[0.42,0.18]])
    // Africa
    this.drawContinent(mapG, [[0.44,0.38],[0.56,0.36],[0.60,0.50],[0.56,0.72],[0.46,0.75],[0.40,0.62],[0.44,0.38]])
    // Asia
    this.drawContinent(mapG, [[0.56,0.16],[0.88,0.14],[0.92,0.30],[0.84,0.45],[0.70,0.50],[0.58,0.44],[0.56,0.30],[0.56,0.16]])
    // Australia
    this.drawContinent(mapG, [[0.76,0.60],[0.90,0.58],[0.92,0.72],[0.82,0.78],[0.74,0.72],[0.76,0.60]])

    // Attack nodes — spawn with delay
    this.attackNodeGroup = this.add.group()
    ATTACK_CITIES.forEach((city, i) => {
      this.time.delayedCall(city.delay, () => this.spawnAttackNode(city))
    })

    // Breach counter label
    this.breachCount = 0
    this.breachLabel = this.add.text(STAGE_W / 2, STAGE_H / 2 + 230, 'ACTIVE BREACHES: 0', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ff2e6c'
    }).setOrigin(0.5).setAlpha(0)

    this.worldMapGroup.addMultiple([mapBg, mapG, this.breachLabel])

    // Hide world map initially — shown only on title
    this.worldMapGroup.setVisible(false)
    this.attackNodeGroup.setVisible(false)
    this.breachLabel.setVisible(false)
  }

  drawContinent(g, points) {
    const mx = STAGE_W / 2 - 360  // map left edge
    const my = STAGE_H / 2 - 195  // map top edge
    const mw = 720
    const mh = 390

    g.beginPath()
    points.forEach(([px, py], i) => {
      const x = mx + px * mw
      const y = my + py * mh
      if (i === 0) g.moveTo(x, y)
      else g.lineTo(x, y)
    })
    g.closePath()
    g.fillPath()
    g.strokePath()
  }

  spawnAttackNode(city) {
    const mx = STAGE_W / 2 - 360
    const my = STAGE_H / 2 - 195
    const mw = 720
    const mh = 390

    const x = mx + city.x * mw
    const y = my + city.y * mh
    const color = city.isHome ? 0xffb84d : 0xff2e6c

    // Pulsing ring
    const ring = this.add.circle(x, y, 12, color, 0).setStrokeStyle(1.5, color, 0.8)
    const dot = this.add.circle(x, y, 4, color, 1)
    const label = this.add.text(x + 10, y - 8, city.name, {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: city.isHome ? '#ffb84d' : '#ff6b8f'
    })

    this.tweens.add({
      targets: ring,
      scale: { from: 1, to: 2.5 },
      alpha: { from: 0.8, to: 0 },
      duration: 1200,
      repeat: -1,
      ease: 'Sine.easeOut'
    })
    this.tweens.add({
      targets: dot,
      scale: { from: 0.8, to: 1.2 },
      duration: 800,
      yoyo: true,
      repeat: -1
    })

    this.attackNodeGroup.addMultiple([ring, dot, label])

    this.breachCount++
    if (this.breachLabel) {
      this.breachLabel.setText(`ACTIVE BREACHES: ${this.breachCount}`)
    }
    audio.radarPing()
  }

  // ---- Mode switching ----
  applyMode(mode) {
    this.mode = mode
    const showNodes = mode === 'map'
    this.mapNodes.forEach((n) => n.setVisible(showNodes))

    const showWorld = mode === 'title' || mode === 'case'
    this.worldMapGroup.setVisible(showWorld)
    this.attackNodeGroup.setVisible(showWorld)
    this.breachLabel.setVisible(mode === 'title')

    if (mode === 'title') {
      this.worldMapGroup.setAlpha(1)
      this.attackNodeGroup.setAlpha(1)
      this.tweens.add({ targets: this.agent, x: 160, y: 580, duration: 600, ease: 'Sine.easeInOut' })
      this.tweens.add({ targets: this.echo, x: 640, y: 200, duration: 600, ease: 'Sine.easeInOut' })
      this.tweens.add({ targets: [this.agentLabel, this.agentSub, this.agentHpBg, this.agentHp, this.vsLine, this.vsText, this.villainLabel, this.villainSub, this.villainHpBg, this.villainHp], alpha: 0, duration: 300 })
      this.hideVillain()
    } else if (mode === 'story') {
      this.tweens.add({ targets: this.agent, x: 240, y: 520, duration: 500, ease: 'Sine.easeInOut' })
      this.tweens.add({ targets: this.echo, x: 960, y: 260, duration: 500, ease: 'Sine.easeInOut' })
      this.tweens.add({ targets: [this.agentLabel, this.agentSub, this.agentHpBg, this.agentHp, this.vsLine, this.vsText, this.villainLabel, this.villainSub, this.villainHpBg, this.villainHp], alpha: 0, duration: 300 })
      this.hideVillain()
    } else if (mode === 'map') {
      this.tweens.add({ targets: this.agent, x: 120, y: 580, duration: 500, ease: 'Sine.easeInOut' })
      this.tweens.add({ targets: this.echo, x: 120, y: 380, duration: 500, ease: 'Sine.easeInOut' })
      this.tweens.add({ targets: [this.agentLabel, this.agentSub, this.agentHpBg, this.agentHp, this.vsLine, this.vsText, this.villainLabel, this.villainSub, this.villainHpBg, this.villainHp], alpha: 0, duration: 300 })
      this.hideVillain()
    } else if (mode === 'case') {
      this.worldMapGroup.setAlpha(0.3)
      this.attackNodeGroup.setAlpha(0.3)
      this.tweens.add({ targets: this.agent, x: 200, y: 510, duration: 500, ease: 'Sine.easeInOut' })
      this.tweens.add({ targets: this.echo, x: 1060, y: 260, duration: 500, ease: 'Sine.easeInOut' })
      // Show labels & VS divider
      this.tweens.add({ targets: [this.agentLabel, this.agentSub, this.agentHpBg, this.agentHp], alpha: 1, duration: 400, delay: 300 })
      this.tweens.add({ targets: [this.vsLine, this.vsText], alpha: 1, duration: 400, delay: 500 })
      this.showVillain()
    } else if (mode === 'result') {
      this.tweens.add({ targets: this.agent, x: 400, y: 490, duration: 500, ease: 'Sine.easeInOut' })
      this.tweens.add({ targets: this.echo, x: 840, y: 280, duration: 500, ease: 'Sine.easeInOut' })
      this.tweens.add({ targets: [this.agentLabel, this.agentSub, this.agentHpBg, this.agentHp, this.vsLine, this.vsText, this.villainLabel, this.villainSub, this.villainHpBg, this.villainHp], alpha: 0, duration: 300 })
      this.hideVillain()
    }
  }

  // ---- Map nodes ----
  buildMapNodes({ chapters, unlockedIndex, doneIndexes }) {
    this.mapNodes.forEach((n) => n.destroy())
    this.mapNodes = []

    const startX = 310
    const gap = 220
    const y = 420

    chapters.forEach((ch, i) => {
      const x = startX + i * gap
      const locked = i > unlockedIndex
      const done = doneIndexes.includes(i)

      if (i > 0) {
        const prevX = startX + (i - 1) * gap
        const line = this.add
          .line(0, 0, prevX + 34, y, x - 34, y, locked ? 0x1c2740 : 0x3df6ff, locked ? 0.2 : 0.5)
          .setLineWidth(2)
          .setVisible(this.mode === 'map')
        this.mapNodes.push(line)
      }

      const circle = this.add
        .circle(x, y, 32, locked ? 0x080f1e : done ? 0x0d2620 : 0x080f1e)
        .setStrokeStyle(2, locked ? 0x2a3555 : done ? 0x39ff88 : 0x3df6ff)
        .setVisible(this.mode === 'map')

      const label = this.add
        .text(x, y, done ? '✓' : `${i + 1}`, {
          fontFamily: 'monospace',
          fontSize: '20px',
          color: locked ? '#4a5570' : done ? '#39ff88' : '#3df6ff'
        })
        .setOrigin(0.5)
        .setVisible(this.mode === 'map')

      const title = this.add
        .text(x, y + 52, ch.title, {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#8a94a8',
          align: 'center',
          wordWrap: { width: 180 }
        })
        .setOrigin(0.5, 0)
        .setVisible(this.mode === 'map')

      if (!locked) {
        circle.setInteractive({ useHandCursor: true })
        circle.on('pointerover', () => {
          this.tweens.add({ targets: circle, scale: 1.15, duration: 120 })
          audio.hover()
        })
        circle.on('pointerout', () => this.tweens.add({ targets: circle, scale: 1, duration: 120 }))
        circle.on('pointerdown', () => {
          audio.click()
          this.tweens.add({
            targets: this.agent,
            x: x - 50,
            y: y + 30,
            duration: 500,
            ease: 'Sine.easeInOut',
            onComplete: () => bus.emit('node-selected', { index: i })
          })
        })
      }

      this.mapNodes.push(circle, label, title)
    })
  }

  // ---- Reactions & effects ----
  agentReact(type) {
    if (type === 'correct') {
      audio.threatNeutralized()
      
      // Agent fires laser
      const laser = this.add.rectangle(this.agent.x + 50, this.agent.y - 30, 60, 6, 0x39ff88)
      this.tweens.add({
        targets: laser,
        x: this.villain.x - 50,
        duration: 150,
        onComplete: () => {
          laser.destroy()
          this.spawnBurst(this.villain.x, this.villain.y, 0x39ff88)
          this.tweens.add({ targets: this.villain, x: this.villain.x + 50, duration: 120, yoyo: true, ease: 'Quad.easeOut' })
          this.villain.setTint(0xffffff)
          this.time.delayedCall(120, () => this.villain.clearTint())
        }
      })

      this.tweens.add({ targets: this.agent, scaleX: 4.0, scaleY: 3.8, duration: 110, yoyo: true, ease: 'Quad.easeOut' })
      this.tweens.add({ targets: this.agent, y: this.agent.y - 20, duration: 160, yoyo: true, ease: 'Quad.easeOut' })
      this.tweens.add({ targets: this.echoCore, scale: 1.4, duration: 200, yoyo: true })
    } else {
      audio.breachKlaxon()
      
      // Villain fires laser
      const laser = this.add.rectangle(this.villain.x - 50, this.villain.y - 30, 80, 8, 0xff2e6c)
      this.tweens.add({
        targets: laser,
        x: this.agent.x + 50,
        duration: 150,
        onComplete: () => {
          laser.destroy()
          this.cameras.main.shake(350, 0.01)
          this.spawnBurst(this.agent.x, this.agent.y - 60, 0xff2e6c)
          this.agent.setTint(0xff6b8f)
          this.time.delayedCall(280, () => this.agent.clearTint())
          this.tweens.add({ targets: this.agent, angle: { from: -7, to: 7 }, duration: 55, yoyo: true, repeat: 5 })
          this.tweens.add({ targets: this.agent, x: this.agent.x - 30, duration: 120, yoyo: true, ease: 'Quad.easeOut' })
        }
      })
      
      this.tweens.add({ targets: this.villain, scale: 4.0, duration: 150, yoyo: true })
    }
  }

  celebrate() {
    audio.missionComplete()
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 120, () => {
        this.tweens.add({ targets: this.agent, y: this.agent.y - 30, duration: 220, yoyo: true, ease: 'Quad.easeOut' })
      })
    }
    this.spawnBurst(this.agent.x, this.agent.y - 70, 0xffb84d, 32)
    this.spawnBurst(this.echo.x, this.echo.y, 0x3df6ff, 24)
    this.spawnBurst(640, 400, 0x39ff88, 20)
  }

  onStoryBeat({ panel }) {
    this.tweens.add({ targets: this.echoCore, scale: 1.3, duration: 200, yoyo: true })

    // Panel-specific visual/audio reactions
    if (panel === 1) {
      // Villain reveal panel — show PHANTOM glitch on story screen
      this.showVillainBrief()
    } else if (panel === 4) {
      // Threat board — flash attack alarm
      this.cameras.main.flash(300, 255, 46, 108, true)
    }
  }

  showVillainBrief() {
    this.villain.setAlpha(0.6).setPosition(1050, 380).setScale(2.5)
    this.villainGhostA.setAlpha(0.2).setPosition(1050, 380).setScale(2.5)
    this.villainGhostB.setAlpha(0.2).setPosition(1050, 380).setScale(2.5)
    this.time.delayedCall(2000, () => {
      this.villain.setAlpha(0).setPosition(960, 500).setScale(3.5)
      this.villainGhostA.setAlpha(0).setPosition(960, 500).setScale(3.5)
      this.villainGhostB.setAlpha(0).setPosition(960, 500).setScale(3.5)
    })
  }

  spawnBurst(x, y, color, quantity = 20) {
    const emitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 90, max: 260 },
      angle: { min: 0, max: 360 },
      lifespan: 680,
      scale: { start: 1.5, end: 0 },
      tint: color,
      emitting: false
    })
    emitter.explode(quantity, x, y)
    this.time.delayedCall(800, () => emitter.destroy())
  }

  showVillain() {
    this.villain.setPosition(960, 500).setScale(3.5).setAlpha(1).setAngle(0)
    this.villainGhostA.setPosition(960, 500).setScale(3.5)
    this.villainGhostB.setPosition(960, 500).setScale(3.5)
    this.tweens.add({ targets: [this.villainLabel, this.villainSub, this.villainHpBg, this.villainHp], alpha: 1, duration: 400, delay: 300 })

    this._villainTimer = this.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => {
        const jx = Phaser.Math.Between(-5, 5)
        const jy = Phaser.Math.Between(-3, 3)
        this.villainGhostA.setPosition(960 - 4 + jx, 500 + jy).setAlpha(0.35)
        this.villainGhostB.setPosition(960 + 4 + jx, 500 + jy).setAlpha(0.35)
        this.villain.setAlpha(Phaser.Math.FloatBetween(0.75, 1))
      }
    })
  }

  hideVillain() {
    this.villain.setAlpha(0)
    this.villainGhostA.setAlpha(0)
    this.villainGhostB.setAlpha(0)
    if (this.villainLabel) this.tweens.add({ targets: [this.villainLabel, this.villainSub, this.villainHpBg, this.villainHp], alpha: 0, duration: 200 })
    if (this._villainTimer) {
      this._villainTimer.remove()
      this._villainTimer = null
    }
  }

  updateHealth({ agentHp, agentMax, villainHp, villainMax }) {
    const aPct = Math.max(0, agentHp / agentMax)
    const vPct = Math.max(0, villainHp / villainMax)
    this.tweens.add({ targets: this.agentHp, width: 80 * aPct, duration: 300 })
    this.tweens.add({ targets: this.villainHp, width: 80 * vPct, duration: 300 })
  }

  agentDie() {
    this.spawnBurst(this.agent.x, this.agent.y, 0xff2e6c, 40)
    this.tweens.add({ targets: this.agent, angle: -90, y: this.agent.y + 40, alpha: 0, duration: 800, ease: 'Quad.easeIn' })
    this.tweens.add({ targets: [this.agentHp, this.agentHpBg], alpha: 0, duration: 200 })
  }

  villainDie() {
    this.cameras.main.shake(500, 0.02)
    this.spawnBurst(this.villain.x, this.villain.y, 0x3df6ff, 50)
    this.tweens.add({ targets: [this.villain, this.villainGhostA, this.villainGhostB], scale: 1.5, alpha: 0, angle: 45, duration: 600, ease: 'Quad.easeIn' })
    this.tweens.add({ targets: [this.villainHp, this.villainHpBg], alpha: 0, duration: 200 })
  }
}
