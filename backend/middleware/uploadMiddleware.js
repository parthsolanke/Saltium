// middleware/uploadMiddleware.js
const multer = require('multer');
const { MulterError } = require('multer')
const env = require("../config/env");
const fileUtils = require('../utils/fileUtils');

exports.uploadMulter = multer({
    limits: {
        fileSize: parseInt(env.maxFileSize) * 1024 * 1024,
        files: 10
    },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
})

exports.handleMulterError = (err, req, res, next) => {
    if (err instanceof MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(413).json({ message: 'File too large. Maximum allowed size is ' + env.maxFileSize + ' MB.' });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({ message: 'Too many files uploaded. Maximum allowed is 10.' });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({ message: 'Unexpected file field encountered.' });
            default:
                return res.status(400).json({ message: `Multer error: ${err.message}` });
        }
    }
    next(err);
};

exports.scanForMalware = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }

        for (const file of req.files) {
            const isMalicious = await fileUtils.scanFile(file);
            if (isMalicious) {
                return res.status(400).json({ message: `Malware detected in file: ${file.originalname}` });
            }
        }
        next();
    } catch (error) {
        next(error);
    }
};
