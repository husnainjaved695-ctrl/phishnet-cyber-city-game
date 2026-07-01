import Phaser from 'phaser'
import BootScene from './scenes/BootScene.js'
import WorldScene from './scenes/WorldScene.js'

export function createGameConfig(parent) {
  return {
    type: Phaser.AUTO,
    parent,
    width: 1280,
    height: 720,
    backgroundColor: '#070912',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    scene: [BootScene, WorldScene]
  }
}
