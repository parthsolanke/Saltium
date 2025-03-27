const sanitizeFileResponse = (file) => {
    return {
        id: file._id,
        filename: file.filename,
        createdAt: file.createdAt,
    };
};

exports.sanitizeFileResponse = sanitizeFileResponse;
