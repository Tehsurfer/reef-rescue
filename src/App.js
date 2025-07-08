import {useState} from 'react'
import LandingPage from './LandingPage'
import Game from './Game'

const App = () => {
  const [showLanding, setShowLanding] = useState(true)

  return (
    <>
      {showLanding ? (
        <LandingPage onStart={() => setShowLanding(false)} />
      ) : (
        <Game />
      )}
    </>
  )
}

export default App

