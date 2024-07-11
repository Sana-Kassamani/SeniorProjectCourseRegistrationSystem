'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert('Courses', [
        {
          CourseCode: 'MAT211',
          CourseName: 'Discrete Mathematics',
          Description: 'A course covering topics in discrete mathematics including logic, set theory, and combinatorics.',
          Credits: 3,
          FacultyID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseCode: 'MAT213',
          CourseName: 'Calculus 3',
          Description: 'A course covering multivariable calculus including partial derivatives and multiple integrals.',
          Credits: 3,
          FacultyID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseCode: 'MAT224',
          CourseName: 'Calculus 4',
          Description: 'A course covering advanced topics in calculus including vector calculus and differential equations.',
          Credits: 3,
          FacultyID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseCode: 'CSC219',
          CourseName: 'Digital Computer Fundamentals',
          Description: 'A course covering the basic principles of digital computer systems.',
          Credits: 3,
          FacultyID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseCode: 'CSC312',
          CourseName: 'Computer Hardware',
          Description: 'A course covering the design and functioning of computer hardware components.',
          Credits: 3,
          FacultyID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseCode: 'CSC414',
          CourseName: 'Operating Systems',
          Description: 'A course covering the design and implementation of operating systems.',
          Credits: 3,
          FacultyID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseCode: 'CSC325',
          CourseName: 'Object Oriented Programming',
          Description: 'A course covering the principles and practices of object-oriented programming.',
          Credits: 3,
          FacultyID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseCode: 'CSC423',
          CourseName: 'Software Engineering',
          Description: 'A course covering the principles and practices of software engineering.',
          Credits: 3,
          FacultyID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          CourseCode: 'CSC311',
          CourseName: 'Theory of Computation',
          Description: 'A course covering the theoretical foundations of computer science, including automata theory and formal languages.',
          Credits: 3,
          FacultyID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });
      
      

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
    // Begin a transaction
    const transaction = await queryInterface.sequelize.transaction();
  
    try {
      // Delete each course individually
      await queryInterface.bulkDelete('Courses', { CourseID: 8 }, { transaction });
      await queryInterface.bulkDelete('Courses', { CourseID: 9 }, { transaction });
      await queryInterface.bulkDelete('Courses', { CourseID: 10 }, { transaction });
      await queryInterface.bulkDelete('Courses', { CourseID: 11 }, { transaction });
      await queryInterface.bulkDelete('Courses', { CourseID: 12 }, { transaction });
      await queryInterface.bulkDelete('Courses', { CourseID: 13 }, { transaction });
      await queryInterface.bulkDelete('Courses', { CourseID: 14 }, { transaction });
      await queryInterface.bulkDelete('Courses', { CourseID: 15 }, { transaction });
      await queryInterface.bulkDelete('Courses', { CourseID: 16 }, { transaction });
  
      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // If an error occurs, rollback the transaction
      await transaction.rollback();
      console.error('Error reverting seed data:', error);
      throw error; // re-throw the error to handle it upstream
    }
  }
  
};
