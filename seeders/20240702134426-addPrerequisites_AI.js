'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert('Prerequisites', [
        {
          CourseID:10,
          PrerequisiteID: 9,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseID:12,
          PrerequisiteID: 11,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseID:13,
          PrerequisiteID: 12,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseID:14,
          PrerequisiteID: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseID:15,
          PrerequisiteID: 14,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseID:16,
          PrerequisiteID:2 ,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseID:16,
          PrerequisiteID: 8,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], { transaction });
      
      await queryInterface.bulkInsert('ProgramCourses', [
        {
          ProgramID: 1,
          CourseID: 8,
          Type: 'Core', // Assuming this course is required for the program
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ProgramID: 1,
          CourseID: 9,
          Type: 'Core', // Assuming this course is required for the program
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ProgramID: 1,
          CourseID: 10 ,
          Type: 'Core', // Assuming this course is required for the program
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ProgramID: 1,
          CourseID: 11,
          Type: 'Core', // Assuming this course is required for the program
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          ProgramID: 1,
          CourseID: 12 ,
          Type: 'Major', // Assuming this course is required for the program
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ProgramID: 1,
          CourseID: 13,
          Type: 'Major', // Assuming this course is required for the program
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ProgramID: 1,
          CourseID: 14,
          Type: 'Major', // Assuming this course is required for the program
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          ProgramID: 1,
          CourseID: 15,
          Type: 'Major', // Assuming this course is required for the program
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ProgramID: 1,
          CourseID: 16,
          Type: 'Major', // Assuming this course is required for the program
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {transaction})

      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // If an error occurs, rollback the transaction
      await transaction.rollback();
      console.error('Error seeding data:', error);
      throw error; // re-throw the error to handle it upstream
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Begin a transaction for rollback
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('ProgramCourses', {
        ProgramID: 1,
        CourseID: 8
      }, { transaction });
      await queryInterface.bulkDelete('ProgramCourses', {
        ProgramID: 1,
        CourseID: 9
      }, { transaction });
      await queryInterface.bulkDelete('ProgramCourses', {
        ProgramID: 1,
        CourseID: 10
      }, { transaction });
      await queryInterface.bulkDelete('ProgramCourses', {
        ProgramID: 1,
        CourseID: 11
      }, { transaction });
      await queryInterface.bulkDelete('ProgramCourses', {
        ProgramID: 1,
        CourseID: 12
      }, { transaction });
      await queryInterface.bulkDelete('ProgramCourses', {
        ProgramID: 1,
        CourseID: 13
      }, { transaction });
      await queryInterface.bulkDelete('ProgramCourses', {
        ProgramID: 1,
        CourseID: 14
      }, { transaction });
      await queryInterface.bulkDelete('ProgramCourses', {
        ProgramID: 1,
        CourseID: 15
      }, { transaction });
      await queryInterface.bulkDelete('ProgramCourses', {
        ProgramID: 1,
        CourseID: 16
      }, { transaction });

      await queryInterface.bulkDelete('Prerequisites', {
        CourseID: 10,
        PrerequisiteID: 9
      }, { transaction });

      await queryInterface.bulkDelete('Prerequisites', {
        CourseID: 12,
        PrerequisiteID: 11
      }, { transaction });

      await queryInterface.bulkDelete('Prerequisites', {
        CourseID: 13,
        PrerequisiteID: 12
      }, { transaction });

      await queryInterface.bulkDelete('Prerequisites', {
        CourseID: 14,
        PrerequisiteID: 2
      }, { transaction });

      await queryInterface.bulkDelete('Prerequisites', {
        CourseID: 15,
        PrerequisiteID: 14
      }, { transaction });

      await queryInterface.bulkDelete('Prerequisites', {
        CourseID: 16,
        PrerequisiteID: 2
      }, { transaction });

      await queryInterface.bulkDelete('Prerequisites', {
        CourseID: 16,
        PrerequisiteID: 8
      }, { transaction });

      
    } catch (error) {
      // If an error occurs during rollback, rollback the rollback!
      await transaction.rollback();
      console.error('Error rolling back seeding:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
};
