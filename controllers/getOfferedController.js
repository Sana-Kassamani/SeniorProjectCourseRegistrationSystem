const { getOfferredCourses } = require('./getOfferedCourses');

const getOfferedCourses = async (req, res) => {
    try {
        const searchParams = req.query; // Get search parameters from query string

        // Fetch offered courses
        const offeredCourses = await getOfferredCourses();

        // Render the view with the fetched data
        res.render('courseOffering', {
            offeredCourses,
            searchParams
        });
    } catch (error) {
        console.error('Error fetching offered courses:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getOfferedCourses };
