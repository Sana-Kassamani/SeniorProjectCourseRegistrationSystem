const express = require('express')
const router = express.Router()
const path = require('path')
const { getOfferedCourses } = require('../controllers/searchOffered');


// Define a route for getting offered courses
router.get('/', getOfferedCourses);

module.exports = router;