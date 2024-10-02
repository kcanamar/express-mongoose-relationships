////////////////////////
// Setup - Import deps 
////////////////////////
const mongoose = require("./connection")

//////////////////////
// Schemas
//////////////////////
const addressSchema = new mongoose.Schema({
    street: String,
    state: String,
    zip: String
})

const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    address: addressSchema
})

//////////////////////
// Model
//////////////////////
const Person1 = mongoose.model("Person1", personSchema)

///////////////////////
// Export
///////////////////////
module.exports = Person1