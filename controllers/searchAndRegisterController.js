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

async function getData(req, res) {
    try {
        let semester = getNextSemester(); 
        //let semester='Spring 2025'
        const courseCode = req.query.CourseCode ;
           
        console.log(semester);
        const schedule = await searchCourse(courseCode, semester);
        console.log(schedule);
        res.render('registration', { registrationStatus: true, schedule, req }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

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
        throw err; 
    }
}

async function getCourseID(courseCode) {
    try {
        const query = `
            SELECT "CourseID"
            FROM "Courses"
            WHERE TRIM("CourseCode") = :courseCode
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
        throw err; 
    }
}

async function getStudentTranscript(studentID) {
    try {
        
        const query = `
            SELECT crs.*, ss.*
            FROM "StudentSections" ss
            INNER JOIN "Sections" sec ON ss."SectionNumber" = sec."SectionNumber" AND  ss."CourseID" = sec."CourseID" AND sec."Semester"=ss."Semester"
            INNER JOIN "Courses" crs ON sec."CourseID" = crs."CourseID"
            WHERE ss."StudentID" = :studentID AND ss."Grade" IS NOT null AND ss."Grade" <> 'F'
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

async function checkPrerequisites(studentID, courseID) {
    try {
        const studentTranscript = await getStudentTranscript(studentID);
        const query = `
            SELECT "PrerequisiteID"
            FROM "Prerequisites"
            WHERE "CourseID" = :courseID
        `;
        const prerequisites = await db.sequelize.query(query, {
            replacements: { courseID },
            type: db.sequelize.QueryTypes.SELECT
        });

        for (const prerequisite of prerequisites) {
            if (!studentTranscript.some(transcriptCourse => transcriptCourse.CourseID === prerequisite.PrerequisiteID)) {
                return false; // Prerequisite not met
            }
        }

        return true; // All prerequisites met
    } catch (err) {
        console.error('Error checking prerequisites', err);
        throw err;
    }
}
async function getCurrentlyRegisteredCourses(studentID,semester){
    const CurrentlyRegisteredCoursesQuery = `
            SELECT s."Time",s."Days"
            FROM "StudentSections" ss
            INNER JOIN "Sections" s ON ss."CourseID" = s."CourseID" AND ss."SectionNumber"=s."SectionNumber" AND ss."Semester"=s."Semester"
            WHERE ss."StudentID" = :studentID AND ss."Semester" = :semester
        `;
        const CurrentlyRegisteredTimes = await db.sequelize.query( CurrentlyRegisteredCoursesQuery, {
            replacements: { studentID, semester },
            type: db.sequelize.QueryTypes.SELECT
        });
   
    return CurrentlyRegisteredTimes
}

async function checkTimeConflict(times, registered) {
    function parseTimeRange(timeRange) {
        const [start, end] = timeRange.split('-').map(time => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes; // Convert to minutes since midnight
        });
        return { start, end };
    }

    function daysOverlap(days1, days2) {
        const daysSet1 = new Set(days1);
        const daysSet2 = new Set(days2);
        for (let day of daysSet1) {
            if (daysSet2.has(day)) return true;
        }
        return false;
    }

    // Convert the 'times' array to a more convenient format
    const newCourses = [];
    for (let i = 0; i < times.length; i += 2) {
        newCourses.push({ Time: times[i], Days: times[i + 1] });
    }

    // Check for conflicts within the new courses
    for (let i = 0; i < newCourses.length; i++) {
        const newCourseA = newCourses[i];
        const newCourseATime = parseTimeRange(newCourseA.Time);
        
        for (let j = i + 1; j < newCourses.length; j++) {
            const newCourseB = newCourses[j];
            const newCourseBTime = parseTimeRange(newCourseB.Time);

            if (daysOverlap(newCourseA.Days, newCourseB.Days)) {
                const conflict =
                    (newCourseATime.start < newCourseBTime.end && newCourseATime.start >= newCourseBTime.start) ||
                    (newCourseATime.end > newCourseBTime.start && newCourseATime.end <= newCourseBTime.end) ||
                    (newCourseATime.start <= newCourseBTime.start && newCourseATime.end >= newCourseBTime.end);

                if (conflict) {
                    req.toastr.error('time conflict detected in new courses');
                    return { success: false, message: ' time conflict detected in new courses' };
                }
            }
        }
    }

    // Check for conflicts between new courses and registered courses
    for (const newCourse of newCourses) {
        const newCourseTime = parseTimeRange(newCourse.Time);
        for (const regCourse of registered) {
            if (daysOverlap(newCourse.Days, regCourse.Days)) {
                const regCourseTime = parseTimeRange(regCourse.Time);
                const conflict =
                    (newCourseTime.start < regCourseTime.end && newCourseTime.start >= regCourseTime.start) ||
                    (newCourseTime.end > regCourseTime.start && newCourseTime.end <= regCourseTime.end) ||
                    (newCourseTime.start <= regCourseTime.start && newCourseTime.end >= regCourseTime.end);

                if (conflict) {
                    req.toastr.error('Time conflict detected with registered courses');
                    return { success: false, message: 'Time conflict detected with registered courses' };
                }
            }
        }
    }

    return { success: true, message: 'No time conflict' };
}











async function registerStudentInCourse(req, studentID, courseID, sectionNumber, semester,nbOfCredits) {
    try {
        //check if courses exceed 18
      const creditsAlreadyRegisteredQuery = `
            SELECT SUM(c."Credits") AS "TotalCredits"
            FROM "StudentSections" ss
            INNER JOIN "Courses" c ON ss."CourseID" = c."CourseID"
            WHERE ss."StudentID" = :studentID AND ss."Semester" = :semester
        `;
        const [creditsAlreadyRegistered] = await db.sequelize.query( creditsAlreadyRegisteredQuery, {
            replacements: { studentID, semester },
            type: db.sequelize.QueryTypes.SELECT
        });
        
    if ((parseInt(creditsAlreadyRegistered.TotalCredits) + parseInt(nbOfCredits))>18){
        req.toastr.error('Total number of credits greater than allowed');
        return { success: false, message: 'Total number of credits greater than allowed' };

    }

        // Check if the student is already registered for this course in the same semester
        const duplicateCheckQuery = `
            SELECT *
            FROM "StudentSections"
            WHERE "StudentID" = :studentID AND "CourseID" = :courseID  AND "Semester" = :semester
        `;
        const [existingRegistration] = await db.sequelize.query(duplicateCheckQuery, {
            replacements: { studentID, courseID, sectionNumber, semester },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (existingRegistration) {
            req.toastr.error('Already registered for this course in the same semester');
            return { success: false, message: 'Cannot register for the same course twice in the same semester' };
        }

        const prerequisitesMet = await checkPrerequisites(studentID, courseID);
        if (!prerequisitesMet) {
            req.toastr.error('Prerequisites not met');
            return { success: false, message: 'Prerequisites not met' };
        }

        // Check if seats are available
        const checkQuery = `
            SELECT "NbOfSeats", "reserved"
            FROM "Sections"
            WHERE "CourseID" = :courseID AND "SectionNumber" = :sectionNumber AND "Semester" = :semester
        `;
        const [section] = await db.sequelize.query(checkQuery, {
            replacements: { courseID, sectionNumber, semester },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!section) {
            console.log('Section not found');
            return { success: false, message: 'Section not found' };
        }

        if (section.NbOfSeats <= section.reserved) {
            req.toastr.error('No available seats');
            return { success: false, message: 'No available seats' };
        }

        return  { success: true, message: ' ' };
    } catch (err) {
        console.error('Error saving course registration', err);
        throw err;
    }
}




async function saveRegistration(req, studentID, courseID, sectionNumber, semester){
    // Register student in the course
const registerQuery = `
    INSERT INTO "StudentSections" ("StudentID", "CourseID", "SectionNumber", "Semester", "createdAt", "updatedAt") 
    VALUES (:studentID, :courseID, :sectionNumber, :semester, NOW(), NOW())
`;
await db.sequelize.query(registerQuery, {
    replacements: { studentID, courseID, sectionNumber, semester },
    type: db.sequelize.QueryTypes.INSERT
});

// Update reserved seats
const updateQuery = `
    UPDATE "Sections"
    SET "reserved" = "reserved" + 1
    WHERE "CourseID" = :courseID AND "SectionNumber" = :sectionNumber  AND "Semester" = :semester
`;
await db.sequelize.query(updateQuery, {
    replacements: { courseID, sectionNumber, semester },
    type: db.sequelize.QueryTypes.UPDATE
});

req.toastr.success('Registration successful');
return { success: true, message: 'Registration successful' };
}







async function getCredits(courseID){
    const courseCreditsQuery = `
            SELECT "Credits"
            FROM "Courses"
            WHERE "CourseID" = :courseID
        `;
        const [courseCreditsResult] = await db.sequelize.query(courseCreditsQuery, {
            replacements: { courseID },
            type: db.sequelize.QueryTypes.SELECT
        });
        if (courseCreditsResult.length === 0) {
            console.log('Course not found');
            return null;
        }

        const credits = courseCreditsResult.Credits;
        return credits;
        
    }

async function getNumberOfCredits(courses){
    let total=0;
    for (const course of courses){
      const courseID = await getCourseID(course.courseCode);
      total=  total+await getCredits(courseID)
    }
    return total;



}




async function registerCourses(courses, req) {
    const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim();
    const studentID = await getStudentID(studentIdentificationNumber);
    const semester = getNextSemester();
    const nbOfCredits=await getNumberOfCredits(courses);
   
    let times=[]
    try {

        if (courses.length==0)
            return false;
        for (const element of courses) {
            const courseID = await getCourseID(element.courseCode);
            const result = await registerStudentInCourse(req, studentID, courseID, element.sectionNumber, semester,nbOfCredits);
            times.push(element.Time,element.Days)
            if (!result.success) {
                throw new Error(result.message);
            }
        }
        console.log(times)
        const registered=await getCurrentlyRegisteredCourses( studentID,semester)
        console.log(registered)
        const timeConflictResult= await checkTimeConflict(times,registered)

        if (!timeConflictResult.success) {
            throw new Error(timeConflictResult.message);
        }
        for (const element of courses) {
            const courseID = await getCourseID(element.courseCode);
            const saveResult = await saveRegistration(req, studentID, courseID, element.sectionNumber, semester);}
        return true;

    } catch (error) {
        console.error(error);
        throw error;
    }
}











const registerCoursesHandler = async (req, res) => {
    try {
        const { courses } = req.body;
        console.log(courses);
        
        const success = await registerCourses(courses, req);
        if (success) {
            req.toastr.success('Registration successful');
        
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
       
    } catch (error) {
        console.error(error);
        req.toastr.error('Error registering courses');
        res.status(500).json({ success: false, error: error.message });
    }

};

module.exports = {
    getData,
    registerCoursesHandler,
    getNextSemester
};
