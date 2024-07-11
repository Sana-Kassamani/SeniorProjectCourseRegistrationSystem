'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction1 = await queryInterface.sequelize.transaction();
    const transaction2 = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint('StudentSections', 'studentsection_key', { transaction1 });
      await queryInterface.removeConstraint('StudentSections', 'section_fk', { transaction1 });
      await queryInterface.removeConstraint('Sections', 'section_key', { transaction1 });
      await transaction1.commit();
    } catch (error) {
      // If an error occurs, rollback the transaction
      await transaction1.rollback();
      console.error('Error changing column type:', error);
      throw error; // re-throw the error to handle it upstream
    }
    try{
      // Change the data type of the 'Credits' column in the 'Courses' table
      await queryInterface.changeColumn('Sections', 'SectionNumber', {
        type: Sequelize.STRING
      }, { transaction2 });
      await queryInterface.changeColumn('StudentSections', 'SectionNumber', {
        type: Sequelize.STRING
      }, { transaction2 });

      await queryInterface.addConstraint('Sections', {
        fields: ['SectionNumber', 'CourseID','Semester'],
        type: 'primary key',
        name: 'section_key',
        transaction2,
      });
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
        transaction2
      });

      await queryInterface.addConstraint('StudentSections', {
        fields: ['StudentID', 'SectionNumber', 'CourseID','Semester'],
        type: 'primary key',
        name: 'studentsection_key',
        transaction2
      });

      // Commit the transaction
      await transaction2.commit();

    }
    catch (error) {
      // If an error occurs, rollback the transaction
      await transaction2.rollback();
      console.error('Error changing column type:', error);
      throw error; // re-throw the error to handle it upstream
    }

  },

  down: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Revert the data type change of the 'Credits' column in the 'Courses' table
      
      await queryInterface.changeColumn('Sections', 'SectionNumber', {
        type: Sequelize.INTEGER
      }, { transaction });
      await queryInterface.changeColumn('StudentSections', 'SectionNumber', {
        type: Sequelize.INTEGER
      }, { transaction })

      await queryInterface.addConstraint('Sections', {
        fields: ['SectionNumber', 'CourseID','Semester'],
        type: 'primary key',
        name: 'section_key',
        transaction,
      });
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
      console.error('Error reverting column type:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
};
