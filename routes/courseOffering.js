const express = require('express')
const router = express.Router()
const path = require('path')
const { getCourseOfferingForm } = require('../controllers/searchOffered');


// Define a route for getting offered courses
router.get('/', getCourseOfferingForm);


module.exports = router;