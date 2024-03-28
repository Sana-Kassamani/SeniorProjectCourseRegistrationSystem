'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Substitutables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CourseID: {
        type: Sequelize.INTEGER
      },
      SubstitutableID: {
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
    await queryInterface.addConstraint('Substitutables', {
      fields: ['CourseID', 'SubstitutableID'],
      type: 'primary key',
      name: 'substitutable_key'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Substitutables', 'substitutable_key');
    await queryInterface.dropTable('Substitutables');
  }
};