const { Router } = require('express')
const authRoutes = require('../auth/authRoutes');
const fileRoutes = require('../file/fileRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const router = Router();

router.use('auth', authRoutes);
router.use('files', authMiddleware, fileRoutes);

module.exports = router;
