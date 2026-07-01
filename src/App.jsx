import { useEffect, useRef, useState, useCallback } from 'react'
import PhaserGame from './components/PhaserGame.jsx'
import DialogueBox from './components/DialogueBox.jsx'
import EmailCard from './components/EmailCard.jsx'
import HUD from './components/HUD.jsx'
import ToastLayer from './components/ToastLayer.jsx'
import { bus } from './game/eventBus.js'
import { audio } from './game/audio.js'
import { STORY_PANELS } from './data/story.js'
import { CHAPTERS } from './data/chapters.js'
import { ACHIEVEMENTS } from './data/achievements.js'

const XP_PER_CORRECT = 20

const initialState = {
  screen: 'title', // title | story | map | chapterIntro | game | caseFailed | chapterComplete | finalResults
  storyIdx: 0,
  chapterIdx: 0,
  emailIdx: 0,
  lives: 3,
  villainHealth: 5,
  xp: 0,
  streak: 0,
  maxStreak: 0,
  mistakesThisChapter: 0,
  totalCorrect: 0,
  totalSeen: 0,
  chapterUnlocked: 0,
  chaptersDone: [],
  achievements: [],
  answered: false,
  lastCorrect: null
}

// Glitch text effect component
function GlitchText({ text, className }) {
  return (
    <span className={`glitch-text ${className || ''}`} data-text={text}>
      {text}
    </span>
  )
}

