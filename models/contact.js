const mongoose = require('mongoose');

const connString = process.env.MONGO_URL

console.log(connString)
mongoose.connect(connString,{ useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
  })


  contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Contact",contactSchema)