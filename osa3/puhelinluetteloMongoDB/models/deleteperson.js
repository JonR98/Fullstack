const People = require('./persons')

const deletePerson = id => People.findByIdAndDelete(id)

module.exports = deletePerson