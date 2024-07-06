'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Sections', 'reserved', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // Update all existing rows to have reserved = 0
    await queryInterface.sequelize.query(
      'UPDATE "Sections" SET "reserved" = 0'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Sections', 'reserved');
  }
};



