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