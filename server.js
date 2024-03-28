const express = require("express")
const app = express()
const path = require('path')
require('dotenv').config()
const PORT = process.env.PORT

app.listen(PORT, ()=> {

    console.log(`Listening on port ${PORT}`)
}
)