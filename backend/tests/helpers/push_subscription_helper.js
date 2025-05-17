const pool = require('../../src/config/db')();

async function deleteAllPushSubscriptionsForUser(userId) {
    await pool.query(`DELETE FROM push_subscriptions WHERE user_id = $1`, [userId]);
}

module.exports = {
    deleteAllPushSubscriptionsForUser,
};
