import { useState } from 'react'
import SlotCounter from 'react-slot-counter'
import {
  snapper,
  kelp,
  rock,
  crab,
  lobster,
  urchin,
  tileMapForRolls
} from './candyImageMap'

const defaultOdds = {
  snapper: 0.15,
  kelp: 0.20,
  rock: 0.20,
  crab: 0.20,
  lobster: 0.15,
  urchin: 0.10
}

const tileNames = [
  { key: 'snapper', label: 'Snapper', img: snapper },
  { key: 'kelp', label: 'Kelp', img: kelp },
  { key: 'rock', label: 'Rock', img: rock },
  { key: 'crab', label: 'Crab', img: crab },
  { key: 'lobster', label: 'Lobster', img: lobster },
  { key: 'urchin', label: 'Urchin', img: urchin }
]

const getRandomTileKey = () => {
  const keys = Object.keys(defaultOdds)
  const weights = keys.map(k => defaultOdds[k])
  const sum = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * sum
  for (let i = 0; i < keys.length; ++i) {
    if (r < weights[i]) return keys[i]
    r -= weights[i]
  }
  return keys[keys.length - 1]
}

const getAdjustedOdds = (baseOdds, hits, boostPercent = 0.05) => {
  let odds = { ...baseOdds }
  let totalBoost = 0
  hits.forEach(tileKey => {
    odds[tileKey] += boostPercent
    totalBoost += boostPercent
  })
  const others = Object.keys(odds).filter(k => !hits.includes(k))
  const othersSum = others.reduce((sum, k) => sum + odds[k], 0)
  others.forEach(k => {
    odds[k] -= (odds[k] / othersSum) * totalBoost
  })
  let sum = Object.values(odds).reduce((a, b) => a + b, 0)
  Object.keys(odds).forEach(k => odds[k] = Math.max(0, odds[k]))
  sum = Object.values(odds).reduce((a, b) => a + b, 0)
  Object.keys(odds).forEach(k => odds[k] = odds[k] / sum)
  return odds
}

const PreGameRoll = ({ onRollComplete, setTileOdds, initialOdds, setPointsMultiplier, setFinalHits }) => {
  const [rolling, setRolling] = useState(false)
  const [odds, setOdds] = useState(initialOdds || defaultOdds)
  const [displayOdds, setDisplayOdds] = useState(initialOdds || defaultOdds)
  const [slots, setSlots] = useState(['snapper', 'kelp', 'urchin'])
  const [localFinalHits, setLocalFinalHits] = useState(['snapper', 'kelp', 'urchin'])
  const [rollsRemaining, setRollsRemaining] = useState(3)

  const counterRef = useState(null)

  const handleRoll = () => {
    if (rolling || rollsRemaining <= 0) return
    setRolling(true)
    // Roll 3 tiles
    const hits = [getRandomTileKey(), getRandomTileKey(), getRandomTileKey()]
    setLocalFinalHits(hits)
    if (setFinalHits) setFinalHits(hits) // <-- update parent state
    // Adjust odds
    const newOdds = getAdjustedOdds(defaultOdds, hits)
    setOdds(newOdds)
    // Animate odds update after slot animation finishes
    if (counterRef.current) {
      counterRef.current.startAnimation()
    }
    setTimeout(() => {
      setDisplayOdds(newOdds)
      setRolling(false)
      setSlots(hits)
      checkForAllSame(hits)
    }, 500)
    setRollsRemaining(r => r - 1)
  }

  const checkForAllSame = (hits) => {
    const first = hits[0]
    if (hits.every(h => h === first)) {
      setPointsMultiplier && setPointsMultiplier(2)
    } else {
      setPointsMultiplier && setPointsMultiplier(1)
    }
  }

  const findImageFromKey = (key) => {
    const tile = tileNames.find(t => t.key === key)
    return tile ? tileMapForRolls[tile.img] : null
  }

  const handleAccept = () => {
    setTileOdds(odds) // This will call the setter in Game.js
    onRollComplete()
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(255,255,255,0.73)',
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
        {typeof setPointsMultiplier !== 'undefined' && setPointsMultiplier === 2 && (
          <div style={{
            color: '#43e97b',
            fontWeight: 900,
            fontSize: 20,
            marginBottom: 10,
            letterSpacing: 1
          }}>
            🎉 Congrats! You rolled 3 of a kind!<br />
            <span style={{color: '#0288d1'}}>You will get <b>2x points</b> this game!</span>
          </div>
        )}
        <div style={{ height: '40px',display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 18}}>
          <SlotCounter
            ref={counterRef}
            value={localFinalHits.map(k => findImageFromKey(k))}
            startValue={slots.map(k => findImageFromKey(k))}
            dummyCharacters={tileNames.map(t => tileMapForRolls[t.img])}
          />
        </div>
        <table style={{margin: '0 auto 18px auto', fontSize: 17, borderCollapse: 'collapse'}}>
          <tbody>
            {tileNames.map(t => (
              <tr key={t.key}>
                <td style={{padding: '2px 10px', textAlign: 'right'}}>{t.label}</td>
                <td>
                  <SlotCounter
                    value={Math.round((displayOdds[t.key] || 0) * 100)}
                    startValue={Math.round((initialOdds?.[t.key] || defaultOdds[t.key]) * 100)}
                    duration={0.5}
                    autoAnimation
                    valueStyle={{
                      fontWeight: 900,
                      color: localFinalHits.includes(t.key) ? '#43e97b' : '#0288d1',
                      fontSize: 18,
                      minWidth: 32,
                      display: 'inline-block'
                    }}
                  /> %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleRoll}
          disabled={rolling || rollsRemaining <= 0}
          style={{
            background: '#0288d1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            padding: '8px 28px',
            cursor: rolling || rollsRemaining <= 0 ? 'not-allowed' : 'pointer',
            marginRight: 10,
            marginBottom: 8
          }}
        >
          {rolling ? 'Rolling...' : 'Re-roll (' + rollsRemaining + ')'}
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
