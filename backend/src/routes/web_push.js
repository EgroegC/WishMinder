const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const {authenticateToken} = require('../middleware/authorization');
const PushSubscription = require('../models/push_subscription');
const {validatePushSubscription, 
  validateNotificationPayload} = require('./validation/subscription_validation');

router.post('/subscribe', authenticateToken, express.json(), async (req, res) => {
  
  const { error } = validatePushSubscription(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  
  const subscription = req.body;
  const userId = req.user.id;
  const userAgent = req.headers['user-agent'];

  try {
    await PushSubscription.createOrUpdate(userId, subscription, userAgent);
    res.status(201).json({ message: 'Subscription stored' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Failed to store subscription' });
  }
});

router.post('/send-notification', authenticateToken, express.json(), async (req, res) => {
  
  const { error } = validateNotificationPayload(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  
  const user_id = req.user.id;
  const payload = JSON.stringify(req.body);

  try {
    sendNotification(user_id, payload)
    res.status(200).json({ message: 'Notification process completed' });
  } catch (err) {
    console.error("🚨 Notification setup failed:", err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

async function sendNotification(user_id, payload){
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
          await PushSubscription.deleteByEndpointAndUser(pushSub.endpoint, user_id);
          console.log(`🧹 Removed dead subscription: ${pushSub.endpoint}`);
        } else {
          console.error(`❌ Failed to send to ${pushSub.endpoint}:`, err);
        }
      }
    }
}

module.exports = {
    router,
    sendNotification, 
};