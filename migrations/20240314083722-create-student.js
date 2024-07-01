'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   
    await queryInterface.createTable('Students', {
      
      StudentID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      StudentIdentificationNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      FName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      LName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      EmailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      GPA: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      Password: { // Adding Password column
        type: Sequelize.STRING, // Adjust the type as needed
        allowNull: false // Adjust as per your requirement
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
     
     
    });
  
  },
 
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Students');

  }
};
