const pool = require('../../src/config/db')();

async function deleteAllContactsForUser(userId) {
  await pool.query('DELETE FROM contacts WHERE user_id = $1', [userId]);
}

module.exports = {
  deleteAllContactsForUser,
};
