// config/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const path = require('path');

const minimalFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        minimalFormat
    ),
    transports: [
        new transports.Console({
            format: combine(
                format.simple()
            )
        }),
        new transports.File({
            filename: path.resolve(__dirname, '../logs/error.log'),
            level: 'error',
        }),
        new transports.File({
            filename: path.resolve(__dirname, '../logs/combined.log'),
            level: 'info',
        })
    ],
});

logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

module.exports = logger;
