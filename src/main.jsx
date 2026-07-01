import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// Note: StrictMode is intentionally NOT used here. StrictMode double-invokes
// effects in dev, which would create/destroy the Phaser game instance twice
// and can leave the canvas in a broken state. Safe to add back if you strip
// the Phaser lifecycle out into something StrictMode-safe.
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
