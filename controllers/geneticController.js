const path = require('path')
const Genetic = require('genetic-js');
const offeredController=require(path.join(__dirname,'..','controllers','getOfferedCourses'));
const majorController=require(path.join(__dirname,'..','controllers','getMajorCourses'));

const {getOfferredCourses}=offeredController;
const {getCoursesAttended}=majorController;

const StudentID=1;

const config = {
    iterations: 100,//TODO change once populated courses
    size: 250,
    crossover: 0.3,
    mutation: 0.3,
    skip: 20
};

const genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

// Define genetic algorithm functions
genetic.seed = function () {
    // Create a random schedule
    const schedule = [];
    for (const section of this.userData.sections) {
        if (Math.random() > 0.5) {
            schedule.push(section);
        }
    }
    return schedule;
};


genetic.mutate = function (schedule) {
    // Ensure userData.sections exists and is an array
    if (!Array.isArray(this.userData.sections) || this.userData.sections.length === 0) {
        console.error("Error: userData.sections is not a valid array or is empty.");
        return schedule;
    }

    // Mutate the schedule by randomly adding or removing a course
    const index = Math.floor(Math.random() * this.userData.sections.length);
    const section = this.userData.sections[index];

    // Check if the section is defined
    if (!section) {
        console.error("Error: section at index", index, "is undefined.");
        return schedule;
    }

    // Mutate the schedule
    if (schedule.includes(section)) {
        schedule.splice(schedule.indexOf(section), 1);
    } else {
        schedule.push(section);
    }

    return schedule;
};


genetic.crossover = function (mother, father) {
    // Crossover the schedules
    const pivot = Math.floor(Math.random() * mother.length);
    const son = mother.slice(0, pivot).concat(father.slice(pivot));
    const daughter = father.slice(0, pivot).concat(mother.slice(pivot));
    return [son, daughter];
};

genetic.fitness = function (schedule) {
    // Calculate fitness based on constraints and preferences
    let fitness = 0;

    // Check for time conflicts
    for (let i = 0; i < schedule.length; i++) {
        for (let j = i + 1; j < schedule.length; j++) {
            if (this.timeConflict(schedule[i], schedule[j])) {
                return 0;
            }
        }
    }

    // Check for prerequisites
    for (const section of schedule) {
        if (!this.hasTakenPrerequisites(section, this.userData.userCourseHistory)) {
            return 0;
        }
    }

    // Add fitness for each course in the schedule
    fitness += schedule.length;

    return fitness;
};

genetic.timeConflict = function (course1, course2) {
    const [start1, end1] = course1.Time.split('-').map(this.parseTime);
    const [start2, end2] = course2.Time.split('-').map(this.parseTime);
    return (start1 < end2 && start2 < end1);
};

genetic.parseTime = function (time) {
    //TODO implement atime of hh:mm and change db values
    //const [hours, minutes] = time.split(':').map(Number);
    // return hours * 60 + minutes;
    const hours = time ;
    return hours * 60 ;
};

genetic.hasTakenPrerequisites = function (course, userHistory) {
    return course.prerequisites.every(prereq => userHistory.includes(prereq));
};

genetic.generation = function (pop, generation, stats) {
    return pop[0].entity.length > 0;  // Stop if we find a valid schedule
};
var recommendedCourses="";
genetic.notification = function (pop, generation, stats, isFinished) {
    pop[0].entity.forEach(section => {
        console.log('Generation:', generation, 'Best schedule:', section.CourseID," ",section.SectionNumber);
    });
    if (isFinished){
        recommendedCourses = pop[0].entity
        
    }
    
};

// genetic.notification = function (pop, generation, stats, isFinished) {
//     const recommendedCourses = pop[0].entity;
//     console.log
//      html += '<h3>Recommended Courses:</h3><ul>';

//     for (const course of recommendedCourses) {
//         html += `<li>${course.name} (${course.time})</li>`;
//     }

//     html += '</ul>';

    
// };




// Controller function to recommend courses
// const recommendCourses = async function (req, res) {
//     try{
//     // Fetch courses and user data from the model
//     const sections = await getOfferredCourses()
//     const userCourseHistory = await getCoursesAttended(StudentID);

//     const userData = {
//         sections,
//         userCourseHistory
//     };
//     console.log("\n\n Sections are :",userData.sections)
//     console.log("\n\n Sections are :",userData.sections[0])
//     genetic.userData = userData;

//     // const results = genetic.evolve(config, userData);
//     // console.log("results are",results)
//     // console.log()
//     // console.log(
//     // console.log(results.population)   
//     // )
//     genetic.evolve(config, userData);
//     //res.render("registration", { recommendedCourses: results.population[0].entity });
//     res.render("registration")
//   } catch (error) {
//     console.log('Error fetching recommending courses:', error);
//     res.send('Error recommending courses');
//   }
// };
// Controller function to recommend courses
const recommendCourses = async function (req,res) {
    try {
        // Fetch courses and user data from the model
        const sections = await getOfferredCourses();
        const userCourseHistory = await getCoursesAttended(StudentID);

        const userData = {
            sections,
            userCourseHistory
        };

        genetic.userData = userData;
        genetic.recommendedCourses = []; // Initialize recommendedCourses in genetic object

        // Evolve genetic algorithm
        genetic.evolve(config, userData);
        res.render("registration",{schedule: recommendedCourses});
    } catch (error) {
        console.log('Error fetching recommending courses:', error);
        res.send('Error recommending courses');
    }
};
module.exports = { recommendCourses };

// module.exports={recommendCourses};


