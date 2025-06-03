const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authorization');
const PushSubscription = require('../models/push_subscription');
const logger = require('../config/logger')();
const rollbar = require('../config/rollbar')();
const sendNotification = require('../utils/sendNotification');
const { validatePushSubscription,
  validateNotificationPayload } = require('./validation/subscription_validation');

/**
 * @swagger
 * /api/notification/subscribe:
 *   post:
 *     summary: Subscribe user to push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PushSubscription'
 *     responses:
 *       201:
 *         description: Subscription stored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription stored
 *       400:
 *         description: Invalid subscription format
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/subscribe', authenticateToken, express.json(), async (req, res) => {

  const { error } = validatePushSubscription(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const subscription = req.body;
  const userId = req.user.id;
  const userAgent = req.headers['user-agent'];

  await PushSubscription.createOrUpdate(userId, subscription, userAgent);
  res.status(201).json({ message: 'Subscription stored' });
});

/**
 * @swagger
 * /api/notification/send:
 *   post:
 *     summary: Send push notification to user's subscriptions
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationPayload'
 *     responses:
 *       200:
 *         description: Notification process completed
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Invalid notification payload
 *       500:
 *         description: Something went wrong
 */
router.post('/send', authenticateToken, express.json(), async (req, res) => {

  const { error } = validateNotificationPayload(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const user_id = req.user.id;
  const payload = JSON.stringify(req.body);

  try {
    await sendNotification(user_id, payload);
    res.status(200).json({ message: 'Notification process completed' });
  } catch (err) {
    logger.error(`User ID: ${user_id} - Notification setup failed: ${err.message}`, {
      stack: err.stack
    });
    rollbar.error(`User ID: ${user_id} - Notification setup failed`, err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router 