// file/fileService.js
const archiver = require('archiver');
const File = require('../models/File');
const logger = require('../config/logger');
const cryptoUtils = require('../utils/cryptoUtils');
const fileUtils = require('../utils/fileUtils')
const { uploadToS3, getS3Stream, deleteFromS3 } = require('../utils/s3Service');
const { Readable } = require('stream');

const createFileRecord = async (file, s3Data, userId) => {
    const fileData = new File({
        filename: fileUtils.sanitize(file.originalname),
        s3Key: s3Data.key,
        s3Location: s3Data.location,
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
    try {
        const s3Stream = await getS3Stream(file.s3Key);
        const chunks = [];
        for await (const chunk of s3Stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        
        const decryptedBuffer = cryptoUtils.decryptFile(buffer);
        return {
            fileStream: Readable.from(decryptedBuffer),
            filename: file.filename
        };
    } catch (error) {
        throw new Error(`Failed to get decrypted stream: ${error.message}`);
    }
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
        for (const file of files) {
            await deleteFromS3(file.s3Key);
            await File.deleteOne({ _id: file._id });
            logger.info(`Cleaned up file after download: ${file.filename}`);
        }
    } catch (error) {
        logger.error('Error during cleanup:', error);
        throw new Error('Error cleaning up files after download');
    }
};

exports.uploadFiles = async (files, user) => {
    try {
        const fileDataArray = [];

        for (const file of files) {
            const fileHash = fileUtils.generateFileHash(file.buffer, user.id);
            const existingFile = await File.findOne({ fileHash, uploadedBy: user.id });

            if (existingFile) {
                logger.info(`File ${file.originalname} already exists for user ${user.id}`);
                fileDataArray.push(existingFile);
                continue;
            }

            const encryptedBuffer = cryptoUtils.encryptFile(file.buffer);
            const s3Key = `${user.id}/${fileHash}-${fileUtils.sanitize(file.originalname)}`;
            const s3Location = await uploadToS3(encryptedBuffer, s3Key);
            
            const fileData = await createFileRecord(file, { key: s3Key, location: s3Location }, user.id);
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
