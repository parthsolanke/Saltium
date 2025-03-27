const cron = require('node-cron');
const File = require('../models/File');
const logger = require('../config/logger');
const fs = require('fs/promises');

const HOUR_IN_MS = 3600000;

async function cleanupOldFiles() {
    try {
        const oneHourAgo = new Date(Date.now() - HOUR_IN_MS);
        const filesToDelete = await File.find({ lastAccessed: { $lt: oneHourAgo } });

        for (const file of filesToDelete) {
            try {
                await fs.unlink(file.filePath);
                await File.deleteOne({ _id: file._id });
                logger.info(`Cleaned up old file: ${file.filename}`);
            } catch (err) {
                logger.error(`Error cleaning up file ${file.filename}:`, err);
            }
        }
    } catch (error) {
        logger.error('Cleanup job error:', error);
    }
}

exports.initCleanupJob = () => {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', cleanupOldFiles);
    logger.info('File cleanup job initialized');
};
