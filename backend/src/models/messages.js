const pool = require("../config/db")();

class Messages {

  static async getAllMessages(type) {
    const result = await pool.query(
      'SELECT id, text FROM messages WHERE type = $1',
      [type]
    );

    return result.rows;
  }
}

module.exports = Messages;
