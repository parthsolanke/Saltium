const User = require('../models/User');
const jwtUtils = require('../utils/jwtUtils');
const bcrypt = require('bcrypt');

exports.register = async (userData) => {
    const { username, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    return await user.save();
};

exports.login = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid username or password');
    }
    const token = jwtUtils.generateToken(user);
    return { token, user };
};
