// auth/authRoutes.js
const express = require('express');
const authController = require('./authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', authMiddleware, authController.updateUserInfo);

module.exports = router;