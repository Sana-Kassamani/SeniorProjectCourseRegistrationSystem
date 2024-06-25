// Import the Sequelize configuration file
const db = require('./models/index'); // Update the path as per your project structure

// Function to test the database connection
async function testDatabaseConnection() {
  try {
    // Authenticate the Sequelize connection
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // Close the Sequelize connection
    //await db.sequelize.close();
  }
}

// Call the function to test the database connection
module.exports={testDatabaseConnection}
