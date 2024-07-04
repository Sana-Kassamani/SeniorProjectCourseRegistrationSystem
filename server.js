const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const app = express()
const session = require('express-session')
const { testDatabaseConnection } = require('./TestConnection'); // Update the path
const PORT = 5055
const verifyLoggedIn = require('./middlewares/verifyLogin')
const credentialsMiddleware = require('./middlewares/credentialsMiddleware');

// session middleware
app.use(session({
    secret: process.env.SESSION_TOKEN ,
    resave: false,
    saveUninitialized: false,

}));


// Use the credentials middleware for all routes
app.use(credentialsMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.use(verifyLoggedIn)
app.use('/transcript',  require(path.join(__dirname, 'routes', 'transcript')))
app.use('/courseOffering',  require(path.join(__dirname, 'routes', 'courseOffering')))
app.use('/search',require(path.join(__dirname, 'routes', 'search')))
app.use('/searchAndRegister',require(path.join(__dirname, 'routes', 'searchAndRegister')))
app.use('/registration', require(path.join(__dirname, 'routes', 'registration')));
app.use('/courseLoad',  require(path.join(__dirname, 'routes', 'courseLoad')))
app.use('/contractSheet',  require(path.join(__dirname, 'routes', 'contractSheet')))
app.use('/credentials',  require(path.join(__dirname, 'routes', 'credentials')))
app.use(['/login', '/'], require(path.join(__dirname, 'routes', 'login')));
app.use('/main',  require(path.join(__dirname, 'routes', 'main')))
app.use('/logout',  require(path.join(__dirname, 'routes', 'logout')))
testDatabaseConnection()

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})
