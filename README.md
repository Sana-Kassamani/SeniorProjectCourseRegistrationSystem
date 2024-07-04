# SeniorProjectCourseRegistrationSystem

-- Update the status to true for registration process
UPDATE process_status
SET status = true
WHERE process = 'registration';


NOTES:
searchandregisterController=> ADD SEMESTER (registerStudentInCourse)