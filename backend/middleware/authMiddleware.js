const jwtUtils = require('../utils/jwtUtils');

module.exports = (req, res, next) => {
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
