const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

let persons = [
  { id: 1, name: 'Julien', number: '123-456' },
  { id: 2, name: 'Philippe', number: '123-456' },
  { id: 3, name: 'Alyson', number: '123-456' },
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

const ramdomId = () => {
  return Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', (req, res) => {
  const id = ramdomId()
  const body = req.body
  const person = {
    id,
    name: body.name,
    number: body.number,
  }

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'info missing',
    })
  } else if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: 'name bust be unique',
    })
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  persons = persons.filter((person) => person.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  res.send(`
    Phone book has info for ${persons.length} people <br><br> ${new Date()}
  `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
