const {authenticateToken} = require('../middleware/authorization');
const CelebrationService = require('../services/celebration_service'); 
const express = require('express');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.id

    try {
      const celebrations = await CelebrationService.getTodaysCelebrationsForUser(user_id);
      res.json(celebrations); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching celebrations');
    }
});

module.exports = router;