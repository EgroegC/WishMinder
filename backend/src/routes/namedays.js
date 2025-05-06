const {authenticateToken} = require('../middleware/authorization');
const Nameday = require('../models/Nameday'); 
const express = require('express');
const router = express.Router();

router.get('/upcoming', authenticateToken, async (req, res) => {
    const contacts = await Nameday.getUpcomingNamedays();
    res.json(contacts);
});

module.exports = router;