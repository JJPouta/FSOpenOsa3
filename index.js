const express = require("express")
const app = express()
const moment = require("moment")
const morgan = require("morgan")


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

app.use(express.json()) 
app.use(morgan("tiny",{skip: function(req,res)
    {
        if(req.method === "POST"){
            let data = JSON.stringify(res.req.body)
            console.log(data)
        }}}))


// Kaikki -> .json
app.get("/api/persons",(req,res) => res.json(persons))


// Yksittäisen kontaktin näyttäminen
app.get("/api/persons/:id",(req,res) => 
{
    const contactID = parseInt(req.params.id);
    
    const found = persons.some(person => person.id === contactID)

    if(found){
        res.status(200).json(persons.filter(person => person.id === contactID))
    }
    else{
        res.status(400).send("<h1 style='color: red'>ID not found</h1>")
    }


})

// Statustiedot ja aikaleima
app.get("/info",(req,res) => {
    
    let contactCount = persons.length;
    let timeStamp = moment().format()
    let weekday = moment().format("dddd")

    res.send(`<div>
        <p>Phonebook contains ${contactCount} contacts</p>
        <p>${weekday + " " + timeStamp}</p>
         </div>`)
    
})

// Tietojen poisto
app.delete("/api/persons/:id",(req,res) => {

    const contactID = parseInt(req.params.id);

    const found = persons.some(person => person.id === contactID)

    if(found){
        persons = persons.filter(person => person.id !== contactID)

        res.status(204).end()
    }
    else{
        res.status(400).send("<h1 style='color: red'>ID not found</h1>")
    }

})


// Uuden tiedon lisääminen
app.post("/api/persons",(req,res) => {

    const newContact = {
        "name": req.body.name,
        "number": req.body.number,
        "id": Math.floor(Math.random() * (10000 - 1) + 1)
    }

    const found = persons.some(person => person.name === newContact.name)

    if(!newContact.name || !newContact.number){
        return res.status(400).send("<h1 style='color: red'>ERROR: Name and number must contain data</h1>")
    }
    else if(found)
    {
        return res.status(409).send("<h1 style='color: red'>ERROR: Name must be unique</h1>")
    }
    else
    {
        persons.push(newContact)
        return res.json(persons)
    }
})