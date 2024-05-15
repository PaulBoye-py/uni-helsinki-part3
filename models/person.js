const mongoose = require('mongoose')
require('dotenv').config(); // Load environment variables

// const password = process.argv[2]
// const name = process.argv[3]
// const number = process.argv[4]

// Connect to Mongo
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Connection error', error.message)
    })

// Person Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// Modify personSchema
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Person Model
module.exports =  mongoose.model('Person', personSchema)