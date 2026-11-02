require('dotenv').config()
const addPerson = require('./models/addperson')
const deletePerson = require('./models/deleteperson')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const People = require('./models/persons')



const app = express()
let lastRequest = null

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error.message)
  })

const errorHandler = (error,request,response,next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)



  response.status(500).json({ error: 'internal server error' })

}
app.use(express.static('dist'))
app.use(cors())
app.use((request, response, next) => {
  if (['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
    lastRequest = { method: request.method, time: new Date() }
  }
  next()
})
app.use(express.json())
morgan.token('body', request =>
  request.method === 'POST' ? JSON.stringify(request.body) : ''
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', async (request, response, next) => {
  try {
    response.json(await People.getAll())
  } catch (error) {
    next(error)
  }
})
app.put('/api/persons/:id', (request, response, next) => {


  People.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})
app.post('/api/persons', async (request, response, next) => {
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  try {
    const person = await addPerson(name, number)
    if (!person) {
      return response.status(409).json({
        error: `The number ${number} is already in use`
      })
    }
    response.json(person)
  } catch (error) {
    next(error)
  }
})


app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await People.findById(request.params.id)
    if (!person) {
      return response.status(404).end()
    }
    response.json(person)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  try {
    const person = await People.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true }
    )
    if (!person) {
      return response.status(404).end()
    }
    response.json(person)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await deletePerson(request.params.id)
    if (!person) {
      return response.status(404).end()
    }
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.get('/info', async (request, response, next) => {
  try {
    const count = await People.countDocuments()
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
  } catch (error) {
    next(error)
  }
})

app.use((request, response) => response.status(404).json({ error: 'unknown endpoint' }))
app.use(errorHandler)

const PORT = process.env.PORT




