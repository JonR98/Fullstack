import { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css'
import Notification from './components/Notification'
const baseUrl = '/api/notes'
const App = () => {
    const toggleImportanceOf = id => {
    const person = persons.find(n => n.id === id)
    const changedPerson = { ...person, important: !person.important }

    personService
      .update(id, changedPerson).then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
      })
      .catch(error => {

        setNotification({
          message: `Person '${person.name}' was already removed from server`,
          type: 'error'
        })
        setPersons(persons.filter(n => n.id !== id))
      })
  }

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (!notification) {
      return
    }

    const timeoutId = setTimeout(() => setNotification(null), 5000)
    return () => clearTimeout(timeoutId)
  }, [notification])

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const updatePerson = (person, number) => {
    if (!window.confirm(`${person.name} is already in the phonebook. Replace the old number?`)) {
      return
    }

    const updatedPerson = { ...person, number }
    axios
      .put(`http://localhost:3001/api/persons/${person.id}`, updatedPerson)
      .then(response => {
        setPersons(currentPersons =>
          currentPersons.map(currentPerson =>
            currentPerson.id === person.id ? response.data : currentPerson
          )
        )
        setNotification({
          message: `${person.name}'s number updated`,
          type: 'success'
        })
        setNewName('')
        setNewNumber('')
      })
      .catch(() => {
        alert(`Could not update ${person.name}'s number on the server.`)
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()
    const existingPerson = persons.find(
      person => person.name.toLowerCase() === name.toLowerCase()
    )

    if (existingPerson) {
      updatePerson(existingPerson, number)
      return
    }

    const person = { name, number }
    axios
      .post('http://localhost:3001/api/persons', person)
      .then(response => {
        setPersons(currentPersons => currentPersons.concat(response.data))
        setNotification({
          message: `${response.data.name} added to the phonebook`,
          type: 'success'
        })
        setNewName('')
        setNewNumber('')
      })
      .catch(() => {
        alert('The new person could not be saved to the server.')
      })
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    axios
      .delete(`http://localhost:3001/api/persons/${person.id}`)
      .then(() => {
        setPersons(currentPersons =>
          currentPersons.filter(currentPerson => currentPerson.id !== person.id)
        )
        setNotification({
          message: `${person.name} deleted from the phonebook`,
          type: 'success'
        })
      })
      .catch(() => {
        alert(`Could not delete ${person.name} from the server.`)
      })
  }

  const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/api/persons')
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
}

useEffect(hook, [])
  console.log('render', persons.length, 'persons')
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification?.message}
        type={notification?.type}
      />
      <form onSubmit={addPerson}>
        <div>
          filter shown with:{' '}
          <input
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        </div>
        <div>
          <h2>Add a new</h2>
          name: <input 
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <div>number: <input 
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map(person => (
          <li key={person.id}>
            {person.name}: {person.number}{' '}
            <button type="button" onClick={() => deletePerson(person)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

}

export default App