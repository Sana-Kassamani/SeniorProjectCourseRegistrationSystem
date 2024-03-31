'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FacultyMembers', {
      MemberID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MemberIdentificationNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      FName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      LName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      EmailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Add unique constraint for EmailAddress
      },
      Flag: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('FacultyMembers');
  }
};
