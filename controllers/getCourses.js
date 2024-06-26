
// controllers/courseController.js
const { Course } = require('../models');

// Function to get all courses from the database
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.render("contractSheet", {courses: courses})
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.send('Error getting courses from database');
  }
};

module.exports = { getAllCourses };
