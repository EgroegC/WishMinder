const winston = require("winston");
const { combine, timestamp, printf, errors } = winston.format;

module.exports = function(){
  if (!process.env.NODE_ENV) {
    throw new Error("FATAL ERROR: NODE_ENV is not set in .env file");
  }
  
  const logFormat = printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} [${level}]: ${message} ${stack || ''}`;
  });
  
  const transports = [
      new winston.transports.Console({
        format: combine(
          timestamp(),
          errors({ stack: true }),
          logFormat
        )
      })
  ];
  
  const logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
      transports
  });

  if (process.env.NODE_ENV === 'debug') {
      logger.level = 'debug';
  }

  return logger;
}