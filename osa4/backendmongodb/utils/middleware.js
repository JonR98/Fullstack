const logger = require('./logger')

const requestLogger = async (request, response, next) => {

  logger.info('Path:  ', request.path)
  logger.info('Method:', request.method)
  logger.info('Body:  ', request.body)
  logger.info('---')
  console.log(response.body)
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  request.token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.code === 11000) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  errorHandler,
}