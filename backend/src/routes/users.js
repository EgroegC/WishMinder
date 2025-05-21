const {authenticateToken} = require('../middleware/authorization');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const validate = require('./validation/user_validation');
const User = require('../models/user'); 
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current authenticated user's data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's basic info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No user found with the given ID
 *       500:
 *         description: Internal server error
 */
router.get('/me', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user){ return res.status(404).send(`No user found with this id: ${req.user.id}`); }
    res.send(_.pick(user, ['id', 'name', 'email']));
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       200:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findByEmail(req.body.email);
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();
    
    res.send(_.pick(user, ['id', 'name', 'email']));
});

module.exports = router;
