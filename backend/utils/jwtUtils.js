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

exports.generateFileDownloadToken = (payload) => {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiration });
};