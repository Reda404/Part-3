require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((result) => {
      res.status(201).json(result)
      mongoose.connection.close()
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

app.get('/info', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(`
    Phone book has info for ${persons.length} people <br><br> ${new Date()}
  `)
    })
    .catch((err) => next(err))
})

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
