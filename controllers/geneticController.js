const path = require('path')
const Genetic = require('genetic-js');
const offeredController=require(path.join(__dirname,'..','controllers','getOfferedCourses'));
const majorController=require(path.join(__dirname,'..','controllers','getMajorCourses'));
const fs = require('fs')
const ExcelJS = require('exceljs');

const {getOfferredCourses}=offeredController;
const {getCoursesAttended}=majorController;



let start = 0
let time = null
let days= null

const config = {
    iterations: 800,//TODO change once populated courses
    size: 50,
    crossover: 0.6,
    mutation: 0.7,
    skip: 50,
    elitism: true,
    creditCount : 12,
    time: time,
    days:days

};

const genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

// Define genetic algorithm functions
// genetic.seed = function () {
//     const schedule = new Set();
//     const desiredSectionCount = 4/* Your desired number */;
//     while (schedule.size < desiredSectionCount) {
//         const section = this.userData.sections[Math.floor(Math.random() * this.userData.sections.length)];
//         schedule.add(section);
//     }
//     return Array.from(schedule);
// };



// genetic.mutate = function (schedule) {
//     const maxSections = 4 /* Your maximum allowed sections */;
//     const scheduleSet = new Set(schedule);

//     // Example: Remove or add a section to maintain the maxSections limit
//     if (scheduleSet.size < maxSections) {
//         // Add a random section
//         const section = this.userData.sections[Math.floor(Math.random() * this.userData.sections.length)];
//         scheduleSet.add(section);
//     } else if (scheduleSet.size > maxSections) {
//         // Remove a random section
//         const sectionsArray = Array.from(scheduleSet);
//         const indexToRemove = Math.floor(Math.random() * sectionsArray.length);
//         scheduleSet.delete(sectionsArray[indexToRemove]);
//     }

//     return Array.from(scheduleSet);
// };
genetic.seed = function () {
    const desiredCreditCount= config.creditCount
    const schedule = new Set();
    let creditCount=0
    while (creditCount <= desiredCreditCount) { // Adjust to desired initial size
        const section = this.userData.sections[Math.floor(Math.random() * this.userData.sections.length)];
        schedule.add(section);
        creditCount += Number(section.Credits)
    }
    return Array.from(schedule);
};


// genetic.mutate = function (schedule) {
//     if (!Array.isArray(this.userData.sections) || this.userData.sections.length === 0) {
//         console.error("Error: userData.sections is not a valid array or is empty.");
//         return schedule;
//     }

//     const scheduleSet = new Set(schedule);
//     const section = this.userData.sections[Math.floor(Math.random() * this.userData.sections.length)];

//     if (scheduleSet.has(section)) {
//         scheduleSet.delete(section);
//     } else {
//         scheduleSet.add(section);
//     }

//     return Array.from(scheduleSet);
// };

genetic.mutate = function(schedule) {
    if (!Array.isArray(this.userData.sections) || this.userData.sections.length === 0) {
        console.error("Error: userData.sections is not a valid array or is empty.");
        return schedule;
    }

    // Clone the schedule array to avoid modifying the original directly
    const mutatedSchedule = [...schedule];

    // Randomly select two distinct indices to swap
    const index1 = Math.floor(Math.random() * mutatedSchedule.length);
    let index2 = Math.floor(Math.random() * mutatedSchedule.length);
    
    while (index2 === index1) {
        index2 = Math.floor(Math.random() * mutatedSchedule.length);
    }

    // Swap sections at index1 and index2
    const temp = mutatedSchedule[index1];
    mutatedSchedule[index1] = mutatedSchedule[index2];
    mutatedSchedule[index2] = temp;

    return mutatedSchedule;
};

genetic.crossover = function (mother, father) {
    const pivot = Math.floor(Math.random() * mother.length );
    const sonSet = new Set(mother.slice(0, pivot).concat(father.slice(pivot)));
    const daughterSet = new Set(father.slice(0, pivot).concat(mother.slice(pivot)));
    return [Array.from(sonSet), Array.from(daughterSet)];
};



