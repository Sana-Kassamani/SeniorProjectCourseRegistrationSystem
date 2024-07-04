const db = require('../models/index'); // Adjust the path based on your project structure

// Function to fetch StudentID based on StudentIdentificationNumber
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
    console.error('Error executing getStudentID query', err);
    throw err;
  }
}

// Function to fetch student's transcript based on StudentID
async function getStudentTranscript(studentID) {
  try {
    const query = `
      SELECT crs."CourseCode", crs."Credits", ss."Grade", sec."Semester"
      FROM "StudentSections" ss
      INNER JOIN "Sections" sec ON ss."SectionNumber" = sec."SectionNumber"
      INNER JOIN "Courses" crs ON sec."CourseID" = crs."CourseID"
      WHERE ss."StudentID" = :studentID
      
    `;
    const studentTranscript = await db.sequelize.query(query, {
      replacements: { studentID },
      type: db.sequelize.QueryTypes.SELECT
    });

    if (!studentTranscript || studentTranscript.length === 0) {
      return [];
    }

    return studentTranscript;
  } catch (err) {
    console.error('Error executing getStudentTranscript query', err);
    throw err;
  }
}

// Function to fetch student's GPA based on StudentID
async function getStudentGPA(studentID) {
  try {
    const query = `
      SELECT "GPA"
      FROM "Students"
      WHERE "StudentID" = :studentID
    `;
    const [student] = await db.sequelize.query(query, {
      replacements: { studentID },
      type: db.sequelize.QueryTypes.SELECT
    });

    if (!student) {
      console.log('Student not found');
      return null;
    }

    return student.GPA;
  } catch (err) {
    console.error('Error executing getStudentGPA query', err);
    throw err;
  }
}

// Function to fetch all necessary student data for transcript
async function getStudentData(studentIdentificationNumber) {
  try {
    const studentID = await getStudentID(studentIdentificationNumber);
    if (!studentID) {
      console.log('Student not found');
      return { studentID: null, transcript: [], gpa: null };
    }

    const studentTranscript = await getStudentTranscript(studentID);
    const gpa = await getStudentGPA(studentID);
    return { studentID, transcript: studentTranscript, gpa };
  } catch (err) {
    console.error('Error getting student data', err);
    throw err;
  }
}


const getTranscript = async (req, res) => {
  try {
    const studentIdentificationNumber = req.params.studentIdentificationNumber || '20208001'; // Get studentIdentificationNumber from request parameters or use default
    const data = await getStudentData(studentIdentificationNumber);

    res.render('transcript', { data }); // Assuming there's a corresponding EJS view file named transcript.ejs
  } catch (err) {
    console.error('Error in getTranscript controller:', err);
    res.status(500).send('Server Error');
  }
};

module.exports = { getTranscript };
