'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('StudentSections', {
    //   StudentID: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'Students', 
    //       key: 'StudentID' 
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE'
    //   },
    //   SectionID: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'Sections', 
    //       key: 'SectionNumber' 
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE'
    //   },
    //   Grade: {
    //     type: Sequelize.STRING,
    //     allowNull: true
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   }
    //});
   
    // await queryInterface.addConstraint('StudentSections', {
    //   fields: ['StudentID', 'SectionID'],
    //   type: 'primary key',
    //   name: 'studentsection_key'
    // });
    
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.removeConstraint('StudentSections', 'studentsection_key');
    // await queryInterface.dropTable('StudentSections');
  }
};