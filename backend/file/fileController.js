// file/fileController.js
const fileService = require('./fileService');

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

exports.downloadFile = async (req, res, next) => {
    try {
        const fileStream = await fileService.downloadFile(req.params.fileId, req.query.token);
        fileStream.pipe(res);
    } catch (error) {
        next(error);
    }
};
