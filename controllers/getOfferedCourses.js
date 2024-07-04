const path = require('path');
const { sequelize } = require('../models');
const Sequelize = require('sequelize');
const contractSheetController = require(path.join(__dirname, '..', 'controllers', 'getMajorCourses'));

const { getProgram } = contractSheetController;
const Semester = 'Spring 2024'; // TODO: Shouldn't be hardcoded
const StudentID = 1; // TODO: Shouldn't be hardcoded

const getOfferredCourses = async () => {
    try {
        const { QueryTypes } = Sequelize;
        const program = await getProgram(StudentID);

        if (!program || !program.length) {
            throw new Error('Program not found');
        }

        const offeredSections = await sequelize.query(
            `SELECT sec.*, crs."CourseCode", crs."CourseName", fac."FName", fac."LName", sec."Time", sec."Days", prereq."PrerequisiteID"
            FROM "Sections" AS sec
            INNER JOIN "Courses" AS crs ON sec."CourseID" = crs."CourseID"
            INNER JOIN "FacultyMembers" AS fac ON sec."InstructorID" = fac."MemberID"
            INNER JOIN "ProgramCourses" AS pgcrs ON sec."CourseID" = pgcrs."CourseID"
            LEFT JOIN "Prerequisites" AS prereq ON pgcrs."CourseID" = prereq."CourseID"
            WHERE sec."Semester" = :semester
            AND pgcrs."ProgramID" = :programID`, {
            type: QueryTypes.SELECT,
            replacements: { semester: Semester, programID: program[0].ProgramID }
        });

        const processedSections = offeredSections.map(section => ({
            ...section,
            prerequisites: section.PrerequisiteID ? [section.PrerequisiteID] : []
        }));

        return processedSections;
    } catch (error) {
        console.error('Error fetching offered courses:', error);
        throw error;
    }
};

module.exports = { getOfferredCourses };
