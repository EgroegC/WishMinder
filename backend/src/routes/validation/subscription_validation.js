const Joi = require('joi');

function validatePushSubscription(subscription) {
  const schema = Joi.object({
    endpoint: Joi.string().uri().required(),
    expirationTime: Joi.number().optional().allow(null),
    keys: Joi.object({
      p256dh: Joi.string().required(),
      auth: Joi.string().required()
    }).required()
  });

  return schema.validate(subscription);
}

function validateNotificationPayload(payload) {
  const schema = Joi.object({
    title: Joi.string().max(100).required(),
    body: Joi.string().max(500).required(),
    data: Joi.object({
      url: Joi.string().uri().required()
    }).required()
  });

  return schema.validate(payload);
}

module.exports = {
    validatePushSubscription,
    validateNotificationPayload
  };
  
