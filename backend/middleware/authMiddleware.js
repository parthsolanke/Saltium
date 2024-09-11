// middleware/authMiddleware.js
const jwtUtils = require('../utils/jwtUtils');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const user = jwtUtils.verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

exports.downloadAuthMiddleware = (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({ message: 'Missing download token' });
    }

    try {
        const decoded = jwtUtils.verifyToken(token);
        const { fileIds, userId } = decoded;
        req.fileIds = fileIds;
        req.userId = userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired files token' });
    }
}