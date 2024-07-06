'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {

    
    const sections = await queryInterface.sequelize.query(
      'SELECT "CourseID", "SectionNumber", "Semester" FROM "Sections"',
      { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
    );

    for (const section of sections) {
      await queryInterface.sequelize.query(
        `UPDATE "StudentSections" SET "Semester" = :semester WHERE "CourseID" = :crsID AND "SectionNumber" = :sectionNumber`,
        {
          replacements: {
            semester: section.Semester,
            crsID: section.CourseID,
            sectionNumber: section.SectionNumber
          },
          transaction
        }
      );
    }
      // Commit the transaction
      await transaction.commit(); 
      
    } catch (error) {
      // If an error occurs, rollback the transaction
      await transaction.rollback();
      console.error('Error migrating data:', error);
      throw error; // re-throw the error to handle it upstream
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Begin a transaction for rollback
    const transaction = await queryInterface.sequelize.transaction();

    try {
      
      await queryInterface.sequelize.query(
        `UPDATE "StudentSections" SET "Semester" = NULL`,
        {
          transaction
        }
      );
      
    } catch (error) {
      // If an error occurs during rollback, rollback the rollback!
      await transaction.rollback();
      console.error('Error rolling back seeding:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
};
