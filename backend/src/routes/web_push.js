const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const {authenticateToken} = require('../middleware/authorization');
const PushSubscription = require('../models/push_subscription');

router.post('/subscribe', authenticateToken, express.json(), async (req, res) => {
  const subscription = req.body;
  const userId = req.user.id;

  if (!subscription) {
    return res.status(400).json({ message: 'No subscription in request body' });
  }

  try {
    await PushSubscription.createOrUpdate(userId, subscription);
    res.status(201).json({ message: 'Subscription stored' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Failed to store subscription' });
  }
});

router.post('/send-notification', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  let subscriptions;

  const payload = JSON.stringify({
    title: 'Hey!',
    body: 'Check out today\'s namedays!',
    data: {
      url: 'http://localhost:5173/namedays' // ✅ full URL for dev
    }
  });

  try{
    subscriptions = await PushSubscription.getByUser(user_id);

    for (const sub of subscriptions) {
      const pushSub = {
        endpoint: sub.endpoint,
        expirationTime: sub.expiration_time,
        keys: sub.keys
      };
  
     await webpush.sendNotification(pushSub, payload);
    }
    res.status(200).json({message: 'Notification process completed'});
  }catch(err){
    if (err.statusCode === 410 || err.statusCode === 404) {
      // remove from DB — subscription is invalid
    }
    console.error(err);
    res.status(400).json({ message: err.message || 'No subscription found for this user' });
  }
});

module.exports = router;