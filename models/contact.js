const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useCreateIndex', true);

const connString = process.env.MONGO_URL 

console.log(connString)
mongoose.connect(connString,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(result => console.log("Connected to Puhelinluettelo database"))
.catch((error) => console.log(`Error connecting to Puhelinluettelo database:`,error.message))

const contactSchema = new mongoose.Schema({
    name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
    },
    number: {
      type: String,
      minlength: 8,
      required: true
    }
  })


  contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

contactSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Contact",contactSchema)