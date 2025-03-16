const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user/user'); 
const validate = require('./validation/auth_validation');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findByEmail(req.body.email);
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    const token = jwt.sign({ id: user.id }, process.env.JOB_TRACKER_JWT_PRIVATE_KEY);
    res.send(token);
});

module.exports = router;
