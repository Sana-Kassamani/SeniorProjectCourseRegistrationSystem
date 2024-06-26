
const express = require('express')
const path = require('path')
const app = express()
const { testDatabaseConnection } = require('./TestConnection'); // Update the path
const PORT = 5055


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use('/transcript',  require(path.join(__dirname, 'routes', 'transcript')))
app.use('/courseOffering',  require(path.join(__dirname, 'routes', 'courseOffering')))
app.use('/registration',  require(path.join(__dirname, 'routes', 'registration')))
app.use('/courseLoad',  require(path.join(__dirname, 'routes', 'courseLoad')))
app.use('/contractSheet',  require(path.join(__dirname, 'routes', 'contractSheet')))
app.use('/',  require(path.join(__dirname, 'routes', 'main')))


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})
