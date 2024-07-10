# SeniorProjectCourseRegistrationSystem

-- Update the status to true for registration process
UPDATE process_status
SET status = true
WHERE process = 'registration';


DELETE FROM "StudentSections"
WHERE "StudentID" = '1'
  AND "SectionNumber"= '1'

NOTES:

ALTER SEQUENCE "Courses_CourseID_seq" RESTART WITH 1;
ALTER SEQUENCE "AcademicPrograms_ProgramID_seq" RESTART WITH 1;
ALTER SEQUENCE "Faculties_FacultyID_seq" RESTART WITH 1;
ALTER SEQUENCE "FacultyMembers_MemberID_seq" RESTART WITH 1;
ALTER SEQUENCE "Students_StudentID_seq" RESTART WITH 1;

To populate db correctly:
"MERGE CHANGES" from main to branch first!!!
1. open sql cmd
2. press enter until password is requested
3. enter password 
4. run: DROP DATABASE nameOfDb;
5. run: CREATE DATABASE nameOfDb;
6. come to vs code, in terminal, run: npm run migrate
7. import files provided to each table IN THIS ORDER:
  process_status
  Faculties
  AcademicPrograms
  FacultyMembers
  Students
  Courses
  ProgramCourses
  Prerequisites
  Sections 
  StudentSections
8. run server.js and VIOLA
