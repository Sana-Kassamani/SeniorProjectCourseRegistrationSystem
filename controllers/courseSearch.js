const db = require('../models/index'); // Adjust path based on your project structure

// Function to execute the SQL query to search for courses by partial or full CourseCode and semester
async function searchCourse(courseCode, semester) {
    try {
        // Adjusted query to be case-insensitive and allow partial matches for CourseCode
        const query = `
            SELECT cr."CourseName", cr."Credits", sec."Days", sec."Time", sec."NbOfSeats", fm."FName", fm."LName"
            FROM "Sections" sec 
            INNER JOIN "Courses" cr ON sec."CourseID" = cr."CourseID"
            INNER JOIN "FacultyMembers" fm ON sec."InstructorID" = fm."MemberID"
            WHERE UPPER(cr."CourseCode") LIKE UPPER(:courseCode)
            AND sec."Semester" = :semester
        `;
        
        const courses = await db.sequelize.query(query, {
            replacements: { courseCode: `%${courseCode}%`, semester },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!courses || courses.length === 0) {
            console.log('Courses not found');
            return null;
        }

        return courses;
    } catch (err) {
        console.error('Error executing query', err);
        throw err; // Re-throw the error to handle it in the caller function
    }
}

module.exports = {
    searchCourse
};
