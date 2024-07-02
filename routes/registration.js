const express = require('express')
const router = express.Router()
const path = require('path')
const registration =require(path.join(__dirname,'..','controllers','registration'))



router.get('/', registration.getRegistration)


module.exports = router