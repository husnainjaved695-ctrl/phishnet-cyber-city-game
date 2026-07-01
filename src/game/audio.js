// Fully synthesized sound design using the raw Web Audio API.
// No .mp3/.wav assets required — 100% generative audio, instantly runnable offline.
// Scenario-based audio: each game event has a distinct sonic identity.

let ctx = null
let ambientNodes = null
let muted = false

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq = 440, type = 'sine', dur = 0.15, vol = 0.18, delay = 0, glideTo = null, attack = 0.012, release = null }) {
  if (muted) return
  const c = getCtx()
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(vol, t0 + attack)
  const rel = release ?? dur
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + rel)
  osc.connect(gain).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + rel + 0.05)
}

function noiseBurst({ dur = 0.2, vol = 0.15, delay = 0, filterFreq = 1200, filterType = 'lowpass' }) {
  if (muted) return
  const c = getCtx()
  const t0 = c.currentTime + delay
  const bufferSize = Math.max(1, Math.floor(c.sampleRate * dur))
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  const src = c.createBufferSource()
  src.buffer = buffer
  const filt = c.createBiquadFilter()
  filt.type = filterType
  filt.frequency.value = filterFreq
  const gain = c.createGain()
  gain.gain.setValueAtTime(vol, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(filt).connect(gain).connect(c.destination)
  src.start(t0)
}

function reverb(inputNode, duration = 0.4, wet = 0.3) {
  const c = getCtx()
  const len = Math.floor(c.sampleRate * duration)
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2)
  }
  const conv = c.createConvolver()
  conv.buffer = buf
  const wetGain = c.createGain()
  wetGain.gain.value = wet
  inputNode.connect(conv)
  conv.connect(wetGain)
  wetGain.connect(c.destination)
}

