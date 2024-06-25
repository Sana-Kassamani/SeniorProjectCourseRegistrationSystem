'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProgramCourses', {
      ProgramID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'AcademicPrograms', 
          key: 'ProgramID' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
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
      Type: {
        type: Sequelize.STRING,
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

    // Add composite primary key constraint
    await queryInterface.addConstraint('ProgramCourses', {
      fields: ['ProgramID', 'CourseID'],
      type: 'primary key',
      name: 'programcourse_key'
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ProgramCourses', 'programcourse_key');
    await queryInterface.dropTable('ProgramCourses');
  }
};