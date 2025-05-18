const {authenticateToken} = require('../middleware/authorization');
const NamedayService = require('../services/namedays_service'); 
const express = require('express');
const router = express.Router();

router.get('/upcoming', authenticateToken, async (req, res) => {
    const contacts = await NamedayService.getUpcomingNamedays();
    res.json(contacts);
});

module.exports = router;