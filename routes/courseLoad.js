
const express = require('express')
const router = express.Router()
const path = require('path')

const timetableController = require('../controllers/timetableController');

router.route('/')
  .get(timetableController.getData)
  .post(timetableController.getData); // Handles POST requests as well

module.exports = router;




module.exports = router;