const db = require('../models/index');
const path = require('path') // Adjust path as needed
const fs = require('fs')
const SemesteController = require(path.join(__dirname, '..', 'controllers', 'semester'));
const searchAndRegisterController=require(path.join(__dirname, '..', 'controllers', 'searchAndRegisterController'));

const c_semester=SemesteController.getCurrentSemester()
const n_semester=searchAndRegisterController.getNextSemester()
// Helper function to get StudentID based on StudentIdentificationNumber
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
    return student ? student.StudentID : null;
  } catch (err) {
    console.error('Error executing getStudentID query', err);
    throw err;
  }
}

// Function to fetch student's transcript based on StudentID
async function getStudentTranscript(studentID, c_semester, n_semester) {
  try {
    const query = `
      SELECT crs."CourseCode", crs."Credits", ss."Grade", sec."Semester"
      FROM "StudentSections" ss
      INNER JOIN "Sections" sec ON ss."CourseID" = sec."CourseID" AND ss."SectionNumber" = sec."SectionNumber" AND sec."Semester" = ss."Semester"
      INNER JOIN "Courses" crs ON sec."CourseID" = crs."CourseID"
      WHERE ss."StudentID" = :studentID AND ss."Semester" != '${c_semester}' AND ss."Semester" != '${n_semester}'
    `;
    return await db.sequelize.query(query, {
      replacements: { studentID },
      type: db.sequelize.QueryTypes.SELECT
    });
  } catch (err) {
    console.error('Error executing getStudentTranscript query', err);
    throw err;
  }
}


// Function to calculate GPA and update database
async function calculateAndUpdateGPA(studentID) {
  try {
    // Fetch transcript data
    const transcript =   await getStudentTranscript(studentID,c_semester,n_semester);

    // Calculate GPA
    let totalCredits = 0;
    let totalQualityPoints = 0;
    transcript.forEach(course => {
      const credits = parseFloat(course.Credits);
      let gradePoint;
      switch (course.Grade.toUpperCase()) {
        case 'A': gradePoint = 4.0; break;
        case 'B': gradePoint = 3.0; break;
        case 'C': gradePoint = 2.0; break;
        case 'D': gradePoint = 1.0; break;
        case 'F': gradePoint = 0.0; break;
        default: gradePoint = 0.0; break;
        case 'A+': gradePoint = 4.0; break;
        case 'A-': gradePoint = 3.7; break;
        case 'B+': gradePoint = 3.3; break;
        case 'B-': gradePoint = 2.7; break;
        case 'C+': gradePoint = 2.3; break;
        case 'C-': gradePoint = 1.7; break;
        case 'D+': gradePoint = 1.3; break;
        case 'D-': gradePoint = 0.7; break;
      }
      totalCredits += credits;
      totalQualityPoints += credits * gradePoint;
    });

    let gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits) : 0;
    gpa = parseFloat(gpa.toFixed(2)); // Round GPA to 2 decimal places

    // Update GPA in the database
    await db.sequelize.query(`
      UPDATE "Students"
      SET "GPA" = :gpa
      WHERE "StudentID" = :studentID
    `, {
      replacements: { gpa, studentID }
    });

    return gpa;

  } catch (err) {
    console.error('Error calculating GPA:', err);
    throw err;
  }
}

// Controller function to render transcript and GPA
const getTranscript = async (req, res) => {
  try {
    const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim(); // Get studentIdentificationNumber from request parameters or use default
    const studentID = await getStudentID(studentIdentificationNumber);

    if (!studentID) {
      return res.status(404).send('Student not found');
    }

    // Calculate and update GPA
    const gpa = await calculateAndUpdateGPA(studentID);

    // Fetch transcript data
    const studentTranscript = await getStudentTranscript(studentID,c_semester,n_semester);

    res.render('transcript', { 
      data: { 
        transcript: studentTranscript, 
        gpa: gpa 
      } 
    }); // Render transcript with updated GPA
  } catch (err) {
    console.error('Error in getTranscript controller:', err);
    res.status(500).send('Server Error');
  }
};

module.exports = { getTranscript };
