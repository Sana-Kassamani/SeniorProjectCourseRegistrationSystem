# SeniorProjectCourseRegistrationSystem
npx sequelize-cli db:seed:undo:all

ALTER SEQUENCE "Courses_CourseID_seq" RESTART WITH 1;
ALTER SEQUENCE "AcademicPrograms_ProgramID_seq" RESTART WITH 1;
ALTER SEQUENCE "Faculties_FacultyID_seq" RESTART WITH 1;
ALTER SEQUENCE "FacultyMembers_MemberID_seq" RESTART WITH 1;
ALTER SEQUENCE "Students_StudentID_seq" RESTART WITH 1;