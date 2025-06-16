const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
