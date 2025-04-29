const {authenticateToken} = require('../middleware/authorization');
const Messages = require('../models/messages');
const express = require('express');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    
    const { type } = req.query;

    if (!type || (type !== 'birthday' && type !== 'nameday')) {
        return res.status(400).json({ error: "Invalid type" });
    }

    try {
        const messages = await Messages.getAllMessages(type);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;