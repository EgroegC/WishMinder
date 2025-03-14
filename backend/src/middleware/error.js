const logger = require('../config/logger')();
const rollbar = require('../config/rollbar')();

module.exports = function(error, req, res, next){
    logger.error(error.message);
    rollbar.error(error.message);
    res.status(500).send('Something failed.');
}