'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Students', 'ProgramID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'AcademicPrograms', 
        key: 'ProgramID' 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addColumn('AcademicPrograms', 'FacultyID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Faculties', 
        key: 'FacultyID' 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addColumn('Courses', 'FacultyID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Faculties', 
        key: 'FacultyID' 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addColumn('Sections', 'CourseID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Courses', 
        key: 'CourseID' 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
   
    await queryInterface.addColumn('Sections', 'InstructorID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'FacultyMembers',
        key: 'MemberID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });  
    
    await queryInterface.addConstraint('Sections', {
      fields: ['SectionNumber', 'CourseID'],
      type: 'primary key',
      name: 'section_key'
    });
   
    await queryInterface.addColumn('FacultyMembers', 'FacultyID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Faculties', 
        key: 'FacultyID' 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

  
  },
    

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Students', 'ProgramID');
    await queryInterface.removeColumn('AcademicPrograms', 'FacultyID');
    await queryInterface.removeColumn('Courses', 'FacultyID');
    await queryInterface.removeColumn('Sections', 'CourseID');
    await queryInterface.removeColumn('Sections', 'InstructorID');
    await queryInterface.removeColumn('FacultyMembers', 'FacultyID');

   
    
  }
};
