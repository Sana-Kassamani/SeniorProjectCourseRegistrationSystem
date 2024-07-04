const { searchCourse } = require('./courseSearch');
const fs = require('fs');
const db = require('../models/index');

function getNextSemester() {
    const currentDate = new Date(); // Get current date
  
    // Define semester start and end dates (example rules)
    const semesterRules = [
      { name: 'Spring', startMonth: 1, startDay: 1, endMonth: 5, endDay: 31 },
      { name: 'Summer', startMonth: 6, startDay: 1, endMonth: 8, endDay: 31 },
      { name: 'Fall', startMonth: 9, startDay: 1, endMonth: 12, endDay: 31 }
      // Add more rules as needed
    ];
  
    // Find the current semester based on current date
    for (let i = 0; i < semesterRules.length; i++) {
      const rule = semesterRules[i];
      const start = new Date(currentDate.getFullYear(), rule.startMonth - 1, rule.startDay);
      const end = new Date(currentDate.getFullYear(), rule.endMonth - 1, rule.endDay);
  
      if (currentDate >= start && currentDate <= end) {
        const nextIndex = (i + 1) % semesterRules.length;
        const nextSemester = semesterRules[nextIndex];
        const nextYear = (nextIndex === 0) ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
        return `${nextSemester.name} ${nextYear}`; // Return next semester name and year
      }
    }
  
    // If no matching semester found, assume next semester is the first one in the next year
    const firstSemester = semesterRules[0];
    return `${firstSemester.name} ${currentDate.getFullYear() + 1}`;
}

const getData = async (req, res) => {
    try {
        let semester = getNextSemester(); // Ensure they match the names in your form inputs
        const courseCode = req.query.CourseCode || "";
        if (courseCode === "")
            semester = "";
        else
            semester = getNextSemester();
        
        console.log(semester);
        const data = await searchCourse(courseCode, semester);
        console.log(data);
        res.render('searchAndRegister', { data }); // Assuming there's a corresponding EJS view file
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

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

async function getCourseID(courseCode) {
    try {
        const query = `
            SELECT "CourseID"
            FROM "Courses"
            WHERE "CourseCode" = :courseCode
        `;
        const [course] = await db.sequelize.query(query, {
            replacements: { courseCode },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!course) {
            console.log('Course not found');
            return null;
        }

        return course.CourseID;
    } catch (err) {
        console.error('Error executing query', err);
        throw err; // Re-throw the error to handle it in the caller function
    }
}
///////////////////////////////////////add semester////////////////////////////////////////////////
async function registerStudentInCourse(studentID, courseID, sectionNumber) {
    try {
        const query = `
            INSERT INTO "StudentSections" ("StudentID", "CourseID", "SectionNumber", "createdAt", "updatedAt") 
            VALUES (:studentID, :courseID, :sectionNumber, NOW(), NOW())
        `;
        const result = await db.sequelize.query(query, {
            replacements: { studentID, courseID, sectionNumber },
            type: db.sequelize.QueryTypes.INSERT
        });
        console.log('Course registration saved');
        return result[0]; // Assuming the query returns the inserted row(s)
    } catch (err) {
        console.error('Error saving course registration', err);
        throw err;
    }
}


async function registerCourses(courses) {
    const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim();
    const studentID = await getStudentID(studentIdentificationNumber);

    for (const element of courses) {
        const courseID = await getCourseID(element.courseCode);
        const secNB = element.sectionNumber;
        ///////////////////////////////////////add semester////////////////////////////////////////////////
        await registerStudentInCourse(studentID, courseID, secNB);
    }

    return true; // Return true if registration is successful
}

// Function to handle course registration
const registerCoursesHandler = async (req, res) => {
    try {
        const { courses } = req.body;
        console.log(courses);
        courses.forEach(element => {
            console.log(element.courseCode);
            console.log(element.sectionNumber);
        });
        const success = await registerCourses(courses);
        if (success) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = {
    getData,
    registerCoursesHandler
};
