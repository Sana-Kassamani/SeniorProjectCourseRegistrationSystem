'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update all students to have advisorId = 2
    await queryInterface.bulkUpdate('Students', 
      { MemberID: 2 }, // New values
      {} // Condition (empty object means all rows)
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert advisorId to NULL (or original state if you know the previous state)
    await queryInterface.bulkUpdate('Students', 
      { MemberID: null }, // Reverting values
      {} // Condition (empty object means all rows)
    );
  }
};
