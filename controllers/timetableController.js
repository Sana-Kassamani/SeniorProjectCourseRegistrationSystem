// studentData.js
const fs = require('fs'); // Require the fs module
const db = require('../models/index'); // Adjust the path based on your project structure
const getCurrentSemester = require('./semester'); // Import the getCurrentSemester function

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

async function getStudentCourses(studentID, currentSemester) {
  try {
    const query = `
      SELECT crs."CourseCode", fm."FName", fm."LName", sec."Semester", sec."Days", sec."Time", sec."Room"
      FROM "StudentSections" ss
      INNER JOIN "Sections" sec ON ss."SectionNumber" = sec."SectionNumber" AND ss."CourseID" = sec."CourseID"
      INNER JOIN "Courses" crs ON sec."CourseID" = crs."CourseID"
      INNER JOIN "FacultyMembers" fm ON sec."InstructorID" = fm."MemberID"
      WHERE ss."StudentID" = :studentID 
        AND sec."Semester" = :currentSemester
    `;
    const studentCourses = await db.sequelize.query(query, {
      replacements: { studentID, currentSemester },
      type: db.sequelize.QueryTypes.SELECT
    });

    if (!studentCourses || studentCourses.length === 0) {
      return [];
    }

    return studentCourses;
  } catch (err) {
    console.error('Error executing query', err);
    throw err; // Re-throw the error to handle it in the caller function
  }
}

async function getStudentData(studentIdentificationNumber, currentSemester) {
  try {
    const studentID = await getStudentID(studentIdentificationNumber);
    if (!studentID) {
      console.log('Student not found');
      return [];
    }

    const studentCourses = await getStudentCourses(studentID, currentSemester);
    return studentCourses;
  } catch (err) {
    console.error('Error getting student data', err);
    throw err; // Re-throw the error to handle it in the caller function
  }
}

const getData = async (req, res) => {
  try {
    // Read the studentIdentificationNumber from the text file
    const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim();
    
    currentSemester = getCurrentSemester(); // Get the current semester dynamically from your system
    console.log(currentSemester)
    currentSemester = "Spring 2024"; // Use static semester for testing
    const data = await getStudentData(studentIdentificationNumber, currentSemester);
    
    console.log(data);
    res.render('courseLoad', { data }); // Assuming there's a corresponding EJS view file
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

module.exports = { getData };
