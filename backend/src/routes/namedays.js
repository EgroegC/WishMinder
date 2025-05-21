const {authenticateToken} = require('../middleware/authorization');
const NamedayService = require('../services/namedays_service'); 
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

module.exports = router;