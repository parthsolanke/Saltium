// file/privateFileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('./fileController');
const { downloadAuthMiddleware } = require('../middleware/authMiddleware');
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
router.get('/download', downloadAuthMiddleware, fileController.downloadFile);

module.exports = router;
