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
    zip: String,
    owners: [
        {type: mongoose.Types.ObjectId, ref: "Person3"}
    ]
})

const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    homes: [
        {type: mongoose.Types.ObjectId, ref: "Address3"}
    ]
})

//////////////////////
// Model
//////////////////////
const Person3 = mongoose.model("Person3", personSchema)
const Address3 = mongoose.model("Address3", addressSchema)

///////////////////////
// Custom Methods
///////////////////////
//
Person3.associate = async (personid, addressid) => {
    // get the targeted person
    const person = await Person3.findById(personid)
    // get the targeted address
    const address = await Address3.findById(addressid)
    // access the found person's homes array, and push the found address
    person.homes.push(address)
    // call the .save method to save changes
    person.save()
    //  access the found address's owners array, and push the found person
    address.owners.push(person)
    // call the .save method to save changes
    address.save()
    // show the changes made
    return { person , address }
}
///////////////////////
// Export
///////////////////////
module.exports = { Person3, Address3 }