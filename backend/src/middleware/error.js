const logger = require('../config/logger')();
const rollbar = require('../config/rollbar')();

// eslint-disable-next-line no-unused-vars
module.exports = function (error, req, res, next) {
    logger.error(error.message);
    rollbar.error(error.message);
    res.status(500).send('Something failed, please try again later.');
}