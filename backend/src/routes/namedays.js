const {authenticateToken} = require('../middleware/authorization');
const Nameday = require('../models/Nameday'); 
const express = require('express');
const router = express.Router();

router.get('/upcoming', authenticateToken, async (req, res) => {
    try {
        const contacts = await Nameday.getUpcomingNamedays();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;