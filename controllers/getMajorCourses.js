
// controllers/courseController.js
const { sequelize } = require('../models');
const Sequelize = require('sequelize')

const StudentID=1
// Function to get all courses from the database
const getMajorCourses = async (req, res) => {
  try {
  const { QueryTypes } = Sequelize;
  const academicProgName= await sequelize.query('SELECT ap."ProgramName" FROM "AcademicPrograms" as ap ' +
    'INNER JOIN "Students" as std On ap."ProgramID" = std."ProgramID" ' +
    'WHERE std."StudentID" = :studentId', {
        type: QueryTypes.SELECT,
        replacements: { studentId: StudentID }
      }
    );
    console.log(academicProgName)

  const courses = await sequelize.query('SELECT crs."CourseID", crs."CourseCode",crs."CourseName",crs."Description", prereq."PrerequisiteID" FROM "Courses" as crs ' +
      'INNER JOIN "ProgramCourses" as pcrs On crs."CourseID" = pcrs."CourseID" ' +
      'INNER JOIN "AcademicPrograms" as ap On pcrs."ProgramID" = ap."ProgramID" ' +
      'LEFT JOIN "Prerequisites" as prereq On crs."CourseID" = prereq."CourseID" ' +
      'WHERE ap."ProgramName" = :programName', {
         type: QueryTypes.SELECT,
         replacements: { programName: academicProgName[0].ProgramName }
      }
    );
  
  const courseMap = new Map();
  courses.forEach(course => {
      courseMap.set(course.CourseID, {
        CourseCode: course.CourseCode,
        CourseName: course.CourseName,
        Description: course.Description,
        Prerequisites: [],
        isRoot: true,
        isAttended: false

      });
    });
    attendedCourses=await getCoursesAttended()
    console.log(attendedCourses)
    attendedCourses.forEach(attendedCourse => {
      const course = courseMap.get(attendedCourse.CourseID);
      if (course) {
        course.isAttended = true;
        console.log(`attended ${course.CourseID}`);
      }
    });
    courses.forEach(course => {
      if (course.PrerequisiteID) {
        const currentCourse = courseMap.get(course.PrerequisiteID);
        if (currentCourse) {
          currentCourse.Prerequisites.push(courseMap.get(course.CourseID));
          courseMap.get(course.CourseID).isRoot = false; // Not a root if it has prerequisites
        }
      }
     
    });

    // Find root courses
    const rootCourses = Array.from(courseMap.values()).filter(course => course.isRoot);

    console.log(courseMap)
    res.render("contractSheet", { rootCourses: rootCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.send('Error getting courses from database');
  }
};

const getCoursesAttended=async (req,res)=>{
  try {

    const { QueryTypes } = Sequelize;
    const coursesAttended = await sequelize.query('SELECT sec."CourseID" FROM "StudentSections" as ss ' +
        'INNER JOIN "Sections" as sec On ss."CourseID" = sec."CourseID" AND ss."SectionNumber"=sec."SectionNumber"' +
        'WHERE ss."StudentID"= :studentID', {
         type: QueryTypes.SELECT,
         replacements: { studentID: StudentID  }
      });
      return coursesAttended
    
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.send('Error getting courses from database');
    }

};
module.exports = { getMajorCourses };


