import React from 'react'

const coralSVG = (
  <svg width="80" height="80" viewBox="0 0 80 80">
    <g>
      <path d="M40 70 Q38 50 30 60 Q25 65 20 55 Q15 45 30 40 Q20 35 25 25 Q30 15 40 25 Q50 15 55 25 Q60 35 50 40 Q65 45 60 55 Q55 65 50 60 Q42 50 40 70" fill="#ffb6b9" stroke="#e57373" strokeWidth="2"/>
      <circle cx="25" cy="25" r="3" fill="#fff176"/>
      <circle cx="55" cy="25" r="3" fill="#fff176"/>
      <circle cx="30" cy="60" r="2" fill="#fff176"/>
      <circle cx="50" cy="60" r="2" fill="#fff176"/>
    </g>
  </svg>
)

const fishSVG = (
  <svg width="70" height="40" viewBox="0 0 70 40">
    <g>
      <ellipse cx="35" cy="20" rx="20" ry="12" fill="#4fc3f7"/>
      <polygon points="55,20 70,10 70,30" fill="#0288d1"/>
      <circle cx="25" cy="18" r="2" fill="#fff"/>
      <circle cx="25" cy="18" r="1" fill="#222"/>
      <ellipse cx="40" cy="28" rx="6" ry="2" fill="#fff9c4" opacity="0.5"/>
    </g>
  </svg>
)

const urchinSVG = (
  <svg width="50" height="50" viewBox="0 0 50 50">
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
)

const LandingPage = ({ onStart }) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #b3e5fc 0%, #0288d1 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Trebuchet MS, Verdana, Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      left: 30,
      top: 40,
      opacity: 0.7
    }}>{coralSVG}</div>
    <div style={{
      position: 'absolute',
      right: 40,
      top: 100,
      opacity: 0.7
    }}>{fishSVG}</div>
    <div style={{
      position: 'absolute',
      left: 60,
      bottom: 60,
      opacity: 0.7
    }}>{urchinSVG}</div>
    <div style={{
      position: 'absolute',
      right: 80,
      bottom: 40,
      opacity: 0.7
    }}>{fishSVG}</div>
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      borderRadius: 24,
      padding: '40px 32px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      textAlign: 'center',
      zIndex: 1,
      maxWidth: 350
    }}>
      <h1 style={{
        fontSize: 38,
        color: '#0288d1',
        marginBottom: 12,
        letterSpacing: 2,
        fontWeight: 700,
        textShadow: '0 2px 8px #b3e5fc'
      }}>
        Reef Rescue
      </h1>
      <p style={{
        fontSize: 18,
        color: '#333',
        marginBottom: 28
      }}>
        Match sea creatures, save the reef! Remove urchins by matching snappers or lobsters nearby. Can you clean the reef?
      </p>
      <p style={{
        fontSize: 18,
        color: '#333',
        marginBottom: 28
      }}>
        Coming soon: Every 10 urchins removed earns you the ability to adopt request a real life removeal of an urchin from a reef in need. Help us make a difference!
      </p>
      <button
        onClick={onStart}
        style={{
          background: 'linear-gradient(90deg, #4fc3f7 0%, #0288d1 100%)',
          color: '#fff',
          fontSize: 20,
          padding: '12px 36px',
          border: 'none',
          borderRadius: 20,
          cursor: 'pointer',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(2,136,209,0.15)',
          transition: 'background 0.2s'
        }}
      >
        Play
      </button>
    </div>
  </div>
)

export default LandingPage
