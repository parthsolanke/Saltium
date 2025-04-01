const express = require('express');
const router = express.Router();
const fileController = require('./fileController');
const { downloadAuthMiddleware } = require('../middleware/authMiddleware');

router.get('/list/:shareId', downloadAuthMiddleware, fileController.listDownloadFiles);
router.get('/list', downloadAuthMiddleware, fileController.listDownloadFiles);
router.get('/download/:shareId', downloadAuthMiddleware, fileController.downloadFile);
router.get('/download', downloadAuthMiddleware, fileController.downloadFile);

router.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'An unexpected error occurred' });
});

module.exports = router;
