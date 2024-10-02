////////////////////////
// Setup - Import deps and create app object
////////////////////////
const express = require('express')
const morgan = require("morgan")

const Person1 = require("./1-1")
const { Person2, Address2 } = require('./1-M')
const { Person3, Address3 } = require("./M-M")


const app = express()
const PORT = process.env.PORT || 3001
//////////////////////
// Declare Middleware
//////////////////////
app.use(morgan("dev"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

///////////////////////
// Declare Routes and Routers 
///////////////////////

///////////////////////
// 1-1 Routes
///////////////////////
app.get("/1-1", async (req, res) => {
    const people = await Person1.find({})
    res.json(people)
})

app.get("/1-1/:id", async (req, res) => {
    let person = await Person1.findById(req.params.id)
    res.json(person)
})
app.post("/1-1/makeperson1", async (req, res) => {
    console.log(req.body)
    await Person1.create(req.body)
    res.json( await Person1.find({}))
})

app.delete("/1-1/:id", async (req, res) => {
    await Person1.findByIdAndDelete(req.params.id)
    res.json(await Person1.find({}))
})

///////////////////////
// 1-M Routes
///////////////////////

app.get("/1-M", async (req, res) => {
    // get all of the people from the DataBase
    // populate the homes array made up of refs to Address2 documents
    const people = await Person2.find({}).populate("homes")
    res.json(people)
})

app.post("/1-M/makeperson2", async (req, res) => {
    res.json( await Person2.create(req.body))
})

// New person id
// 639667b212038c48285564ea

app.post("/1-M/makeaddress2", async (req, res) => {
    res.json( await Address2.create(req.body))
})

// New address id
// 64a9b013ac9af0e6c9909f3e

app.post("/1-M/linkaddress2/:personid/:addressid", async (req, res) => {
    // get the targeted person
    const person = await Person2.findById(req.params.personid)
    // get the targeted address
    const address = await Address2.findById(req.params.addressid)
    // access the found person's homes array, and push the found address
    person.homes.push(address)
    // call the .save method to save changes
    person.save()
    // show the changes made
    res.json(person)

})

///////////////////////////
// M-M Routes
//////////////////////////

app.get("/M-M/people", async (req, res) => {
    // get all of the people from the DataBase
    // populate the homes array made up of refs to Address3 documents
    const people = await Person3.find({}).populate("homes")
    res.json(people)
})

app.get("/M-M/address", async (req, res) => {
    // get all of the addresses from the DataBase
    // populate the owners array made up of refs to Person3 documents
    const addresses = await Address3.find({}).populate("owners")
    res.json(addresses)
})

app.post("/M-M/makeperson3", async (req, res) => {
    res.json( await Person3.create(req.body))
})

// New person id
// 

app.post("/M-M/makeaddress3", async (req, res) => {
    res.json( await Address3.create(req.body))
})

// New address id
// 

app.post("/M-M/linkaddress3/:personid/:addressid", async (req, res) => {
    // get the targeted person
    const person = await Person3.findById(req.params.personid)
    // get the targeted address
    const address = await Address3.findById(req.params.addressid)
    // access the found person's homes array, and push the found address
    person.homes.push(address)
    // call the .save method to save changes
    person.save()
    //  access the found address's owners array, and push the found person
    address.owners.push(person)
    // call the .save method to save changes
    address.save()
    // show the changes made
    res.json({ person , address })

})

///////////////////////
// Custom Method appraoch
///////////////////////

app.post("/M-M/linkaddress4/:personid/:addressid", async (req, res) => {
    // destructure the request paramaters
    const { personid, addressid} = req.params
    // use a custom method decalered in the models file
    res.json( await Person3.associate(personid, addressid))
})

///////////////////////////
// Server Listener
///////////////////////////
app.listen(PORT, () => console.log(`Listening on PORT: -> ${PORT}`))