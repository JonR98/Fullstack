const People = require('./persons')

const addPerson = async (name, number) => {
  const existingPerson = await People.findOne({ number })
  if (existingPerson) {
    return null
  }

  return new People({ name, number }).save()
}

module.exports = addPerson