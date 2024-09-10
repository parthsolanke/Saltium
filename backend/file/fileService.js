// file/fileService.js
const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const logger = require('../config/logger');
const cryptoUtils = require('../utils/cryptoUtils');
const jwtUtils = require('../utils/jwtUtils');
const fileUtils = require('../utils/fileUtils')

const checkIfFileExists = async (fileHash, userId) => {
    return await File.findOne({ fileHash, uploadedBy: userId });
};

const saveFileToDisk = (filePath, bufferToSave) => {
    fs.writeFileSync(filePath, bufferToSave);
};

const createFileRecord = async (file, filePath, userId) => {
    const fileData = new File({
        filename: fileUtils.sanitize(file.originalname),
        filePath,
        fileHash: fileUtils.generateFileHash(file.buffer),
        uploadedBy: userId,
        encrypted: true,
    });

    try {
        return await fileData.save();
    } catch (err) {
        if (err.code === 11000) {
            logger.log(`Duplicate file entry detected for ${file.originalname}.`);
            return await File.findOne({ fileHash: fileData.fileHash, uploadedBy: userId });
        } else {
            throw err;
        }
    }
};

exports.uploadFiles = async (files, user) => {
    try {
        const fileDataArray = [];
        const uploadsDir = fileUtils.ensureUploadsDirExists();

        for (const file of files) {
            const fileHash = fileUtils.generateFileHash(file.buffer);
            const existingFile = await checkIfFileExists(fileHash, user.id);

            if (existingFile) {
                console.log(`File ${file.originalname} with hash ${fileHash} already exists for user ${user.id}.`);
                fileDataArray.push(existingFile);
                continue;
            }

            const filePath = path.join(uploadsDir, `${fileHash}-${fileUtils.sanitize(file.originalname)}`);
            const bufferToSave = cryptoUtils.encryptFile(file.buffer);
            saveFileToDisk(filePath, bufferToSave);

            const fileData = await createFileRecord(file, filePath, user.id);
            fileDataArray.push(fileData);
        }

        return fileDataArray;
    } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
    }
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
