const _ = require('lodash');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/user/user'); 
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findByEmail(req.body.email);
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    const token = jwt.sign({ id: user.id }, config.get('jwtPrivateKey'));
    res.send(token);
});


function validate(req) {
    const userSchema = Joi.object({
        email: Joi.string().min(9).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
      });
      
  return userSchema.validate(req);
}


module.exports = router;
