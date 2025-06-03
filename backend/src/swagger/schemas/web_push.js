module.exports = {
  PushSubscription: {
    type: 'object',
    required: ['endpoint', 'expirationTime', 'keys'],
    properties: {
      endpoint: { type: 'string', format: 'uri' },
      expirationTime: { type: ['string', 'null'] },
      keys: {
        type: 'object',
        required: ['p256dh', 'auth'],
        properties: {
          p256dh: { type: 'string' },
          auth: { type: 'string' },
        },
      },
    },
  },

  NotificationPayload: {
    type: 'object',
    required: ['title', 'body', 'data'],
    properties: {
      title: { type: 'string', maxLength: 100 },
      body: { type: 'string', maxLength: 500 },
      data: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string', format: 'uri' }
        }
      }
    }
  }
};
