const winston = require('winston');
const path = require('path');
const fs = require('fs-extra');
const config = require('../../config/config.json');

// Ensure log directory exists
const logDir = config.logging.path;
fs.ensureDirSync(logDir);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level || 'info',
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logDir, 'test-execution.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // File transport for errors only
    new winston.transports.File({
      filename: path.join(logDir, 'errors.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Add helper methods
logger.step = (message) => {
  logger.info(`STEP: ${message}`);
};

logger.scenario = (message) => {
  logger.info(`\n${'='.repeat(80)}\nSCENARIO: ${message}\n${'='.repeat(80)}`);
};

module.exports = logger;
