const { getPool } = require('../config/db');
const pool = getPool();

class CelebrationService {

  static async getTodaysBirthdaysForUser(userId) {
    const { rows } = await pool.query(
      `
      SELECT id, user_id, name, surname, phone, birthdate, created_at
      FROM contacts
      WHERE user_id = $1
        AND EXTRACT(MONTH FROM birthdate) = EXTRACT(MONTH FROM (CURRENT_TIMESTAMP AT TIME ZONE $2))
        AND EXTRACT(DAY FROM birthdate) = EXTRACT(DAY FROM (CURRENT_TIMESTAMP AT TIME ZONE $2))
      `,
      [userId, process.env.APP_TIMEZONE || 'UTC']
    );
    return rows;
  }

  static async getTodaysNamedaysForUser(userId) {
    const { rows } = await pool.query(
      `
      SELECT c.id, c.user_id, c.name, c.surname, c.phone, c.birthdate, nd.nameday_date, c.created_at
      FROM contacts c
      JOIN names n ON c.name = n.name
      JOIN namedays nd ON nd.name_id = n.id
      WHERE c.user_id = $1
        AND EXTRACT(MONTH FROM nd.nameday_date) = EXTRACT(MONTH FROM (CURRENT_TIMESTAMP AT TIME ZONE $2))
        AND EXTRACT(DAY FROM nd.nameday_date) = EXTRACT(DAY FROM (CURRENT_TIMESTAMP AT TIME ZONE $2))
      `,
      [userId, process.env.APP_TIMEZONE || 'UTC']
    );
    return rows;
  }

  static async getTodaysCelebrationsForUser(userId) {
    const birthdays = await CelebrationService.getTodaysBirthdaysForUser(userId);
    const namedays = await CelebrationService.getTodaysNamedaysForUser(userId);

    const formattedBirthdays = birthdays.map(b => ({
      ...b,
      type: 'birthday'
    }));

    const formattedNamedays = namedays.map(n => ({
      ...n,
      type: 'nameday'
    }));

    return [...formattedBirthdays, ...formattedNamedays];
  }
}

module.exports = CelebrationService;