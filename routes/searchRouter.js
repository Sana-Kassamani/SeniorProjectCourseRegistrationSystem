

const express = require('express');
const router = express.Router();
const { getData } = require('../controllers/courseOfferingController'); // Adjust path based on your project structure

// GET request for searching courses
router.get('/', getData);