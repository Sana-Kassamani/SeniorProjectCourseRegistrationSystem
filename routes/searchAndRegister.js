const express = require('express')
const router = express.Router()
const path = require('path')
const searchAndRegisterController  = require('../controllers/searchAndRegisterController'); // Adjust path based on your project structure

// GET request for searching courses


router.route('/')
    .get(searchAndRegisterController.getData)
module.exports = router