// auth/authValidation.js
const { z } = require('zod');

const registerSchema = z.object({
    username: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const loginSchema = z.object({
    username: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const updateUserSchema = z.object({
    username: z.string().email('Invalid email address'),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateUserSchema,
};
