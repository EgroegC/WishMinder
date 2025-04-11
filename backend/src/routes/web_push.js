const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const {authenticateToken} = require('../middleware/authorization');

const subscriptions = [];

router.post('/subscribe', authenticateToken, express.json(), (req, res) => {
  const subscription = req.body;

  if (!subscription) {
    return res.status(400).json({ message: 'No subscription provided' });
  }

  subscriptions.push(subscription);

  res.status(201).json({ message: 'Subscription received' });
});

module.exports = router;