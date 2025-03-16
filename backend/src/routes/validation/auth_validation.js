const Joi = require('joi');

module.exports = function validate(req) {
    const userSchema = Joi.object({
        email: Joi.string().min(12).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
      });
      
  return userSchema.validate(req);
}