// Animated breach counter
function BreachCounter() {
  const [count, setCount] = useState(0)
  const [cities, setCities] = useState([])

  const BREACH_CITIES = ['Tokyo', 'Lagos', 'Jakarta', 'London', 'São Paulo', 'Cyber City', 'Mumbai', 'Seoul', 'Berlin', 'Cairo']

  useEffect(() => {
    let val = 0
    const interval = setInterval(() => {
      val += Math.floor(Math.random() * 3) + 1
      setCount(val)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const city = BREACH_CITIES[Math.floor(Math.random() * BREACH_CITIES.length)]
      setCities(prev => [city, ...prev].slice(0, 3))
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="breach-counter">
      <div className="breach-num">{count.toLocaleString()}</div>
      <div className="breach-label">PHISHING ATTEMPTS THIS HOUR</div>
      <div className="breach-ticker">
        {cities.map((c, i) => (
          <span key={i} className="breach-city">⚠ {c} COMPROMISED</span>
        ))}
      </div>
    </div>
  )
}

// Threat level badge
function ThreatBadge({ level }) {
  const colors = { LOW: 'var(--green)', MEDIUM: 'var(--amber)', HIGH: 'var(--magenta)', CRITICAL: '#ff0040' }
  return (
    <div className="threat-badge" style={{ borderColor: colors[level], color: colors[level] }}>
      <span className="threat-dot" style={{ background: colors[level] }} />
      THREAT: {level}
    </div>
  )
}

export default function App() {
  const [s, setS] = useState(initialState)
  const [worldReady, setWorldReady] = useState(false)
  const [muted, setMuted] = useState(false)
  const [toasts, setToasts] = useState([])
  const [titleAnim, setTitleAnim] = useState(false)
  const audioUnlocked = useRef(false)

  // Unlock Web Audio on first gesture
  useEffect(() => {
    const unlock = () => {
      if (audioUnlocked.current) return
      audioUnlocked.current = true
      audio.startAmbient()
      window.removeEventListener('pointerdown', unlock)
    }
    window.addEventListener('pointerdown', unlock)
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  // Title entrance animation
  useEffect(() => {
    if (s.screen === 'title') {
      setTimeout(() => setTitleAnim(true), 100)
    } else {
      setTitleAnim(false)
    }
  }, [s.screen])

  // Bus listeners
  useEffect(() => {
    const offs = [
      bus.on('world-ready', () => setWorldReady(true)),
      bus.on('node-selected', ({ index }) => enterChapter(index))
    ]
    return () => offs.forEach((off) => off())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Drive Phaser modes
  useEffect(() => {
    if (!worldReady) return
    if (s.screen === 'title') bus.emit('set-mode', { mode: 'title' })
    else if (s.screen === 'story') bus.emit('set-mode', { mode: 'story' })
    else if (s.screen === 'map') {
      bus.emit('set-mode', { mode: 'map' })
      bus.emit('map-nodes', {
        chapters: CHAPTERS.map((c) => ({ title: c.title })),
        unlockedIndex: s.chapterUnlocked,
        doneIndexes: s.chaptersDone
      })
    } else if (s.screen === 'chapterIntro' || s.screen === 'game') {
      bus.emit('set-mode', { mode: 'case' })
      bus.emit('update-health', { 
        agentHp: s.lives, agentMax: 3,
        villainHp: s.villainHealth, villainMax: CHAPTERS[s.chapterIdx].emails.length
      })
    } else if (s.screen === 'caseFailed' || s.screen === 'chapterComplete' || s.screen === 'finalResults') {
      bus.emit('set-mode', { mode: 'result' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.screen, worldReady, s.chapterUnlocked, s.chaptersDone])

  // Story beat events — fire panel-specific audio
  useEffect(() => {
    if (!worldReady || s.screen !== 'story') return
    const panel = STORY_PANELS[s.storyIdx]
    bus.emit('story-beat', { panel: s.storyIdx })

    // Play scenario-specific sound for each panel
    if (panel?.sound) {
      setTimeout(() => {
        if (audio[panel.sound]) audio[panel.sound]()
      }, 200)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.storyIdx, worldReady, s.screen])

  // Play new-email sound when email changes
  useEffect(() => {
    if (s.screen === 'game') {
      setTimeout(() => audio.newEmail(), 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.emailIdx, s.screen])

  function pushToast(icon, text) {
    audio.achievement()
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, icon, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }

  function grantAchievement(key, list) {
    if (list.includes(key)) return list
    const a = ACHIEVEMENTS[key]
    pushToast(a.icon, `Achievement: ${a.name}`)
    return [...list, key]
  }

  function toggleMute() {
    audio.click()
    const m = audio.toggleMute()
    setMuted(m)
  }

  // --- Screen transitions ---
  function startStory() {
    audio.incomingTransmission()
    setS((p) => ({ ...p, screen: 'story', storyIdx: 0 }))
  }

  function nextStoryPanel() {
    audio.click()
    setS((p) => {
      if (p.storyIdx < STORY_PANELS.length - 1) return { ...p, storyIdx: p.storyIdx + 1 }
      return { ...p, screen: 'map' }
    })
  }

  function goToMap() {
    audio.click()
    setS((p) => ({ ...p, screen: 'map' }))
  }

  function enterChapter(i) {
    audio.newEmail()
    setS((p) => ({
      ...p,
      chapterIdx: i,
      emailIdx: 0,
      lives: 3,
      villainHealth: CHAPTERS[i].emails.length,
      streak: 0,
      mistakesThisChapter: 0,
      answered: false,
      screen: 'chapterIntro'
    }))
  }

  function startCase() {
    audio.click()
    setS((p) => ({ ...p, screen: 'game', answered: false }))
  }

  function submitAnswer(choice) {
    setS((p) => {
      if (p.answered) return p
      const ch = CHAPTERS[p.chapterIdx]
      const email = ch.emails[p.emailIdx]
      const correct = choice === email.answer
      bus.emit('agent-react', { type: correct ? 'correct' : 'wrong' })

      let achievements = p.achievements
      let streak = p.streak
      let maxStreak = p.maxStreak
      let lives = p.lives
      let villainHealth = p.villainHealth
      let mistakes = p.mistakesThisChapter

      if (correct) {
        streak += 1
        villainHealth -= 1
        maxStreak = Math.max(maxStreak, streak)
        if (streak >= 5) achievements = grantAchievement('sharpEye', achievements)
      } else {
        streak = 0
        lives -= 1
        mistakes += 1
      }

      bus.emit('update-health', { 
        agentHp: lives, agentMax: 3,
        villainHp: villainHealth, villainMax: ch.emails.length
      })

      return {
        ...p,
        answered: true,
        lastCorrect: correct,
        totalSeen: p.totalSeen + 1,
        totalCorrect: p.totalCorrect + (correct ? 1 : 0),
        xp: p.xp + (correct ? XP_PER_CORRECT : 0),
        streak,
        maxStreak,
        lives,
        villainHealth,
        mistakesThisChapter: mistakes,
        achievements
      }
    })
  }

  function nextEmail() {
    audio.click()
    setS((p) => {
      const ch = CHAPTERS[p.chapterIdx]

      if (p.lives <= 0) {
        audio.gameOver()
        bus.emit('agent-die')
        return { ...p, screen: 'caseFailed' }
      }

      if (p.emailIdx < ch.emails.length - 1) {
        return { ...p, emailIdx: p.emailIdx + 1, answered: false }
      }

      // Chapter complete
      bus.emit('villain-die')
      bus.emit('celebrate', {})
      let achievements = p.achievements
      if (p.mistakesThisChapter === 0) achievements = grantAchievement('noBait', achievements)
      if (ch.id === 0) achievements = grantAchievement('rookieDone', achievements)
      if (ch.id === 2) achievements = grantAchievement('whaleHunter', achievements)
      if (ch.id === 3) achievements = grantAchievement('citySaver', achievements)

      const chaptersDone = p.chaptersDone.includes(p.chapterIdx)
        ? p.chaptersDone
        : [...p.chaptersDone, p.chapterIdx]
      const chapterUnlocked = Math.max(p.chapterUnlocked, p.chapterIdx + 1)
      const isLast = ch.id === CHAPTERS.length - 1

      return {
        ...p,
        chaptersDone,
        chapterUnlocked,
        achievements,
        screen: isLast ? 'finalResults' : 'chapterComplete'
      }
    })
  }

  function retryChapter() {
    enterChapter(s.chapterIdx)
  }

  function restartGame() {
    audio.click()
    setS({ ...initialState, screen: 'title' })
  }

  // --- Render ---
  const ch = CHAPTERS[s.chapterIdx]
  const email = ch?.emails[s.emailIdx]
  const storyPanel = STORY_PANELS[s.storyIdx]

  return (
    <div className="game-shell">
      <div className="game-view">
        <PhaserGame />
        <ToastLayer toasts={toasts} />

        <div className="ui-panel">

          {/* =================== TITLE SCREEN =================== */}
          {s.screen === 'title' && (
            <div className={`title-screen ${titleAnim ? 'title-visible' : ''}`}>
              <div className="title-top">
                <div className="title-scanline-overlay" />

                <div className="title-logo-wrap">
                  <div className="title-eyebrow">◈ CYBER CITY DEFENSE UNIT — CLASSIFIED ◈</div>
                  <div className="title-logo font-display">
                    <GlitchText text="PHISHNET" />
                  </div>
                  <div className="title-tagline">CYBER CITY PROTOCOL</div>
                  <div className="title-flavor">
                    Year 2041 — The Shoal is breaching 37 cities right now.<br />
                    Only you can stop them. One email at a time.
                  </div>
                </div>

                <BreachCounter />

                <div className="title-btns">
                  <button className="btn btn-mission" onClick={startStory}>
                    <span className="btn-icon">▶</span>
                    <span>
                      <div className="btn-main-text">START MISSION</div>
                      <div className="btn-sub-text">Begin Agent Briefing</div>
                    </span>
                  </button>
                  <div className="title-btns-row2">
                    <button className="btn btn-secondary" onClick={() => setS(p => ({ ...p, screen: 'map', storyIdx: 0 }))}>
                      🗺 FIELD MAP
                    </button>
                    <button className="btn btn-secondary" onClick={toggleMute}>
                      {muted ? '🔇 MUTED' : '🔊 AUDIO ON'}
                    </button>
                  </div>
                </div>

                <div className="title-footer">
                  <span className="title-footer-item">◈ CCDU TRAINING SIMULATION v4.1</span>
                  <span className="title-footer-item">◈ CLEARANCE: ROOKIE</span>
                  <span className="title-footer-item">◈ THREAT LEVEL: CRITICAL</span>
                </div>
              </div>
            </div>
          )}

          {/* =================== STORY PANELS =================== */}
          {s.screen === 'story' && storyPanel && (
            <div className="story-screen">
              <div className="story-panel-header">
                <div className="story-panel-num">
                  INTEL {s.storyIdx + 1} / {STORY_PANELS.length}
                </div>
                <button className="btn btn-sm" onClick={goToMap}>SKIP ▶▶</button>
              </div>
              <div className="story-content">
                <div className="story-speaker-badge">{storyPanel.speaker}</div>
                <DialogueBox
                  eyebrow={storyPanel.eyebrow}
                  text={storyPanel.text}
                  onContinue={nextStoryPanel}
                  continueLabel={s.storyIdx < STORY_PANELS.length - 1 ? 'Continue ▶' : 'Enter Field ▶'}
                />
                <div className="story-progress">
                  {STORY_PANELS.map((_, i) => (
                    <div key={i} className={`story-dot ${i === s.storyIdx ? 'active' : i < s.storyIdx ? 'done' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================== MAP SCREEN =================== */}
          {s.screen === 'map' && (
            <div className="map-screen">
              <div className="map-header">
                <div>
                  <div className="ch-eyebrow">CYBER CITY DEFENSE UNIT — COMMAND CENTER</div>
                  <div className="map-title font-display">MISSION SELECT</div>
                </div>
                <div className="map-header-right">
                  <button className="btn btn-sm" onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>
                </div>
              </div>
              <div className="map-hint">◈ Select an active case file above to deploy. Cases must be completed in order.</div>
              <div className="map-status-row">
                <div className="map-stat">XP: <strong>{s.xp}</strong></div>
                <div className="map-stat">CLEARED: <strong>{s.chaptersDone.length} / {CHAPTERS.length}</strong></div>
                <div className="map-stat">ACCURACY: <strong>{s.totalSeen ? Math.round((s.totalCorrect / s.totalSeen) * 100) : 0}%</strong></div>
              </div>
            </div>
          )}

          {/* =================== CHAPTER INTRO =================== */}
          {s.screen === 'chapterIntro' && ch && (
            <div className="chapter-intro-screen">
              <div className="chapter-intro-header">
                <div className="chapter-intro-badge">
                  <div className="ch-eyebrow">MISSION BRIEF — CASE {String(ch.id + 1).padStart(2, '0')}</div>
                  <div className="chapter-intro-title font-display">{ch.title}</div>
                  <div className="chapter-intro-location">📍 {ch.location}</div>
                </div>
                <ThreatBadge level={ch.threat} />
              </div>
              <DialogueBox
                eyebrow="🔵 ECHO // FIELD BRIEFING"
                text={ch.intro}
                onContinue={startCase}
                continueLabel="▶ OPEN INBOX — MISSION START"
              />
              <div className="btn-row">
                <button className="btn" onClick={goToMap}>← ABORT MISSION</button>
              </div>
            </div>
          )}

          {/* =================== GAME SCREEN =================== */}
          {s.screen === 'game' && ch && email && (
            <>
              <HUD lives={s.lives} xp={s.xp} streak={s.streak} />
              <div className="game-header-bar">
                <div className="game-mission-label">
                  <span className="game-mission-case">CASE {String(ch.id + 1).padStart(2, '0')}</span>
                  <span className="game-mission-sep">—</span>
                  <span className="game-mission-title">{ch.title}</span>
                </div>
                <div className="game-progress-label">
                  EMAIL {s.emailIdx + 1} <span className="game-progress-sep">/</span> {ch.emails.length}
                </div>
              </div>
              <EmailCard
                email={email}
                answered={s.answered}
                correct={s.lastCorrect}
                onAnswer={submitAnswer}
                onNext={nextEmail}
              />
            </>
          )}

          {/* =================== CASE FAILED =================== */}
          {s.screen === 'caseFailed' && (
            <div className="result-screen danger-screen">
              <div className="result-logo font-display danger-text">◈ BREACH DETECTED ◈</div>
              <div className="result-subtitle">CASE COMPROMISED — THE SHOAL GOT THROUGH</div>
              <div className="story-card static result-card">
                <div className="story-eyebrow">🔴 ECHO // DEBRIEF</div>
                <div className="story-text">
                  "Agent — you lost this one. The Shoal exploited a gap in your judgment. That's what they count on: one moment of doubt, one moment of panic. They've done this 50,000 times. You haven't. That's why you train.<br/><br/>
                  Re-run the case. Find where the tell was. The fingerprint was always there — we just have to teach your eye to see it."
                </div>
              </div>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={retryChapter}>↻ RETRY MISSION</button>
                <button className="btn" onClick={goToMap}>← CASE FILES</button>
              </div>
            </div>
          )}

          {/* =================== CHAPTER COMPLETE =================== */}
          {s.screen === 'chapterComplete' && ch && (
            <div className="result-screen success-screen">
              <div className="result-logo font-display">◈ CASE CLOSED ◈</div>
              <div className="result-subtitle">{ch.title} — THREAT NEUTRALIZED</div>
              <div className="story-card static result-card">
                <div className="story-eyebrow">🔵 ECHO // DEBRIEF</div>
                <div className="story-text">
                  {s.mistakesThisChapter === 0
                    ? '"Flawless read, Agent. Not one click through. The Shoal\'s campaign against this sector just went dark. Cyber City is safer because you were watching. Outstanding work."'
                    : '"Case closed — you held the line. A few close calls, but your overall read was solid. PHANTOM is regrouping. Next wave is already compiling. Get ready."'}
                </div>
              </div>
              <div className="stat-grid">
                <div className="stat-box"><div className="stat-num">{s.xp}</div><div className="stat-label">Total XP</div></div>
                <div className="stat-box"><div className="stat-num">{s.maxStreak}</div><div className="stat-label">Best Streak</div></div>
                <div className="stat-box"><div className="stat-num">{s.lives}</div><div className="stat-label">Lives Left</div></div>
                <div className="stat-box"><div className="stat-num">{s.mistakesThisChapter === 0 ? '✓' : s.mistakesThisChapter}</div><div className="stat-label">{s.mistakesThisChapter === 0 ? 'Perfect' : 'Mistakes'}</div></div>
              </div>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={goToMap}>NEXT MISSION ▶</button>
              </div>
            </div>
          )}

          {/* =================== FINAL RESULTS =================== */}
          {s.screen === 'finalResults' && (
            <div className="result-screen final-screen">
              <div className="result-logo font-display">◈ CYBER CITY IS SAFE ◈</div>
              <div className="result-subtitle">...for now. PHANTOM is still out there.</div>
              <div className="story-card static result-card">
                <div className="story-eyebrow">🔵 ECHO // MISSION COMPLETE</div>
                <div className="story-text">
                  "The Shoal's DEEP HOOK network just went dark across all monitored sectors. Every call you made — every phishing email you flagged — trained our city-wide defense grid. Thousands of inboxes are safer because of you.<br/><br/>
                  But PHANTOM doesn't stop. They're already writing the next campaign. You know their fingerprints now. Stay sharp, Agent. Cyber City isn't done with you yet."
                </div>
              </div>
              <div className="stat-grid">
                <div className="stat-box"><div className="stat-num">{s.xp}</div><div className="stat-label">Total XP</div></div>
                <div className="stat-box"><div className="stat-num">{s.totalSeen ? Math.round((s.totalCorrect / s.totalSeen) * 100) : 0}%</div><div className="stat-label">Accuracy</div></div>
                <div className="stat-box"><div className="stat-num">{s.maxStreak}</div><div className="stat-label">Best Streak</div></div>
                <div className="stat-box"><div className="stat-num">{s.achievements.length}</div><div className="stat-label">Badges</div></div>
              </div>
              <div className="achv-row">
                {s.achievements.length ? (
                  s.achievements.map((k) => (
                    <div className="achv-chip" key={k}>
                      {ACHIEVEMENTS[k].icon} {ACHIEVEMENTS[k].name}
                    </div>
                  ))
                ) : (
                  <span className="dim-text">No badges earned — try again, Agent.</span>
                )}
              </div>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={restartGame}>↻ NEW MISSION</button>
                <button className="btn" onClick={goToMap}>← CASE FILES</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
