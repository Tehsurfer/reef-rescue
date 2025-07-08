import { useState } from 'react'

const defaultOdds = {
  snapper: 0.15,
  kelp: 0.20,
  rock: 0.20,
  crab: 0.20,
  lobster: 0.15,
  urchin: 0.10
}

const tileNames = [
  { key: 'snapper', label: 'Snapper' },
  { key: 'kelp', label: 'Kelp' },
  { key: 'rock', label: 'Rock' },
  { key: 'crab', label: 'Crab' },
  { key: 'lobster', label: 'Lobster' },
  { key: 'urchin', label: 'Urchin' }
]

const getRandomOdds = () => {
  // Generate random odds that sum to 1
  let vals = Array(tileNames.length).fill(0).map(() => Math.random())
  let sum = vals.reduce((a, b) => a + b, 0)
  vals = vals.map(v => v / sum)
  // Optionally, round to 2 decimals and re-normalize
  vals = vals.map(v => Math.round(v * 100) / 100)
  let normSum = vals.reduce((a, b) => a + b, 0)
  vals[vals.length - 1] += 1 - normSum // fix rounding error
  const odds = {}
  tileNames.forEach((t, i) => odds[t.key] = vals[i])
  return odds
}

const PreGameRoll = ({ onRollComplete, setTileOdds, initialOdds }) => {
  const [rolling, setRolling] = useState(false)
  const [odds, setOdds] = useState(initialOdds || defaultOdds)

  const handleRoll = () => {
    setRolling(true)
    let rollCount = 0
    const rollInterval = setInterval(() => {
      setOdds(getRandomOdds())
      rollCount++
      if (rollCount > 15) {
        clearInterval(rollInterval)
        setRolling(false)
      }
    }, 80)
  }

  const handleAccept = () => {
    setTileOdds(odds)
    onRollComplete()
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(255,255,255,0.93)',
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px #0288d1aa',
        padding: '32px 36px',
        minWidth: 260,
        maxWidth: 340,
        textAlign: 'center',
        fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif',
        color: '#0288d1',
        fontWeight: 700,
        fontSize: 18,
        position: 'relative'
      }}>
        <div style={{fontSize: 22, marginBottom: 12, fontWeight: 900}}>Roll for Reef Odds</div>
        <table style={{margin: '0 auto 18px auto', fontSize: 17, borderCollapse: 'collapse'}}>
          <tbody>
            {tileNames.map(t => (
              <tr key={t.key}>
                <td style={{padding: '2px 10px', textAlign: 'right'}}>{t.label}</td>
                <td style={{padding: '2px 10px', textAlign: 'left', fontWeight: 900, color: '#0288d1'}}>
                  {(odds[t.key] * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleRoll}
          disabled={rolling}
          style={{
            background: '#0288d1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            padding: '8px 28px',
            cursor: rolling ? 'not-allowed' : 'pointer',
            marginRight: 10,
            marginBottom: 8
          }}
        >
          {rolling ? 'Rolling...' : 'Roll'}
        </button>
        <button
          onClick={handleAccept}
          disabled={rolling}
          style={{
            background: '#43e97b',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            padding: '8px 28px',
            cursor: rolling ? 'not-allowed' : 'pointer',
            marginBottom: 8
          }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}

export default PreGameRoll
