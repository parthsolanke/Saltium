// server.js
require("./config/database")
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/ratelimiter');
const rootRouter = require('./config/rootRouter');
const env = require('./config/env');
const logger = require('./config/logger');

const app = express();
const PORT = env.port;

app.use(cors());
app.use(morgan('tiny', { stream: logger.stream }));
app.use(express.json());
app.use('/api/v1', apiLimiter, rootRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
