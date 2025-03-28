// utils/jwtUtils
const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.generateUserToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, env.jwtSecret, {
        expiresIn: env.jwtExpiration,
    });
};

exports.verifyToken = (token) => {
    return jwt.verify(token, env.jwtSecret);
};

exports.generateFileDownloadToken = ({ userId, files }) => {
    // Transform files array to have shorter property names
    const f = files.map(file => ({
        i: file.id,        // 'i' instead of 'id'
        n: file.name       // 'n' instead of 'name'
    }));

    return jwt.sign(
        { u: userId, f },  // 'u' instead of 'userId', 'f' instead of 'files'
        env.jwtSecret,
        { expiresIn: '1h' }
    );
};