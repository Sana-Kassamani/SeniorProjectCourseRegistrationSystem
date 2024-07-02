'use strict';

const academicprogram = require('../models/academicprogram');
const faculty = require('../models/faculty');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Faculties', [
      {
        FacultyName: 'Faculty of Computer Studies',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    const facultyid = await queryInterface.rawSelect('Faculties', {
      where: {FacultyName: 'Faculty of Computer Studies' },
    }, ['FacultyID']);
    
  
    await queryInterface.bulkInsert('AcademicPrograms', [
      {
        ProgramName: 'testComputer Science',
        Degree: 'Bachelor of Science',
        CoreCredits: 45,
        MajorCredits: 60,
        TechnicalCredits: 30,
        ElectiveCredits: 15,
        FacultyID: facultyid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ProgramName: 'testComputer Engineering',
        Degree: 'Bachelor of Engineering',
        CoreCredits: 50,
        MajorCredits: 65,
        TechnicalCredits: 35,
        ElectiveCredits: 20,
        FacultyID: facultyid,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    await queryInterface.bulkInsert('Courses', [
      {
        CourseCode: 'CSC101',
        CourseName: 'Introduction to Computer Science',
        Description: 'An introductory course covering basic concepts of computer science.',
        Credits: 3,
        FacultyID: facultyid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        CourseCode: 'CSC201',
        CourseName: 'Data Structures and Algorithms',
        Description: 'A course focusing on fundamental data structures and algorithms.',
        Credits: 3,
        FacultyID: facultyid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        CourseCode: 'CSC301',
        CourseName: 'Advanced Algorithms',
        Description: 'Advanced study of algorithms and computational complexity.',
        Credits: 3,
        FacultyID: facultyid, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        CourseCode: 'CSC302',
        CourseName: 'Database Systems',
        Description: 'A course on database design and SQL.',
        Credits: 3,
        FacultyID: facultyid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        CourseCode: 'CSC401',
        CourseName: 'Machine Learning',
        Description: 'Introduction to machine learning techniques and applications.',
        Credits: 3,
        FacultyID: facultyid, // Update with appropriate FacultyID
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        CourseCode: 'CSC402',
        CourseName: 'Artificial Intelligence',
        Description: 'Fundamentals and applications of artificial intelligence.',
        Credits: 3,
        FacultyID: facultyid, // Update with appropriate FacultyID
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
        CourseCode: 'CEG301',
        CourseName: 'Digital Logic Design',
        Description: 'Fundamentals of digital logic design and hardware description languages.',
        Credits: 3,
        FacultyID: facultyid, // Update with appropriate FacultyID
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    const salt = await bcrypt.genSalt(10);
    const AcademicProgramid = await queryInterface.rawSelect('AcademicPrograms', {
      where: {ProgramName: 'testComputer Science', },
    }, ['ProgramID']);
     
     await queryInterface.bulkInsert('Students', [{
      StudentIdentificationNumber:'20208001',
      FName: 'testJohn',
      LName: 'Doe',
      EmailAddress: 'John-Doe@example.com',
      Password: await bcrypt.hash("hello", salt),
      refreshToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      ProgramID: AcademicProgramid,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      StudentIdentificationNumber:'20208002',
      FName: 'testSusan',
      LName: 'Becker',
      EmailAddress: 'Susan-Becker@example.com',
      Password:"hello",
      refreshToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      ProgramID: AcademicProgramid,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  

await queryInterface.bulkInsert('FacultyMembers', [
  {
    MemberIdentificationNumber: '2021001',
    FName: 'Joe',
    LName: 'Dart',
    EmailAddress: 'joe.dart@example.com',
    Flag: true, // Assuming true means instructor
    refreshToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    Password: await bcrypt.hash("hello", salt),
    FacultyID: facultyid,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    MemberIdentificationNumber: '2021002',
    FName: 'Jane',
    LName: 'Smith',
    EmailAddress: 'jane.smith@example.com',
    Flag: false, // Assuming false means staff
    refreshToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    Password: await bcrypt.hash("hello", salt),
    FacultyID: facultyid,
    createdAt: new Date(),
    updatedAt: new Date()
  }
], {});

  
  },

  async down (queryInterface, Sequelize) {



    await queryInterface.bulkDelete('FacultyMembers', null, {});
    await queryInterface.bulkDelete('Students', null, {});
    await queryInterface.bulkDelete('Courses', null, {});
    await queryInterface.bulkDelete('AcademicPrograms', null, {});
    await queryInterface.bulkDelete('Faculties', null, {});
  }
  
};
