export default function EmailCard({ email, answered, correct, onAnswer, onNext }) {
  const label = email.answer === 'phishing' ? 'PHISHING' : 'SAFE'

  return (
    <div className="email-scene">
      <div className={`email-card ${answered ? '' : 'scanning'}`}>
        {!answered && <div className="scan-overlay" />}

        <div className="email-head">
          <div className="email-row">
            <b>FROM:</b>&nbsp;{email.from}
          </div>
          <div className="email-subject">{email.subject}</div>
        </div>

        <div className="email-body">
          {email.body.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </div>

        {!answered && (
          <div className="email-actions">
            <button className="btn btn-safe" onClick={() => onAnswer('safe')}>
              ✅ MARK SAFE
            </button>
            <button className="btn btn-danger" onClick={() => onAnswer('phishing')}>
              🎣 MARK PHISHING
            </button>
          </div>
        )}
      </div>

      {answered && (
        <>
          <div className={`verdict-panel ${correct ? 'correct' : 'wrong'}`}>
            <div className="verdict-title">
              {correct
                ? `✔ THREAT NEUTRALIZED — flagged as ${label}`
                : `✘ BREACH LOGGED — this was ${label}`}
            </div>
            <div className="flag-list">
              <div className="flag-list-heading">
                {correct ? '◈ Evidence ECHO logged:' : '◈ What to look for next time:'}
              </div>
              <ul>
                {email.flags.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={onNext}>
              NEXT INTERCEPT ▶
            </button>
          </div>
        </>
      )}
    </div>
  )
}
