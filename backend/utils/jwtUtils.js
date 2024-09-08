const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, env.jwtSecret, {
        expiresIn: env.jwtExpiration,
    });
};

exports.verifyToken = (token) => {
    return jwt.verify(token, env.jwtSecret);
};
