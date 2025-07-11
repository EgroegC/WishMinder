const { getPool } = require('../config/db');
const pool = getPool();
const Nameday = require('../models/nameday');

class NamedayService {
  static async getUpcomingNamedays() {
    const today = new Date().toISOString().split("T")[0];

    const query = `
          SELECT nd.id, n.name, nd.nameday_date
          FROM namedays nd
          JOIN names n ON nd.name_id = n.id
          WHERE nd.nameday_date >= $1
          ORDER BY nd.nameday_date
        `;

    const result = await pool.query(query, [today]);

    return result.rows.map(
      row => new Nameday(row.id, row.name, row.nameday_date)
    );
  }

  static async getNamedaysByDate(date) {
    const query = `
          SELECT n.name
          FROM namedays nd
          JOIN names n ON nd.name_id = n.id
          WHERE nd.nameday_date = $1
        `;

    const result = await pool.query(query, [date]);

    return result.rows;
  }

  static async getAllNames() {
    const query = `SELECT name FROM names`;
    const result = await pool.query(query);
    return result.rows.map(row => row.name);
  }

}

module.exports = NamedayService;