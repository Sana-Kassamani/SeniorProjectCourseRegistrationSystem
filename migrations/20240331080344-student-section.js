'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentSections', {
      StudentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Students', 
          key: 'StudentID' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      SectionNumber: {
        type: Sequelize.INTEGER, // Assuming the type is INTEGER
        allowNull: false,
      },
      CourseID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Grade: {
        type: Sequelize.STRING,
        allowNull: true
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
   await queryInterface.addConstraint('StudentSections', {
      fields: ['SectionNumber', 'CourseID'],
      type: 'foreign key',
      name: 'section_fk',
      references: {
        table: 'Sections', 
        fields: ['SectionNumber', 'CourseID'] 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('StudentSections', {
      fields: ['StudentID', 'SectionNumber', 'CourseID'],
      type: 'primary key',
      name: 'studentsection_key'
    });
   },
    async down(queryInterface, Sequelize) {
       await queryInterface.removeConstraint('StudentSections', 'studentsection_key');
       await queryInterface.removeConstraint('StudentSections', 'section_fk');
       await queryInterface.dropTable('StudentSections');
    }
   
 
}