import React, { useEffect, useState } from 'react'

const BIN_ID = process.env.NEXT_PUBLIC_BIN_ID || console.error('NEXT_PUBLIC_BIN_ID is not set')
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || console.error('NEXT_PUBLIC_API_KEY is not set')

const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

const HighScores = ({ latestScore, playerName }) => {
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
        { name: playerName, score: latestScore, date: new Date().toISOString() }
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
      maxWidth: 340,
      margin: '0 auto',
      boxShadow: '0 2px 8px #b3e5fc'
    }}>
      <h3 style={{
        color: '#0288d1',
        fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif',
        fontWeight: 700,
        margin: '0 0 10px 0',
        fontSize: 20,
        textAlign: 'center'
      }}>
        High Scores
      </h3>
      {loading && <div style={{color: '#0288d1'}}>Loading...</div>}
      {error && <div style={{color: '#e0487c'}}>{error}</div>}
      <ol style={{paddingLeft: 20, margin: 0}}>
        {scores.map((entry, idx) => (
          <li key={idx} style={{
            color: idx === 0 ? '#43e97b' : '#0288d1',
            fontWeight: idx === 0 ? 700 : 500,
            marginBottom: 2
          }}>
            {entry.name || 'Anonymous'} — {entry.score}
          </li>
        ))}
      </ol>
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
