// file/fileService.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { Readable } = require('stream');
const File = require('../models/File');
const logger = require('../config/logger');
const cryptoUtils = require('../utils/cryptoUtils');
const { cleanupUploads } = require('../utils/cleanupUtils')
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

const handleSingleFileDownload = async (file, res) => {
    let fileStream;
    try {
        await File.findByIdAndUpdate(file._id, { lastAccessed: new Date() });
        const { fileStream: stream, filename } = await getDecryptedFileStream(file);
        fileStream = stream;

        if (res.headersSent) return;
        
        setResponseHeaders(res, 'single', filename);

        await new Promise((resolve, reject) => {
            fileStream.on('error', (err) => {
                reject(new Error('File stream error: ' + err.message));
            });

            res.on('finish', async () => {
                await cleanupAfterDownload([file]);
                resolve();
            });

            fileStream.pipe(res);
        });

    } catch (error) {
        if (fileStream) fileStream.destroy();
        throw new Error('Error during single file download: ' + error.message);
    }
};

const handleMultipleFilesDownload = async (files, res) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    try {
        await Promise.all(files.map(file => 
            File.findByIdAndUpdate(file._id, { lastAccessed: new Date() })
        ));
        
        if (res.headersSent) return;
        
        setResponseHeaders(res, 'multiple', 'files.zip');

        return new Promise(async (resolve, reject) => {
            archive.on('error', (err) => {
                reject(new Error('Archive error: ' + err.message));
            });

            archive.on('end', async () => {
                await cleanupAfterDownload(files);
                resolve();
            });

            archive.pipe(res);

            for (const file of files) {
                const { fileStream, filename } = await getDecryptedFileStream(file);
                archive.append(fileStream, { name: filename });
            }

            await archive.finalize();
        });

    } catch (error) {
        archive.abort();
        throw new Error('Error during multiple file download: ' + error.message);
    }
};

const setResponseHeaders = (res, type, filename) => {
    if (type === 'single') {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    } else if (type === 'multiple') {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }
};

const cleanupAfterDownload = async (files) => {
    try {
        await cleanupUploads(files);
    } catch (error) {
        console.error('Error during cleanup:', error.message);
        throw new Error('Error cleaning up files after download');
    }
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
            await handleSingleFileDownload(files[0], res);
        } else {
            await handleMultipleFilesDownload(files, res);
        }

    } catch (error) {
        throw new Error(error.message || 'Error during file download');
    }
};
