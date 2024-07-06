// Middleware function to verify if the user is logged in
const verifyLoggedIn = (req, res, next) => {
    // // Check if the access token is stored in the session
    // if (req.session.accessToken || req.url === '/login') {
    //     // User is logged in or accessing the register route, proceed to the next middleware or route handler
    //     next();
    // } else {
    //     // User is not logged in, redirect to the login page
    //     res.render('login', { message: null });
    // }
};

module.exports = verifyLoggedIn;