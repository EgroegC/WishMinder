const pool = require("../config/db")();

class PushSubscription {

  static async removeOldSubscriptions(userId, userAgent, currentEndpoint) {
    await pool.query(
      `DELETE FROM push_subscriptions
       WHERE user_id = $1 AND user_agent = $2 AND endpoint != $3`,
      [userId, userAgent, currentEndpoint]
    );
  }

  static async createOrUpdate(userId, subscription, userAgent) {
    const { endpoint, expirationTime, keys } = subscription;

    await this.removeOldSubscriptions(userId, userAgent, endpoint);

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

  static async deleteSubByEndpointAndUser(endpoint, user_id) {
    await pool.query(
      'DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2',
      [user_id, endpoint]
    );
  }

  static async getAllSubscribedUsers() {
    const result = await pool.query(
      'SELECT DISTINCT user_id FROM push_subscriptions'
    );
    return result.rows;
  }

}

module.exports = PushSubscription;
