const express = require('express');
const router = express.Router();
const webpush = require('web-push');

const subscriptions = [];

router.post('/subscribe', express.json(), (req, res) => {
    const subscription = req.body;

    subscriptions.push(subscription);
  
    res.status(201).json({ message: 'Subscription received' });
});

module.exports = router;