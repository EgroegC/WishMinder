const pool = require("../config/db")();

class CelebrationService {
  
    static async getTodaysBirthdaysForUser(userId) {
      const { rows } = await pool.query(`
        SELECT user_id, name, surname, birthdate
        FROM contacts
        WHERE user_id = $1
          AND EXTRACT(MONTH FROM birthdate) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(DAY FROM birthdate) = EXTRACT(DAY FROM CURRENT_DATE)
      `, [userId]);
      return rows;
    }
  
    static async getTodaysNamedaysForUser(userId) {
      const { rows } = await pool.query(`
        SELECT c.user_id, c.name, c.surname, nd.nameday_date
        FROM contacts c
        JOIN names n ON c.name = n.name
        JOIN namedays nd ON nd.name_id = n.id
        WHERE c.user_id = $1
          AND EXTRACT(MONTH FROM nd.nameday_date) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(DAY FROM nd.nameday_date) = EXTRACT(DAY FROM CURRENT_DATE)
      `, [userId]);
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