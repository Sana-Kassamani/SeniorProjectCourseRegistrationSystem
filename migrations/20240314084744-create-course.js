'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      CourseID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CourseCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      CourseName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      Credits: {
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
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  }
};
