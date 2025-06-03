const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger/swagger');

module.exports = function (app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}