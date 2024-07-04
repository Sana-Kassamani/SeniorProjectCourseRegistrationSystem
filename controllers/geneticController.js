const path = require('path')
const Genetic = require('genetic-js');
const offeredController=require(path.join(__dirname,'..','controllers','getOfferedCourses'));
const majorController=require(path.join(__dirname,'..','controllers','getMajorCourses'));
const fs = require('fs')
const ExcelJS = require('exceljs');

const {getOfferredCourses}=offeredController;
const {getCoursesAttended}=majorController;

const StudentID=1;

let start = 0
const config = {
    iterations: 700,//TODO change once populated courses
    size: 200,
    crossover: 0.6,
    mutation: 0.8,
    skip: 100
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
    const schedule = new Set();
    while (schedule.size < this.userData.sections.length / 2) { // Adjust to desired initial size
        const section = this.userData.sections[Math.floor(Math.random() * this.userData.sections.length)];
        schedule.add(section);
    }
    return Array.from(schedule);
};


genetic.mutate = function (schedule) {
    if (!Array.isArray(this.userData.sections) || this.userData.sections.length === 0) {
        console.error("Error: userData.sections is not a valid array or is empty.");
        return schedule;
    }

    const scheduleSet = new Set(schedule);
    const section = this.userData.sections[Math.floor(Math.random() * this.userData.sections.length)];

    if (scheduleSet.has(section)) {
        scheduleSet.delete(section);
    } else {
        scheduleSet.add(section);
    }

    return Array.from(scheduleSet);
};


genetic.crossover = function (mother, father) {
    const pivot = Math.floor(Math.random() * mother.length);
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
    // Calculate fitness based on constraints and preferences
    let fitness = 0;
    //console.log("schedule is ",schedule, "and fitness is :")
    // Check for time conflicts
    for (let i = 0; i < schedule.length; i++) {
        if(this.userData.userCourseHistory.includes(schedule[i].CourseID))
            {
                fitness -= 100
                //console.log("a5du")
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
                
                fitness -= 300
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
            fitness -= 200
            //console.log("msh a5ed prereq")
        }
        else{
            //fitness += 1000
        }
    }

    // Add fitness for each course in the schedule
    //fitness += schedule.length;
    //console.log(fitness)
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
    const hours = Number(time) ;
    return hours * 60 ;
};

genetic.hasTakenPrerequisites = function (course, userHistory) {
    return course.prerequisites.every(prereq => userHistory.includes(prereq));
};

genetic.generation = function (pop, generation, stats) {
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





// Controller function to recommend courses
const recommendCourses = async function (req,res) {
    try {
        start= Date.now()
        // Fetch courses and user data from the model
        const sections = await getOfferredCourses();
        const userCourseHistoryQuery = await getCoursesAttended(StudentID);
        
        const userCourseHistory= userCourseHistoryQuery.map(obj => Object.values(obj)[0]);

        const userData = {
            sections,
            userCourseHistory
        };
        // console.log(userData.sections)
        // console.log()
        // console.log(userData.userCourseHistory,"\n\n")

        
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




