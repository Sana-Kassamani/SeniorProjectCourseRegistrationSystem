'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert('Sections', [
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Monday, Wednesday, Friday',
          Time: '8-9',
          Room: 'CA210',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 3,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 2,
          Semester: 'Spring 2025',
          Days: 'Tuesday, Thursday',
          Time: '9-10',
          Room: 'CA210',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 3,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Tuesday, Thursday',
          Time: '9-10',
          Room: 'CA210',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 8,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Tuesday, Thursday',
          Time: '10-11',
          Room: 'CA209',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 14,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Monday, Wednesday, Friday',
          Time: '10-11',
          Room: 'CA209',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 16,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Monday, Wednesday, Friday',
          Time: '11-12',
          Room: 'CA231A',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 11,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 3,
          Semester: 'Spring 2025',
          Days: 'Monday, Wednesday, Friday',
          Time: '1-2',
          Room: 'CA231A',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 2,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Tuesday, Thursday',
          Time: '2-3',
          Room: 'CA231A',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 10,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      
      
      
      

      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // If an error occurs, rollback the transaction
      await transaction.rollback();
      console.error('Error seeding data:', error);
      throw error; // re-throw the error to handle it upstream
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Begin a transaction for rollback
    const transaction = await queryInterface.sequelize.transaction();

    try {
      
      await queryInterface.bulkDelete('Sections', {
        CourseID: 3,
        SectionNumber: 1
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 3,
        SectionNumber: 2
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 8,
        SectionNumber: 1
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 14,
        SectionNumber: 1
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 16,
        SectionNumber: 1
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 11,
        SectionNumber: 1
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 2,
        SectionNumber: 3
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 10,
        SectionNumber: 1
      }, { transaction });

      
    } catch (error) {
      // If an error occurs during rollback, rollback the rollback!
      await transaction.rollback();
      console.error('Error rolling back seeding:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
};
