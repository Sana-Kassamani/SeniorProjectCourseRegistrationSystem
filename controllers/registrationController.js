const db = require('../models'); // Adjust the path as necessary

const getRegistrationPage = async (req, res) => {
  try {
    const query = `
      SELECT "status"
      FROM "process_status"
      WHERE "process" = :process
    `;
    
    const [registrationStatus] = await db.sequelize.query(query, {
      replacements: { process: 'registration' },
      type: db.sequelize.QueryTypes.SELECT
    });

    if (registrationStatus && registrationStatus.status) {
      res.render('registration', { registrationStatus: true, schedule: null});
    } else {
      res.render('registration', { registrationStatus: false,schedule: null });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send(error.message);
  }
};

module.exports = { getRegistrationPage };
