const cron = require('node-cron');
const File = require('../models/File');
const logger = require('../config/logger');
const { deleteFromS3 } = require('./s3Service');

const HALF_HOUR_IN_MS = 1800000;

async function cleanupOldFiles() {
    try {
        const oneHourAgo = new Date(Date.now() - HALF_HOUR_IN_MS);
        const filesToDelete = await File.find({ lastAccessed: { $lt: oneHourAgo } });

        for (const file of filesToDelete) {
            try {
                await deleteFromS3(file.s3Key);
                await File.deleteOne({ _id: file._id });
                logger.info(`Cleaned up old file from S3: ${file.filename}`);
            } catch (err) {
                logger.error(`Error cleaning up file ${file.filename}:`, err);
            }
        }
    } catch (error) {
        logger.error('Cleanup job error:', error);
    }
}

exports.initCleanupJob = () => {
    cron.schedule('*/15 * * * *', cleanupOldFiles);
    logger.info('File cleanup job initialized');
};
