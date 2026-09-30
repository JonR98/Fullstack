import { useState } from 'react'





const Statistics = ({ left, middle, right, total }) => {
  if (total === 0) {
    return <p>No feedback given</p>
  }
  const StatisticLine = ({ text, value }) => <div>{text} {value}</div>
  return (
    <div>
      <h2>Statistics</h2>
      <StatisticLine text="good" value={left} />
      <StatisticLine text="neutral" value={middle} />
      <StatisticLine text="bad" value={right} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={(left - right) / total} />
      <StatisticLine text="positive" value={(left / total) * 100 + '%'} />

    </div>
  )
}
const GoodButton = ({ onClick }) => <button onClick={onClick}>good</button>
const NeutralButton = ({ onClick }) => <button onClick={onClick}>neutral</button>
const BadButton = ({ onClick }) => <button onClick={onClick}>bad</button>

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [middle, setMiddle] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right + middle)
    
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
    setRight(updatedRight)
    setTotal(left + updatedRight + middle)
    
  }
  const handleMiddleClick = () => {
    setAll(allClicks.concat('M'))
    const updatedMiddle = middle + 1
    setMiddle(updatedMiddle)
    setTotal(left + right + updatedMiddle)
  }

  
  return (
    <div>
      <div>
        
        <h1>give feedback</h1>
        <GoodButton onClick={handleLeftClick} />
        <NeutralButton onClick={handleMiddleClick} />
        <BadButton onClick={handleRightClick} />
        <Statistics left={left} middle={middle} right={right} total={total} />
        
      </div>
    </div>
  )
}


export default App