// genetic.crossover = function (mother, father) {
//     const pivot = Math.floor(Math.random() * mother.length);
//     const sonSet = new Set(mother.slice(0, pivot).concat(father.slice(pivot)));
//     const daughterSet = new Set(father.slice(0, pivot).concat(mother.slice(pivot)));
//     return [Array.from(sonSet), Array.from(daughterSet)];
// };
// genetic.crossover = function (mother, father) {
//     const maxSections = 4/* Your maximum allowed sections */;
//     const pivot = Math.floor(Math.random() * mother.length);
//     const sonSet = new Set(mother.slice(0, pivot).concat(father.slice(pivot)));
//     const daughterSet = new Set(father.slice(0, pivot).concat(mother.slice(pivot)));
//     // Trim to maxSections
//     const sonArray = Array.from(sonSet).slice(0, maxSections);
//     const daughterArray=Array.from(daughterSet).slice(0, maxSections);

//     return [sonArray, daughterArray];
// };

genetic.fitness = function (schedule) {
    const desiredCreditCount=config.creditCount
    // Calculate fitness based on constraints and preferences
    let fitness = 0;
    //console.log("schedule is ",schedule, "and fitness is :")
    // Check for time conflicts
    let creditCount=0
    for (let i = 0; i < schedule.length; i++) {
        creditCount += Number(schedule[i].Credits)
        
        if(this.userData.userCourseHistory.includes(schedule[i].CourseID))
            {
                fitness -= 100
                //console.log("a5du")
            }
            if(Number(schedule[i].NbOfSeats) == Number(schedule[i].reserved))
            {
                fitness -=100
            }
                
        for (let j = i + 1; j < schedule.length; j++) {
            
            if(schedule[i].CourseID == schedule[j].CourseID)
            {
                //console.log("same crs offered")
                fitness -= 100   
            }
            if (schedule[i].CourseID == schedule[j].CourseID && schedule[i].SectionNumber == schedule[j].SectionNumber)
                {
                    //console.log("same section offered")
                    fitness -= 100
                }
            
            if (schedule[i].Days == schedule[j].Days && this.timeConflict(schedule[i], schedule[j])) {
                
                fitness -= 100
                //console.log("time conflict")
            }
            else{
                //fitness+=200
            }
        }
    }

    // Check for prerequisites
    for (const section of schedule) {
        if (!this.hasTakenPrerequisites(section, this.userData.userCourseHistory)) {
            //console.log("msh a5edd prereq")
            fitness -= 100
            //console.log("msh a5ed prereq")
        }
        else{
            //fitness += 1000
        }
    }
    if (creditCount != desiredCreditCount)
        {
            fitness-= 200
        }
    if(!fitness)
        {
            for (let i = 0; i < schedule.length; i++) {
                if(config.time && this.withinTime(config.time,schedule[i].Time)){
        
                    fitness +=20
                }
                if(config.days)
                    {
                        
                        if(schedule[i].Days.includes(config.days))
                            fitness +=20
                        else {
                            fitness -=10
                        }
                            
                    }
                }
        }
    // Add fitness for each course in the schedule
    //fitness += schedule.length;
    //console.log(fitness)
    return fitness;
};
genetic.withinTime= function(desired,course){
    const [start1, end1] = course.split('-').map(this.parseTime);
    const [desiredStart, desiredEnd] = desired.split('-').map(this.parseTime);
    return (desiredStart <= start1 && end1 <= desiredEnd)
}
genetic.timeConflict = function (course1, course2) {
    const [start1, end1] = course1.Time.split('-').map(this.parseTime);
    const [start2, end2] = course2.Time.split('-').map(this.parseTime);
    return (start1 < end2 && start2 < end1);
};

genetic.parseTime = function (time) {
    //TODO implement atime of hh:mm and change db values
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
    // const hours = Number(time) ;
    // return hours * 60 ;
};

genetic.hasTakenPrerequisites = function (course, userHistory) {
    return course.prerequisites.every(prereq => userHistory.includes(prereq));
};

