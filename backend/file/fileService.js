// file/fileService.js
const archiver = require('archiver');
const File = require('../models/File');
const ShareLink = require('../models/ShareLink');
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

const handleFileDownload = async (files, res, shareId) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    try {
        await Promise.all(files.map(file => 
            File.findByIdAndUpdate(file._id, { lastAccessed: new Date() })
        ));
        
        if (res.headersSent) return;

        // Always set zip headers
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="files.zip"`);

        return new Promise(async (resolve, reject) => {
            archive.on('error', (err) => {
                reject(new Error('Archive error: ' + err.message));
            });

            archive.on('end', async () => {
                await cleanupAfterDownload(files, shareId);
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
        throw new Error('Error during file download: ' + error.message);
    }
};

const cleanupAfterDownload = async (files, shareId) => {
    try {
        // Delete files from S3 and database
        for (const file of files) {
            await deleteFromS3(file.s3Key);
            await File.deleteOne({ _id: file._id });
            logger.info(`Cleaned up file after download: ${file.filename}`);
        }
        // Delete the shareLink entry
        if (shareId) {
            await ShareLink.deleteOne({ shareId });
            logger.info(`Cleaned up ShareLink: ${shareId}`);
        }
    } catch (error) {
        logger.error('Error during cleanup:', error);
        throw new Error('Error cleaning up after download');
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
        
        if (!files || files.length === 0) {
            if (req.params.shareId || req.query.shareId) {
                await ShareLink.deleteOne({ shareId: req.params.shareId || req.query.shareId });
            }
            return {
                error: true,
                status: 404,
                message: 'Files not found or unauthorized access'
            };
        }

        const shareId = req.params.shareId || req.query.shareId;
        await handleFileDownload(files, res, shareId);
        return null;

    } catch (error) {
        if (!res.headersSent) {
            return {
                error: true,
                status: error.status || 500,
                message: error.message || 'Error during file download'
            };
        }
        logger.error('Error after headers sent:', error);
        return null;
    }
};
