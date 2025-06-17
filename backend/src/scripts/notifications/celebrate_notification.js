require("dotenv").config();
require('../../config/web_push')();
const pool = require('../../config/db')();
const sendNotification = require('../../utils/sendNotification');
const logger = require('../../config/logger')();
const rollbar = require('../../config/rollbar')();

const isProd = process.env.NODE_ENV === 'production';

const clientUrl = isProd
  ? 'https://lovely-puffpuff-4a6e3e.netlify.app'
  : 'http://localhost:5173';

async function notifyForTodaysNamedaysAndBirthdays() {
  const TIMEZONE = process.env.APP_TIMEZONE || 'UTC';

  try {
    const { rows } = await pool.query(
      `
      WITH current_day AS (
        SELECT 
          EXTRACT(MONTH FROM CURRENT_DATE AT TIME ZONE $1) AS month,
          EXTRACT(DAY FROM CURRENT_DATE AT TIME ZONE $1) AS day
      )
      SELECT DISTINCT ps.user_id, c.name, c.surname, c.birthdate AS celebration_date, 'birthday' AS type
      FROM push_subscriptions ps 
      JOIN contacts c ON ps.user_id = c.user_id, current_day
      WHERE EXTRACT(MONTH FROM c.birthdate) = current_day.month
        AND EXTRACT(DAY FROM c.birthdate) = current_day.day
    
      UNION ALL
    
      SELECT DISTINCT ps.user_id, c.name, c.surname, nd.nameday_date AS celebration_date, 'nameday' AS type
      FROM push_subscriptions ps
      JOIN contacts c ON ps.user_id = c.user_id
      JOIN names n ON c.name = n.name
      JOIN namedays nd ON nd.name_id = n.id, current_day
      WHERE EXTRACT(MONTH FROM nd.nameday_date) = current_day.month
        AND EXTRACT(DAY FROM nd.nameday_date) = current_day.day;
      `,
      [TIMEZONE]
    );

    const notificationsMap = {};

    for (const row of rows) {
      if (!notificationsMap[row.user_id]) {
        notificationsMap[row.user_id] = [];
      }
      notificationsMap[row.user_id].push(row.surname ? row.surname : row.name);
    }

    for (const userId of Object.keys(notificationsMap)) {
      const names = notificationsMap[userId];
      const message = `🎉 Today's celebrations: ${names.join(", ")}`;

      const payload = JSON.stringify({
        title: 'Hey!',
        body: message,
        data: {
          url: `${clientUrl}`
        }
      });

      try {
        await sendNotification(userId, payload);
      } catch (err) {
        logger.error(`Failed to send notification to user ${userId}: ${err.message}`, {
          stack: err.stack
        });
        rollbar.error(`Script error: Failed to send notification to user ${userId}`, err);
      }
    }
  } catch (err) {
    logger.error(`Script execution failed: ${err.message}`, { stack: err.stack });
    rollbar.error(`Script error: Notification script failed`, err);
  }
}

(async () => {
  await notifyForTodaysNamedaysAndBirthdays();
})();
