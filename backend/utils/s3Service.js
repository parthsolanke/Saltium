const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const env = require('../config/env');
const logger = require('../config/logger');

const s3Client = new S3Client({
    region: env.awsRegion,
    credentials: {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey
    }
});

const getPresignedUrl = async (key, expiresIn = 3600) => {
    try {
        const command = new GetObjectCommand({
            Bucket: env.awsBucketName,
            Key: key
        });
        return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
        logger.error('Error generating pre-signed URL:', error);
        throw new Error('Failed to generate pre-signed URL');
    }
};

const uploadToS3 = async (buffer, key) => {
    try {
        const command = new PutObjectCommand({
            Bucket: env.awsBucketName,
            Key: key,
            Body: buffer
        });
        await s3Client.send(command);
        return `s3://${env.awsBucketName}/${key}`;
    } catch (error) {
        logger.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};

const getS3Stream = async (key) => {
    const command = new GetObjectCommand({
        Bucket: env.awsBucketName,
        Key: key
    });
    const response = await s3Client.send(command);
    return response.Body;
};

const deleteFromS3 = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: env.awsBucketName,
        Key: key
    });
    await s3Client.send(command);
};

module.exports = { 
    uploadToS3, 
    getS3Stream, 
    deleteFromS3,
    getPresignedUrl
};
