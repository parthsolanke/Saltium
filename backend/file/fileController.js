// file/fileController.js
const fileService = require('./fileService');

exports.uploadFile = async (req, res, next) => {
    try {
        const fileData = await fileService.uploadFile(req.file, req.user);
        res.status(201).json({ message: 'File uploaded', fileData });
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
