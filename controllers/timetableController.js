const db = require('../models/index'); // Adjust the path based on your project structure

async function getStudentID(studentIdentificationNumber) {
  try {
    const query = `
      SELECT "StudentID"
      FROM "Students"
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

    return student.StudentID;
  } catch (err) {
    console.error('Error executing query', err);
    throw err; // Re-throw the error to handle it in the caller function
  }
}

async function getStudentCourses(studentID) {
  try {
    const query = `
      SELECT crs."CourseCode", fm."FName", fm."LName", sec."Semester", sec."Days", sec."Time"
      FROM "StudentSections" ss
      INNER JOIN "Sections" sec ON ss."SectionNumber" = sec."SectionNumber"
      INNER JOIN "Courses" crs ON ss."CourseID" = crs."CourseID"
      INNER JOIN "FacultyMembers" fm ON sec."InstructorID" = fm."MemberID"
      WHERE ss."StudentID" = :studentID
    `;
    const studentCourses = await db.sequelize.query(query, {
      replacements: { studentID },
      type: db.sequelize.QueryTypes.SELECT
    });

    if (!studentCourses || studentCourses.length === 0) {
      return [];
    }
    console.log(studentCourses)
    /////////////////////////////////////////////////
    return studentCourses;
  } catch (err) {
    console.error('Error executing query', err);
    throw err; // Re-throw the error to handle it in the caller function
  }
}

async function getStudentData(studentIdentificationNumber) {
  try {
    const studentID = await getStudentID(studentIdentificationNumber);
    if (!studentID) {
      console.log('Student not found');
      return [];
    }

    const studentCourses = await getStudentCourses(studentID);
    return studentCourses;
  } catch (err) {
    console.error('Error getting student data', err);
    throw err; // Re-throw the error to handle it in the caller function
  }
}

const getData = async (req, res) => {
  try {
    const studentIdentificationNumber = req.params.studentIdentificationNumber || '20208001'; // Get studentIdentificationNumber from request parameters or use default
    const data = await getStudentData(studentIdentificationNumber);
    console.log(data)
    ///////////////////////////////////
    res.render('courseLoad', { data }); // Assuming there's a corresponding EJS view file
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

module.exports = { getData };