genetic.generation = function (pop, generation, stats) { 
    // const uniqueSchedules = new Set(pop.map(individual => JSON.stringify(individual.entity)));
    // if (uniqueSchedules.size < pop.length / 2) {
    //     // Introduce manual mutation to increase diversity
    //     for (let i = 0; i < pop.length; i++) {
    //         if (Math.random() < 0.2) { // Adjust the probability of manual mutation
    //             pop[i].entity = this.mutate(pop[i].entity);
    //         }
    //     }
    // }
    
    return pop[0].entity.length > 0;  // Stop if we find a valid schedule
};

// Assuming genetic.notification function context
genetic.notification = async function (pop, generation, stats, isFinished) {
    

    // Access fitness of the best individual (first in population)
    const bestFitness = pop[0].fitness;
    console.log('Best fitness in generation', generation, ':', bestFitness);

    // Access and log other details as needed
    pop[0].entity.forEach(section => {
        console.log('Best schedule:', section.CourseID, " ", section.SectionNumber);
    });

    if (isFinished) {
        const end = Date.now()
        console.log('Evolution finished');
        // console.log("--------")
        // console.log("--------")
        recommendedCourses = pop[0].entity
        // genetic.fitness(pop[0].entity)
        // console.log("--------")
        // console.log("--------")
        const runtime = end - start
        await saveResultsToExcel(config, bestFitness,runtime);
        
}
};
const saveResultsToExcel = async (config, bestFitness,runtime) => {
    const filePath = path.join(__dirname, '..','results','genetic_algorithm_results.xlsx');
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    try {
        await workbook.xlsx.readFile(filePath);
        worksheet = workbook.getWorksheet('Results');
       // console.log(worksheet)
    } catch (err) {
        console.log("created new file")
        worksheet = workbook.addWorksheet('Results');
        worksheet.columns = [
            { header: 'Iterations', key: 'iterations' },
            { header: 'Population Size', key: 'size' },
            { header: 'Crossover Rate', key: 'crossover' },
            { header: 'Mutation Rate', key: 'mutation' },
            { header: 'Runtime (ms)', key: 'runtime' },
            { header: 'Best Fitness', key: 'bestFitness' }
        ];
    }
    try{
        worksheet.addRow([config.iterations,config.size,config.crossover,config.mutation,runtime,bestFitness]).commit();
    }catch(err)
    {
        console.log("could not add row")
    }
    

    await workbook.xlsx.writeFile(filePath);
    console.log("added results to file")
};


const filterOutFailingGrades = (courseHistory) => {
    return courseHistory.filter(course => course.Grade !== 'F');
};


// Controller function to recommend courses
const recommendCourses = async function (req,res) {
    try {
        start= Date.now()
        // Fetch courses and user data from the model
        const {getStudentID}= require(path.join(__dirname,'..','controllers','timetableController'));
        const studentIdentificationNumber = fs.readFileSync('userID.txt', 'utf8').trim();
        const StudentID= await getStudentID(studentIdentificationNumber);
        const sections = await getOfferredCourses();
        const userCourseHistoryQuery = await getCoursesAttended(StudentID);
        
        const non_failing_grades = filterOutFailingGrades(userCourseHistoryQuery);
        
        const userCourseHistory = non_failing_grades.map(obj => Object.values(obj)[0])

        console.log(userCourseHistory)
        const userData = {
            sections,
           userCourseHistory
        };
        
        // console.log(userData.userCourseHistory,"\n\n")
       
        
        genetic.userData = userData;
        genetic.recommendedCourses = []; // Initialize recommendedCourses in genetic object
        // Evolve genetic algorithm
        
        genetic.evolve(config, userData);
        res.render("registration",{registrationStatus: true, schedule: recommendedCourses});
    } catch (error) {
        console.log('Error  recommending courses:', error);
        res.send('Error recommending courses');
    }
};
module.exports = { recommendCourses,filterOutFailingGrades };




