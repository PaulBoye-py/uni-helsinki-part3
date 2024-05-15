const express = require('express')
const cors = require('cors')
var morgan = require('morgan')

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

// Morgan for logging HTTP requests to console
app.use(morgan('tiny'))

// Morgan custom token
morgan.token('body', (request, response) => {
    return JSON.stringify(request.body)
}) 

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        'id': 1,
        'name': 'Arto Hellas',
        'number': '040-123456',
    },
    {
        'id': 2,
        'name': 'Ada Lovelace',
        'number': '39-44-5323523',
    },
    {
        'id': 3,
        'name': 'Dan Abramov',
        'number': '12-43-234345',
    },
    {
        'id': 4,
        'name': 'Mary Poppendieck',
        'number': '39-23-6423122',
    },
]

// Get length of Array
const entryLength = persons.length

// Get Date and Time
function getCurrentDateTime() {
    let now = new Date()
    return now.toString()
}

// Generate random IDs
function generateId() {
    const randomNumber = Math.random()

    const min = 1000
    const max = 9999

    const scaledNumber = Math.floor(randomNumber * (max - min + 1) + min);
    return scaledNumber;
}

// const randomId = generateId();
// console.log(randomId); 

// Home Page
app.get('/', (request, response) => {
    response.send('Hello')
})

// Get all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Get a specific person 
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Delete a specific person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// Add a new person
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(404).json({
            error: 'Name is missing',
        })
    } else if (!body.number) {
        return response.status(404).json({
            error: "Number is missing"
        })
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(404).json({
            error: "Name already exists!"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    // console.log(person)
    // console.log(persons)
    response.json(person)
})

app.get('/info', (request, response) => {
    response.send(
             `<p>Phonebook has info for ${entryLength} people</p>
              <p>${getCurrentDateTime()}</p>
             `       
    )
})

let PORT;

if (process.env.NODE_ENVIRONMENT) {
    PORT = 10000
} else {
    PORT = 3001
}

app.listen(PORT)
console.log(`Server running on ${PORT}`)