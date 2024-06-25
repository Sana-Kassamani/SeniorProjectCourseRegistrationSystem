'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AcademicPrograms', {
      ProgramID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProgramName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Add unique constraint
      },
      Degree: {
        type: Sequelize.STRING,
        allowNull: false
      },
      CoreCredits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      MajorCredits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      TechnicalCredits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ElectiveCredits: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('AcademicPrograms');
  }
};
