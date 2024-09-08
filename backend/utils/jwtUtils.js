const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
