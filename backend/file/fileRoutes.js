// file/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('./fileController');
const { downloadAuthMiddleware } = require('../middleware/authMiddleware')
const { uploadMulter, handleMulterError, scanForMalware } = require('../middleware/uploadMiddleware')

router.post('/upload', uploadMulter.array('files', 10), handleMulterError, scanForMalware, fileController.uploadFiles);
router.post('/generate-link', fileController.generateDownloadLink);
router.get('/download', downloadAuthMiddleware, fileController.downloadFile);

module.exports = router;
