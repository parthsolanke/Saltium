const express = require('express');
const authRoutes = require('../auth/authRoutes');
const fileRoutes = require('../file/fileRoutes');
const errorHandler = require('../middleware/errorHandler');
const authMiddleware = require('../middleware/authMiddleware');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/files', authMiddleware, fileRoutes);

app.use(errorHandler);

module.exports = app;
