const { Session } = require("express-session");
const fs = require('fs');

const Logout = (req, res) => {
  
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        fs.writeFile('userID.txt', '', (err) => {
            if (err) {
                console.log('Error erasing userID.txt:', err);
            } else {
                console.log('userID.txt content erased successfully');
            }
        });
        // Redirect the user to the login page or any other desired page
        res.render('login', { message: null });
    });
};

module.exports = { Logout };
