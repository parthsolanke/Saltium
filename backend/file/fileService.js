// file/fileService.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { Readable } = require('stream');
const File = require('../models/File');
const logger = require('../config/logger');
const cryptoUtils = require('../utils/cryptoUtils');
const jwtUtils = require('../utils/jwtUtils');
const fileUtils = require('../utils/fileUtils')

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
            logger.info(`Duplicate file entry detected for ${file.originalname}.`);
            return await File.findOne({ fileHash: fileData.fileHash, uploadedBy: userId });
        } else {
            throw err;
        }
    }
};

const getDecryptedFileStream = async (file) => {
    const fileBuffer = fs.readFileSync(file.filePath);
    const decryptedBuffer = await cryptoUtils.decryptFile(fileBuffer);
    const fileStream = Readable.from(decryptedBuffer);
    return {
        fileStream,
        filename: file.filename
    };
};

exports.uploadFiles = async (files, user) => {
    try {
        const fileDataArray = [];
        const uploadsDir = fileUtils.ensureUploadsDirExists();

        for (const file of files) {
            const fileHash = fileUtils.generateFileHash(file.buffer, user.id);
            const existingFile = await File.findOne({ fileHash, uploadedBy: user.id });

            if (existingFile) {
                logger.info(`File ${file.originalname} with hash ${fileHash} already exists for user ${user.id}.`);
                fileDataArray.push(existingFile);
                continue;
            }

            const filePath = path.join(uploadsDir, `${fileHash}-${fileUtils.sanitize(file.originalname)}`);
            const bufferToSave = cryptoUtils.encryptFile(file.buffer);
            fileUtils.saveFileToDisk(filePath, bufferToSave);

            const fileData = await createFileRecord(file, filePath, user.id);
            fileDataArray.push(fileData);
        }

        return fileDataArray;
    } catch (error) {
        logger.error('Error uploading files:', error);
        throw error;
    }
};

exports.downloadFilesWithToken = async (req, res) => {
    try {
        const files = await File.find({ _id: { $in: req.fileIds }, uploadedBy: req.userId });
        if (!files || files.length === 0) throw new Error('Files not found or unauthorized access.');

        if (files.length === 1) {
            const { fileStream, filename } = await getDecryptedFileStream(files[0]);
            return { fileStream, filename, singleFile: true };
        }
        const archive = archiver('zip', { zlib: { level: 9 } });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=files.zip');

        archive.pipe(res);

        for (const file of files) {
            const { fileStream, filename } = await getDecryptedFileStream(file);
            archive.append(fileStream, { name: filename });
        }

        await archive.finalize();

        return { singleFile: false };

    } catch (error) {
        throw new Error(error.message || 'Error during file download');
    }
};
