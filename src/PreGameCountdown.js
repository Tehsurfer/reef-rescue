import { useEffect, useState } from 'react'

const PreGameCountdown = ({ onComplete }) => {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count <= 0) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, onComplete])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none', // allow clicks to pass through except for the countdown box
      background: 'rgba(255,255,255,0.15)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 4px 24px #0288d1aa',
        padding: '48px 64px',
        minWidth: 120,
        textAlign: 'center',
        fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif',
        color: '#0288d1',
        fontWeight: 900,
        fontSize: 64,
        letterSpacing: 2,
        pointerEvents: 'auto'
      }}>
        {count > 0 ? count : 'Go!'}
      </div>
    </div>
  )
}

export default PreGameCountdown
