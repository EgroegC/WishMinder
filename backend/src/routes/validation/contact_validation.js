const Joi = require('joi');

function validateContact(contact) {
    const contactSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        surname: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(12).max(255).required().email(),
        phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/) // Validates international E.164 format
        .required()
        .messages({
            "string.pattern.base": "Phone number must be a valid format (e.g., +123456789 or 1234567890).",
            "any.required": "Phone number is required."
        }), 
        birthdate: Joi.date().iso().max("now").optional(),
    });
      
  return contactSchema.validate(contact);
}

module.exports = validateContact;