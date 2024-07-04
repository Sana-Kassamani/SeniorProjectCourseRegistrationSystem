const express = require('express')
const router = express.Router()
const path = require('path')

const transcriptController = require('../controllers/gpaController');

router.get('/', transcriptController.getTranscript);
//const transcriptController = require('../controllers/transcriptController');

//router.get('/', transcriptController.getTranscript);


module.exports = router