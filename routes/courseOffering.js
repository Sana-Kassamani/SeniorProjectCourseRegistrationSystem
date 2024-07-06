const express = require('express')
const router = express.Router()
const path = require('path')
const courseOfferingController  = require('../controllers/courseOfferingController'); // Adjust path based on your project structure

// GET request for searching courses


const { getOfferedCourses } = require('../controllers/getOfferedController');

// Define a route for getting offered courses
router.get('/', getOfferedCourses);
module.exports = router;