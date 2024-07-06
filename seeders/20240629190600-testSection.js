'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Insert Section 1 associated with Course 1
      await queryInterface.bulkInsert('Sections', [
        {
          SectionNumber: 2,
          Semester: 'Spring 2024',
          Days: 'Monday, Wednesday, Friday',
          Time: '9-10',
          Room: 'CA213A',
          NbOfSeats: 30,
          Mode: 'In-Person',
          CourseID: 1,
          InstructorID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // Insert Section 2 associated with Course 2
      await queryInterface.bulkInsert('Sections', [
        {
          SectionNumber: 1,
          Semester: 'Spring 2024',
          Days: 'Tuesday, Thursday',
          Time: '10-11',
          Room: 'CB101',
          NbOfSeats: 25,
          Mode: 'Online',
          CourseID: 2,
          InstructorID: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // Insert student into Section 1
      await queryInterface.bulkInsert('StudentSections', [
        {
          StudentID: 2,
          CourseID: 1,
          SectionNumber: 2,
          Semester: 'Spring 2024',
          Grade: 'A',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // Insert student into Section 2
      await queryInterface.bulkInsert('StudentSections', [
        {
          StudentID: 2,
          CourseID: 2,
          SectionNumber: 1,
          Semester: 'Spring 2024',
          Grade: 'A',
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
      // Example of adjusting bulkDelete to target specific rows
      await queryInterface.bulkDelete('StudentSections', {
        StudentID: 2,
        CourseID: 2,
        SectionNumber: 1,
        Semester: 'Spring 2024',// Adjust criteria based on what was inserted in `up`
      }, { transaction });

      await queryInterface.bulkDelete('StudentSections', {
        StudentID: 2,
        CourseID: 1,
        SectionNumber: 2,
        Semester: 'Spring 2024',// Adjust criteria based on what was inserted in `up`
      }, { transaction });
      // Similarly adjust for Sections table
      await queryInterface.bulkDelete('Sections', {
        SectionNumber: 1,
        CourseID: 2,
        Semester: 'Spring 2024',// Adjust criteria based on what was inserted in `up`
      }, { transaction });
      await queryInterface.bulkDelete('Sections', {
        SectionNumber: 1,
        CourseID: 2,
        Semester: 'Spring 2024',// Adjust criteria based on what was inserted in `up`
      }, { transaction });

      // Commit the transaction for rollback
      await transaction.commit();
    } catch (error) {
      // If an error occurs during rollback, rollback the rollback!
      await transaction.rollback();
      console.error('Error rolling back seeding:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
};
