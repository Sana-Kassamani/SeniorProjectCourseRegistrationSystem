const express = require("express")
const app = express()
const path = require('path')
require('dotenv').config()
const PORT = process.env.PORT

// Import the testDatabaseConnection function from testConnection.js
const { testDatabaseConnection } = require('./TestConnection'); // Update the path as per your project structure

// Call the function to test the database connection
testDatabaseConnection()
app.listen(PORT, ()=> {

    console.log(`Listening on port ${PORT}`)
}
)