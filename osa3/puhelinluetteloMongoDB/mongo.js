const mongoose = require('mongoose')



const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const args = process.argv.slice(2)
const url = `mongodb+srv://fullstack:${encodeURIComponent(password)}@cluster0.5d3ww8r.mongodb.net/PhonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

const PeopleSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 3,
    required: true
  }
})

const People = mongoose.model('People', PeopleSchema)

const addPerson = async () => {

  mongoose.connect(url, { family: 4 })
  if (args.length === 1) {
    console.log('Phonebook:')
    const people = await People.find({})
    people.forEach(person => console.log(`${person.name} ${person.number}`))
  } else {
    new People({ name, number }).save()
    console.log(`added ${name} number ${number} to phonebook`)
  }
  mongoose.connection.close()

}

addPerson()

