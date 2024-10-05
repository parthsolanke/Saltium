// middleware/diskSpaceMiddleware.js
const checkDiskSpace = require('check-disk-space').default;
const path = require('path');
const fs = require('fs');

const ensureUploadsDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const checkDiskSpaceMiddleware = async (req, res, next) => {
    try {
        const uploadDir = path.join(__dirname, '../uploads');
        ensureUploadsDirExists(uploadDir);
        const diskSpace = await checkDiskSpace(uploadDir);
        const totalSize = req.files.reduce((acc, file) => acc + file.size, 0);

        if (diskSpace.free < totalSize) {
            return res.status(507).json({ message: 'Insufficient storage space to upload files.' });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { checkDiskSpaceMiddleware };
