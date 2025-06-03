const PushSubscription = require('../models/push_subscription');
const logger = require('../config/logger')();
const webpush = require('web-push');

module.exports = async function sendNotification(user_id, payload) {
  const subscriptions = await PushSubscription.getByUser(user_id);

  for (const sub of subscriptions) {
    const pushSub = {
      endpoint: sub.endpoint,
      expirationTime: sub.expiration_time,
      keys: sub.keys
    };

    try {
      await webpush.sendNotification(pushSub, payload);
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await PushSubscription.deleteSubByEndpointAndUser(pushSub.endpoint, user_id);
        logger.info(`🧹 Removed dead subscription: ${pushSub.endpoint} for User with ID: ${user_id}`);
      } else {
        err.message = `❌ Failed to send to ${pushSub.endpoint}: ${err.message} for User with ID: ${user_id}`;
        throw err;
      }
    }
  }
}