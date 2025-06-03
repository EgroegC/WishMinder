const { authenticateToken } = require('../middleware/authorization');
const Messages = require('../models/messages');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all birthday or nameday messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [birthday, nameday]
 *         required: true
 *         description: Type of messages to retrieve
 *     responses:
 *       200:
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid type query
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, async (req, res) => {
  const { type } = req.query;

  if (!type || (type !== 'birthday' && type !== 'nameday')) {
    return res.status(400).json({ error: "Invalid type" });
  }

  const messages = await Messages.getAllMessages(type);

  if (!messages) {
    throw new Error("Failed to retrieve messages");
  }

  res.json(messages);
});

module.exports = router;