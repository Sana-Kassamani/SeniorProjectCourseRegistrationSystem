
const fs = require('fs'); // Require the fs module
const { getStudentCredentials } = require('../controllers/credentialsController'); // Adjust the path based on your project structure

module.exports = async (req, res, next) => {
  try {
    const excludedPaths = ['/', '/login', '/logout'];

    // Check if the current path is in the excluded paths list
    if (req.path === '/' || req.path === '/login') {
      // Do nothing and continue to the next middleware or route handler
      return next();
    }
    // Read the studentIdentificationNumber from the text file
    const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim();

    const student = await getStudentCredentials(studentIdentificationNumber);

    if (!student) {
      return res.redirect('/login');
    }

    // Make the credentials available in all views
    res.locals.credentials = {
      FName: student.StudentFName,
      LName: student.StudentLName,
      ProgramName: student.ProgramName
    };

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Middleware error', err);
    res.status(500).send('Internal Server Error');
  }
};
