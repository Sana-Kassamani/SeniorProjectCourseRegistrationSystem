// controllers/courseController.js
const fs = require('fs')
const path = require('path')
const { sequelize } = require('../models');
const Sequelize = require('sequelize');
const { QueryTypes } = Sequelize;

const {getStudentID}= require(path.join(__dirname,'..','controllers','timetableController'));



// Function to get all courses from the database
const getMajorCourses = async (req, res) => {
  try {
    const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim();
    const StudentID = await getStudentID(studentIdentificationNumber);// Assume StudentID is passed as a parameter
    const academicProg = await getProgram(StudentID);
    console.log(StudentID)
    console.log(academicProg)

    const courses = await sequelize.query(
      `SELECT crs."CourseID", crs."CourseCode", crs."CourseName", crs."Description", prereq."PrerequisiteID"
       FROM "Courses" as crs
       INNER JOIN "ProgramCourses" as pcrs On crs."CourseID" = pcrs."CourseID"
       LEFT JOIN "Prerequisites" as prereq On crs."CourseID" = prereq."CourseID"
       WHERE pcrs."ProgramID" = :programId`,
      {
        type: QueryTypes.SELECT,
        replacements: { programId: academicProg[0].ProgramID }
      }
    );
    

    const courseMap = new Map();
    courses.forEach(course=> {
      const key = course.CourseID;
      if (!courseMap.has(key)) {
        // Initialize the section with an empty array for prerequisites
        courseMap.set(key, {
        CourseCode: course.CourseCode,
        CourseName: course.CourseName,
        Description: course.Description,
        RequiredBy: [],
        Prerequisites:[],
        isRoot: true,
        isAttended: false,
        isAllowed: true
        });
      }
      // Add prerequisite if it exists
      if (course.PrerequisiteID) {
        courseMap.get(key).Prerequisites.push(course.PrerequisiteID);
      }
    });
    

    const attendedCourses = await getCoursesAttended(StudentID);
    attendedCourses.forEach(attendedCourse => {
      const course = courseMap.get(attendedCourse.CourseID);
      if (course) {
        course.isAttended = true;
      }
    });

    courses.forEach(course => {
      if (course.PrerequisiteID) {
        const prerequisiteCourse = courseMap.get(course.PrerequisiteID);
        if (prerequisiteCourse) {
          prerequisiteCourse.RequiredBy.push(courseMap.get(course.CourseID));
          courseMap.get(course.CourseID).isRoot = false; // Not a root if it has prerequisites
        }
      }
    });
    courseMap.forEach(course => {
      if (!course.isAttended && course.Prerequisites.length > 0) {
        course.isAllowed = course.Prerequisites.every(prereqID => {
          const prereq = courseMap.get(prereqID);
          return prereq && prereq.isAttended;
        });
      }
    });
    
    //console.log(courseMap)
    // Find root courses
    const rootCourses = Array.from(courseMap.values()).filter(course => course.isRoot);
    
    
    res.render("contractSheet", { rootCourses: rootCourses, courseMap });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.send('Error getting courses from database');
  }
};

const getCoursesAttended = async (StudentID) => {
  try {
    const coursesAttended = await sequelize.query(
      `SELECT sec."CourseID" 
       FROM "StudentSections" as ss
       INNER JOIN "Sections" as sec On ss."CourseID" = sec."CourseID" AND ss."SectionNumber" = sec."SectionNumber"
       WHERE ss."StudentID" = :studentID`,
      {
        type: QueryTypes.SELECT,
        replacements: { studentID: StudentID }
      }
    );
    return coursesAttended;
  } catch (error) {
    console.log('Error fetching courses attended: ',error);
  }
};

const getProgram = async (StudentID) => {
  try {
    const academicProgName = await sequelize.query(
      `SELECT ap.*
       FROM "AcademicPrograms" as ap
       INNER JOIN "Students" as std On ap."ProgramID" = std."ProgramID"
       WHERE std."StudentID" = :studentId`,
      {
        type: QueryTypes.SELECT,
        replacements: { studentId: StudentID }
      }
    );
    return academicProgName;
  } catch (error) {
    console.log('Error fetching program : ', error);
  }
};

module.exports = { getMajorCourses, getCoursesAttended, getProgram};
