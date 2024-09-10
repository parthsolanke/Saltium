// file/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('./fileController');
const { uploadMulter, scanForMalware } = require('../middleware/uploadMiddleware')

router.post('/upload', uploadMulter.array('files', 10), scanForMalware, fileController.uploadFiles);
// router.post('/generate-link/:fileId', fileController.generateDownloadLink);

router.get('/download/:fileId', fileController.downloadFile);
// router.get('/list', fileController.listFiles);
// router.delete('/:fileId', fileController.deleteFile);

module.exports = router;
