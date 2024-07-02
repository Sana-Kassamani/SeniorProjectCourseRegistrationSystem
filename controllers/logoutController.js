const { Session } = require("express-session");

const Logout = (req, res) => {
    // Clear the session
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        // Redirect the user to the login page or any other desired page
        
        res.render('login', {message:null})
    });
};

module.exports = { Logout };