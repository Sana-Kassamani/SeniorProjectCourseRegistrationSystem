// // Middleware function to verify if the user is logged in
// const verifyLoggedIn = (req, res, next) => {
//     // // Check if the access token is stored in the session
//     if (req.session.accessToken || req.url === '/login') {
//         // User is logged in or accessing the register route, proceed to the next middleware or route handler
//         next();
//     } else {
//         // User is not logged in, redirect to the login page
//         res.render('login', { message: null });
//     }
// };


// module.exports = verifyLoggedIn;
// Middleware function to verify if the user is logged in and enforce session timeout
const verifyLoggedIn = (req, res, next) => {
    const maxSessionDuration = 60 * 60 * 1000;

    // Check if the user is logged in
    if (req.session.accessToken || req.url === '/login') {
        // Check if the login time is set in the session
        if (req.session.loginTime) {
            const sessionDuration = Date.now() - req.session.loginTime;

            // Check if the session duration exceeds the maximum allowed duration
            if (sessionDuration > maxSessionDuration) {
                // Session has expired, destroy the session and redirect to login
                req.session.destroy((err) => {
                    if (err) {
                        console.error('Error destroying session:', err);
                    }
                    return res.render('login', { message: 'Session expired. Please log in again.' });
                });
            } else {
                // Session is still valid, proceed to the next middleware or route handler
                next();
            }
        } else {
            // If loginTime is not set (possibly a new session), proceed to the next middleware or route handler
            next();
        }
    } else {
        // User is not logged in, redirect to the login page
        res.render('login', { message: null });
    }
};

module.exports = verifyLoggedIn;
