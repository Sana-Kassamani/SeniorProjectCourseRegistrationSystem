'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin transaction
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Update reserved to 1 for specific sections
      await queryInterface.bulkUpdate(
        'Sections',
        { reserved: 1 },
        {
          CourseID: 1,
          SectionNumber: 1,
          Semester: 'Fall 2024'
        },
        { transaction }
      );

      await queryInterface.bulkUpdate(
        'Sections',
        { reserved: 1 },
        {
          CourseID: 2,
          SectionNumber: 1,
          Semester: 'Spring 2024'
        },
        { transaction }
      );

      await queryInterface.bulkUpdate(
        'Sections',
        { reserved: 1 },
        {
          CourseID: 1,
          SectionNumber: 2,
          Semester: 'Spring 2024'
        },
        { transaction }
      );

      await queryInterface.bulkUpdate(
        'Sections',
        { reserved: 1 },
        {
          CourseID: 2,
          SectionNumber: 2,
          Semester: 'Spring 2024'
        },
        { transaction }
      );

      // Commit transaction
      await transaction.commit();
    } catch (error) {
      // Rollback transaction if any error occurs
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Begin transaction
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Set reserved to 0 for all sections
      await queryInterface.bulkUpdate(
        'Sections',
        { reserved: 0 },
        {}, // No condition, update all rows
        { transaction }
      );

      // Commit transaction
      await transaction.commit();
    } catch (error) {
      // Rollback transaction if any error occurs
      await transaction.rollback();
      throw error;
    }
  }
};
