const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const cryptoUtils = require('../utils/cryptoUtils');
const jwtUtils = require('../utils/jwtUtils');

exports.uploadFile = async (file, user) => {
    const encryptedBuffer = await cryptoUtils.encryptFile(file.buffer);
    const filePath = path.join(__dirname, '..', 'uploads', `${Date.now()}-${file.originalname}`);
    fs.writeFileSync(filePath, encryptedBuffer);

    const fileData = new File({
        filename: file.originalname,
        filePath,
        uploadedBy: user._id,
        encrypted: true,
    });

    return await fileData.save();
};

exports.downloadFile = async (fileId, token) => {
    const validToken = jwtUtils.verifyToken(token);
    if (!validToken) throw new Error('Invalid or expired token');

    const fileData = await File.findById(fileId);
    if (!fileData) throw new Error('File not found');

    const fileBuffer = fs.readFileSync(fileData.filePath);
    const decryptedBuffer = await cryptoUtils.decryptFile(fileBuffer);

    return fs.createReadStream(decryptedBuffer);
};
