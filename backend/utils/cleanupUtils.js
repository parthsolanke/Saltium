// utils/cleanupUtils.js
const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const logger = require('../config/logger');

const cleanupUploads = async (files) => {
    try {
        for (const file of files) {
            try {
                await fs.promises.unlink(file.filePath);
                logger.info(`Removed file: ${file.filename}`);
                await removeFileEntryFromDB(file._id);
            } catch (error) {
                logger.error(`Error removing file: ${file.filename} - ${error.message}`);
            }
        }
    } catch (error) {
        logger.error(`Error during cleanup: ${error.message}`);
        throw new Error('Error cleaning up specified files');
    }
};

const removeFileEntryFromDB = async (fileId) => {
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

module.exports = {
    cleanupUploads,
    removeFileEntryFromDB,
};
