const Joi = require('joi');

module.exports = function validateDate(params) {
    const schema = Joi.object({
        date: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .required()
            .messages({
                'string.pattern.base': 'Date must be in YYYY-MM-DD format.',
            }),
    });

    return schema.validate(params);
};