export const audio = {
  // --- UI micro-sounds ---
  click() { tone({ freq: 740, type: 'square', dur: 0.05, vol: 0.1 }) },
  hover() { tone({ freq: 1100, type: 'sine', dur: 0.03, vol: 0.04 }) },

  // --- Correct / wrong answers ---
  correct() {
    tone({ freq: 523.25, type: 'triangle', dur: 0.12, vol: 0.16 })
    tone({ freq: 659.25, type: 'triangle', dur: 0.14, vol: 0.15, delay: 0.08 })
    tone({ freq: 783.99, type: 'triangle', dur: 0.22, vol: 0.16, delay: 0.16 })
    // "THREAT NEUTRALIZED" radio beep pattern
    tone({ freq: 1200, type: 'square', dur: 0.04, vol: 0.07, delay: 0.42 })
    tone({ freq: 1200, type: 'square', dur: 0.04, vol: 0.07, delay: 0.48 })
  },
  wrong() {
    tone({ freq: 220, type: 'sawtooth', dur: 0.28, vol: 0.14, glideTo: 110 })
    noiseBurst({ dur: 0.18, vol: 0.1, filterFreq: 800 })
  },
  lifeLost() {
    tone({ freq: 180, type: 'square', dur: 0.35, vol: 0.13, glideTo: 60 })
    noiseBurst({ dur: 0.12, vol: 0.08, filterFreq: 400, delay: 0.1 })
  },

  // --- Level transitions ---
  levelUp() {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone({ freq: f, type: 'triangle', dur: 0.25, vol: 0.17, delay: i * 0.11 })
    )
    // Fanfare tail
    tone({ freq: 1046.5, type: 'sine', dur: 0.4, vol: 0.1, delay: 0.5 })
  },
  achievement() {
    tone({ freq: 880, type: 'sine', dur: 0.1, vol: 0.12 })
    tone({ freq: 1174.66, type: 'sine', dur: 0.18, vol: 0.14, delay: 0.1 })
  },
  gameOver() {
    ;[392, 349.2, 293.6, 220].forEach((f, i) =>
      tone({ freq: f, type: 'sawtooth', dur: 0.3, vol: 0.12, delay: i * 0.15 })
    )
    noiseBurst({ dur: 0.5, vol: 0.08, filterFreq: 300, delay: 0.6 })
  },

  // --- Villain effects ---
  glitch() {
    for (let i = 0; i < 4; i++) {
      tone({ freq: 200 + Math.random() * 500, type: 'square', dur: 0.04, vol: 0.06, delay: i * 0.05 })
    }
  },
  villainReveal() {
    // Deep, dissonant chord stab + glitch burst
    tone({ freq: 55, type: 'sawtooth', dur: 0.6, vol: 0.15 })
    tone({ freq: 58, type: 'sawtooth', dur: 0.6, vol: 0.12 })
    tone({ freq: 110, type: 'square', dur: 0.15, vol: 0.08 })
    noiseBurst({ dur: 0.35, vol: 0.12, filterFreq: 600 })
    for (let i = 0; i < 5; i++) {
      tone({ freq: 300 + Math.random() * 400, type: 'square', dur: 0.03, vol: 0.05, delay: 0.1 + i * 0.04 })
    }
  },

  // --- Story / narrative sounds ---
  incomingTransmission() {
    // Military radio-style incoming signal
    tone({ freq: 900, type: 'square', dur: 0.06, vol: 0.1 })
    tone({ freq: 900, type: 'square', dur: 0.06, vol: 0.1, delay: 0.09 })
    tone({ freq: 1200, type: 'square', dur: 0.18, vol: 0.12, delay: 0.18 })
    noiseBurst({ dur: 0.08, vol: 0.06, filterFreq: 3000, delay: 0.36 })
    tone({ freq: 440, type: 'sine', dur: 0.5, vol: 0.04, delay: 0.4 })
  },
  briefing() {
    // Authoritative low tone + sweep
    tone({ freq: 220, type: 'triangle', dur: 0.3, vol: 0.12 })
    tone({ freq: 440, type: 'sine', dur: 0.08, vol: 0.1, delay: 0.32 })
    tone({ freq: 550, type: 'sine', dur: 0.08, vol: 0.1, delay: 0.42 })
    tone({ freq: 660, type: 'sine', dur: 0.2, vol: 0.12, delay: 0.52 })
  },
  echoOnline() {
    // ECHO AI "power on" — ascending harmonics + warmth
    const freqs = [220, 330, 440, 550, 660, 880]
    freqs.forEach((f, i) =>
      tone({ freq: f, type: 'sine', dur: 0.2, vol: 0.1 - i * 0.01, delay: i * 0.06 })
    )
    tone({ freq: 1760, type: 'sine', dur: 0.35, vol: 0.08, delay: 0.42 })
    noiseBurst({ dur: 0.1, vol: 0.05, filterFreq: 8000, delay: 0.5 })
  },
  alarmPulse() {
    // Threat board alert — urgent radar-style pulse
    for (let i = 0; i < 3; i++) {
      tone({ freq: 880, type: 'square', dur: 0.08, vol: 0.14, delay: i * 0.22 })
      tone({ freq: 440, type: 'sawtooth', dur: 0.06, vol: 0.08, delay: i * 0.22 + 0.09 })
    }
  },

  // --- World map / radar ---
  radarPing() {
    // Single clean ping for attack dot appearance
    tone({ freq: 1760, type: 'sine', dur: 0.3, vol: 0.08, glideTo: 880, attack: 0.005 })
  },
  attackAlert() {
    // Multiple pings — city under attack notification
    tone({ freq: 1200, type: 'square', dur: 0.05, vol: 0.09 })
    tone({ freq: 900, type: 'square', dur: 0.05, vol: 0.07, delay: 0.08 })
    tone({ freq: 1200, type: 'square', dur: 0.05, vol: 0.09, delay: 0.16 })
  },

  // --- Case/email events ---
  newEmail() {
    // Incoming signal chime — military radio style
    tone({ freq: 1400, type: 'square', dur: 0.04, vol: 0.09 })
    tone({ freq: 1800, type: 'square', dur: 0.08, vol: 0.1, delay: 0.05 })
    tone({ freq: 1400, type: 'sine', dur: 0.2, vol: 0.07, delay: 0.14 })
  },
  scanStart() {
    // Scanning sweep sound
    tone({ freq: 200, type: 'sine', dur: 1.0, vol: 0.04, glideTo: 1000 })
    noiseBurst({ dur: 0.08, vol: 0.04, filterFreq: 2000 })
  },
  breachKlaxon() {
    // Deep alarm for wrong answer / breach
    tone({ freq: 220, type: 'sawtooth', dur: 0.4, vol: 0.15, glideTo: 160 })
    tone({ freq: 260, type: 'sawtooth', dur: 0.4, vol: 0.12, glideTo: 200, delay: 0.05 })
    noiseBurst({ dur: 0.25, vol: 0.1, filterFreq: 500 })
    for (let i = 0; i < 3; i++) {
      tone({ freq: 440, type: 'square', dur: 0.06, vol: 0.08, delay: 0.5 + i * 0.12 })
    }
  },
  threatNeutralized() {
    // Satisfying confirmation chord
    tone({ freq: 523.25, type: 'triangle', dur: 0.18, vol: 0.14 })
    tone({ freq: 659.25, type: 'triangle', dur: 0.22, vol: 0.14, delay: 0.1 })
    tone({ freq: 987.77, type: 'triangle', dur: 0.3, vol: 0.15, delay: 0.2 })
    tone({ freq: 1046.5, type: 'sine', dur: 0.35, vol: 0.1, delay: 0.32 })
  },
  missionComplete() {
    // Full fanfare — ascending triumphant sequence
    const notes = [523.25, 659.25, 783.99, 659.25, 783.99, 1046.5]
    notes.forEach((f, i) =>
      tone({ freq: f, type: 'triangle', dur: 0.3, vol: 0.18, delay: i * 0.14 })
    )
    tone({ freq: 1046.5, type: 'sine', dur: 0.8, vol: 0.12, delay: notes.length * 0.14 })
  },

  // --- Ambient backgrounds ---
  startAmbient() {
    if (muted || ambientNodes) return
    const c = getCtx()
    // Layer 1: dark sub-bass drone
    const osc1 = c.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 40
    // Layer 2: beating tone for tension
    const osc2 = c.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 40.3
    // Layer 3: high shimmer
    const osc3 = c.createOscillator()
    osc3.type = 'sine'
    osc3.frequency.value = 880
    const gain1 = c.createGain()
    gain1.gain.value = 0.025
    const gain2 = c.createGain()
    gain2.gain.value = 0.015
    const gain3 = c.createGain()
    gain3.gain.value = 0.004
    // Slow shimmer LFO
    const lfo = c.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.2
    const lfoGain = c.createGain()
    lfoGain.gain.value = 0.003
    lfo.connect(lfoGain).connect(gain3.gain)
    osc1.connect(gain1).connect(c.destination)
    osc2.connect(gain2).connect(c.destination)
    osc3.connect(gain3).connect(c.destination)
    osc1.start(); osc2.start(); osc3.start(); lfo.start()
    ambientNodes = { osc1, osc2, osc3, gain1, gain2, gain3, lfo }
  },
  stopAmbient() {
    if (ambientNodes) {
      try {
        ambientNodes.osc1.stop()
        ambientNodes.osc2.stop()
        ambientNodes.osc3.stop()
        ambientNodes.lfo.stop()
      } catch (e) { /* already stopped */ }
      ambientNodes = null
    }
  },
  toggleMute() {
    muted = !muted
    if (muted) this.stopAmbient()
    else this.startAmbient()
    return muted
  },
  isMuted() { return muted }
}
