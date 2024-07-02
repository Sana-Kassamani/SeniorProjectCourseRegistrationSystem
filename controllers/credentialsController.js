const db = require('../models/index'); // Adjust the path based on your project structure

async function getStudentCredentials(studentIdentificationNumber) {
  try {
    const query = `
      SELECT s."FName", s."LName", s."EmailAddress", a."ProgramName"
      FROM "Students" s
      INNER JOIN "AcademicPrograms" a ON s."ProgramID" = a."ProgramID"
      WHERE "StudentIdentificationNumber" = :studentIdentificationNumber
    `;
    const [student] = await db.sequelize.query(query, {
      replacements: { studentIdentificationNumber },
      type: db.sequelize.QueryTypes.SELECT
    });

    if (!student) {
      console.log('Student not found');
      return null;
    }

    return student;
  } catch (err) {
    console.error('Error executing query', err);
    throw err; // Re-throw the error to handle it in the caller function
  }
}
const getData = async (req, res) => {
  try {
    const studentIdentificationNumber = req.params.studentIdentificationNumber || '20208001'; // Get studentIdentificationNumber from request parameters or use default
    const data = await getStudentCredentials(studentIdentificationNumber);
    
    //console.log(data);
    res.render('credentials', { data,studentIdentificationNumber }); // Assuming there's a corresponding EJS view file
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }}

module.exports = {
  getStudentCredentials,getData 
};