const { getPool } = require('../../src/config/db');
const pool = getPool();

async function deleteAllPushSubscriptionsForUser(userId) {
    await pool.query(`DELETE FROM push_subscriptions WHERE user_id = $1`, [userId]);
}

module.exports = {
    deleteAllPushSubscriptionsForUser,
};
