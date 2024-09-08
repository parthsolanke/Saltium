const express = require('express');
const router = express.Router();
const fileController = require('./fileController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload', fileController.uploadFile);
// router.post('/generate-link/:fileId', fileController.generateDownloadLink);
router.get('/download/:fileId', fileController.downloadFile);
// router.get('/list', fileController.listFiles);
// router.delete('/:fileId', fileController.deleteFile);

module.exports = router;
