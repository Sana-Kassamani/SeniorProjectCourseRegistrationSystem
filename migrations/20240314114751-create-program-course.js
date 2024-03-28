'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProgramCourses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProgramID: {
        type: Sequelize.INTEGER
      },
      CourseID: {
        type: Sequelize.INTEGER
      },
      Type: {
        type: Sequelize.STRING
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
    await queryInterface.addConstraint('ProgramCourses', ['ProgramID', 'CourseID'], {
      type: 'primary key',
      name: 'programcourse_key'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ProgramCourses', 'programcourse_key');
    await queryInterface.dropTable('ProgramCourses');
  }
};