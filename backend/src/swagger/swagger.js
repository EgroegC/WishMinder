const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const contactSchemas = require('./schemas/contact');
const authSchemas = require('./schemas/auth');
const messagesSchemas = require('./schemas/messages');
const namedaysSchemas = require('./schemas/namedays');
const todaysCelebrationsSchemas = require('./schemas/todays_celebrations');
const userSchemas = require('./schemas/user');
const webPushSchemas = require('./schemas/web_push');

const apiUrl = process.env.API_URL || 'http://localhost:3000/';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WishMinder API',
      version: '1.0.0',
      description: 'API for reminding namedays and birthdays',
    },
    servers: [
      {
        url: apiUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ...contactSchemas,
        ...authSchemas,
        ...messagesSchemas,
        ...namedaysSchemas,
        ...todaysCelebrationsSchemas,
        ...userSchemas,
        ...webPushSchemas,
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
