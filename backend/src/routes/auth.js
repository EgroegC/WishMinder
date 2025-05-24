const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user'); 
const validate = require('./validation/auth_validation');
const express = require('express');
const router = express.Router();
const {authenticateRefreshToken} = require('../middleware/authorization');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '3d' });
};

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Authenticate user and return access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(422).send(error.details[0].message);
  
    let user = await User.findByEmail(req.body.email);
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // Prevent access via JavaScript
        secure: true,   // Only send over HTTPS
        sameSite: 'None', // Prevent CSRF attacks
        path: '/' 
    });

    res.json({ accessToken });
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logs out user by clearing the refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Successfully logged out
 *       500:
 *         description: Internal server error
 */
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/' 
    });

    return res.sendStatus(204);
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refreshes access token using refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns new access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       403:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
router.post('/refresh', authenticateRefreshToken, (req, res) => {
    const accessToken = generateAccessToken(req.user);
    res.json({ accessToken });
})

module.exports = router;
