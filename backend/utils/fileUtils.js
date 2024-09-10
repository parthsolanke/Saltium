// utils/fileUtils.js
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const generateFileHash = (buffer) => {
    return crypto.createHash('md5').update(buffer).digest('hex');
};

const sanitize = (fileName) => {
    return fileName.replace(/[^a-z0-9_.-]/gi, '_');
};

const ensureUploadsDirExists = () => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    return uploadsDir;
};

// Mock malware scanner, TODO:
const scanFile = async (file) => {
    const isMalicious = false;
    return isMalicious;
};

module.exports = {
    generateFileHash,
    sanitize,
    ensureUploadsDirExists,
    scanFile,
};
