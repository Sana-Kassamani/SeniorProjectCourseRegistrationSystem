const { searchCourse } = require('./courseSearch');

const getData = async (req, res) => {
    try {
        const courseCode = req.query.CourseCode || "";
        const semester = req.query.Semester || ""; // Ensure they match the names in your form inputs
        
        const data = await searchCourse(courseCode, semester);
        console.log(data);
        res.render('searchAndRegister', { data }); // Assuming there's a corresponding EJS view file
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getData
};
