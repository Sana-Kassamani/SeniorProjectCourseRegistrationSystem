const express = require('express')
const { Logout } = require('../controllers/logoutController')
const router = express.Router()

router.get('/', Logout)

module.exports = router