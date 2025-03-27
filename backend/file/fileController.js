// file/fileController.js
const fileService = require('./fileService');
const jwtUtils = require('../utils/jwtUtils');
const File = require('../models/File');

exports.uploadFiles = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }
        const fileDataArray = await fileService.uploadFiles(req.files, req.user);
        res.status(201).json({ message: 'Files uploaded', fileDataArray });
    } catch (error) {
        next(error);
    }
};

exports.generateDownloadLink = async (req, res, next) => {
    try {
        const { fileIds } = req.body;
        if (!fileIds || fileIds.length === 0) {
            return res.status(400).json({ message: 'No file IDs provided' });
        }

        const files = await File.find({ _id: { $in: fileIds }, uploadedBy: req.user.id });
        if (files.length !== fileIds.length) {
            return res.status(404).json({ message: 'Some files not found or not authorized' });
        }

        const downloadToken = jwtUtils.generateFileDownloadToken({ fileIds, userId: req.user.id });
        const downloadLink = `${req.protocol}://${req.get('host')}/api/v1/private/files/download?token=${downloadToken}`;

        res.status(200).json({ downloadLink, message: 'Download link generated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.downloadFile = async (req, res, next) => {
    try {
        await fileService.downloadFilesWithToken(req, res);
        
        res.on('error', (error) => {
            console.error('Response error:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Download stream error' });
            }
        });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: 'File download failed' });
        }
        next(error);
    }
};
