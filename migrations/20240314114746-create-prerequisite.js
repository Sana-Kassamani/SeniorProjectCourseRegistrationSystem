'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Prerequisites', {
      CourseID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses', 
          key: 'CourseID' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      PrerequisiteID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses', 
          key: 'CourseID' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.addConstraint('Prerequisites', {
      fields: ['CourseID', 'PrerequisiteID'],
      type: 'primary key',
      name: 'prerequisite_key'
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Prerequisites', 'prerequisite_key');
    await queryInterface.dropTable('Prerequisites');
  }
};