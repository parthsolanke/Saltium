// auth/authValidation.js
const { z } = require('zod');

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long').max(30, 'Username must be less than 30 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    email: z.string().email('Invalid email address').optional(),
});

const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const updateUserSchema = z.object({
    username: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateUserSchema,
};
