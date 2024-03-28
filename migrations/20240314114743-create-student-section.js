'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentSections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      StudentID: {
        type: Sequelize.INTEGER
      },
      SectionID: {
        type: Sequelize.INTEGER
      },
      Grade: {
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
    await queryInterface.addConstraint('StudentSections', {
      fields: ['StudentID', 'SectionID'],
      type: 'primary key',
      name: 'studentsection__key'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('StudentSections', 'studentsection__key');
    await queryInterface.dropTable('StudentSections');
  }
};