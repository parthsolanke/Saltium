const authService = require('./authService');

exports.register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { token, user } = await authService.login(req.body);
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        next(error);
    }
};
