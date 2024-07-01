const express = require('express');
const path = require('path');
const loginController = require(path.join('..', 'controllers', 'loginController'));
const router = express.Router();

// Route to display the login page
router.get('/', (req, res) => {
    res.render('login', { message: '' });
});

// Route to handle login form submission
router.post('/', loginController.loginUser);

module.exports = router;
