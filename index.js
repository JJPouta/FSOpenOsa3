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
    const contactID = req.params.id;
    
    Contact.findById(contactID)
    .then(contact => {
        
        if(contact)
        {
            res.json(contact)
        }
        else
        {
            res.status(400).send(`<h1 style='color: red'>Unable to find ID ${contactID}</h1>`)
        }
        })
    .catch(error => next(error))

    
})

// Statustiedot ja aikaleima
app.get("/info",(req,res,next) => {
    
    // Mallien lkm
    Contact.estimatedDocumentCount().then(cnt => {

        let timeStamp = moment().format()
        let weekday = moment().format("dddd")

        res.send(`<div>
        <p>Phonebook contains ${cnt} contacts</p>
        <p>${weekday + " " + timeStamp}</p>
         </div>`)


    }).catch(error => next(error))
    
})

// Tietojen poisto
app.delete("/api/persons/:id",(req,res,next) => {

    Contact.findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error))

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

})

app.put("/api/persons/:id",(req,res,next) => {

    const contact = {
        number: req.body.number
    }

    Contact.findByIdAndUpdate(req.params.id,contact,{
        new: true})
    .then(updatedContact => res.json(updatedContact))
    .catch(error => next(error))
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
