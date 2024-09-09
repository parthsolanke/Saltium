// auth/authController.js
const authService = require('./authService');
const { registerSchema, loginSchema, updateUserSchema } = require('./authValidation');

exports.register = async (req, res, next) => {
    try {
        registerSchema.parse(req.body);
        const user = await authService.register(req.body);
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors });
        } else if (error.message === 'User already exists') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        loginSchema.parse(req.body);
        const { token, user } = await authService.login(req.body);
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        if (error.message === 'Invalid username or password') {
            return res.status(401).json({ message: 'Invalid username or password' });
        } else if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors });
        }
        next(error);
    }
};

exports.updateUserInfo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updatedData = req.body;
        updateUserSchema.parse(updatedData);
        const updatedUser = await authService.updateUserInfo(userId, updatedData);
        res.status(200).json({ message: 'User information updated', user: updatedUser });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors });
        }
        next(error);
    }
};
