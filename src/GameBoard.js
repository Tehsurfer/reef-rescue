import { useEffect, useState, useCallback } from 'react'
import {
  snapper,
  lobster,
  urchin,
  kelp,
  rock,
  crab,
  blank,
  candyImageMap
} from './candyImageMap'
import ReefAlert from './ReefAlert'

const width = 8
const candyColors = [
  snapper,
  kelp,
  rock,
  crab,
  lobster,
  urchin
]

let firstTimeTryingToMatchUrchin = true

const GameBoard = ({
  timerActive,
  setTimerActive,
  actionsEnabled,
  setActionsEnabled,
  displayMessage,
  scoreDisplay,
  setScoreDisplay,
  urchinsDestroyed,
  setUrchinsDestroyed,
  setUrchinAnimationTrigger,
  onRestart,
  restartKey,
  tileOdds,
  pointsMultiplier // <-- add this prop
}) => {
  const [currentColorArrangement, setCurrentTileArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  // For mobile touch support
  const [touchStartId, setTouchStartId] = useState(null)
  const [touchEndId, setTouchEndId] = useState(null)
  // For drag preview
  const [touchDragImage, setTouchDragImage] = useState(null)
  const [touchDragPos, setTouchDragPos] = useState({ x: 0, y: 0 })
  const [isTouchDragging, setIsTouchDragging] = useState(false)
  const [reefAlert, setReefAlert] = useState(null)

  // --- Game logic ---
  const checkForColumnOfFour = useCallback(() => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4 * (pointsMultiplier || 1))
        const match = columnOfFour
        const animal = currentColorArrangement[columnOfFour[0]]
        columnOfFour.forEach(square => currentColorArrangement[square] = blank)
        return {
          squares: match,
          animal: animal
        }
      }
    }
  }, [currentColorArrangement, setScoreDisplay, pointsMultiplier])

  const checkForRowOfFour = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangement[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      const isBlank = currentColorArrangement[i] === blank

      if (notValid.includes(i)) continue

      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4 * (pointsMultiplier || 1))
        const match = rowOfFour
        const animal = currentColorArrangement[rowOfFour[0]]
        rowOfFour.forEach(square => currentColorArrangement[square] = blank)
        return {
          squares: match,
          animal: animal
        }
      }
    }
  }, [currentColorArrangement, setScoreDisplay, pointsMultiplier])

  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3 * (pointsMultiplier || 1))
        const match = columnOfThree
        const animal = currentColorArrangement[columnOfThree[0]]
        columnOfThree.forEach(square => currentColorArrangement[square] = blank)
        return {
          squares: match,
          animal: animal
        }
      }
    }
  }, [currentColorArrangement, setScoreDisplay, pointsMultiplier])

  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      const isBlank = currentColorArrangement[i] === blank

      if (notValid.includes(i)) continue

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3 * (pointsMultiplier || 1))
        const match = rowOfThree
        const animal = currentColorArrangement[rowOfThree[0]]
        rowOfThree.forEach(square => currentColorArrangement[square] = blank)
        return {
          squares: match,
          animal: animal
        }
      }
    }
  }, [currentColorArrangement, setScoreDisplay, pointsMultiplier])

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArrangement[i] === blank) {
        currentColorArrangement[i] = selectRandomTile()
      }

      if ((currentColorArrangement[i + width]) === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = blank
      }
    }
  }, [currentColorArrangement])

  // Helper to get the type key from a tile index
  const getTileType = (index) => {
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
    if (foundMatches.length > 0) {
      urchinNearbyCheck(foundMatches)
      return foundMatches
    } else return false
  }

  const urchinNearbyCheck = (foundMatches) => {
    let nearby = []
    let urchinsDestroyedThisRoundCount = 0
    foundMatches.forEach(match => {
      if (match !== undefined){
        if (match.animal.includes('lobster') || match.animal.includes('snapper'))
        match.squares.forEach(index => {
          nearby = nearbyIds(index)
          nearby.forEach(nearbyId => {
            const animalType = currentColorArrangement[nearbyId]
            if(animalType && animalType.includes('urchin')){
              currentColorArrangement[nearbyId] = blank
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
      setUrchinAnimationTrigger(t => t + 1)
    }
  }

  // --- Drag and touch handlers ---
  const dragStart = (e) => {
    if (!actionsEnabled) {
      setReefAlert('Time is up! Please start a new game.')
      return
    }
    setSquareBeingDragged(e.target)
  }
  const dragDrop = (e) => {
    if (!actionsEnabled) {
      setReefAlert('Time is up! Please start a new game.')
      return
    }
    setSquareBeingReplaced(e.target)
  }
  const dragEnd = () => {
    if (!actionsEnabled) return
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    const draggedType = getTileType(squareBeingDraggedId)
    const replacedType = getTileType(squareBeingReplacedId)

    if (draggedType === urchin || replacedType === urchin) {
      if(firstTimeTryingToMatchUrchin){
        setReefAlert('Urchins must be eaten by large snapper or lobsters! Match one nearby to remove them')
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
      setCurrentTileArrangement([...currentColorArrangement])
    }
  }

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (!actionsEnabled) {
      setReefAlert('Time is up! Please start a new game.')
      return
    }
    const id = parseInt(e.target.getAttribute('data-id'))
    setTouchStartId(id)
    setTouchDragImage(currentColorArrangement[id])
    setIsTouchDragging(true)
    if (e.touches && e.touches.length > 0) {
      setTouchDragPos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      })
    }
  }

  const handleTouchMove = (e) => {
    if (!actionsEnabled) return
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
    if (!actionsEnabled) return
    setIsTouchDragging(false)
    setTouchDragImage(null)
    if (touchStartId !== null && touchEndId !== null && touchStartId !== touchEndId) {
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
      setSquareBeingDragged(squareBeingDragged)
      setSquareBeingReplaced(squareBeingReplaced)
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

  const dragEndTouch = (dragged, replaced) => {
    const squareBeingDraggedId = parseInt(dragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(replaced.getAttribute('data-id'))

    const draggedType = getTileType(squareBeingDraggedId)
    const replacedType = getTileType(squareBeingReplacedId)

    if (draggedType === urchin || replacedType === urchin) {
      if(firstTimeTryingToMatchUrchin){
        displayMessage('Urchins must be eaten by large snapper or lobsters! Match one nearby to remove them')
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
      setCurrentTileArrangement([...currentColorArrangement])
    }
  }

  // --- Select tile from random number ---
  // Build weighted array ONCE per tileOdds
  const weightedTileArray = (() => {
    const arr = []
    const oddsArr = [
      tileOdds.snapper,
      tileOdds.kelp,
      tileOdds.rock,
      tileOdds.crab,
      tileOdds.lobster,
      tileOdds.urchin
    ]
    for (let i = 0; i < candyColors.length; ++i) {
      const count = Math.round(oddsArr[i] * 100)
      for (let j = 0; j < count; ++j) {
        arr.push(candyColors[i])
      }
    }
    return arr
  })()

  const selectRandomTile = () => {
    return weightedTileArray[Math.floor(Math.random() * weightedTileArray.length)]
  }

  // --- Board setup and game loop ---
  const createBoard = () => {
    const randomTileArrangement = []
    for (let i = 0; i < width * width; i++) {
      const randomTile = selectRandomTile()
      randomTileArrangement.push(randomTile)
    }
    setCurrentTileArrangement(randomTileArrangement)
  }

  // Remake the board when restartKey changes
  useEffect(() => {
    createBoard()
  }, [restartKey])

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()
      checkForColumnOfThree()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setCurrentTileArrangement([...currentColorArrangement])
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

  // --- Render ---
  return (
    <div className="reef-game-board">
      {reefAlert && (
        <ReefAlert message={reefAlert} onClose={() => setReefAlert(null)} />
      )}
      {currentColorArrangement.map((candyColor, index) => (
        <div
          key={index}
          data-id={index}
          draggable={true}
          onDragStart={dragStart}
          onDragOver={e => e.preventDefault()}
          onDragEnter={e => e.preventDefault()}
          onDragLeave={e => e.preventDefault()}
          onDrop={dragDrop}
          onDragEnd={dragEnd}
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
  )
}

export default GameBoard
