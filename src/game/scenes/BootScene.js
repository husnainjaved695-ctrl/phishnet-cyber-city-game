import Phaser from 'phaser'
import { generateTextures } from '../textures.js'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  create() {
    generateTextures(this)

    const { width, height } = this.scale
    const cx = width / 2
    const cy = height / 2

    this.add
      .text(cx, cy - 40, 'PHISHNET', {
        fontFamily: 'monospace',
        fontSize: '42px',
        color: '#3df6ff'
      })
      .setOrigin(0.5)

    const barBg = this.add
      .rectangle(cx, cy + 30, 360, 14, 0x0e1526)
      .setStrokeStyle(1, 0x1c2740)
    const bar = this.add
      .rectangle(cx - 178, cy + 30, 0, 10, 0x3df6ff)
      .setOrigin(0, 0.5)
    this.add
      .text(cx, cy + 60, 'INITIALIZING FIELD SYSTEMS...', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#6b7894'
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: bar,
      width: 356,
      duration: 700,
      ease: 'Sine.easeInOut'
    })

    this.time.delayedCall(850, () => this.scene.start('WorldScene'))
  }
}
