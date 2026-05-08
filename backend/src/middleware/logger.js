const winston = require('winston');
const config = require('../config');

const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      const safeStack = stack ? stack.replace(/\d+n/g, m => m.replace('n','')) : '';
      return `${timestamp} [${level}] ${message} ${safeStack}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
