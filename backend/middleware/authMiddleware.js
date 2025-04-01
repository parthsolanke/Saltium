// middleware/authMiddleware.js
const jwtUtils = require('../utils/jwtUtils');
const ShareLink = require('../models/ShareLink');

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

exports.downloadAuthMiddleware = async (req, res, next) => {
    try {
        const shareId = req.query.shareId || req.params.shareId;
        if (!shareId) {
            return res.status(401).json({ message: 'Share ID is required' });
        }

        const shareLink = await ShareLink.findOne({ shareId });
        if (!shareLink) {
            return res.status(404).json({ message: 'Share link not found or expired' });
        }

        const decoded = jwtUtils.verifyToken(shareLink.token);
        req.userId = decoded.u;
        req.files = decoded.f.map(file => ({
            id: file.i,
            name: file.n
        }));
        req.fileIds = decoded.f.map(file => file.i);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired share link' });
    }
};