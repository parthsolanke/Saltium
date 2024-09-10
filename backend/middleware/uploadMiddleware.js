// middleware/uploadMiddleware.js
const multer = require('multer');
const env = require("../config/env");
const fileUtils = require('../utils/fileUtils');

exports.uploadMulter = multer({
    limits: {
        fileSize: parseInt(env.maxFileSize) * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
})

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
