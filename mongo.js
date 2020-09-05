const mongoose = require('mongoose');


const pwd = process.argv[2]

const connString = `mongodb+srv://jariadmin:${pwd}@cluster0.3rqia.azure.mongodb.net/Puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(connString,{ useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
  })

const Contact = mongoose.model("Contact",contactSchema)


// Palautetaan collectionin sisältö, jos parametreinä korkeintaan pwd
if(process.argv.length < 4)
{
    Contact.find({}).then(result => {

        result.forEach(contact => console.log(contact))

        mongoose.connection.close()
    })


}

const contactName = process.argv[3];
const contactNumber = process.argv[4];



const newContact = new Contact({
    name: contactName,
    number: contactNumber
})


newContact.save()
.then(result => {
console.log(`added ${contactName} number ${contactNumber} to phonebook`)
mongoose.connection.close()
})