'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.removeConstraint('StudentSections', 'studentsection_key', { transaction });
      await queryInterface.removeConstraint('StudentSections', 'section_fk', { transaction });
      await queryInterface.removeConstraint('Sections', 'section_key', { transaction });
      
    // Add the new unique constraint (or any other constraint)
    await queryInterface.addConstraint('Sections', {
      fields: ['SectionNumber', 'CourseID','Semester'],
      type: 'primary key',
      name: 'section_key',
      transaction,
    });
    
    await queryInterface.addColumn('StudentSections', 'Semester', {
      type: Sequelize.STRING,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',}, { transaction });

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
      
      await queryInterface.removeColumn('StudentSections', 'Semester', { transaction });

      await queryInterface.removeConstraint('Sections', 'section_key', { transaction });

      await queryInterface.addConstraint('Sections', {
        fields: ['SectionNumber', 'CourseID'],
        type: 'primary key',
        name: 'section_key',
        transaction,
      });
      await queryInterface.addConstraint('StudentSections', {
        fields: ['SectionNumber', 'CourseID'],
        type: 'foreign key',
        name: 'section_fk',
        references: {
          table: 'Sections', 
          fields: ['SectionNumber', 'CourseID'] 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        transaction
      });

      await queryInterface.addConstraint('StudentSections', {
        fields: ['StudentID', 'SectionNumber', 'CourseID'],
        type: 'primary key',
        name: 'studentsection_key',
        transaction
      });
      
    } catch (error) {
      // If an error occurs during rollback, rollback the rollback!
      await transaction.rollback();
      console.error('Error rolling back seeding:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
};
