require('./config/database');
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const rootRouter = require('./config/rootRouter');
const env = require('./config/env');

const PORT = env.port;
const app = express();

app.use(express.json());
app.use('/api/v1', rootRouter);
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
