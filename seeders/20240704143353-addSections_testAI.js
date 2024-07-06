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
          CourseID: 9,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 2,
          Semester: 'Spring 2025',
          Days: 'Monday, Wednesday, Friday',
          Time: '9-10',
          Room: 'CC218',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 9,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Tuesday, Thursday',
          Time: '8-9',
          Room: 'CC123',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 4,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 2,
          Semester: 'Spring 2025',
          Days: 'Tuesday, Thursday',
          Time: '9-10',
          Room: 'CA321',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 4,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Monday, Wednesday, Friday',
          Time: '10-11',
          Room: 'CA212',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 5,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 2,
          Semester: 'Spring 2025',
          Days: 'Monday, Wednesday, Friday',
          Time: '3-4',
          Room: 'CC222',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 11,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Tuesday, Thursday',
          Time: '1-2',
          Room: 'CA231A',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 1,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          SectionNumber: 1,
          Semester: 'Spring 2025',
          Days: 'Monday, Wednesday, Friday',
          Time: '9-10',
          Room: 'CA231A',
          NbOfSeats: 20,
          Mode: 'In-Person',
          CourseID: 2,
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
        CourseID: 9,
        SectionNumber: 1,
        Semeseter:'Spring 2025'
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 9,
        SectionNumber: 2,
        Semeseter:'Spring 2025'
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 4,
        SectionNumber: 1,
        Semeseter:'Spring 2025'
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 4,
        SectionNumber: 2,
        Semeseter:'Spring 2025'
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 5,
        SectionNumber: 1,
        Semeseter:'Spring 2025'
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 11,
        SectionNumber: 2,
        Semeseter:'Spring 2025'
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 1,
        SectionNumber: 1,
        Semeseter:'Spring 2025'
      }, { transaction });

      await queryInterface.bulkDelete('Sections', {
        CourseID: 2,
        SectionNumber: 1,
        Semeseter:'Spring 2025'
      }, { transaction });

      await transaction.commit();
      
    } catch (error) {
      // If an error occurs during rollback, rollback the rollback!
      await transaction.rollback();
      console.error('Error rolling back seeding:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
};
