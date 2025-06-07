import React from 'react'

// Use a full-page CSS gradient for the background
export const ReefBackgroundGradient = () => (
  <div
    className="reef-background-gradient"
    style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none'
    }}
    aria-hidden="true"
  />
)

// Decorative SVGs for coral, fish, etc.
export const ReefDecorSVGs = () => (
  <>
    {/* Coral bottom left */}
    <svg width="120" height="120" style={{
      position: 'fixed', left: 0, bottom: 0, zIndex: 1, opacity: 0.7, pointerEvents: 'none'
    }} viewBox="0 0 80 80">
      <g>
        <path d="M40 70 Q38 50 30 60 Q25 65 20 55 Q15 45 30 40 Q20 35 25 25 Q30 15 40 25 Q50 15 55 25 Q60 35 50 40 Q65 45 60 55 Q55 65 50 60 Q42 50 40 70" fill="#ffb6b9" stroke="#e57373" strokeWidth="2"/>
        <circle cx="25" cy="25" r="3" fill="#fff176"/>
        <circle cx="55" cy="25" r="3" fill="#fff176"/>
        <circle cx="30" cy="60" r="2" fill="#fff176"/>
        <circle cx="50" cy="60" r="2" fill="#fff176"/>
      </g>
    </svg>
    {/* Fish top right */}
    <svg width="100" height="60" style={{
      position: 'fixed', right: 0, top: 60, zIndex: 1, opacity: 0.7, pointerEvents: 'none'
    }} viewBox="0 0 70 40">
      <g>
        <ellipse cx="35" cy="20" rx="20" ry="12" fill="#4fc3f7"/>
        <polygon points="55,20 70,10 70,30" fill="#0288d1"/>
        <circle cx="25" cy="18" r="2" fill="#fff"/>
        <circle cx="25" cy="18" r="1" fill="#222"/>
        <ellipse cx="40" cy="28" rx="6" ry="2" fill="#fff9c4" opacity="0.5"/>
      </g>
    </svg>
    {/* Urchin bottom right */}
    <svg width="70" height="70" style={{
      position: 'fixed', right: 20, bottom: 30, zIndex: 1, opacity: 0.7, pointerEvents: 'none'
    }} viewBox="0 0 50 50">
      <g>
        <circle cx="25" cy="25" r="12" fill="#7e57c2"/>
        <g stroke="#4527a0" strokeWidth="2">
          <line x1="25" y1="5" x2="25" y2="18"/>
          <line x1="25" y1="45" x2="25" y2="32"/>
          <line x1="5" y1="25" x2="18" y2="25"/>
          <line x1="45" y1="25" x2="32" y2="25"/>
          <line x1="10" y1="10" x2="20" y2="20"/>
          <line x1="40" y1="10" x2="30" y2="20"/>
          <line x1="10" y1="40" x2="20" y2="30"/>
          <line x1="40" y1="40" x2="30" y2="30"/>
        </g>
        <circle cx="25" cy="25" r="5" fill="#fff"/>
      </g>
    </svg>
  </>
)

export const reefStyles = `
.reef-background-gradient {
  background: linear-gradient(180deg, #b3e5fc 0%, #0288d1 100%);
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 0;
  pointer-events: none;
}
.reef-game-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: row;
}
.reef-game-board {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1 / 1;
  min-width: 240px;
  min-height: 240px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  background: none;
  border-radius: 16px;
  position: relative;
}
.reef-scoreboard {
  background: rgba(255,255,255,0.85);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(2,136,209,0.10);
  text-align: center;
  font-family: "Trebuchet MS", "Verdana", "Arial", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 32px;
  min-width: 220px;
  max-width: 280px;
  width: auto;
  padding: 14px 12px;
}
.reef-game-board img {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  touch-action: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(2,136,209,0.08);
  margin: 0;
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  max-height: 100%;
}
@media (max-width: 700px) {
  .reef-background-gradient {
    width: 100vw !important;
    height: 100vh !important;
    min-width: 100vw !important;
    min-height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
  }
  .reef-game-container {
    flex-direction: column !important;
    min-height: 100vh !important;
  }
  .reef-game-board {
    width: 98vw !important;
    max-width: 98vw !important;
    min-width: 0 !important;
    aspect-ratio: 1 / 1 !important;
    margin: 0 auto !important;
  }
  .reef-scoreboard {
    margin-left: 0 !important;
    margin-top: 18px !important;
    min-width: 0 !important;
    max-width: 98vw !important;
    width: 98vw !important;
    box-sizing: border-box;
    padding: 10px 4vw !important;
  }
  .reef-game-board img {
    aspect-ratio: 1 / 1 !important;
    min-width: 0 !important;
    min-height: 0 !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }
}
`
