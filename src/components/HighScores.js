import React, { useEffect, useState } from 'react'

const BIN_ID = process.env.REACT_APP_BIN_ID || console.error('REACT_APP_BIN_ID is not set')
const API_KEY = process.env.REACT_APP_API_KEY || console.error('REACT_APP_API_KEY is not set')

const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

const HighScores = ({ latestScore, playerName, urchinsDestroyed}) => {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  // Fetch scores from jsonbin.io
  const fetchScores = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL, {
        headers: {
          'X-Master-Key': API_KEY
        }
      })
      const data = await res.json()
      setScores(data.record.scores || [])
    } catch (err) {
      setError('Could not load high scores.')
    }
    setLoading(false)
  }

  // Submit a new score
  const submitScore = async () => {
    if (!playerName || !latestScore) return
    setLoading(true)
    setError(null)
    try {
      // Fetch current scores
      const res = await fetch(API_URL, {
        headers: { 'X-Master-Key': API_KEY }
      })
      const data = await res.json()
      const oldScores = data.record.scores || []
      // Add new score and sort
      const newScores = [
        ...oldScores,
        { name: playerName, score: latestScore, urchinsDestroyed: urchinsDestroyed, date: new Date().toISOString() }
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10) // Keep top 10

      // Update bin
      await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': API_KEY
        },
        body: JSON.stringify({ scores: newScores })
      })
      setScores(newScores)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 10000) // Reset submitted state after 10 seconds
    } catch (err) {
      setError('Could not submit score.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchScores()
  }, [])

  // Optionally, submit score when latestScore changes and playerName is set
  useEffect(() => {
    if (latestScore && playerName && !submitted) {
      submitScore()
    }
    // eslint-disable-next-line
  }, [latestScore, playerName])

  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      borderRadius: 12,
      padding: 18,
      maxWidth: 400,
      margin: '0 auto',
      boxShadow: '0 2px 8px #b3e5fc'
    }}>
      <h3 style={{
        color: '#0288d1',
        fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif',
        fontWeight: 700,
        margin: '0 0 16px 0',
        fontSize: 20,
        textAlign: 'center'
      }}>
        High Scores
      </h3>
      {loading && <div style={{color: '#0288d1'}}>Loading...</div>}
      {error && <div style={{color: '#e0487c'}}>{error}</div>}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: 8,
        fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif'
      }}>
        <thead>
          <tr style={{background: '#e0f7fa'}}>
            <th style={{padding: '6px 4px', color: '#0288d1', fontWeight: 700, fontSize: 15, borderBottom: '1px solid #b3e5fc'}}>#</th>
            <th style={{padding: '6px 4px', color: '#0288d1', fontWeight: 700, fontSize: 15, borderBottom: '1px solid #b3e5fc'}}>Name</th>
            <th style={{padding: '6px 4px', color: '#0288d1', fontWeight: 700, fontSize: 15, borderBottom: '1px solid #b3e5fc'}}>Score</th>
            <th style={{padding: '6px 4px', color: '#0288d1', fontWeight: 700, fontSize: 15, borderBottom: '1px solid #b3e5fc'}}>Urchins</th>
            <th style={{padding: '6px 4px', color: '#0288d1', fontWeight: 700, fontSize: 15, borderBottom: '1px solid #b3e5fc'}}>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, idx) => (
            <tr key={idx} style={{
              background: idx === 0 ? '#e0ffe0' : idx % 2 === 0 ? '#f7fafc' : '#fff'
            }}>
              <td style={{
                padding: '4px 4px',
                color: idx === 0 ? '#43e97b' : '#0288d1',
                fontWeight: idx === 0 ? 700 : 500,
                textAlign: 'center'
              }}>{idx + 1}</td>
              <td style={{
                padding: '4px 4px',
                color: idx === 0 ? '#43e97b' : '#0288d1',
                fontWeight: idx === 0 ? 700 : 500,
                textAlign: 'left'
              }}>{entry.name || 'Anonymous'}</td>
              <td style={{
                padding: '4px 4px',
                color: idx === 0 ? '#43e97b' : '#0288d1',
                fontWeight: idx === 0 ? 700 : 500,
                textAlign: 'center'
              }}>{entry.score}</td>
              <td style={{
                padding: '4px 4px',
                color: '#7e57c2',
                fontWeight: 600,
                textAlign: 'center'
              }}>{entry.urchinsDestroyed || 'N/A'}</td>
              <td style={{
                padding: '4px 4px',
                color: '#888',
                fontWeight: 400,
                fontSize: 13,
                textAlign: 'center'
              }}>{entry.date ? new Date(entry.date).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {submitted && (
        <div style={{
          marginTop: 10,
          color: '#43e97b',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          Score submitted!
        </div>
      )}
    </div>
  )
}

export default HighScores
