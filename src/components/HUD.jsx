export default function HUD({ lives, xp, streak }) {
  const xpPct = Math.min(100, xp % 200)  // 200 XP per level
  const level = Math.floor(xp / 200) + 1

  return (
    <div className="hud">
      <div className="hearts">
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className={`heart ${i >= lives ? 'lost' : ''}`}>❤</span>
        ))}
      </div>
      <div className="hud-xp-section">
        <div className="hud-xp-label">XP {xp} · LVL {level}</div>
        <div className="xp-bar-wrap">
          <div className="xp-bar" style={{ width: `${xpPct / 2}%` }} />
        </div>
      </div>
      <div className="streak-badge">
        {streak >= 3 ? `🔥 x${streak}` : streak > 0 ? `⚡ x${streak}` : ''}
      </div>
    </div>
  )
}
