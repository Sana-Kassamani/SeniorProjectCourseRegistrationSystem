const db = require('../models/index'); // Adjust path as per your project structure
require('dotenv').config();
// const bcrypt = require('bcryptjs'); // Uncomment if you plan to use bcrypt

async function getStudentID(studentIdentificationNumber) {
    
    try {
        const query = `
            SELECT "StudentID", "Password"
            FROM "Students"
            WHERE "StudentIdentificationNumber" = :studentIdentificationNumber
        `;
        const [student] = await db.sequelize.query(query, {
            replacements: { studentIdentificationNumber },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!student) {
            console.log('Student not found');
            return null;
        }

        return student;
    } catch (err) {
        console.error('Error executing query', err);
        throw err; // Re-throw the error to handle it in the caller function
    }
}

const loginUser = async (req, res) => {
    const { ID, password } = req.body;

    console.log("Received ID:", ID); // Log received ID
    console.log("Received password:", password); // Log received password

    if (!ID || !password) {
        const message = "Username and password cannot be empty";
        console.log(message);
        return res.render('login', { message });
    }

    try {
        // Find user by username
        const student = await getStudentID(ID);

        if (!student) {
            const message = "Student not found";
            console.log(message);
            return res.render('login', { message });
        }

       
        const isMatch = await bcrypt.compare(password, student.Password);
        if (!isMatch) {
            const message = "Invalid credentials";
            console.log(message);
            return res.render('login', { message });
        }

        // Successful login
        const message = "Login successful";
        console.log(message);
        return res.render('main', { message });

    } catch (err) { 
        console.error(err.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    loginUser
};
