
const express = require('express')
const router = express.Router()
const path = require('path')
const credentialsController= require('../controllers/credentialsController');

router.route('/')
  .get(credentialsController.getData);
 

module.exports = router;