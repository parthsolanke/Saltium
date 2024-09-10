// utils/cleanupUtils.js
const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const logger = require('../config/logger');

const cleanupUploads = async (fileIds) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    try {
        for (const fileId of fileIds) {
            const file = await File.findById(fileId);

            if (file) {
                const filePath = path.join(uploadsDir, file.filename);
                try {
                    await fs.promises.unlink(filePath);
                    logger.info(`Removed file: ${file.filename}`);
                } catch (error) {
                    logger.error(`Error removing file: ${file.filename} - ${error.message}`);
                }

                await removeFileEntryFromDB(fileId);
            } else {
                logger.warn(`File not found for ID: ${fileId}`);
            }
        }
    } catch (error) {
        logger.error(`Error during cleanup: ${error.message}`);
        throw new Error('Error cleaning up specified files');
    }
};

const removeFileEntriesFromDB = async (fileIds) => {
    try {
        const result = await File.findByIdAndDelete(fileId);
        if (result) {
            logger.info(`Removed file entry from database: ${result.filename}`);
        } else {
            logger.warn(`File entry not found for ID: ${fileId}`);
        }
    } catch (error) {
        logger.error(`Error removing file entry from database: ${error.message}`);
        throw new Error('Error removing file entry from database');
    }
};

// Exporting the functions
module.exports = {
    cleanupUploads,
    removeFileEntriesFromDB
};
