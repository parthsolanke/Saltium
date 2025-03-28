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

exports.downloadAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(401).json({ message: 'Download token is required' });
        }

        const decoded = jwtUtils.verifyToken(token);
        // Transform shortened names back to full names
        req.userId = decoded.u;
        req.files = decoded.f.map(file => ({
            id: file.i,
            name: file.n
        }));
        req.fileIds = decoded.f.map(file => file.i);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired download token' });
    }
};