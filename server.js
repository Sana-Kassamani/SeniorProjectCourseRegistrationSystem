
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const app = express()
const { testDatabaseConnection } = require('./TestConnection'); // Update the path
const PORT = 5055

const credentialsMiddleware = require('./middlewares/credentialsMiddleware');

// Use the credentials middleware for all routes
app.use(credentialsMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use('/transcript',  require(path.join(__dirname, 'routes', 'transcript')))
app.use('/courseOffering',  require(path.join(__dirname, 'routes', 'courseOffering')))
app.use('/registration',  require(path.join(__dirname, 'routes', 'registration')))
app.use('/courseLoad',  require(path.join(__dirname, 'routes', 'courseLoad')))
app.use('/contractSheet',  require(path.join(__dirname, 'routes', 'contractSheet')))
app.use('/credentials',  require(path.join(__dirname, 'routes', 'credentials')))
app.use(['/login', '/'], require(path.join(__dirname, 'routes', 'login')));
app.use('/main',  require(path.join(__dirname, 'routes', 'main')))

testDatabaseConnection()

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})
