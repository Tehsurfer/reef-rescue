import {useEffect, useState} from 'react'
import ScoreBoard from './components/ScoreBoard'
import UrchinsDestroyed from './components/UrchinsDestroyed'
import { ReefDecorSVGs, reefStyles } from './ReefTheme'
import UrchinDestructionAnimation from './UrchinDestructionAnimation'
import ThreeWaterBackground from './ThreeWaterBackground'
import ReefAlert from './ReefAlert'
import HighScores from './components/HighScores'
import GameBoard from './GameBoard'
import PreGameCountdown from './PreGameCountdown'
import PreGameRoll from './PreGameRoll'

import gameboardPlaceholder from './images/game-placeholder.png'

const GAME_DURATION = 75 // 1 minute and 30 seconds in seconds

const GAME_STATE = {
  PREGAME_ROLL: 'PREGAME_ROLL',
  COUNTDOWN: 'COUNTDOWN',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER'
}

const defaultTileOdds = {
  snapper: 0.15,
  kelp: 0.20,
  rock: 0.20,
  crab: 0.20,
  lobster: 0.15,
  urchin: 0.10
}

const Game = () => {
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const [urchinsDestroyed, setUrchinsDestroyed] = useState(0)
  const [messageBoard, setMessageBoard] = useState(null)
  const [urchinAnimationTrigger, setUrchinAnimationTrigger] = useState(0)
  const [timer, setTimer] = useState(GAME_DURATION)
  const [timerActive, setTimerActive] = useState(true)
  const [actionsEnabled, setActionsEnabled] = useState(true)
  const [alertBox, setAlertBox] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [submittedPlayerName, setSubmittedPlayerName] = useState('')
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const [restartKey, setRestartKey] = useState(0)
  const [gameState, setGameState] = useState(GAME_STATE.PREGAME_ROLL)
  const [tileOdds, setTileOdds] = useState(defaultTileOdds)
  const [pointsMultiplier, setPointsMultiplier] = useState(1)
  const [finalHits, setFinalHits] = useState([]) // <-- add this state

  // Timer effect (countdown)
  useEffect(() => {
    if (gameState !== GAME_STATE.PLAYING) return
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setGameState(GAME_STATE.GAME_OVER)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [gameState, timer])

  // Start game after countdown
  useEffect(() => {
    if (gameState === GAME_STATE.COUNTDOWN) {
      setActionsEnabled(false)
      setTimerActive(false)
    } else if (gameState === GAME_STATE.PLAYING) {
      setActionsEnabled(true)
      setTimerActive(true)
    } else if (gameState === GAME_STATE.GAME_OVER) {
      setActionsEnabled(false)
      setTimerActive(false)
    }
  }, [gameState])

  // Display message helper for board
  const displayMessage = (message) => {
    setMessageBoard(message)
    setTimeout(()=>setMessageBoard(null), 2000)
  }

  // Restart handler
  const handleRestart = () => {
    setGameState(GAME_STATE.PREGAME_ROLL)
    setTimer(GAME_DURATION)
    setScoreDisplay(0)
    setUrchinsDestroyed(0)
    setMessageBoard(null)
    setScoreSubmitted(false)
    setSubmittedPlayerName('')
    setUrchinAnimationTrigger(0)
    setRestartKey(k => k + 1)
  }

  // Only show modal if game is over and not in countdown
  const showGameOverModal = gameState === GAME_STATE.GAME_OVER && !scoreSubmitted

  // Only allow board actions if playing
  const gameActive = gameState === GAME_STATE.PLAYING && timer > 0 && timerActive

  return (
    <>
      <style>{reefStyles}</style>
      <UrchinDestructionAnimation trigger={urchinAnimationTrigger} />
      {alertBox && (
        <ReefAlert message={alertBox} onClose={() => setAlertBox(null)} />
      )}
      {/* Game over modal */}
      {showGameOverModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          zIndex: 30000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px #0288d1aa',
            padding: 32,
            minWidth: 320,
            maxWidth: 400,
            textAlign: 'center',
            position: 'relative'
          }}>
            <h2 style={{
              color: '#0288d1',
              fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif',
              fontWeight: 700,
              marginBottom: 12
            }}>Game Over!</h2>
            <div style={{marginBottom: 16}}>
              <span style={{color: '#0288d1', fontWeight: 600}}>Your Score: </span>
              <span style={{color: '#43e97b', fontWeight: 700, fontSize: 20}}>{scoreDisplay}</span>
            </div>
            {!submittedPlayerName && (
              <div style={{marginBottom: 16}}>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value.slice(0, 16))}
                  maxLength={16}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1.5px solid #0288d1',
                    fontSize: 16,
                    marginRight: 8
                  }}
                />
              </div>
            )}
            <button
              style={{
                marginTop: 18,
                background: '#fff',
                color: '#0288d1',
                border: '1.5px solid #0288d1',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 15,
                padding: '6px 22px',
                cursor: 'pointer',
                boxShadow: '0 1px 4px #b3e5fc'
              }}
              onClick={() => {
                if (!playerName) {
                  alert('Please enter your name to submit your score!')
                  return
                }
                setScoreSubmitted(true)
                setSubmittedPlayerName(playerName)
              }}
              disabled={!playerName || scoreSubmitted}
            >
              Submit Score
            </button>
            <button
              style={{
                marginTop: 12,
                background: '#0288d1',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 15,
                padding: '6px 22px',
                cursor: 'pointer',
                boxShadow: '0 1px 4px #b3e5fc',
                marginLeft: 8
              }}
              onClick={handleRestart}
            >
              Restart
            </button>
          </div>
        </div>
      )}
      <div style={{
        minHeight: '100vh',
        minWidth: '100vw',
        position: 'relative',
        background: 'none'
      }}>
        <ThreeWaterBackground />
        <ReefDecorSVGs />
        <div className="reef-game-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{position: 'relative'}}>
            {gameState === GAME_STATE.PLAYING && (
              <GameBoard
                timerActive={timerActive}
                setTimerActive={setTimerActive}
                actionsEnabled={gameActive}
                setActionsEnabled={setActionsEnabled}
                displayMessage={displayMessage}
                scoreDisplay={scoreDisplay}
                setScoreDisplay={setScoreDisplay}
                urchinsDestroyed={urchinsDestroyed}
                setUrchinsDestroyed={setUrchinsDestroyed}
                setUrchinAnimationTrigger={setUrchinAnimationTrigger}
                onRestart={handleRestart}
                restartKey={restartKey}
                tileOdds={tileOdds}
                pointsMultiplier={pointsMultiplier}
              />
            )}
            {gameState !== GAME_STATE.PLAYING && (
              <img
                src={gameboardPlaceholder}
                alt="Game Placeholder"
                className='game'
              />
            )}
            {gameState === GAME_STATE.COUNTDOWN && (
              <PreGameCountdown onComplete={() => setGameState(GAME_STATE.PLAYING)} />
            )}
            {gameState === GAME_STATE.PREGAME_ROLL && (
              <PreGameRoll
                setTileOdds={setTileOdds}
                setPointsMultiplier={setPointsMultiplier}
                setFinalHits={setFinalHits} // <-- pass setter
                initialOdds={tileOdds}
                onRollComplete={() => setGameState(GAME_STATE.COUNTDOWN)}
              />
            )}
          </div>
          <div className="reef-scoreboard">
            <div style={{
              fontSize: 20,
              color: '#0288d1',
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 6,
              fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif',
              textShadow: '0 2px 8px #b3e5fc'
            }}>
              <ScoreBoard score={scoreDisplay}/>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8
            }}>
              <span style={{
                fontSize: 16,
                color: '#0288d1',
                fontWeight: 600,
                fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif'
              }}>
                ⏱ {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
              </span>
              <button
                style={{
                  background: '#fff',
                  color: '#0288d1',
                  border: '1.5px solid #0288d1',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 14,
                  padding: '2px 12px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px #b3e5fc'
                }}
                onClick={handleRestart}
                title="Restart Game"
              >
                Restart
              </button>
            </div>
            <div style={{
              fontSize: 13,
              color: '#388e3c',
              margin: '8px 0 12px 0',
              fontWeight: 600,
              fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif',
              textShadow: '0 1px 4px #b3e5fc'
            }}>
              Urchins can't be touched! Match snapper or lobsters nearby to eat them!
            </div>
            <div style={{
              fontSize: 14,
              color: '#7e57c2',
              marginBottom: 8,
              fontWeight: 600,
              fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif'
            }}>
              <UrchinsDestroyed urchinsDestroyed={urchinsDestroyed}/>
            </div>
            <div style={{
              fontSize: 14,
              color: '#0288d1',
              minHeight: 22,
              fontWeight: 500,
              fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif'
            }}>
              {messageBoard}
            </div>
          </div>
          <div style={{marginLeft: 18}}>
            <HighScores 
              latestScore={scoreDisplay}
              playerName={submittedPlayerName} 
              urchinsDestroyed={urchinsDestroyed}
              finalHits={finalHits}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Game