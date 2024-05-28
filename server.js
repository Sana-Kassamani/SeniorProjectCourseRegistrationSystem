const express = require("express")
const app = express()
const path = require('path')
require('dotenv').config()
const PORT = process.env.PORT
app.set('view engine', 'ejs');
app.use('/transcript',  require(path.join(__dirname, 'routes', 'transcript')))
app.use('/courseOffering',  require(path.join(__dirname, 'routes', 'courseOffering')))
app.use('/registration',  require(path.join(__dirname, 'routes', 'registration')))
app.use('/courseLoad',  require(path.join(__dirname, 'routes', 'courseLoad')))
app.use('/contractSheet',  require(path.join(__dirname, 'routes', 'contractSheet')))
app.use('/',  require(path.join(__dirname, 'routes', 'main')))
app.use(express.static(path.join(__dirname, 'public')))

// Import the testDatabaseConnection function from testConnection.js
const { testDatabaseConnection } = require('./TestConnection'); // Update the path as per your project structure

// Call the function to test the database connection
testDatabaseConnection()
app.listen(PORT, ()=> {

    console.log(`Listening on port ${PORT}`)
}
)