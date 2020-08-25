const express = require("express")
const { request, response } = require("express")
const app = express()
const moment = require("moment")


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]




const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)

app.get("/api/persons",(req,res) => res.json(persons))

app.get("/info",(req,res) => {
    
    let contactCount = persons.length;
    let timeStamp = moment().format()
    let weekday = moment().format("dddd")

    res.send(`<div>
        <p>Phonebook contains ${contactCount} contacts</p>
        <p>${weekday + " " + timeStamp}</p>
         </div>`)
    
})

