import { useEffect, useState } from 'react'

function useTypewriter(text, speed = 16) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setOut('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text])

  const skip = () => {
    setOut(text)
    setDone(true)
  }

  return [out, done, skip]
}

export default function DialogueBox({ eyebrow, text, onContinue, continueLabel = 'Continue ▶' }) {
  const [out, done, skip] = useTypewriter(text)

  const handleClick = () => {
    if (!done) skip()
    else onContinue()
  }

  return (
    <div className="story-card" onClick={handleClick}>
      <div className="story-eyebrow">{eyebrow}</div>
      <div className="story-text">
        {out}
        {!done && <span className="type-cursor">▌</span>}
      </div>
      <div className="story-hint">{done ? 'Tap to continue' : 'Tap to skip'}</div>
    </div>
  )
}
