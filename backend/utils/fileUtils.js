// utils/fileUtils.js
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const generateFileHash = (buffer, id) => {
    try {
        const hash = crypto.createHash('md5');
        hash.update(String(id));
        const chunkSize = 64 * 1024;
        for (let offset = 0; offset < buffer.length; offset += chunkSize) {
            const chunk = buffer.slice(offset, offset + chunkSize);
            hash.update(chunk);
        }
        return hash.digest('hex');
    } catch (error) {
        throw new Error(`Failed to generate file hash: ${error}`);
    }
};

const sanitize = (fileName) => {
    return fileName.replace(/[^a-z0-9_.-]/gi, '_');
};

const saveFileToDisk = (filePath, bufferToSave) => {
    fs.writeFileSync(filePath, bufferToSave);
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
    saveFileToDisk,
};
