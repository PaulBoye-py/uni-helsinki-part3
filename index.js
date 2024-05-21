// require('dotenv').config(); // Load environment variables
// const express = require('express')
// const cors = require('cors')
// var morgan = require('morgan')
// const Person = require('./models/person')


// const app = express()

// app.use(cors())

// app.use(express.json())

// app.use(express.static('dist'))

// // Morgan for logging HTTP requests to console
// app.use(morgan('tiny'))

// // Morgan custom token
// morgan.token('body', (request, response) => {
//     return JSON.stringify(request.body)
// }) 

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// let persons = [
//     {
//         'id': 1,
//         'name': 'Arto Hellas',
//         'number': '040-123456',
//     },
//     {
//         'id': 2,
//         'name': 'Ada Lovelace',
//         'number': '39-44-5323523',
//     },
//     {
//         'id': 3,
//         'name': 'Dan Abramov',
//         'number': '12-43-234345',
//     },
//     {
//         'id': 4,
//         'name': 'Mary Poppendieck',
//         'number': '39-23-6423122',
//     },
// ]

// // Get length of Array
// const entryLength = persons.length

// // Get Date and Time
// function getCurrentDateTime() {
//     let now = new Date()
//     return now.toString()
// }

// // Generate random IDs
// function generateId() {
//     const randomNumber = Math.random()

//     const min = 1000
//     const max = 9999

//     const scaledNumber = Math.floor(randomNumber * (max - min + 1) + min);
//     return scaledNumber;
// }

// // const randomId = generateId();
// // console.log(randomId); 

// // Home Page
// app.get('/', (request, response) => {
//     response.send('Hello')
// })

// // Get all people
// app.get('/api/persons', (request, response) => {
//     Person.find({}).then(people => {
//         response.json(people)
//     })  
// })

// // Get a specific person 
// app.get('/api/persons/:id', (request, response) => {
//     Person.findById(request.params.id)
//         .then(person => {
//         response.json(person)
//         console.log(person)
//         })
//         .catch(error => {
//             console.log('error:', error.message)
//         })
// })

// // Delete a specific person
// app.delete('/api/persons/:id', (request, response) => {
//     Person.findByIdAndDelete(request.params.id)
//         .then(result => {
//             if (result) {
//                 response.status(204).end()
//                 console.log(result)
//             } else {
//                 console.log(result)
//                 response.status(404).send({ error: 'Person not found!'})
//             }
           
//         })
//         .catch(error => {
//             console.log(error.message)
//         })
// })

// // Add a new person
// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     if (!body.name) {
//         return response.status(404).json({
//             error: 'Name is missing',
//         })
//     } else if (!body.number) {
//         return response.status(404).json({
//             error: "Number is missing"
//         })
//     } else if (persons.some(person => person.name === body.name)) {
//         return response.status(404).json({
//             error: "Name already exists!"
//         })
//     }

//     const person = new Person ({
//         name: body.name,
//         number: body.number
//     })

//     // persons = persons.concat(person)
//     person.save()
//         .then(savedPerson => {
//         response.json(savedPerson)
//         console.log(savedPerson)
//         })
//         .catch(error => {
//             console.log('An error occured', error.message)
//         })
// })

// app.get('/info', (request, response) => {
//     response.send(
//              `<p>Phonebook has info for ${entryLength} people</p>
//               <p>${getCurrentDateTime()}</p>
//              `       
//     )
// })

// let PORT;

// if (process.env.NODE_ENVIRONMENT) {
//     PORT = 10000
// } else {
//     PORT = 3001
// }

// app.listen(PORT)
// console.log(`Server running on ${PORT}`)

require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Morgan for logging HTTP requests to console
app.use(morgan('tiny'));

// Morgan custom token
morgan.token('body', (request, response) => {
  return JSON.stringify(request.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Home Page
app.get('/', (request, response) => {
  response.send('Hello');
});

// Get all people
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => {
      response.json(people);
    })
    .catch(error => next(error));
});

// Get a specific person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

// Add a new person
app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body;
  
    if (!name) {
      return response.status(400).json({ error: 'Name is missing' });
    } else if (!number) {
      return response.status(400).json({ error: 'Number is missing' });
    }
  
    Person.findOne({ name }).then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ error: 'Name already exists!' });
      }
  
      const person = new Person({ name, number });
  
      person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error));
    });
  });

// Modify an existing person's data
// app.put('/api/persons/:id', (request, response, next) => {
//     const body = request.body

//     const person = {
//         name: body.name,
//         number: body.number
//     }

//     const id = new mongoose.Types.ObjectId(request.params.id)

//      // the { new: true } causes the updatedPerson event handler to be called with the modified note
//     Person.findByIdAndUpdate(id, person, { new: true })
//         .then(updatedPerson => {
//             response.json(updatedPerson)
//         })
//         .catch (error => next(error))

// })

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;
    const person = { name, number };

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});


// Delete a specific person
app.delete('/api/persons/:id', (request, response, next) => {
    // Had to pass the request id as a new mongoose param for it to work!
  const id = new mongoose.Types.ObjectId(request.params.id);
  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: 'Person not found!' });
      }
    })
    .catch(error => next(error));
});


// Info
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
        console.log(count)
      response.send(
        `<p>Phonebook has info for ${count} people</p>
         <p>${new Date().toString()}</p>`
      );
    })
    .catch(error => next(error));
});

// Middleware to handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// Centralized error-handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === `ValidationError`) {
    return response.status(400).send({ error: `${error.message} `})
}

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
