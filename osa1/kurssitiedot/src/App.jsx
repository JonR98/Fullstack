const App = () => {
  const Header = 'Half Stack application development'

  

  const Content = [
    {part1: 'Fundamentals of React', exercises1: 10},
    {part2: 'Using props to pass data', exercises2: 7},
    {part3: 'State of a component', exercises3: 14},
  ]
  const Total = [Content[0].exercises1 + Content[1].exercises2 + Content[2].exercises3]
  return (
    <div>
      <h1>{Header}</h1>
      
      <p>{Content[0].part1} {Content[0].exercises1}</p>
      <p>{Content[1].part2} {Content[1].exercises2}</p>
      <p>{Content[2].part3} {Content[2].exercises3}</p>
      <p>Total: {Total[0]}</p>
    </div>
  )
}
export default App