# PHISHNET: Cyber City Protocol

A phishing-detection training game built as a real React + Phaser 3 project — animated
pixel-art characters, a synthesized sound engine, particle effects, camera shake, and a
4-chapter story campaign. No external art or audio assets; everything is generated at
runtime so the project is 100% offline-runnable.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`). Click anywhere
once to unlock audio (required by browser autoplay rules).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Tech stack

- **React 18** — game state machine, HUD, dialogue, email/case UI (the "chrome")
- **Phaser 3** — the animated world: Agent character, ECHO companion, villain, map,
  particles, camera shake, procedurally-generated pixel art (no image files)
- **Vite** — dev server / bundler
- **Web Audio API** — every sound effect is synthesized in `src/game/audio.js`, no `.mp3`/`.wav` files

React and Phaser talk to each other through a tiny event bus
(`src/game/eventBus.js`) instead of being tangled together — React owns game
*state*, Phaser owns the *stage*.

## Project structure

```
src/
  game/
    eventBus.js       tiny pub/sub between React and Phaser
    audio.js           synthesized sound engine (Web Audio API)
    textures.js         procedural pixel-art generation (Agent, Echo, villain, tiles)
    config.js            Phaser game config
    scenes/
      BootScene.js        generates textures, shows a short boot bar
      WorldScene.js         the persistent world: background, characters, map, FX
  components/
    PhaserGame.jsx       mounts/unmounts the Phaser canvas
    DialogueBox.jsx        typewriter-effect story/briefing text
    EmailCard.jsx            the case file / email UI + verdict feedback
    HUD.jsx                    hearts, XP bar, streak counter
    ToastLayer.jsx               achievement toasts
  data/
    story.js        opening cinematic beats
    chapters.js       4 chapters, 20 emails, each with red-flag breakdowns
    achievements.js     badge definitions
  App.jsx      the game's state machine / screen router
  App.css        cyber-noir visual theme
```

## Game design

**Setting:** Cyber City, 2041. **Villain:** The Shoal, a phishing syndicate.
**Player:** a rookie CCDU Field Agent. **Companion:** ECHO, an AI hologram that
narrates and reacts to your calls.

**Loop:** read an email → decide SAFE or PHISHING → get an instant animated
reaction (Agent bounces + green burst on correct, screen-shakes + red flash on
wrong) → read ECHO's red-flag breakdown → next email. Three lives per case,
streaks build toward the "Sharp Eye" badge, chapters unlock a case map.

**Chapters (difficulty ramps up):**
1. **Rookie Inbox** — obvious scams (lottery, fake suspensions)
2. **The Impersonators** — typosquatted brand domains, fake IT
3. **Spear & Whale** — targeted CEO-fraud / gift-card scams
4. **The Final Bait** — boss level; correct sender name but a spoofed link, and
   a final twist where The Shoal impersonates ECHO itself

## Extending it

- Add more chapters/emails in `src/data/chapters.js` — no code changes needed.
- Add more achievements in `src/data/achievements.js`, grant them in `App.jsx`.
- Want real spritesheets instead of procedural art? Swap `textures.js` for a
  `this.load.spritesheet(...)` call in `BootScene.preload()` and reference the
  same texture keys (`agent_body`, `echo_core`, `villain_glitch`) in `WorldScene.js`.
