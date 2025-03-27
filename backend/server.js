// server.js
require("./config/database");
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const privateRouter = require('./config/privateRouter')
const publicRouter = require('./config/publicRouter')
const env = require('./config/env');
const logger = require('./config/logger');

const app = express();
const PORT = env.port;

const corsOption = {
    origin: env.allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOption));
app.use(morgan('tiny', { stream: logger.stream }));
app.use(express.json());

app.use('/api/v1/private', apiLimiter, privateRouter);
// app.use('/api/v1/public', apiLimiter, publicRouter);

app.use(errorHandler);

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // Graceful shutdown
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    // Graceful shutdown
    process.exit(1);
});

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
