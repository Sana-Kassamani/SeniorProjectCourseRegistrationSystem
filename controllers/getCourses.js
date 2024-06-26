
// controllers/courseController.js
const { sequelize } = require('../models');
const Sequelize = require('sequelize')
// Function to get all courses from the database
const getMajorCourses = async (req, res) => {
  try {

  const { QueryTypes } = Sequelize;
  const courses = await sequelize.query('SELECT crs."CourseID", crs."CourseCode",crs."CourseName",crs."Description", prereq."PrerequisiteID" FROM "Courses" as crs ' +
      'INNER JOIN "ProgramCourses" as pcrs On crs."CourseID" = pcrs."CourseID" ' +
      'INNER JOIN "AcademicPrograms" as ap On pcrs."ProgramID" = ap."ProgramID" ' +
      'LEFT JOIN "Prerequisites" as prereq On crs."CourseID" = prereq."CourseID" ' +
      'WHERE ap."ProgramName" = \'testComputer Science\'',  {
  type: QueryTypes.SELECT,
  });
  // const dict = new Map()
  // for ( let i=0; i< courses.length; i +=1)
  //   {
  //       dict.set(courses[i],[])
  //       for ( let j=0; j< courses.length; j +=1)
  //         if (courses[j].PrerequisiteID == courses[i].CourseID)
  //           dict.get(courses[i]).push(courses[j])
  //   }
  //   console.log(dict)
  //   res.render("contractSheet", {courses: dict})
  const courseMap = new Map();
  courses.forEach(course => {
      courseMap.set(course.CourseID, {
        CourseCode: course.CourseCode,
        CourseName: course.CourseName,
        Description: course.Description,
        Prerequisites: [],
        isRoot: true

      });
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


    res.render("contractSheet", { rootCourses: rootCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.send('Error getting courses from database');
  }
};


module.exports = { getMajorCourses };


