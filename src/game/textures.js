// All game art is generated procedurally at boot time using Phaser's
// Graphics API, then baked into GPU textures with generateTexture().
// This keeps the project 100% asset-free and instantly runnable.

export function generateTextures(scene) {
  const g = scene.add.graphics()

  // --- tiny particle dot, used for every burst/confetti effect ---
  g.clear()
  g.fillStyle(0xffffff, 1)
  g.fillCircle(6, 6, 6)
  g.generateTexture('particle', 12, 12)

  // --- Agent Rookie: pixel-art field agent (44x64) ---
  g.clear()
  // legs
  g.fillStyle(0x161d30, 1)
  g.fillRect(10, 50, 10, 14)
  g.fillRect(24, 50, 10, 14)
  // boots
  g.fillStyle(0x0a0e1a, 1)
  g.fillRect(9, 60, 12, 5)
  g.fillRect(23, 60, 12, 5)
  // torso / trench coat
  g.fillStyle(0x121a2e, 1)
  g.fillRoundedRect(6, 24, 32, 30, 6)
  g.fillStyle(0x1c2740, 1)
  g.fillRoundedRect(6, 24, 32, 10, 6)
  // tie / visor accent stripe
  g.fillStyle(0xff2e6c, 1)
  g.fillRect(20, 30, 4, 20)
  // arms
  g.fillStyle(0x121a2e, 1)
  g.fillRoundedRect(0, 28, 8, 20, 3)
  g.fillRoundedRect(36, 28, 8, 20, 3)
  // head
  g.fillStyle(0xf2c199, 1)
  g.fillCircle(22, 15, 13)
  // hair / collar shadow
  g.fillStyle(0x0a0e1a, 1)
  g.fillRoundedRect(9, 4, 26, 9, 5)
  // visor / goggles (the signature look)
  g.fillStyle(0x3df6ff, 0.95)
  g.fillRoundedRect(11, 13, 22, 6, 3)
  g.fillStyle(0xffffff, 0.9)
  g.fillRect(14, 14, 4, 2)
  g.generateTexture('agent_body', 44, 64)

  // --- Echo companion core (48x48) - concentric "glow" circles ---
  g.clear()
  g.fillStyle(0x3df6ff, 0.12)
  g.fillCircle(24, 24, 24)
  g.fillStyle(0x3df6ff, 0.28)
  g.fillCircle(24, 24, 17)
  g.fillStyle(0x9ff6ff, 0.9)
  g.fillCircle(24, 24, 10)
  g.fillStyle(0xffffff, 1)
  g.fillCircle(19, 19, 3)
  g.generateTexture('echo_core', 48, 48)

  // --- Villain silhouette: "The Shoal" glitch entity (52x76) ---
  g.clear()
  g.fillStyle(0x140a12, 1)
  g.fillRect(14, 0, 24, 22) // head block
  g.fillRect(6, 20, 40, 8)  // shoulders
  g.fillRect(10, 26, 32, 30) // torso
  g.fillRect(4, 56, 44, 10) // coat flare
  g.fillRect(10, 64, 12, 12)
  g.fillRect(30, 64, 12, 12)
  g.fillStyle(0xff2e6c, 1)
  g.fillRect(18, 6, 6, 4) // eye
  g.fillRect(28, 6, 6, 4) // eye
  g.generateTexture('villain_glitch', 52, 76)

  // --- background grid tile (40x40), tiled + scrolled for the cyber-grid floor ---
  g.clear()
  g.lineStyle(1, 0x18213a, 1)
  g.strokeRect(0, 0, 40, 40)
  g.generateTexture('bg_tile', 40, 40)

  g.destroy()
}
