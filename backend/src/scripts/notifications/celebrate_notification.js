require("dotenv").config();
require('../../config/web_push_config')();
const pool = require('../../config/db')();
const { sendNotification } = require('../../routes/web_push');

async function notifyForTodaysNamedaysAndBirthdays() {
    const { rows } = await pool.query(`
    SELECT DISTINCT ps.user_id, c.name, c.surname, c.birthdate AS celebration_date, 'birthday' AS type
    FROM push_subscriptions ps 
    JOIN contacts c ON ps.user_id = c.user_id
    WHERE EXTRACT(MONTH FROM c.birthdate) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(DAY FROM c.birthdate) = EXTRACT(DAY FROM CURRENT_DATE)

    UNION ALL

    SELECT DISTINCT ps.user_id, c.name, c.surname, nd.nameday_date AS celebration_date, 'nameday' AS type
    FROM push_subscriptions ps
    JOIN contacts c ON ps.user_id = c.user_id
    JOIN names n ON c.name = n.name
    JOIN namedays nd ON nd.name_id = n.id
    WHERE EXTRACT(MONTH FROM nd.nameday_date) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(DAY FROM nd.nameday_date) = EXTRACT(DAY FROM CURRENT_DATE);
    `);
    
  
    const notificationsMap = {};
  
    for (const row of rows) {
      if (!notificationsMap[row.user_id]) {
        notificationsMap[row.user_id] = [];
      }
      notificationsMap[row.user_id].push(row.name);
    }
  
    for (const userId of Object.keys(notificationsMap)) {
      const names = notificationsMap[userId];
      const message = `🎉 Today's namedays: ${names.join(", ")}`;

      const payload = JSON.stringify({
        title: 'Hey!',
        body: 'Check out today\'s namedays!',
        data: {
        url: 'http://localhost:5173/wish' // ✅ full URL for dev
       }
     });

     sendNotification(userId, payload);
    }
}

(async () => {
    await notifyForTodaysNamedaysAndBirthdays();
})();
  