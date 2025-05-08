const Joi = require('joi');

function validateContact(contact) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const contactSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        surname: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(12).max(255).required().email(),
        phone: Joi.string()
            .pattern(/^\+?[1-9]\d{1,14}$/)
            .required()
            .messages({
                "string.pattern.base": "Phone number must be a valid format (e.g., +123456789 or 1234567890).",
                "any.required": "Phone number is required."
            }), 
        birthdate: Joi.date().iso()
            .max(oneYearAgo).optional()
            .messages({'date.base': 'Birthdate must be a valid date.',
                'date.format': 'Birthdate must be in ISO format (YYYY-MM-DD).',
                'date.max': `Birthdate must be at least one year before today.`,}),
    });

    return contactSchema.validate(contact);
}

module.exports = validateContact;