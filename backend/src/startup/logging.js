const logger = require('../config/logger');
const rollbar = require('../config/rollbar');

module.exports = function(){
  process.on("uncaughtException", (err) => {
    logger.error('Uncaught Exception: ' + err.message, { stack: err.stack });
    console.error(err.stack); 
});
  
  process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled Promise Rejection: ${reason.message}`, { stack: err.stack });
    console.error(reason.stack);
});
}

