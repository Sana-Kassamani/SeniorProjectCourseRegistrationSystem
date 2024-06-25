'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Prerequisites', [
      {
        CourseID:2,
        PrerequisiteID: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
    
    await queryInterface.bulkInsert('ProgramCourses', [
      {
        ProgramID: 1,
        CourseID: 1,
        Type: 'Major', // Assuming this course is required for the program
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
    await queryInterface.bulkInsert('Sections', [
      {
        SectionNumber: 1,
        Semester: 'Spring 2024',
        Days: 'Monday, Wednesday, Friday',
        Time: '9-10',
        Room: 'CA213A',
        NbOfSeats: 30,
        Mode: 'In-Person',
        CourseID: 2, // Associate with a Course
        InstructorID: 1, // Associate with a FacultyMember
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
    
    await queryInterface.bulkInsert('StudentSections', [
      {
        StudentID: 1,
        CourseID: 2,
        SectionNumber: 1,
        Grade: 'A', // Example grade
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('StudentSections', null, {});
    await queryInterface.bulkDelete('Sections', null, {});
    await queryInterface.bulkDelete('ProgramCourses', null, {});
    await queryInterface.bulkDelete('Prerequisites', null, {});
    
  }
};
