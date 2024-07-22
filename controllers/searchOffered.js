const path = require('path');
const fs = require('fs')
const { sequelize } = require('../models');
const Sequelize = require('sequelize');
const {getAllOfferedCourses } = require('./getOfferedCourses');
const {getOfferredCourses}=require(path.join(__dirname,'..','controllers','getOfferedCourses'));
const {getCoursesAttended}=require(path.join(__dirname,'..','controllers','getMajorCourses'));
const {getProgram}= require(path.join(__dirname, '..', 'controllers', 'getMajorCourses'));
const {getStudentID}= require(path.join(__dirname,'..','controllers','timetableController'));
const {filterOutFailingGrades}= require(path.join(__dirname,'..','controllers','geneticController'));


const getAllInstructors= async ()=>{
    try {
        const { QueryTypes } = Sequelize;
        const instructors = await sequelize.query(
          `SELECT inst."FName",inst."LName"
           FROM "FacultyMembers" as inst
           WHERE inst."Flag" = 'true'`,
          {
            type: QueryTypes.SELECT
          }
        );
        return instructors;
      } catch (error) {
        console.log('Error fetching instructors: ',error);
      }
}

const getCourseOfferingForm = async (req,res)=>{
    const instructors = await getAllInstructors()
    res.render('courseOffering',{offeredCourses: null,searchParams:null,instructors})
}
const getOfferedCourses = async (req, res) => {
    try {

        const instructors = await getAllInstructors()
        const searchParams = req.query;

        const request={ 
            courseCode : searchParams.courseCode,
            instructor : searchParams.instructor,
            day: searchParams.day,
            from : searchParams.from,
            to: searchParams.to
        }
        // Fetch offered courses
        let offeredCourses = await getAllOfferedCourses();

        console.log("request is:")
        console.log(request)

        if( request.courseCode)
            {
                console.log("filtered course")
                offeredCourses=offeredCourses.filter(section => section.CourseCode.includes(request.courseCode.toUpperCase()))
            }
        if( request.instructor)
            {
                console.log("filtered course")
                offeredCourses=offeredCourses.filter(section => `${section.FName} ${section.LName}` === request.instructor)
            }
        if( request.day)
            {
                console.log("filtered course")
                offeredCourses=offeredCourses.filter(section => section.Days.includes(request.day))
            }
        if( request.from && request.to)
            {
                offeredCourses=offeredCourses.filter(section => withinTime(section.Time,request.from,request.to))
            }
        else if( request.from)
            {
                console.log("filtered course")
                offeredCourses=offeredCourses.filter(section => withinTime(section.Time,request.from,null))
            }
        else if( request.to)
            {
                console.log("filtered course")
                offeredCourses=offeredCourses.filter(section => withinTime(section.Time,null,request.to))
            }
        offeredCourses.sort((a, b) => {
            if (a.CourseCode < b.CourseCode) {
                return -1;
            }
            else if (a.CourseCode > b.CourseCode) {
                return 1;
            }
            else
            {
                if (a.SectionNumber < b.SectionNumber) {
                    return -1;
                }
                else if (a.SectionNumber > b.SectionNumber) {
                    return 1;
                }
            }
            });

            const processedCourses = await checkEligibility(offeredCourses)
        
        // Render the view with the fetched data
        res.render('courseOffering', {
            offeredCourses: processedCourses,
            searchParams,
            instructors
        });
    } catch (error) {
        console.error('Error fetching offered courses:', error);
        res.status(500).send('Internal Server Error');
    }
};

const withinTime = function(definedtime,time1,time2){
    const [start1, end1] = definedtime.split('-').map(parseTime);
    try{
        if(time1 && !time2)
            {
                time1=parseTime(time1)
                return time1 === start1
            }
        else if (!time1 && time2) {
            time2=parseTime(time2)
            return time2 === end1 
        }
        else{
            time1=parseTime(time1)
            time2=parseTime(time2)
            return time1 === start1 && time2 === end1
        }
    }
    catch{
        return false
    }
    
}

const parseTime = function (time) {
    
    try{
        let [hours, minutes] = time.split(':').map(Number);
        const pm_hours = [1,2,3,4,5,6]
        hours = pm_hours.includes(hours) ? hours + 12   : hours
        if (hours != null && minutes != null){
            return hours * 60 + minutes;
        }
        

        else if (minutes == null) {
            return hours* 60
        }
        else {
            return null;
        }
        
    }
    catch{
        return null;
    }
    
};

const hasTakenPrerequisites = function (course, userHistory) {
    return course.prerequisites.every(prereq => userHistory.includes(prereq));
}

const checkEligibility= async (offeredCourses)=>{   
    
    offeredCourses.forEach(course => {
        course.isEligible = false;
        course.isTaken= false;
        course.isRequired = false;
    });
    const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim();
    const StudentID = await getStudentID(studentIdentificationNumber); 
    
    const program= await getProgram(StudentID);
    
    const userCourseHistoryQuery = await getCoursesAttended(StudentID)
    const filteredCourses = filterOutFailingGrades(userCourseHistoryQuery)
    const userCourseHistory= filteredCourses.map(obj => Object.values(obj)[0]);
    

    offeredCourses.forEach(course=>{
        if (course.ProgramID.includes(program[0].ProgramID))
            course.isRequired=true
            if ( userCourseHistory.includes(course.CourseID))
                {
                    course.isTaken=true;
                }
                

            else if( hasTakenPrerequisites(course,userCourseHistory))
            {
                console.log("has taken prereq")
                course.isEligible=true;
            }
    }
    )

    return offeredCourses;

}



module.exports = { getOfferedCourses,getCourseOfferingForm };
