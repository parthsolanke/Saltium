// file/fileController.js
const fileService = require('./fileService');
const jwtUtils = require('../utils/jwtUtils');
const File = require('../models/File');
const ShareLink = require('../models/ShareLink');
const { v4: uuidv4 } = require('uuid');
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

        const shareId = uuidv4();
        await ShareLink.create({
            shareId,
            token: downloadToken
        });

        res.status(200).json({ 
            shareId,
            expiresIn: 3600
        });
    } catch (error) {
        next(error);
    }
};

exports.downloadFile = async (req, res, next) => {
    try {
        const result = await fileService.downloadFilesWithToken(req, res);
        if (result?.error) {
            return res.status(result.status).json({ message: result.message });
        }
    } catch (error) {
        if (!res.headersSent) {
            const status = error.status || 500;
            res.status(status).json({ message: error.message || 'File download failed' });
        }
    }
};

exports.listDownloadFiles = async (req, res, next) => {
    try {
        const fileList = req.files.map(file => ({
            filename: file.name,
            id: file.id
        }));

        res.status(200).json({ 
            files: fileList,
            count: fileList.length
        });
    } catch (error) {
        next(error);
    }
};
