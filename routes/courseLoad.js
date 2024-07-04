
const express = require('express')
const router = express.Router()
const path = require('path')

const timetableController = require('../controllers/timetableController');

router.route('/')
  .get(timetableController.getData);
 

module.exports = router;