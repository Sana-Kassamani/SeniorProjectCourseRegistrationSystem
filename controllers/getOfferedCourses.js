const path = require('path')
const { sequelize } = require('../models');
const Sequelize = require('sequelize')
const contractSheetController=require(path.join(__dirname,'..','controllers','getMajorCourses'))

const {getProgram}=contractSheetController
const Semester='Spring 2025'// TODO shouldn't be hardcoded
const StudentID=1// TODO shouldn't be hardcoded


const getOfferredCourses= async ()=>{
    try{
        const { QueryTypes } = Sequelize;
        const program= await getProgram(StudentID);
        console.log("\n\nprogram in getProgram is ",program,"\n\n")
        const offeredSections= await sequelize.query(
        `SELECT sec.*, prereq."PrerequisiteID"
        FROM "Sections" AS sec
        INNER JOIN "ProgramCourses" AS pgcrs ON sec."CourseID" = pgcrs."CourseID"
        LEFT JOIN "Prerequisites" AS prereq ON pgcrs."CourseID" = prereq."CourseID"
        WHERE sec."Semester" = :semester
        AND pgcrs."ProgramID" = :programID`, {
        type: QueryTypes.SELECT,
        replacements: { semester: Semester, programID: program[0].ProgramID}
      }  );

      const processedSections = offeredSections.map(section => ({
        ...section,
        prerequisites: []
    }));

      processedSections.forEach(section => {
        if (section.PrerequisiteID) {
          section.prerequisites.push(section.PrerequisiteID);
        }
      });

      return processedSections;
    }
    catch(error){
        console.error('Error fetching offered courses:', error);

    }
}
module.exports={getOfferredCourses};