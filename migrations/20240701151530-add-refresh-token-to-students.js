'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Students', 'refreshToken', {
      type: Sequelize.STRING,
      allowNull: true // Adjust allowNull as per your requirements
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Students', 'refreshToken');
  }
};

