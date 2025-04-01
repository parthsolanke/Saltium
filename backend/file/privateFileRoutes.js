// file/privateFileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('./fileController');
const { uploadMulter, handleMulterError, scanForMalware } = require('../middleware/uploadMiddleware');
const { checkDiskSpaceMiddleware } = require('../middleware/diskSpaceMiddleware');

router.post('/upload',
    uploadMulter.array('files', 10),
    checkDiskSpaceMiddleware,
    handleMulterError,
    scanForMalware,
    fileController.uploadFiles
);
router.post('/generate-token', fileController.generateDownloadLink);

router.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    
    const status = err.status || 500;
    const message = err.message || 'An unexpected error occurred';
    
    res.status(status).json({ message });
});

module.exports = router;
