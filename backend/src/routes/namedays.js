const { authenticateToken } = require('../middleware/authorization');
const NamedayService = require('../services/namedays_service');
const validateDate = require('./validation/namedays_validation');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/namedays/upcoming:
 *   get:
 *     summary: Get upcoming namedays
 *     tags: [Namedays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of upcoming namedays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nameday'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/upcoming', authenticateToken, async (req, res) => {
    const contacts = await NamedayService.getUpcomingNamedays();
    res.json(contacts);
});

/**
 * @swagger
 * /api/namedays/{date}:
 *   get:
 *     summary: Get namedays for a specific date
 *     tags: [Namedays]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-16"
 *         description: The date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: A list of namedays for the given date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *       400:
 *         description: Invalid date format. Use YYYY-MM-DD.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/:date', async (req, res) => {
    const { date } = req.params;

    const { error } = validateDate(req.params);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const names = await NamedayService.getNamedaysByDate(date);
    res.json(names);
});

module.exports = router;