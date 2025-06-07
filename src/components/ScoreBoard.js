const ScoreBoard = ({ score }) => {
  return (
    <div className="score-board">
      <h2>Score:</h2>
      <h2>{score}</h2>
    </div>
  )
}

export default ScoreBoard