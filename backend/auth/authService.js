// auth/authService.js
const User = require('../models/User');
const jwtUtils = require('../utils/jwtUtils');
const bcrypt = require('bcrypt');

exports.register = async (userData) => {
    const { username, password } = userData;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    const savedUser = await user.save();
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
};

exports.login = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid username or password');
    }
    const token = jwtUtils.generateUserToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();
    return { token, user: userWithoutPassword };
};

exports.updateUserInfo = async (userId, updatedData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // const originalUser = { ...user.toObject() };
    if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }
    Object.assign(user, updatedData);
    const updatedUser = await user.save();
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
};
