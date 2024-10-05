// config/privateRouter.js
const { Router } = require('express')
const authRoutes = require('../auth/authRoutes');
const privateFileRoutes = require('../file/privateFileRoutes');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = Router();

router.use('/auth', authRoutes);
router.use('/files', authMiddleware, privateFileRoutes);

module.exports = router;
