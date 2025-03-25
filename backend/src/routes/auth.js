const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user/user'); 
const validate = require('./validation/auth_validation');
const express = require('express');
const router = express.Router();
const {authenticateRefreshToken} = require('../middleware/authorization');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '7d' });
};

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findByEmail(req.body.email);
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,  // Prevent access via JavaScript
        secure: true,    // Only send over HTTPS
        sameSite: 'Strict', // Prevent CSRF attacks
    });

    res.json({ accessToken });
});

router.post('/refresh', authenticateRefreshToken, (req, res) => {
    const accessToken = generateAccessToken(req.user);
    res.json({ accessToken });
})

module.exports = router;
