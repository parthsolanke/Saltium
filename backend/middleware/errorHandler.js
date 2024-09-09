// middleware/errorHandler.js
const logger = require('../config/logger');
const env = require("../config/env")

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
    res.status(500).json({
        message: 'An error occurred on the server. Please try again later.',
        error: env.nodeEnv === 'development' ? err.stack : null
    });
};

module.exports = errorHandler;