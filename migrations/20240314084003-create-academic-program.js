'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AcademicPrograms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProgramID: {
        type: Sequelize.INTEGER
      },
      ProgramName: {
        type: Sequelize.STRING
      },
      Degree: {
        type: Sequelize.STRING
      },
      CoreCredits: {
        type: Sequelize.INTEGER
      },
      MajorCredits: {
        type: Sequelize.INTEGER
      },
      TechnicalCredits: {
        type: Sequelize.INTEGER
      },
      ElectiveCredits: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AcademicPrograms');
  }
};