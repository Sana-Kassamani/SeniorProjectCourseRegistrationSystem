const express = require('express')
const router = express.Router()
const path = require('path')
const courseOfferingController  = require('../controllers/courseOfferingController'); // Adjust path based on your project structure

// GET request for searching courses


router.route('/')
    .get(courseOfferingController.getData)
module.exports = router