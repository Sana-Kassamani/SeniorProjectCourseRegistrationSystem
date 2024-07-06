const path = require('path');
const { sequelize } = require('../models');
const Sequelize = require('sequelize');
const contractSheetController = require(path.join(__dirname, '..', 'controllers', 'getMajorCourses'));

const {getProgram}=contractSheetController
const Semester='Spring 2025'// TODO shouldn't be hardcoded
const StudentID=1// TODO shouldn't be hardcoded


const getOfferredCourses = async () => {
    try {
        const { QueryTypes } = Sequelize;
        const program= await getProgram(StudentID);
        console.log("\n\nprogram in getProgram is ",program,"\n\n")
        const offeredSections= await sequelize.query(
        `SELECT sec.*, prereq."PrerequisiteID", crs."Credits",crs."CourseCode",crs."CourseName"
        FROM "Sections" AS sec 
        INNER JOIN "Courses" AS crs ON crs."CourseID"= sec."CourseID"
        INNER JOIN "ProgramCourses" AS pgcrs ON sec."CourseID" = pgcrs."CourseID"
        LEFT JOIN "Prerequisites" AS prereq ON pgcrs."CourseID" = prereq."CourseID"
        WHERE sec."Semester" = :semester
        AND pgcrs."ProgramID" = :programID`, {
        type: QueryTypes.SELECT,
        replacements: { semester: Semester, programID: program[0].ProgramID}
      }  );

       // Create a map to store processed sections
    const processedSectionsMap = new Map();

    offeredSections.forEach(section => {
      const key = `${section.CourseID}_${section.SectionNumber}`;
      if (!processedSectionsMap.has(key)) {
        // Initialize the section with an empty array for prerequisites
        processedSectionsMap.set(key, {
          ...section,
          prerequisites: [],
        });
      }
      // Add prerequisite if it exists
      if (section.PrerequisiteID) {
        processedSectionsMap.get(key).prerequisites.push(section.PrerequisiteID);
      }
    });

    // Convert map values back to an array of sections
    const processedSections = Array.from(processedSectionsMap.values());

    return processedSections;
    }
    catch(error){
        console.error('Error fetching offered courses:', error);
        throw error;
    }
};

module.exports = { getOfferredCourses };
