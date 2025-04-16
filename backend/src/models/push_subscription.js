const pool = require("../config/db")();

class PushSubscription {
   
  static async createOrUpdate(userId, subscription, userAgent) {
    const { endpoint, expirationTime, keys } = subscription;
  
    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, expiration_time, keys, user_agent, updated_at)
       VALUES ($1, $2, $3, $4, $5, now())
       ON CONFLICT (user_id, endpoint)
       DO UPDATE SET
         keys = EXCLUDED.keys,
         expiration_time = EXCLUDED.expiration_time,
         user_agent = EXCLUDED.user_agent,
         updated_at = now()`,
      [userId, endpoint, expirationTime || null, keys, userAgent]
    );
  }

  static async getByUser(userId) {
    const result = await pool.query(
      'SELECT * FROM push_subscriptions WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  }

  static async deleteByEndpointAndUser(endpoint, user_id) {
    await pool.query(
      'DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2',
      [user_id, endpoint]
    );
  }

}

module.exports = PushSubscription;
