const config = require("config");
const winston = require("winston");
const { combine, timestamp, printf, errors } = winston.format;

module.exports = function(){
  if (!config.get("environment")) {
    throw new Error("FATAL ERROR: ENVIRONMENT is not set in .env file");
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
      level: config.get("environment") === 'production' ? 'error' : 'info',
      transports
  });
    
  if (config.get("environment") === 'debug') {
      logger.level = 'debug';
  }

  return logger;
}