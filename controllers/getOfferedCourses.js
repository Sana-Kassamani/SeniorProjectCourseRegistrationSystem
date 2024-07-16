const path = require('path');
const fs= require('fs')
const { sequelize } = require('../models');
const Sequelize = require('sequelize');
const { QueryTypes } = Sequelize;
const contractSheetController = require(path.join(__dirname, '..', 'controllers', 'getMajorCourses'));
const {getProgram}=contractSheetController
const {getStudentID}= require(path.join(__dirname,'..','controllers','timetableController'));
const Semester='Fall 2024'// TODO shouldn't be hardcoded



const getOfferredCourses = async () => {
    try {
      
      const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim();
      const StudentID= await getStudentID(studentIdentificationNumber);
      const program= await getProgram(StudentID);
      // console.log("\n\nprogram in getProgram is ",program,"\n\n")

    // Convert map values back to an array of sections
    const processedSections = await getAllOfferedCourses()
    const processedSectionsInProgram = processedSections.filter(section => section.ProgramID.includes(program[0].ProgramID))
    return processedSectionsInProgram;
    }
    catch(error){
        console.error('Error fetching offered courses:', error);
        throw error;
    }
};
const getAllOfferedCourses = async ()=>{
  try{ 
    const offeredSections= await sequelize.query(
    `SELECT sec.*, prereq."PrerequisiteID", crs."Credits",crs."CourseCode",crs."CourseName", fac."FName", fac."LName",fac."MemberID", pgcrs."ProgramID"
    FROM "Sections" AS sec 
    INNER JOIN "Courses" AS crs ON crs."CourseID"= sec."CourseID"
    INNER JOIN "FacultyMembers" AS fac ON sec."InstructorID" = fac."MemberID"
    INNER JOIN "ProgramCourses" AS pgcrs ON sec."CourseID" = pgcrs."CourseID"
    LEFT JOIN "Prerequisites" AS prereq ON pgcrs."CourseID" = prereq."CourseID"
    WHERE sec."Semester" = :semester`, {
    type: QueryTypes.SELECT,
    replacements: { semester: Semester}
  }  );

  // Create a map to store processed sections
  const processedSectionsMap = new Map();

  offeredSections.forEach(section => {
    const key = `${section.CourseID}_${section.SectionNumber}_${section.Semester}`;
    if (!processedSectionsMap.has(key)) {
      const { ProgramID, ...sectionAttributes } = section; // Destructure to exclude programID
      // Initialize the section with an empty array for prerequisites
      processedSectionsMap.set(key, {
        ...sectionAttributes,
        ProgramID: [],
        prerequisites: [],
      });
    }
  // Add prerequisite if it exists
  if (section.PrerequisiteID) {
    processedSectionsMap.get(key).prerequisites.push(section.PrerequisiteID);
  }
  if(section.ProgramID)
  {
    processedSectionsMap.get(key).ProgramID.push(section.ProgramID)
  }
});

// Convert map values back to an array of sections
const processedSections = Array.from(processedSectionsMap.values());
// console.log(processedSections)
  return processedSections
}
catch(error){
  console.error('Error fetching all offered courses:', error);
  throw error;
}
  
}
module.exports = { getOfferredCourses, getAllOfferedCourses };
