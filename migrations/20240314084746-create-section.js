'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sections', {
      SectionNumber: {
        type: Sequelize.INTEGER,
        //unique:true,
        allowNull: false
      },
      Semester: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Days: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Room: {
        type: Sequelize.STRING,
        allowNull: false
      },
      NbOfSeats: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Mode: {
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
  
   
    
  },
  async down(queryInterface, Sequelize) {
    
    await queryInterface.dropTable('Sections');
  }
};


