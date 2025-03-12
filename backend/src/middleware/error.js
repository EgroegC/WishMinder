const pino = require("pino");
const logger = pino({ level: "info" });

module.exports = function(error, req, res, next){
    logger.error(error.message);
    res.status(500).send('Something failed.');
}