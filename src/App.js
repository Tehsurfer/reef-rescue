import {useEffect, useState, useCallback} from 'react'
import ScoreBoard from './components/ScoreBoard'
import UrchinsDestroyed from './components/UrchinsDestroyed'
import LandingPage from './LandingPage'
import { ReefBackgroundGradient, ReefDecorSVGs, reefStyles } from './ReefTheme'
import {
  snapper,
  lobster,
  urchin,
  purpleCandy,
  redCandy,
  yellowCandy,
  blank,
  candyImageMap
} from './candyImageMap'
import UrchinDestructionAnimation from './UrchinDestructionAnimation'

const width = 8
let firstTimeTryingToMatchUrchin = true
const candyColors = [
  snapper,
  purpleCandy,
  redCandy,
  yellowCandy,
  lobster,
  urchin
]

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const [urchinsDestroyed, setUrchinsDestroyed] = useState(0)
  const [messageBoard, setMessageBoard] = useState(null)
  const [showLanding, setShowLanding] = useState(true)
  const [urchinAnimationTrigger, setUrchinAnimationTrigger] = useState(0)

  // For mobile touch support
  const [touchStartId, setTouchStartId] = useState(null)
  const [touchEndId, setTouchEndId] = useState(null)
  // For drag preview
  const [touchDragImage, setTouchDragImage] = useState(null)
  const [touchDragPos, setTouchDragPos] = useState({ x: 0, y: 0 })
  const [isTouchDragging, setIsTouchDragging] = useState(false)

  const checkForColumnOfFour = useCallback(() => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4)
        const match = columnOfFour
        const animal = currentColorArrangement[columnOfFour[0]]
        columnOfFour.forEach(square => currentColorArrangement[square] = blank)
        return {
          squares: match,
          animal: animal
        }
      }
    }
  }, [currentColorArrangement])

  const checkForRowOfFour = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangement[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      const isBlank = currentColorArrangement[i] === blank

      if (notValid.includes(i)) continue

      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4)
        const match = rowOfFour
        const animal = currentColorArrangement[rowOfFour[0]]
        rowOfFour.forEach(square => currentColorArrangement[square] = blank)
        return {
          squares: match,
          animal: animal
        }
      }
    }
  }, [currentColorArrangement])

  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3)
        const match = columnOfThree
        const animal = currentColorArrangement[columnOfThree[0]]
        columnOfThree.forEach(square => currentColorArrangement[square] = blank)
        return {
          squares: match,
          animal: animal
        }
      }
    }
  }, [currentColorArrangement])

  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      const isBlank = currentColorArrangement[i] === blank

      if (notValid.includes(i)) continue

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3)
        const match = rowOfThree
        const animal = currentColorArrangement[rowOfThree[0]]
        rowOfThree.forEach(square => currentColorArrangement[square] = blank)
        return {
          squares: match,
          animal: animal
        }
      }
    }
  }, [currentColorArrangement])

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColorArrangement[i] = candyColors[randomNumber]
      }

      if ((currentColorArrangement[i + width]) === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = blank
      }
    }
  }, [currentColorArrangement])

  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }
  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)
  }
  const dragEnd = () => {
    if (!squareBeingDragged || !squareBeingReplaced) return

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    // Use the type key instead of src string
    const draggedType = getTileType(squareBeingDraggedId)
    const replacedType = getTileType(squareBeingReplacedId)

    // Check for urchin using the type key
    if (draggedType === urchin || replacedType === urchin) {
      if(firstTimeTryingToMatchUrchin){
        alert('Urchins must be eaten by large snapper or lobsters! Match one nearby to remove them')
        firstTimeTryingToMatchUrchin = false
      } else {
        displayMessage('Urchins must be eaten by large snapper or lobsters!')
      }
      return false
    }

    currentColorArrangement[squareBeingReplacedId] = draggedType
    currentColorArrangement[squareBeingDraggedId] = replacedType

    const validMoves = nearbyIds(squareBeingDraggedId)
    const validMove = validMoves.includes(squareBeingReplacedId)

    if (squareBeingReplacedId &&
      validMove &&
      matchFound()) {
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    } else {
      currentColorArrangement[squareBeingReplacedId] = replacedType
      currentColorArrangement[squareBeingDraggedId] = draggedType
      setCurrentColorArrangement([...currentColorArrangement])
    }
  }

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    const id = parseInt(e.target.getAttribute('data-id'))
    setTouchStartId(id)
    setTouchDragImage(currentColorArrangement[id])
    setIsTouchDragging(true)
    // Set initial position
    if (e.touches && e.touches.length > 0) {
      setTouchDragPos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      })
    }
  }

  const handleTouchMove = (e) => {
    // Prevent scrolling while swiping
    e.preventDefault()
    const touch = e.touches[0]
    setTouchDragPos({
      x: touch.clientX,
      y: touch.clientY
    })
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (element && element.hasAttribute('data-id')) {
      const id = parseInt(element.getAttribute('data-id'))
      setTouchEndId(id)
    }
  }

  const handleTouchEnd = () => {
    setIsTouchDragging(false)
    setTouchDragImage(null)
    if (touchStartId !== null && touchEndId !== null && touchStartId !== touchEndId) {
      // Simulate drag and drop
      const squareBeingDragged = {
        getAttribute: (attr) => {
          if (attr === 'data-id') return touchStartId
          if (attr === 'src') return currentColorArrangement[touchStartId]
        }
      }
      const squareBeingReplaced = {
        getAttribute: (attr) => {
          if (attr === 'data-id') return touchEndId
          if (attr === 'src') return currentColorArrangement[touchEndId]
        }
      }
      // Set these as state and call dragEnd logic
      setSquareBeingDragged(squareBeingDragged)
      setSquareBeingReplaced(squareBeingReplaced)
      // Call dragEnd after state updates
      setTimeout(() => {
        dragEndTouch(squareBeingDragged, squareBeingReplaced)
        setTouchStartId(null)
        setTouchEndId(null)
      }, 0)
    } else {
      setTouchStartId(null)
      setTouchEndId(null)
    }
  }

  // Separate dragEnd logic for touch to avoid using DOM nodes
  const dragEndTouch = (dragged, replaced) => {
    const squareBeingDraggedId = parseInt(dragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(replaced.getAttribute('data-id'))

    const draggedType = getTileType(squareBeingDraggedId)
    const replacedType = getTileType(squareBeingReplacedId)

    if (draggedType === urchin || replacedType === urchin) {
      if(firstTimeTryingToMatchUrchin){
        alert('Urchins must be eaten by large snapper or lobsters! Match one nearby to remove them')
        firstTimeTryingToMatchUrchin = false
      } else {
        displayMessage('Urchins must be eaten by large snapper or lobsters!')
      }
      return false
    }

    currentColorArrangement[squareBeingReplacedId] = draggedType
    currentColorArrangement[squareBeingDraggedId] = replacedType

    const validMoves = nearbyIds(squareBeingDraggedId)
    const validMove = validMoves.includes(squareBeingReplacedId)

    if (squareBeingReplacedId &&
      validMove &&
      matchFound()) {
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    } else {
      currentColorArrangement[squareBeingReplacedId] = replacedType
      currentColorArrangement[squareBeingDraggedId] = draggedType
      setCurrentColorArrangement([...currentColorArrangement])
    }
  }

  // Helper to get the type key from a tile index
  const getTileType = (index) => {
    // Find the key in candyImageMap that matches the image src at this index
    // Since currentColorArrangement[index] is the image import (e.g. snapper), just return it
    return currentColorArrangement[index]
  }

  const nearbyIds = (id) => {
    return [
      id - 1,
      id - width,
      id + 1,
      id + width
    ] 
  }

  const matchFound = () => {
    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()

    const matchCheckList = [isAColumnOfFour, isARowOfFour, isAColumnOfThree, isARowOfThree]
    let foundMatches = matchCheckList.filter(match=>match !== undefined)
    console.log(matchCheckList)
    console.log('foundMAtches:', foundMatches)
    if (foundMatches.length > 0) {
      console.log('found matches!')
      urchinNearbyCheck(foundMatches)
      console.log('finished urchin check')
      return foundMatches

    } else return false
  }

  const setCellsToBlank = (cellsArray) => {
    cellsArray.forEach(square => currentColorArrangement[square] = blank)
  }

  const urchinNearbyCheck = (foundMatches) => {
    let nearby = []
    let urchinsDestroyedThisRoundCount = 0
    foundMatches.forEach(match => {
      if (match !== undefined){
        if (match.animal.includes('lobster') || match.animal.includes('snapper'))
        match.squares.forEach(index => {
          nearby = nearbyIds(index)
          console.log(nearby)
          nearby.forEach(nearbyId => {
            const animalType = currentColorArrangement[nearbyId]
            console.log('animaltype', animalType)
            if(animalType && animalType.includes('urchin')){
              currentColorArrangement[nearbyId] = blank
              console.log('got urchin!!')
              urchinsDestroyedThisRoundCount += 1
              setScoreDisplay((score) => score + 10)
              setUrchinsDestroyed((numdes) => numdes + 1)
            }
          })
        })
      }
    })
    if (urchinsDestroyedThisRoundCount>0) {
      displayMessage(urchinsDestroyedThisRoundCount + ' urchins destroyed! Nice!')
      setUrchinAnimationTrigger(t => t + 1) // trigger animation
    }
  }

  const displayMessage = (message) => {
    setMessageBoard(message)
    setTimeout(()=>setMessageBoard(null), 2000)
  }

  const createBoard = () => {
    const randomColorArrangement = []
    for (let i = 0; i < width * width; i++) {
      let randNum = Math.floor(Math.random() * candyColors.length)
      if (randNum === candyColors.length - 1) {
        if (Math.random > 0.5){
          randNum = Math.floor(Math.random() * candyColors.length)
        }
      }
      const randomColor = candyColors[randNum]
      randomColorArrangement.push(randomColor)
    }
    setCurrentColorArrangement(randomColorArrangement)
  }

  useEffect(() => {
    createBoard()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()
      checkForColumnOfThree()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setCurrentColorArrangement([...currentColorArrangement])
    }, 100)
    return () => clearInterval(timer)
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArrangement
  ])

  // Prevent pull-to-refresh on Chrome Android
  useEffect(() => {
    const handleTouchStart = (e) => {
      // Only prevent if at the top of the page and pulling down
      if (window.scrollY === 0 && e.touches && e.touches.length === 1) {
        // Check if downward drag (dy > 0) on touchmove
        let startY = e.touches[0].clientY
        const handleTouchMove = (moveEvent) => {
          const dy = moveEvent.touches[0].clientY - startY
          if (dy > 0) {
            moveEvent.preventDefault()
          }
        }
        window.addEventListener('touchmove', handleTouchMove, { passive: false })
        const cleanup = () => {
          window.removeEventListener('touchmove', handleTouchMove)
          window.removeEventListener('touchend', cleanup)
          window.removeEventListener('touchcancel', cleanup)
        }
        window.addEventListener('touchend', cleanup)
        window.addEventListener('touchcancel', cleanup)
      }
    }
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])


  return (
    <>
      <style>{reefStyles}</style>
      <UrchinDestructionAnimation trigger={urchinAnimationTrigger} />
      {showLanding ? (
        <LandingPage onStart={() => setShowLanding(false)} />
      ) : (
        <div style={{
          minHeight: '100vh',
          minWidth: '100vw',
          position: 'relative',
          background: 'none'
        }}>
          <ReefBackgroundGradient />
          <ReefDecorSVGs />
          <div
            className="reef-game-container"
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              className="reef-game-board"
            >
              {currentColorArrangement.map((candyColor, index) => (
                <div
                  key={index}
                  data-id={index}
                  draggable={true}
                  onDragStart={dragStart}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                  onDragLeave={(e) => e.preventDefault()}
                  onDrop={dragDrop}
                  onDragEnd={dragEnd}
                  // Mobile touch events
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1/1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none'
                  }}
                >
                  {candyImageMap[candyColor]}
                </div>
              ))}
              {/* Touch drag preview image */}
              {isTouchDragging && touchDragImage && (
                <img
                  src={touchDragImage}
                  alt="drag-preview"
                  style={{
                    position: 'fixed',
                    left: touchDragPos.x - 32,
                    top: touchDragPos.y - 32,
                    width: 64,
                    height: 64,
                    pointerEvents: 'none',
                    zIndex: 1000,
                    opacity: 0.8,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                />
              )}
            </div>
            <div
              className="reef-scoreboard"
            >
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
          </div>
        </div>
      )}
    </>
  )
}

export default App

