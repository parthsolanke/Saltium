// file/fileController.js
const fileService = require('./fileService');
const jwtUtils = require('../utils/jwtUtils');
const File = require('../models/File');
const { sanitizeFileResponse } = require('../utils/responseUtils');

exports.uploadFiles = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }
        const fileDataArray = await fileService.uploadFiles(req.files, req.user);
        const sanitizedFiles = fileDataArray.map(sanitizeFileResponse);
        
        res.status(201).json({ 
            message: 'Files uploaded successfully', 
            files: sanitizedFiles 
        });
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

        const files = await File.find({ _id: { $in: fileIds }, uploadedBy: req.user.id })
            .select('_id filename');
            
        if (files.length !== fileIds.length) {
            return res.status(404).json({ message: 'Some files not found or not authorized' });
        }

        const fileInfo = files.map(f => ({ id: f._id, name: f.filename }));
        const downloadToken = jwtUtils.generateFileDownloadToken({ 
            userId: req.user.id,
            files: fileInfo
        });

        res.status(200).json({ 
            token: downloadToken,
            expiresIn: 3600
        });
    } catch (error) {
        next(error);
    }
};

exports.downloadFile = async (req, res, next) => {
    try {
        // Extract fileIds from files array in token
        req.fileIds = req.files.map(file => file.id);
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
