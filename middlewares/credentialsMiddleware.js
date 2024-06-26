const { getStudentCredentials } = require('../controllers/credentialsController'); // Adjust the path based on your project structure

module.exports = async (req, res, next) => {
  try {
    const studentIdentificationNumber = '20208001'; // Example student ID; you can get this from req.params or req.body
    const student = await getStudentCredentials(studentIdentificationNumber);

    if (!student) {
      console.log('Student not found');
      return res.status(404).send('Student not found');
    }

    // Make the credentials available in all views
    res.locals.credentials = {
      FName: student.FName,
      LName: student.LName,
      ProgramName:student.ProgramName
    };

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Middleware error', err);
    res.status(500).send('Internal Server Error');
  }
};
