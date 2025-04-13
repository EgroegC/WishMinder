const pool = require("../config/db")();

class PushSubscription {
   
  static async createOrUpdate(userId, subscription) {
    const { endpoint, expirationTime, keys } = subscription;

    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, expiration_time, keys)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) DO UPDATE SET keys = EXCLUDED.keys`,
      [userId, endpoint, expirationTime || null, keys]
    );
  }

  static async getByUser(userId) {
    const result = await pool.query(
      'SELECT * FROM push_subscriptions WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  }

  static async deleteByEndpoint(endpoint) {
    await pool.query(
      'DELETE FROM push_subscriptions WHERE endpoint = $1',
      [endpoint]
    );
  }
}

module.exports = PushSubscription;
