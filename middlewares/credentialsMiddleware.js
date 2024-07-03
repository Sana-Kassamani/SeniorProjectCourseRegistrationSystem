
const fs = require('fs'); // Require the fs module
const { getStudentCredentials } = require('../controllers/credentialsController'); // Adjust the path based on your project structure

module.exports = async (req, res, next) => {
  try {
    // Read the studentIdentificationNumber from the text file
    const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim();

    const student = await getStudentCredentials(studentIdentificationNumber);

    if (!student) {
      console.log('Student not found');
      return res.status(404).send('Student not found');
    }

    // Make the credentials available in all views
    res.locals.credentials = {
      FName: student.FName,
      LName: student.LName,
      ProgramName: student.ProgramName
    };

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Middleware error', err);
    res.status(500).send('Internal Server Error');
  }
};
