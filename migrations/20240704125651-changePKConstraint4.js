'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {

    
      

      await queryInterface.addConstraint('StudentSections', {
        fields: ['SectionNumber', 'CourseID','Semester'],
        type: 'foreign key',
        name: 'section_fk',
        references: {
          table: 'Sections', 
          fields: ['SectionNumber', 'CourseID','Semester'] 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        transaction
      });

      await queryInterface.addConstraint('StudentSections', {
        fields: ['StudentID', 'SectionNumber', 'CourseID','Semester'],
        type: 'primary key',
        name: 'studentsection_key',
        transaction
      });
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
      
      await queryInterface.removeConstraint('StudentSections', 'studentsection_key', { transaction });
      
      await queryInterface.removeConstraint('StudentSections', 'section_fk', { transaction });

      

      
      
    } catch (error) {
      // If an error occurs during rollback, rollback the rollback!
      await transaction.rollback();
      console.error('Error rolling back seeding:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
};
