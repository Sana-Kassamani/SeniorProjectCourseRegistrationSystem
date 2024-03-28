'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Prerequisites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CourseID: {
        type: Sequelize.INTEGER
      },
      PrerequisiteID: {
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
    // Add composite primary key constraint
    await queryInterface.addConstraint('Prerequisites', ['CourseID', 'PrerequisiteID'], {
      type: 'primary key',
      name: 'prerequisite_key'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Prerequisites', 'prerequisite_key');
    await queryInterface.dropTable('Prerequisites');
  }
};