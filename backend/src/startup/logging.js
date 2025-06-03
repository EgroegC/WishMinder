const logger = require('../config/logger')();

module.exports = function () {
  process.on("uncaughtException", (err) => {
    logger.error('Uncaught Exception: ' + err.message, { stack: err.stack });
    console.error(err.stack);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled Promise Rejection: ${reason.message}`, { stack: reason.stack });
    console.error(reason.stack);
  });
}

