const db = require('../models/index'); // Adjust path as per your project structure
require('dotenv').config();
const bcrypt = require('bcryptjs'); // Uncomment if you plan to use bcrypt
const jwt = require('jsonwebtoken')


async function getStudentID(studentIdentificationNumber) {
    
    try {
        const query = `
            SELECT "StudentID", "Password","refreshToken"
            FROM "Students"
            WHERE "StudentIdentificationNumber" = :studentIdentificationNumber
        `;
        const [student] = await db.sequelize.query(query, {
            replacements: { studentIdentificationNumber },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!student) {
            console.log('User not found');
            return null;
        }

        return student;
    } catch (err) {
        console.error('Error executing query', err);
        throw err; // Re-throw the error to handle it in the caller function
    }
}


async function  getInsructorID(MemberIdentificationNumber) {
    
    try {
        const query = `
            SELECT "MemberIdentificationNumber", "Password","refreshToken"
            FROM "FacultyMembers"
            WHERE "MemberIdentificationNumber" = :MemberIdentificationNumber
        `;
        const [member] = await db.sequelize.query(query, {
            replacements: { MemberIdentificationNumber },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!member) {
            console.log('User not found');
            return null;
        }

        return member;
    } catch (err) {
        console.error('Error executing query', err);
        throw err; // Re-throw the error to handle it in the caller function
    }
}

async function updateRefreshToken(userType, ID, refreshToken) {
    const tableName = userType === 'student' ? 'Students' : 'FacultyMembers';
    const updateQuery = `
        UPDATE "${tableName}"
        SET "refreshToken" = :refreshToken
        WHERE "${userType === 'student' ? 'StudentIdentificationNumber' : 'MemberIdentificationNumber'}" = :ID
    `;
    
    try {
        await db.sequelize.query(updateQuery, {
            replacements: { ID, refreshToken },
            type: db.sequelize.QueryTypes.UPDATE
        });
    } catch (err) {
        console.error('Error updating refreshToken', err);
        throw err;
    }
}


const loginUser = async (req, res) => {
    const { ID, password} = req.body;
    const userType = req.body.userType;
    console.log("Received ID:", ID); // Log received ID
    console.log("Received password:", password); // Log received password

    if (!ID || !password) {
        const message = "Username and password cannot be empty";
        console.log(message);
        return res.render('login', { message });
    }
   
    try {
        let user;

        if (userType === 'student') {
          user = await getStudentID(ID);
        } else if (userType === 'admin') {
          user = await  getInsructorID(ID);
        }
        if (!user) {
            const message = "User not found";
            console.log(message);
            return res.render('login', { message });
        }

       
        const isMatch = await bcrypt.compare(password, user.Password);
        
        if (!isMatch) {
            const message = "Invalid credentials";
            console.log(message);
            return res.render('login', { message });
        }
        const accessToken = jwt.sign({ userId: user.ID }, process.env.ACCESS_TOKEN, {
            expiresIn: '15m',
        });
        req.session.accessToken = accessToken;
        
        const refreshToken = jwt.sign({ userId: user.ID }, process.env.REFRESH_TOKEN);

        // Save the refresh token to the user document
        user.refreshToken = refreshToken;
        await updateRefreshToken(userType, ID, refreshToken);
        
        // save username to session
        req.session.ID = user.ID
        // Successful login
        const message = "Login successful";
        console.log(message);
        if (userType === 'admin'){ 
            // return res.render('mainAdmin', { message })  *************admin main page************************
        }
        return res.render('main', { message });

       
    } catch (err) { 
        console.error(err.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    loginUser
};