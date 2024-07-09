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

async function getStudentCourses(studentID, currentSemester) {
  try {
    const query = `
      SELECT crs."CourseCode", fm."FName", fm."LName", sec."Semester", sec."Days", sec."Time", crs. "Credits"
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
function getCurrentSemester() {
  const currentDate = new Date(); // Get current date

  // Define semester start and end dates (example rules)
  const semesterRules = [
    { name: 'Spring', startMonth: 1, startDay: 1, endMonth: 5, endDay: 31 },
    { name: 'Summer', startMonth: 6, startDay: 1, endMonth: 8, endDay: 31 },
    { name: 'Fall', startMonth: 9, startDay: 1, endMonth: 12, endDay: 31 }
    // Add more rules as needed
  ];

  // Find the current semester based on current date
  for (const rule of semesterRules) {
    const start = new Date(currentDate.getFullYear(), rule.startMonth - 1, rule.startDay);
    const end = new Date(currentDate.getFullYear(), rule.endMonth - 1, rule.endDay);

    if (currentDate >= start && currentDate <= end) {
      return `${rule.name} ${currentDate.getFullYear()}`; // Return semester name and year
    }
  }

  return 'Unknown'; // Return default if no matching semester found
}
const getData = async (req, res) => {
  try {
    const studentIdentificationNumber = req.params.studentIdentificationNumber || '20208001'; // Get studentIdentificationNumber from request parameters or use default
    //const currentSemester = getCurrentSemester(); // Example: Get the current semester dynamically from your system
    const currentSemester = "Spring 2024"
    const data = await getStudentData(studentIdentificationNumber, currentSemester);
    
    console.log(data);
    res.render('courseLoad', { data }); // Assuming there's a corresponding EJS view file
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

module.exports = { getData };
