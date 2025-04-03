// config/env.js
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const envFilePath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
    logger.info('Using environment variables from .env file');
} else {
    logger.info('No local .env file found, using Docker environment variables');
}

const requiredEnv = [
    'PORT',
    'NODE_ENV',
    'MONGO_URI',
    'JWT_SECRET',
    'SECRET_KEY',
    'JWT_EXPIRATION',
    'MAX_FILE_SIZE',
    'ALLOWED_ORIGINS',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_BUCKET_NAME',
];

const missingEnv = requiredEnv.filter((envVar) => !process.env[envVar]);

if (missingEnv.length) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
}

module.exports = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    secretKey: process.env.SECRET_KEY,
    jwtExpiration: process.env.JWT_EXPIRATION,
    maxFileSize: process.env.MAX_FILE_SIZE,
    allowedOrigins: process.env.ALLOWED_ORIGINS,
    awsRegion: process.env.AWS_REGION,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsBucketName: process.env.AWS_BUCKET_NAME,
};
