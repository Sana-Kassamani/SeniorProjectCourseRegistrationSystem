'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SectionNumber: {
        type: Sequelize.INTEGER
      },
      Semester: {
        type: Sequelize.STRING
      },
      Days: {
        type: Sequelize.STRING
      },
      Time: {
        type: Sequelize.STRING
      },
      Room: {
        type: Sequelize.STRING
      },
      NbOfSeats: {
        type: Sequelize.INTEGER
      },
      Mode: {
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

    await queryInterface.addConstraint('Sections', ['CourseId', 'SectionNumber'], {
      type: 'primary key',
      name: 'section_key'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Sections', 'section_key');
    await queryInterface.dropTable('Sections');
  }
};