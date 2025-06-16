const { authenticateToken } = require('../middleware/authorization');
const CelebrationService = require('../services/celebration_service');
const { decryptContact } = require('../utils/contact_encryption');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/celebrations/today:
 *   get:
 *     summary: Get today's contact's celebrations (birthdays and namedays) for the authenticated user
 *     tags: [Today's Celebrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of celebrations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Celebration'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.id
    const celebrations = await CelebrationService.getTodaysCelebrationsForUser(user_id);
    const decryptedCelebrations = celebrations.map(celebration => ({
        ...celebration,
        ...decryptContact({
            user_id: celebration.user_id,
            name: celebration.name,
            surname: celebration.surname,
            phone: celebration.phone,
            email: celebration.email,
            birthdate: celebration.birthdate,
        }),
    }));
    res.json(decryptedCelebrations);
});

module.exports = router;