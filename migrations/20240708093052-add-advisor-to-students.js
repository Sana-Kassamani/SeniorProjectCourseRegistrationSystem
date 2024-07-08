'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Students', 'MemberID', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'FacultyMembers', // Name of the referenced table
        key: 'MemberID' // Key in the referenced table
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Students', 'advisorId');
  }
};
