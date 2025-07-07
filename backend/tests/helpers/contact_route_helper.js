const { getPool } = require('../../src/config/db');
const pool = getPool();

async function deleteAllContactsForUser(userId) {
  await pool.query('DELETE FROM contacts WHERE user_id = $1', [userId]);
}

module.exports = {
  deleteAllContactsForUser,
};
