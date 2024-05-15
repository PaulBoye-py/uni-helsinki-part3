const mongoose = require('mongoose')
require('dotenv').config(); // Load environment variables

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]



// Connect to Mongo
const url = `mongodb+srv://paul:${process.env.MONGODB_PASSWORD}@persons.ezwkahe.mongodb.net/?retryWrites=true&w=majority&appName=persons`

mongoose.set('strictQuery', false)

mongoose.connect(url) 

// mongoose.connect(url)
//     .then(() => {
//         console.log('Connected to MongoDB')
//     })
//     .catch((error) => {
//         console.log('Error connecting to MongoDB', error)
//     })

// Person Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// Person Model
const Person = mongoose.model('Person', personSchema)

// Add a new Person
const addPerson = async (name, number) => {
    try {
        const person = new Person({ name, number })
        await person.save()
        console.log(`Added ${name} number ${number} to phonebook` )
    } catch (error){
        console.log('Error', error)
    }
    mongoose.connection.close()
}

const listPeople = async () => {
    try {
        const people = await Person.find({})
        console.log('phonebook:')
        people.forEach(person => console.log(`${person.name} ${person.number}`))
    } catch (error) {
        console.log('Error listing people', error)
    }
    mongoose.connection.close()
}

const accessMongo = async () => {
    if (!password) {
        console.log('Input a password')
        return
    }
    
    if (password !== process.env.MONGODB_PASSWORD) {
        console.log('Incorrect password')
        return
    }
    
    if (!name && !number) {
        await listPeople()
        return
    }
    await addPerson(name, number)
}

accessMongo()



