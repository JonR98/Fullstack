const express = require('express')
const app = express()

let lastRequest = null

app.use((request, response, next) => {
  if (['POST', 'DELETE'].includes(request.method)) {
    lastRequest = {
      method: request.method,
      time: new Date()
    }
  }
  next()
})
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123568"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]
const generateId = () => {
  let id

  do {
    id = Math.floor(Math.random() * 100) + 1
  } while (persons.some(person => person.id === id))

  return id
}
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  const numberExists = persons.some(person => person.number === body.number)
  if (numberExists) {
    return response.status(409).json({
      error: `The number ${body.number} is already in use`
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})
app.get('/info', (request, response) => {
  const count = persons.length
  const lastRequestText = lastRequest
    ? `${lastRequest.method} — ${new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: 'Europe/Helsinki'
      }).format(lastRequest.time)}`
    : 'No GET or POST requests yet'

  response.send(`
    <p>Phonebook has info for ${count} ${count === 1 ? 'person' : 'people'}</p>
    <p>Last GET or POST request: ${lastRequestText}</p>
  `)
})
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
