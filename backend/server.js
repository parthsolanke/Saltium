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
const { initCleanupJob } = require('./utils/cleanupJob');

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

initCleanupJob();

app.use('/api/v1/private', apiLimiter, privateRouter);
// app.use('/api/v1/public', apiLimiter, publicRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
