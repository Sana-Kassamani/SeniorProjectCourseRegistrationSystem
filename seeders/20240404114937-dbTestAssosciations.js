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
      },{
        CourseID: 3,
        PrerequisiteID: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        CourseID: 4,
        PrerequisiteID: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ,
      {
        CourseID: 5,
        PrerequisiteID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        CourseID: 6,
        PrerequisiteID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], {})
    
    await queryInterface.bulkInsert('ProgramCourses', [
      {
        ProgramID: 1,
        CourseID: 1,
        Type: 'Core', // Assuming this course is required for the program
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ProgramID: 1,
        CourseID: 2,
        Type: 'Core', // Assuming this course is required for the program
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ProgramID: 1,
        CourseID: 3,
        Type: 'Major', // Assuming this course is required for the program
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ProgramID: 1,
        CourseID: 4,
        Type: 'Major', // Assuming this course is required for the program
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        ProgramID: 1,
        CourseID: 5,
        Type: 'Major', // Assuming this course is required for the program
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ProgramID: 1,
        CourseID: 6,
        Type: 'Major', // Assuming this course is required for the program
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ProgramID: 2,
        CourseID: 7,
        Type: 'Core', // Assuming this course is required for the program
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
    await queryInterface.bulkInsert('Sections', [
      {
        SectionNumber: 1,
        Semester: 'Fall 2024',
        Days: ' Tuesday, Thursday',
        Time: '10-11:30',
        Room: 'CA210',
        NbOfSeats: 22,
        Mode: 'In-Person',
        CourseID: 1, // Associate with a Course
        InstructorID: 1, // Associate with a FacultyMember
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        SectionNumber: 2,
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
        CourseID: 1,
        SectionNumber: 1,
        Grade: 'A', // Example grade
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        StudentID: 1,
        CourseID: 2,
        SectionNumber: 2,
        Grade: 'B+', // Example grade
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
