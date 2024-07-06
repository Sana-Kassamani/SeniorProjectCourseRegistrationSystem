// semester.js
function getCurrentSemester() {
    const currentDate = new Date(); // Get current date
  
    // Define semester start and end dates (example rules)
    const semesterRules = [
      { name: 'Spring', startMonth: 1, startDay: 1, endMonth: 5, endDay: 31 },
      { name: 'Summer', startMonth: 6, startDay: 1, endMonth: 8, endDay: 31 },
      { name: 'Fall', startMonth: 9, startDay: 1, endMonth: 12, endDay: 31 }
      // Add more rules as needed
    ];
  
    // Find the current semester based on current date
    for (const rule of semesterRules) {
      const start = new Date(currentDate.getFullYear(), rule.startMonth - 1, rule.startDay);
      const end = new Date(currentDate.getFullYear(), rule.endMonth - 1, rule.endDay);
  
      if (currentDate >= start && currentDate <= end) {
        return `${rule.name} ${currentDate.getFullYear()}`; // Return semester name and year
      }
    }
  
    return 'Unknown'; // Return default if no matching semester found
  }
  
  
 
  
  
  module.exports = {getCurrentSemester};
  