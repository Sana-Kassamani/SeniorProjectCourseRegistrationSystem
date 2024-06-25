'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Substitutables', {
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
        SubstitutableID: {
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