require('dotenv').config()
const express = require("express")
const app = express()
const moment = require("moment")
const morgan = require("morgan")
const cors = require('cors')
const Contact = require("./models/contact")



// Middlewaret
app.use(express.static(__dirname + "/build"))
app.use(cors())
app.use(express.json()) 
app.use(morgan("tiny",{skip: function(req,res)
    {
        if(req.method === "POST"){
            let data = JSON.stringify(res.req.body)
            console.log(data)
        }}}))




// Kaikki -> .json
app.get("/api/persons",(req,res,next) => 
{
    Contact.find({})
    .then(contacts => {res.json(contacts)})
    .catch(error => next(error))
}
)


// Yksittäisen kontaktin näyttäminen
app.get("/api/persons/:id",(req,res,next) => 
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
app.get("/info",(req,res,next) => {
    
    let contactCount = persons.length;
    let timeStamp = moment().format()
    let weekday = moment().format("dddd")

    res.send(`<div>
        <p>Phonebook contains ${contactCount} contacts</p>
        <p>${weekday + " " + timeStamp}</p>
         </div>`)
    
})

// Tietojen poisto
app.delete("/api/persons/:id",(req,res,next) => {

    // const contactID = parseInt(req.params.id);
    

    Contact.findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error))

    // const found = persons.some(person => person.id === contactID)

    // if(found){
    //     persons = persons.filter(person => person.id !== contactID)

    //     res.status(204).end()
    // }
    // else{
    //     res.status(400).send("<h1 style='color: red'>ID not found</h1>")
    // }

})


// Uuden tiedon lisääminen
app.post("/api/persons",(req,res,next) => {


    const newContact = new Contact({
        name: req.body.name,
        number: req.body.number
    })


    newContact.save()
    .then(savedContact => {
    console.log(`added ${req.body.name} number ${req.body.number} to phonebook`)
        res.json(savedContact)
        
    })
    .catch(error => next(error))

    // const newContact = {
    //     "name": req.body.name,
    //     "number": req.body.number,
    //     "id": Math.floor(Math.random() * (10000 - 1) + 1)
    // }

    // const found = persons.some(person => person.name === newContact.name)

    // if(!newContact.name || !newContact.number){
    //     return res.status(400).send("<h1 style='color: red'>ERROR: Name and number must contain data</h1>")
    // }
    // else if(found)
    // {
    //     return res.status(409).send("<h1 style='color: red'>ERROR: Name must be unique</h1>")
    // }
    // else
    // {
    //     persons.push(newContact)
    //     return res.json(persons)
    // }
})

const errorHandler = (error,req,res,next) => {

   res.status(500)
   res.send(`<h1 style='color: red'>Following error has occured: ${error.message}</h1>`)
   console.log(error.message)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on PORT ${PORT}`)
