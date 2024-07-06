'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {

    
      await queryInterface.changeColumn(
        'StudentSections', // Replace with your actual table name
        'Semester', // Replace with your actual column name
        {
          type: Sequelize.STRING,
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',},
        { transaction }
      );

      
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
      
      

      

      // Step 3: Change Semester column to allow null values
      await queryInterface.changeColumn(
        'StudentSections', // Replace with your actual table name
        'Semester', // Replace with your actual column name
        {
          type: Sequelize.STRING,
          allowNull: true, // Set allowNull to true to allow null values again
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        { transaction }
      );
      
    } catch (error) {
      // If an error occurs during rollback, rollback the rollback!
      await transaction.rollback();
      console.error('Error rolling back seeding:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
};
